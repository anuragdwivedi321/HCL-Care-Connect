# CareConnect: Patient-Provider EHR (Electronic Health Record System)

[![Live Web Application](https://img.shields.io/badge/Netlify-Live%20Demo-teal?style=for-the-badge&logo=netlify)](https://care-connect-ehr-hcl.netlify.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/anuragdwivedi321/HCL-Care-Connect)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red?style=for-the-badge&logo=angular)](https://angular.dev/)
[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)

---

## 🌐 Live Application & Links
* **Live Web Portal (Netlify):** [https://care-connect-ehr-hcl.netlify.app](https://care-connect-ehr-hcl.netlify.app)
* **GitHub Repository:** [https://github.com/anuragdwivedi321/HCL-Care-Connect](https://github.com/anuragdwivedi321/HCL-Care-Connect)

---

## 🌟 Executive Summary

**CareConnect EHR** is an enterprise-grade, web-based Electronic Health Record (EHR) and Computerized Physician Order Entry (CPOE) platform engineered to bridge the clinical workflow gap between healthcare providers (physicians, nurses, diagnostic technicians, hospital administrators) and patients.

The platform provides end-to-end clinical workflows compliant with modern healthcare informatics standards:
* **HL7 / FHIR** aligned data models
* **ICD-10** diagnostic coding dictionary
* **LOINC** laboratory and diagnostic procedure nomenclature
* **RxNorm** pharmaceutical mappings
* **HIPAA Security & Audit Trail** mandates (Protected Health Information access tracking)

---

## 📁 Project Directory Structure

```text
HCL Project/
├── backend/            # Spring Boot 3.3.x, Java 21 REST API & Business Logic
│   ├── src/            # Controllers, Services, Repositories, Security & Entities
│   ├── pom.xml         # Maven dependencies & build configuration
│   └── mvnw / mvnw.cmd # Maven Wrapper
├── frontend/           # Angular 17 Single Page Application (SPA)
│   ├── src/            # Components, Guards, Interceptors, Services, SCSS Styles
│   ├── package.json    # Node dependencies & npm scripts
│   └── angular.json    # Angular CLI workspace configuration
├── document/           # Project Presentations & Supplementary Artifacts
│   ├── CareConnect_EHR_Presentation.pptx # Master 9-Slide PowerPoint Deck
│   ├── CareConnect_Presentation.html     # Interactive Browser Presentation
│   ├── assets/         # UI Mockups, logos, presentation backgrounds
│   └── scripts/        # System verification and startup utilities
├── github/             # GitHub configuration
│   └── workflow/       # CI/CD Workflow pipeline definitions
│       └── main.yml    # Build & verification pipeline
├── .gitignore          # Git exclusion rules
└── README.md           # Master Project Documentation (This file)
```

---

## 🏥 Core Functional Modules

### 1. Patient Records Management (EMPI)
* **Enterprise Master Patient Index (EMPI):** Auto-generated unique Medical Record Numbers (`MRN-YYYY-XXXX`).
* **360° Medical Chart:** Demographics, emergency contacts, insurance payer/policy tracking, blood groups, and vital flowsheet.
* **Allergy Safety Alerts:** Persistent high-visibility clinical alerts for severe allergies (e.g. Penicillin, NSAIDs, Sulfa).
* **Vitals Flowsheet:** Timestamped recording of BP (Systolic/Diastolic), Heart Rate, Respiratory Rate, Temperature, SpO2, and automated real-time **Body Mass Index (BMI)** calculation.

### 2. Clinical Documentation & SOAP Notes
* **Structured SOAP Format:**
  * **S (Subjective):** Patient narrative, History of Present Illness (HPI), symptoms.
  * **O (Objective):** Physical exam findings and observed vitals.
  * **A (Assessment):** Primary and differential diagnoses integrated with **ICD-10** codes (`I10`, `E11.9`, `E78.5`, `I25.10`).
  * **P (Plan):** Therapeutic roadmap, lab orders, counseling, and scheduled follow-ups.
* **Electronic Physician Signature:** Digital locking and certification of clinical notes with audit timestamping.

### 3. Computerized Physician Order Entry (CPOE)
* **Laboratory & Diagnostic Requisitions:** Coded with **LOINC** codes (e.g., `57698-3` Lipid Profile, `58410-2` CBC, `24320-4` BMP, `36554-4` Chest X-Ray).
* **Clinical Priority Triage:** `ROUTINE`, `URGENT`, and `STAT` (Emergency).
* **Diagnostic Reporting:** Technicians and clinicians log results, biological reference ranges, and toggle abnormal diagnostic flags.

### 4. Medication Management & Real-Time Drug Interaction Engine
* **E-Prescribing:** Formularies mapped to generic names, RxNorm codes, dosage, routes (Oral, IV, Sublingual, SC, Topical), and frequencies.
* **Drug-Drug Interaction (DDI) Safety Engine:** Cross-references newly prescribed medications against active patient drugs in real-time. Detects dangerous interactions (e.g., *Warfarin + Aspirin*, *Lisinopril + Spironolactone*, *Metformin + Contrast*) and alerts physicians before order completion.

### 5. Patient Portal (Self-Service Dashboard)
* Patients securely log in to view:
  * Personal medical profile, allergies, and emergency contacts.
  * Historical vital signs and trends.
  * Certified diagnostic lab and radiology reports.
  * Active prescriptions and dosing schedules.
  * Visit summaries and physician care plans.

### 6. HIPAA Audit Trail & Role-Based Access Control (RBAC)
* **Roles:** `ROLE_DOCTOR`, `ROLE_NURSE`, `ROLE_ADMIN`, `ROLE_PATIENT`.
* Stateless **JWT (JSON Web Token)** authentication.
* **HIPAA Audit Log:** Every access to Protected Health Information (PHI) is audited with user ID, role, action, timestamp, and IP address.

---

## 🔑 Pre-Seeded Demo User Accounts

You can log in instantly using the demo credentials below:

| Role | Username / Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| 🩺 **Doctor / Physician** | `doctor@careconnect.com` | `Doctor@123` | Full EHR, SOAP Notes, CPOE Orders, E-Prescribe, DDI Engine |
| 🩺 **Doctor (Cardiology)** | `anurag.dwivedi@careconnect.com` | `Doctor@123` | Attending Cardiologist, Specialized Charting & Signing |
| 💉 **Registered Nurse** | `nurse@careconnect.com` | `Nurse@123` | Vitals Entry, Patient Triage, Order Status Tracking |
| ⚙️ **Hospital Admin** | `admin@careconnect.com` | `Admin@123` | User Management, HIPAA Audit Log Viewer, System Settings |
| 👤 **Patient (Self-Service)**| `patient@careconnect.com` | `Patient@123` | Patient Portal: Records, Vitals, Labs, Prescriptions |

---

## 🚀 Local Development & Execution Guide

### Prerequisites
* **Java:** JDK 21 or higher
* **Node.js:** v18.x or v20.x
* **npm:** v10.x or higher
* **Maven:** Included via Maven Wrapper (`mvnw`)

### 1. Run Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
* Backend API starts at: `http://localhost:8085`
* Swagger / OpenAPI documentation: `http://localhost:8085/swagger-ui/index.html`

### 2. Run Frontend (Angular 17)
```bash
cd frontend
npm install
npm start
```
* Frontend application starts at: `http://localhost:4200`

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Angular 17, TypeScript, SCSS, RxJS, Lucide Icons |
| **Backend** | Java 21, Spring Boot 3.3.x, Spring Security, Spring Data JPA |
| **Security** | JSON Web Tokens (JWT), BCrypt Password Hashing, CORS Configuration |
| **Database** | H2 In-Memory (Dev) / MySQL / PostgreSQL (Production ready) |
| **API Docs** | SpringDoc OpenAPI 3, Swagger UI |
| **CI/CD** | GitHub Actions (`github/workflow/main.yml`) |
| **Cloud Hosting** | Netlify Edge CDN (`care-connect-ehr-hcl.netlify.app`) |

---

## 📜 Compliance & Clinical Standards
* **HIPAA:** 45 CFR § 164.312 Technical Safeguards (Audit Controls, Integrity, Access Control).
* **ICD-10-CM:** International Classification of Diseases, 10th Revision.
* **LOINC:** Logical Observation Identifiers Names and Codes.
* **RxNorm:** Standardized nomenclature for clinical drugs.
