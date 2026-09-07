import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import KeyGenModule from './components/KeyGenModule';
import CipherModule from './components/CipherModule';
import HashModule from './components/HashModule';
import SignatureModule from './components/SignatureModule';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('keys');
  const [theme, setTheme] = useState('dark');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Restauration de la session si existante
    const storedUser = localStorage.getItem('crypto_user');
    const token = localStorage.getItem('crypto_jwt_token');
    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === 'admin') {
          setActiveTab('admin');
        }
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('keys');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crypto_jwt_token');
    localStorage.removeItem('crypto_user');
    setUser(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="app-container">
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        {!user ? (
          !showLogin ? (
            <LandingPage onStart={() => setShowLogin(true)} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} onBack={() => setShowLogin(false)} />
          )
        ) : (
          <div>
            {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard />}
            {activeTab === 'keys' && <KeyGenModule />}
            {activeTab === 'cipher' && <CipherModule />}
            {activeTab === 'hash' && <HashModule />}
            {activeTab === 'signature' && <SignatureModule />}
          </div>
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.84rem',
        background: 'var(--bg-secondary)',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Université Cheikh Anta Diop de Dakar (UCAD)</strong> — Faculté des Sciences et Techniques (FST)
          </div>
          <div>
            Laboratoire LACGAA | Master 2 TDSI / MCS | Enseignant : <strong>Pr. Demba SOW</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
