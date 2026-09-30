package com.careconnect.ehr.dto;

import java.util.List;

public class InteractionCheckRequest {
    private Long patientId;
    private String newMedication;
    private List<String> currentMedications;

    public InteractionCheckRequest() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getNewMedication() { return newMedication; }
    public void setNewMedication(String newMedication) { this.newMedication = newMedication; }

    public List<String> getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(List<String> currentMedications) { this.currentMedications = currentMedications; }
}
