package com.careconnect.ehr.service;

import com.careconnect.ehr.dto.AuthRequest;
import com.careconnect.ehr.dto.AuthResponse;
import com.careconnect.ehr.dto.RegisterRequest;
import com.careconnect.ehr.entity.User;
import com.careconnect.ehr.repository.PatientRepository;
import com.careconnect.ehr.repository.UserRepository;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PatientRepository patientRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    public AuthResponse authenticateUser(AuthRequest request, String ipAddress) {
        String identifier = request.getUsername().trim();
        String normalized = identifier.toLowerCase().replace(" ", ".");

        User user = userRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> userRepository.findByUsernameIgnoreCase(normalized))
                .or(() -> userRepository.findByEmailIgnoreCase(identifier))
                .or(() -> userRepository.findByFullNameIgnoreCase(identifier))
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
                    "User '" + request.getUsername() + "' is not registered in database. Please Sign Up first!"
                ));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User authUser = userDetails.getUser();

        auditService.log(authUser.getUsername(), authUser.getRole().name(), "LOGIN", "User", authUser.getId(),
                "User successfully logged in", ipAddress);

        return new AuthResponse(
                jwt,
                authUser.getId(),
                authUser.getUsername(),
                authUser.getFullName(),
                authUser.getEmail(),
                authUser.getRole().name(),
                authUser.getPatientId()
        );
    }

    public User registerUser(RegisterRequest request, String performedBy, String ipAddress) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setSpecialization(request.getSpecialization());
        user.setLicenseNumber(request.getLicenseNumber());

        if (request.getRole() == com.careconnect.ehr.entity.Role.ROLE_PATIENT) {
            if (request.getPatientId() != null) {
                user.setPatientId(request.getPatientId());
            } else {
                com.careconnect.ehr.entity.Patient p = new com.careconnect.ehr.entity.Patient();
                p.setMrn("MRN-" + (1000 + (System.currentTimeMillis() % 9000)));
                String[] parts = request.getFullName().trim().split("\\s+", 2);
                p.setFirstName(parts[0]);
                p.setLastName(parts.length > 1 ? parts[1] : "Patient");
                p.setEmail(request.getEmail());
                p.setDateOfBirth(java.time.LocalDate.of(1995, 1, 1));
                p.setGender("Other");
                p.setBloodGroup("O+");
                p.setCity("Online Registered");
                p.setState("India");
                com.careconnect.ehr.entity.Patient savedP = patientRepository.save(p);
                user.setPatientId(savedP.getId());
            }
        } else {
            user.setPatientId(request.getPatientId());
        }

        User savedUser = userRepository.save(user);

        auditService.log(
                performedBy != null ? performedBy : "SYSTEM",
                "ADMIN",
                "CREATE_USER",
                "User",
                savedUser.getId(),
                "Created user " + savedUser.getUsername() + " with role " + savedUser.getRole().name(),
                ipAddress
        );

        return savedUser;
    }

    public void resetPassword(String identifier, String newPassword) {
        String trimmed = identifier.trim();
        String normalized = trimmed.toLowerCase().replace(" ", ".");

        User user = userRepository.findByUsernameIgnoreCase(trimmed)
                .or(() -> userRepository.findByUsernameIgnoreCase(normalized))
                .or(() -> userRepository.findByEmailIgnoreCase(trimmed))
                .or(() -> userRepository.findByFullNameIgnoreCase(trimmed))
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User '" + identifier + "' not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
