package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HashRequest {
    @NotBlank(message = "L'algorithme est requis")
    private String algorithme; // "SHA-256", "MD5", "SHA-1", "SHA-512", "HmacSHA256", "HmacMD5", "HmacSHA1"

    @NotBlank(message = "Le texte est requis")
    private String texte; // Message à hacher
    private String cleMac; // Clé secrète si HMAC
    private String hashAttendu; // Pour vérification d'intégrité

}
