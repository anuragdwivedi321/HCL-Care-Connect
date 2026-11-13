import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Prompt Clarity &amp; Rewriting Comparison</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&family=Consolas&family=JetBrains+Mono:wght@400;500;600&display=swap');

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
    background-color: #0b0f14;
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
    padding: 14mm 16mm;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
    background-color: #0b0f14;
    overflow: hidden;
  }

  /* Header Bar */
  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #21262d;
    padding-bottom: 10px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .case-tag {
    background: #1f6feb;
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .module-title {
    font-size: 14px;
    font-weight: 700;
    color: #f0f6fc;
  }

  .page-num {
    font-size: 11px;
    color: #8b949e;
    font-weight: 500;
  }

  /* Comparison Container */
  .comparison-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex-grow: 1;
  }

  /* BEFORE CARD */
  .card-before {
    background: #12171f;
    border: 1.5px solid #da3633;
    border-left: 5px solid #f85149;
    border-radius: 8px;
    padding: 16px 18px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .card-header-before {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .badge-before {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(248, 81, 73, 0.15);
    border: 1px solid rgba(248, 81, 73, 0.4);
    color: #ff7b72;
    padding: 3px 10px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .prompt-text-before {
    font-family: 'Consolas', monospace;
    font-size: 13.5px;
    line-height: 1.5;
    color: #ffa198;
    background: #0d1117;
    padding: 12px 14px;
    border-radius: 6px;
    border: 1px solid #30363d;
    margin-bottom: 10px;
  }

  .critique-box {
    font-size: 11.5px;
    color: #c9d1d9;
    line-height: 1.5;
  }

  .critique-box strong {
    color: #ff7b72;
  }

  /* AFTER CARD */
  .card-after {
    background: #12171f;
    border: 1.5px solid #238636;
    border-left: 5px solid #3fb950;
    border-radius: 8px;
    padding: 16px 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .card-header-after {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .badge-after {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(63, 185, 80, 0.15);
    border: 1px solid rgba(63, 185, 80, 0.4);
    color: #56d364;
    padding: 3px 10px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .prompt-text-after {
    font-family: 'Segoe UI', -apple-system, sans-serif;
    font-size: 12.5px;
    line-height: 1.6;
    color: #f0f6fc;
    background: #0d1117;
    padding: 14px 16px;
    border-radius: 6px;
    border: 1px solid #30363d;
    white-space: pre-wrap;
    word-break: break-word;
    flex-grow: 1;
  }

  .improvements-bar {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #21262d;
    font-size: 11.5px;
    color: #7ee787;
    line-height: 1.45;
  }

  .improvements-bar strong {
    color: #56d364;
  }

  /* Clean Footer */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #21262d;
    padding-top: 8px;
    font-size: 10px;
    color: #6e7681;
  }
</style>
</head>
<body>
"""

items = [
    {
        "num": 1,
        "title": "Spring Security 6 & Stateless JWT RBAC",
        "before": "login aur register bna do spring boot me role ke sath aur jwt bhi lga dena",
        "issue": "High Ambiguity: Lacks cryptographic algorithms, token claim definitions, role enumerations, and HTTP security filter constraints.",
        "after": """Act as a Senior Spring Security Architect. Implement stateless HIPAA-compliant authentication for CareConnect EHR:
1. Define User entity and Role enum (ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN, ROLE_PATIENT).
2. Create JwtService using HMAC-SHA256 (io.jsonwebtoken) with claims: username, role, and userId; set 24h expiration.
3. Implement JwtAuthenticationFilter extending OncePerRequestFilter to parse Authorization: Bearer <token> and set SecurityContextHolder.
4. Configure SecurityFilterChain: permit /api/auth/**, disable CSRF/session management (SessionCreationPolicy.STATELESS), and restrict /api/audit/** to ROLE_ADMIN.
5. Create AuthController with /login and /register returning AuthResponse (token, user details, role).""",
        "why_better": "Zero ambiguity: Explicit HMAC-SHA256 crypto standard, exact 4 roles, and stateless session policy to prevent CSRF vulnerabilities."
    },
    {
        "num": 2,
        "title": "Enterprise Master Patient Index & Auto-MRN",
        "before": "patient ka data store krne ka backend bnao aur mrn generate kro",
        "issue": "Missing Schema Specs: No demographic constraints, no MRN format specification, no race condition handling.",
        "after": """Develop the Enterprise Master Patient Index (EMPI) module for CareConnect EHR adhering to HL7 patient schema:
1. Create Patient JPA entity with fields: id, mrn (unique index), firstName, lastName, dob, gender, bloodGroup, contactNumber, emergencyContact, insuranceProvider, and allergies string.
2. Implement thread-safe automated MRN generation logic in the format 'MRN-YYYY-XXXX' where YYYY is current calendar year and XXXX is zero-padded sequential ID.
3. Write PatientRepository with Spring Data Specification for debounced multi-criteria search (by MRN, lastName, or contact number).
4. Build PatientService and PatientController with CRUD endpoints restricted to DOCTOR, NURSE, and ADMIN roles.""",
        "why_better": "Deterministic MRN format ('MRN-YYYY-XXXX'), clinical safety allergy fields, and dynamic multi-parameter search."
    },
    {
        "num": 3,
        "title": "Physician SOAP Notes & Electronic Signature Lock",
        "before": "doctor clinical notes likh sake aisa kuch bna do",
        "issue": "Unstructured Requirement: Does not specify clinical documentation standards (SOAP), diagnosis coding, or legal locking.",
        "after": """Construct the Clinical Documentation engine for CareConnect EHR using the standard medical SOAP structure:
1. Create ClinicalEncounter entity mapped @ManyToOne to Patient and @ManyToOne to User (Physician).
2. Structure the clinical data model into explicit SOAP sections:
   - S (Subjective): Chief complaint, History of Present Illness (HPI), patient symptoms.
   - O (Objective): Physical exam findings and vital sign observations.
   - A (Assessment): Primary and differential diagnoses linked with standardized ICD-10 codes.
   - P (Plan): Therapeutic treatment roadmap, orders, counseling, and follow-up timeline.
3. Implement digital lock mechanism: status (DRAFT, FINALIZED), signedBy, and signedAt timestamp. Finalized notes are immutable (throw 403 on edit attempt).
4. Expose REST endpoints in EncounterController with validation enforcing that only authenticated doctors can sign notes.""",
        "why_better": "Enforces international medical SOAP standards, ICD-10 diagnostic coding dictionary, and tamper-proof legal electronic note locking."
    },
    {
        "num": 4,
        "title": "Vital Signs Flowsheet & Real-Time BMI Engine",
        "before": "vitals save krna h bp sugar wagera aur bmi calculate kr do",
        "issue": "Vague Metrics: Missing mathematical rounding, clinical threshold alerts, and longitudinal recording requirements.",
        "after": """Implement the Vital Signs Flowsheet and Biometric calculation engine:
1. Create VitalSign entity: systolicBp, diastolicBp, heartRate, respiratoryRate, temperatureCelsius, oxygenSaturation (SpO2), heightCm, weightKg, bmi, and recordedAt.
2. Implement automated BMI calculation: BMI = weightKg / ((heightCm / 100) ^ 2), rounded to 1 decimal place, with category mapping (Underweight, Normal, Overweight, Obese).
3. Build clinical threshold safety alerts: automatically trigger STAT flags if Systolic BP > 180 mmHg, Diastolic BP > 110 mmHg, SpO2 < 90%, or Heart Rate > 120 bpm.
4. Expose endpoints in EncounterController to record triage vitals and retrieve chronological longitudinal vitals history for trend analysis.""",
        "why_better": "Defines exact mathematical BMI formula, rounding precision, emergency STAT triage alerts, and time-series historical storage."
    },
    {
        "num": 5,
        "title": "Computerized Physician Order Entry (LOINC Lab & Radiology)",
        "before": "lab test aur xray ka order system bnao doctor ke liye",
        "issue": "Missing Clinical Codes: No LOINC standard, no technician fulfillment workflow, no urgency prioritization.",
        "after": """Develop the Computerized Physician Order Entry (CPOE) subsystem for diagnostic requisitions:
1. Create MedicalOrder entity: orderNumber, orderType (LAB, RADIOLOGY, PROCEDURE), testName, loincCode, priority (ROUTINE, URGENT, STAT), orderStatus (PLACED, IN_PROGRESS, COMPLETED, CANCELLED), and clinicalNotes.
2. Seed verified LOINC catalog: Complete Blood Count (58410-2), Lipid Panel (57698-3), Basic Metabolic Panel (24320-4), Chest X-Ray 2-Views (36554-4).
3. Build technician fulfillment workflow: Diagnostic technicians update result values, specify biological reference ranges, and toggle abnormal result flags.
4. Expose OrderController endpoints with role-based routing (Doctors place orders; Technicians/Nurses report results).""",
        "why_better": "Integrates LOINC healthcare coding standards, urgency triage queue (ROUTINE, URGENT, STAT), and distinct doctor/technician workflows."
    },
    {
        "num": 6,
        "title": "Real-Time Drug-Drug Interaction (DDI) & E-Prescribing",
        "before": "prescription likhne ka option do aur dekho koi galat medicine to nahi di",
        "issue": "Zero Safety Rules: Lacks drug interaction database, contraindication severity levels, and RxNorm codes.",
        "after": """Architect an intelligent Drug-Drug Interaction (DDI) safety engine and e-prescribing system:
1. Create Prescription entity (medicationName, rxNormCode, dosage, route, frequency, startDate, endDate) and DrugInteractionRule entity (drugA, drugB, severityLevel, warningText).
2. Pre-seed high-risk clinical contraindications:
   - Warfarin + Aspirin -> CRITICAL: Severe risk of fatal internal hemorrhage.
   - Lisinopril + Spironolactone -> MAJOR: Risk of severe hyperkalemia and cardiac arrhythmia.
   - Metformin + Contrast Dye -> MAJOR: Risk of contrast-induced acute lactic acidosis.
3. Implement MedicationService.checkInteractions() that cross-references newly drafted prescriptions against all currently active patient medications.
4. Expose POST /api/medications/check-interactions returning flagged contraindications with severity and clinical recommendations.""",
        "why_better": "Explicitly pre-seeds dangerous contraindicated drug pairs with severity tiers (CRITICAL, MAJOR) and automated pre-order validation."
    },
    {
        "num": 7,
        "title": "HIPAA Security Audit Trail & Immutable PHI Logs",
        "before": "audit trail lga do kon kya kr rha h dekhne ke liye",
        "issue": "Legal Ambiguity: No compliance standard (HIPAA), no immutability guarantee, no async performance design.",
        "after": """Implement a HIPAA Title II compliant Security & Audit Logging subsystem for Protected Health Information (PHI):
1. Create AuditLog entity: id, userId, username, userRole, action (VIEW_PATIENT_CHART, CREATE_ORDER, SIGN_NOTE, EXPORT_RECORD), resourceType, resourceId, ipAddress, timestamp, and status.
2. Build an asynchronous Spring event listener (@Async) or AOP aspect (@AuditAction) to capture PHI access without adding latency to clinical HTTP requests.
3. Ensure immutability: The audit repository must expose NO update or delete methods; audit records cannot be altered.
4. Create AuditController restricted strictly to ROLE_ADMIN with multi-criteria filtering by date range, user, action, and patient MRN.""",
        "why_better": "Strict HIPAA compliance alignment, non-blocking asynchronous event capture, and immutable audit design preventing data tampering."
    },
    {
        "num": 8,
        "title": "Angular 17 Standalone Architecture & JWT Interceptor",
        "before": "frontend me angular lga ke login screen aur navbar bnao",
        "issue": "Legacy Paradigm: Could lead to obsolete NgModule structure, missing Bearer token interceptor, and unhandled 401 redirects.",
        "after": """Initialize the Angular 17 enterprise frontend client using modern standalone component architecture:
1. Configure standalone components with provideHttpClient(withInterceptors()) and provideRouter() in main.ts.
2. Implement AuthService managing current user session using RxJS BehaviorSubject and localStorage; provide hasRole() helpers.
3. Build JwtInterceptor to automatically attach Authorization: Bearer <token> header to all outgoing /api requests.
4. Implement AuthGuard and RoleGuard to guard private clinical routes and redirect unauthenticated users to /login.
5. Create modern NavbarComponent with user profile badge, active role indicator, and conditional navigation links based on permissions.""",
        "why_better": "Enforces modern Angular 17 standalone architecture, automatic HTTP Bearer token injection, and declarative role-based routing guards."
    },
    {
        "num": 9,
        "title": "360-Degree Medical Record Chart & Tabbed Patient View",
        "before": "patient page bnao jisme details dikhe",
        "issue": "Undefined UI Structure: Doesn't specify multi-tab EHR navigation, safety alert banners, or vitals graphs.",
        "after": """Develop the PatientsComponent and PatientDetailComponent in Angular 17 for comprehensive clinical chart review:
1. Patient Directory: Debounced search by MRN or Name, filter by gender/blood group, and responsive patient census table.
2. Patient Registration Modal: Form with reactive validation (Name, DOB, Gender, Emergency Contact, Allergies).
3. 360° Medical Record View with structured clinical tabs:
   - Demographics & Safety: Emergency contacts, insurance, persistent high-visibility allergy warning banner.
   - Encounters: Chronological SOAP notes with doctor digital signature certification badges.
   - Vitals Flowsheet: Historical vitals table with calculated BMI indicators and abnormal triage flags.
   - Orders: Active LOINC diagnostic requisitions with live status pills.
   - Medications: Current prescriptions and dosage timeline.""",
        "why_better": "Holistic 360° patient health record layout, persistent high-visibility allergy warning banner, and structured clinical tabs."
    },
    {
        "num": 10,
        "title": "Automated Build Pipeline, Docker & Netlify SPA Hosting",
        "before": "project ko deploy krna h aur test kr lo",
        "issue": "Zero Pipeline Details: No CI runner specs, no SPA routing rewrites, no containerization parameters.",
        "after": """Configure the production deployment and automated continuous integration pipeline for CareConnect EHR:
1. Build GitHub Actions CI workflow (.github/workflows/main.yml):
   - Set up JDK 21 and run Maven clean verify to run tests and package backend JAR.
   - Set up Node.js 20 and execute npm run build for Angular 17.
2. Create multi-stage Dockerfile for containerized Spring Boot backend packaging.
3. Configure Netlify deployment for the Angular frontend:
   - Set publish directory to frontend/dist/care-connect-ehr/browser.
   - Create netlify.toml and public/_redirects with SPA rewrite rule (/* /index.html 200).
4. Run end-to-end verification script testing authentication, patient search, CPOE order creation, and live site health.""",
        "why_better": "Dual-stack CI automation (JDK 21 + Node 20), Netlify SPA client-side routing resolution (/* -> /index.html 200), and Docker packaging."
    }
]

total = len(items)
for idx, it in enumerate(items):
    html_content += f"""
<div class="page">
  <!-- Minimal Header -->
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">CASE #{it["num"]:02d}</span>
      <span class="module-title">{it["title"]}</span>
    </div>
    <div class="page-num">Page {idx + 1} of {total}</div>
  </div>

  <!-- Pure Comparison Area -->
  <div class="comparison-container">
    <!-- BEFORE (RAW / VAGUE) -->
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : RAW / VAGUE PROMPT</span>
      </div>
      <div class="prompt-text-before">"{it["before"]}"</div>
      <div class="critique-box">
        <strong>Problem / Ambiguity:</strong> {it["issue"]}
      </div>
    </div>

    <!-- AFTER (REWRITTEN / CLEAR) -->
    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : REWRITTEN HIGH-CLARITY PROMPT</span>
      </div>
      <div class="prompt-text-after">{it["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Why It's Better:</strong> {it["why_better"]}
      </div>
    </div>
  </div>

  <!-- Minimal Footer -->
  <div class="footer">
    <div>CareConnect EHR &bull; Prompt Clarity &amp; Rewriting Comparison</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Prompt_Comparison_Only.html"
pdf_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Prompt_Comparison_Only.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated clean HTML at: {html_path}")

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
