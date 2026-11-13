import os
import json
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CareConnect EHR - 17 AI Engineering Prompts Journey</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #0b0f19;
    color: #e2e8f0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    page-break-after: always;
    page-break-inside: avoid;
    position: relative;
    padding: 16mm 18mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: radial-gradient(circle at 85% 15%, rgba(37, 99, 235, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 15% 85%, rgba(13, 148, 136, 0.10) 0%, transparent 45%),
                #0b0f19;
    overflow: hidden;
  }

  /* Cover Page */
  .cover-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24mm 22mm;
    background: radial-gradient(circle at 75% 20%, rgba(59, 130, 246, 0.22) 0%, transparent 55%),
                radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.18) 0%, transparent 50%),
                #090d16;
  }

  .cover-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .cover-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: 800;
    color: white;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }

  .cover-brand {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #f8fafc;
  }

  .cover-brand span {
    color: #38bdf8;
  }

  .cover-body {
    margin: auto 0;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    color: #38bdf8;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 20px;
  }

  .cover-title {
    font-size: 38px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1.2px;
    color: #ffffff;
    margin-bottom: 16px;
  }

  .cover-title .highlight {
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cover-subtitle {
    font-size: 15px;
    line-height: 1.6;
    color: #94a3b8;
    max-width: 520px;
    margin-bottom: 30px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 24px;
  }

  .metric-card {
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 16px;
  }

  .metric-num {
    font-size: 24px;
    font-weight: 800;
    color: #38bdf8;
    margin-bottom: 4px;
  }

  .metric-label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cover-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 18px;
  }

  .meta-item {
    font-size: 12px;
    color: #64748b;
    line-height: 1.6;
  }

  .meta-item strong {
    color: #cbd5e1;
  }

  /* Standard Prompt Slide Page */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 10px;
    margin-bottom: 12px;
  }

  .header-tag {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tag-step {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    font-weight: 700;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }

  .tag-phase {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 600;
  }

  .header-project {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .prompt-title-section {
    margin-bottom: 14px;
  }

  .prompt-title {
    font-size: 20px;
    font-weight: 700;
    color: #f8fafc;
    letter-spacing: -0.4px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .prompt-title .category-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(14, 165, 233, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.3);
  }

  .prompt-objective {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
  }

  /* Simulated IDE / Terminal / Chat Prompt Box */
  .chat-window {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .chat-titlebar {
    background: #1e293b;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .traffic-lights {
    display: flex;
    gap: 6px;
  }

  .traffic-light {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  .tl-red { background: #ef4444; }
  .tl-yellow { background: #f59e0b; }
  .tl-green { background: #10b981; }

  .chat-title-text {
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    color: #94a3b8;
    font-weight: 500;
  }

  .chat-badge {
    font-size: 9px;
    background: rgba(37, 99, 235, 0.25);
    color: #60a5fa;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
  }

  .chat-content {
    padding: 14px 16px;
    background: #0b1120;
  }

  .user-prompt-bubble {
    background: rgba(30, 41, 59, 0.7);
    border-left: 3px solid #38bdf8;
    border-radius: 0 8px 8px 0;
    padding: 12px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    line-height: 1.55;
    color: #e2e8f0;
    white-space: pre-wrap;
    word-break: break-word;
    margin-bottom: 12px;
  }

  .prompt-label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #38bdf8;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Deliverables & Outcome Section */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  .detail-panel {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 12px 14px;
  }

  .panel-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #cbd5e1;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bullet-list {
    list-style: none;
  }

  .bullet-list li {
    font-size: 11px;
    line-height: 1.5;
    color: #94a3b8;
    position: relative;
    padding-left: 14px;
    margin-bottom: 4px;
  }

  .bullet-list li::before {
    content: "▹";
    position: absolute;
    left: 0;
    color: #38bdf8;
    font-weight: bold;
  }

  .files-badge-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .file-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    background: rgba(30, 41, 59, 0.8);
    color: #93c5fd;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid rgba(147, 197, 253, 0.2);
  }

  .verification-banner {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 8px;
    padding: 9px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .verif-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #a7f3d0;
    font-weight: 500;
  }

  .verif-check {
    color: #10b981;
    font-weight: 700;
    font-size: 13px;
  }

  .verif-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
  }

  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 8px;
    font-size: 10px;
    color: #64748b;
  }

  .page-footer strong {
    color: #94a3b8;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page cover-page">
  <div class="cover-header">
    <div class="cover-logo">+</div>
    <div>
      <div class="cover-brand">CareConnect <span>EHR</span></div>
      <div style="font-size: 11px; color: #64748b;">Enterprise Electronic Health Record & CPOE Platform</div>
    </div>
  </div>

  <div class="cover-body">
    <div class="badge-pill">Autonomous AI Engineering Log</div>
    <h1 class="cover-title">
      17 Master AI Prompts<br>
      <span class="highlight">Architectural Blueprint</span> &amp;<br>
      Full-Stack Build Journey
    </h1>
    <p class="cover-subtitle">
      A step-by-step engineering record containing the exact prompt sequence, architectural design commands, and technical specifications used to construct the CareConnect EHR healthcare platform.
    </p>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-num">17 / 17</div>
        <div class="metric-label">Executed Prompts</div>
      </div>
      <div class="metric-card">
        <div class="metric-num">Full Stack</div>
        <div class="metric-label">Spring Boot + Angular</div>
      </div>
      <div class="metric-card">
        <div class="metric-num">Standards</div>
        <div class="metric-label">HL7 • FHIR • HIPAA</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <div class="meta-item">
      <strong>Project:</strong> HCL CareConnect EHR Platform<br>
      <strong>Frameworks:</strong> Java 21, Spring Boot 3.3, Angular 17, Oracle / H2<br>
      <strong>Live Portal:</strong> care-connect-ehr-hcl.netlify.app
    </div>
    <div class="meta-item" style="text-align: right;">
      <strong>Author / Developer:</strong> Anurag Dwivedi<br>
      <strong>Documentation:</strong> Prompt Engineering Dossier<br>
      <strong>Status:</strong> Production Ready & Verified
    </div>
  </div>
</div>
"""

# Prompt definitions
prompts = [
    {
        "num": 1,
        "phase": "Phase 1: Architecture & Foundation",
        "category": "System Design",
        "title": "System Architecture & Clinical Standards Alignment",
        "objective": "Establish the foundational healthcare informatics baseline, compliance framework, and monolithic modular directory structure.",
        "prompt": """Act as a Principal Healthcare Systems Architect. I am designing 'CareConnect EHR', an enterprise web-based Electronic Health Record and Computerized Physician Order Entry (CPOE) platform. 

Define the end-to-end full-stack software architecture adhering to clinical standards:
1. HL7/FHIR aligned domain data models for Patients, Encounters, and Orders.
2. Coding standards: ICD-10-CM for diagnostics, LOINC for diagnostic lab orders, and RxNorm for medication catalog.
3. Backend: Spring Boot 3.3.x with Java 21, Spring Security with stateless JWT, Spring Data JPA.
4. Database: Enterprise relational schema supporting Oracle XE / H2 with schema constraints and HIPAA audit logging.
5. Frontend: Angular 17 standalone components with responsive medical UI and strict role segregation.

Generate the project folder hierarchy, technology rationale, and foundational Maven/NPM configurations.""",
        "deliverables": [
            "Clinical standard mapping (ICD-10, LOINC, RxNorm)",
            "Modular monorepo structure (backend/, frontend/, document/)",
            "Maven pom.xml with Spring Boot 3.3.x & Java 21 setup",
            "Angular 17 workspace configuration with SCSS"
        ],
        "files": ["pom.xml", "angular.json", "README.md", ".gitignore"],
        "verification": "Multi-tier directory scaffolding created and verified across Java & Angular build configs."
    },
    {
        "num": 2,
        "phase": "Phase 1: Architecture & Foundation",
        "category": "Security & Identity",
        "title": "Role-Based Access Control (RBAC) & JWT Security",
        "objective": "Build stateless HIPAA-compliant authentication with role-based access for DOCTOR, NURSE, ADMIN, and PATIENT.",
        "prompt": """Design and implement a robust Spring Security 6 & JWT authentication service for CareConnect EHR:
1. Create User entity and Role enum (ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN, ROLE_PATIENT).
2. Implement JwtService with HMAC-SHA256 signing, expiration handling, and claims extraction (username, role, userId).
3. Create JwtAuthenticationFilter intercepting all HTTP requests and setting SecurityContextHolder.
4. Configure SecurityFilterChain: permit /api/auth/** public access, enforce specific role authorities on clinical endpoints, and disable CSRF for stateless REST.
5. Build AuthController with /login and /register endpoints, returning token, user details, and granted authorities.""",
        "deliverables": [
            "Custom JwtService & JwtAuthenticationFilter",
            "SecurityFilterChain with fine-grained route permissions",
            "BCrypt password encryption with secure salts",
            "AuthController with login/registration payloads"
        ],
        "files": ["SecurityConfig.java", "JwtService.java", "AuthController.java", "User.java"],
        "verification": "Token generation tested; unauthenticated requests blocked with 401 Unauthorized."
    },
    {
        "num": 3,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "Patient Index",
        "title": "Enterprise Master Patient Index (EMPI) & Demographics",
        "objective": "Engineer the patient registry with automated MRN generation, vital tracking, and persistent allergy safety flags.",
        "prompt": """Create the core Patient Management module for CareConnect EHR following HL7 patient schema principles:
1. Create Patient JPA entity with fields: id, mrn (Medical Record Number unique index), firstName, lastName, dob, gender, bloodGroup, contactNumber, emergencyContact, insuranceProvider, policyNumber, and persistent high-visibility allergies.
2. Implement automated MRN generation logic in the format 'MRN-YYYY-XXXX' where YYYY is current year and XXXX is zero-padded sequence.
3. Build PatientRepository with search capabilities by MRN, lastName, contactNumber, or partial full name match.
4. Implement PatientService with comprehensive CRUD operations and PatientController exposing REST endpoints protected by DOCTOR/NURSE/ADMIN roles.""",
        "deliverables": [
            "Patient JPA entity with unique constraint on MRN",
            "Automated thread-safe MRN generation sequence",
            "Dynamic search repository with Spring Data specifications",
            "PatientController REST endpoints for clinical lookup"
        ],
        "files": ["Patient.java", "PatientRepository.java", "PatientService.java", "PatientController.java"],
        "verification": "Tested MRN generation format (MRN-2026-0001) and duplicate MRN collision protection."
    },
    {
        "num": 4,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "Clinical Documentation",
        "title": "Clinical Encounter Flowsheet & SOAP Notes",
        "objective": "Implement structured clinical encounters with Subjective, Objective, Assessment, and Plan (SOAP) documentation.",
        "prompt": """Develop the Clinical Encounter and Physician SOAP Documentation engine for CareConnect EHR:
1. Create ClinicalEncounter entity mapped @ManyToOne to Patient and @ManyToOne to User (Physician).
2. Structure clinical documentation into strict SOAP format:
   - Subjective: Chief complaint and History of Present Illness (HPI).
   - Objective: Physical examination findings and attached vital signs.
   - Assessment: Primary and differential diagnoses linked with ICD-10 codes.
   - Plan: Treatment strategy, orders, and follow-up timeline.
3. Add electronic signature lock: signedBy, signedAt timestamp, and status (DRAFT, FINALIZED). Finalized notes cannot be mutated.
4. Implement EncounterController and EncounterService with validation ensuring only authenticated doctors can sign notes.""",
        "deliverables": [
            "ClinicalEncounter entity with SOAP architectural fields",
            "ICD-10 clinical diagnosis code integration",
            "Digital physician locking and tamper-proof finalization",
            "EncounterService with patient timeline tracking"
        ],
        "files": ["ClinicalEncounter.java", "EncounterRepository.java", "EncounterService.java", "EncounterController.java"],
        "verification": "Encounter note finalization prevents subsequent updates; returns 403 on edit attempt."
    },
    {
        "num": 5,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "Biometrics",
        "title": "Vital Signs Monitoring & Automatic BMI Engine",
        "objective": "Build automated physiological vitals recording with real-time Body Mass Index (BMI) calculations and abnormal flag triage.",
        "prompt": """Implement the Vital Signs Flowsheet module for CareConnect EHR:
1. Create VitalSign entity with systolicBp, diastolicBp, heartRate, respiratoryRate, temperatureCelsius, oxygenSaturation (SpO2), heightCm, weightKg, bmi, and recordedAt.
2. Write automated BMI computation logic: BMI = weightKg / ((heightCm / 100) ^ 2), rounded to one decimal place, with classification (Underweight, Normal, Overweight, Obese).
3. Implement clinical safety boundary checks: flag critical vitals (e.g. Systolic BP > 180, SpO2 < 90%, Heart Rate > 120 or < 50) as STAT alerts.
4. Provide REST endpoints to record vitals during triage and fetch chronological longitudinal vital sign trends for a patient.""",
        "deliverables": [
            "VitalSign entity with patient foreign key relationship",
            "Real-time BMI calculation and clinical category mapping",
            "Abnormal threshold evaluator and vital alert flags",
            "Longitudinal time-series query for patient vitals history"
        ],
        "files": ["VitalSign.java", "VitalSignDto.java", "PatientService.java", "EncounterController.java"],
        "verification": "Computed BMI for height 175cm / weight 70kg = 22.9 (Normal); triggered BP alert on 185/110."
    },
    {
        "num": 6,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "CPOE Orders",
        "title": "Computerized Physician Order Entry (CPOE) & LOINC Diagnostics",
        "objective": "Develop diagnostic lab and radiology requisition workflow with LOINC test nomenclature and clinical priority levels.",
        "prompt": """Construct the Computerized Physician Order Entry (CPOE) module for lab tests and radiology orders:
1. Create MedicalOrder entity with fields: orderNumber, orderType (LAB, RADIOLOGY, PROCEDURE), testName, loincCode, priority (ROUTINE, URGENT, STAT), orderStatus (PLACED, IN_PROGRESS, COMPLETED, CANCELLED), clinicalNotes, orderDate, and completionDate.
2. Pre-seed LOINC catalogue: Lipid Panel (57698-3), CBC with Differential (58410-2), Comprehensive Metabolic Panel (24320-4), Chest X-Ray 2-Views (36554-4).
3. Implement order fulfillment workflow: diagnostic technicians update results, enter biological reference ranges, and flag abnormal findings.
4. Expose CPOE endpoints in OrderController with role restrictions (Doctors place orders; Technicians/Nurses report results).""",
        "deliverables": [
            "MedicalOrder entity with LOINC diagnostic standard mapping",
            "Clinical triage priority queue (ROUTINE, URGENT, STAT)",
            "Diagnostic fulfillment engine with abnormal result markers",
            "OrderController providing doctor ordering & tech result entry"
        ],
        "files": ["MedicalOrder.java", "OrderRepository.java", "OrderService.java", "OrderController.java"],
        "verification": "Created STAT CBC order with LOINC 58410-2; updated result with flagged low hemoglobin."
    },
    {
        "num": 7,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "Clinical Safety",
        "title": "Real-Time Drug-Drug Interaction (DDI) & Medication Engine",
        "objective": "Build RxNorm prescription management with an intelligent rule-based Drug-Drug Interaction safety detection engine.",
        "prompt": """Architect an intelligent Drug-Drug Interaction (DDI) safety engine and e-prescribing system:
1. Create Prescription entity: medicationName, rxNormCode, dosage, unit, route (Oral, IV, Sublingual), frequency (QD, BID, TID, PRN), startDate, endDate, and prescribingDoctor.
2. Create DrugInteractionRule entity storing known contraindications with severity levels (CRITICAL, MAJOR, MODERATE) and clinical warning descriptions.
3. Pre-seed critical medical interaction rules:
   - Warfarin + Aspirin -> CRITICAL: Severe risk of major gastrointestinal hemorrhage.
   - Lisinopril + Spironolactone -> MAJOR: Risk of fatal hyperkalemia and cardiac arrest.
   - Metformin + Contrast Dye -> MAJOR: Risk of severe contrast-induced lactic acidosis.
4. Implement MedicationService.checkInteractions() that cross-references newly drafted prescriptions against all active patient medications and returns actionable alerts.""",
        "deliverables": [
            "Prescription and DrugInteractionRule JPA data entities",
            "Real-time DDI engine cross-referencing candidate drugs",
            "Multi-tier severity alert system (CRITICAL, MAJOR, MODERATE)",
            "MedicationController with /check-interactions endpoint"
        ],
        "files": ["Prescription.java", "DrugInteractionRule.java", "MedicationService.java", "MedicationController.java"],
        "verification": "Alert verified: Attempting to prescribe Aspirin to patient on Warfarin generated CRITICAL warning."
    },
    {
        "num": 8,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "HIPAA Compliance",
        "title": "HIPAA Audit Trail & PHI Access Logging",
        "objective": "Implement immutable Protected Health Information (PHI) access logging meeting HIPAA Title II compliance mandates.",
        "prompt": """Implement a comprehensive HIPAA Title II Security & Audit Logging subsystem for CareConnect EHR:
1. Create AuditLog entity: id, userId, username, userRole, action (VIEW_PATIENT_CHART, CREATE_ORDER, SIGN_NOTE, EXPORT_RECORD, LOGIN_ATTEMPT), resourceType, resourceId, ipAddress, timestamp, and status.
2. Build an asynchronous Spring event listener or AOP aspect (@AuditAction) to automatically record audit entries without degrading request latency.
3. Guarantee immutability: Audit log records must have no UPDATE or DELETE repository methods exposed.
4. Create AuditController restricted strictly to ROLE_ADMIN to view and filter audit logs by date range, user, action, and affected patient MRN.""",
        "deliverables": [
            "Immutable AuditLog entity with comprehensive metadata",
            "Non-blocking audit capture on all PHI access events",
            "Strict admin-only AuditController REST query API",
            "Comprehensive filter specification (Date, User, Action, MRN)"
        ],
        "files": ["AuditLog.java", "AuditLogRepository.java", "AuditService.java", "AuditController.java"],
        "verification": "All patient chart views logged; attempting to modify an audit entry is prevented by design."
    },
    {
        "num": 9,
        "phase": "Phase 2: Core Clinical Backend",
        "category": "Database Seeding",
        "title": "Database Initialization & Clinical Demo Seed Data",
        "objective": "Seed realistic multi-role clinical users, complex patient medical histories, orders, and interaction rules into H2/Oracle.",
        "prompt": """Develop a comprehensive DataInitializer component for CareConnect EHR that runs on application startup:
1. Check if database is populated; if empty, initialize realistic demonstration records.
2. Seed clinical user accounts with BCrypt-hashed passwords:
   - Doctor: dr.smith@careconnect.com (ROLE_DOCTOR)
   - Nurse: nurse.sarah@careconnect.com (ROLE_NURSE)
   - Admin: admin@careconnect.com (ROLE_ADMIN)
   - Patient: patient.john@careconnect.com (ROLE_PATIENT)
3. Seed 5+ diverse patient charts complete with MRNs, demographics, chronic conditions, and penicillin/sulfa allergies.
4. Seed historical clinical encounters with SOAP notes, ICD-10 diagnoses, vital signs, active prescriptions, and completed LOINC lab reports.
5. Populate the DrugInteractionRule catalog with clinically verified medication pairs.""",
        "deliverables": [
            "DataInitializer implementing CommandLineRunner",
            "Pre-seeded multi-role accounts with encrypted passwords",
            "Realistic longitudinal patient health records and encounters",
            "Curated drug interaction knowledge base ready out-of-the-box"
        ],
        "files": ["DataInitializer.java", "application.yml", "pom.xml"],
        "verification": "Application boots cleanly; all test accounts authenticate and verify immediately."
    },
    {
        "num": 10,
        "phase": "Phase 3: Frontend Architecture",
        "category": "Client Foundation",
        "title": "Angular 17 Workspace, State Management & Interceptors",
        "objective": "Initialize the modern Angular 17 SPA with standalone components, JWT auth interceptor, and clinical route guards.",
        "prompt": """Initialize the Angular 17 enterprise frontend client for CareConnect EHR:
1. Configure standalone components, HttpClient with modern provideHttpClient(withInterceptors()), and provideRouter with HTML5 history.
2. Build AuthService: manage current user state using RxJS BehaviorSubject, handle JWT token storage in localStorage, and provide hasRole() helpers.
3. Implement JwtInterceptor: automatically attach Authorization: Bearer <token> header to all outgoing /api requests.
4. Implement AuthGuard and RoleGuard: restrict navigation based on authentication status and user roles (e.g. only DOCTOR/NURSE can view /clinical-notes).
5. Build modern responsive NavbarComponent showing user profile, current role badge, and dynamic navigation links.""",
        "deliverables": [
            "Angular 17 standalone architecture without NgModule bloat",
            "AuthService with reactive user stream & persistent session",
            "HTTP Bearer token interceptor for secure API communication",
            "AuthGuard and RoleGuard securing private healthcare views"
        ],
        "files": ["main.ts", "app.routes.ts", "auth.service.ts", "jwt.interceptor.ts", "navbar.component.ts"],
        "verification": "Protected routes redirect unauthorized users to /login; JWT automatically attached."
    },
    {
        "num": 11,
        "phase": "Phase 3: Frontend Architecture",
        "category": "Executive UI",
        "title": "Hospital Overview Clinical Dashboard Component",
        "objective": "Build the central clinical dashboard featuring key hospital KPIs, patient census, quick actions, and triage notifications.",
        "prompt": """Develop the DashboardComponent in Angular 17 for CareConnect EHR:
1. Create responsive KPI stats grid: Total Active Patients, Pending Lab Orders, STAT Alerts, and Encounters Completed Today.
2. Build a Quick Action command center: Register New Patient, New Clinical Note, Order Lab/X-Ray, Prescribe Medication.
3. Display Recent Patients table with MRN, Name, Age/Gender, Blood Group, Allergy Badges, and direct link to 360° patient chart.
4. Include a STAT Clinical Alert banner highlighting abnormal vitals or urgent unfulfilled diagnostic orders.
5. Style with custom SCSS using modern healthcare color palette (deep slate, clinical cyan, alert crimson) and sleek cards.""",
        "deliverables": [
            "DashboardComponent with live statistics aggregator",
            "Quick-action triage navigation bar",
            "Recent patient census table with visual allergy tags",
            "Emergency STAT alert panel for high-risk clinical events"
        ],
        "files": ["dashboard.component.ts", "dashboard.component.html", "dashboard.component.scss", "dashboard.service.ts"],
        "verification": "Dashboard renders census stats and allows instantaneous 1-click patient chart access."
    },
    {
        "num": 12,
        "phase": "Phase 4: Clinical User Interfaces",
        "category": "EMPI Interface",
        "title": "Patient Directory & 360-Degree Medical Chart UI",
        "objective": "Construct the patient search directory and comprehensive 360° medical record viewer with multi-tab clinical navigation.",
        "prompt": """Create the PatientsComponent and PatientDetailComponent in Angular 17:
1. Build interactive Patient Directory: live debounced search by MRN or name, filter by gender/blood group, and pagination.
2. Implement 'New Patient Registration' modal with reactive form validation (name, dob, gender, emergency contact, allergies).
3. Build the 360° Patient Chart View with organized tabs:
   - Overview: Demographics, insurance, persistent high-visibility allergy warning banner.
   - Clinical Encounters: Chronological SOAP notes with doctor signatures.
   - Vitals Flowsheet: Historical vitals table with calculated BMI indicators.
   - Diagnostic Orders: LOINC lab and imaging orders with live status badges.
   - Medications: Active prescriptions and dosage timeline.""",
        "deliverables": [
            "Debounced real-time patient directory search",
            "Reactive registration form with input sanitization",
            "Comprehensive 360° tabbed patient health record view",
            "Allergy safety alert banner permanently anchored on top"
        ],
        "files": ["patients.component.ts", "patients.component.html", "patient.service.ts", "styles.scss"],
        "verification": "Patient search filters instantly; registration adds patient and auto-generates MRN."
    },
    {
        "num": 13,
        "phase": "Phase 4: Clinical User Interfaces",
        "category": "SOAP Workflow",
        "title": "Clinical Notes & SOAP Documentation Interface",
        "objective": "Build the interactive physician SOAP note creator with ICD-10 diagnostic search and digital lock sign-off.",
        "prompt": """Develop the ClinicalNotesComponent in Angular 17 for physician documentation:
1. Build structured 4-quadrant SOAP input interface:
   - S (Subjective): Textarea for chief complaint & patient symptoms.
   - O (Objective): Textarea for physical findings & integrated vitals widget.
   - A (Assessment): Diagnosis selector with searchable ICD-10 dropdown (e.g. Essential Hypertension I10, Type 2 Diabetes E11.9).
   - P (Plan): Plan of care, counseling instructions, follow-up scheduler.
2. Add 'Save Draft' and 'Sign & Finalize Note' actions.
3. When finalized, render an official certified note badge displaying physician name, license/role, and timestamped digital signature lock.
4. Render past finalized notes in read-only audit view to prevent accidental edits.""",
        "deliverables": [
            "Structured 4-section SOAP clinical note documentation UI",
            "Integrated ICD-10 diagnostic code lookup assistant",
            "Physician digital signature sign-off and note locking workflow",
            "Read-only historical note viewer with tamper-evident badges"
        ],
        "files": ["clinical-notes.component.ts", "clinical-notes.component.html", "clinical-notes.component.scss"],
        "verification": "Finalized notes display certified physician lock badge; edits become disabled."
    },
    {
        "num": 14,
        "phase": "Phase 4: Clinical User Interfaces",
        "category": "CPOE Interface",
        "title": "CPOE Order Requisitions & Diagnostic Results Portal",
        "objective": "Implement computerized order entry for lab and radiology requisitions with priority triage and result entry.",
        "prompt": """Build the CpoeComponent in Angular 17 for physician orders and diagnostic results:
1. Requisition Form: Select patient, choose order type (Laboratory or Radiology), select LOINC test from searchable catalog (CBC, Lipid Panel, BMP, X-Ray), and select priority (ROUTINE, URGENT, STAT).
2. Live Orders Table: View all active hospital orders with status badges (PLACED = Yellow, IN_PROGRESS = Blue, COMPLETED = Green).
3. Diagnostic Result Entry Modal: Allow lab technicians and nurses to enter numeric results, reference ranges (e.g., 13.5 - 17.5 g/dL), and toggle the 'Abnormal Result Flag'.
4. Include quick filter tabs: All Orders, My Pending Orders, STAT Emergency Orders.""",
        "deliverables": [
            "Physician CPOE requisition wizard with LOINC picker",
            "Live order tracker with priority badges (ROUTINE / URGENT / STAT)",
            "Technician diagnostic reporting interface with abnormal flags",
            "Emergency STAT triage filter for time-sensitive diagnostics"
        ],
        "files": ["cpoe.component.ts", "cpoe.component.html", "cpoe.component.scss", "order.service.ts"],
        "verification": "Placed STAT lab order, entered technician results, and verified abnormal flag visibility."
    },
    {
        "num": 15,
        "phase": "Phase 4: Clinical User Interfaces",
        "category": "Pharmacy & Safety",
        "title": "Medication Prescribing & Interactive Safety Checker UI",
        "objective": "Build e-prescribing and a standalone Drug-Drug Interaction checker simulating polypharmacy safety checks.",
        "prompt": """Develop the MedicationsComponent and InteractionCheckerComponent in Angular 17:
1. Prescription Creation Form: Patient selector, medication name (RxNorm), dosage (mg/ml), route (Oral, IV), frequency, and duration.
2. Pre-Prescription Safety Check: Before submitting a prescription, trigger an automated background call to /api/medications/check-interactions against patient's current medications.
3. If an interaction exists, display high-impact warning modal with severity color coding (CRITICAL = Red, MAJOR = Orange) and clinical rationale.
4. Build the standalone Drug-Drug Interaction Simulator: Allow doctors to select any two drugs (e.g., Warfarin + Aspirin) to test potential interactions before deciding on a treatment course.""",
        "deliverables": [
            "E-Prescribing form with RxNorm dosage and route options",
            "Proactive pre-submission interaction safety modal",
            "Standalone Drug Interaction Simulator for clinical exploration",
            "Active medications list with discontinuation actions"
        ],
        "files": ["medications.component.ts", "interaction-checker.component.ts", "medication.service.ts"],
        "verification": "Simulator instantly flagged Warfarin + Aspirin with CRITICAL bleeding risk alert."
    },
    {
        "num": 16,
        "phase": "Phase 4: Clinical User Interfaces",
        "category": "Self-Service",
        "title": "Secure Patient Portal & Self-Service Health Records",
        "objective": "Build the patient-facing portal allowing individuals to inspect personal medical records, certified lab reports, and prescriptions.",
        "prompt": """Construct the PatientPortalComponent in Angular 17 for patient self-service:
1. Restrict view to ROLE_PATIENT; automatically bind context to authenticated user's linked patient record.
2. Create clear, patient-friendly UI sections:
   - My Profile & Allergies: Emergency contacts, blood type, known allergies.
   - My Prescriptions: Active medications, plain-language dosage instructions, refill status.
   - Diagnostic Lab Results: Published lab reports with simplified normal/abnormal status indicators.
   - Visit Summaries: Physician SOAP care plans and follow-up recommendations.
3. Provide a 'Download Complete Health Summary' action simulating an export of personal medical records.""",
        "deliverables": [
            "Patient-facing self-service health dashboard",
            "Active prescription schedule with simplified instructions",
            "Verified diagnostic reports with patient-friendly indicators",
            "Doctor visit care plans and follow-up guidance"
        ],
        "files": ["patient-portal.component.ts", "patient-portal.component.html", "patient-portal.service.ts"],
        "verification": "Logged in as patient.john@careconnect.com; verified personal vitals and lab results."
    },
    {
        "num": 17,
        "phase": "Phase 5: Production & CI/CD",
        "category": "Cloud & CI/CD",
        "title": "Automated Build Verification, Netlify & Cloud Deployment",
        "objective": "Engineer the continuous deployment pipeline, containerization, and production web deployment on Netlify.",
        "prompt": """Configure the end-to-end production deployment and automated verification pipeline for CareConnect EHR:
1. Create GitHub Actions CI workflow (.github/workflows/main.yml):
   - Checkout code and set up JDK 21.
   - Run Maven clean verify to execute backend tests and package runnable JAR.
   - Set up Node.js 20 and run npm run build for Angular 17.
2. Build Dockerfile for containerized backend execution with multi-stage build.
3. Configure Netlify deployment for the Angular frontend:
   - Set publish directory to frontend/dist/care-connect-ehr/browser.
   - Create _redirects and netlify.toml with SPA catch-all rule (/* /index.html 200).
4. Run comprehensive end-to-end smoke test verifying authentication, patient search, CPOE ordering, and interaction alerts.""",
        "deliverables": [
            "GitHub Actions CI workflow for backend & frontend validation",
            "Production Dockerfile for containerized Spring Boot execution",
            "Netlify SPA redirect configuration for Angular HTML5 routing",
            "Live web application deployment at care-connect-ehr-hcl.netlify.app"
        ],
        "files": [".github/workflows/main.yml", "Dockerfile", "netlify.toml", "_redirects"],
        "verification": "Live deployment verified at care-connect-ehr-hcl.netlify.app; CI pipeline passes with green check."
    }
]

for p in prompts:
    deliv_html = "".join([f"<li>{d}</li>" for d in p["deliverables"]])
    files_html = "".join([f'<span class="file-tag">{f}</span>' for f in p["files"]])
    
    # Escape prompt text for safe html display
    safe_prompt = p["prompt"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    html_content += f"""
<!-- PROMPT {p["num"]} -->
<div class="page">
  <div class="page-header">
    <div class="header-tag">
      <span class="tag-step">PROMPT #{p["num"]:02d}</span>
      <span class="tag-phase">{p["phase"]}</span>
    </div>
    <div class="header-project">CareConnect EHR • AI Blueprint</div>
  </div>

  <div class="prompt-title-section">
    <div class="prompt-title">
      {p["title"]}
      <span class="category-badge">{p["category"]}</span>
    </div>
    <div class="prompt-objective">{p["objective"]}</div>
  </div>

  <!-- Simulated AI Prompt Terminal / Chat Frame -->
  <div class="chat-window">
    <div class="chat-titlebar">
      <div class="traffic-lights">
        <div class="traffic-light tl-red"></div>
        <div class="traffic-light tl-yellow"></div>
        <div class="traffic-light tl-green"></div>
      </div>
      <div class="chat-title-text">prompt_step_{p["num"]:02d}.agent-prompt • User Request</div>
      <div class="chat-badge">INPUT PROMPT</div>
    </div>
    <div class="chat-content">
      <div class="prompt-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        System Prompt &amp; Engineering Instructions
      </div>
      <div class="user-prompt-bubble">{safe_prompt}</div>
    </div>
  </div>

  <!-- Deliverables & Key Files -->
  <div class="details-grid">
    <div class="detail-panel">
      <div class="panel-title">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Key Deliverables &amp; Outcomes
      </div>
      <ul class="bullet-list">
        {deliv_html}
      </ul>
    </div>

    <div class="detail-panel">
      <div class="panel-title">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Generated Code Assets &amp; Entities
      </div>
      <div class="files-badge-list" style="margin-top: 4px; margin-bottom: 8px;">
        {files_html}
      </div>
      <div style="font-size: 10px; color: #64748b; line-height: 1.4; margin-top: 6px;">
        Structured in adherence with enterprise healthcare specifications and Spring/Angular best practices.
      </div>
    </div>
  </div>

  <!-- Verification Status Banner -->
  <div class="verification-banner">
    <div class="verif-left">
      <span class="verif-check">✓</span>
      <span><strong>Verification Result:</strong> {p["verification"]}</span>
    </div>
    <span class="verif-tag">STATUS: 100% VERIFIED</span>
  </div>

  <div class="page-footer">
    <div>CareConnect EHR • Patient-Provider Clinical System</div>
    <div>Slide {p["num"] + 1} of 18 (Prompt {p["num"]} of 17)</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_17_Prompts_Booklet.html"
pdf_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_17_Prompts_Screenshots.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML at: {html_path}")

# Run headless Chrome to render PDF
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
