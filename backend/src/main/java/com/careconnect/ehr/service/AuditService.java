package com.careconnect.ehr.service;

import com.careconnect.ehr.entity.AuditLog;
import com.careconnect.ehr.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String performedBy, String userRole, String action, String entityName, Long entityId, String details, String ipAddress) {
        AuditLog log = new AuditLog(performedBy, userRole, action, entityName, entityId, details, ipAddress != null ? ipAddress : "127.0.0.1");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsForEntity(String entityName, Long entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByTimestampDesc(entityName, entityId);
    }
}
