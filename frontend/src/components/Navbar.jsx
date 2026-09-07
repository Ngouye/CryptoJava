import React from 'react';

export default function Navbar({ user, activeTab, setActiveTab, onLogout, theme, toggleTheme }) {
  return (
    <header className="main-header">
      <style>{`
        .main-header {
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-tabs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 6px;
          background: var(--bg-input);
          padding: 6px;
          border-radius: 12px;
        }

        .nav-user-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-info-text {
          text-align: right;
        }

        @media (max-width: 900px) {
          .main-header {
            position: relative; /* Empêche le header de masquer le contenu sur mobile */
          }
          .nav-container {
            justify-content: center;
            flex-direction: column;
            gap: 16px;
            padding: 12px 10px;
          }
          .nav-brand {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }
          .nav-user-actions {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          .user-info-text {
            text-align: left;
          }
        }
      `}</style>
      
      <div className="nav-container">
        {/* Logo & Info Projet */}
        <div className="nav-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/ucad-logo-new.jpg"
              alt="Logo UCAD"
              style={{ height: '48px', width: '48px', objectFit: 'contain', background: '#fff', borderRadius: '50%', padding: '2px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
              onError={(e) => e.target.style.display = 'none'}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Crypto<span style={{ color: 'var(--accent-cyan)' }}>Java</span></h1>
                <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>M2 TDSI</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>UCAD / FST / LACGAA • Pr. Demba SOW • Ngouye GNING</p>
            </div>
            <img
              src="/lacgaa-logo.jpg"
              alt="Logo LACGAA"
              style={{ height: '48px', width: '48px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '2px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <nav className="nav-tabs">
            {user.role === 'admin' && (
              <button
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('admin')}
                style={{ border: 'none' }}
              >
                👥 Administration
              </button>
            )}
            <button
              className={`btn btn-sm ${activeTab === 'keys' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('keys')}
              style={{ border: 'none' }}
            >
              🔑 Clés (Sym/Asym)
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'cipher' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('cipher')}
              style={{ border: 'none' }}
            >
              🔒 Chiffrement
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'hash' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('hash')}
              style={{ border: 'none' }}
            >
              🛡️ Hachage / HMAC
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'signature' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('signature')}
              style={{ border: 'none' }}
            >
              ✍️ Signature
            </button>
          </nav>
        )}

        {/* User Badge & Actions */}
        {user ? (
          <div className="nav-user-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="user-info-text">
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{user.nomComplet || user.login}</div>
                <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {user.role}
                </span>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: user.role === 'admin' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#fff'
              }}>
                {user.login.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              title="Changer de thème"
              style={{ padding: '6px 10px' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              onClick={onLogout}
              className="btn btn-rose btn-sm"
              title="Déconnexion"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
            {theme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
          </button>
        )}
      </div>
    </header>
  );
}
