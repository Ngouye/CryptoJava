package sn.ucad.tdsi.crypto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.ucad.tdsi.crypto.model.AuditLog;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByDateActionDesc();
    List<AuditLog> findTop50ByOrderByDateActionDesc();
    List<AuditLog> findByUserIdOrderByDateActionDesc(Long userId);
}
