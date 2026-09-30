package com.careconnect.ehr.controller;

import com.careconnect.ehr.entity.AuditLog;
import com.careconnect.ehr.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<List<AuditLog>> getAuditLogs(@RequestParam(required = false) String entityName,
                                                       @RequestParam(required = false) Long entityId) {
        if (entityName != null && entityId != null) {
            return ResponseEntity.ok(auditService.getLogsForEntity(entityName, entityId));
        }
        return ResponseEntity.ok(auditService.getRecentLogs());
    }
}
