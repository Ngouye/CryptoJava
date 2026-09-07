package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO pour le changement de mot de passe (endpoint authentifié /api/auth/change-password).
 */
@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "L'ancien mot de passe est requis")
    private String ancienMotDePasse;

    @NotBlank(message = "Le nouveau mot de passe est requis")
    private String nouveauMotDePasse;

}
