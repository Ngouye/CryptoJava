import React, { useState } from 'react';
import { api } from '../services/api';

export default function CipherModule() {
  const [targetType, setTargetType] = useState('TEXT'); // TEXT ou FILE
  const [type, setType] = useState('SYMETRIQUE'); // SYMETRIQUE ou ASYMETRIQUE
  const [operation, setOperation] = useState('ENCRYPT'); // ENCRYPT ou DECRYPT
  const [algorithme, setAlgorithme] = useState('AES');
  const [mode, setMode] = useState('CBC');
  const [padding, setPadding] = useState('PKCS5Padding');
  const [cle, setCle] = useState('');
  const [iv, setIv] = useState('');
  const [texteEntree, setTexteEntree] = useState('');
  const [formatSortie, setFormatSortie] = useState('BASE64');

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'ASYMETRIQUE') {
      setAlgorithme('RSA');
      setMode('ECB');
      setPadding('PKCS1Padding');
    } else {
      setAlgorithme('AES');
      setMode('CBC');
      setPadding('PKCS5Padding');
    }
  };

  const handleSubmitText = async (e) => {
    e.preventDefault();
    if (!cle || !texteEntree) {
      setError('Veuillez fournir la clé et le texte à traiter.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.processCipher({
        type,
        algorithme,
        mode,
        padding,
        operation,
        cle,
        iv,
        texteEntree,
        formatSortie
      });

      if (res.success) {
        setResult(res.data);
        if (res.data.ivUtilise) {
          setIv(res.data.ivUtilise);
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Erreur lors du traitement : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!selectedFile || !cle) {
      setError('Veuillez sélectionner un fichier et fournir une clé.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('algo', algorithme);
      formData.append('key', cle);
      formData.append('operation', operation);
      if (iv) formData.append('iv', iv);

      const blob = await api.processFileCipher(formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = operation === 'ENCRYPT' ? `${selectedFile.name}.enc` : selectedFile.name.replace('.enc', '.dec');
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setResult({
        success: true,
        message: `Fichier traité et téléchargé avec succès (${operation === 'ENCRYPT' ? 'Chiffré' : 'Déchiffré'}).`,
        operation,
        algorithme
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du traitement du fichier.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result && result.texteSortie) {
      navigator.clipboard.writeText(result.texteSortie);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
      {/* Formulaire Principal */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Chiffrement & Déchiffrement</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Module 2 (TP3 & Chiffrement Symétrique / Asymétrique)</p>
          </div>
          <span className="badge badge-user">Flux Sécurisés</span>
        </div>

        {/* Choix Texte vs Fichier */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <button
            type="button"
            className={`btn ${targetType === 'TEXT' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTargetType('TEXT')}
          >
            📝 Texte / Chaîne
          </button>
          <button
            type="button"
            className={`btn ${targetType === 'FILE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTargetType('FILE')}
          >
            📁 Fichier Binaire
          </button>
        </div>

        {/* Choix Opération Chiffrement vs Déchiffrement */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${operation === 'ENCRYPT' ? 'btn-emerald' : 'btn-secondary'}`}
            onClick={() => setOperation('ENCRYPT')}
          >
            🔒 Chiffrer (Encrypt)
          </button>
          <button
            type="button"
            className={`btn ${operation === 'DECRYPT' ? 'btn-rose' : 'btn-secondary'}`}
            onClick={() => setOperation('DECRYPT')}
          >
            🔓 Déchiffrer (Decrypt)
          </button>
        </div>

        {/* Paramètres Cryptographiques */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Type de Système</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              disabled={targetType === 'FILE'} // Les fichiers sont traités en symétrique flux
            >
              <option value="SYMETRIQUE">Symétrique (AES, DES, Blowfish)</option>
              <option value="ASYMETRIQUE">Asymétrique (RSA)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Algorithme</label>
            <select
              className="form-select"
              value={algorithme}
              onChange={(e) => setAlgorithme(e.target.value)}
            >
              {type === 'SYMETRIQUE' ? (
                <>
                  <option value="AES">AES</option>
                  <option value="DES">DES</option>
                  <option value="DESede">3DES</option>
                  <option value="Blowfish">Blowfish</option>
                </>
              ) : (
                <option value="RSA">RSA</option>
              )}
            </select>
          </div>
        </div>

        {type === 'SYMETRIQUE' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Mode d'Opération</label>
              <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="CBC">CBC (Cipher Block Chaining)</option>
                <option value="GCM">GCM (Galois/Counter Mode)</option>
                <option value="ECB">ECB (Electronic Codebook)</option>
                <option value="CTR">CTR (Counter)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Rembourrage (Padding)</label>
              <select className="form-select" value={padding} onChange={(e) => setPadding(e.target.value)}>
                <option value="PKCS5Padding">PKCS5Padding</option>
                <option value="NoPadding">NoPadding</option>
              </select>
            </div>
          </div>
        )}

        {/* Saisie de la Clé */}
        <div className="form-group">
          <label className="form-label">
            {type === 'SYMETRIQUE' ? 'Clé Secrète (Hex ou Base64)' : (operation === 'ENCRYPT' ? 'Clé Publique RSA (PEM / Base64)' : 'Clé Privée RSA (PEM / Base64)')}
          </label>
          <textarea
            className="form-textarea"
            style={{ minHeight: type === 'ASYMETRIQUE' ? '120px' : '70px' }}
            placeholder={type === 'SYMETRIQUE' ? 'Collez ici la clé Hex générée au Module 1...' : '-----BEGIN PUBLIC KEY-----\n...'}
            value={cle}
            onChange={(e) => setCle(e.target.value)}
            required
          />
        </div>

        {/* Saisie de l'IV si mode symétrique non-ECB */}
        {type === 'SYMETRIQUE' && mode !== 'ECB' && (
          <div className="form-group">
            <label className="form-label">Vecteur d'Initialisation IV (Hex - Optionnel en chiffrement)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Laisser vide pour auto-générer un IV aléatoire..."
              value={iv}
              onChange={(e) => setIv(e.target.value)}
            />
          </div>
        )}

        {/* Saisie texte ou fichier */}
        {targetType === 'TEXT' ? (
          <form onSubmit={handleSubmitText}>
            <div className="form-group">
              <label className="form-label">
                {operation === 'ENCRYPT' ? 'Texte en clair à chiffrer' : 'Texte chiffré (Base64 ou Hex)'}
              </label>
              <textarea
                className="form-textarea"
                placeholder={operation === 'ENCRYPT' ? 'Saisissez votre message confidentiel...' : 'Collez le cryptogramme...'}
                value={texteEntree}
                onChange={(e) => setTexteEntree(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={`btn ${operation === 'ENCRYPT' ? 'btn-primary' : 'btn-emerald'}`} style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Traitement en cours...' : (operation === 'ENCRYPT' ? '🔒 Exécuter le Chiffrement' : '🔓 Exécuter le Déchiffrement')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitFile}>
            <div className="form-group">
              <label className="form-label">Sélectionnez le fichier</label>
              <input
                type="file"
                className="form-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className={`btn ${operation === 'ENCRYPT' ? 'btn-primary' : 'btn-emerald'}`} style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Traitement du fichier...' : (operation === 'ENCRYPT' ? '🔒 Chiffrer & Télécharger Fichier' : '🔓 Déchiffrer & Télécharger Fichier')}
            </button>
          </form>
        )}

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '12px', borderRadius: '10px', marginTop: '16px', fontSize: '0.88rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Résultat du Chiffrement / Déchiffrement */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Résultat de l'Opération</h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Données résultantes après transformation cryptographique.
        </p>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '10px', color: '#34d399', fontSize: '0.88rem' }}>
              ✅ {result.message}
            </div>

            {result.ivUtilise && (
              <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>VECTEUR D'INITIALISATION (IV) UTILISÉ (HEX) :</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-cyan)' }}>{result.ivUtilise}</div>
              </div>
            )}

            {result.tempsExecutionMs !== undefined && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="badge badge-user">⏱️ {result.tempsExecutionMs} ms</span>
                <span className="badge badge-admin">⚙️ {result.algorithme}</span>
              </div>
            )}

            {result.texteSortie && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label">
                    {result.operation === 'ENCRYPT' ? 'Cryptogramme (Texte Chiffré)' : 'Texte Déchiffré (Clair)'}
                  </label>
                  <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="code-box" style={{ minHeight: '140px' }}>
                  {result.texteSortie}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️</div>
            <p>Le résultat de l'opération (chiffrement ou déchiffrement) s'affichera ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
