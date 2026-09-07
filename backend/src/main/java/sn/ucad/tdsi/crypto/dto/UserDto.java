package sn.ucad.tdsi.crypto.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String login;
    private String password; // Optionnel lors des mises à jour
    private String email;
    private String nomComplet;
    private String role; // "admin" ou "user"
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime derniereConnexion;

}
