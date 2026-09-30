package com.careconnect.ehr.service;

import com.careconnect.ehr.dto.InteractionCheckResult;
import com.careconnect.ehr.dto.PrescriptionDto;
import com.careconnect.ehr.entity.DrugInteractionRule;
import com.careconnect.ehr.entity.Prescription;
import com.careconnect.ehr.repository.DrugInteractionRuleRepository;
import com.careconnect.ehr.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationService {

    private final PrescriptionRepository prescriptionRepository;
    private final DrugInteractionRuleRepository interactionRepository;
    private final AuditService auditService;

    public MedicationService(PrescriptionRepository prescriptionRepository,
                             DrugInteractionRuleRepository interactionRepository,
                             AuditService auditService) {
        this.prescriptionRepository = prescriptionRepository;
        this.interactionRepository = interactionRepository;
        this.auditService = auditService;
    }

    public List<PrescriptionDto> getPrescriptionsByPatient(Long patientId, boolean activeOnly) {
        List<Prescription> list;
        if (activeOnly) {
            list = prescriptionRepository.findByPatientIdAndStatus(patientId, "ACTIVE");
        } else {
            list = prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(patientId);
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<InteractionCheckResult> checkInteractions(Long patientId, String newMedicationName) {
        List<Prescription> activeMeds = prescriptionRepository.findByPatientIdAndStatus(patientId, "ACTIVE");
        List<InteractionCheckResult> warnings = new ArrayList<>();

        for (Prescription activeMed : activeMeds) {
            List<DrugInteractionRule> rules = interactionRepository.findInteraction(
                    activeMed.getMedicationName().trim(),
                    newMedicationName.trim()
            );

            for (DrugInteractionRule rule : rules) {
                warnings.add(new InteractionCheckResult(
                        true,
                        rule.getDrugA(),
                        rule.getDrugB(),
                        rule.getSeverity(),
                        rule.getDescription(),
                        rule.getClinicalRecommendation()
                ));
            }
        }

        return warnings;
    }

    @Transactional
    public PrescriptionDto prescribe(PrescriptionDto dto, Long providerId, String providerName, String userRole, String ipAddress) {
        Prescription prescription = new Prescription();
        prescription.setPatientId(dto.getPatientId());
        prescription.setProviderId(providerId != null ? providerId : 1L);
        prescription.setEncounterId(dto.getEncounterId());
        prescription.setMedicationName(dto.getMedicationName());
        prescription.setRxNormCode(dto.getRxNormCode());
        prescription.setDosage(dto.getDosage());
        prescription.setFrequency(dto.getFrequency());
        prescription.setRoute(dto.getRoute());
        prescription.setDurationDays(dto.getDurationDays());
        prescription.setInstructions(dto.getInstructions());
        prescription.setRefills(dto.getRefills() != null ? dto.getRefills() : 0);
        prescription.setStatus("ACTIVE");
        prescription.setPrescribedAt(LocalDateTime.now());

        Prescription saved = prescriptionRepository.save(prescription);

        auditService.log(providerName, userRole, "PRESCRIBE_MEDICATION", "Prescription", saved.getId(),
                "E-Prescribed " + saved.getMedicationName() + " (" + saved.getDosage() + ", " + saved.getFrequency() + ") for patient id " + dto.getPatientId(), ipAddress);

        return mapToDto(saved);
    }

    @Transactional
    public PrescriptionDto discontinuePrescription(Long id, String reason, String performedBy, String userRole, String ipAddress) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with id: " + id));

        prescription.setStatus("DISCONTINUED");
        if (reason != null && !reason.trim().isEmpty()) {
            prescription.setInstructions((prescription.getInstructions() != null ? prescription.getInstructions() : "") + " [DISCONTINUED: " + reason + "]");
        }

        Prescription saved = prescriptionRepository.save(prescription);

        auditService.log(performedBy, userRole, "DISCONTINUE_MEDICATION", "Prescription", id,
                "Discontinued medication " + saved.getMedicationName() + " for patient id " + saved.getPatientId() + ". Reason: " + reason, ipAddress);

        return mapToDto(saved);
    }

    private PrescriptionDto mapToDto(Prescription p) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(p.getId());
        dto.setPatientId(p.getPatientId());
        dto.setProviderId(p.getProviderId());
        dto.setEncounterId(p.getEncounterId());
        dto.setMedicationName(p.getMedicationName());
        dto.setRxNormCode(p.getRxNormCode());
        dto.setDosage(p.getDosage());
        dto.setFrequency(p.getFrequency());
        dto.setRoute(p.getRoute());
        dto.setDurationDays(p.getDurationDays());
        dto.setInstructions(p.getInstructions());
        dto.setRefills(p.getRefills());
        dto.setStatus(p.getStatus());
        dto.setPrescribedAt(p.getPrescribedAt());
        return dto;
    }
}
