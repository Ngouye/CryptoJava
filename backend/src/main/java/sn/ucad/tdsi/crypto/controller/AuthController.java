package sn.ucad.tdsi.crypto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sn.ucad.tdsi.crypto.config.JwtUtils;
import sn.ucad.tdsi.crypto.dto.*;
import sn.ucad.tdsi.crypto.model.User;
import sn.ucad.tdsi.crypto.repository.UserRepository;
import sn.ucad.tdsi.crypto.service.AuditService;
import jakarta.validation.Valid;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditService auditService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        if (request.getLogin() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Veuillez renseigner le login et le mot de passe."));
        }

        Optional<User> userOpt = userRepository.findByLogin(request.getLogin().trim());
        if (userOpt.isEmpty()) {
            auditService.logAction(null, request.getLogin(), "LOGIN_FAILED", "AUTH", "ECHEC", "Utilisateur non trouvé");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Identifiants incorrects (login ou mot de passe invalide)."));
        }

        User user = userOpt.get();
        if (!Boolean.TRUE.equals(user.getActif())) {
            auditService.logAction(user.getId(), user.getLogin(), "LOGIN_BLOCKED", "AUTH", "ECHEC", "Compte désactivé");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Ce compte est désactivé. Veuillez contacter un administrateur."));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            auditService.logAction(user.getId(), user.getLogin(), "LOGIN_FAILED", "AUTH", "ECHEC", "Mot de passe erroné");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Identifiants incorrects (login ou mot de passe invalide)."));
        }

        // Mise à jour de la date de dernière connexion
        user.setDerniereConnexion(LocalDateTime.now());
        userRepository.save(user);

        // Génération du token JWT
        String token = jwtUtils.generateToken(user.getLogin(), user.getRole());

        LoginResponse loginResponse = new LoginResponse(
                token,
                user.getId(),
                user.getLogin(),
                user.getNomComplet(),
                user.getEmail(),
                user.getRole()
        );

        auditService.logAction(user.getId(), user.getLogin(), "LOGIN_SUCCESS", "AUTH", "SUCCES", "Connexion réussie avec profil : " + user.getRole());
        return ResponseEntity.ok(ApiResponse.success("Connexion réussie !", loginResponse));
    }

    /**
     * Inscription publique d'un nouvel utilisateur (rôle 'user' par défaut).
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        // Validations
        if (request.getLogin() == null || request.getLogin().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Le login est obligatoire."));
        }
        if (request.getPassword() == null || request.getPassword().length() < 4) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Le mot de passe doit contenir au moins 4 caractères."));
        }
        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Veuillez fournir une adresse email valide."));
        }

        // Vérification d'unicité
        if (userRepository.existsByLogin(request.getLogin().trim())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Le login '" + request.getLogin() + "' est déjà utilisé."));
        }
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("L'adresse email '" + request.getEmail() + "' est déjà utilisée."));
        }

        // Création de l'utilisateur
        User user = new User();
        user.setLogin(request.getLogin().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail().trim());
        user.setNomComplet(request.getNomComplet() != null ? request.getNomComplet().trim() : request.getLogin());
        user.setRole("user");
        user.setActif(true);
        user.setDateCreation(LocalDateTime.now());
        user.setDerniereConnexion(LocalDateTime.now());

        User saved = userRepository.save(user);

        // Génération automatique du token JWT pour connexion immédiate
        String token = jwtUtils.generateToken(saved.getLogin(), saved.getRole());

        LoginResponse loginResponse = new LoginResponse(
                token,
                saved.getId(),
                saved.getLogin(),
                saved.getNomComplet(),
                saved.getEmail(),
                saved.getRole()
        );

        auditService.logAction(saved.getId(), saved.getLogin(), "REGISTER", "AUTH", "SUCCES", "Inscription réussie pour " + saved.getLogin());
        return ResponseEntity.ok(ApiResponse.success("Inscription réussie ! Bienvenue " + saved.getNomComplet() + " !", loginResponse));
    }

    /**
     * Changement de mot de passe (utilisateur authentifié).
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Non authentifié."));
        }

        User user = userRepository.findByLogin(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Utilisateur non trouvé."));
        }

        // Vérification de l'ancien mot de passe
        if (!passwordEncoder.matches(request.getAncienMotDePasse(), user.getPassword())) {
            auditService.logAction(user.getId(), user.getLogin(), "CHANGE_PASSWORD", "AUTH", "ECHEC", "Ancien mot de passe incorrect");
            return ResponseEntity.badRequest().body(ApiResponse.error("L'ancien mot de passe est incorrect."));
        }

        // Validation du nouveau mot de passe
        if (request.getNouveauMotDePasse() == null || request.getNouveauMotDePasse().length() < 4) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Le nouveau mot de passe doit contenir au moins 4 caractères."));
        }

        // Mise à jour
        user.setPassword(passwordEncoder.encode(request.getNouveauMotDePasse()));
        userRepository.save(user);

        auditService.logAction(user.getId(), user.getLogin(), "CHANGE_PASSWORD", "AUTH", "SUCCES", "Mot de passe modifié avec succès");
        return ResponseEntity.ok(ApiResponse.success("Mot de passe modifié avec succès !", "OK"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Non authentifié"));
        }
        User user = userRepository.findByLogin(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Utilisateur non trouvé"));
        }
        return ResponseEntity.ok(ApiResponse.success("Profil récupéré", user));
    }
}
