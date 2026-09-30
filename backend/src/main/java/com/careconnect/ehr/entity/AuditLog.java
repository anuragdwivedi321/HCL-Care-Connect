package com.careconnect.ehr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(nullable = false, length = 60)
    private String performedBy;

    @Column(length = 30)
    private String userRole;

    @Column(nullable = false, length = 50)
    private String action; // VIEW_PATIENT, CREATE_PATIENT, UPDATE_PATIENT, SIGN_SOAP_NOTE, PLACE_CPOE_ORDER, PRESCRIBE_MEDICATION, LOGIN, ACCESS_PORTAL

    @Column(nullable = false, length = 50)
    private String entityName; // Patient, ClinicalEncounter, MedicalOrder, Prescription, User

    private Long entityId;

    @Column(length = 1000)
    private String details;

    @Column(length = 45)
    private String ipAddress;

    public AuditLog() {}

    public AuditLog(String performedBy, String userRole, String action, String entityName, Long entityId, String details, String ipAddress) {
        this.performedBy = performedBy;
        this.userRole = userRole;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.details = details;
        this.ipAddress = ipAddress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
