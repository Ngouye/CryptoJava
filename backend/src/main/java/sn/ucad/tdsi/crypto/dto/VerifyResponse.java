package sn.ucad.tdsi.crypto.dto;

public class VerifyResponse {
    private boolean success;
    private boolean valide; // Vrai si la signature est mathématiquement valide
    private String message;
    private String algorithme;
    private long tempsVerificationMs;

    public VerifyResponse() {}

    public VerifyResponse(boolean success, boolean valide, String message, String algorithme) {
        this.success = success;
        this.valide = valide;
        this.message = message;
        this.algorithme = algorithme;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public boolean isValide() { return valide; }
    public void setValide(boolean valide) { this.valide = valide; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAlgorithme() { return algorithme; }
    public void setAlgorithme(String algorithme) { this.algorithme = algorithme; }

    public long getTempsVerificationMs() { return tempsVerificationMs; }
    public void setTempsVerificationMs(long tempsVerificationMs) { this.tempsVerificationMs = tempsVerificationMs; }
}
