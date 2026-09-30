package com.careconnect.ehr.service;

import com.careconnect.ehr.dto.EncounterDto;
import com.careconnect.ehr.entity.ClinicalEncounter;
import com.careconnect.ehr.repository.ClinicalEncounterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EncounterService {

    private final ClinicalEncounterRepository encounterRepository;
    private final AuditService auditService;

    public EncounterService(ClinicalEncounterRepository encounterRepository, AuditService auditService) {
        this.encounterRepository = encounterRepository;
        this.auditService = auditService;
    }

    public List<EncounterDto> getEncountersByPatient(Long patientId) {
        return encounterRepository.findByPatientIdOrderByEncounterDateDesc(patientId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public EncounterDto getEncounterById(Long id) {
        ClinicalEncounter encounter = encounterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Encounter not found with id: " + id));
        return mapToDto(encounter);
    }

    @Transactional
    public EncounterDto createEncounter(EncounterDto dto, Long providerId, String providerName, String userRole, String ipAddress) {
        ClinicalEncounter encounter = new ClinicalEncounter();
        encounter.setPatientId(dto.getPatientId());
        encounter.setProviderId(providerId != null ? providerId : 1L);
        encounter.setProviderName(providerName != null ? providerName : "Attending Physician");
        encounter.setEncounterDate(dto.getEncounterDate() != null ? dto.getEncounterDate() : LocalDateTime.now());
        encounter.setEncounterType(dto.getEncounterType());
        encounter.setChiefComplaint(dto.getChiefComplaint());
        encounter.setSoapSubjective(dto.getSoapSubjective());
        encounter.setSoapObjective(dto.getSoapObjective());
        encounter.setSoapAssessment(dto.getSoapAssessment());
        encounter.setSoapPlan(dto.getSoapPlan());
        encounter.setIcd10Codes(dto.getIcd10Codes());
        encounter.setStatus(dto.getStatus() != null ? dto.getStatus() : "COMPLETED");

        ClinicalEncounter saved = encounterRepository.save(encounter);

        auditService.log(providerName, userRole, "CREATE_SOAP_NOTE", "ClinicalEncounter", saved.getId(),
                "Documented SOAP encounter note for patient id " + dto.getPatientId() + " (" + dto.getChiefComplaint() + ")", ipAddress);

        return mapToDto(saved);
    }

    @Transactional
    public EncounterDto signEncounter(Long id, String physicianName, String userRole, String ipAddress) {
        ClinicalEncounter encounter = encounterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Encounter not found with id: " + id));

        encounter.setStatus("SIGNED");
        encounter.setSignedAt(LocalDateTime.now());
        encounter.setSignedBy(physicianName);

        ClinicalEncounter saved = encounterRepository.save(encounter);

        auditService.log(physicianName, userRole, "SIGN_SOAP_NOTE", "ClinicalEncounter", saved.getId(),
                "Electronically signed clinical encounter chart id " + id, ipAddress);

        return mapToDto(saved);
    }

    private EncounterDto mapToDto(ClinicalEncounter e) {
        EncounterDto dto = new EncounterDto();
        dto.setId(e.getId());
        dto.setPatientId(e.getPatientId());
        dto.setProviderId(e.getProviderId());
        dto.setProviderName(e.getProviderName());
        dto.setEncounterDate(e.getEncounterDate());
        dto.setEncounterType(e.getEncounterType());
        dto.setChiefComplaint(e.getChiefComplaint());
        dto.setSoapSubjective(e.getSoapSubjective());
        dto.setSoapObjective(e.getSoapObjective());
        dto.setSoapAssessment(e.getSoapAssessment());
        dto.setSoapPlan(e.getSoapPlan());
        dto.setIcd10Codes(e.getIcd10Codes());
        dto.setStatus(e.getStatus());
        dto.setSignedAt(e.getSignedAt());
        dto.setSignedBy(e.getSignedBy());
        return dto;
    }
}
