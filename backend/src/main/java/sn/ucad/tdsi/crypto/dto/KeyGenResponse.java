package sn.ucad.tdsi.crypto.dto;

import java.util.Map;

public class KeyGenResponse {
    private boolean success;
    private String message;
    private String type; // SYMETRIQUE ou ASYMETRIQUE
    private String algorithme;
    private int tailleBits;
    
    // Pour clé symétrique
    private String secretKeyHex;
    private String secretKeyBase64;
    
    // Pour paire asymétrique (RSA, DSA, ECDSA)
    private String publicKeyHex;
    private String publicKeyBase64;
    private String publicKeyPem; // X.509
    
    private String privateKeyHex;
    private String privateKeyBase64;
    private String privateKeyPem; // PKCS#8
    
    private String cheminFichierServeur;
    private Map<String, Object> parametresTechniques;

    public KeyGenResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAlgorithme() { return algorithme; }
    public void setAlgorithme(String algorithme) { this.algorithme = algorithme; }

    public int getTailleBits() { return tailleBits; }
    public void setTailleBits(int tailleBits) { this.tailleBits = tailleBits; }

    public String getSecretKeyHex() { return secretKeyHex; }
    public void setSecretKeyHex(String secretKeyHex) { this.secretKeyHex = secretKeyHex; }

    public String getSecretKeyBase64() { return secretKeyBase64; }
    public void setSecretKeyBase64(String secretKeyBase64) { this.secretKeyBase64 = secretKeyBase64; }

    public String getPublicKeyHex() { return publicKeyHex; }
    public void setPublicKeyHex(String publicKeyHex) { this.publicKeyHex = publicKeyHex; }

    public String getPublicKeyBase64() { return publicKeyBase64; }
    public void setPublicKeyBase64(String publicKeyBase64) { this.publicKeyBase64 = publicKeyBase64; }

    public String getPublicKeyPem() { return publicKeyPem; }
    public void setPublicKeyPem(String publicKeyPem) { this.publicKeyPem = publicKeyPem; }

    public String getPrivateKeyHex() { return privateKeyHex; }
    public void setPrivateKeyHex(String privateKeyHex) { this.privateKeyHex = privateKeyHex; }

    public String getPrivateKeyBase64() { return privateKeyBase64; }
    public void setPrivateKeyBase64(String privateKeyBase64) { this.privateKeyBase64 = privateKeyBase64; }

    public String getPrivateKeyPem() { return privateKeyPem; }
    public void setPrivateKeyPem(String privateKeyPem) { this.privateKeyPem = privateKeyPem; }

    public String getCheminFichierServeur() { return cheminFichierServeur; }
    public void setCheminFichierServeur(String cheminFichierServeur) { this.cheminFichierServeur = cheminFichierServeur; }

    public Map<String, Object> getParametresTechniques() { return parametresTechniques; }
    public void setParametresTechniques(Map<String, Object> parametresTechniques) { this.parametresTechniques = parametresTechniques; }
}
