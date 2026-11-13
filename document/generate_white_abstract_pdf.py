import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CareConnect EHR - Project Abstract</title>
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
    background-color: #ffffff;
    color: #1e293b;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    page-break-inside: avoid;
    padding: 12mm 15mm 10mm 15mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #ffffff;
    overflow: hidden;
  }

  /* Header Section */
  .header {
    border-bottom: 2px solid #0284c7;
    padding-bottom: 9px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .title-group {
    max-width: 70%;
  }

  .badge-category {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #e0f2fe;
    border: 1px solid #bae6fd;
    color: #0369a1;
    padding: 2.5px 8px;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 4px;
  }

  .project-title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.6px;
    color: #0f172a;
    line-height: 1.15;
  }

  .project-title span {
    color: #0284c7;
  }

  .project-subtitle {
    font-size: 11px;
    color: #475569;
    font-weight: 500;
    margin-top: 2px;
  }

  .header-meta {
    text-align: right;
    font-size: 9.5px;
    color: #64748b;
    line-height: 1.45;
  }

  .header-meta strong {
    color: #0f172a;
  }

  .live-pill {
    display: inline-block;
    background: #dcfce7;
    border: 1px solid #86efac;
    color: #15803d;
    padding: 2px 7px;
    border-radius: 9999px;
    font-size: 9px;
    font-weight: 700;
    margin-bottom: 3px;
  }

  /* Key Metrics Strip */
  .metrics-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }

  .metric-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 8px;
    text-align: center;
    border-top: 3px solid #0284c7;
  }

  .metric-val {
    font-size: 12.5px;
    font-weight: 800;
    color: #0369a1;
    margin-bottom: 1px;
  }

  .metric-label {
    font-size: 8.5px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.4px;
  }

  /* Abstract Content Sections */
  .abstract-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .section-block {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #0284c7;
    border-radius: 5px;
    padding: 7px 11px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .section-block.accent-purple {
    border-left-color: #7c3aed;
  }

  .section-block.accent-green {
    border-left-color: #059669;
  }

  .section-block.accent-amber {
    border-left-color: #d97706;
  }

  .section-heading {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #0f172a;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .section-text {
    font-size: 9.8px;
    line-height: 1.48;
    color: #334155;
    text-align: justify;
  }

  .section-text strong {
    color: #0f172a;
  }

  .feature-bullets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
    margin-top: 3px;
  }

  .feature-item {
    font-size: 9.5px;
    line-height: 1.4;
    color: #334155;
    position: relative;
    padding-left: 11px;
  }

  .feature-item::before {
    content: "■";
    position: absolute;
    left: 0;
    color: #0284c7;
    font-size: 6px;
    top: 3px;
  }

  .feature-item strong {
    color: #0f172a;
  }

  /* Tech Stack Badges */
  .stack-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 3px;
  }

  .stack-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    padding: 1.5px 6px;
    border-radius: 3px;
    font-weight: 600;
  }

  /* Footer */
  .footer {
    border-top: 1.5px solid #e2e8f0;
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9px;
    color: #64748b;
  }

  .footer strong {
    color: #1e293b;
  }
</style>
</head>
<body>

<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="title-group">
      <div class="badge-category">Executive Project Abstract &bull; Healthcare Informatics</div>
      <h1 class="project-title">CareConnect <span>EHR</span></h1>
      <div class="project-subtitle">Enterprise Web-Based Electronic Health Record (EHR) &amp; Computerized Physician Order Entry (CPOE) Platform</div>
    </div>
    <div class="header-meta">
      <div class="live-pill">&#9679; LIVE APPLICATION</div><br>
      <strong>Developer:</strong> Anurag Dwivedi<br>
      <strong>Framework:</strong> Spring Boot 3.3 &bull; Angular 17<br>
      <strong>Live Portal:</strong> care-connect-ehr-hcl.netlify.app
    </div>
  </div>

  <!-- Key Metrics Strip -->
  <div class="metrics-strip">
    <div class="metric-card">
      <div class="metric-val">HL7 &bull; FHIR</div>
      <div class="metric-label">Data Architecture</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">ICD-10 &bull; LOINC</div>
      <div class="metric-label">Clinical Dictionary</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">HIPAA Title II</div>
      <div class="metric-label">Security &amp; Audit Trail</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">Spring 3.3 + Ng 17</div>
      <div class="metric-label">Full-Stack Tech</div>
    </div>
  </div>

  <!-- Main Abstract Content -->
  <div class="abstract-body">
    <!-- 1. Executive Summary & Problem Statement -->
    <div class="section-block">
      <div class="section-heading">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        1. Executive Summary &amp; Problem Statement
      </div>
      <p class="section-text">
        Modern healthcare ecosystems face significant operational challenges including fragmented patient health records, high incidences of preventable Adverse Drug Events (ADEs), manual order routing delays, and stringent HIPAA data security mandates. <strong>CareConnect EHR</strong> is engineered as an enterprise-grade, web-based Electronic Health Record (EHR) and Computerized Physician Order Entry (CPOE) platform. It establishes seamless, reliable communication across multidisciplinary clinical teams (physicians, triage nurses, diagnostic technicians, and hospital administrators) while guaranteeing strict patient privacy, data integrity, and sub-second clinical responsiveness.
      </p>
    </div>

    <!-- 2. System Architecture & Standards -->
    <div class="section-block accent-purple">
      <div class="section-heading">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>
        2. Healthcare Standards &amp; Architectural Alignment
      </div>
      <p class="section-text">
        The platform enforces strict adherence to international biomedical informatics and regulatory frameworks:
      </p>
      <div class="feature-bullets">
        <div class="feature-item"><strong>HL7 / FHIR Standards:</strong> Standardized data schemas for patients, clinical encounters, and diagnostic orders.</div>
        <div class="feature-item"><strong>ICD-10-CM Coding:</strong> International diagnostic terminology for comprehensive physician assessment documentation.</div>
        <div class="feature-item"><strong>LOINC Test Nomenclature:</strong> Standardized coding for diagnostic laboratory requisitions and radiology procedures.</div>
        <div class="feature-item"><strong>RxNorm Catalogs:</strong> Pharmaceutical formulary mapping with explicit dosage forms, units, and delivery routes.</div>
      </div>
    </div>

    <!-- 3. Core Functional Capabilities -->
    <div class="section-block accent-green">
      <div class="section-heading">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        3. Core Functional Modules &amp; Clinical Safety
      </div>
      <div class="feature-bullets">
        <div class="feature-item"><strong>Enterprise Master Patient Index (EMPI):</strong> Automated collision-proof allocation of unique Medical Record Numbers (<code>MRN-YYYY-XXXX</code>) and multi-field debounced directory search.</div>
        <div class="feature-item"><strong>360° Medical Chart:</strong> Longitudinal vital sign flowsheets with real-time Body Mass Index (BMI) computation, high-risk triage alerts, and persistent allergy safety banners.</div>
        <div class="feature-item"><strong>Clinical Documentation &amp; SOAP Notes:</strong> Structured Subjective, Objective, Assessment, and Plan notes secured with timestamped digital physician signature locks.</div>
        <div class="feature-item"><strong>CPOE Diagnostic Requisitions:</strong> Computerized ordering for laboratory tests and radiology with clinical priority queues (ROUTINE, URGENT, STAT) and tech reporting.</div>
        <div class="feature-item"><strong>Real-Time Drug-Drug Interaction (DDI):</strong> Rule-based contraindication evaluator cross-referencing prescriptions against active patient drugs (e.g. Warfarin + Aspirin alert).</div>
        <div class="feature-item"><strong>HIPAA Security &amp; Audit Trail:</strong> Role-Based Access Control (4 roles) and immutable asynchronous logging of all Protected Health Information (PHI) views.</div>
      </div>
    </div>

    <!-- 4. Technology Stack & Deployment -->
    <div class="section-block accent-amber">
      <div class="section-heading">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        4. Technical Architecture &amp; Production Deployment
      </div>
      <p class="section-text" style="margin-bottom: 4px;">
        Engineered with a high-performance decoupled full-stack architecture ensuring zero downtime and continuous delivery:
      </p>
      <div class="stack-container">
        <span class="stack-tag">Java 21</span>
        <span class="stack-tag">Spring Boot 3.3.x</span>
        <span class="stack-tag">Spring Security 6 (Stateless JWT)</span>
        <span class="stack-tag">Spring Data JPA / Hibernate</span>
        <span class="stack-tag">Oracle XE / H2 Database</span>
        <span class="stack-tag">Angular 17 Standalone</span>
        <span class="stack-tag">TypeScript / SCSS</span>
        <span class="stack-tag">Docker Multi-Stage</span>
        <span class="stack-tag">GitHub Actions CI/CD</span>
        <span class="stack-tag">Netlify Cloud Hosting</span>
      </div>
    </div>

    <!-- 5. Conclusion & Healthcare Impact -->
    <div class="section-block">
      <div class="section-heading">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        5. Conclusion &amp; Healthcare Impact
      </div>
      <p class="section-text">
        <strong>CareConnect EHR</strong> provides a scalable, clinical-grade solution that eliminates communication latency between inpatient wards, diagnostic laboratories, and pharmacies. By enforcing automated safety alerts, digital physician accountability, and seamless patient access, the platform reduces clinical errors, accelerates treatment turnaround, and sets a benchmark for modern, interoperable healthcare informatics.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div><strong>Project:</strong> CareConnect EHR &bull; <strong>GitHub:</strong> anuragdwivedi321/HCL-Care-Connect</div>
    <div><strong>Live URL:</strong> care-connect-ehr-hcl.netlify.app &bull; Single-Page Executive Abstract</div>
  </div>
</div>

</body>
</html>
"""

html_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Project_Abstract_White.html"
pdf_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Project_Abstract_White.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("White Abstract PDF Return code:", res.returncode)
print("White Abstract PDF Size:", os.path.getsize(pdf_path) / 1024 if os.path.exists(pdf_path) else "Failed")
