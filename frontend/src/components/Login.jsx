import React, { useState } from 'react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess, onBack }) {
  const [isSignup, setIsSignup] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nomComplet, setNomComplet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password || (isSignup && (!email || !nomComplet))) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let res;
      if (isSignup) {
        res = await api.register(login, password, email, nomComplet);
      } else {
        res = await api.login(login, password);
      }

      if (res.success) {
        localStorage.setItem('crypto_jwt_token', res.data.token);
        localStorage.setItem('crypto_user', JSON.stringify(res.data));
        onLoginSuccess(res.data);
      } else {
        setError(res.message || (isSignup ? 'Erreur lors de l\'inscription.' : 'Identifiants incorrects.'));
      }
    } catch (err) {
      setError('Impossible de joindre le serveur Spring Boot (vérifiez que le backend est démarré sur le port 8080).');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userLogin, userPwd) => {
    setIsSignup(false);
    setLogin(userLogin);
    setPassword(userPwd);
    setError(null);
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          max-width: 1100px;
          margin: 40px auto;
          padding: 0 15px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          align-items: center;
        }
        .login-title {
          font-size: clamp(1.5rem, 5vw, 1.8rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .login-container {
            margin: 20px auto;
          }
        }
      `}</style>
      
      {/* Présentation du Projet */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '16px' }}>
          UNIVERSITÉ CHEIKH ANTA DIOP DE DAKAR
        </div>
        <h2 className="login-title">
          Plateforme Cryptographique <span style={{ color: 'var(--accent-cyan)' }}>Avancée</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
          Conception et développement d’une application de chiffrement, hachage et signature numérique sous l'encadrement du <strong>Pr. Demba SOW</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>🎓</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Filière TDSI & MCS (2025-2026)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transmission de Données et Sécurité de l'Information</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Architecture Fullstack Moderne</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spring Boot 3 (JCA/JCE Provider BouncyCastle) + React SPA</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Contrôle d'Accès basé sur les Rôles (RBAC)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Profils distincts : Administrateur et Utilisateur</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de Connexion / Inscription */}
      <div className="glass-card animate-fade-in" style={{ padding: '36px', position: 'relative' }}>
        {onBack && (
          <button 
            type="button" 
            onClick={onBack} 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '16px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '0.8rem',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            ← Accueil
          </button>
        )}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px', marginTop: onBack ? '20px' : '0' }}>
          {isSignup ? 'Créer un compte' : 'Authentification'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
          {isSignup ? 'Remplissez les champs ci-dessous pour vous inscrire.' : 'Connectez-vous avec vos identifiants définis dans la base de données.'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            marginBottom: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="form-group">
                <label className="form-label">Nom Complet</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ex: Jean Dupont"
                  value={nomComplet}
                  onChange={(e) => setNomComplet(e.target.value)}
                  required={isSignup}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="ex: jean@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={isSignup}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Identifiant (Login)</label>
            <input
              type="text"
              className="form-input"
              placeholder={isSignup ? "ex: jean.dupont" : "ex: admin ou user"}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Traitement en cours...' : (isSignup ? 'S\'inscrire ➔' : 'Se Connecter ➔')}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.88rem' }}>
          {isSignup ? (
            <span>Déjà un compte ? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); setError(null); }} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>Se connecter</a></span>
          ) : (
            <span>Pas encore de compte ? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); setError(null); }} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>S'inscrire</a></span>
          )}
        </div>

        {/* Boutons d'accès rapide pour évaluation (affichés uniquement en mode login) */}
        {!isSignup && (
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              COMPTES DE DÉMONSTRATION PRÉ-CONFIGURÉS :
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('admin', 'admin123')}
              >
                👑 Profil Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('user', 'user123')}
              >
                👤 Profil User
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('demba.sow', 'admin123')}
              >
                🎓 Pr. Demba SOW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
