-- ====================================================================
-- UCAD / FST / LACGAA - Master 2 TDSI / MCS (2025-2026)
-- Matière : Cryptographie-JAVA (Pr. Demba SOW)
-- Base de Données : crypto_tdsi_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS crypto_tdsi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crypto_tdsi_db;

-- --------------------------------------------------------------------
-- Table des Utilisateurs (Gestion des profils 'admin' et 'user')
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Mot de passe haché avec BCrypt
    email VARCHAR(100) NOT NULL UNIQUE,
    nom_complet VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' ou 'user'
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Table des Clés Cryptographiques (Sauvegarde et Métadonnées)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crypto_keys (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    nom_cle VARCHAR(100) NOT NULL,
    type_cle ENUM('SYMETRIQUE', 'ASYMETRIQUE_PUBLIQUE', 'ASYMETRIQUE_PRIVEE') NOT NULL,
    algorithme VARCHAR(50) NOT NULL, -- AES, RSA, DSA, etc.
    taille_bits INT NOT NULL,
    cle_valeur TEXT NOT NULL, -- Représentation Hex / Base64 / PEM
    format VARCHAR(20) NOT NULL, -- RAW, X.509, PKCS#8
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Table d'Audit des Opérations Cryptographiques (Journalisation)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(50) NOT NULL, -- 'GEN_KEY', 'CHIFFREMENT', 'DECHIFFREMENT', 'HACHAGE', 'SIGNATURE', 'VERIFICATION'
    algorithme VARCHAR(50) NOT NULL,
    statut ENUM('SUCCES', 'ECHEC') NOT NULL,
    details TEXT NULL,
    ip_adresse VARCHAR(45) NULL,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- Données Initiales : Comptes par défaut
-- Mot de passe par défaut pour tous : 'admin123' / 'user123' (hachés BCrypt)
-- Hash BCrypt pour 'admin123' : $2a$10$e7K4Vj0x7p6QfM8mD.N4yeiFhJkO6M6HkJX6Jv2C6lZ/a2hE0p3qW
-- Hash BCrypt pour 'user123'  : $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOv7yom2m8eQe
-- --------------------------------------------------------------------
INSERT INTO users (login, password, email, nom_complet, role, actif, date_creation)
VALUES 
('admin', '$2a$10$e7K4Vj0x7p6QfM8mD.N4yeiFhJkO6M6HkJX6Jv2C6lZ/a2hE0p3qW', 'admin@ucad.edu.sn', 'Administrateur Principal', 'admin', TRUE, NOW()),
('user', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOv7yom2m8eQe', 'etudiant@ucad.edu.sn', 'Étudiant M2 TDSI', 'user', TRUE, NOW()),
('demba.sow', '$2a$10$e7K4Vj0x7p6QfM8mD.N4yeiFhJkO6M6HkJX6Jv2C6lZ/a2hE0p3qW', 'demba.sow@ucad.edu.sn', 'Pr. Demba SOW', 'admin', TRUE, NOW())
ON DUPLICATE KEY UPDATE login=login;

-- Insertion de quelques clés exemples
INSERT INTO crypto_keys (user_id, nom_cle, type_cle, algorithme, taille_bits, cle_valeur, format)
VALUES
(2, 'Cle_AES_Demo', 'SYMETRIQUE', 'AES', 256, 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90', 'RAW_HEX');
