package com.careconnect.ehr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_orders")
public class MedicalOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long providerId;

    private Long encounterId;

    @Column(nullable = false, length = 30)
    private String orderType; // LAB, RADIOLOGY, PROCEDURE

    @Column(nullable = false, length = 150)
    private String orderName;

    @Column(length = 30)
    private String loincCode; // LOINC standard healthcare code

    @Column(nullable = false, length = 20)
    private String priority; // ROUTINE, URGENT, STAT

    @Column(length = 500)
    private String clinicalIndication;

    @Column(nullable = false, length = 25)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(nullable = false)
    private LocalDateTime orderedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    @Lob
    @Column(length = 4000)
    private String resultNotes;

    @Column(length = 100)
    private String normalRange;

    private Boolean flaggedAbnormal = false;

    public MedicalOrder() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public Long getEncounterId() { return encounterId; }
    public void setEncounterId(Long encounterId) { this.encounterId = encounterId; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getOrderName() { return orderName; }
    public void setOrderName(String orderName) { this.orderName = orderName; }

    public String getLoincCode() { return loincCode; }
    public void setLoincCode(String loincCode) { this.loincCode = loincCode; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getClinicalIndication() { return clinicalIndication; }
    public void setClinicalIndication(String clinicalIndication) { this.clinicalIndication = clinicalIndication; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOrderedAt() { return orderedAt; }
    public void setOrderedAt(LocalDateTime orderedAt) { this.orderedAt = orderedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getResultNotes() { return resultNotes; }
    public void setResultNotes(String resultNotes) { this.resultNotes = resultNotes; }

    public String getNormalRange() { return normalRange; }
    public void setNormalRange(String normalRange) { this.normalRange = normalRange; }

    public Boolean getFlaggedAbnormal() { return flaggedAbnormal; }
    public void setFlaggedAbnormal(Boolean flaggedAbnormal) { this.flaggedAbnormal = flaggedAbnormal; }
}
