# CareConnect: Patient-Provider EHR (Electronic Health Record System)

**Project Code:** `P_003`  
**Domain:** Healthcare & Pharma  
**Track:** Full Stack Development  
**Technology Stack:** Java 21+, Spring Boot 3.3.x, Angular 22, Oracle DB XE / H2, Spring Security (JWT), SpringDoc OpenAPI (Swagger), SCSS  

---

## 🌟 Executive Summary

**CareConnect EHR** is an enterprise-grade, web-based Electronic Health Record (EHR) and Computerized Physician Order Entry (CPOE) platform engineered to bridge the clinical workflow gap between healthcare providers (physicians, nurses, diagnostic technicians, hospital administrators) and patients.

The platform provides end-to-end clinical workflows compliant with healthcare standards such as **HL7/FHIR** data structures, **ICD-10** diagnostic coding, **LOINC** laboratory/radiology nomenclature, **RxNorm** pharmaceutical mappings, and **HIPAA Security & Audit Trail** mandates.

---

## 🏥 Core Functional Modules

### 1. Patient Records Management (EMPI)
- **Enterprise Master Patient Index (EMPI):** Centralized registry with automatic generation of Medical Record Numbers (`MRN-YYYY-XXXX`).
- **360-Degree Patient Medical Chart:** Patient demographics, emergency contacts, insurance payer/policy tracking, blood group, and contact coordinates.
- **Critical Clinical Safety Alerts:** Highlighting patient allergies (e.g. Penicillin, NSAIDs) in prominent red alerts throughout prescribing and charting workflows.
- **Vitals Flowsheet:** Timestamped tracking of Systolic/Diastolic BP, Heart Rate, Respiratory Rate, Body Temperature, Oxygen Saturation (SpO2), Height, Weight, and automatic real-time **Body Mass Index (BMI)** calculation.

### 2. Clinical Documentation & SOAP Notes
- **Structured SOAP Format:**
  - **S (Subjective):** Patient narrative, History of Present Illness (HPI), reported symptoms.
  - **O (Objective):** Physical examination findings (CVS, RS, Abdomen, Neuro) and observed vitals.
  - **A (Assessment):** Primary and differential diagnoses integrated with **ICD-10** codes (e.g., `I10 - Essential Hypertension`, `E11.9 - Type 2 Diabetes`, `E78.5 - Dyslipidemia`, `I25.10 - CAD`).
  - **P (Plan):** Therapeutic roadmap, lab orders, counseling, and scheduled follow-up dates.
- **Electronic Physician Signature:** Digital locking and certification of clinical notes by the attending clinician with audit timestamping.

### 3. Computerized Physician Order Entry (CPOE)
- **Laboratory, Diagnostic Radiology & Procedure Requisitions:** Coded with standardized **LOINC** codes (e.g., `57698-3` Lipid Profile, `58410-2` CBC, `24320-4` BMP, `36554-4` Chest X-Ray).
- **Clinical Priority Triage:** `ROUTINE`, `URGENT`, and `STAT` (Immediate Emergency).
- **Diagnostic Result Reporting:** Diagnostic technicians/physicians record numerical results, normal biological reference ranges, and toggle **Abnormal Diagnostic Flags** that immediately alert physicians on the dashboard.

### 4. Medication Management & Real-Time Drug Interaction Safety Engine
- **E-Prescribing:** Prescribe medications specifying generic/brand name, RxNorm code, dosage, route (Oral, IV, Sublingual, SC, Topical), dosing frequency, treatment duration, and refill counts.
- **Real-Time Drug-Drug Interaction Safety Engine:** Cross-references any newly entered prescription against all existing active medications taken by the patient. If a hazardous combination is detected (e.g. **Warfarin + Aspirin** [major hemorrhage risk], **Lisinopril + Spironolactone** [severe hyperkalemia risk], **Metformin + Contrast** [lactic acidosis]), a **High-Severity Alert** appears with clinical rationale and management recommendations.
- **Discontinuation Tracking:** Formal discontinuation workflow capturing clinician rationale.

### 5. Patient Portal (Self-Service Dashboard)
- Dedicated, secure patient-facing web portal allowing individuals to:
  - View personal medical profile, allergies, and emergency contacts.
  - Access their vital signs trends over time.
  - Review certified diagnostic laboratory and radiology results.
  - Check active medications, pharmacy instructions, and refill allowances.
  - Read clinical visit summaries and physician care plans.

### 6. HIPAA Audit Trail & Role-Based Access Control (RBAC)
- **Role-Based Access Control (RBAC):** `ROLE_DOCTOR`, `ROLE_NURSE`, `ROLE_ADMIN`, `ROLE_PATIENT` secured by stateless **JWT** tokens.
- **HIPAA Audit Log:** Every access to Protected Health Information (PHI)—including patient chart views, SOAP note creations, electronic signatures, CPOE orders, and prescription entries—is recorded with timestamp, user ID, role, action, and client IP address.

---

## 🔑 Pre-Seeded Demo User Accounts

You can log in instantly using the **One-Click Demo Buttons** on the login page or with the following credentials:

| Role | Username | Password | Full Name / Description |
| :--- | :--- | :--- | :--- |
| **Doctor** | `dr.sharma` | `Doctor@123` | Dr. Rajesh Sharma, MD (Cardiology) |
| **Doctor** | `dr.patel` | `Doctor@123` | Dr. Sneha Patel, MD (Internal Medicine) |
| **Nurse** | `nurse.priya` | `Nurse@123` | Nurse Priya Nair, BSN |
| **Patient** | `patient.rohit` | `Patient@123` | Rohit Verma (Patient Portal - MRN-2026-1001) |
| **Patient** | `patient.ananya` | `Patient@123` | Ananya Deshmukh (Patient Portal - MRN-2026-1002) |
| **Admin** | `admin` | `Admin@123` | System Administrator (Full Audit & User Access) |

---

## 🚀 Running the Project

### Prerequisites
- **Java:** JDK 21 or higher
- **Node.js:** v18+ or v20+ or v24+
- **Database:** Runs out-of-the-box with embedded in-memory H2 (Oracle mode), or connects directly to local **Oracle Database XE** (`localhost:1521:XE`).

---

### Step 1: Running the Backend (Spring Boot)

1. Open PowerShell in the `backend` folder:
   ```powershell
   cd "backend"
   .\mvnw.cmd spring-boot:run
   ```
2. The Spring Boot backend starts on **port `8085`** (avoiding port 8080 collision with Oracle TNS Listener).
3. **Swagger Interactive API Documentation:**
   - URL: [http://localhost:8085/swagger-ui/index.html](http://localhost:8085/swagger-ui/index.html)
   - OpenAPI Docs: [http://localhost:8085/v3/api-docs](http://localhost:8085/v3/api-docs)
4. **H2 In-Memory Database Console (Dev Profile):**
   - URL: [http://localhost:8085/h2-console](http://localhost:8085/h2-console)
   - JDBC URL: `jdbc:h2:mem:careconnectdb`
   - User: `sa`, Password: *(leave blank)*

---

### Step 2: Running with Oracle XE (Production Profile)

CareConnect is pre-configured with the Oracle JDBC driver (`ojdbc11`) and Hibernate `OracleDialect`.
To activate the Oracle database profile:
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=oracle
```
*Schema Script:* Execute `backend/src/main/resources/oracle-schema.sql` inside your Oracle XE schema or SQL*Plus.

---

### Step 3: Running the Frontend (Angular 22)

1. Open a new terminal in the `frontend` directory:
   ```powershell
   cd "frontend"
   npx ng serve --port 4200
   ```
2. Open your browser and navigate to:
   👉 **[http://localhost:4200](http://localhost:4200)**

---

## 📁 Project Directory Structure

```
HCL Project/
├── backend/                                # Spring Boot 3 Application
│   ├── pom.xml                             # Maven configuration (Security, JPA, JWT, Oracle, Swagger)
│   ├── mvnw & mvnw.cmd                     # Maven Wrapper executable
│   └── src/
│       ├── main/
│       │   ├── java/com/careconnect/ehr/
│       │   │   ├── CareConnectApplication.java
│       │   │   ├── config/                 # SecurityConfig, DataInitializer, CorsConfig
│       │   │   ├── controller/             # Auth, Patient, Encounter, CPOE, Medication, Portal, Audit
│       │   │   ├── dto/                    # Transfer objects for all modules
│       │   │   ├── entity/                 # Patient, Vitals, Encounter, Order, Prescription, AuditLog
│       │   │   ├── repository/             # Spring Data JPA Repositories
│       │   │   ├── security/               # JWT Provider, CustomUserDetailsService, JwtAuthFilter
│       │   │   └── service/                # Business logic & drug interaction safety engine
│       │   └── resources/
│       │       ├── application.yml         # Dual profile configuration (Dev H2 / Oracle XE)
│       │       └── oracle-schema.sql       # Oracle DDL & seed scripts
│
└── frontend/                               # Angular 22 Single Page Application
    ├── package.json
    ├── angular.json
    └── src/
        ├── index.html
        ├── styles.scss                     # Modern clinical SaaS theme
        ├── environments/
        │   └── environment.ts              # Points to backend port 8085
        └── app/
            ├── models/ehr.models.ts        # Strongly typed TypeScript interfaces
            ├── services/                   # AuthService, EhrService, AuthInterceptor, AuthGuard
            └── components/
                ├── navbar/                 # Responsive medical navigation & user profile
                ├── login/                  # Clinical login card with 1-click demo logins
                ├── dashboard/              # Provider telemetry, KPIs & abnormal alerts
                ├── patients/               # EMPI directory, patient registration & 360 chart
                ├── clinical-notes/         # SOAP documentation & electronic signature
                ├── cpoe/                   # Lab & Radiology CPOE orders with abnormal flagging
                ├── medications/            # E-Prescribing with real-time drug interaction alert
                ├── interaction-checker/    # Standalone clinical pharmacology decision tool
                ├── patient-portal/         # Patient self-service health records & results
                └── audit-trail/            # HIPAA compliance access audit log
```
