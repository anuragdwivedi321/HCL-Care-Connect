package com.careconnect.ehr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_encounters")
public class ClinicalEncounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long providerId;

    @Column(nullable = false, length = 120)
    private String providerName;

    @Column(nullable = false)
    private LocalDateTime encounterDate = LocalDateTime.now();

    @Column(nullable = false, length = 30)
    private String encounterType; // OUTPATIENT, INPATIENT, EMERGENCY, TELEHEALTH

    @Column(nullable = false, length = 250)
    private String chiefComplaint;

    @Lob
    @Column(length = 4000)
    private String soapSubjective; // Patient symptoms, history of present illness

    @Lob
    @Column(length = 4000)
    private String soapObjective; // Physical examination findings, observed vitals

    @Lob
    @Column(length = 4000)
    private String soapAssessment; // Diagnosis, clinical impression

    @Lob
    @Column(length = 4000)
    private String soapPlan; // Treatment plan, medications, follow-up, lifestyle advice

    @Column(length = 200)
    private String icd10Codes; // e.g. "I10 (Essential Hypertension), E11.9 (Type 2 Diabetes)"

    @Column(nullable = false, length = 20)
    private String status = "COMPLETED"; // IN_PROGRESS, COMPLETED, SIGNED

    private LocalDateTime signedAt;

    @Column(length = 120)
    private String signedBy;

    public ClinicalEncounter() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public LocalDateTime getEncounterDate() { return encounterDate; }
    public void setEncounterDate(LocalDateTime encounterDate) { this.encounterDate = encounterDate; }

    public String getEncounterType() { return encounterType; }
    public void setEncounterType(String encounterType) { this.encounterType = encounterType; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getSoapSubjective() { return soapSubjective; }
    public void setSoapSubjective(String soapSubjective) { this.soapSubjective = soapSubjective; }

    public String getSoapObjective() { return soapObjective; }
    public void setSoapObjective(String soapObjective) { this.soapObjective = soapObjective; }

    public String getSoapAssessment() { return soapAssessment; }
    public void setSoapAssessment(String soapAssessment) { this.soapAssessment = soapAssessment; }

    public String getSoapPlan() { return soapPlan; }
    public void setSoapPlan(String soapPlan) { this.soapPlan = soapPlan; }

    public String getIcd10Codes() { return icd10Codes; }
    public void setIcd10Codes(String icd10Codes) { this.icd10Codes = icd10Codes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }

    public String getSignedBy() { return signedBy; }
    public void setSignedBy(String signedBy) { this.signedBy = signedBy; }
}
