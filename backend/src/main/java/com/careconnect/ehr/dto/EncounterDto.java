package com.careconnect.ehr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EncounterDto {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long providerId;
    private String providerName;
    private LocalDateTime encounterDate;

    @NotBlank(message = "Encounter type is required")
    private String encounterType;

    @NotBlank(message = "Chief complaint is required")
    private String chiefComplaint;

    private String soapSubjective;
    private String soapObjective;
    private String soapAssessment;
    private String soapPlan;
    private String icd10Codes;
    private String status;
    private LocalDateTime signedAt;
    private String signedBy;

    public EncounterDto() {}

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
