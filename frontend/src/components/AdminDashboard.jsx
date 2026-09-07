import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modale création/édition
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
    nomComplet: '',
    role: 'user',
    actif: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, logsRes, statsRes] = await Promise.all([
        api.getUsers(),
        api.getAuditLogs(),
        api.getStats()
      ]);

      if (usersRes.success) setUsers(usersRes.data || []);
      if (logsRes.success) setLogs(logsRes.data || []);
      if (statsRes.success) setStats(statsRes.data || {});
    } catch (e) {
      setError('Erreur lors du chargement des données administratives : ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        login: user.login,
        password: '',
        email: user.email,
        nomComplet: user.nomComplet,
        role: user.role,
        actif: user.actif
      });
    } else {
      setEditingUser(null);
      setFormData({
        login: '',
        password: '',
        email: '',
        nomComplet: '',
        role: 'user',
        actif: true
      });
    }
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
      } else {
        await api.createUser(formData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const handleDeleteUser = async (id, login) => {
    if (window.confirm(`Êtes-vous certain de vouloir supprimer l'utilisateur "${login}" ?`)) {
      try {
        const res = await api.deleteUser(id);
        if (res.success) {
          loadData();
        } else {
          alert(res.message);
        }
      } catch (err) {
        alert('Erreur : ' + err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Cartes de statistiques */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>UTILISATEURS ENREGISTRÉS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats.totalUsers}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>COMPTES ACTIFS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{stats.activeUsers}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ADMINISTRATEURS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc' }}>{stats.adminCount}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ÉTAT DU SYSTÈME</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginTop: '8px' }}>🟢 Opérationnel</div>
          </div>
        </div>
      )}

      {/* Tableau des utilisateurs */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Gestion des Utilisateurs</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Contrôle d'accès des profils (admin / user)</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Ajouter un Utilisateur
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Login</th>
                <th style={{ padding: '12px' }}>Nom Complet</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Rôle</th>
                <th style={{ padding: '12px' }}>Statut</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{u.login}</td>
                  <td style={{ padding: '12px' }}>{u.nomComplet}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.actif ? 'badge-success' : 'badge-error'}`}>
                      {u.actif ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(u)}>
                        ✏️ Éditer
                      </button>
                      {u.login !== 'admin' && (
                        <button className="btn btn-rose btn-sm" onClick={() => handleDeleteUser(u.id, u.login)}>
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal des Logs d'Audit */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>📋 Journal d'Audit Cryptographique (Audit Logs)</h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Traçabilité des opérations de génération de clés, chiffrement, hachage et signatures.
        </p>

        <div style={{ overflowX: 'auto', maxHeight: '360px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Utilisateur</th>
                <th style={{ padding: '10px' }}>Action</th>
                <th style={{ padding: '10px' }}>Algorithme</th>
                <th style={{ padding: '10px' }}>Statut</th>
                <th style={{ padding: '10px' }}>Détails</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                    {log.dateAction ? new Date(log.dateAction).toLocaleString('fr-FR') : '-'}
                  </td>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{log.username || 'Anonyme'}</td>
                  <td style={{ padding: '10px' }}><code>{log.action}</code></td>
                  <td style={{ padding: '10px' }}>{log.algorithme}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge ${log.statut === 'SUCCES' ? 'badge-success' : 'badge-error'}`}>
                      {log.statut}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout/Édition Utilisateur */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{ padding: '32px', maxWidth: '500px', width: '100%', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '18px' }}>
              {editingUser ? `Modifier ${editingUser.login}` : 'Créer un Nouvel Utilisateur'}
            </h3>

            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label className="form-label">Identifiant (Login)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  disabled={!!editingUser}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom Complet</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe {editingUser && '(Laisser vide pour ne pas modifier)'}</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Profil / Rôle</label>
                  <select
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User (Standard)</option>
                    <option value="admin">Admin (Gestionnaire)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 0' }}>
                    <input
                      type="checkbox"
                      checked={formData.actif}
                      onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                    />
                    <span style={{ fontSize: '0.88rem' }}>Compte Actif</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
