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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#09090b', /* Ultra dark sleek background */
      color: '#f8fafc',
      padding: '40px 20px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      {/* Mesh Gradient Orbs Background */}
      <div className="modern-glow glow-1"></div>
      <div className="modern-glow glow-2"></div>
      <div className="modern-glow glow-3"></div>

      <style>{`
        /* --- Background Animations --- */
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 50px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }
        
        .modern-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 {
          top: -10%; left: -10%; width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0) 70%);
          animation: float-1 15s ease-in-out infinite;
        }
        .glow-2 {
          bottom: -10%; right: -10%; width: 60vw; height: 60vw;
          background: radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(168,85,247,0) 70%);
          animation: float-2 18s ease-in-out infinite;
        }
        .glow-3 {
          top: 40%; left: 30%; width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(56,189,248,0) 70%);
          animation: float-1 20s ease-in-out infinite reverse;
        }

        /* --- Entrance Animations --- */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }

        /* --- Text Gradients --- */
        .text-gradient {
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .text-gradient-accent {
          background: linear-gradient(to right, #38bdf8, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 800;
          text-align: center;
          margin-top: 8vh;
          margin-bottom: 1rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: #94a3b8;
          text-align: center;
          max-width: 600px;
          margin-bottom: clamp(2.5rem, 6vw, 4rem);
          line-height: 1.6;
          font-weight: 400;
        }

        /* --- Glassmorphism Cards --- */
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1100px;
          margin-bottom: clamp(3rem, 6vw, 5rem);
          padding: 0 15px;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 32px 28px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          z-index: 10;
        }

        .glass-panel:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }

        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px; height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.05);
          font-size: 1.8rem;
          margin-bottom: 20px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .glass-panel h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        
        .glass-panel p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* --- Modern Button --- */
        .btn-premium {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          border: none;
          padding: 16px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }
        
        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.6);
          filter: brightness(1.1);
        }

        /* --- Documentation Section --- */
        .doc-section {
          width: 100%;
          max-width: 900px;
          margin-top: 4rem;
          padding: 0 15px;
        }
        
        .doc-title {
          font-size: 2.2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          letter-spacing: -0.02em;
        }
        
        .doc-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }
        
        .doc-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .doc-item-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .doc-item-header h4 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
        }
        
        .doc-item p {
          color: #cbd5e1;
          line-height: 1.7;
          font-size: 1rem;
          margin-bottom: 20px;
        }
        
        /* Modern Badges */
        .modern-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-right: 8px;
          margin-bottom: 8px;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          letter-spacing: 0.02em;
        }

        .badge-blue { background: rgba(56, 189, 248, 0.1); color: #7dd3fc; border-color: rgba(56, 189, 248, 0.2); }
        .badge-purple { background: rgba(168, 85, 247, 0.1); color: #d8b4fe; border-color: rgba(168, 85, 247, 0.2); }
        .badge-indigo { background: rgba(99, 102, 241, 0.1); color: #c7d2fe; border-color: rgba(99, 102, 241, 0.2); }

        .info-box {
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid #818cf8;
          padding: 16px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.6;
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {isVisible && (
          <>
            <h1 className="fade-in-up hero-title">
              Bienvenue sur <span className="text-gradient-accent">CryptoJava</span>
            </h1>
            
            <p className="fade-in-up stagger-1 hero-subtitle">
              Une plateforme moderne et éducative pour maîtriser les concepts fondamentaux de la cryptographie, sécurisée par BouncyCastle et Spring.
            </p>

            <div className="grid-layout">
              <div className="glass-panel fade-in-up stagger-2">
                <div className="icon-wrapper">🗝️</div>
                <h3>Génération de clés</h3>
                <p>Création et gestion sécurisée de paires de clés asymétriques (RSA) et de clés secrètes (AES).</p>
              </div>

              <div className="glass-panel fade-in-up stagger-2">
                <div className="icon-wrapper">🔐</div>
                <h3>Chiffrement</h3>
                <p>Protection de la confidentialité de vos données via des algorithmes robustes contre la cryptanalyse.</p>
              </div>

              <div className="glass-panel fade-in-up stagger-3">
                <div className="icon-wrapper">🔏</div>
                <h3>Hachage</h3>
                <p>Calcul d'empreintes numériques (Digest) irréversibles pour garantir l'intégrité absolue des fichiers.</p>
              </div>

              <div className="glass-panel fade-in-up stagger-3">
                <div className="icon-wrapper">📝</div>
                <h3>Signature</h3>
                <p>Authentification de l'émetteur et non-répudiation des documents via signature cryptographique.</p>
              </div>
            </div>

            <div className="fade-in-up stagger-4" style={{ marginBottom: '4rem' }}>
              <button className="btn-premium" onClick={onStart}>
                Démarrer l'expérience
              </button>
            </div>

            {/* --- DOCUMENTATION DETAILLEE --- */}
            <div className="doc-section fade-in-up stagger-5">
              <h2 className="doc-title text-gradient">Architecture Cryptographique</h2>
              
              <div className="doc-item">
                <div className="doc-item-header">
                  <h4>Cryptographie Symétrique (SecretKey)</h4>
                </div>
                <p>
                  Conçue pour le traitement massif de données. Le chiffrement et le déchiffrement nécessitent le partage d'une clé secrète identique. L'application utilise la spécification <strong>JCA (Java Cryptography Architecture)</strong> couplée au provider <strong>BouncyCastle</strong>.
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <span className="modern-badge badge-blue">AES-128</span>
                  <span className="modern-badge badge-blue">AES-192</span>
                  <span className="modern-badge badge-blue">AES-256</span>
                  <span className="modern-badge">Mode CBC</span>
                  <span className="modern-badge">Mode ECB</span>
                  <span className="modern-badge">Mode GCM</span>
                  <span className="modern-badge">Padding PKCS7</span>
                </div>
                <div className="info-box">
                  <strong>Détail Technique :</strong> L'application génère un Vecteur d'Initialisation (IV) dynamique pour chaque opération, prévenant les attaques par analyse de fréquence. Le mode GCM offre le chiffrement authentifié (AEAD).
                </div>
              </div>

              <div className="doc-item">
                <div className="doc-item-header">
                  <h4>Cryptographie Asymétrique (KeyPair)</h4>
                </div>
                <p>
                  Repose sur l'utilisation d'un bi-clé : une <strong>Clé Publique</strong> (pour chiffrer) et une <strong>Clé Privée</strong> (pour déchiffrer). Extrêmement sécurisée pour l'échange de clés de session, bien que mathématiquement plus complexe.
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <span className="modern-badge badge-purple">RSA-1024</span>
                  <span className="modern-badge badge-purple">RSA-2048</span>
                  <span className="modern-badge badge-purple">RSA-4096</span>
                  <span className="modern-badge">Padding OAEP</span>
                </div>
                <div className="info-box">
                  <strong>Détail Technique :</strong> Les clés sont encodées selon les standards de l'industrie : X.509 pour la clé publique et PKCS#8 pour la clé privée, garantissant l'interopérabilité.
                </div>
              </div>

              <div className="doc-item">
                <div className="doc-item-header">
                  <h4>Fonctions de Hachage & Intégrité</h4>
                </div>
                <p>
                  Fonctions mathématiques à sens unique. Elles réduisent des données de taille infinie en une empreinte de taille fixe. Une modification infime du fichier original modifie totalement le résultat (Effet d'Avalanche).
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <span className="modern-badge badge-indigo">SHA-256</span>
                  <span className="modern-badge badge-indigo">SHA-512</span>
                  <span className="modern-badge badge-indigo">MD5 (Legacy)</span>
                </div>
                <div className="info-box">
                  <strong>Performance :</strong> Le hachage des fichiers est calculé en flux de données continu (Stream) via des buffers pour prévenir les dépassements de mémoire (OOM) sur les très gros fichiers.
                </div>
              </div>

              <div className="doc-item">
                <div className="doc-item-header">
                  <h4>Signature Numérique & HMAC</h4>
                </div>
                <p>
                  Ces protocoles assurent conjointement l'<strong>Authentification</strong> de la source, l'<strong>Intégrité</strong> des données et la <strong>Non-Répudiation</strong>.
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <span className="modern-badge">HMAC-SHA256</span>
                  <span className="modern-badge badge-purple">SHA256withRSA</span>
                </div>
                <div className="info-box">
                  <strong>HMAC :</strong> Combiné à une clé secrète, il est notamment utilisé par Spring Security pour signer les jetons Stateless (JWT).<br/><br/>
                  <strong>Signature RSA :</strong> Hachage du fichier, suivi du chiffrement de l'empreinte avec la Clé Privée de l'auteur. Le destinataire vérifie avec la Clé Publique.
                </div>
              </div>
            </div>
            
            <div className="fade-in-up stagger-5" style={{ marginTop: '3rem', marginBottom: '2rem', opacity: 0.5, fontSize: '0.9rem', fontWeight: 500 }}>
              Projet réalisé par <strong style={{ color: '#fff' }}>Ngouye GNING</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
