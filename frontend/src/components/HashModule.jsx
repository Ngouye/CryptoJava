import React, { useState } from 'react';
import { api } from '../services/api';

export default function HashModule() {
  const [hashType, setHashType] = useState('SANS_CLE'); // SANS_CLE (Intégrité) ou AVEC_CLE (HMAC)
  const [algorithme, setAlgorithme] = useState('SHA-256');
  const [texte, setTexte] = useState('');
  const [cleMac, setCleMac] = useState('');
  const [hashAttendu, setHashAttendu] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleTypeChange = (newType) => {
    setHashType(newType);
    if (newType === 'SANS_CLE') {
      setAlgorithme('SHA-256');
    } else {
      setAlgorithme('HmacSHA256');
    }
  };

  const handleCompute = async (e) => {
    e.preventDefault();
    if (!texte) {
      setError('Veuillez saisir le message à hacher.');
      return;
    }
    if (hashType === 'AVEC_CLE' && !cleMac) {
      setError('Veuillez renseigner la clé secrète HMAC.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.computeHash({
        algorithme,
        texte,
        cleMac,
        hashAttendu
      });

      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Erreur lors du hachage : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
      {/* Formulaire Hachage */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Hachage & Intégrité des Données</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Module 3 (TP4 : MessageDigest & Mac / HmacSHA)</p>
          </div>
          <span className="badge badge-user">Intégrité & Auth</span>
        </div>

        {/* Sélection Mode : Sans Clé vs Avec Clé */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${hashType === 'SANS_CLE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTypeChange('SANS_CLE')}
          >
            🛡️ Sans Clé (Intégrité)
          </button>
          <button
            type="button"
            className={`btn ${hashType === 'AVEC_CLE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTypeChange('AVEC_CLE')}
          >
            🔑 Avec Clé (HMAC Authentifié)
          </button>
        </div>

        <form onSubmit={handleCompute}>
          <div className="form-group">
            <label className="form-label">Algorithme de Hachage</label>
            <select
              className="form-select"
              value={algorithme}
              onChange={(e) => setAlgorithme(e.target.value)}
            >
              {hashType === 'SANS_CLE' ? (
                <>
                  <option value="SHA-256">SHA-256 (Standard NIST)</option>
                  <option value="SHA-512">SHA-512 (Haute Résistance)</option>
                  <option value="SHA-1">SHA-1 (160 bits)</option>
                  <option value="MD5">MD5 (Message Digest 5)</option>
                  <option value="SHA-384">SHA-384</option>
                  <option value="SHA-224">SHA-224</option>
                </>
              ) : (
                <>
                  <option value="HmacSHA256">HmacSHA256 (Recommandé)</option>
                  <option value="HmacSHA512">HmacSHA512</option>
                  <option value="HmacSHA1">HmacSHA1</option>
                  <option value="HmacMD5">HmacMD5</option>
                </>
              )}
            </select>
          </div>

          {hashType === 'AVEC_CLE' && (
            <div className="form-group">
              <label className="form-label">Clé Secrète HMAC</label>
              <input
                type="text"
                className="form-input"
                placeholder="Entrez votre clé secrète partagée..."
                value={cleMac}
                onChange={(e) => setCleMac(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Message / Données à hacher</label>
            <textarea
              className="form-textarea"
              placeholder="Saisissez le texte ou le message à vérifier..."
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Empreinte Attendue (Optionnel - Pour test d'intégrité)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Collez ici un condensat Hex ou Base64 pour vérifier l'altération..."
              value={hashAttendu}
              onChange={(e) => setHashAttendu(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Calcul de l\'empreinte...' : '⚡ Calculer le Condensat'}
          </button>
        </form>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '12px', borderRadius: '10px', marginTop: '16px', fontSize: '0.88rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Résultat & Analyse Multi-Hash */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Empreinte & Intégrité</h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Visualisation de la signature numérique du message.
        </p>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Verdict d'intégrité si testé */}
            {result.integre !== undefined && (
              <div style={{
                background: result.integre ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                border: `1px solid ${result.integre ? '#34d399' : '#fb7185'}`,
                padding: '14px',
                borderRadius: '10px',
                color: result.integre ? '#34d399' : '#fb7185',
                fontWeight: 700,
                fontSize: '0.92rem'
              }}>
                {result.integre ? '✅ INTÉGRITÉ VALIDÉE : Les données sont authentiques et conformes.' : '❌ ALERTE CORRUPTION : Les données ont été modifiées ou corrompues !'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label">Condensat Hexadécimal ({result.tailleBits} bits / {result.tailleOctets} octets)</label>
                <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result.hashHex, 'hashHex')}>
                  {copiedField === 'hashHex' ? 'Copié !' : 'Copier Hex'}
                </button>
              </div>
              <div className="code-box">{result.hashHex}</div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label">Condensat Base64</label>
                <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result.hashBase64, 'hashB64')}>
                  {copiedField === 'hashB64' ? 'Copié !' : 'Copier'}
                </button>
              </div>
              <div className="code-box">{result.hashBase64}</div>
            </div>

            {/* Comparaison Multi-Algorithmes (MD5, SHA-1, SHA-256, SHA-512) */}
            {result.multiHashes && (
              <div style={{ marginTop: '10px', background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '10px' }}>
                  📊 Tableau Comparatif Multi-Algorithmes :
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  {Object.entries(result.multiHashes).map(([algoName, val]) => (
                    <div key={algoName}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{algoName} :</span>
                      <div style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️</div>
            <p>Le condensat cryptographique et les métadonnées d'intégrité s'afficheront ici.</p>
          </div>
        )}
      </div>
      {/* Documentation Détaillée : Hachage */}
      <div className="glass-card animate-fade-in" style={{ padding: '32px', gridColumn: '1 / -1', marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          📖 Comprendre le Hachage et l'Intégrité des Données
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Bloc Fonctions de Hachage */}
          <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-cyan)' }}>1. Fonctions de Hachage (Message Digest)</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Le hachage (ou condensat) est une fonction mathématique à <strong>sens unique</strong>. Il prend un fichier de n'importe quelle taille en entrée et génère une empreinte de taille fixe. Il est impossible de retrouver le texte d'origine à partir du hachage.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              <li><strong>SHA-256 / SHA-512</strong> : (Secure Hash Algorithm 2). C'est le standard industriel actuel. Résistant aux collisions. Idéal pour certifier qu'un document n'a pas été altéré.</li>
              <li><strong>MD5 / SHA-1</strong> : Algorithmes obsolètes. Des chercheurs ont prouvé qu'il est possible de générer deux fichiers différents ayant le même hachage (attaque par collision). À ne plus utiliser pour la sécurité.</li>
            </ul>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderLeft: '3px solid var(--accent-cyan)', padding: '12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>L'Effet d'Avalanche :</strong> Modifier un seul caractère dans un texte de 1000 pages modifiera plus de 50% des bits de l'empreinte finale. C'est ce qui rend la vérification d'intégrité si fiable.
            </div>
          </div>

          {/* Bloc HMAC */}
          <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-purple)' }}>2. HMAC (Keyed-Hash Message Auth)</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Le HMAC combine une fonction de hachage (comme SHA-256) avec <strong>une clé secrète</strong> partagée entre l'expéditeur et le destinataire.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              <li><strong>Intégrité + Authenticité</strong> : Le hachage simple prouve seulement que le document n'a pas changé. Le HMAC prouve en plus que le document a été créé par quelqu'un possédant la clé secrète.</li>
              <li><strong>Utilisation courante</strong> : Les tokens JWT (JSON Web Tokens) utilisent très souvent HMAC-SHA256 pour éviter qu'un utilisateur ne falsifie ses propres droits d'accès.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
