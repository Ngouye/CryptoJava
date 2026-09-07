package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO pour l'inscription d'un nouvel utilisateur (endpoint public /api/auth/register).
 */
@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Le login est requis")
    private String login;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le nom complet est requis")
    private String nomComplet;

}
