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
import sn.ucad.tdsi.crypto.exception.RequestException;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class SymCryptoService {

    @Value("${crypto.storage.directory:C:/MTDSI}")
    private String storageDirectory;

    @Autowired
    private CryptoKeyRepository cryptoKeyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    /**
     * Génération d'une clé secrète symétrique (AES, DES, DESede, Blowfish)
     */
    public KeyGenResponse generateSymmetricKey(KeyGenRequest request, String username) {
        KeyGenResponse response = new KeyGenResponse();
        try {
            String algo = request.getAlgorithme() != null ? request.getAlgorithme().toUpperCase() : "AES";
            int keySize = request.getTailleBits() != null ? request.getTailleBits() : 256;

            // Ajustement des tailles de clé autorisées
            if ("DES".equalsIgnoreCase(algo)) keySize = 56;
            else if ("DESEDE".equalsIgnoreCase(algo) || "3DES".equalsIgnoreCase(algo)) {
                algo = "DESede";
                keySize = (keySize == 112) ? 112 : 168;
            } else if ("AES".equalsIgnoreCase(algo)) {
                if (keySize != 128 && keySize != 192 && keySize != 256) keySize = 256;
            }

            KeyGenerator kg = KeyGenerator.getInstance(algo, "BC");
            kg.init(keySize, new SecureRandom());
            SecretKey secretKey = kg.generateKey();

            byte[] keyEncoded = secretKey.getEncoded();
            String keyHex = CryptoUtils.toHex(keyEncoded);
            String keyBase64 = CryptoUtils.toBase64(keyEncoded);

            response.setSuccess(true);
            response.setType("SYMETRIQUE");
            response.setAlgorithme(algo);
            response.setTailleBits(keyEncoded.length * 8);
            response.setSecretKeyHex(keyHex);
            response.setSecretKeyBase64(keyBase64);
            response.setMessage("Clé symétrique " + algo + " (" + (keyEncoded.length * 8) + " bits) générée avec succès.");

            Map<String, Object> params = new HashMap<>();
            params.put("format", secretKey.getFormat());
            params.put("encodedLengthBytes", keyEncoded.length);
            response.setParametresTechniques(params);

            // Sauvegarde dans la base de données
            if (username != null) {
                User user = userRepository.findByLogin(username).orElse(null);
                if (user != null) {
                    CryptoKey keyEntity = new CryptoKey();
                    keyEntity.setUser(user);
                    keyEntity.setNomCle(request.getNomCle() != null ? request.getNomCle() : "Cle_" + algo + "_" + System.currentTimeMillis());
                    keyEntity.setTypeCle("SYMETRIQUE");
                    keyEntity.setAlgorithme(algo);
                    keyEntity.setTailleBits(keyEncoded.length * 8);
                    keyEntity.setCleValeur(keyHex);
                    keyEntity.setFormat("RAW_HEX");
                    keyEntity.setDateGeneration(LocalDateTime.now());
                    cryptoKeyRepository.save(keyEntity);
                }
            }

            // Sauvegarde sur fichier serveur (C:/MTDSI/key.txt) si demandée
            if (Boolean.TRUE.equals(request.getSauvegarderServeur())) {
                String filename = (request.getNomFichier() != null && !request.getNomFichier().isEmpty()) 
                        ? request.getNomFichier() : "key_" + algo.toLowerCase() + ".txt";
                String fullPath = CryptoUtils.saveToFile(keyEncoded, storageDirectory, filename);
                response.setCheminFichierServeur(fullPath);
            }

            auditService.logAction(null, username, "GEN_KEY_SYM", algo, "SUCCES", "Génération clé " + algo + " " + (keyEncoded.length * 8) + " bits");
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Erreur lors de la génération de clé symétrique : " + e.getMessage());
            auditService.logAction(null, username, "GEN_KEY_SYM", request.getAlgorithme(), "ECHEC", e.getMessage());
            return response;
        }
    }

    /**
     * Chiffrement ou Déchiffrement Symétrique (Texte)
     */
    public CipherResponse processSymmetricCipher(CipherRequest request, String username) {
        CipherResponse response = new CipherResponse();
        long start = System.currentTimeMillis();

        try {
            String algo = request.getAlgorithme() != null ? request.getAlgorithme().toUpperCase() : "AES";
            String mode = request.getMode() != null ? request.getMode().toUpperCase() : "CBC";
            String padding = request.getPadding() != null ? request.getPadding() : "PKCS5Padding";
            boolean isEncrypt = !"DECRYPT".equalsIgnoreCase(request.getOperation());

            // Reconstitution de la clé secrète
            byte[] keyBytes = decodeKey(request.getCle(), request.getFormatCle());
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, algo);

            String transformation = algo + "/" + mode + "/" + padding;
            if ("RC4".equalsIgnoreCase(algo) || "ARCFOUR".equalsIgnoreCase(algo)) {
                transformation = "RC4";
            }

            Cipher cipher = Cipher.getInstance(transformation, "BC");
            byte[] ivBytes;

            if (isEncrypt) {
                // Génération de l'IV si le mode le requiert
                if (!"ECB".equalsIgnoreCase(mode) && !"RC4".equalsIgnoreCase(algo)) {
                    int ivSize = "AES".equalsIgnoreCase(algo) ? 16 : 8;
                    if ("GCM".equalsIgnoreCase(mode)) ivSize = 12;

                    if (request.getIv() != null && !request.getIv().trim().isEmpty()) {
                        ivBytes = CryptoUtils.fromHex(request.getIv());
                    } else {
                        ivBytes = new byte[ivSize];
                        new SecureRandom().nextBytes(ivBytes);
                    }

                    if ("GCM".equalsIgnoreCase(mode)) {
                        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(128, ivBytes));
                    } else {
                        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(ivBytes));
                    }
                    response.setIvUtilise(CryptoUtils.toHex(ivBytes));
                } else {
                    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
                }

                byte[] inputBytes = request.getTexteEntree() != null ? request.getTexteEntree().getBytes(StandardCharsets.UTF_8) : new byte[0];
                byte[] encryptedBytes = cipher.doFinal(inputBytes);

                response.setSuccess(true);
                response.setOperation("ENCRYPT");
                response.setAlgorithme(transformation);
                response.setTexteSortie("HEX".equalsIgnoreCase(request.getFormatSortie()) ? CryptoUtils.toHex(encryptedBytes) : CryptoUtils.toBase64(encryptedBytes));
                response.setFormatSortie("HEX".equalsIgnoreCase(request.getFormatSortie()) ? "HEX" : "BASE64");
                response.setMessage("Chiffrement symétrique " + transformation + " réussi.");

            } else {
                // Déchiffrement
                byte[] cipherBytes;
                if ("HEX".equalsIgnoreCase(request.getFormatSortie()) || isHex(request.getTexteEntree())) {
                    cipherBytes = CryptoUtils.fromHex(request.getTexteEntree());
                } else {
                    cipherBytes = CryptoUtils.fromBase64(request.getTexteEntree());
                }

                if (!"ECB".equalsIgnoreCase(mode) && !"RC4".equalsIgnoreCase(algo)) {
                    if (request.getIv() == null || request.getIv().trim().isEmpty()) {
                        throw new RequestException("crypto.iv.required", new Object[]{mode});
                    }
                    ivBytes = CryptoUtils.fromHex(request.getIv());
                    if ("GCM".equalsIgnoreCase(mode)) {
                        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(128, ivBytes));
                    } else {
                        cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(ivBytes));
                    }
                } else {
                    cipher.init(Cipher.DECRYPT_MODE, secretKey);
                }

                byte[] decryptedBytes = cipher.doFinal(cipherBytes);
                String clearText = new String(decryptedBytes, StandardCharsets.UTF_8);

                response.setSuccess(true);
                response.setOperation("DECRYPT");
                response.setAlgorithme(transformation);
                response.setTexteSortie(clearText);
                response.setMessage("Déchiffrement symétrique " + transformation + " réussi.");
            }

            response.setTempsExecutionMs(System.currentTimeMillis() - start);
            auditService.logAction(null, username, isEncrypt ? "CHIFFREMENT_SYM" : "DECHIFFREMENT_SYM", algo, "SUCCES", "Transformation : " + transformation);
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Erreur lors du traitement cryptographique : " + e.getMessage());
            response.setTempsExecutionMs(System.currentTimeMillis() - start);
            auditService.logAction(null, username, "CIPHER_SYM_ERROR", request.getAlgorithme(), "ECHEC", e.getMessage());
            return response;
        }
    }

    /**
     * Traitement de fichiers avec flux chiffrés (CipherInputStream & CipherOutputStream)
     */
    public void processFileCipher(String algo, byte[] keyBytes, InputStream in, OutputStream out, boolean encrypt, byte[] iv) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, algo);
        String transformation = algo + "/CBC/PKCS5Padding";
        Cipher cipher = Cipher.getInstance(transformation, "BC");

        if (iv != null) {
            cipher.init(encrypt ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv));
        } else {
            cipher.init(encrypt ? Cipher.ENCRYPT_MODE : Cipher.DECRYPT_MODE, keySpec);
        }

        if (encrypt) {
            try (CipherOutputStream cos = new CipherOutputStream(out, cipher)) {
                byte[] buffer = new byte[4096];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    cos.write(buffer, 0, read);
                }
                cos.flush();
            }
        } else {
            try (CipherInputStream cis = new CipherInputStream(in, cipher)) {
                byte[] buffer = new byte[4096];
                int read;
                while ((read = cis.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                }
                out.flush();
            }
        }
    }

    private byte[] decodeKey(String keyStr, String format) {
        if (keyStr == null || keyStr.trim().isEmpty()) {
            throw new RequestException("crypto.secretkey.empty", new Object[]{});
        }
        if ("BASE64".equalsIgnoreCase(format)) {
            return CryptoUtils.fromBase64(keyStr);
        }
        if ("HEX".equalsIgnoreCase(format) || isHex(keyStr)) {
            return CryptoUtils.fromHex(keyStr);
        }
        return keyStr.getBytes(StandardCharsets.UTF_8);
    }

    private boolean isHex(String s) {
        if (s == null || s.isEmpty()) return false;
        return s.matches("^[0-9a-fA-F]+$");
    }
}
