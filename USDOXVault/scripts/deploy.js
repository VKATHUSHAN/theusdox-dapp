import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Starting deployment of USDOX Vault contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy USDOX Token
  console.log("\n1. Deploying USDOX Token...");
  const USDOX = await ethers.getContractFactory("USDOX");
  const usdox = await USDOX.deploy();
  await usdox.waitForDeployment();
  const usdoxAddress = await usdox.getAddress();
  console.log("USDOX Token deployed to:", usdoxAddress);

  // Deploy PriceOracle
  console.log("\n2. Deploying PriceOracle...");
  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  console.log("PriceOracle deployed to:", priceOracleAddress);

  // Deploy MultiCollateralVault
  console.log("\n3. Deploying MultiCollateralVault...");
  const MultiCollateralVault = await ethers.getContractFactory("MultiCollateralVault");
  const vault = await MultiCollateralVault.deploy(usdoxAddress, priceOracleAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("MultiCollateralVault deployed to:", vaultAddress);

  // Set the vault as the owner of the USDOX token (so it can mint/burn)
  console.log("\n4. Setting up permissions...");
  await usdox.transferOwnership(vaultAddress);
  console.log("USDOX ownership transferred to vault");

  // Display deployment summary
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log("USDOX Token:           ", usdoxAddress);
  console.log("PriceOracle:           ", priceOracleAddress);
  console.log("MultiCollateralVault:  ", vaultAddress);
  console.log("Deployer:              ", deployer.address);
  console.log("=".repeat(50));

  // Verification instructions
  console.log("\n📝 To verify contracts on Etherscan:");
  console.log(`npx hardhat verify --network goerli ${usdoxAddress}`);
  console.log(`npx hardhat verify --network goerli ${priceOracleAddress}`);
  console.log(`npx hardhat verify --network goerli ${vaultAddress} "${usdoxAddress}" "${priceOracleAddress}"`);

  // Save deployment addresses
  const deployment = {
    network: "goerli",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      USDOX: usdoxAddress,
      PriceOracle: priceOracleAddress,
      MultiCollateralVault: vaultAddress
    }
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deployment, null, 2)
  );
  console.log("\n💾 Deployment details saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });