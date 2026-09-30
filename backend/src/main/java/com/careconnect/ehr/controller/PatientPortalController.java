package com.careconnect.ehr.controller;

import com.careconnect.ehr.dto.EncounterDto;
import com.careconnect.ehr.dto.OrderDto;
import com.careconnect.ehr.dto.PatientDto;
import com.careconnect.ehr.dto.PrescriptionDto;
import com.careconnect.ehr.dto.VitalSignDto;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.service.AuditService;
import com.careconnect.ehr.service.EncounterService;
import com.careconnect.ehr.service.MedicationService;
import com.careconnect.ehr.service.OrderService;
import com.careconnect.ehr.service.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal")
public class PatientPortalController {

    private final PatientService patientService;
    private final EncounterService encounterService;
    private final OrderService orderService;
    private final MedicationService medicationService;
    private final AuditService auditService;

    public PatientPortalController(PatientService patientService,
                                   EncounterService encounterService,
                                   OrderService orderService,
                                   MedicationService medicationService,
                                   AuditService auditService) {
        this.patientService = patientService;
        this.encounterService = encounterService;
        this.orderService = orderService;
        this.medicationService = medicationService;
        this.auditService = auditService;
    }

    private Long getPatientIdOrThrow(CustomUserDetails user) {
        if (user.getPatientId() != null) {
            return user.getPatientId();
        }
        // Fallback: If clinician/admin or patient without linked ID previews the portal, use first registered patient
        List<PatientDto> all = patientService.getAllPatients(null);
        if (!all.isEmpty()) {
            return all.get(0).getId();
        }
        throw new IllegalArgumentException("No registered patient records exist in the database");
    }

    @GetMapping("/my-profile")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<PatientDto> getMyProfile(@AuthenticationPrincipal CustomUserDetails user, HttpServletRequest request) {
        Long patientId = getPatientIdOrThrow(user);
        auditService.log(user.getUsername(), user.getRoleName(), "PORTAL_VIEW_PROFILE", "Patient", patientId, "Patient viewed personal medical profile", request.getRemoteAddr());
        return ResponseEntity.ok(patientService.getPatientById(patientId, user.getUsername(), user.getRoleName(), request.getRemoteAddr()));
    }

    @GetMapping("/my-vitals")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<VitalSignDto>> getMyVitals(@AuthenticationPrincipal CustomUserDetails user, HttpServletRequest request) {
        Long patientId = getPatientIdOrThrow(user);
        auditService.log(user.getUsername(), user.getRoleName(), "PORTAL_VIEW_VITALS", "VitalSign", patientId, "Patient checked personal vitals trend", request.getRemoteAddr());
        return ResponseEntity.ok(patientService.getPatientVitals(patientId));
    }

    @GetMapping("/my-encounters")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<EncounterDto>> getMyEncounters(@AuthenticationPrincipal CustomUserDetails user, HttpServletRequest request) {
        Long patientId = getPatientIdOrThrow(user);
        auditService.log(user.getUsername(), user.getRoleName(), "PORTAL_VIEW_ENCOUNTERS", "ClinicalEncounter", patientId, "Patient accessed visit summary notes", request.getRemoteAddr());
        return ResponseEntity.ok(encounterService.getEncountersByPatient(patientId));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal CustomUserDetails user, HttpServletRequest request) {
        Long patientId = getPatientIdOrThrow(user);
        auditService.log(user.getUsername(), user.getRoleName(), "PORTAL_VIEW_ORDERS", "MedicalOrder", patientId, "Patient viewed lab and imaging results", request.getRemoteAddr());
        return ResponseEntity.ok(orderService.getOrdersByPatient(patientId));
    }

    @GetMapping("/my-prescriptions")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<PrescriptionDto>> getMyPrescriptions(@AuthenticationPrincipal CustomUserDetails user, HttpServletRequest request) {
        Long patientId = getPatientIdOrThrow(user);
        auditService.log(user.getUsername(), user.getRoleName(), "PORTAL_VIEW_PRESCRIPTIONS", "Prescription", patientId, "Patient viewed active medications and dosages", request.getRemoteAddr());
        return ResponseEntity.ok(medicationService.getPrescriptionsByPatient(patientId, false));
    }
}
