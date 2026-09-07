package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KeyGenRequest {
    @NotBlank(message = "Le type de clé est requis (SYMETRIQUE/ASYMETRIQUE)")
    private String type; // "SYMETRIQUE" ou "ASYMETRIQUE"

    @NotBlank(message = "L'algorithme est requis")
    private String algorithme; // "AES", "DES", "DESede", "Blowfish", "RSA", "DSA", "ECDSA"

    @NotNull(message = "La taille en bits est requise")
    private Integer tailleBits; // 128, 192, 256, 1024, 2048, 4096

    @NotBlank(message = "Le nom de la clé est requis")
    private String nomCle;

    private String formatExport; // "HEX", "BASE64", "PEM"
    private Boolean sauvegarderServeur = false;
    private String nomFichier; // Ex: "key.txt", "pubKey.txt"

}
