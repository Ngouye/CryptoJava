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
      justifyContent: 'flex-start',
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
      <div className="bg-glow bg-glow-3"></div>

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
        .delay-7 { animation-delay: 1.0s; }
        
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
        .bg-glow-3 { top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(192, 132, 252, 0.8); width: 800px; height: 800px; opacity: 0.15; filter: blur(120px); }

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
          margin-top: 5vh;
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

        /* Documentation Section Styles */
        .doc-section {
          width: 100%;
          max-width: 1000px;
          margin-top: 4rem;
          padding: 0 15px;
          text-align: left;
        }
        
        .doc-title {
          font-size: 2.2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          padding-bottom: 15px;
        }
        
        .doc-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #22d3ee, #818cf8);
          border-radius: 2px;
        }
        
        .doc-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 28px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          transition: border-color 0.3s ease;
        }
        
        .doc-card:hover {
          border-color: rgba(6, 182, 212, 0.4);
        }
        
        .doc-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .doc-icon {
          font-size: 2rem;
          margin-right: 16px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 10px;
        }
        
        .doc-card h4 {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
          color: #e2e8f0;
        }
        
        .doc-card p {
          color: #94a3b8;
          line-height: 1.7;
          margin-bottom: 16px;
          font-size: 1rem;
        }
        
        .algo-tag {
          display: inline-block;
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .algo-tag.rsa { background: rgba(192, 132, 252, 0.15); color: #c084fc; border-color: rgba(192, 132, 252, 0.3); }
        .algo-tag.hash { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }

        @media (max-width: 768px) {
          .bg-glow {
            width: 300px;
            height: 300px;
          }
          .btn-modern {
            padding: 14px 32px;
            font-size: 1rem;
          }
          .doc-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .doc-icon {
            margin-bottom: 12px;
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
              Une plateforme éducative pour maîtriser les concepts fondamentaux de la cryptographie moderne, propulsée par BouncyCastle et Spring Security.
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

            <div className="animate-slide-up delay-6" style={{ marginBottom: '3rem' }}>
              <button className="btn-modern" onClick={onStart}>
                Démarrer l'expérience
              </button>
            </div>

            {/* --- DOCUMENTATION DETAILLEE --- */}
            <div className="doc-section animate-slide-up delay-7">
              <h2 className="doc-title">Architecture Cryptographique</h2>
              
              <div className="doc-card">
                <div className="doc-card-header">
                  <div className="doc-icon">🛡️</div>
                  <h4>Cryptographie Symétrique (SecretKey)</h4>
                </div>
                <p>
                  Utilisée pour chiffrer efficacement de grands volumes de données. Une clé unique (secrète) est utilisée à la fois pour le chiffrement et le déchiffrement. L'application utilise la spécification <strong>JCA (Java Cryptography Architecture)</strong> couplée au provider <strong>BouncyCastle</strong>.
                </p>
                <div>
                  <span className="algo-tag">AES-128</span>
                  <span className="algo-tag">AES-192</span>
                  <span className="algo-tag">AES-256</span>
                  <span className="algo-tag">Mode CBC</span>
                  <span className="algo-tag">Mode ECB</span>
                  <span className="algo-tag">Mode GCM</span>
                  <span className="algo-tag">Padding PKCS5/PKCS7</span>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748b', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <em>Détail Technique :</em> L'application génère un Vecteur d'Initialisation (IV) pseudo-aléatoire sécurisé de 16 octets (ou 12 octets pour GCM) pour chaque opération, garantissant que le même texte chiffré deux fois avec la même clé produira un résultat totalement différent. Le mode GCM offre un chiffrement authentifié protégeant contre les attaques de Padding Oracle.
                </p>
              </div>

              <div className="doc-card">
                <div className="doc-card-header">
                  <div className="doc-icon">🗝️</div>
                  <h4>Cryptographie Asymétrique (KeyPair)</h4>
                </div>
                <p>
                  Repose sur l'utilisation d'un bi-clé : une <strong>Clé Publique</strong> (pour chiffrer) et une <strong>Clé Privée</strong> (pour déchiffrer). Extrêmement sécurisée pour l'échange de clés de session et l'authentification des correspondants, bien que mathématiquement plus lourde.
                </p>
                <div>
                  <span className="algo-tag rsa">RSA-1024</span>
                  <span className="algo-tag rsa">RSA-2048</span>
                  <span className="algo-tag rsa">RSA-4096</span>
                  <span className="algo-tag rsa">Padding OAEP</span>
                  <span className="algo-tag rsa">Padding PKCS1</span>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748b', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <em>Détail Technique :</em> Implémentation via <code>KeyPairGenerator</code>. Les clés sont sérialisées et encodées au format standard <strong>X.509</strong> pour la clé publique et <strong>PKCS#8</strong> pour la clé privée, garantissant une compatibilité universelle lors de l'exportation et de l'importation.
                </p>
              </div>

              <div className="doc-card">
                <div className="doc-card-header">
                  <div className="doc-icon">🧬</div>
                  <h4>Fonctions de Hachage & Intégrité</h4>
                </div>
                <p>
                  Le hachage est une fonction mathématique à sens unique. Elle prend un document de taille arbitraire et génère une empreinte numérique (Digest) de taille fixe. C'est le fondement de la vérification d'intégrité via l'effet d'avalanche (le moindre bit modifié change totalement le hachage).
                </p>
                <div>
                  <span className="algo-tag hash">SHA-256 (256 bits)</span>
                  <span className="algo-tag hash">SHA-512 (512 bits)</span>
                  <span className="algo-tag hash">MD5 (Obsolète, pour rétrocompatibilité)</span>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748b', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <em>Détail Technique :</em> L'implémentation exploite le <code>MessageDigest</code> Java. L'application calcule le condensat du fichier en flux de données continu (Stream) afin d'éviter la saturation de la mémoire vive (RAM) lors du traitement de très gros fichiers (optimisation OOM).
                </p>
              </div>

              <div className="doc-card">
                <div className="doc-card-header">
                  <div className="doc-icon">✍️</div>
                  <h4>HMAC et Signatures Numériques</h4>
                </div>
                <p>
                  Assurent conjointement l'<strong>Authentification</strong> de la source, l'<strong>Intégrité</strong> des données et la <strong>Non-Répudiation</strong> par l'émetteur.
                </p>
                <div>
                  <span className="algo-tag">HMAC-SHA256 (Symétrique)</span>
                  <span className="algo-tag rsa">SHA256withRSA (Asymétrique)</span>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748b', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <em>Détail Technique :</em> 
                  <br/><br/>- <strong>HMAC (Hash-based Message Authentication Code) :</strong> Combine un hachage fort avec une clé secrète partagée. Ce mécanisme est également utilisé au cœur de Spring Security pour générer et valider les tokens JWT (Authentification Stateless).
                  <br/><br/>- <strong>Signature RSA :</strong> Le signataire hache le fichier puis chiffre cette empreinte avec sa <em>Clé Privée</em>. Le vérificateur déchiffre l'empreinte avec la <em>Clé Publique</em> du signataire et compare ce résultat avec son propre calcul de hachage. Si les valeurs correspondent, l'intégrité et la provenance sont certifiées mathématiquement à 100%. Implémenté via le moteur <code>java.security.Signature</code>.
                </p>
              </div>
            </div>
            
            {/* Signature Étudiant */}
            <div className="animate-slide-up delay-7" style={{ marginTop: '4rem', marginBottom: '2rem', opacity: 0.7, fontSize: '0.95rem', letterSpacing: '1px' }}>
              Projet réalisé par <strong style={{ color: '#22d3ee', fontWeight: 800 }}>Ngouye GNING</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
