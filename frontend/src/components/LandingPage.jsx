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
      backgroundSize: '24px 24px',
      color: '#111827',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 20px 60px',
      overflowX: 'hidden'
    }}>
      
      <style>{`
        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        /* Typography */
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          text-align: center;
          line-height: 1.15;
          letter-spacing: -0.03em;
          max-width: 900px;
          margin: 0 auto 24px;
        }

        .text-gray-light {
          color: #9ca3af;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: #6b7280;
          text-align: center;
          max-width: 650px;
          margin: 0 auto 40px;
          font-weight: 400;
          line-height: 1.6;
        }

        /* Call to Action Button */
        .btn-cta {
          background: #3b82f6; 
          color: white;
          border: none;
          padding: 16px 48px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
          display: inline-block;
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -5px rgba(59, 130, 246, 0.5);
          background: #2563eb;
        }

        /* Cards Layout */
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          width: 100%;
          max-width: 1200px;
          margin-top: 60px;
        }
        
        /* Staggered effect for desktop */
        @media (min-width: 768px) {
          .card-stagger-down {
            transform: translateY(40px);
          }
        }

        .floating-element {
          background: #ffffff;
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02);
          border: 1px solid rgba(229, 231, 235, 0.6);
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
          height: 100%;
        }

        .floating-element:hover {
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1);
          transform: translateY(-5px);
        }

        .icon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .icon-box {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          background: #f3f4f6;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.02);
        }

        .feat-badge {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f9fafb;
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid #f3f4f6;
        }

        .feat-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .feat-desc {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Documentation Section */
        .doc-section {
          width: 100%;
          max-width: 1200px;
          margin-top: 120px;
          padding: 60px 40px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1px solid rgba(229, 231, 235, 0.8);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .doc-section {
            padding: 40px 20px;
            margin-top: 80px;
          }
        }
        
        .doc-title {
          font-size: 2.2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 3rem;
          letter-spacing: -0.02em;
          color: #111827;
        }

        .doc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }
        
        .doc-card {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
        }
        
        .doc-card:hover {
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.06);
          border-color: #e5e7eb;
        }
        
        .doc-card h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        
        .doc-card p {
          color: #6b7280;
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 24px;
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
      `}</style>

      {isVisible && (
        <>
          <div style={{ marginTop: '80px', marginBottom: '40px' }} className="animate-fade">
            <div style={{
              width: '80px', height: '80px', margin: '0 auto', background: 'white',
              borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,1)',
              fontSize: '2.5rem'
            }}>
              🛡️
            </div>
          </div>

          <div style={{ width: '100%', textAlign: 'center', padding: '0 20px' }}>
            <h1 className="animate-fade delay-1 hero-title">
              Explorez la cryptographie, <br/>
              <span className="text-gray-light">tout en un seul endroit</span>
            </h1>
            
            <p className="animate-fade delay-2 hero-subtitle">
              Générez, chiffrez, hachez et signez vos documents de manière ultra-sécurisée grâce à BouncyCastle et Spring Security.
            </p>

            <div className="animate-fade delay-3">
              <button className="btn-cta" onClick={onStart}>
                Commencer maintenant
              </button>
            </div>
          </div>

          {/* Cards Grid - Structured and Staggered */}
          <div className="cards-container animate-fade delay-4">
            
            {/* Card 1 */}
            <div className="floating-element">
              <div className="icon-header">
                <div className="icon-box">🗝️</div>
                <span className="feat-badge">RSA / AES</span>
              </div>
              <h3 className="feat-title">Génération de clés</h3>
              <p className="feat-desc">Gérez vos paires de clés asymétriques et vos clés secrètes selon les derniers standards cryptographiques de l'industrie.</p>
            </div>

            {/* Card 2 - Staggered */}
            <div className="floating-element card-stagger-down">
              <div className="icon-header">
                <div className="icon-box" style={{ background: '#eff6ff' }}>🔒</div>
                <span className="feat-badge" style={{ color: '#2563eb' }}>CBC / GCM</span>
              </div>
              <h3 className="feat-title">Chiffrement absolu</h3>
              <p className="feat-desc">Protégez la confidentialité de vos données sensibles via des algorithmes robustes contre toute tentative de cryptanalyse.</p>
            </div>

            {/* Card 3 */}
            <div className="floating-element">
              <div className="icon-header">
                <div className="icon-box" style={{ background: '#f0fdf4' }}>🔏</div>
                <span className="feat-badge" style={{ color: '#16a34a' }}>SHA-256</span>
              </div>
              <h3 className="feat-title">Empreintes (Hash)</h3>
              <p className="feat-desc">Calculez des empreintes irréversibles pour certifier mathématiquement l'intégrité de vos fichiers les plus lourds.</p>
            </div>

            {/* Card 4 - Staggered */}
            <div className="floating-element card-stagger-down">
              <div className="icon-header">
                <div className="icon-box" style={{ background: '#fffbeb' }}>✍️</div>
                <span className="feat-badge" style={{ color: '#d97706' }}>X.509</span>
              </div>
              <h3 className="feat-title">Signature Numérique</h3>
              <p className="feat-desc">Authentifiez formellement l'émetteur d'un document pour garantir sa non-répudiation et sa provenance.</p>
            </div>
          </div>

          {/* --- DOCUMENTATION DETAILLEE --- */}
          <div className="doc-section animate-fade delay-4">
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
                  Infrastructure PKI avec clé Publique (chiffrement) et clé Privée (déchiffrement). Essentiel pour l'échange de clés.
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
                  Fonctions mathématiques à sens unique produisant un Digest de taille fixe. Optimisé pour le traitement en flux.
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
          
          <div className="animate-fade delay-4" style={{ marginTop: '4rem', color: '#9ca3af', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} CryptoJava — Plateforme Éducative
          </div>
        </>
      )}
    </div>
  );
}
