import React, { useEffect, useState } from 'react';

export default function LandingPage({ onStart }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Délai pour lancer l'animation
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
      backgroundColor: '#030712',
      color: '#e2e8f0',
      padding: '40px 20px',
      fontFamily: '"Inter", system-ui, sans-serif',
      overflowX: 'hidden',
      position: 'relative',
      backgroundImage: `
        linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      backgroundPosition: 'center center'
    }}>
      
      {/* Glow Effects (Neon Green & Cyan) */}
      <div className="cyber-glow cyber-glow-green"></div>
      <div className="cyber-glow cyber-glow-cyan"></div>

      <style>{`
        /* Animations */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.4); }
          100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(16, 185, 129, 0.2); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          opacity: 0;
          animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }

        /* Typography */
        .tech-font {
          font-family: 'Courier New', Courier, monospace;
          letter-spacing: -0.5px;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          text-align: center;
          margin-top: 6vh;
          margin-bottom: 1.5rem;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .text-neon-cyan {
          color: #06b6d4;
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        
        .text-neon-green {
          color: #10b981;
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .cursor-blink {
          display: inline-block;
          width: 14px;
          height: 1em;
          background-color: #10b981;
          vertical-align: middle;
          margin-left: 8px;
          animation: blink 1s step-end infinite;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
        }

        .hero-subtitle {
          font-family: 'Courier New', monospace;
          font-size: clamp(0.9rem, 2vw, 1.15rem);
          color: #94a3b8;
          text-align: center;
          max-width: 700px;
          margin-bottom: clamp(2rem, 5vw, 4rem);
          line-height: 1.6;
          padding: 15px;
          border-left: 3px solid #06b6d4;
          background: rgba(6, 182, 212, 0.05);
        }

        /* Cyber Cards */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1000px;
          margin-bottom: clamp(2rem, 5vw, 4rem);
          padding: 0 15px;
        }

        .cyber-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(6, 182, 212, 0.3);
          padding: 30px 24px;
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        /* Coin coupé style tech */
        .cyber-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          border-top: 15px solid #06b6d4;
          border-right: 15px solid transparent;
        }

        .cyber-card:hover {
          transform: translateY(-5px);
          border-color: #06b6d4;
          box-shadow: 0 10px 30px rgba(6, 182, 212, 0.2);
          background: rgba(15, 23, 42, 0.95);
        }

        .cyber-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: #06b6d4;
          font-family: monospace;
        }

        .cyber-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .cyber-card p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Button */
        .btn-cyber {
          background: transparent;
          color: #10b981;
          border: 2px solid #10b981;
          padding: 18px 48px;
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          animation: pulseGlow 3s infinite;
        }
        
        .btn-cyber:hover {
          background: rgba(16, 185, 129, 0.15);
          color: #fff;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(16, 185, 129, 0.4);
        }

        /* Documentation Section */
        .doc-section {
          width: 100%;
          max-width: 1000px;
          margin-top: 5rem;
          padding: 0 15px;
          text-align: left;
        }
        
        .doc-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin-bottom: 3rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .doc-title span {
          color: #10b981;
        }
        
        .doc-box {
          background: rgba(3, 7, 18, 0.8);
          border-left: 4px solid #06b6d4;
          border-right: 1px solid rgba(6, 182, 212, 0.2);
          border-top: 1px solid rgba(6, 182, 212, 0.2);
          border-bottom: 1px solid rgba(6, 182, 212, 0.2);
          padding: 28px;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }
        
        .doc-box:hover {
          background: rgba(15, 23, 42, 0.9);
          border-left-color: #10b981;
          box-shadow: inset 5px 0 15px rgba(16, 185, 129, 0.1);
        }
        
        .doc-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          border-bottom: 1px dashed rgba(148, 163, 184, 0.2);
          padding-bottom: 12px;
        }
        
        .doc-box h4 {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
          color: #f8fafc;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .doc-box p {
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }
        
        .tech-badge {
          display: inline-block;
          background: rgba(6, 182, 212, 0.1);
          color: #06b6d4;
          padding: 4px 10px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid rgba(6, 182, 212, 0.4);
        }

        .tech-badge.rsa { color: #10b981; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.4); }
        .tech-badge.hash { color: #c084fc; background: rgba(192, 132, 252, 0.1); border-color: rgba(192, 132, 252, 0.4); }

        .terminal-block {
          background: #020617;
          border: 1px solid #1e293b;
          padding: 12px;
          margin-top: 16px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          color: #94a3b8;
        }
        .terminal-block .highlight { color: #10b981; }

        /* Glow Elements */
        .cyber-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          z-index: 0;
          pointer-events: none;
        }
        .cyber-glow-green { top: -100px; left: -100px; background: #10b981; }
        .cyber-glow-cyan { bottom: -100px; right: -100px; background: #06b6d4; }
        
        /* Scanline Overlay */
        .scanline {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 5px;
          background: rgba(6, 182, 212, 0.3);
          opacity: 0.4;
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 999;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>

      {/* Ligne de balayage type écran CRT radar */}
      <div className="scanline"></div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {isVisible && (
          <>
            <h1 className="animate-in hero-title">
              <span className="text-neon-cyan">Crypto</span>
              <span className="text-neon-green">Java</span>
              <span className="cursor-blink"></span>
            </h1>
            
            <p className="animate-in delay-1 hero-subtitle">
              > INITIALIZING SYSTEM...<br/>
              > MODULES LOADED: BOUNCYCASTLE, SPRING SECURITY, JWT.<br/>
              > PLATEFORME ÉDUCATIVE DE CRYPTOGRAPHIE AVANCÉE.
            </p>

            <div className="cards-grid">
              <div className="cyber-card animate-in delay-2">
                <div className="cyber-icon">[ KEYGEN ]</div>
                <h3>Génération de clés</h3>
                <p>Création et gestion sécurisée de paires de clés asymétriques (RSA) et de clés secrètes (AES).</p>
              </div>

              <div className="cyber-card animate-in delay-2">
                <div className="cyber-icon">[ CIPHER ]</div>
                <h3>Chiffrement</h3>
                <p>Protection de la confidentialité des données via des algorithmes robustes contre la cryptanalyse.</p>
              </div>

              <div className="cyber-card animate-in delay-3">
                <div className="cyber-icon">[ HASH ]</div>
                <h3>Hachage</h3>
                <p>Calcul d'empreintes numériques (Digest) irréversibles pour garantir l'intégrité des fichiers.</p>
              </div>

              <div className="cyber-card animate-in delay-3">
                <div className="cyber-icon">[ SIGN ]</div>
                <h3>Signature</h3>
                <p>Authentification de l'émetteur et non-répudiation des transactions via signature cryptographique.</p>
              </div>
            </div>

            <div className="animate-in delay-4" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
              <button className="btn-cyber" onClick={onStart}>
                ACCESS_SYSTEM()
              </button>
            </div>

            {/* --- DOCUMENTATION DETAILLEE --- */}
            <div className="doc-section animate-in delay-4">
              <h2 className="doc-title">PROTOCOLES <span>CRYPTOGRAPHIQUES</span></h2>
              
              <div className="doc-box">
                <div className="doc-header">
                  <h4>&gt; SYMMETRIC_CRYPTO [SecretKey]</h4>
                </div>
                <p>
                  Conçue pour le traitement massif de données. Le chiffrement et le déchiffrement nécessitent le partage d'une clé secrète identique. Intègre l'API <strong>Java Cryptography Architecture (JCA)</strong> et le provider <strong>BouncyCastle</strong>.
                </p>
                <div>
                  <span className="tech-badge">AES-128</span>
                  <span className="tech-badge">AES-192</span>
                  <span className="tech-badge">AES-256</span>
                  <span className="tech-badge">MOD_CBC</span>
                  <span className="tech-badge">MOD_ECB</span>
                  <span className="tech-badge">MOD_GCM</span>
                  <span className="tech-badge">PAD_PKCS7</span>
                </div>
                <div className="terminal-block">
                  <span className="highlight">[INFO]</span> Génération d'un Vecteur d'Initialisation (IV) dynamique (16 octets / 12 pour GCM) pour prévenir les attaques d'analyse de fréquence. Le mode GCM offre l'Autenticated Encryption with Associated Data (AEAD).
                </div>
              </div>

              <div className="doc-box">
                <div className="doc-header">
                  <h4>&gt; ASYMMETRIC_CRYPTO [KeyPair]</h4>
                </div>
                <p>
                  Infrastructure à clé publique (PKI). La clé publique chiffre, la clé privée déchiffre. Processus mathématiquement lourd basé sur la factorisation de grands nombres premiers. Idéal pour l'échange initial de clés AES.
                </p>
                <div>
                  <span className="tech-badge rsa">RSA-1024</span>
                  <span className="tech-badge rsa">RSA-2048</span>
                  <span className="tech-badge rsa">RSA-4096</span>
                  <span className="tech-badge rsa">PAD_OAEP</span>
                </div>
                <div className="terminal-block">
                  <span className="highlight">[EXPORT]</span> Les clés sont encodées selon les standards de l'industrie : X.509 pour la clé publique et PKCS#8 pour la clé privée.
                </div>
              </div>

              <div className="doc-box">
                <div className="doc-header">
                  <h4>&gt; HASHING_FUNCTIONS [Digest]</h4>
                </div>
                <p>
                  Fonctions mathématiques à sens unique sans clé. Réduisent des données de taille infinie en une empreinte (Digest) de taille fixe. Une modification d'un seul bit dans le fichier original modifie environ 50% des bits du résultat (Effet d'Avalanche).
                </p>
                <div>
                  <span className="tech-badge hash">SHA-256 (256-bit)</span>
                  <span className="tech-badge hash">SHA-512 (512-bit)</span>
                  <span className="tech-badge hash">MD5 (Legacy)</span>
                </div>
                <div className="terminal-block">
                  <span className="highlight">[PERFORMANCE]</span> Hachage de fichiers calculé en flux de données continu (Stream) via buffers pour prévenir les exceptions OutOfMemoryError sur les gros fichiers.
                </div>
              </div>

              <div className="doc-box">
                <div className="doc-header">
                  <h4>&gt; DIGITAL_SIGNATURE & HMAC</h4>
                </div>
                <p>
                  Mécanismes de protection de l'intégrité couplés à l'authentification de l'émetteur.
                </p>
                <div>
                  <span className="tech-badge">HMAC-SHA256 (Symétrique)</span>
                  <span className="tech-badge rsa">SHA256withRSA (Asymétrique)</span>
                </div>
                <div className="terminal-block">
                  <span className="highlight">[HMAC]</span> Combinaison d'une fonction de hachage et d'une clé secrète. Utilisé par le composant JwtUtils (Spring Security) pour signer les jetons Stateless.<br/>
                  <span className="highlight">[RSA_SIGN]</span> Hachage du fichier, puis chiffrement du Digest avec la clé PRIVÉE de l'auteur. Vérification via la clé PUBLIQUE. Garantit la non-répudiation.
                </div>
              </div>
            </div>
            
            <div className="animate-in delay-4" style={{ marginTop: '5rem', marginBottom: '2rem', color: '#10b981', fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '2px' }}>
              // SYS.ADMIN: NGOUYE GNING _
            </div>
          </>
        )}
      </div>
    </div>
  );
}
