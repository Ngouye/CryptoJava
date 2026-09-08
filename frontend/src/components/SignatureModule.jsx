import React, { useState } from 'react';
import { api } from '../services/api';

export default function SignatureModule() {
  const [activeSubTab, setActiveSubTab] = useState('SIGN'); // SIGN ou VERIFY

  // Paramètres Signature
  const [algoSignature, setAlgoSignature] = useState('SHA256withRSA');
  const [avecHachagePrealable, setAvecHachagePrealable] = useState(false);
  const [algoHachage, setAlgoHachage] = useState('SHA-256');
  const [message, setMessage] = useState('');
  const [clePrivee, setClePrivee] = useState('');

  // Paramètres Vérification
  const [messageVerif, setMessageVerif] = useState('');
  const [signatureVerif, setSignatureVerif] = useState('');
  const [clePublique, setClePublique] = useState('');

  const [loading, setLoading] = useState(false);
  const [signResult, setSignResult] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSign = async (e) => {
    e.preventDefault();
    if (!message || !clePrivee) {
      setError('Veuillez saisir le message et la clé privée.');
      return;
    }
    setLoading(true);
    setError(null);
    setSignResult(null);

    try {
      const res = await api.signData({
        algorithmeSignature: algoSignature,
        avecHachagePrealable,
        algorithmeHachage: algoHachage,
        message,
        clePrivee
      });

      if (res.success) {
        setSignResult(res.data);
        // Préremplissage automatique du formulaire de vérification pour faciliter le test
        setMessageVerif(message);
        setSignatureVerif(res.data.signatureHex);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Erreur lors de la signature : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!messageVerif || !signatureVerif || !clePublique) {
      setError('Veuillez fournir le message, la signature et la clé publique.');
      return;
    }
    setLoading(true);
    setError(null);
    setVerifyResult(null);

    try {
      const res = await api.verifySignature({
        algorithmeSignature: algoSignature,
        avecHachagePrealable,
        algorithmeHachage: algoHachage,
        message: messageVerif,
        signature: signatureVerif,
        clePublique
      });

      if (res.success) {
        setVerifyResult(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Erreur lors de la vérification : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySignature = () => {
    if (signResult && signResult.signatureHex) {
      navigator.clipboard.writeText(signResult.signatureHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
      {/* Formulaire Principal (Signer ou Vérifier) */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Signature Électronique</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Module 4 (TP4 : Signature avec ou sans hachage préalable)</p>
          </div>
          <span className="badge badge-user">Non-Répudiation</span>
        </div>

        {/* Bascule Signer vs Vérifier */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${activeSubTab === 'SIGN' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('SIGN')}
          >
            ✍️ Signer des Données
          </button>
          <button
            type="button"
            className={`btn ${activeSubTab === 'VERIFY' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('VERIFY')}
          >
            🔍 Vérifier la Signature
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Algorithme de Signature</label>
            <select
              className="form-select"
              value={algoSignature}
              onChange={(e) => setAlgoSignature(e.target.value)}
            >
              <option value="SHA256withRSA">SHA256withRSA (Standard)</option>
              <option value="SHA512withRSA">SHA512withRSA (Haute Sécurité)</option>
              <option value="SHA256withDSA">SHA256withDSA</option>
              <option value="SHA256withECDSA">SHA256withECDSA (Courbes Elliptiques)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Mode d'Exécution</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 0' }}>
              <input
                type="checkbox"
                checked={avecHachagePrealable}
                onChange={(e) => setAvecHachagePrealable(e.target.checked)}
              />
              <span style={{ fontSize: '0.86rem' }}>Hachage explicite en 2 étapes (TP4)</span>
            </label>
            {avecHachagePrealable && (
              <select
                className="form-select"
                value={algoHachage}
                onChange={(e) => setAlgoHachage(e.target.value)}
                style={{ marginTop: '8px' }}
              >
                <option value="MD5">MD5</option>
                <option value="SHA-1">SHA-1</option>
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
              </select>
            )}
          </div>
        </div>

        {activeSubTab === 'SIGN' ? (
          <form onSubmit={handleSign}>
            <div className="form-group">
              <label className="form-label">Clé Privée du Signataire (PKCS#8 PEM ou Hex)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '110px' }}
                placeholder="-----BEGIN PRIVATE KEY-----\n..."
                value={clePrivee}
                onChange={(e) => setClePrivee(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message / Document à signer</label>
              <textarea
                className="form-textarea"
                placeholder="Saisissez le texte engageant à signer électroniquement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Génération de la signature...' : '⚡ Générer la Signature Numérique'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label className="form-label">Clé Publique du Signataire (X.509 PEM ou Hex)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '110px' }}
                placeholder="-----BEGIN PUBLIC KEY-----\n..."
                value={clePublique}
                onChange={(e) => setClePublique(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Original</label>
              <textarea
                className="form-textarea"
                placeholder="Saisissez le message original soumis à validation..."
                value={messageVerif}
                onChange={(e) => setMessageVerif(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Signature à vérifier (Hexadécimal ou Base64)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '70px' }}
                placeholder="Collez ici la chaîne de signature..."
                value={signatureVerif}
                onChange={(e) => setSignatureVerif(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-emerald" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Vérification cryptographique...' : '🔍 Vérifier la Signature'}
            </button>
          </form>
        )}

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '12px', borderRadius: '10px', marginTop: '16px', fontSize: '0.88rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Résultat Signature & Vérification */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Verdict & Métadonnées</h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Visualisation de la signature et résultat de la preuve cryptographique.
        </p>

        {/* Résultat Signature */}
        {signResult && activeSubTab === 'SIGN' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '10px', color: '#34d399', fontSize: '0.88rem' }}>
              ✅ {signResult.message}
            </div>

            {signResult.empreinteHachageHex && (
              <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMPREINTE DE HACHAGE DU MESSAGE (ÉTAPE 1 - HEX) :</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-cyan)' }}>{signResult.empreinteHachageHex}</div>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label">Signature Numérique Hexadécimale ({signResult.tailleOctets} octets)</label>
                <button className="btn btn-secondary btn-sm" onClick={copySignature}>
                  {copied ? 'Copié !' : 'Copier Hex'}
                </button>
              </div>
              <div className="code-box" style={{ minHeight: '120px' }}>
                {signResult.signatureHex}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label">Signature Numérique Base64</label>
              </div>
              <div className="code-box">
                {signResult.signatureBase64}
              </div>
            </div>
          </div>
        )}

        {/* Résultat Vérification */}
        {verifyResult && activeSubTab === 'VERIFY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: verifyResult.valide ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
              border: `2px solid ${verifyResult.valide ? '#34d399' : '#fb7185'}`,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
                {verifyResult.valide ? '✅' : '❌'}
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: verifyResult.valide ? '#34d399' : '#fb7185' }}>
                {verifyResult.valide ? 'SIGNATURE VALIDE ET CONFORME' : 'SIGNATURE INVALIDE / ALTÉRÉE'}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {verifyResult.message}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge badge-user">⏱️ {verifyResult.tempsVerificationMs} ms</span>
              <span className="badge badge-admin">⚙️ {verifyResult.algorithme}</span>
            </div>
          </div>
        )}

        {!signResult && !verifyResult && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✍️</div>
            <p>Effectuez une signature ou lancez une vérification pour visualiser le verdict.</p>
          </div>
        )}
      </div>
      {/* Documentation Détaillée : Signature */}
      <div className="glass-card animate-fade-in" style={{ padding: '32px', gridColumn: '1 / -1', marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          📖 Comprendre la Signature Numérique (X.509)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Bloc Principe */}
          <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-cyan)' }}>1. Le principe de Non-Répudiation</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              La signature numérique utilise la <strong>cryptographie asymétrique (RSA/DSA)</strong> à l'envers. Au lieu de chiffrer avec la clé publique, on "chiffre" l'empreinte du document avec notre <strong>Clé Privée</strong>.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              <li><strong>Signature</strong> : Vous hachez le message (ex: SHA-256), puis vous signez ce hachage avec votre clé privée.</li>
              <li><strong>Vérification</strong> : Tout le monde peut utiliser votre Clé Publique pour vérifier que la signature correspond bien au document.</li>
            </ul>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderLeft: '3px solid var(--accent-cyan)', padding: '12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>Bénéfices :</strong> Cela garantit à la fois l'<strong>Intégrité</strong> (le document n'a pas été modifié) et l'<strong>Authenticité / Non-Répudiation</strong> (vous ne pouvez pas nier avoir signé ce document, puisque vous seul possédez la clé privée).
            </div>
          </div>

          {/* Bloc Algorithmes */}
          <div style={{ background: 'var(--bg-input)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-purple)' }}>2. Les Algorithmes de Signature</h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Une signature numérique est toujours la combinaison d'une fonction de hachage et d'un algorithme à clé publique.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              <li><strong>SHA256withRSA</strong> : Le standard absolu (PKCS#1 v1.5). Utilise SHA-256 pour hacher et RSA pour signer. Requis pour les certificats SSL/TLS modernes.</li>
              <li><strong>SHA512withRSA</strong> : Version encore plus sécurisée, privilégiée pour les documents de très haute importance légale (contrats d'État, transactions bancaires massives).</li>
              <li><strong>ECDSA (Elliptic Curves)</strong> : Souvent vu sous le nom <code>SHA256withECDSA</code>, il est beaucoup plus rapide et produit des signatures plus petites, ce qui est idéal pour la blockchain (Bitcoin, Ethereum).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
