package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyRequest {
    @NotBlank(message = "L'algorithme de signature est requis")
    private String algorithmeSignature; // "SHA256withRSA", "SHA256withDSA", "SHA256withECDSA"

    @NotBlank(message = "Le message est requis")
    private String message;

    @NotBlank(message = "La signature est requise")
    private String signature; // Signature en Hex ou Base64

    @NotBlank(message = "La clé publique est requise")
    private String clePublique; // Clé publique PEM ou X.509 Hex/Base64
    private String formatSignature; // "HEX", "BASE64"
    private String formatCle; // "PEM", "HEX", "BASE64"
    private boolean avecHachagePrealable = false;
    private String algorithmeHachage;

}
