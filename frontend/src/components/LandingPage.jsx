import React, { useEffect, useState } from 'react';

export default function LandingPage({ onStart }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#fcfcfc',
      backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      color: '#111827',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 20px 40px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      <style>{`
        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-2deg); }
        }

        .animate-fade {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.4s; }

        /* Typography */
        .hero-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 700;
          text-align: center;
          line-height: 1.1;
          letter-spacing: -0.03em;
          max-width: 900px;
          margin-bottom: 24px;
          position: relative;
          z-index: 10;
        }

        .text-gray-light {
          color: #9ca3af;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: #6b7280;
          text-align: center;
          max-width: 600px;
          margin-bottom: 40px;
          font-weight: 400;
          line-height: 1.6;
          position: relative;
          z-index: 10;
        }

        /* Call to Action Button */
        .btn-cta {
          background: #3b82f6; /* Blue */
          color: white;
          border: none;
          padding: 16px 40px;
          font-size: 1.1rem;
          font-weight: 500;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
          position: relative;
          z-index: 10;
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -5px rgba(59, 130, 246, 0.5);
          background: #2563eb;
        }

        /* Floating Element Styles */
        .floating-element {
          position: absolute;
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid rgba(229, 231, 235, 0.5);
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: box-shadow 0.3s ease;
        }

        .floating-element:hover {
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.12);
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #f3f4f6;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.02);
        }

        .feat-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
        }

        .feat-desc {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Placement of floating elements */
        .el-top-left {
          top: 15%;
          left: 5%;
          width: 280px;
          animation: floatSlow 8s ease-in-out infinite;
          transform: rotate(-3deg);
        }

        .el-top-right {
          top: 10%;
          right: 5%;
          width: 300px;
          animation: floatReverse 9s ease-in-out infinite;
          transform: rotate(2deg);
        }

        .el-bottom-left {
          bottom: -15%;
          left: 8%;
          width: 320px;
          animation: floatReverse 10s ease-in-out infinite;
          transform: rotate(1deg);
        }

        .el-bottom-right {
          bottom: -10%;
          right: 8%;
          width: 280px;
          animation: floatSlow 7s ease-in-out infinite;
          transform: rotate(-2deg);
        }

        /* Small Logo Icon center */
        .center-logo-box {
          width: 70px;
          height: 70px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,1);
          font-size: 2.2rem;
          position: relative;
          z-index: 10;
        }

        /* Documentation Section (Below Fold) */
        .doc-section {
          width: 100%;
          max-width: 1100px;
          margin-top: clamp(150px, 20vh, 250px); /* Push down so floating elements have space */
          padding: 40px 20px;
          position: relative;
          z-index: 20;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.05);
        }
        
        .doc-title {
          font-size: 2.2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          letter-spacing: -0.02em;
          color: #111827;
        }

        .doc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }
        
        .doc-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 32px;
          transition: all 0.3s ease;
        }
        
        .doc-card:hover {
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.06);
          transform: translateY(-4px);
        }
        
        .doc-card h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }
        
        .doc-card p {
          color: #6b7280;
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 20px;
        }
        
        .light-badge {
          display: inline-block;
          background: #f3f4f6;
          color: #4b5563;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-right: 8px;
          margin-bottom: 8px;
          border: 1px solid #e5e7eb;
        }

        .badge-blue { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }
        .badge-green { background: #f0fdf4; color: #16a34a; border-color: #dcfce3; }
        .badge-purple { background: #faf5ff; color: #9333ea; border-color: #f3e8ff; }

        @media (max-width: 1024px) {
          .floating-element { position: relative; width: 100%; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; animation: none; transform: none !important; margin-bottom: 20px; }
          .hero-container { margin-bottom: 40px; }
          .doc-section { margin-top: 40px; }
          .floating-wrapper { display: flex; flex-direction: column; width: 100%; max-width: 600px; padding: 0 20px; margin-top: 40px; }
        }
      `}</style>

      {isVisible && (
        <>
          <div className="center-logo-box animate-fade">
            🔐
          </div>

          <div className="hero-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="animate-fade delay-1 hero-title">
              Explorez la cryptographie, <br/>
              <span className="text-gray-light">tout en un seul endroit</span>
            </h1>
            
            <p className="animate-fade delay-2 hero-subtitle">
              Générez, chiffrez, hachez et signez vos documents de manière sécurisée avec BouncyCastle et Spring Security.
            </p>

            <button className="btn-cta animate-fade delay-3" onClick={onStart}>
              Commencer maintenant
            </button>
          </div>

          {/* Desktop Floating Elements OR Mobile Stacked Elements */}
          <div className="floating-wrapper animate-fade delay-3">
            {/* Top Left - KeyGen */}
            <div className="floating-element el-top-left">
              <div className="icon-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box" style={{ color: '#3b82f6' }}>🗝️</div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>RSA / AES</span>
              </div>
              <h3 className="feat-title">Génération de clés</h3>
              <p className="feat-desc">Gérez vos paires de clés asymétriques et vos clés secrètes avec des standards cryptographiques stricts.</p>
            </div>

            {/* Top Right - Cipher */}
            <div className="floating-element el-top-right">
              <div className="icon-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box" style={{ color: '#8b5cf6' }}>🛡️</div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>CBC / GCM</span>
              </div>
              <h3 className="feat-title">Chiffrement absolu</h3>
              <p className="feat-desc">Protégez vos données sensibles via des algorithmes robustes contre toute tentative de cryptanalyse.</p>
              <div style={{ background: '#f3f4f6', height: '6px', borderRadius: '4px', width: '70%', marginTop: '8px' }}>
                <div style={{ background: '#8b5cf6', height: '100%', borderRadius: '4px', width: '100%' }}></div>
              </div>
            </div>

            {/* Bottom Left - Hash */}
            <div className="floating-element el-bottom-left">
              <div className="icon-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box" style={{ color: '#10b981' }}>🔏</div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>SHA-256</span>
              </div>
              <h3 className="feat-title">Empreintes (Hash)</h3>
              <p className="feat-desc">Calculez des empreintes irréversibles pour certifier l'intégrité de vos fichiers les plus lourds.</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <div style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#dcfce3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: '12px' }}>✓</div>
                <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px' }}></div>
              </div>
            </div>

            {/* Bottom Right - Signature */}
            <div className="floating-element el-bottom-right">
              <div className="icon-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box" style={{ color: '#f59e0b' }}>✍️</div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>X.509</span>
              </div>
              <h3 className="feat-title">Signature Numérique</h3>
              <p className="feat-desc">Authentifiez formellement l'émetteur d'un document pour garantir sa non-répudiation.</p>
            </div>
          </div>

          {/* --- DOCUMENTATION DETAILLEE --- */}
          <div className="doc-section animate-fade delay-3">
            <h2 className="doc-title">Protocoles et Implémentations</h2>
            
            <div className="doc-grid">
              <div className="doc-card">
                <h4>Cryptographie Symétrique</h4>
                <p>
                  Chiffrement ultra-rapide nécessitant le partage d'une clé secrète. Propulsé par <strong>BouncyCastle</strong> et l'API JCA.
                </p>
                <div>
                  <span className="light-badge badge-blue">AES-256</span>
                  <span className="light-badge">Mode GCM (AEAD)</span>
                  <span className="light-badge">PKCS7 Padding</span>
                </div>
              </div>

              <div className="doc-card">
                <h4>Cryptographie Asymétrique</h4>
                <p>
                  Infrastructure PKI avec clé Publique (chiffrement) et clé Privée (déchiffrement). Essentiel pour l'échange de clés de session.
                </p>
                <div>
                  <span className="light-badge badge-purple">RSA-2048</span>
                  <span className="light-badge badge-purple">RSA-4096</span>
                  <span className="light-badge">OAEP Padding</span>
                </div>
              </div>

              <div className="doc-card">
                <h4>Hachage & Intégrité</h4>
                <p>
                  Fonctions mathématiques à sens unique produisant un Digest de taille fixe. Optimisé pour le traitement en flux (Stream).
                </p>
                <div>
                  <span className="light-badge badge-green">SHA-256</span>
                  <span className="light-badge badge-green">SHA-512</span>
                  <span className="light-badge">Avalanche Effect</span>
                </div>
              </div>

              <div className="doc-card">
                <h4>Signature & HMAC</h4>
                <p>
                  Combinaison du hachage et du chiffrement (Clé Privée) pour garantir simultanément l'intégrité et l'authentification.
                </p>
                <div>
                  <span className="light-badge">HMAC-SHA256</span>
                  <span className="light-badge badge-purple">SHA256withRSA</span>
                  <span className="light-badge">JWT Token</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-fade delay-3" style={{ marginTop: '3rem', color: '#9ca3af', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} CryptoJava — Plateforme Éducative
          </div>
        </>
      )}
    </div>
  );
}
