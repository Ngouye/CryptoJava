package sn.ucad.tdsi.crypto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sn.ucad.tdsi.crypto.model.AuditLog;
import sn.ucad.tdsi.crypto.repository.AuditLogRepository;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(Long userId, String username, String action, String algorithme, String statut, String details) {
        try {
            AuditLog log = AuditLog.builder()
                    .userId(userId)
                    .username(username)
                    .action(action)
                    .algorithme(algorithme)
                    .statut(statut)
                    .details(details)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("[AuditLog] Erreur lors de l'enregistrement du log : " + e.getMessage());
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByDateActionDesc();
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByDateActionDesc();
    }
}
