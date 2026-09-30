package com.careconnect.ehr.controller;

import com.careconnect.ehr.dto.EncounterDto;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.service.EncounterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encounters")
public class EncounterController {

    private final EncounterService encounterService;

    public EncounterController(EncounterService encounterService) {
        this.encounterService = encounterService;
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<EncounterDto>> getEncountersByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(encounterService.getEncountersByPatient(patientId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<EncounterDto> getEncounterById(@PathVariable Long id) {
        return ResponseEntity.ok(encounterService.getEncounterById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<EncounterDto> createEncounter(@Valid @RequestBody EncounterDto dto,
                                                        @AuthenticationPrincipal CustomUserDetails user,
                                                        HttpServletRequest request) {
        return ResponseEntity.ok(encounterService.createEncounter(dto, user.getId(), user.getFullName(), user.getRoleName(), request.getRemoteAddr()));
    }

    @PutMapping("/{id}/sign")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<EncounterDto> signEncounter(@PathVariable Long id,
                                                      @AuthenticationPrincipal CustomUserDetails user,
                                                      HttpServletRequest request) {
        return ResponseEntity.ok(encounterService.signEncounter(id, user.getFullName(), user.getRoleName(), request.getRemoteAddr()));
    }
}
