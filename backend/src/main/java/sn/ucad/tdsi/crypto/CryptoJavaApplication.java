package sn.ucad.tdsi.crypto;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import sn.ucad.tdsi.crypto.model.User;
import sn.ucad.tdsi.crypto.repository.UserRepository;

import java.io.File;
import java.security.Security;
import java.time.LocalDateTime;

@SpringBootApplication
public class CryptoJavaApplication {

    public static void main(String[] args) {
        // Enregistrement dynamique du Provider Bouncy Castle (JCA/JCE)
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
            System.out.println("[BouncyCastle] Fournisseur de sécurité enregistré avec succès.");
        }
        SpringApplication.run(CryptoJavaApplication.class, args);
    }

    @Value("${crypto.storage.directory:C:/MTDSI}")
    private String storageDirectory;

    /**
     * Initialisation automatique des répertoires de travail et des utilisateurs par défaut
     */
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Création du répertoire de stockage des clés/fichiers
            File dir = new File(storageDirectory);
            if (!dir.exists()) {
                dir.mkdirs();
                System.out.println("[Storage] Répertoire " + storageDirectory + " créé avec succès.");
            }

            // Vérification et création des utilisateurs par défaut
            if (userRepository.findByLogin("admin").isEmpty()) {
                User admin = new User();
                admin.setLogin("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@ucad.edu.sn");
                admin.setNomComplet("Administrateur Principal TDSI");
                admin.setRole("admin");
                admin.setActif(true);
                admin.setDateCreation(LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("[Init] Compte Admin par défaut créé (login: admin / mdp: admin123)");
            }

            if (userRepository.findByLogin("user").isEmpty()) {
                User user = new User();
                user.setLogin("user");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setEmail("etudiant@ucad.edu.sn");
                user.setNomComplet("Étudiant M2 TDSI");
                user.setRole("user");
                user.setActif(true);
                user.setDateCreation(LocalDateTime.now());
                userRepository.save(user);
                System.out.println("[Init] Compte User par défaut créé (login: user / mdp: user123)");
            }

            if (userRepository.findByLogin("demba.sow").isEmpty()) {
                User prof = new User();
                prof.setLogin("demba.sow");
                prof.setPassword(passwordEncoder.encode("admin123"));
                prof.setEmail("demba.sow@ucad.edu.sn");
                prof.setNomComplet("Pr. Demba SOW");
                prof.setRole("admin");
                prof.setActif(true);
                prof.setDateCreation(LocalDateTime.now());
                userRepository.save(prof);
                System.out.println("[Init] Compte Pr. Demba SOW créé (login: demba.sow / mdp: admin123)");
            }
        };
    }
}
