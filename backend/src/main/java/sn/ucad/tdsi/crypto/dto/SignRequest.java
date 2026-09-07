package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignRequest {
    @NotBlank(message = "L'algorithme de signature est requis")
    private String algorithmeSignature; // "SHA256withRSA", "SHA512withRSA", "SHA256withDSA", "SHA256withECDSA"
    
    private String algorithmeHachage; // Ex: "SHA-256" si signature en 2 étapes (avec hachage préalable)
    private boolean avecHachagePrealable = false; // Mode explicite (hash direct puis signature du digest)
    
    @NotBlank(message = "Le message est requis")
    private String message; // Message en clair
    
    @NotBlank(message = "La clé privée est requise")
    private String clePrivee; // Clé privée PEM ou PKCS#8 Hex/Base64
    
    private String formatCle; // "PEM", "HEX", "BASE64"

}
