package com.careconnect.ehr.controller;

import com.careconnect.ehr.dto.AuthRequest;
import com.careconnect.ehr.dto.AuthResponse;
import com.careconnect.ehr.dto.RegisterRequest;
import com.careconnect.ehr.entity.User;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final com.careconnect.ehr.security.JwtTokenProvider tokenProvider;

    public AuthController(AuthService authService, com.careconnect.ehr.security.JwtTokenProvider tokenProvider) {
        this.authService = authService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        AuthResponse response = authService.authenticateUser(request, ip);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                      @AuthenticationPrincipal CustomUserDetails currentUser,
                                      HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        String createdBy = currentUser != null ? currentUser.getUsername() : request.getUsername();
        User user = authService.registerUser(request, createdBy, ip);
        String jwt = tokenProvider.generateTokenFromUser(user);

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPatientId()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(Map.of(
                "id", currentUser.getId(),
                "username", currentUser.getUsername(),
                "fullName", currentUser.getFullName(),
                "role", currentUser.getRoleName(),
                "patientId", currentUser.getPatientId() != null ? currentUser.getPatientId() : ""
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String newPassword = body.get("newPassword");
        if (username == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and new password (min 6 chars) required"));
        }
        authService.resetPassword(username.trim().toLowerCase(), newPassword);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
    }
}
