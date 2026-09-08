import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function KeyGenModule() {
  const [type, setType] = useState('SYMETRIQUE'); // SYMETRIQUE ou ASYMETRIQUE
  const [algorithme, setAlgorithme] = useState('AES');
  const [tailleBits, setTailleBits] = useState(256);
  const [nomCle, setNomCle] = useState('');
  const [formatExport, setFormatExport] = useState('HEX');
  const [sauvegarderServeur, setSauvegarderServeur] = useState(true);
  const [nomFichier, setNomFichier] = useState('key.txt');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [savedKeys, setSavedKeys] = useState([]);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    loadSavedKeys();
  }, []);

  const loadSavedKeys = async () => {
    try {
      const res = await api.getMySavedKeys();
      if (res.success) setSavedKeys(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'SYMETRIQUE') {
      setAlgorithme('AES');
      setTailleBits(256);
      setNomFichier('key.txt');
    } else {
      setAlgorithme('RSA');
      setTailleBits(2048);
      setNomFichier('pubKey.txt');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.generateKey({
        type,
        algorithme,
        tailleBits: parseInt(tailleBits, 10),
        nomCle: nomCle || `Cle_${algorithme}_${Date.now()}`,
        formatExport,
        sauvegarderServeur,
        nomFichier
      });

      if (res.success) {
        setResult(res.data);
        loadSavedKeys();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Erreur lors de la génération de clé : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadFile = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
      {/* Formulaire de génération */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Génération & Sauvegarde des Clés</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Module 1 (TP1, TP2 & SystemeSymetrique/Asymetrique)</p>
          </div>
          <span className="badge badge-user">JCA / JCE</span>
        </div>

        {/* Sélecteur Symétrique vs Asymétrique */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${type === 'SYMETRIQUE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTypeChange('SYMETRIQUE')}
          >
            🔐 Symétrique (SecretKey)
          </button>
          <button
            type="button"
            className={`btn ${type === 'ASYMETRIQUE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTypeChange('ASYMETRIQUE')}
          >
            🗝️ Asymétrique (KeyPair)
          </button>
        </div>

        <form onSubmit={handleGenerate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Algorithme</label>
              <select
                className="form-select"
                value={algorithme}
                onChange={(e) => setAlgorithme(e.target.value)}
              >
                {type === 'SYMETRIQUE' ? (
                  <>
                    <option value="AES">AES (Rijndael)</option>
                    <option value="DES">DES (56 bits)</option>
                    <option value="DESede">Triple-DES (3DES)</option>
                    <option value="Blowfish">Blowfish</option>
                    <option value="RC4">RC4 / ARCFOUR</option>
                  </>
                ) : (
                  <>
                    <option value="RSA">RSA (Rivest-Shamir-Adleman)</option>
                    <option value="DSA">DSA (Digital Signature Algo)</option>
                    <option value="ECDSA">ECDSA (Elliptic Curves)</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Taille de la Clé (Bits)</label>
              <select
                className="form-select"
                value={tailleBits}
                onChange={(e) => setTailleBits(e.target.value)}
              >
                {type === 'SYMETRIQUE' ? (
                  algorithme === 'DES' ? (
                    <option value="56">56 bits</option>
                  ) : algorithme === 'DESede' ? (
                    <>
                      <option value="112">112 bits (2-Key)</option>
                      <option value="168">168 bits (3-Key)</option>
                    </>
                  ) : (
                    <>
                      <option value="128">128 bits</option>
                      <option value="192">192 bits</option>
                      <option value="256">256 bits (Recommandé)</option>
                    </>
                  )
                ) : (
                  algorithme === 'ECDSA' ? (
                    <>
                      <option value="256">P-256 (secp256r1)</option>
                      <option value="384">P-384 (secp384r1)</option>
                      <option value="521">P-521 (secp521r1)</option>
                    </>
                  ) : (
                    <>
                      <option value="1024">1024 bits</option>
                      <option value="2048">2048 bits (Standard)</option>
                      <option value="3072">3072 bits (Sécurité Haute)</option>
                      <option value="4096">4096 bits (Très Haute)</option>
                    </>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nom / Alias de la clé</label>
            <input
              type="text"
              className="form-input"
              placeholder={`ex: Ma_Cle_${algorithme}`}
              value={nomCle}
              onChange={(e) => setNomCle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Sauvegarde C:/MTDSI</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 0' }}>
                <input
                  type="checkbox"
                  checked={sauvegarderServeur}
                  onChange={(e) => setSauvegarderServeur(e.target.checked)}
                />
                <span style={{ fontSize: '0.88rem' }}>Activer l'enregistrement local</span>
              </label>
            </div>

            {sauvegarderServeur && (
              <div className="form-group">
                <label className="form-label">Nom du fichier</label>
                <input
                  type="text"
                  className="form-input"
                  value={nomFichier}
                  onChange={(e) => setNomFichier(e.target.value)}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Génération cryptographique...' : '⚡ Générer la Clé'}
          </button>
        </form>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '12px', borderRadius: '10px', marginTop: '16px', fontSize: '0.88rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Affichage du résultat */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Résultats & Métadonnées</h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Visualisation et exportation des clés générées.
        </p>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '10px', color: '#34d399', fontSize: '0.88rem' }}>
              ✅ {result.message}
            </div>

            {result.cheminFichierServeur && (
              <div style={{ fontSize: '0.82rem', background: 'var(--bg-input)', padding: '8px 12px', borderRadius: '8px' }}>
                📁 <strong>Fichier sauvegardé :</strong> <code>{result.cheminFichierServeur}</code>
              </div>
            )}

            {/* Si Clé Symétrique */}
            {result.type === 'SYMETRIQUE' && (
              <>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label">Valeur Hexadécimale (Utils.toHex)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result.secretKeyHex, 'symHex')}>
                        {copiedField === 'symHex' ? 'Copié !' : 'Copier Hex'}
                      </button>
                      <button className="btn btn-emerald btn-sm" onClick={() => downloadFile(result.secretKeyHex, 'secret_key.hex')}>
                        Télécharger
                      </button>
                    </div>
                  </div>
                  <div className="code-box">{result.secretKeyHex}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label">Valeur Base64</label>
                    <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result.secretKeyBase64, 'symB64')}>
                      {copiedField === 'symB64' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="code-box">{result.secretKeyBase64}</div>
                </div>
              </>
            )}

            {/* Si Clé Asymétrique */}
            {result.type === 'ASYMETRIQUE' && (
              <>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label">Clé Publique (Format X.509 PEM)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result.publicKeyPem, 'pubPem')}>
                        {copiedField === 'pubPem' ? 'Copié !' : 'Copier PEM'}
                      </button>
                      <button className="btn btn-emerald btn-sm" onClick={() => downloadFile(result.publicKeyPem, 'public_key.pem')}>
                        Télécharger
                      </button>
                    </div>
                  </div>
                  <div className="code-box">{result.publicKeyPem}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label">Clé Privée (Format PKCS#8 PEM)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result.privateKeyPem, 'privPem')}>
                        {copiedField === 'privPem' ? 'Copié !' : 'Copier PEM'}
                      </button>
                      <button className="btn btn-emerald btn-sm" onClick={() => downloadFile(result.privateKeyPem, 'private_key.pem')}>
                        Télécharger
                      </button>
                    </div>
                  </div>
                  <div className="code-box">{result.privateKeyPem}</div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔑</div>
            <p>Sélectionnez les paramètres et cliquez sur "Générer la Clé".</p>
          </div>
        )}
      </div>

      {/* Historique des clés sauvegardées en BDD */}
      {savedKeys.length > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '28px', gridColumn: '1 / -1' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>📚 Clés Enregistrées dans la Base de Données</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Nom</th>
                  <th style={{ padding: '10px' }}>Type</th>
                  <th style={{ padding: '10px' }}>Algorithme</th>
                  <th style={{ padding: '10px' }}>Taille</th>
                  <th style={{ padding: '10px' }}>Format</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {savedKeys.map((k) => (
                  <tr key={k.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{k.nomCle}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${k.typeCle.includes('ASYM') ? 'badge-admin' : 'badge-user'}`}>
                        {k.typeCle}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{k.algorithme}</td>
                    <td style={{ padding: '10px' }}>{k.tailleBits} bits</td>
                    <td style={{ padding: '10px' }}><code>{k.format}</code></td>
                    <td style={{ padding: '10px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => copyToClipboard(k.cleValeur, `table_${k.id}`)}
                      >
                        {copiedField === `table_${k.id}` ? 'Copié !' : 'Copier'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documentation Détaillée : KeyGen */}
      <div className="glass-card animate-fade-in" style={{ padding: '32px', gridColumn: '1 / -1', marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          📖 Comprendre la Génération de Clés Cryptographiques
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Bloc Symétrique */}
          <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-cyan)' }}>1. Cryptographie Symétrique (SecretKey)</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              La cryptographie symétrique utilise <strong>une seule et même clé</strong> pour le chiffrement et le déchiffrement. Cette clé doit rester absolument secrète et être partagée via un canal sécurisé.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              <li><strong>AES (Advanced Encryption Standard)</strong> : Le standard actuel du gouvernement américain. Recommandé en 256 bits pour une sécurité de niveau militaire (Top Secret).</li>
              <li><strong>DES / 3DES</strong> : Anciens standards obsolètes (56 bits), vulnérables aux attaques par force brute modernes. Le 3DES applique l'algorithme 3 fois (168 bits) mais reste lent.</li>
              <li><strong>Blowfish / RC4</strong> : Algorithmes alternatifs. RC4 est un chiffrement de flux (stream cipher) très rapide mais considéré cryptographiquement cassé aujourd'hui.</li>
            </ul>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderLeft: '3px solid var(--accent-cyan)', padding: '12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>BouncyCastle & JCA :</strong> En Java, l'interface <code>KeyGenerator</code> est utilisée pour instancier la clé. Le provider BouncyCastle assure l'implémentation de la génération aléatoire robuste via <code>SecureRandom</code>.
            </div>
          </div>

          {/* Bloc Asymétrique */}
          <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-purple)' }}>2. Cryptographie Asymétrique (KeyPair)</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Aussi appelée cryptographie à clé publique (PKI). Elle génère <strong>une paire de clés</strong> liées mathématiquement : une Clé Publique (qui peut être distribuée à tous) et une Clé Privée (gardée secrète).
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              <li><strong>RSA</strong> : Basé sur la difficulté mathématique de factoriser le produit de très grands nombres premiers. 2048 bits est le minimum légal aujourd'hui (NIST). 4096 bits offre une sécurité à très long terme.</li>
              <li><strong>DSA / ECDSA</strong> : Algorithmes dédiés spécifiquement à la Signature Numérique. L'ECDSA utilise les courbes elliptiques, permettant d'avoir la même sécurité que RSA 3072 avec une clé de seulement 256 bits !</li>
            </ul>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', borderLeft: '3px solid var(--accent-purple)', padding: '12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>Formats d'Export :</strong> Les clés publiques sont toujours encodées au format standard <strong>X.509</strong>. Les clés privées sont encodées au format <strong>PKCS#8</strong> pour assurer la compatibilité avec tous les autres systèmes (OpenSSL, SSH, etc.).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
