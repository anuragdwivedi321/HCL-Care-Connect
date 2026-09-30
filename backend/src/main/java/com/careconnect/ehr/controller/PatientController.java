package com.careconnect.ehr.controller;

import com.careconnect.ehr.dto.PatientDto;
import com.careconnect.ehr.dto.VitalSignDto;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.service.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<PatientDto>> getAllPatients(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(patientService.getAllPatients(query));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails user,
                                                    HttpServletRequest request) {
        return ResponseEntity.ok(patientService.getPatientById(id, user.getUsername(), user.getRoleName(), request.getRemoteAddr()));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<PatientDto> createPatient(@Valid @RequestBody PatientDto dto,
                                                    @AuthenticationPrincipal CustomUserDetails user,
                                                    HttpServletRequest request) {
        return ResponseEntity.ok(patientService.createPatient(dto, user.getUsername(), user.getRoleName(), request.getRemoteAddr()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<PatientDto> updatePatient(@PathVariable Long id,
                                                    @Valid @RequestBody PatientDto dto,
                                                    @AuthenticationPrincipal CustomUserDetails user,
                                                    HttpServletRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(id, dto, user.getUsername(), user.getRoleName(), request.getRemoteAddr()));
    }

    @GetMapping("/{id}/vitals")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<VitalSignDto>> getVitals(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientVitals(id));
    }

    @PostMapping("/{id}/vitals")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<VitalSignDto> recordVitals(@PathVariable Long id,
                                                    @RequestBody VitalSignDto dto,
                                                    @AuthenticationPrincipal CustomUserDetails user,
                                                    HttpServletRequest request) {
        return ResponseEntity.ok(patientService.recordVitals(id, dto, user.getUsername(), user.getRoleName(), request.getRemoteAddr()));
    }
}
