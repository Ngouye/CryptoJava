package sn.ucad.tdsi.crypto.dto;

import java.util.Map;

public class HashResponse {
    private boolean success;
    private String message;
    private String algorithme;
    private String hashHex;
    private String hashBase64;
    private int tailleOctets;
    private int tailleBits;
    private Boolean integre; // True si comparaison effectuée et valide
    private Map<String, String> multiHashes; // MD5, SHA1, SHA256 calculés en parallèle

    public HashResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAlgorithme() { return algorithme; }
    public void setAlgorithme(String algorithme) { this.algorithme = algorithme; }

    public String getHashHex() { return hashHex; }
    public void setHashHex(String hashHex) { this.hashHex = hashHex; }

    public String getHashBase64() { return hashBase64; }
    public void setHashBase64(String hashBase64) { this.hashBase64 = hashBase64; }

    public int getTailleOctets() { return tailleOctets; }
    public void setTailleOctets(int tailleOctets) { this.tailleOctets = tailleOctets; }

    public int getTailleBits() { return tailleBits; }
    public void setTailleBits(int tailleBits) { this.tailleBits = tailleBits; }

    public Boolean getIntegre() { return integre; }
    public void setIntegre(Boolean integre) { this.integre = integre; }

    public Map<String, String> getMultiHashes() { return multiHashes; }
    public void setMultiHashes(Map<String, String> multiHashes) { this.multiHashes = multiHashes; }
}
