package com.careconnect.ehr.service;

import com.careconnect.ehr.dto.PatientDto;
import com.careconnect.ehr.dto.VitalSignDto;
import com.careconnect.ehr.entity.Patient;
import com.careconnect.ehr.entity.VitalSign;
import com.careconnect.ehr.repository.PatientRepository;
import com.careconnect.ehr.repository.VitalSignRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final VitalSignRepository vitalSignRepository;
    private final AuditService auditService;

    public PatientService(PatientRepository patientRepository,
                          VitalSignRepository vitalSignRepository,
                          AuditService auditService) {
        this.patientRepository = patientRepository;
        this.vitalSignRepository = vitalSignRepository;
        this.auditService = auditService;
    }

    public List<PatientDto> getAllPatients(String query) {
        List<Patient> list;
        if (query != null && !query.trim().isEmpty()) {
            list = patientRepository.searchPatients(query.trim());
        } else {
            list = patientRepository.findAll();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public PatientDto getPatientById(Long id, String currentUser, String userRole, String ipAddress) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + id));

        auditService.log(currentUser, userRole, "VIEW_PATIENT", "Patient", id,
                "Viewed patient medical chart for " + patient.getFirstName() + " " + patient.getLastName(), ipAddress);

        return mapToDto(patient);
    }

    @Transactional
    public PatientDto createPatient(PatientDto dto, String currentUser, String userRole, String ipAddress) {
        Patient patient = new Patient();
        mapFromDto(dto, patient);

        if (patient.getMrn() == null || patient.getMrn().trim().isEmpty()) {
            patient.setMrn(generateMrn());
        }

        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());

        Patient saved = patientRepository.save(patient);

        auditService.log(currentUser, userRole, "CREATE_PATIENT", "Patient", saved.getId(),
                "Registered new patient " + saved.getFirstName() + " " + saved.getLastName() + " (MRN: " + saved.getMrn() + ")", ipAddress);

        return mapToDto(saved);
    }

    @Transactional
    public PatientDto updatePatient(Long id, PatientDto dto, String currentUser, String userRole, String ipAddress) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + id));

        mapFromDto(dto, patient);
        patient.setUpdatedAt(LocalDateTime.now());

        Patient updated = patientRepository.save(patient);

        auditService.log(currentUser, userRole, "UPDATE_PATIENT", "Patient", id,
                "Updated patient demographics/medical records for MRN " + updated.getMrn(), ipAddress);

        return mapToDto(updated);
    }

    public List<VitalSignDto> getPatientVitals(Long patientId) {
        return vitalSignRepository.findByPatientIdOrderByRecordedAtDesc(patientId)
                .stream().map(this::mapVitalToDto).collect(Collectors.toList());
    }

    @Transactional
    public VitalSignDto recordVitals(Long patientId, VitalSignDto dto, String currentUser, String userRole, String ipAddress) {
        VitalSign vital = new VitalSign();
        vital.setPatientId(patientId);
        vital.setRecordedAt(dto.getRecordedAt() != null ? dto.getRecordedAt() : LocalDateTime.now());
        vital.setSystolicBP(dto.getSystolicBP());
        vital.setDiastolicBP(dto.getDiastolicBP());
        vital.setHeartRate(dto.getHeartRate());
        vital.setRespiratoryRate(dto.getRespiratoryRate());
        vital.setTemperature(dto.getTemperature());
        vital.setOxygenSaturation(dto.getOxygenSaturation());
        vital.setHeightCm(dto.getHeightCm());
        vital.setWeightKg(dto.getWeightKg());
        vital.setRecordedBy(currentUser);
        vital.setNotes(dto.getNotes());

        // Calculate BMI if height and weight are provided
        if (dto.getHeightCm() != null && dto.getHeightCm() > 0 && dto.getWeightKg() != null && dto.getWeightKg() > 0) {
            double heightMeters = dto.getHeightCm() / 100.0;
            double bmi = dto.getWeightKg() / (heightMeters * heightMeters);
            vital.setBmi(Math.round(bmi * 10.0) / 10.0);
        }

        VitalSign saved = vitalSignRepository.save(vital);

        auditService.log(currentUser, userRole, "RECORD_VITALS", "VitalSign", saved.getId(),
                "Recorded vitals for patient id " + patientId + ": BP " + saved.getSystolicBP() + "/" + saved.getDiastolicBP() + ", HR " + saved.getHeartRate(), ipAddress);

        return mapVitalToDto(saved);
    }

    private String generateMrn() {
        int random = 1000 + new Random().nextInt(9000);
        return "MRN-" + Year.now().getValue() + "-" + random;
    }

    public PatientDto mapToDto(Patient p) {
        PatientDto dto = new PatientDto();
        dto.setId(p.getId());
        dto.setMrn(p.getMrn());
        dto.setFirstName(p.getFirstName());
        dto.setLastName(p.getLastName());
        dto.setDateOfBirth(p.getDateOfBirth());
        dto.setGender(p.getGender());
        dto.setBloodGroup(p.getBloodGroup());
        dto.setPhone(p.getPhone());
        dto.setEmail(p.getEmail());
        dto.setAddress(p.getAddress());
        dto.setCity(p.getCity());
        dto.setState(p.getState());
        dto.setPostalCode(p.getPostalCode());
        dto.setEmergencyContactName(p.getEmergencyContactName());
        dto.setEmergencyContactPhone(p.getEmergencyContactPhone());
        dto.setEmergencyContactRelationship(p.getEmergencyContactRelationship());
        dto.setAllergies(p.getAllergies());
        dto.setChronicConditions(p.getChronicConditions());
        dto.setInsuranceProvider(p.getInsuranceProvider());
        dto.setPolicyNumber(p.getPolicyNumber());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    private void mapFromDto(PatientDto dto, Patient p) {
        p.setFirstName(dto.getFirstName());
        p.setLastName(dto.getLastName());
        p.setDateOfBirth(dto.getDateOfBirth());
        p.setGender(dto.getGender());
        p.setBloodGroup(dto.getBloodGroup());
        p.setPhone(dto.getPhone());
        p.setEmail(dto.getEmail());
        p.setAddress(dto.getAddress());
        p.setCity(dto.getCity());
        p.setState(dto.getState());
        p.setPostalCode(dto.getPostalCode());
        p.setEmergencyContactName(dto.getEmergencyContactName());
        p.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        p.setEmergencyContactRelationship(dto.getEmergencyContactRelationship());
        p.setAllergies(dto.getAllergies());
        p.setChronicConditions(dto.getChronicConditions());
        p.setInsuranceProvider(dto.getInsuranceProvider());
        p.setPolicyNumber(dto.getPolicyNumber());
    }

    public VitalSignDto mapVitalToDto(VitalSign v) {
        VitalSignDto dto = new VitalSignDto();
        dto.setId(v.getId());
        dto.setPatientId(v.getPatientId());
        dto.setRecordedAt(v.getRecordedAt());
        dto.setSystolicBP(v.getSystolicBP());
        dto.setDiastolicBP(v.getDiastolicBP());
        dto.setHeartRate(v.getHeartRate());
        dto.setRespiratoryRate(v.getRespiratoryRate());
        dto.setTemperature(v.getTemperature());
        dto.setOxygenSaturation(v.getOxygenSaturation());
        dto.setHeightCm(v.getHeightCm());
        dto.setWeightKg(v.getWeightKg());
        dto.setBmi(v.getBmi());
        dto.setRecordedBy(v.getRecordedBy());
        dto.setNotes(v.getNotes());
        return dto;
    }
}
