package sn.ucad.tdsi.crypto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sn.ucad.tdsi.crypto.dto.SignRequest;
import sn.ucad.tdsi.crypto.dto.SignResponse;
import sn.ucad.tdsi.crypto.dto.VerifyRequest;
import sn.ucad.tdsi.crypto.dto.VerifyResponse;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@Service
public class SignatureService {

    @Autowired
    private AuditService auditService;

    /**
     * Signature électronique de données (avec ou sans hachage préalable)
     */
    public SignResponse signData(SignRequest request, String username) {
        SignResponse response = new SignResponse();
        try {
            String sigAlgo = request.getAlgorithmeSignature() != null ? request.getAlgorithmeSignature() : "SHA256withRSA";
            String keyType = determineKeyType(sigAlgo);

            PrivateKey privateKey = loadPrivateKey(request.getClePrivee(), keyType, request.getFormatCle());
            byte[] messageBytes = request.getMessage() != null ? request.getMessage().getBytes(StandardCharsets.UTF_8) : new byte[0];
            byte[] signatureBytes;

            if (request.isAvecHachagePrealable()) {
                // Mode 2 étapes (TP4 / SystemeAsymetrique) : Hash puis Signature du digest
                String hashAlgo = request.getAlgorithmeHachage() != null ? request.getAlgorithmeHachage() : "SHA-256";
                MessageDigest md = MessageDigest.getInstance(hashAlgo);
                byte[] digest = md.digest(messageBytes);
                response.setEmpreinteHachageHex(CryptoUtils.toHex(digest));

                // Signature du condensat avec l'algorithme brut correspondant (ex: "NONEwithRSA" ou "NONEwithECDSA")
                String rawSigAlgo = "NONEwith" + keyType;
                Signature signature = Signature.getInstance(rawSigAlgo);
                signature.initSign(privateKey);
                signature.update(digest);
                signatureBytes = signature.sign();
            } else {
                // Signature directe standard (SHA256withRSA, etc.)
                Signature signature = Signature.getInstance(sigAlgo);
                signature.initSign(privateKey);
                signature.update(messageBytes);
                signatureBytes = signature.sign();
            }

            response.setSuccess(true);
            response.setAlgorithme(sigAlgo);
            response.setSignatureHex(CryptoUtils.toHex(signatureBytes));
            response.setSignatureBase64(CryptoUtils.toBase64(signatureBytes));
            response.setTailleOctets(signatureBytes.length);
            response.setMessage("Signature électronique (" + sigAlgo + ") générée avec succès.");

            auditService.logAction(null, username, "SIGNATURE", sigAlgo, "SUCCES", "Taille signature : " + signatureBytes.length + " octets");
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Erreur lors de la signature électronique : " + e.getMessage());
            auditService.logAction(null, username, "SIGNATURE_ERROR", request.getAlgorithmeSignature(), "ECHEC", e.getMessage());
            return response;
        }
    }

    /**
     * Vérification de signature électronique
     */
    public VerifyResponse verifySignature(VerifyRequest request, String username) {
        VerifyResponse response = new VerifyResponse();
        long start = System.currentTimeMillis();

        try {
            String sigAlgo = request.getAlgorithmeSignature() != null ? request.getAlgorithmeSignature() : "SHA256withRSA";
            String keyType = determineKeyType(sigAlgo);

            PublicKey publicKey = loadPublicKey(request.getClePublique(), keyType, request.getFormatCle());
            byte[] messageBytes = request.getMessage() != null ? request.getMessage().getBytes(StandardCharsets.UTF_8) : new byte[0];

            byte[] sigBytes;
            if ("HEX".equalsIgnoreCase(request.getFormatSignature()) || (request.getSignature() != null && request.getSignature().matches("^[0-9a-fA-F]+$"))) {
                sigBytes = CryptoUtils.fromHex(request.getSignature());
            } else {
                sigBytes = CryptoUtils.fromBase64(request.getSignature());
            }

            boolean isValid;

            if (request.isAvecHachagePrealable()) {
                String hashAlgo = request.getAlgorithmeHachage() != null ? request.getAlgorithmeHachage() : "SHA-256";
                MessageDigest md = MessageDigest.getInstance(hashAlgo);
                byte[] digest = md.digest(messageBytes);

                String rawSigAlgo = "NONEwith" + keyType;
                Signature signature = Signature.getInstance(rawSigAlgo);
                signature.initVerify(publicKey);
                signature.update(digest);
                isValid = signature.verify(sigBytes);
            } else {
                Signature signature = Signature.getInstance(sigAlgo);
                signature.initVerify(publicKey);
                signature.update(messageBytes);
                isValid = signature.verify(sigBytes);
            }

            response.setSuccess(true);
            response.setValide(isValid);
            response.setAlgorithme(sigAlgo);
            response.setTempsVerificationMs(System.currentTimeMillis() - start);
            response.setMessage(isValid ? "La signature électronique est VALIDE et AUTHENTIQUE." : "La signature électronique est INVALIDE (altération détectée).");

            auditService.logAction(null, username, "VERIFICATION", sigAlgo, isValid ? "SUCCES" : "ECHEC", "Résultat : " + isValid);
            return response;

        } catch (Exception e) {
            response.setSuccess(false);
            response.setValide(false);
            response.setAlgorithme(request.getAlgorithmeSignature());
            response.setTempsVerificationMs(System.currentTimeMillis() - start);
            response.setMessage("Erreur lors de la vérification : " + e.getMessage());
            auditService.logAction(null, username, "VERIF_ERROR", request.getAlgorithmeSignature(), "ECHEC", e.getMessage());
            return response;
        }
    }

    private String determineKeyType(String sigAlgo) {
        if (sigAlgo == null) return "RSA";
        if (sigAlgo.contains("ECDSA") || sigAlgo.contains("EC")) return "EC";
        if (sigAlgo.contains("DSA")) return "DSA";
        return "RSA";
    }

    private PrivateKey loadPrivateKey(String keyStr, String keyType, String format) throws Exception {
        byte[] keyBytes;
        if (keyStr.contains("BEGIN PRIVATE KEY")) {
            keyBytes = CryptoUtils.cleanPemKey(keyStr);
        } else if ("BASE64".equalsIgnoreCase(format)) {
            keyBytes = CryptoUtils.fromBase64(keyStr);
        } else if ("HEX".equalsIgnoreCase(format) || (keyStr != null && keyStr.matches("^[0-9a-fA-F]+$"))) {
            keyBytes = CryptoUtils.fromHex(keyStr);
        } else {
            keyBytes = CryptoUtils.fromBase64(keyStr.trim());
        }

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance(keyType.equals("EC") ? "EC" : keyType);
        return kf.generatePrivate(spec);
    }

    private PublicKey loadPublicKey(String keyStr, String keyType, String format) throws Exception {
        byte[] keyBytes;
        if (keyStr.contains("BEGIN PUBLIC KEY")) {
            keyBytes = CryptoUtils.cleanPemKey(keyStr);
        } else if ("BASE64".equalsIgnoreCase(format)) {
            keyBytes = CryptoUtils.fromBase64(keyStr);
        } else if ("HEX".equalsIgnoreCase(format) || (keyStr != null && keyStr.matches("^[0-9a-fA-F]+$"))) {
            keyBytes = CryptoUtils.fromHex(keyStr);
        } else {
            keyBytes = CryptoUtils.fromBase64(keyStr.trim());
        }

        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance(keyType.equals("EC") ? "EC" : keyType);
        return kf.generatePublic(spec);
    }
}
