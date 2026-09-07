import React, { useEffect, useState } from 'react';

export default function LandingPage({ onStart }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Léger délai pour s'assurer que l'animation se lance proprement après le montage
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: '"Inter", sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background glow effects (Orbes lumineux) */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.8); }
          100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Staggered delays pour faire apparaître les éléments un par un */
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.5s; }
        .delay-5 { animation-delay: 0.6s; }
        .delay-6 { animation-delay: 0.8s; }
        
        .gradient-text {
          background: linear-gradient(to right, #22d3ee, #818cf8, #c084fc, #22d3ee);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 4s linear infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        
        /* Effet de reflet (Sweep) sur les cartes */
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
          transform: skewX(-20deg);
          transition: all 0.7s ease;
        }

        .glass-card:hover {
          transform: translateY(-15px) scale(1.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border: 1px solid rgba(6, 182, 212, 0.5);
        }
        
        .glass-card:hover::before {
          left: 200%;
        }

        .bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.3;
          z-index: 0;
          animation: float 12s ease-in-out infinite;
        }
        .bg-glow-1 { top: -200px; left: -200px; background: rgba(6, 182, 212, 1); }
        .bg-glow-2 { bottom: -200px; right: -200px; background: rgba(99, 102, 241, 1); animation-delay: -6s; }

        .btn-modern {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          color: #fff;
          border: none;
          padding: 18px 48px;
          font-size: 1.15rem;
          font-weight: 700;
          border-radius: 40px;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: pulseGlow 2s infinite;
        }
        .btn-modern:hover {
          transform: scale(1.1);
        }

        /* Responsive Design */
        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          margin-bottom: 1rem;
          text-align: center;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #94a3b8;
          text-align: center;
          max-width: 650px;
          margin-bottom: clamp(2rem, 5vw, 4rem);
          line-height: 1.6;
          padding: 0 15px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1000px;
          margin-bottom: clamp(2rem, 5vw, 4rem);
          padding: 0 15px;
        }

        @media (max-width: 768px) {
          .bg-glow {
            width: 300px;
            height: 300px;
          }
          .btn-modern {
            padding: 14px 32px;
            font-size: 1rem;
          }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {isVisible && (
          <>
            <h1 className="animate-slide-up hero-title">
              Bienvenue sur <span className="gradient-text">CryptoJava</span>
            </h1>
            
            <p className="animate-slide-up delay-1 hero-subtitle">
              Une plateforme éducative pour maîtriser les concepts fondamentaux de la cryptographie moderne.
            </p>

            <div className="cards-grid">
              <div className="glass-card animate-slide-up delay-2">
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>🗝️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Génération de clés</h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5 }}>Créez et gérez des clés symétriques (AES) et asymétriques (RSA).</p>
              </div>

              <div className="glass-card animate-slide-up delay-3">
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>🔐</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Chiffrement</h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5 }}>Protégez vos données avec des algorithmes robustes.</p>
              </div>

              <div className="glass-card animate-slide-up delay-4">
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>🔏</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Hachage</h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5 }}>Calculez l'empreinte numérique de vos documents (SHA-256).</p>
              </div>

              <div className="glass-card animate-slide-up delay-5">
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>📝</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Signature</h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5 }}>Authentifiez et garantissez l'intégrité de vos fichiers.</p>
              </div>
            </div>

            <div className="animate-slide-up delay-6">
              <button className="btn-modern" onClick={onStart}>
                Démarrer l'expérience
              </button>
            </div>
            
            {/* Signature Étudiant */}
            <div className="animate-slide-up delay-6" style={{ marginTop: '5rem', opacity: 0.7, fontSize: '0.95rem', letterSpacing: '1px' }}>
              Projet réalisé par <strong style={{ color: '#22d3ee', fontWeight: 800 }}>Ngouye GNING</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
