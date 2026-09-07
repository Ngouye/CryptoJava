package sn.ucad.tdsi.crypto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.ucad.tdsi.crypto.model.CryptoKey;

import java.util.List;

@Repository
public interface CryptoKeyRepository extends JpaRepository<CryptoKey, Long> {
    List<CryptoKey> findByUserIdOrderByDateGenerationDesc(Long userId);
    List<CryptoKey> findByUserIdAndAlgorithme(Long userId, String algorithme);
}
