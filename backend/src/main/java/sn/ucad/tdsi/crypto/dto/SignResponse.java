package sn.ucad.tdsi.crypto.dto;

public class SignResponse {
    private boolean success;
    private String message;
    private String algorithme;
    private String signatureHex;
    private String signatureBase64;
    private String empreinteHachageHex; // Si hachage préalable
    private int tailleOctets;

    public SignResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAlgorithme() { return algorithme; }
    public void setAlgorithme(String algorithme) { this.algorithme = algorithme; }

    public String getSignatureHex() { return signatureHex; }
    public void setSignatureHex(String signatureHex) { this.signatureHex = signatureHex; }

    public String getSignatureBase64() { return signatureBase64; }
    public void setSignatureBase64(String signatureBase64) { this.signatureBase64 = signatureBase64; }

    public String getEmpreinteHachageHex() { return empreinteHachageHex; }
    public void setEmpreinteHachageHex(String empreinteHachageHex) { this.empreinteHachageHex = empreinteHachageHex; }

    public int getTailleOctets() { return tailleOctets; }
    public void setTailleOctets(int tailleOctets) { this.tailleOctets = tailleOctets; }
}
