import os
import subprocess

template_html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{doc_title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&family=Consolas&display=swap');

  @page {{
    size: A4 portrait;
    margin: 0;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    background-color: #0b0f14;
    color: #e6edf3;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  .page {{
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
  }}

  .header-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #21262d;
    padding-bottom: 10px;
  }}

  .header-left {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}

  .case-tag {{
    background: #1f6feb;
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }}

  .module-title {{
    font-size: 14px;
    font-weight: 700;
    color: #f0f6fc;
  }}

  .page-num {{
    font-size: 11px;
    color: #8b949e;
    font-weight: 500;
  }}

  .comparison-container {{
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex-grow: 1;
  }}

  /* BEFORE CARD */
  .card-before {{
    background: #12171f;
    border: 1.5px solid #da3633;
    border-left: 5px solid #f85149;
    border-radius: 8px;
    padding: 16px 18px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }}

  .card-header-before {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }}

  .badge-before {{
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
  }}

  .prompt-text-before {{
    font-family: 'Consolas', monospace;
    font-size: 13.5px;
    line-height: 1.5;
    color: #ffa198;
    background: #0d1117;
    padding: 12px 14px;
    border-radius: 6px;
    border: 1px solid #30363d;
    margin-bottom: 10px;
  }}

  .critique-box {{
    font-size: 11.5px;
    color: #c9d1d9;
    line-height: 1.5;
  }}

  .critique-box strong {{
    color: #ff7b72;
  }}

  /* AFTER CARD */
  .card-after {{
    background: #12171f;
    border: 1.5px solid #238636;
    border-left: 5px solid #3fb950;
    border-radius: 8px;
    padding: 16px 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }}

  .card-header-after {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }}

  .badge-after {{
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
  }}

  .prompt-text-after {{
    font-family: 'Segoe UI', -apple-system, sans-serif;
    font-size: 11.8px;
    line-height: 1.58;
    color: #f0f6fc;
    background: #0d1117;
    padding: 14px 16px;
    border-radius: 6px;
    border: 1px solid #30363d;
    white-space: pre-wrap;
    word-break: break-word;
    flex-grow: 1;
  }}

  .improvements-bar {{
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #21262d;
    font-size: 11.5px;
    color: #7ee787;
    line-height: 1.45;
  }}

  .improvements-bar strong {{
    color: #56d364;
  }}

  .footer {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #21262d;
    padding-top: 8px;
    font-size: 10px;
    color: #6e7681;
  }}
</style>
</head>
<body>
{body_content}
</body>
</html>
"""

spring_questions = [
    {
        "id": "Spring_Basics_Discounts",
        "doc_title": "Spring Basics Discounts - Comparison",
        "tag": "SPRING-01",
        "title": "Spring Basics Discounts (Hospital Outpatient Copay & Pharmacy Tier Subsidies)",
        "before": "spring me discount bean banao aur dependency injection se calculate kro",
        "issue": "Basic Generic DI: Lacks clinical context, uses obsolete XML wiring, ignores BigDecimal precision, and lacks insurance copay rules.",
        "after": """Implement a Pharmacy Copay & Subsidy Calculation Service using modern Spring IoC in CareConnect EHR:
1. Clinical Context:
   - Calculate patient out-of-pocket prescription expenses based on insurance policy tiers (Tier 1 Generic = 80% subsidy, Tier 2 Preferred = 50%, Tier 3 Non-Preferred = 20%).
2. Spring IoC Architecture:
   - Configure a '@Service' component 'PharmacyCopayCalculator' utilizing constructor-based dependency injection with Java configuration.
   - Inject an 'InsuranceTierResolver' component to query active policy co-insurance parameters.
3. Financial Precision:
   - Perform all currency and discount calculations using 'BigDecimal' with RoundingMode.HALF_UP.
4. Unit Testing:
   - Write Spring Boot test using '@SpringBootTest' and mock dependency injection to verify copay subsidy outputs across insurance tiers.""",
        "why_better": "Transforms a basic IoC demo into a production Spring Boot service calculating clinical copay subsidies with constructor DI and BigDecimal."
    },
    {
        "id": "Spring_Basics_Event_Generation_and_Display",
        "doc_title": "Spring Basics Event Generation and Display - Comparison",
        "tag": "SPRING-02",
        "title": "Spring Basics Event Generation (STAT Emergency Triage & Vitals Anomaly Event)",
        "before": "spring event publisher aur listener ka code bnao event publish krne ke liye",
        "issue": "Toy Publisher Script: Lacks asynchronous handling (@Async), clinical urgency triage payloads, and audit trail integration.",
        "after": """Architect an Asynchronous Clinical Alert & Triage Event subsystem using Spring ApplicationEvent in CareConnect EHR:
1. Clinical Context:
   - When a nurse records critical vital signs (e.g. Systolic BP > 180 mmHg or SpO2 < 90%), trigger an immediate hospital emergency alert.
2. Spring Event Architecture:
   - Create custom domain event 'VitalSignAlertEvent' extending ApplicationEvent with payload: patientMrn, vitalType, measuredValue, threshold, and timestamp.
   - Inject 'ApplicationEventPublisher' in PatientService to publish events non-blockingly upon triage save.
3. Event Listener:
   - Implement '@Async' event listener 'ClinicalNotificationListener' annotated with '@EventListener'.
   - Record the critical anomaly into the HIPAA AuditLog repository and simulate real-time WebSocket alert dispatch to the attending physician.
4. Thread Configuration:
   - Configure ThreadPoolTaskExecutor to ensure event delivery does not increase HTTP REST request latency.""",
        "why_better": "Replaces generic string events with asynchronous (@Async) clinical triage alerts, audit recording, and dedicated thread pools."
    },
    {
        "id": "Spring_Bean_Factory_Adding_Some_Constraints",
        "doc_title": "Spring Bean Factory Adding Some Constraints - Comparison",
        "tag": "SPRING-03",
        "title": "Spring Bean Factory Constraints (Medical Device Driver Factory & HIPAA Enclave)",
        "before": "bean factory bnao constraints aur validation ke sath spring me",
        "issue": "Abstract Factory Snippet: Lacks BeanPostProcessor validation, medical device integration, and hardware security enclave checks.",
        "after": """Develop a Constrained Clinical Hardware Device Integration Factory using Spring BeanFactory & BeanPostProcessor:
1. Clinical Context:
   - Instantiate and validate medical IoT driver beans (e.g. Philips Vital Sign Monitor, GE Healthcare ECG Telemetry, Roche Blood Gas Analyzer).
2. Factory Constraints & Lifecycle Validation:
   - Implement custom 'BeanFactoryPostProcessor' and 'BeanPostProcessor' verifying that all registered 'MedicalDeviceDriver' beans meet strict constraints:
     - Driver must specify non-empty hospital device serial number and FDA compliance certificate ID.
     - Enforce singleton scope to prevent duplicate network socket bindings to intensive care hardware.
     - Check network encryption capability (TLS 1.3 enforced) before bean initialization finishes.
3. Custom Exception:
   - Throw 'InvalidDeviceConfigurationException' if a device driver bean fails compliance validation during application context startup.""",
        "why_better": "Applies Spring BeanFactory lifecycle constraints to FDA-compliant medical device drivers with encryption checks and singleton enforcement."
    },
    {
        "id": "Spring_JDBC_Searching_User",
        "doc_title": "Spring JDBC Searching User - Comparison",
        "tag": "SPRING-04",
        "title": "Spring JDBC Searching User (High-Throughput EMPI Patient Lookup & SQL Injection Guard)",
        "before": "spring jdbc use karke user search krne ka code likho select query se",
        "issue": "Raw SQL Vulnerability: Concatenating SQL strings introduces SQL injection risks, lacks parameterized row mappers, and ignores PHI indexing.",
        "after": """Implement a high-throughput, SQL-injection safe Patient Search Repository using Spring NamedParameterJdbcTemplate:
1. Clinical Context:
   - Enterprise Master Patient Index (EMPI) search requiring sub-millisecond query performance across 500,000+ patient records for emergency department lookups.
2. Secure Spring JDBC Implementation:
   - Use 'NamedParameterJdbcTemplate' with parameterized SQL to strictly eliminate SQL injection vulnerabilities.
   - Query: 'SELECT id, mrn, first_name, last_name, dob, gender, contact_number, allergies FROM patients WHERE mrn = :mrn OR LOWER(last_name) = LOWER(:lastName)'
3. Custom RowMapper:
   - Create a dedicated 'PatientRowMapper' implementing RowMapper<PatientDto> for clean, type-safe entity mapping.
4. Performance & Audit:
   - Leverage database index on 'mrn' column; log the search action in the HIPAA audit trail with query execution latency metrics.""",
        "why_better": "Replaces raw JDBC queries with secure NamedParameterJdbcTemplate, dedicated PatientRowMapper, and indexing for sub-millisecond lookups."
    },
    {
        "id": "Springboot_CRUD_REST_API",
        "doc_title": "Springboot CRUD REST API - Comparison",
        "tag": "SPRING-05",
        "title": "Spring Boot CRUD REST API (Clinical Encounters & SOAP Physician Notes API)",
        "before": "spring boot me get post put delete ka crud api bnao",
        "issue": "Generic Student Tutorial: Missing DTO validation (@Valid), HTTP response status standards (201/204), and electronic signature locking.",
        "after": """Architect a production-grade Spring Boot 3.3 REST API for Clinical Encounters & SOAP Notes in CareConnect EHR:
1. Clinical Resource:
   - Manage physician SOAP notes (/api/encounters): Subjective, Objective, Assessment (ICD-10), and Plan.
2. RESTful Controller Architecture (@RestController):
   - POST /api/encounters: Create new clinical draft note. Returns HTTP 201 Created with Location header.
   - GET /api/encounters/{id}: Fetch encounter details with patient summary. Returns HTTP 200 OK.
   - PUT /api/encounters/{id}: Update clinical draft. Enforces that signed/finalized notes reject edits with HTTP 403 Forbidden.
   - DELETE /api/encounters/{id}: Soft-delete encounter draft (HTTP 204 No Content).
3. Bean Validation (@Valid):
   - Enforce non-empty chief complaint, valid patientId, and recognized ICD-10 diagnostic code format using Jakarta validation.
4. Error Handling:
   - Return RFC 7807 ProblemDetail JSON for invalid payload or missing resource.""",
        "why_better": "Transforms a basic CRUD tutorial into an authentic clinical SOAP note REST API with validation, proper HTTP statuses, and signature locking."
    },
    {
        "id": "Spring_Boot_Team_and_Player_JPA_Relationships(One-Many)",
        "doc_title": "Spring Boot JPA One-to-Many - Comparison",
        "tag": "SPRING-06",
        "title": "Spring Boot JPA One-to-Many (Hospital Ward to Inpatient Bed Assignment Hierarchy)",
        "before": "jpa me one to many relationship bnao team aur player ka code likho",
        "issue": "Irrelevant Sports Domain: Team/Player fails to reflect healthcare domain models, bidirectional sync issues, and N+1 query traps.",
        "after": """Model a robust JPA One-to-Many Clinical Domain Hierarchy in Spring Data JPA for CareConnect EHR:
1. Healthcare Domain Alignment:
   - Replace sports Team/Player with 'HospitalWard' (One) and 'InpatientBed' (Many).
2. Entity Architecture:
   - '@OneToMany(mappedBy = \"ward\", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)' on HospitalWard.
   - '@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = \"ward_id\")' on InpatientBed.
3. Bidirectional Synchronization Helper Methods:
   - Implement addBed(InpatientBed bed) and removeBed(InpatientBed bed) to maintain object consistency in memory.
4. Performance & Query Optimization:
   - Prevent N+1 query problems by using '@EntityGraph(attributePaths = {\"beds\"})' or 'JOIN FETCH' in the repository.
   - Avoid infinite JSON recursion during REST serialization using '@JsonManagedReference' / '@JsonBackReference' or clean DTO projections.""",
        "why_better": "Replaces generic sports classes with HospitalWard ➔ InpatientBed hierarchy, fixing N+1 queries, lazy loading, and bidirectional sync."
    },
    {
        "id": "Sping_Boot_Microservices",
        "doc_title": "Spring Boot Microservices - Comparison",
        "tag": "SPRING-07",
        "title": "Spring Boot Microservices (Decoupled EHR Architecture: Auth, Patient & Pharmacy Services)",
        "before": "spring boot microservices bnao eureka aur api gateway ke sath",
        "issue": "Vague Architecture: Lacks service boundary definitions, inter-service JWT propagation, and healthcare fault-tolerance patterns.",
        "after": """Architect an enterprise Healthcare Microservices Architecture for CareConnect EHR:
1. Service Domain Decomposition:
   - 'Auth-Service': Stateless JWT issuance, role management, and Spring Security.
   - 'Patient-Service': Enterprise Master Patient Index (EMPI) and demographics.
   - 'Pharmacy-Service': Prescription management and real-time Drug-Drug Interaction (DDI) engine.
2. Service Registry & API Gateway:
   - Spring Cloud Gateway: Central routing hub terminating TLS, authenticating JWT tokens, and propagating verified 'X-User-Role' headers downstream.
   - Eureka Discovery Server: Dynamic service registration and client-side load balancing.
3. Inter-Service Communication & Resilience:
   - OpenFeign client with Resilience4j Circuit Breaker: When Pharmacy-Service is unreachable, gracefully fall back to cached interaction safety rules.
4. Distributed Tracing:
   - Micrometer Tracing with Zipkin for end-to-end request latency observability across clinical microservices.""",
        "why_better": "Decomposes monolithic EHR into bounded healthcare microservices (Auth, Patient, Pharmacy) with Spring Cloud Gateway and Resilience4j."
    },
    {
        "id": "RESTful_WebServices",
        "doc_title": "RESTful WebServices - Comparison",
        "tag": "SPRING-08",
        "title": "RESTful Web Services (FHIR-Compliant Diagnostic Lab Orders & CPOE Requisition API)",
        "before": "restful web services ka example do rest controller kaise banate h",
        "issue": "Generic Hello World: Misses healthcare standards (HL7/FHIR), LOINC diagnostic coding, URI maturity models, and idempotent verbs.",
        "after": """Design a Richardson Maturity Model Level 3, FHIR-aligned RESTful Web Service for Diagnostic Orders in CareConnect EHR:
1. Clinical Context:
   - Manage Computerized Physician Order Entry (CPOE) lab and radiology diagnostic requests (/api/v1/diagnostic-orders) adhering to HL7 FHIR DiagnosticReport standards.
2. REST Architectural Standards:
   - Plural noun URIs, standard HTTP verb idempotency (PUT vs PATCH for result updates).
   - Content Negotiation: Support 'application/json' and 'application/fhir+json'.
3. HATEOAS & Hypermedia Links:
   - Attach hypermedia navigation links to responses:
     - self: Link to order details.
     - patient: Link to patient 360° chart (/api/patients/{mrn}).
     - results: Link to laboratory fulfillment results.
4. Richardson Level 3 Implementation:
   - Expose endpoints in OrderController returning EntityModel<OrderDto> using Spring HATEOAS.""",
        "why_better": "Elevates basic REST controllers into Richardson Level 3, FHIR-aligned diagnostic order APIs with HATEOAS hypermedia links."
    }
]

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
doc_dir = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\Spring_Assessments"

for q in spring_questions:
    page_html = f"""
<div class="page">
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">{q["tag"]}</span>
      <span class="module-title">{q["title"]}</span>
    </div>
    <div class="page-num">CareConnect EHR Spring Assessment</div>
  </div>

  <div class="comparison-container">
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : BASIC / UNCONTEXTUALIZED PROMPT</span>
      </div>
      <div class="prompt-text-before">"{q["before"]}"</div>
      <div class="critique-box">
        <strong>Problem &amp; Limitations:</strong> {q["issue"]}
      </div>
    </div>

    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : CARECONNECT EHR HEALTHCARE CONTEXT PROMPT</span>
      </div>
      <div class="prompt-text-after">{q["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Enterprise Engineering &amp; Project Alignment:</strong> {q["why_better"]}
      </div>
    </div>
  </div>

  <div class="footer">
    <div>CareConnect EHR &bull; {q["id"]}</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""
    full_html = template_html.format(doc_title=q["doc_title"], body_content=page_html)
    html_file = os.path.join(doc_dir, f"{q['id']}.html")
    pdf_file = os.path.join(doc_dir, f"{q['id']}.pdf")
    
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(full_html)
        
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        f"file:///{html_file.replace(os.sep, '/')}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Generated {q['id']}.pdf | Status: {res.returncode}")
