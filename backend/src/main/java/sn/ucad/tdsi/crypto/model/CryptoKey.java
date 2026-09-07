package sn.ucad.tdsi.crypto.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "crypto_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CryptoKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "nom_cle", nullable = false, length = 100)
    private String nomCle;

    @Column(name = "type_cle", nullable = false, length = 30)
    private String typeCle; // "SYMETRIQUE", "ASYMETRIQUE_PUBLIQUE", "ASYMETRIQUE_PRIVEE"

    @Column(nullable = false, length = 50)
    private String algorithme; // AES, RSA, DSA, etc.

    @Column(name = "taille_bits", nullable = false)
    private Integer tailleBits;

    @Lob
    @Column(name = "cle_valeur", nullable = false, columnDefinition = "TEXT")
    private String cleValeur; // Hex ou Base64 ou PEM

    @Column(nullable = false, length = 20)
    private String format; // RAW_HEX, X.509, PKCS#8

    @Builder.Default
    @Column(name = "date_generation")
    private LocalDateTime dateGeneration = LocalDateTime.now();

}
