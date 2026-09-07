// Client API REST pour communiquer avec le backend Spring Boot

const API_BASE_URL = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('crypto_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Authentification
  login: async (login, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    return res.json();
  },

  register: async (login, password, email, nomComplet) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password, email, nomComplet })
    });
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Espace Admin
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  updateUser: async (id, userData) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAuditLogs: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/logs`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Module 1 : Génération de Clés
  generateKey: async (keyParams) => {
    const res = await fetch(`${API_BASE_URL}/crypto/keys/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(keyParams)
    });
    return res.json();
  },

  getMySavedKeys: async () => {
    const res = await fetch(`${API_BASE_URL}/crypto/keys/my-keys`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Module 2 : Chiffrement & Déchiffrement
  processCipher: async (cipherParams) => {
    const res = await fetch(`${API_BASE_URL}/crypto/cipher/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cipherParams)
    });
    return res.json();
  },

  processFileCipher: async (formData) => {
    const token = localStorage.getItem('crypto_jwt_token');
    const res = await fetch(`${API_BASE_URL}/crypto/cipher/file`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors du chiffrement du fichier');
    }
    return res.blob();
  },

  // Module 3 : Hachage & HMAC
  computeHash: async (hashParams) => {
    const res = await fetch(`${API_BASE_URL}/crypto/hash/compute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(hashParams)
    });
    return res.json();
  },

  hashFile: async (formData) => {
    const token = localStorage.getItem('crypto_jwt_token');
    const res = await fetch(`${API_BASE_URL}/crypto/hash/file`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    return res.json();
  },

  // Module 4 : Signature & Vérification
  signData: async (signParams) => {
    const res = await fetch(`${API_BASE_URL}/crypto/signature/sign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(signParams)
    });
    return res.json();
  },

  verifySignature: async (verifyParams) => {
    const res = await fetch(`${API_BASE_URL}/crypto/signature/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(verifyParams)
    });
    return res.json();
  }
};
