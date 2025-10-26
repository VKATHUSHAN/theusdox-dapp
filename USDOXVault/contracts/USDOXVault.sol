// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============ Imports ============
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// =====================================
// USDOX - Mintable ERC20 token
// =====================================
contract USDOX is ERC20, Ownable {
    constructor() ERC20("USDOX On-Chain Dollar", "USDOX") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

// =====================================
// PriceOracle - wraps Chainlink feeds
// =====================================
contract PriceOracle is Ownable {
    using SafeERC20 for IERC20;

    mapping(address => AggregatorV3Interface) public feeds;

    /// @notice Set price feed for token (token address -> Chainlink aggregator)
    function setFeed(address token, address feed) external onlyOwner {
        feeds[token] = AggregatorV3Interface(feed);
    }

    /// @notice Get latest price from Chainlink
    function getLatestPrice(address token) external view returns (uint256 price, uint8 decimals) {
        AggregatorV3Interface aggregator = feeds[token];
        require(address(aggregator) != address(0), "Feed not set");
        (, int256 answer,,,) = aggregator.latestRoundData();
        require(answer > 0, "Price <= 0");
        price = uint256(answer);
        decimals = aggregator.decimals();
    }
}

// =====================================
// MultiCollateralVault - deposit / borrow / liquidate
// =====================================
contract MultiCollateralVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    USDOX public usdox;
    PriceOracle public priceOracle;

    struct Collateral {
        bool enabled;
        uint256 collateralRatio; // e.g., 150 = 150%
        uint8 decimals;
    }

    mapping(address => Collateral) public collaterals;
    mapping(address => mapping(address => uint256)) public deposits; // user => token => amount
    mapping(address => uint256) public debt; // user debt in USDOX

    uint256 public liquidationPenalty = 105; // 105%

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, address token, uint256 collateralSeized);

    constructor(address _usdox, address _priceOracle) {
        usdox = USDOX(_usdox);
        priceOracle = PriceOracle(_priceOracle);
    }

    // ===== Admin =====
    function setCollateral(address token, bool enabled, uint256 collateralRatio, uint8 decimals) external onlyOwner {
        require(collateralRatio >= 100, "ratio < 100");
        collaterals[token] = Collateral(enabled, collateralRatio, decimals);
    }

    function setPriceOracle(address _oracle) external onlyOwner {
        priceOracle = PriceOracle(_oracle);
    }

    function setLiquidationPenalty(uint256 _penalty) external onlyOwner {
        require(_penalty >= 100 && _penalty <= 150, "penalty out of range");
        liquidationPenalty = _penalty;
    }

    // ===== User Actions =====
    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        Collateral memory c = collaterals[token];
        require(c.enabled, "token not supported");

        deposits[msg.sender][token] += amount;
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount, address[] calldata tokenList) external nonReentrant {
        require(amount > 0, "zero");
        require(deposits[msg.sender][token] >= amount, "insufficient deposit");
        deposits[msg.sender][token] -= amount;
        require(_isHealthyList(msg.sender, tokenList), "undercollateralized");

        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, token, amount);
    }

    function borrow(uint256 amount, address[] calldata tokenList) external nonReentrant {
        require(amount > 0, "zero");
        uint256 maxBorrow = maxBorrowForList(msg.sender, tokenList);
        require(debt[msg.sender] + amount <= maxBorrow, "exceeds borrow limit");

        debt[msg.sender] += amount;
        usdox.mint(msg.sender, amount);

        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        require(debt[msg.sender] >= amount, "repay > debt");

        IERC20(address(usdox)).safeTransferFrom(msg.sender, address(this), amount);
        usdox.burn(address(this), amount);

        debt[msg.sender] -= amount;
        emit Repaid(msg.sender, amount);
    }

    // ===== Liquidation =====
    function liquidate(address user, uint256 repayAmount, address seizeToken) external nonReentrant {
        require(repayAmount > 0, "zero");
        require(!_isHealthyList(user, _listOfSupported()), "position healthy");
        require(collaterals[seizeToken].enabled, "invalid seize token");

        uint256 penaltyed = (repayAmount * liquidationPenalty) / 100;
        (uint256 price, uint8 priceDecimals) = priceOracle.getLatestPrice(seizeToken);
        Collateral memory c = collaterals[seizeToken];
        uint256 priceScaled = price * (10 ** (18 - priceDecimals));
        uint256 tokenAmount = (penaltyed * (10 ** c.decimals)) / priceScaled;

        require(deposits[user][seizeToken] >= tokenAmount, "not enough collateral");

        IERC20(address(usdox)).safeTransferFrom(msg.sender, address(this), repayAmount);
        usdox.burn(address(this), repayAmount);

        deposits[user][seizeToken] -= tokenAmount;
        IERC20(seizeToken).safeTransfer(msg.sender, tokenAmount);

        if (debt[user] <= repayAmount) debt[user] = 0;
        else debt[user] -= repayAmount;

        emit Liquidated(user, msg.sender, repayAmount, seizeToken, tokenAmount);
    }

    // ===== Views =====
    function totalCollateralValueForList(address user, address[] calldata tokenList) public view returns (uint256 totalValueUSD18) {
        for (uint256 i = 0; i < tokenList.length; i++) {
            address t = tokenList[i];
            Collateral memory c = collaterals[t];
            if (!c.enabled) continue;
            uint256 amount = deposits[user][t];
            if (amount == 0) continue;
            (uint256 price, uint8 priceDecimals) = priceOracle.getLatestPrice(t);
            if (price == 0) continue;

            uint256 priceScaled = price * (10 ** (18 - priceDecimals));
            uint256 amountIn1e18 = amount * (10 ** (18 - c.decimals));
            uint256 value = (amountIn1e18 * priceScaled) / 1e18;
            totalValueUSD18 += value;
        }
    }

    function maxBorrowForList(address user, address[] calldata tokenList) public view returns (uint256 allowed) {
        uint256 totalAllowedUSD18 = 0;
        for (uint256 i = 0; i < tokenList.length; i++) {
            address t = tokenList[i];
            Collateral memory c = collaterals[t];
            if (!c.enabled) continue;
            uint256 amount = deposits[user][t];
            if (amount == 0) continue;
            (uint256 price, uint8 priceDecimals) = priceOracle.getLatestPrice(t);
            if (price == 0) continue;

            uint256 priceScaled = price * (10 ** (18 - priceDecimals));
            uint256 amountIn1e18 = amount * (10 ** (18 - c.decimals));
            uint256 valueUSD18 = (amountIn1e18 * priceScaled) / 1e18;
            uint256 allowedFromToken = (valueUSD18 * 100) / c.collateralRatio;
            totalAllowedUSD18 += allowedFromToken;
        }
        allowed = totalAllowedUSD18;
    }

    function _isHealthyList(address user, address[] calldata tokenList) internal view returns (bool) {
        return debt[user] <= maxBorrowForList(user, tokenList);
    }

    // Emergency recover ERC20
    function recoverERC20(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    // List of supported tokens for BSC Testnet
    function _listOfSupported() internal pure returns (address[] memory tokens) {
        tokens = new address[](3);
        tokens[0] = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd; // WBNB (Testnet)
        tokens[1] = 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7; // BUSD (Testnet)
        tokens[2] = 0x8BaBbB98678facC7342735486C851ABD7A0d17Ca; // ETH (Testnet)
    }
}