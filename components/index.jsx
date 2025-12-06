import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const IconGrid = () => {
  const icons = [
    { name: 'JavaScript', color: '#F7DF1E', symbol: 'JS' },
    { name: 'TypeScript', color: '#3178C6', symbol: 'TS' },
    { name: 'HTML5', color: '#E34F26', symbol: 'H' },
    { name: 'CSS3', color: '#1572B6', symbol: 'C' },
    { name: 'Sass', color: '#CC6699', symbol: 'S' },
    { name: 'React', color: '#61DAFB', symbol: 'R' },
    { name: 'Node.js', color: '#339933', symbol: 'N' },
    { name: 'Express', color: '#000000', symbol: 'E' },
    { name: 'MongoDB', color: '#47A248', symbol: 'M' },
    { name: 'PostgreSQL', color: '#336791', symbol: 'P' },
    { name: 'Docker', color: '#2496ED', symbol: 'D' },
    { name: 'AWS', color: '#232F3E', symbol: 'A' },
    { name: 'Git', color: '#F05032', symbol: 'G' },
    { name: 'GitHub', color: '#181717', symbol: 'GH' },
    { name: 'VS Code', color: '#007ACC', symbol: 'VS' },
    { name: 'Figma', color: '#F24E1E', symbol: 'F' },
    { name: 'Webpack', color: '#8DD6F9', symbol: 'W' },
    { name: 'Next.js', color: '#000000', symbol: 'NX' },
    { name: 'Vue.js', color: '#4FC08D', symbol: 'V' },
    { name: 'Angular', color: '#DD0031', symbol: 'A' },
    { name: 'Python', color: '#3776AB', symbol: 'PY' },
    { name: 'GraphQL', color: '#E10098', symbol: 'GQL' },
    { name: 'Redis', color: '#DC382D', symbol: 'RD' },
    { name: 'Firebase', color: '#FFCA28', symbol: 'FB' }
  ];

  return (
    <div className="icon-grid">
      {icons.map((icon, index) => (
        <div
          key={index}
          className="icon-cube"
          style={{
            '--bg-color': icon.color,
            animationDelay: `${index * 0.1}s`
          }}
        >
          <div className="icon-face icon-top"></div>
          <div className="icon-face icon-front">
            <span className="icon-symbol">{icon.symbol}</span>
          </div>
          <div className="icon-face icon-right"></div>
        </div>
      ))}
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <nav className="mobile-nav">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </div>
  );
};

export default function HomeSample() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Naresh Khatri - Full Stack Web Developer</title>
        <meta name="description" content="Full Stack Web Developer specializing in modern web technologies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <header className="header">
          <div className="logo">naresh khatri</div>
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
          >
            menu ≡
          </button>
        </header>

        <div className="hero-section">
          <div className="hero-content">
            <p className="intro-text">Hi, I am</p>
            <h1 className="main-title">
              Naresh<br />
              Khatri
            </h1>
            <p className="subtitle">A Full Stack Web Developer</p>
            
            <div className="cta-buttons">
              <button className="btn btn-primary">
                📄 Resume
              </button>
              <button className="btn btn-secondary">
                🐦 Twitter
              </button>
              <button className="btn btn-secondary">
                💼 LinkedIn
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <IconGrid />
          </div>
        </div>

        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0c1426 0%, #1a2332 50%, #0f1419 100%);
          color: white;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .container {
          min-height: 100vh;
          padding: 0 2rem;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          position: relative;
          z-index: 10;
        }

        .logo {
          font-size: 1.1rem;
          font-weight: 500;
          color: #ffffff;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          min-height: calc(100vh - 200px);
          gap: 4rem;
        }

        .hero-content {
          max-width: 500px;
        }

        .intro-text {
          font-size: 1.2rem;
          color: #8892b0;
          margin-bottom: 1rem;
        }

        .main-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 0.9;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #64ffda 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.3rem;
          color: #8892b0;
          margin-bottom: 3rem;
          font-weight: 300;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #64ffda 0%, #4ecdc4 100%);
          color: #0a192f;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .btn-primary:hover {
          box-shadow: 0 10px 30px rgba(100, 255, 218, 0.3);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          transform: rotateX(15deg) rotateY(-15deg);
          animation: float 6s ease-in-out infinite;
        }

        .icon-cube {
          width: 48px;
          height: 48px;
          position: relative;
          transform-style: preserve-3d;
          animation: iconPop 0.6s ease-out forwards;
          opacity: 0;
        }

        .icon-face {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-top {
          background: linear-gradient(135deg, 
            color-mix(in srgb, var(--bg-color) 70%, white 30%) 0%, 
            var(--bg-color) 100%);
          transform: rotateX(90deg) translateZ(24px);
        }

        .icon-front {
          background: var(--bg-color);
          transform: translateZ(24px);
        }

        .icon-right {
          background: linear-gradient(135deg, 
            color-mix(in srgb, var(--bg-color) 60%, black 40%) 0%, 
            color-mix(in srgb, var(--bg-color) 80%, black 20%) 100%);
          transform: rotateY(90deg) translateZ(24px);
        }

        .icon-symbol {
          font-size: 12px;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          background: rgba(12, 20, 38, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-content {
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          align-self: flex-end;
          margin-bottom: 2rem;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .mobile-nav a {
          color: white;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .mobile-nav a:hover {
          color: #64ffda;
        }

        @keyframes float {
          0%, 100% { transform: rotateX(15deg) rotateY(-15deg) translateY(0px); }
          50% { transform: rotateX(15deg) rotateY(-15deg) translateY(-10px); }
        }

        @keyframes iconPop {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
            padding-top: 2rem;
          }

          .hero-visual {
            order: -1;
          }

          .icon-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.3rem;
            scale: 0.8;
          }

          .icon-cube {
            width: 36px;
            height: 36px;
          }

          .icon-face {
            width: 36px;
            height: 36px;
          }

          .icon-top {
            transform: rotateX(90deg) translateZ(18px);
          }

          .icon-front {
            transform: translateZ(18px);
          }

          .icon-right {
            transform: rotateY(90deg) translateZ(18px);
          }

          .main-title {
            font-size: clamp(2.5rem, 12vw, 4rem);
          }

          .container {
            padding: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .cta-buttons {
            justify-content: center;
          }
          
          .btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}