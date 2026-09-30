package com.careconnect.ehr.controller;

import com.careconnect.ehr.dto.InteractionCheckRequest;
import com.careconnect.ehr.dto.InteractionCheckResult;
import com.careconnect.ehr.dto.PrescriptionDto;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.service.MedicationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<PrescriptionDto>> getPrescriptions(@PathVariable Long patientId,
                                                                 @RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(medicationService.getPrescriptionsByPatient(patientId, activeOnly));
    }

    @PostMapping("/check-interactions")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<InteractionCheckResult>> checkInteractions(@RequestBody InteractionCheckRequest request) {
        return ResponseEntity.ok(medicationService.checkInteractions(request.getPatientId(), request.getNewMedication()));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<PrescriptionDto> prescribe(@Valid @RequestBody PrescriptionDto dto,
                                                     @AuthenticationPrincipal CustomUserDetails user,
                                                     HttpServletRequest request) {
        return ResponseEntity.ok(medicationService.prescribe(dto, user.getId(), user.getFullName(), user.getRoleName(), request.getRemoteAddr()));
    }

    @PutMapping("/{id}/discontinue")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<PrescriptionDto> discontinue(@PathVariable Long id,
                                                       @RequestBody(required = false) Map<String, String> body,
                                                       @AuthenticationPrincipal CustomUserDetails user,
                                                       HttpServletRequest request) {
        String reason = body != null ? body.get("reason") : "Clinician decision";
        return ResponseEntity.ok(medicationService.discontinuePrescription(id, reason, user.getFullName(), user.getRoleName(), request.getRemoteAddr()));
    }
}
