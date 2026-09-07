package sn.ucad.tdsi.crypto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sn.ucad.tdsi.crypto.dto.CipherRequest;
import sn.ucad.tdsi.crypto.dto.CipherResponse;
import sn.ucad.tdsi.crypto.dto.KeyGenRequest;
import sn.ucad.tdsi.crypto.dto.KeyGenResponse;
import sn.ucad.tdsi.crypto.model.CryptoKey;
import sn.ucad.tdsi.crypto.model.User;
import sn.ucad.tdsi.crypto.repository.CryptoKeyRepository;
import sn.ucad.tdsi.crypto.repository.UserRepository;

import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AsymCryptoService {

    @Value("${crypto.storage.directory:C:/MTDSI}")
    private String storageDirectory;

    @Autowired
    private CryptoKeyRepository cryptoKeyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    /**
     * Génération de paires de clés asymétriques (RSA, DSA, ECDSA)
     */
    public KeyGenResponse generateKeyPair(KeyGenRequest request, String username) {
        KeyGenResponse response = new KeyGenResponse();
        try {
            String algo = request.getAlgorithme() != null ? request.getAlgorithme().toUpperCase() : "RSA";
            int keySize = request.getTailleBits() != null ? request.getTailleBits() : 2048;

            KeyPairGenerator kpg;
            KeyPair kp;

            if ("ECDSA".equalsIgnoreCase(algo) || "EC".equalsIgnoreCase(algo)) {
                kpg = KeyPairGenerator.getInstance("EC", "BC");
                String curve = (keySize == 384) ? "secp384r1" : (keySize == 521 ? "secp521r1" : "secp256r1");
                kpg.initialize(new ECGenParameterSpec(curve), new SecureRandom());
                kp = kpg.generateKeyPair();
            } else if ("DSA".equalsIgnoreCase(algo)) {
                kpg = KeyPairGenerator.getInstance("DSA", "BC");
                kpg.initialize(keySize >= 2048 ? 2048 : 1024, new SecureRandom());
                kp = kpg.generateKeyPair();
            } else { // RSA par défaut
                kpg = KeyPairGenerator.getInstance("RSA", "BC");
                kpg.initialize(keySize, new SecureRandom());
                kp = kpg.generateKeyPair();
            }

            PublicKey pub = kp.getPublic();
            PrivateKey priv = kp.getPrivate();

            byte[] pubEncoded = pub.getEncoded();
            byte[] privEncoded = priv.getEncoded();

            String pubHex = CryptoUtils.toHex(pubEncoded);
            String pubBase64 = CryptoUtils.toBase64(pubEncoded);
            String pubPem = CryptoUtils.formatPublicKeyPem(pubEncoded);

            String privHex = CryptoUtils.toHex(privEncoded);
            String privBase64 = CryptoUtils.toBase64(privEncoded);
            String privPem = CryptoUtils.formatPrivateKeyPem(privEncoded);

            response.setSuccess(true);
            response.setType("ASYMETRIQUE");
            response.setAlgorithme(algo);
            response.setTailleBits(keySize);

            response.setPublicKeyHex(pubHex);
            response.setPublicKeyBase64(pubBase64);
            response.setPublicKeyPem(pubPem);

            response.setPrivateKeyHex(privHex);
            response.setPrivateKeyBase64(privBase64);
            response.setPrivateKeyPem(privPem);

            response.setMessage("Paire de clés asymétrique " + algo + " (" + keySize + " bits) générée avec succès.");

            Map<String, Object> params = new HashMap<>();
            params.put("formatPublicKey", pub.getFormat());   // X.509
            params.put("formatPrivateKey", priv.getFormat()); // PKCS#8
            if (pub instanceof RSAPublicKey rsaPub) {
                params.put("modulusBitLength", rsaPub.getModulus().bitLength());
                params.put("publicExponent", rsaPub.getPublicExponent().toString());
            }
            response.setParametresTechniques(params);

            // Sauvegarde dans la base de données
            if (username != null) {
                User user = userRepository.findByLogin(username).orElse(null);
                if (user != null) {
                    // Clé publique
                    CryptoKey pubEntity = new CryptoKey();
                    pubEntity.setUser(user);
                    pubEntity.setNomCle((request.getNomCle() != null ? request.getNomCle() : "Cle_" + algo) + "_Public");
                    pubEntity.setTypeCle("ASYMETRIQUE_PUBLIQUE");
                    pubEntity.setAlgorithme(algo);
                    pubEntity.setTailleBits(keySize);
                    pubEntity.setCleValeur(pubPem);
                    pubEntity.setFormat("X.509");
                    pubEntity.setDateGeneration(LocalDateTime.now());
                    cryptoKeyRepository.save(pubEntity);

                    // Clé privée
                    CryptoKey privEntity = new CryptoKey();
                    privEntity.setUser(user);
                    privEntity.setNomCle((request.getNomCle() != null ? request.getNomCle() : "Cle_" + algo) + "_Private");
                    privEntity.setTypeCle("ASYMETRIQUE_PRIVEE");
                    privEntity.setAlgorithme(algo);
                    privEntity.setTailleBits(keySize);
                    privEntity.setCleValeur(privPem);
                    privEntity.setFormat("PKCS#8");
                    privEntity.setDateGeneration(LocalDateTime.now());
                    cryptoKeyRepository.save(privEntity);
                }
            }

            // Sauvegarde sur fichier serveur (C:/MTDSI/pubKey.txt et privKey.txt) si demandée
            if (Boolean.TRUE.equals(request.getSauvegarderServeur())) {
                String pubFile = CryptoUtils.saveToFile(pubEncoded, storageDirectory, "pubKey_" + algo.toLowerCase() + ".txt");
                String privFile = CryptoUtils.saveToFile(privEncoded, storageDirectory, "privKey_" + algo.toLowerCase() + ".txt");
                response.setCheminFichierServeur(pubFile + " & " + privFile);
            }

            auditService.logAction(null, username, "GEN_KEY_ASYM", algo, "SUCCES", "Génération paire de clés " + algo + " " + keySize + " bits");
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Erreur lors de la génération asymétrique : " + e.getMessage());
            auditService.logAction(null, username, "GEN_KEY_ASYM", request.getAlgorithme(), "ECHEC", e.getMessage());
            return response;
        }
    }

    /**
     * Chiffrement Asymétrique RSA (avec Clé Publique)
     */
    public CipherResponse processAsymmetricCipher(CipherRequest request, String username) {
        CipherResponse response = new CipherResponse();
        long start = System.currentTimeMillis();

        try {
            boolean isEncrypt = !"DECRYPT".equalsIgnoreCase(request.getOperation());
            String padding = (request.getPadding() != null && request.getPadding().contains("OAEP"))
                    ? "RSA/ECB/OAEPWithSHA-256AndMGF1Padding"
                    : "RSA/ECB/PKCS1Padding";

            Cipher cipher = Cipher.getInstance(padding, "BC");

            if (isEncrypt) {
                // Chiffrement avec clé publique
                PublicKey publicKey = loadPublicKey(request.getCle(), request.getFormatCle());
                cipher.init(Cipher.ENCRYPT_MODE, publicKey);

                byte[] input = request.getTexteEntree() != null ? request.getTexteEntree().getBytes(StandardCharsets.UTF_8) : new byte[0];
                byte[] encrypted = cipher.doFinal(input);

                response.setSuccess(true);
                response.setOperation("ENCRYPT");
                response.setAlgorithme(padding);
                response.setTexteSortie("HEX".equalsIgnoreCase(request.getFormatSortie()) ? CryptoUtils.toHex(encrypted) : CryptoUtils.toBase64(encrypted));
                response.setFormatSortie("HEX".equalsIgnoreCase(request.getFormatSortie()) ? "HEX" : "BASE64");
                response.setMessage("Chiffrement asymétrique RSA (" + padding + ") réussi.");

            } else {
                // Déchiffrement avec clé privée
                PrivateKey privateKey = loadPrivateKey(request.getCle(), request.getFormatCle());
                cipher.init(Cipher.DECRYPT_MODE, privateKey);

                byte[] cipherBytes;
                if ("HEX".equalsIgnoreCase(request.getFormatSortie()) || isHex(request.getTexteEntree())) {
                    cipherBytes = CryptoUtils.fromHex(request.getTexteEntree());
                } else {
                    cipherBytes = CryptoUtils.fromBase64(request.getTexteEntree());
                }

                byte[] decrypted = cipher.doFinal(cipherBytes);
                String clearText = new String(decrypted, StandardCharsets.UTF_8);

                response.setSuccess(true);
                response.setOperation("DECRYPT");
                response.setAlgorithme(padding);
                response.setTexteSortie(clearText);
                response.setMessage("Déchiffrement asymétrique RSA (" + padding + ") réussi.");
            }

            response.setTempsExecutionMs(System.currentTimeMillis() - start);
            auditService.logAction(null, username, isEncrypt ? "CHIFFREMENT_ASYM" : "DECHIFFREMENT_ASYM", "RSA", "SUCCES", padding);
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Erreur lors du traitement asymétrique RSA : " + e.getMessage());
            response.setTempsExecutionMs(System.currentTimeMillis() - start);
            auditService.logAction(null, username, "CIPHER_ASYM_ERROR", "RSA", "ECHEC", e.getMessage());
            return response;
        }
    }

    public PublicKey loadPublicKey(String keyStr, String format) throws Exception {
        byte[] keyBytes;
        if (keyStr.contains("BEGIN PUBLIC KEY")) {
            keyBytes = CryptoUtils.cleanPemKey(keyStr);
        } else if ("BASE64".equalsIgnoreCase(format)) {
            keyBytes = CryptoUtils.fromBase64(keyStr);
        } else if ("HEX".equalsIgnoreCase(format) || isHex(keyStr)) {
            keyBytes = CryptoUtils.fromHex(keyStr);
        } else {
            keyBytes = CryptoUtils.fromBase64(keyStr.trim());
        }

        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA", "BC");
        return kf.generatePublic(spec);
    }

    public PrivateKey loadPrivateKey(String keyStr, String format) throws Exception {
        byte[] keyBytes;
        if (keyStr.contains("BEGIN PRIVATE KEY")) {
            keyBytes = CryptoUtils.cleanPemKey(keyStr);
        } else if ("BASE64".equalsIgnoreCase(format)) {
            keyBytes = CryptoUtils.fromBase64(keyStr);
        } else if ("HEX".equalsIgnoreCase(format) || isHex(keyStr)) {
            keyBytes = CryptoUtils.fromHex(keyStr);
        } else {
            keyBytes = CryptoUtils.fromBase64(keyStr.trim());
        }

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA", "BC");
        return kf.generatePrivate(spec);
    }

    private boolean isHex(String s) {
        if (s == null || s.isEmpty()) return false;
        return s.matches("^[0-9a-fA-F]+$");
    }
}
