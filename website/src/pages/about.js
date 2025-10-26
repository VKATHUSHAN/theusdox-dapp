import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Enhanced USDOX About Page with full landing features and glass black-blue animated theme
const USDOX_LOGO_URL = 'https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/usdox-logo.png';

export default function About() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 180, 255, 0.6)';
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
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        color: '#fff',
        background: 'radial-gradient(circle at 20% 30%, #001133, #000814)',
        fontFamily: 'Poppins, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.3 }} />

      <motion.header variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative', zIndex: 2 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
          <img src={USDOX_LOGO_URL} alt="TheUSDOX Logo" width={48} height={48} style={{ borderRadius: '50%' }} />
          <div style={{ fontWeight: 700, fontSize: 24 }}>TheUSDOX</div>
        </Link>

        <nav style={{ display: 'flex', gap: 20 }}>
          {[
            { name: 'Home', href: '/' },
            { name: 'Tokenomics', href: '/tokenomics' },
            { name: 'Roadmap', href: '/roadmap' },
            { name: 'Contact', href: '/contact' }
          ].map(item => (
            <Link key={item.name} href={item.href} style={{ color: '#9dd7ff', textDecoration: 'none', fontWeight: 500 }}>
              <motion.div whileHover={{ scale: 1.1 }}>
                {item.name}
              </motion.div>
            </Link>
          ))}
        </nav>
      </motion.header>

      <motion.main variants={fadeUp} style={{ textAlign: 'center', marginTop: 80, zIndex: 2, position: 'relative', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', padding: '0 20px' }}>
        <motion.h1 style={{ fontSize: 48, marginBottom: 24, textShadow: '0 0 25px rgba(0,180,255,0.8)' }}>
          About TheUSDOX
        </motion.h1>

        <motion.p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, marginBottom: 20 }}>
          TheUSDOX is a revolutionary on-chain dollar bringing transparency, speed, and audibility to the decentralized finance ecosystem. Fast, secure, and multi-chain ready, it empowers your DeFi ambitions.
        </motion.p>

        <motion.p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, marginBottom: 40 }}>
          Stake, swap, or hold — interact with DeFi like never before. Community-focused, governance-ready, and built with cutting-edge security audits, TheUSDOX is your key to the future of stable finance.
        </motion.p>

        <motion.div style={{ marginTop: 20, background: 'rgba(0,0,50,0.5)', borderRadius: 20, padding: 30, backdropFilter: 'blur(14px)' }}>
          <motion.h2 style={{ fontSize: 30, color: '#00b3ff', marginBottom: 20 }}>Why USDOX Stands Out</motion.h2>
          <ul style={{ listStyleType: 'none', padding: 0, color: '#fff', fontSize: 16, lineHeight: 1.8 }}>
            <li>💠 Ultra-stable and fully auditable on-chain</li>
            <li>💠 Multi-chain support for seamless DeFi interaction</li>
            <li>💠 Community-driven features and governance-ready</li>
            <li>💠 Advanced staking and yield optimization</li>
            <li>💠 Cutting-edge security audits and risk management</li>
          </ul>
        </motion.div>

        <motion.div style={{ marginTop: 50, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,180,255,0.6)' }}
            style={{ 
              padding: '14px 28px', 
              fontSize: 16, 
              borderRadius: 12, 
              border: 'none', 
              cursor: 'pointer', 
              background: '#00b3ff', 
              color: '#001022', 
              fontWeight: 600 
            }}
          >
            Join Early Access
          </motion.button>
          <Link href="/tokenomics" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              style={{ 
                padding: '14px 28px', 
                fontSize: 16, 
                borderRadius: 12, 
                border: '1px solid #00b3ff', 
                cursor: 'pointer', 
                background: 'transparent', 
                color: '#00b3ff', 
                fontWeight: 600 
              }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </motion.main>

      <motion.footer variants={fadeUp} style={{ position: 'relative', bottom: 0, width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 2, marginTop: 80 }}>
        © 2025 TheUSDOX — On‑Chain Dollar | Designed with 💠 by TheUSDOX Team
      </motion.footer>
    </motion.div>
  );
}