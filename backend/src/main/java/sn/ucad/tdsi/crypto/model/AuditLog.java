package sn.ucad.tdsi.crypto.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String action; // GEN_KEY, CHIFFREMENT, DECHIFFREMENT, HACHAGE, SIGNATURE, VERIFICATION

    @Column(nullable = false, length = 50)
    private String algorithme;

    @Column(nullable = false, length = 20)
    private String statut; // SUCCES, ECHEC

    @Column(columnDefinition = "TEXT")
    private String details;

    @Builder.Default
    @Column(name = "date_action")
    private LocalDateTime dateAction = LocalDateTime.now();

}
