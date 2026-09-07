package sn.ucad.tdsi.crypto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sn.ucad.tdsi.crypto.dto.HashRequest;
import sn.ucad.tdsi.crypto.dto.HashResponse;
import sn.ucad.tdsi.crypto.exception.RequestException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

@Service
public class HashService {

    @Autowired
    private AuditService auditService;

    /**
     * Calcul de condensat de hachage (avec ou sans clé / HMAC)
     */
    public HashResponse computeHash(HashRequest request, String username) {
        HashResponse response = new HashResponse();
        try {
            String algo = request.getAlgorithme() != null ? request.getAlgorithme() : "SHA-256";
            byte[] inputBytes = request.getTexte() != null ? request.getTexte().getBytes(StandardCharsets.UTF_8) : new byte[0];
            byte[] digestBytes;

            if (algo.startsWith("Hmac") || algo.startsWith("HMAC")) {
                // Hachage avec clé (HMAC)
                String hmacAlgo = algo;
                if (hmacAlgo.equalsIgnoreCase("HMAC-SHA256") || hmacAlgo.equalsIgnoreCase("HmacSHA256")) {
                    hmacAlgo = "HmacSHA256";
                } else if (hmacAlgo.equalsIgnoreCase("HMAC-MD5") || hmacAlgo.equalsIgnoreCase("HmacMD5")) {
                    hmacAlgo = "HmacMD5";
                } else if (hmacAlgo.equalsIgnoreCase("HMAC-SHA1") || hmacAlgo.equalsIgnoreCase("HmacSHA1")) {
                    hmacAlgo = "HmacSHA1";
                }

                if (request.getCleMac() == null || request.getCleMac().trim().isEmpty()) {
                    throw new RequestException("crypto.hmac.secretkey.required", new Object[]{});
                }

                byte[] keyBytes = request.getCleMac().getBytes(StandardCharsets.UTF_8);
                SecretKeySpec keySpec = new SecretKeySpec(keyBytes, hmacAlgo);
                Mac mac = Mac.getInstance(hmacAlgo);
                mac.init(keySpec);
                digestBytes = mac.doFinal(inputBytes);

                response.setMessage("Authentification par hachage avec clé (" + hmacAlgo + ") calculée avec succès.");
                auditService.logAction(null, username, "HMAC", hmacAlgo, "SUCCES", "Calcul HMAC pour " + inputBytes.length + " octets");

            } else {
                // Hachage sans clé (MessageDigest)
                MessageDigest md = MessageDigest.getInstance(algo);
                digestBytes = md.digest(inputBytes);

                // Multi-hash bonus (calcul simultané des standards pour comparaison d'intégrité)
                Map<String, String> multi = new HashMap<>();
                multi.put("MD5", CryptoUtils.toHex(MessageDigest.getInstance("MD5").digest(inputBytes)));
                multi.put("SHA-1", CryptoUtils.toHex(MessageDigest.getInstance("SHA-1").digest(inputBytes)));
                multi.put("SHA-256", CryptoUtils.toHex(MessageDigest.getInstance("SHA-256").digest(inputBytes)));
                multi.put("SHA-512", CryptoUtils.toHex(MessageDigest.getInstance("SHA-512").digest(inputBytes)));
                response.setMultiHashes(multi);

                response.setMessage("Condensat d'intégrité (" + algo + ") calculé avec succès.");
                auditService.logAction(null, username, "HACHAGE", algo, "SUCCES", "Hachage sans clé de " + inputBytes.length + " octets");
            }

            String hashHex = CryptoUtils.toHex(digestBytes);
            String hashBase64 = CryptoUtils.toBase64(digestBytes);

            response.setSuccess(true);
            response.setAlgorithme(algo);
            response.setHashHex(hashHex);
            response.setHashBase64(hashBase64);
            response.setTailleOctets(digestBytes.length);
            response.setTailleBits(digestBytes.length * 8);

            // Vérification de l'intégrité si un hash attendu a été fourni
            if (request.getHashAttendu() != null && !request.getHashAttendu().trim().isEmpty()) {
                String cleanExpected = request.getHashAttendu().trim().toLowerCase();
                boolean matches = cleanExpected.equalsIgnoreCase(hashHex) || cleanExpected.equals(hashBase64);
                response.setIntegre(matches);
            }

            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Erreur lors du calcul du hachage : " + e.getMessage());
            auditService.logAction(null, username, "HASH_ERROR", request.getAlgorithme(), "ECHEC", e.getMessage());
            return response;
        }
    }
}
