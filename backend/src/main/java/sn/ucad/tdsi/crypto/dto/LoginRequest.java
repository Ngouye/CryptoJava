package sn.ucad.tdsi.crypto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "Le login est requis")
    private String login;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;

}
