# Projet Crypto-JAVA — Master 2 TDSI (2025-2026)
**Université Cheikh Anta Diop de Dakar (UCAD) — FST / LACGAA**  
**Enseignant : Pr. Demba SOW**

---

## 📌 Présentation de l'Application

Application Fullstack moderne de **chiffrement, hachage et signature de données** développée dans le cadre du Master 2 TDSI / MCS.

### 🏗️ Architecture Technique
- **Backend** : Spring Boot 3 (Java 17/26), JCA/JCE avec Provider **Bouncy Castle**, Spring Security (JWT & RBAC), Spring Data JPA / JDBC.
- **Frontend** : Application React.js moderne (Vite, CSS Glassmorphism, Thème Sombre/Clair, formulaires interactifs).
- **Base de Données** : MySQL (ou H2 en fallback embarqué) avec script d'export `crypto_tdsi_database.sql`.

---

## 👥 Comptes Utilisateurs Pré-configurés

| Identifiant (Login) | Mot de passe | Rôle / Profil | Description |
| :--- | :--- | :--- | :--- |
| **admin** | `admin123` | `admin` | Administrateur principal (Gestion CRUD utilisateurs & Audit logs) |
| **user** | `user123` | `user` | Utilisateur standard (Accès aux 4 modules cryptographiques) |
| **demba.sow** | `admin123` | `admin` | Compte enseignant / évaluateur |

---

## 🚀 Guide de Démarrage Rapide

### 1. Base de Données (MySQL)
1. Ouvrez votre gestionnaire MySQL (phpMyAdmin, MySQL Workbench ou ligne de commande).
2. Exécutez le script SQL fourni : [sql/crypto_tdsi_database.sql](file:///c:/Users/DELL/Music/ProjectCryptoJava/sql/crypto_tdsi_database.sql).

### 2. Démarrage du Backend (Spring Boot)
Ouvrez un terminal dans le dossier `backend` :
```bash
# Avec Maven
mvn spring-boot:run

# OU directement avec le JAR exécutable compilé
java -jar target/crypto-java-backend-1.0.0.jar
```
Le backend démarrera sur : `http://localhost:8080`.

### 3. Démarrage du Frontend (React)
Ouvrez un second terminal dans le dossier `frontend` :
```bash
cd frontend
npm install
npm run dev
```
Accédez à l'application dans votre navigateur : `http://localhost:5173`.

---

## 🔑 Fonctionnalités Cryptographiques Intégrées

1. **Génération & Sauvegarde des Clés (Module 1)** :
   - Symétriques : AES (128, 192, 256 bits), DES (56 bits), 3DES (112, 168 bits), Blowfish, RC4.
   - Asymétriques : RSA (1024, 2048, 3072, 4096 bits), DSA, ECDSA (P-256, P-384, P-521).
   - Export : Hexadécimal (`Utils.toHex`), Base64, PEM (X.509 et PKCS#8), et sauvegarde locale dans `C:/MTDSI/`.
2. **Chiffrement / Déchiffrement (Module 2)** :
   - Texte clair ou cryptogramme.
   - Fichiers binaires (.pdf, .png, .docx, .zip) traités par flux chiffrés (`CipherInputStream` / `CipherOutputStream`).
   - Modes : CBC, GCM, ECB, CTR avec gestion du vecteur d'initialisation (IV).
   - Asymétrique RSA avec rembourrage PKCS1Padding / OAEP.
3. **Hachage & Intégrité / Authenticité (Module 3)** :
   - Hachage sans clé (Intégrité) : MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512.
   - Hachage avec clé (HMAC / Authenticité) : HmacSHA256, HmacSHA512, HmacMD5, HmacSHA1.
   - Tableau comparatif multi-algorithmes en temps réel et détecteur d'altération.
4. **Signature Électronique & Vérification (Module 4)** :
   - Signatures avec clés privées (SHA256withRSA, SHA512withRSA, DSA, ECDSA).
   - Mode signature directe et mode en 2 étapes (hachage explicite `MessageDigest` puis signature du condensat).
   - Module de vérification avec badge visuel d'authenticité.

---

## 📦 Génération du Livrable Final pour Remise

Pour préparer le dossier à envoyer à `sowdembis@gmail.com` :
1. Compilez le Fat JAR : `mvn clean package -DskipTests` (dans `backend/`).
2. Créez un dossier nommé `Prenom-Nom` (ex: `Mamadou-Diallo`).
3. Placez-y :
   - Le fichier `.jar` (depuis `backend/target/crypto-java-backend-1.0.0.jar`)
   - Le fichier SQL `sql/crypto_tdsi_database.sql`
   - Le rapport LaTeX et le PDF compilé `rapport/rapport_crypto_java.tex` et `rapport_crypto_java.pdf`
   - Le code source complet `backend/` et `frontend/`
