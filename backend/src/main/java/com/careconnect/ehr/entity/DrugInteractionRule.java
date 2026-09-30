package com.careconnect.ehr.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "drug_interactions")
public class DrugInteractionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String drugA;

    @Column(nullable = false, length = 100)
    private String drugB;

    @Column(nullable = false, length = 20)
    private String severity; // HIGH, MODERATE, LOW

    @Column(nullable = false, length = 500)
    private String description;

    @Column(length = 500)
    private String clinicalRecommendation;

    public DrugInteractionRule() {}

    public DrugInteractionRule(String drugA, String drugB, String severity, String description, String clinicalRecommendation) {
        this.drugA = drugA;
        this.drugB = drugB;
        this.severity = severity;
        this.description = description;
        this.clinicalRecommendation = clinicalRecommendation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
