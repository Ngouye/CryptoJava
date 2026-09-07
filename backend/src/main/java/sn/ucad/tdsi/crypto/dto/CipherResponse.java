package sn.ucad.tdsi.crypto.dto;

public class CipherResponse {
    private boolean success;
    private String message;
    private String operation; // ENCRYPT ou DECRYPT
    private String algorithme;
    private String texteSortie; // Texte chiffré (Base64/Hex) ou texte déchiffré en clair
    private String formatSortie;
    private String ivUtilise; // IV généré ou utilisé en Hex
    private long tempsExecutionMs;
    private String fichierSortieChemin;

    public CipherResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }

    public String getAlgorithme() { return algorithme; }
    public void setAlgorithme(String algorithme) { this.algorithme = algorithme; }

    public String getTexteSortie() { return texteSortie; }
    public void setTexteSortie(String texteSortie) { this.texteSortie = texteSortie; }

    public String getFormatSortie() { return formatSortie; }
    public void setFormatSortie(String formatSortie) { this.formatSortie = formatSortie; }

    public String getIvUtilise() { return ivUtilise; }
    public void setIvUtilise(String ivUtilise) { this.ivUtilise = ivUtilise; }

    public long getTempsExecutionMs() { return tempsExecutionMs; }
    public void setTempsExecutionMs(long tempsExecutionMs) { this.tempsExecutionMs = tempsExecutionMs; }

    public String getFichierSortieChemin() { return fichierSortieChemin; }
    public void setFichierSortieChemin(String fichierSortieChemin) { this.fichierSortieChemin = fichierSortieChemin; }
}
