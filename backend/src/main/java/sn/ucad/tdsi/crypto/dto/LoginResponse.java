package sn.ucad.tdsi.crypto.dto;

public class LoginResponse {
    private String token;
    private Long id;
    private String login;
    private String nomComplet;
    private String email;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String token, Long id, String login, String nomComplet, String email, String role) {
        this.token = token;
        this.id = id;
        this.login = login;
        this.nomComplet = nomComplet;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
