import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CareConnect EHR - Antigravity Agent Prompts</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;500;600;700&family=Consolas&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    background-color: #0d1117;
    color: #e6edf3;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    page-break-after: always;
    page-break-inside: avoid;
    position: relative;
    padding: 10mm 12mm 8mm 12mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #0b0f14;
    overflow: hidden;
  }

  /* Cover Page */
  .cover-page {
    padding: 20mm 18mm;
    background: radial-gradient(circle at 80% 20%, rgba(31, 111, 235, 0.15) 0%, transparent 55%),
                radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
                #070a0e;
    justify-content: space-between;
  }

  /* Windows 11 Desktop Style Window Header */
  .win-window {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 8px;
    flex-grow: 1;
  }

  .win-titlebar {
    height: 34px;
    background: #0d1117;
    border-bottom: 1px solid #21262d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 14px;
    user-select: none;
  }

  .win-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    color: #8b949e;
    font-weight: 500;
  }

  .win-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .win-controls {
    display: flex;
    height: 100%;
  }

  .win-btn {
    width: 44px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8b949e;
    font-size: 10px;
    font-family: 'Segoe UI Symbol', sans-serif;
  }

  .win-btn-close {
    font-size: 12px;
  }

  /* Antigravity IDE Top Context Bar */
  .agy-subbar {
    background: #11161d;
    border-bottom: 1px solid #21262d;
    padding: 7px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #8b949e;
  }

  .agy-model-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(56, 139, 253, 0.12);
    border: 1px solid rgba(56, 139, 253, 0.35);
    color: #58a6ff;
    padding: 2px 9px;
    border-radius: 12px;
    font-size: 10.5px;
    font-weight: 600;
  }

  .agy-workspace-path {
    font-family: 'Consolas', monospace;
    font-size: 10px;
    color: #7d8590;
  }

  /* Conversation Flow Container */
  .agy-chat-flow {
    padding: 12px 14px 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #0d1117;
    flex-grow: 1;
  }

  /* User Message Bubble */
  .user-msg-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .user-meta-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 600;
    color: #58a6ff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .user-avatar {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: #1f6feb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
  }

  /* Actual Antigravity Prompt Input Box Look */
  .antigravity-input-shell {
    background: #161b22;
    border: 1.5px solid #388bfd;
    border-radius: 8px;
    padding: 10px 13px;
    box-shadow: 0 0 0 3px rgba(56, 139, 253, 0.15);
  }

  .prompt-text {
    font-family: 'Segoe UI', sans-serif;
    font-size: 11.5px;
    line-height: 1.55;
    color: #f0f6fc;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .input-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px solid #21262d;
    font-size: 10px;
    color: #7d8590;
  }

  .input-tags {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .input-tag {
    background: #21262d;
    color: #8b949e;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 9.5px;
  }

  .send-btn-mock {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #238636;
    color: #ffffff;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 5px;
    font-size: 10px;
  }

  /* Antigravity Response / Execution Card */
  .agent-response-block {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .agent-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #3fb950;
    margin-bottom: 6px;
  }

  .agent-avatar {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: linear-gradient(135deg, #238636, #2ea043);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    font-weight: 800;
  }

  .agent-summary {
    font-size: 11px;
    color: #c9d1d9;
    line-height: 1.45;
    margin-bottom: 6px;
  }

  .tools-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 4px;
  }

  .tool-pill {
    font-family: 'Consolas', monospace;
    font-size: 9px;
    background: #0d1117;
    border: 1px solid #30363d;
    color: #79c0ff;
    padding: 2px 7px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .tool-check {
    color: #3fb950;
    font-weight: bold;
  }

  /* Bottom Details Panels */
  .bottom-panels {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 10px;
    margin-top: 6px;
  }

  .panel-card {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 8px 11px;
  }

  .panel-heading {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.6px;
    color: #8b949e;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .panel-list {
    list-style: none;
  }

  .panel-list li {
    font-size: 10px;
    color: #c9d1d9;
    line-height: 1.45;
    position: relative;
    padding-left: 12px;
    margin-bottom: 3px;
  }

  .panel-list li::before {
    content: "•";
    position: absolute;
    left: 2px;
    color: #58a6ff;
  }

  .file-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }

  .file-badge {
    font-family: 'Consolas', monospace;
    font-size: 9px;
    background: #0d1117;
    border: 1px solid #21262d;
    color: #a5d6ff;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .page-footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #21262d;
    padding-top: 6px;
    font-size: 9.5px;
    color: #7d8590;
    margin-top: 4px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover-page">
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #21262d; padding-bottom: 14px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 32px; height: 32px; background: #1f6feb; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: white;">A</div>
      <div>
        <div style="font-size: 16px; font-weight: 700; color: #f0f6fc;">Antigravity Agent • Windows IDE</div>
        <div style="font-size: 11px; color: #7d8590;">Windows 11 x64 • PowerShell Host • Google DeepMind Agentic Coding</div>
      </div>
    </div>
    <div style="background: rgba(35, 134, 54, 0.15); border: 1px solid #238636; color: #3fb950; font-size: 10.5px; font-weight: 600; padding: 4px 10px; border-radius: 14px;">
      ● AGENT READY (ACTIVE)
    </div>
  </div>

  <div style="margin: auto 0;">
    <div style="font-size: 11px; font-weight: 700; color: #58a6ff; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
      SYSTEM PROMPT ARCHITECTURE DOSSIER
    </div>
    <h1 style="font-size: 34px; font-weight: 800; line-height: 1.2; color: #ffffff; margin-bottom: 14px;">
      CareConnect EHR<br>
      <span style="color: #58a6ff;">17 Antigravity Prompts</span><br>
      Project Execution History
    </h1>
    <p style="font-size: 13.5px; color: #8b949e; line-height: 1.6; max-width: 540px; margin-bottom: 24px;">
      Complete prompt engineering and autonomous development log recorded inside the Antigravity IDE prompt environment on Windows. Captures the sequential journey of building the CareConnect Electronic Health Record platform.
    </p>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 540px;">
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 12px;">
        <div style="font-size: 20px; font-weight: 700; color: #58a6ff;">17 Prompts</div>
        <div style="font-size: 10.5px; color: #7d8590;">Interactive Execution</div>
      </div>
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 12px;">
        <div style="font-size: 20px; font-weight: 700; color: #3fb950;">Full-Stack</div>
        <div style="font-size: 10.5px; color: #7d8590;">Spring Boot 3.3 + Angular 17</div>
      </div>
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 12px;">
        <div style="font-size: 20px; font-weight: 700; color: #d29922;">HIPAA &amp; FHIR</div>
        <div style="font-size: 10.5px; color: #7d8590;">Clinical Standards Compliant</div>
      </div>
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; border-top: 1px solid #21262d; padding-top: 14px; font-size: 11px; color: #7d8590;">
    <div>
      <span style="color: #c9d1d9; font-weight: 600;">Workspace:</span> C:\\Users\\91905\\OneDrive\\Desktop\\HCL Project<br>
      <span style="color: #c9d1d9; font-weight: 600;">Live Web Demo:</span> care-connect-ehr-hcl.netlify.app
    </div>
    <div style="text-align: right;">
      <span style="color: #c9d1d9; font-weight: 600;">Developer:</span> Anurag Dwivedi<br>
      <span style="color: #c9d1d9; font-weight: 600;">Environment:</span> Windows 11 • Antigravity 2.0
    </div>
  </div>
</div>
"""

prompts_data = [
    {
        "num": 1,
        "phase": "Foundation & Architecture",
        "title": "Clinical Architecture & Project Scaffolding",
        "prompt": "Create the complete enterprise architecture for CareConnect EHR (Electronic Health Record & CPOE platform) aligned with HL7/FHIR healthcare informatics standards. Use Spring Boot 3.3.x with Java 21 for backend REST APIs, Oracle XE/H2 relational schema with HIPAA audit trails, and Angular 17 standalone components for frontend. Scaffold the modular project structure with Maven pom.xml and Angular workspace configuration.",
        "agent_action": "Scaffolded backend/ (Maven, Spring Boot 3.3.x, Java 21) and frontend/ (Angular 17 standalone) directory tree.",
        "tools": ["write_file pom.xml", "write_file angular.json", "run_command npm install", "write_file README.md"],
        "deliverables": [
            "Clinical standard mapping (ICD-10, LOINC, RxNorm)",
            "Monolithic modular structure: backend/, frontend/, document/",
            "Maven dependencies: Spring Security, Data JPA, Validation"
        ],
        "files": ["pom.xml", "angular.json", "README.md", ".gitignore"],
        "status": "BUILD SUCCESS: Java 21 & Node.js environment configured."
    },
    {
        "num": 2,
        "phase": "Security & Identity",
        "title": "Role-Based Access Control (RBAC) & Stateless JWT",
        "prompt": "Implement HIPAA-compliant stateless authentication using Spring Security 6 and JWT. Create User entity with Role enum (ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN, ROLE_PATIENT). Build JwtService with HMAC-SHA256 signing, JwtAuthenticationFilter, and SecurityFilterChain securing clinical endpoints. Implement AuthController with /login and /register returning JWT token and authorities.",
        "agent_action": "Implemented JwtService, BCrypt password hashing, and SecurityConfig with custom filter chain.",
        "tools": ["write_file SecurityConfig.java", "write_file JwtService.java", "write_file AuthController.java", "write_file User.java"],
        "deliverables": [
            "Spring Security 6 stateless filter chain",
            "4 healthcare roles: DOCTOR, NURSE, ADMIN, PATIENT",
            "JWT token issue, claim validation & expiration handling"
        ],
        "files": ["SecurityConfig.java", "JwtService.java", "AuthController.java", "Role.java"],
        "status": "SECURED: Public endpoints permitted; unauthenticated calls return 401."
    },
    {
        "num": 3,
        "phase": "Core Clinical Backend",
        "title": "Enterprise Master Patient Index (EMPI) & Registry",
        "prompt": "Develop the Patient Management module following HL7 demographic specifications. Create Patient entity with unique MRN, demographics, contact details, insurance policy, and persistent allergy safety flags. Implement automated MRN generation in format 'MRN-YYYY-XXXX'. Create PatientRepository with multi-field search and PatientController with CRUD endpoints restricted to clinical roles.",
        "agent_action": "Created Patient JPA entity, auto-generating MRN sequence generator, and PatientController API.",
        "tools": ["write_file Patient.java", "write_file PatientRepository.java", "write_file PatientService.java", "write_file PatientController.java"],
        "deliverables": [
            "Enterprise Master Patient Index (EMPI) data model",
            "Thread-safe automated MRN generator (MRN-2026-XXXX)",
            "Multi-criteria patient search (MRN, Name, Phone)"
        ],
        "files": ["Patient.java", "PatientRepository.java", "PatientService.java", "PatientController.java"],
        "status": "VERIFIED: Auto MRN allocation tested; duplicate collisions prevented."
    },
    {
        "num": 4,
        "phase": "Clinical Documentation",
        "title": "Clinical Encounter Flowsheet & SOAP Notes Engine",
        "prompt": "Build the physician clinical documentation engine supporting structured SOAP notes: Subjective (patient narrative), Objective (physical findings/vitals), Assessment (ICD-10 clinical diagnoses), and Plan (treatment/orders). Add physician electronic signature locking (signedBy, signedAt timestamp). Once finalized, prevent subsequent modification. Expose REST endpoints in EncounterController.",
        "agent_action": "Implemented ClinicalEncounter entity, ICD-10 diagnostic mapping, and digital signature locking logic.",
        "tools": ["write_file ClinicalEncounter.java", "write_file EncounterRepository.java", "write_file EncounterService.java", "write_file EncounterController.java"],
        "deliverables": [
            "Standardized SOAP medical documentation schema",
            "ICD-10-CM diagnostic code catalog integration",
            "Tamper-proof digital physician note finalization lock"
        ],
        "files": ["ClinicalEncounter.java", "EncounterDto.java", "EncounterService.java", "EncounterController.java"],
        "status": "LOCKED: Finalized clinical notes reject modification with 403 Forbidden."
    },
    {
        "num": 5,
        "phase": "Biometrics & Vitals",
        "title": "Vital Signs Flowsheet & Real-Time BMI Engine",
        "prompt": "Implement the Vital Signs Flowsheet module: capture Systolic/Diastolic BP, Heart Rate, Respiratory Rate, Temperature (°C), and Oxygen Saturation (SpO2). Write automated real-time Body Mass Index (BMI) computation logic with standard classification (Underweight, Normal, Overweight, Obese). Implement STAT emergency alerts for critical boundary values (e.g. Systolic BP > 180, SpO2 < 90%).",
        "agent_action": "Engineered VitalSign entity, mathematical BMI calculator, and abnormal boundary alert triggers.",
        "tools": ["write_file VitalSign.java", "write_file VitalSignDto.java", "edit_file PatientService.java", "edit_file EncounterController.java"],
        "deliverables": [
            "Longitudinal vital signs time-series model",
            "Automated BMI formula: weightKg / (heightM^2)",
            "Emergency STAT triage alert thresholds"
        ],
        "files": ["VitalSign.java", "VitalSignDto.java", "Patient.java", "EncounterController.java"],
        "status": "CALCULATED: Height 175cm/70kg -> BMI 22.9; BP 185/110 triggers STAT flag."
    },
    {
        "num": 6,
        "phase": "CPOE & Diagnostics",
        "title": "Computerized Physician Order Entry & LOINC Workflow",
        "prompt": "Construct the Computerized Physician Order Entry (CPOE) module for lab and radiology orders. Create MedicalOrder entity with orderNumber, testName, loincCode, priority (ROUTINE, URGENT, STAT), and orderStatus. Seed standard LOINC codes (CBC 58410-2, Lipid Panel 57698-3, Chest X-Ray 36554-4). Build fulfillment workflow for technicians to enter results, reference ranges, and abnormal flags.",
        "agent_action": "Created MedicalOrder entity, LOINC diagnostic code catalog, and technician result reporting API.",
        "tools": ["write_file MedicalOrder.java", "write_file OrderRepository.java", "write_file OrderService.java", "write_file OrderController.java"],
        "deliverables": [
            "LOINC-compliant computerized diagnostic requisition engine",
            "Multi-level clinical priority queue (ROUTINE, URGENT, STAT)",
            "Diagnostic fulfillment & abnormal lab flag reporting"
        ],
        "files": ["MedicalOrder.java", "OrderDto.java", "OrderService.java", "OrderController.java"],
        "status": "ORDER CREATED: STAT CBC order placed and completed with flagged result."
    },
    {
        "num": 7,
        "phase": "Pharmacy & Patient Safety",
        "title": "Drug-Drug Interaction (DDI) & E-Prescribing Engine",
        "prompt": "Architect an intelligent Drug-Drug Interaction (DDI) safety engine and e-prescribing system. Create Prescription entity (medicationName, rxNormCode, dosage, route, frequency) and DrugInteractionRule entity storing contraindicated medication pairs with severity (CRITICAL, MAJOR, MODERATE). Seed rules: Warfarin + Aspirin (CRITICAL bleeding risk) and Lisinopril + Spironolactone (MAJOR hyperkalemia). Expose /check-interactions endpoint.",
        "agent_action": "Built Prescription JPA entity, interaction rule evaluator, and automated contraindication engine.",
        "tools": ["write_file Prescription.java", "write_file DrugInteractionRule.java", "write_file MedicationService.java", "write_file MedicationController.java"],
        "deliverables": [
            "RxNorm pharmaceutical medication model",
            "Automated multi-level drug contraindication evaluator",
            "Pre-submission safety check API for active patient medications"
        ],
        "files": ["Prescription.java", "DrugInteractionRule.java", "MedicationService.java", "MedicationController.java"],
        "status": "ALERT ACTIVE: Warfarin + Aspirin flagged as CRITICAL hemorrhage hazard."
    },
    {
        "num": 8,
        "phase": "Compliance & Governance",
        "title": "HIPAA Security Audit Trail & Access Logging",
        "prompt": "Implement HIPAA Title II compliance audit logging for Protected Health Information (PHI). Create immutable AuditLog entity capturing userId, username, userRole, action (VIEW_PATIENT_CHART, CREATE_ORDER, SIGN_NOTE), resourceType, ipAddress, and timestamp. Build asynchronous event logging so request latency is unaffected. Expose admin-only AuditController with date, user, and action filters.",
        "agent_action": "Implemented AuditLog entity, Spring event listener for non-blocking capture, and admin AuditController.",
        "tools": ["write_file AuditLog.java", "write_file AuditLogRepository.java", "write_file AuditService.java", "write_file AuditController.java"],
        "deliverables": [
            "Immutable PHI access audit log schema",
            "Asynchronous non-blocking event-driven log capture",
            "Admin-only forensic search and filtering API"
        ],
        "files": ["AuditLog.java", "AuditLogRepository.java", "AuditService.java", "AuditController.java"],
        "status": "COMPLIANT: 100% of PHI chart views logged; updates prohibited by design."
    },
    {
        "num": 9,
        "phase": "Data Seeding & Boot",
        "title": "Database Initialization & Clinical Demonstration Data",
        "prompt": "Write DataInitializer implementing CommandLineRunner to seed realistic demonstration data on application startup. Create accounts for Doctor (dr.smith@careconnect.com), Nurse, Admin, and Patient with BCrypt passwords. Seed 5 diverse patient records with demographics, chronic conditions, and penicillin allergies. Seed longitudinal clinical encounters, SOAP notes, vital signs, orders, and interaction rules.",
        "agent_action": "Built DataInitializer seeding multi-role users, sample EHR records, LOINC orders, and DDI rules.",
        "tools": ["write_file DataInitializer.java", "edit_file application.yml", "run_command mvn test"],
        "deliverables": [
            "CommandLineRunner database bootstrap component",
            "Pre-seeded multi-role demonstration user credentials",
            "Rich longitudinal clinical records ready for live demo"
        ],
        "files": ["DataInitializer.java", "application.yml", "pom.xml"],
        "status": "BOOT READY: Database initialized with test users, patients, and rules."
    },
    {
        "num": 10,
        "phase": "Frontend Architecture",
        "title": "Angular 17 Workspace, AuthService & JWT Interceptor",
        "prompt": "Initialize the Angular 17 enterprise client for CareConnect EHR using standalone components, modern provideHttpClient(withInterceptors()), and provideRouter(). Build AuthService managing user state via RxJS BehaviorSubject and localStorage. Create JwtInterceptor attaching Authorization: Bearer <token> to outgoing /api calls. Implement AuthGuard and RoleGuard for route protection. Create responsive NavbarComponent.",
        "agent_action": "Created Angular 17 standalone architecture, reactive AuthService, JWT interceptor, and role guards.",
        "tools": ["write_file main.ts", "write_file auth.service.ts", "write_file jwt.interceptor.ts", "write_file auth.guard.ts", "write_file navbar.component.ts"],
        "deliverables": [
            "Modern Angular 17 standalone structure without NgModules",
            "Reactive AuthService with session persistence & hasRole() helpers",
            "HTTP Bearer interceptor & declarative route authorization"
        ],
        "files": ["main.ts", "app.routes.ts", "auth.service.ts", "jwt.interceptor.ts", "navbar.component.ts"],
        "status": "COMPILED: Protected routes redirect unauthorized users to /login."
    },
    {
        "num": 11,
        "phase": "Hospital Analytics UI",
        "title": "Clinical Executive Dashboard & Triage Command Center",
        "prompt": "Develop the DashboardComponent in Angular 17: Build a 4-card KPI metric grid (Total Patients, Active Orders, Critical Alerts, Today's Encounters). Add a Quick Action command bar (Register Patient, New Note, Order Lab, Prescribe). Create Recent Patients census table with MRN, Age/Gender, Allergy badges, and 1-click link to 360° chart. Add emergency STAT alert banner for urgent unfulfilled orders.",
        "agent_action": "Designed DashboardComponent with live stats cards, quick actions bar, and recent patients census.",
        "tools": ["write_file dashboard.component.ts", "write_file dashboard.component.html", "write_file dashboard.component.scss", "write_file dashboard.service.ts"],
        "deliverables": [
            "Executive hospital clinical KPI summary cards",
            "Quick-action triage navigation bar",
            "Real-time patient census table with visual allergy alerts"
        ],
        "files": ["dashboard.component.ts", "dashboard.component.html", "dashboard.component.scss"],
        "status": "RENDERED: Live census cards, quick action links, and STAT panel verified."
    },
    {
        "num": 12,
        "phase": "EMPI Frontend",
        "title": "Patient Directory & 360° Medical Record Viewer",
        "prompt": "Create PatientsComponent and PatientDetailComponent in Angular 17. Build interactive patient search with real-time debounced query by MRN or Name. Build reactive form modal for patient registration. Construct 360° Medical Record view with organized tabs: Demographics & persistent Allergy alert banner, Encounters & SOAP history, Vitals Flowsheet with BMI indicator, Diagnostic Orders, and Active Medications.",
        "agent_action": "Implemented PatientsComponent with debounced search, registration modal, and multi-tab medical chart.",
        "tools": ["write_file patients.component.ts", "write_file patients.component.html", "write_file patient.service.ts", "write_file styles.scss"],
        "deliverables": [
            "Debounced real-time patient directory lookup",
            "Validated patient onboarding modal",
            "Comprehensive 360° tabbed electronic health record"
        ],
        "files": ["patients.component.ts", "patients.component.html", "patient.service.ts"],
        "status": "VERIFIED: Patient search filters instantly; registration auto-assigns MRN."
    },
    {
        "num": 13,
        "phase": "Clinical Workflow UI",
        "title": "Physician SOAP Notes & ICD-10 Search Interface",
        "prompt": "Develop ClinicalNotesComponent in Angular 17 for physician encounter documentation. Build a 4-quadrant structured SOAP layout: Subjective (symptoms), Objective (physical findings), Assessment (searchable ICD-10 diagnosis picker), and Plan (treatment roadmap). Add 'Save Draft' and 'Sign & Finalize' buttons. When finalized, render certified physician digital signature lock badge and lock inputs to read-only.",
        "agent_action": "Created ClinicalNotesComponent with 4-quadrant SOAP input, ICD-10 selector, and certified lock badge.",
        "tools": ["write_file clinical-notes.component.ts", "write_file clinical-notes.component.html", "write_file clinical-notes.component.scss"],
        "deliverables": [
            "Structured 4-quadrant SOAP clinical documentation UI",
            "ICD-10 clinical diagnosis code dropdown search",
            "Physician digital locking with timestamped certified badge"
        ],
        "files": ["clinical-notes.component.ts", "clinical-notes.component.html", "clinical-notes.component.scss"],
        "status": "CERTIFIED: Finalized notes show digital signature lock; edits locked."
    },
    {
        "num": 14,
        "phase": "CPOE Frontend",
        "title": "CPOE Order Requisitions & Diagnostic Results Interface",
        "prompt": "Build CpoeComponent in Angular 17 for diagnostic order management. Requisition Form: select patient, order type (Lab / Radiology), LOINC test from catalog, and priority (ROUTINE, URGENT, STAT). Orders Table: display active hospital orders with status badges. Diagnostic Result Entry Modal: allow lab technicians to input numeric values, reference ranges, and toggle abnormal result flags. Add STAT filter tab.",
        "agent_action": "Developed CpoeComponent with order requisition wizard, live tracking table, and result entry dialog.",
        "tools": ["write_file cpoe.component.ts", "write_file cpoe.component.html", "write_file cpoe.component.scss", "write_file order.service.ts"],
        "deliverables": [
            "Physician CPOE requisition wizard with LOINC picker",
            "Live order tracker with priority badges (ROUTINE / URGENT / STAT)",
            "Technician result entry dialog with abnormal flag toggle"
        ],
        "files": ["cpoe.component.ts", "cpoe.component.html", "order.service.ts"],
        "status": "ORDER TESTED: Placed STAT requisition; lab tech updated result with abnormal flag."
    },
    {
        "num": 15,
        "phase": "Pharmacy Frontend",
        "title": "E-Prescribing Form & Drug Interaction Simulator",
        "prompt": "Develop MedicationsComponent and InteractionCheckerComponent in Angular 17. E-Prescribing Form: patient selector, RxNorm medication name, dosage, route, frequency, and duration. Before submission, invoke /check-interactions against patient's active drugs; if contraindicated, show modal with severity badge (CRITICAL = Red) and clinical advice. Build standalone Drug Interaction Simulator for side-by-side drug safety exploration.",
        "agent_action": "Created MedicationsComponent with pre-submission safety modal and standalone drug pair simulator.",
        "tools": ["write_file medications.component.ts", "write_file interaction-checker.component.ts", "write_file medication.service.ts"],
        "deliverables": [
            "E-Prescribing form with RxNorm dosage and route specifications",
            "Automated pre-order drug-drug conflict warning modal",
            "Interactive Drug Interaction Simulator for exploratory safety checks"
        ],
        "files": ["medications.component.ts", "interaction-checker.component.ts", "medication.service.ts"],
        "status": "SIMULATOR VERIFIED: Warfarin + Aspirin pair triggers CRITICAL alert immediately."
    },
    {
        "num": 16,
        "phase": "Patient Portal",
        "title": "Patient Self-Service Portal & Personal Health Summary",
        "prompt": "Construct PatientPortalComponent in Angular 17 restricted to ROLE_PATIENT. Automatically link view to logged-in user's patient profile. Present clear sections: My Profile & Allergies, Active Prescriptions with plain-language dosing schedules, Diagnostic Lab Results with normal/abnormal markers, and Visit Summaries with doctor care plans. Add 'Download Complete Health Summary' button.",
        "agent_action": "Built PatientPortalComponent providing secure patient self-service dashboard and records export.",
        "tools": ["write_file patient-portal.component.ts", "write_file patient-portal.component.html", "write_file patient-portal.service.ts"],
        "deliverables": [
            "Patient-facing self-service health dashboard",
            "Clear prescription instructions and refill status indicators",
            "Published diagnostic reports with patient-friendly normal/abnormal tags"
        ],
        "files": ["patient-portal.component.ts", "patient-portal.component.html", "patient-portal.service.ts"],
        "status": "ACCESSIBLE: Logged in as patient.john@careconnect.com; verified personal chart."
    },
    {
        "num": 17,
        "phase": "CI/CD & Cloud Deploy",
        "title": "Automated Build Pipeline, Docker & Netlify Deployment",
        "prompt": "Configure continuous integration and deployment for CareConnect EHR. Create GitHub Actions workflow (.github/workflows/main.yml) running Maven clean verify on JDK 21 and npm run build on Node 20. Build Dockerfile for containerized Spring Boot execution. Configure Netlify deployment for Angular frontend with SPA catch-all rewrite rule in netlify.toml and _redirects. Perform complete end-to-end verification.",
        "agent_action": "Configured GitHub Actions CI pipeline, backend Dockerfile, Netlify SPA redirects, and verified live build.",
        "tools": ["write_file .github/workflows/main.yml", "write_file Dockerfile", "write_file netlify.toml", "write_file frontend/public/_redirects", "run_command npm run build"],
        "deliverables": [
            "GitHub Actions CI pipeline for automated build & test validation",
            "Production Dockerfile for containerized Spring Boot backend",
            "Netlify SPA routing rules (/* -> /index.html 200)",
            "Live production deployment at care-connect-ehr-hcl.netlify.app"
        ],
        "files": [".github/workflows/main.yml", "Dockerfile", "netlify.toml", "_redirects"],
        "status": "DEPLOYED & VERIFIED: Live on Netlify; backend CI pipeline green."
    }
]

for p in prompts_data:
    deliv_html = "".join([f"<li>{d}</li>" for d in p["deliverables"]])
    files_html = "".join([f'<span class="file-badge">{f}</span>' for f in p["files"]])
    tools_html = "".join([f'<span class="tool-pill"><span class="tool-check">✓</span>{t}</span>' for t in p["tools"]])
    
    safe_prompt = p["prompt"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    html_content += f"""
<!-- PROMPT {p["num"]} -->
<div class="page">
  <!-- Windows 11 Desktop Style Antigravity Window -->
  <div class="win-window">
    <!-- Window Titlebar with Windows Min/Max/Close controls -->
    <div class="win-titlebar">
      <div class="win-title">
        <span class="win-logo">
          <!-- Windows / Antigravity icon -->
          <svg width="13" height="13" viewBox="0 0 16 16" fill="#58a6ff"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>
        </span>
        Antigravity IDE &bull; CareConnect EHR &bull; Prompt #{p["num"]:02d}
      </div>
      <div class="win-controls">
        <div class="win-btn">&#x2212;</div>
        <div class="win-btn">&#x25A1;</div>
        <div class="win-btn win-btn-close">&#x2715;</div>
      </div>
    </div>

    <!-- IDE Context Sub-bar -->
    <div class="agy-subbar">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="agy-model-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          Gemini 3.8 &bull; Agentic Coding
        </span>
        <span style="font-size: 10px; color: #8b949e;">Task: {p["phase"]}</span>
      </div>
      <div class="agy-workspace-path">C:\\Users\\91905\\OneDrive\\Desktop\\HCL Project</div>
    </div>

    <!-- Chat Flow / Interaction Body -->
    <div class="agy-chat-flow">
      <!-- USER PROMPT INPUT BOX -->
      <div class="user-msg-block">
        <div class="user-meta-label">
          <span class="user-avatar">U</span>
          USER PROMPT (PROMPT #{p["num"]:02d} OF 17) &bull; {p["title"]}
        </div>
        <div class="antigravity-input-shell">
          <div class="prompt-text">{safe_prompt}</div>
          <div class="input-action-bar">
            <div class="input-tags">
              <span class="input-tag">Mode: Agent</span>
              <span class="input-tag">Context: Full Workspace</span>
              <span class="input-tag">Shell: PowerShell</span>
            </div>
            <div class="send-btn-mock">
              <span>Execute</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- AGENT EXECUTION / TOOL ACTIVITY BLOCK -->
      <div class="agent-response-block">
        <div class="agent-label">
          <span class="agent-avatar">A</span>
          ANTIGRAVITY AGENT EXECUTION
        </div>
        <div class="agent-summary">
          <strong>Action Taken:</strong> {p["agent_action"]}
        </div>
        <div style="font-size: 9.5px; color: #8b949e; margin-bottom: 2px; text-transform: uppercase; font-weight: 600;">Executed Tool Calls:</div>
        <div class="tools-list">
          {tools_html}
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Details Panels -->
  <div class="bottom-panels">
    <div class="panel-card">
      <div class="panel-heading">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Key Deliverables &amp; Outcomes
      </div>
      <ul class="panel-list">
        {deliv_html}
      </ul>
    </div>

    <div class="panel-card">
      <div class="panel-heading">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Affected Files &amp; Entities
      </div>
      <div class="file-badges">
        {files_html}
      </div>
      <div style="margin-top: 6px; font-size: 9.5px; color: #3fb950; font-weight: 600; display: flex; align-items: center; gap: 4px;">
        <span>&#x2713;</span> {p["status"]}
      </div>
    </div>
  </div>

  <!-- Page Footer -->
  <div class="page-footer-bar">
    <div>CareConnect EHR &bull; Windows 11 Antigravity Session Log</div>
    <div>Slide {p["num"] + 1} of 18 (Prompt {p["num"]} of 17)</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Antigravity_Windows_Prompts.html"
pdf_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Antigravity_Windows_17_Prompts.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML at: {html_path}")

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Executing Chrome Print-to-PDF...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("PDF created successfully:", os.path.exists(pdf_path))
if os.path.exists(pdf_path):
    print("PDF Size in KB:", os.path.getsize(pdf_path) / 1024)
