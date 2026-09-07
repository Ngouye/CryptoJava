package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CipherRequest {
    @NotBlank(message = "Le type est requis (SYMETRIQUE/ASYMETRIQUE)")
    private String type; // "SYMETRIQUE" ou "ASYMETRIQUE"

    @NotBlank(message = "L'algorithme est requis")
    private String algorithme; // "AES", "DES", "Blowfish", "RSA"

    private String mode; // "CBC", "GCM", "ECB", "CTR"
    private String padding; // "PKCS5Padding", "NoPadding", "OAEPWithSHA-256AndMGF1Padding"
    
    @NotBlank(message = "L'opération est requise (ENCRYPT/DECRYPT)")
    private String operation; // "ENCRYPT" ou "DECRYPT"

    private String texteEntree; // Texte en clair ou texte chiffré (Base64/Hex)

    @NotBlank(message = "La clé est requise")
    private String cle; // Clé secrète (Hex/Base64) ou Clé RSA (PEM/Hex)
    private String iv; // Vecteur d'initialisation (Optionnel, en Hex/Base64)
    private String formatCle; // "HEX", "BASE64", "PEM"
    private String formatSortie; // "BASE64", "HEX"
    private String nomFichierEntree; // Si opération sur fichier local
    private String nomFichierSortie; // Si opération sur fichier local

}
