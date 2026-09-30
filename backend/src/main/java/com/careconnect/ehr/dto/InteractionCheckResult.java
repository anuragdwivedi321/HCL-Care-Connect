package com.careconnect.ehr.dto;

public class InteractionCheckResult {
    private boolean hasInteraction;
    private String drugA;
    private String drugB;
    private String severity; // HIGH, MODERATE, LOW
    private String description;
    private String clinicalRecommendation;

    public InteractionCheckResult() {}

    public InteractionCheckResult(boolean hasInteraction) {
        this.hasInteraction = hasInteraction;
    }

    public InteractionCheckResult(boolean hasInteraction, String drugA, String drugB, String severity, String description, String clinicalRecommendation) {
        this.hasInteraction = hasInteraction;
        this.drugA = drugA;
        this.drugB = drugB;
        this.severity = severity;
        this.description = description;
        this.clinicalRecommendation = clinicalRecommendation;
    }

    public boolean isHasInteraction() { return hasInteraction; }
    public void setHasInteraction(boolean hasInteraction) { this.hasInteraction = hasInteraction; }

    public String getDrugA() { return drugA; }
    public void setDrugA(String drugA) { this.drugA = drugA; }

    public String getDrugB() { return drugB; }
    public void setDrugB(String drugB) { this.drugB = drugB; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getClinicalRecommendation() { return clinicalRecommendation; }
    public void setClinicalRecommendation(String clinicalRecommendation) { this.clinicalRecommendation = clinicalRecommendation; }
}
