import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const USDOX_LOGO_URL = 'https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/usdox-logo.png';

export default function Contact() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
      color: `hsl(${Math.random() * 200 + 180}, 80%, 50%)`,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        color: '#fff',
        background: 'radial-gradient(circle at 25% 30%, #001133, #000814)',
        fontFamily: 'Poppins, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.4 }} />

      <motion.header variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', position: 'relative', zIndex: 2 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}>
          <img src={USDOX_LOGO_URL} alt="TheUSDOX Logo" width={50} height={50} style={{ borderRadius: '50%', boxShadow: '0 0 15px #00b3ff' }} />
          <div style={{ fontWeight: 800, fontSize: 26, textShadow: '0 0 12px #00b3ff' }}>TheUSDOX</div>
        </Link>

        <nav style={{ display: 'flex', gap: 20 }}>
          {[
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
            { name: 'Tokenomics', href: '/tokenomics' },
            { name: 'Roadmap', href: '/roadmap' }
          ].map(item => (
            <Link key={item.name} href={item.href} style={{ color: '#9dd7ff', textDecoration: 'none', fontWeight: 500 }}>
              <motion.div whileHover={{ scale: 1.1 }}>
                {item.name}
              </motion.div>
            </Link>
          ))}
        </nav>
      </motion.header>

      <motion.main variants={fadeUp} style={{ textAlign: 'center', marginTop: 100, zIndex: 2, position: 'relative', maxWidth: 950, marginLeft: 'auto', marginRight: 'auto', padding: '0 20px' }}>
        <motion.h1 style={{ fontSize: 52, marginBottom: 28, textShadow: '0 0 30px rgba(0,180,255,0.9)' }}>
          Contact Us
        </motion.h1>

        <motion.div style={{ background: 'rgba(0,0,60,0.55)', borderRadius: 24, padding: 35, backdropFilter: 'blur(16px)', boxShadow: '0 0 25px rgba(0,180,255,0.4)' }}>
          <motion.h2 style={{ fontSize: 32, color: '#00b3ff', marginBottom: 22 }}>Get in Touch</motion.h2>
          
          <div style={{ display: 'grid', gap: 20, textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ padding: 20, background: 'rgba(0,0,40,0.3)', borderRadius: 16, border: '1px solid rgba(0,180,255,0.2)' }}>
              <h3 style={{ color: '#00b3ff', marginBottom: 10, fontSize: 18 }}>📧 Email</h3>
              <a href="mailto:hello@theusdox.com" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>
                hello@theusdox.com
              </a>
            </div>

            <div style={{ padding: 20, background: 'rgba(0,0,40,0.3)', borderRadius: 16, border: '1px solid rgba(0,180,255,0.2)' }}>
              <h3 style={{ color: '#00b3ff', marginBottom: 10, fontSize: 18 }}>📍 Head Office</h3>
              <p style={{ color: '#fff', margin: 0, fontSize: 16 }}>Los Angeles, California, USA</p>
            </div>

            <div style={{ padding: 20, background: 'rgba(0,0,40,0.3)', borderRadius: 16, border: '1px solid rgba(0,180,255,0.2)' }}>
              <h3 style={{ color: '#00b3ff', marginBottom: 10, fontSize: 18 }}>📍 Business Office</h3>
              <p style={{ color: '#fff', margin: 0, fontSize: 16 }}>Business Bay, Dubai, UAE</p>
            </div>

            <div style={{ padding: 20, background: 'rgba(0,0,40,0.3)', borderRadius: 16, border: '1px solid rgba(0,180,255,0.2)' }}>
              <h3 style={{ color: '#00b3ff', marginBottom: 10, fontSize: 18 }}>💬 WhatsApp</h3>
              <a href="https://wa.me/14243967286" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>
                +1 424 396 7286
              </a>
            </div>
          </div>

          <div style={{ marginTop: 40, padding: 30, background: 'rgba(0,50,100,0.3)', borderRadius: 20, border: '1px solid rgba(0,180,255,0.3)' }}>
            <h3 style={{ color: '#00b3ff', marginBottom: 20, fontSize: 24 }}>Join Our Community</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
              <motion.a 
                href="https://t.me/theusdox" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                style={{ 
                  color: '#00b3ff', 
                  textDecoration: 'none', 
                  fontWeight: 600, 
                  fontSize: 18,
                  padding: '10px 20px',
                  border: '1px solid #00b3ff',
                  borderRadius: 25,
                  background: 'rgba(0,180,255,0.1)'
                }}
              >
                📱 Telegram
              </motion.a>
              <motion.a 
                href="https://x.com/TheUSDOXs" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                style={{ 
                  color: '#00b3ff', 
                  textDecoration: 'none', 
                  fontWeight: 600, 
                  fontSize: 18,
                  padding: '10px 20px',
                  border: '1px solid #00b3ff',
                  borderRadius: 25,
                  background: 'rgba(0,180,255,0.1)'
                }}
              >
                🐦 X (Twitter)
              </motion.a>
              <motion.a 
                href="https://github.com/theusdox" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                style={{ 
                  color: '#00b3ff', 
                  textDecoration: 'none', 
                  fontWeight: 600, 
                  fontSize: 18,
                  padding: '10px 20px',
                  border: '1px solid #00b3ff',
                  borderRadius: 25,
                  background: 'rgba(0,180,255,0.1)'
                }}
              >
                💻 GitHub
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.main>

      <motion.footer variants={fadeUp} style={{ position: 'relative', bottom: 0, width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 14, zIndex: 2, marginTop: 100 }}>
        <p style={{ marginTop: 14 }}>© 2025 TheUSDOX — On‑Chain Dollar | Crafted with 💠 & 🔥 by TheUSDOX Team</p>
      </motion.footer>
    </motion.div>
  );
}