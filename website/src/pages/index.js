import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const USDOX_LOGO_URL = 'https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/usdox-logo.png';

export default function TheUSDOXHome() {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const canvasRef = useRef(null);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setConnectedAddress(accounts[0]);
      } else {
        // Fallback for demo
        setTimeout(() => {
          setConnectedAddress('0xMOCKCONNECT0000000000000000000000000002');
        }, 600);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => setConnectedAddress('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 1.3,
      dy: (Math.random() - 0.5) * 1.3,
      color: `hsl(${Math.random() * 200 + 180}, 80%, 55%)`,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      });
      rafId = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.3, ease: 'easeOut' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        color: '#fff',
        background: 'radial-gradient(circle at 30% 30%, #001133, #000814)',
        fontFamily: 'Poppins, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.45 }} />

      <motion.header variants={fadeUp} style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '30px 20px', 
        position: 'relative', 
        zIndex: 2,
        flexWrap: 'wrap',
        gap: 20
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'inherit' }}>
          <img src={USDOX_LOGO_URL} alt="TheUSDOX Logo" width={58} height={58} style={{ borderRadius: '50%', boxShadow: '0 0 18px #00b3ff' }} />
          <div style={{ fontWeight: 800, fontSize: 30, textShadow: '0 0 15px #00b3ff' }}>TheUSDOX</div>
        </Link>

        <nav style={{ 
          display: 'flex', 
          gap: 25, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { name: 'About', href: '/about' },
            { name: 'Tokenomics', href: '/tokenomics' },
            { name: 'Roadmap', href: '/roadmap' },
            { name: 'Contact', href: '/contact' }
          ].map(item => (
            <Link key={item.name} href={item.href} style={{ color: '#9dd7ff', textDecoration: 'none', fontWeight: 500 }}>
              <motion.div 
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                style={{ padding: '8px 12px', borderRadius: '8px' }}
              >
                {item.name}
              </motion.div>
            </Link>
          ))}
        </nav>

        {connectedAddress ? (
          <button onClick={disconnect} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
            Disconnect
          </button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={connectWallet} 
            disabled={connecting} 
            style={{ 
              padding: '10px 20px', 
              borderRadius: 999, 
              border: 'none', 
              background: 'linear-gradient(90deg,#00b3ff,#0044ff)', 
              color: '#fff', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </motion.button>
        )}
      </motion.header>

      <motion.main variants={fadeUp} style={{ 
        textAlign: 'center', 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 2, 
        position: 'relative', 
        maxWidth: 1000, 
        marginLeft: 'auto', 
        marginRight: 'auto', 
        padding: '60px 20px 40px',
        minHeight: 'calc(100vh - 180px)'
      }}>
        <motion.h1 style={{ 
          fontSize: 'clamp(36px, 8vw, 60px)', 
          fontWeight: 800, 
          marginBottom: 25, 
          textShadow: '0 0 35px rgba(0,180,255,1)',
          lineHeight: 1.2
        }}>
          The On‑Chain Dollar Revolution
        </motion.h1>
        <motion.p style={{ 
          fontSize: 'clamp(16px, 4vw, 20px)', 
          color: 'rgba(255,255,255,0.85)', 
          maxWidth: 700, 
          margin: '0 auto 60px', 
          lineHeight: 1.6,
          paddingBottom: 20
        }}>
          USDOX is a decentralized, transparent, and yield‑bearing stablecoin built to redefine digital finance. Fast, auditable, and powered by the blockchain — where trust meets innovation.
        </motion.p>

        <motion.div style={{ 
          marginTop: 40, 
          display: 'flex', 
          gap: 20, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,180,255,0.6)' }} 
            whileTap={{ scale: 0.98 }} 
            onClick={connectWallet} 
            disabled={connecting} 
            style={{ 
              padding: '14px 32px', 
              borderRadius: 30, 
              border: 'none', 
              background: 'linear-gradient(90deg, #00b3ff, #0055ff)', 
              color: '#fff', 
              fontWeight: 600, 
              cursor: 'pointer', 
              boxShadow: '0 0 20px rgba(0,180,255,0.6)'
            }}
          >
            {connecting ? 'Connecting...' : connectedAddress ? 'Connected' : 'Connect Wallet'}
          </motion.button>

          <motion.a 
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x7BeB51807E3c8BdB10A2868bD51c2D9E1764925D" 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }} 
            style={{ 
              padding: '14px 32px', 
              borderRadius: 30, 
              border: '1px solid #00b3ff', 
              background: 'rgba(0,0,60,0.5)', 
              color: '#00b3ff', 
              fontWeight: 600, 
              cursor: 'pointer', 
              backdropFilter: 'blur(10px)',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Buy Tether USD Wrapped EVM
          </motion.a>
        </motion.div>

        {connectedAddress && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1.2 }} 
            style={{ 
              marginTop: 40, 
              padding: 16, 
              background: 'rgba(255,255,255,0.08)', 
              borderRadius: 12, 
              display: 'inline-block', 
              backdropFilter: 'blur(10px)' 
            }}
          >
            <div style={{ fontSize: 14, color: '#9dd7ff' }}>Connected</div>
            <div style={{ fontFamily: 'monospace', marginTop: 6 }}>
              {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
            </div>
          </motion.div>
        )}
      </motion.main>

      <motion.footer 
        variants={fadeUp} 
        style={{ 
          marginTop: 'auto',
          width: '100%', 
          textAlign: 'center', 
          zIndex: 2,
          padding: '40px 20px 30px',
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(0,180,255,0.2)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 30, 
          marginBottom: 20, 
          flexWrap: 'wrap' 
        }}>
          <motion.a 
            href="https://twitter.com/theusdox" 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ scale: 1.1, color: '#ffffff' }}
            style={{ 
              color: '#00b3ff', 
              textDecoration: 'none', 
              fontSize: 15, 
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
          >
            Twitter
          </motion.a>
          <motion.a 
            href="https://discord.gg/usdox" 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ scale: 1.1, color: '#ffffff' }}
            style={{ 
              color: '#00b3ff', 
              textDecoration: 'none', 
              fontSize: 15, 
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
          >
            Discord
          </motion.a>
          <motion.a 
            href="https://github.com/theusdox" 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ scale: 1.1, color: '#ffffff' }}
            style={{ 
              color: '#00b3ff', 
              textDecoration: 'none', 
              fontSize: 15, 
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
          >
            GitHub
          </motion.a>
          <motion.a 
            href="https://docs.theusdox.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            whileHover={{ scale: 1.1, color: '#ffffff' }}
            style={{ 
              color: '#00b3ff', 
              textDecoration: 'none', 
              fontSize: 15, 
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
          >
            Documentation
          </motion.a>
        </div>
        <div style={{ 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: 14,
          fontWeight: 400
        }}>
          © 2025 TheUSDOX — On‑Chain Dollar Revolution
        </div>
      </motion.footer>
    </motion.div>
  );
}