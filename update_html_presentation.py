import os
import base64

base_dir = r"c:\Users\91905\OneDrive\Desktop\HCL Project"
mockup_dir = os.path.join(base_dir, "assets", "mockups")

def get_base64_img(filename):
    path = os.path.join(mockup_dir, filename)
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("utf-8")
    return f"data:image/png;base64,{b64}"

img_dashboard_b64 = get_base64_img("dashboard_mockup.png")
img_portal_b64 = get_base64_img("portal_mockup.png")
img_cpoe_b64 = get_base64_img("cpoe_mockup.png")

with open(os.path.join(base_dir, "assets", "thank_you_bg.jpg"), "rb") as f:
    img_thank_you_b64 = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareConnect EHR - Master Project Presentation</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --navy: #0f172a;
      --navy-light: #1e293b;
      --emerald: #10b981;
      --rose: #e11d48;
      --teal: #0d9488;
      --slate-50: #f8fafc;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-300: #cbd5e1;
      --slate-600: #475569;
      --slate-800: #1e293b;
      --slate-900: #0f172a;
    }}

    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #090d16;
      color: var(--slate-900);
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }}

    /* Top Progress Bar */
    .progress-bar-container {{
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 100;
    }}
    .progress-bar-fill {{
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #0284c7, #10b981);
      transition: width 0.3s ease;
      width: 12.5%;
    }}

    /* Slide Deck Stage */
    .deck-container {{
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }}

    .slide {{
      width: 100%;
      max-width: 1280px;
      height: 720px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
      display: none;
      flex-direction: column;
      padding: 2.25rem 3rem;
      position: relative;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }}

    .slide.active {{
      display: flex;
    }}

    @keyframes fadeIn {{
      from {{ opacity: 0; transform: scale(0.98) translateY(8px); }}
      to {{ opacity: 1; transform: scale(1) translateY(0); }}
    }}

    /* Slide Headers */
    .slide-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--slate-200);
      padding-bottom: 0.85rem;
      margin-bottom: 1.25rem;
    }}
    .slide-cat {{
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.25rem;
    }}
    .slide-title {{
      font-size: 1.65rem;
      font-weight: 800;
      color: var(--navy);
      letter-spacing: -0.02em;
    }}
    .slide-page-badge {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--slate-600);
      background: var(--slate-100);
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      border: 1px solid var(--slate-200);
    }}

    /* Layout Grids */
    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.75rem;
      flex: 1;
      min-height: 0;
    }}
    .grid-3 {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      flex: 1;
      min-height: 0;
    }}
    .grid-4 {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      flex: 1;
      min-height: 0;
    }}

    /* Presentation Cards */
    .card {{
      background: white;
      border: 1.5px solid var(--slate-200);
      border-radius: 14px;
      padding: 1.35rem 1.5rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
      overflow-y: auto;
    }}
    .card-title {{
      font-size: 1.15rem;
      font-weight: 800;
      margin-bottom: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}
    .card-subtitle {{
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-top: -0.65rem;
      margin-bottom: 0.85rem;
    }}
    .list-items {{
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      font-size: 0.9rem;
      line-height: 1.45;
      color: #334155;
    }}
    .list-item {{
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }}
    .list-item strong {{
      color: #0f172a;
    }}

    .mockup-display {{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      min-height: 0;
      gap: 0.75rem;
    }}
    .mockup-display img {{
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 15px 25px rgba(15, 23, 42, 0.2));
      border-radius: 14px;
    }}

    /* Controls Bar */
    .controls-bar {{
      height: 65px;
      background: #0f172a;
      border-top: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      color: white;
    }}
    .nav-btn {{
      background: #1e293b;
      color: white;
      border: 1px solid #334155;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}
    .nav-btn:hover:not(:disabled) {{
      background: var(--primary);
      border-color: var(--primary);
    }}
    .nav-btn:disabled {{
      opacity: 0.3;
      cursor: not-allowed;
    }}

    .dots-container {{
      display: flex;
      gap: 0.5rem;
    }}
    .dot {{
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .dot.active {{
      background: #38bdf8;
      width: 24px;
    }}

    /* Slide 1 Hero Specifics */
    #slide-1 {{
      background: radial-gradient(circle at 85% 30%, #172554 0%, #0b1326 60%, #060913 100%);
      color: white;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 2.5rem 3.5rem;
    }}
  </style>
</head>
<body>

  <div class="progress-bar-container">
    <div class="progress-bar-fill" id="progressFill"></div>
  </div>

  <div class="deck-container">

    <!-- SLIDE 1: COVER SLIDE -->
    <div class="slide active" id="slide-1">
      <div style="display: flex; width: 100%; height: 100%; gap: 2.5rem; align-items: center;">
        
        <!-- Left Column: Branding, Title, Bullets & Presenter Card -->
        <div style="flex: 1.1; display: flex; flex-direction: column; justify-content: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 999px; padding: 0.35rem 0.95rem; width: fit-content; margin-bottom: 1.25rem;">
            <span style="color: #38bdf8; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em;">⚕️ CARECONNECT HEALTHCARE IT • ENTERPRISE CLINICAL PLATFORM</span>
          </div>

          <h1 style="font-size: 3.2rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 0.65rem;">
            CareConnect <span style="color: #38bdf8;">EHR</span>
          </h1>

          <p style="font-size: 1.15rem; font-weight: 600; color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.4;">
            Next-Gen Clinical Healthcare Management & Telemetry System
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.5rem; font-size: 0.92rem; color: #cbd5e1;">
            <div><strong style="color: white;">⚡ Real-Time CPOE Diagnostics:</strong> LOINC-coded lab & imaging requisitions with STAT priority queues.</div>
            <div><strong style="color: white;">🛡️ Drug Safety CDSS Engine:</strong> Automated drug-drug interaction & allergy contraindication safeguards.</div>
            <div><strong style="color: white;">📋 SOAP Clinical Encounters:</strong> Standardized medical history & cryptographically locked physician notes.</div>
            <div><strong style="color: white;">🏥 Patient Access Portal:</strong> Lifetime MRN self-service vitals, medication cards & lab results.</div>
          </div>

          <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 12px; padding: 0.85rem 1.15rem;">
            <small style="color: #38bdf8; font-weight: 800; font-size: 0.72rem; letter-spacing: 0.08em; display: block; margin-bottom: 0.25rem;">PROJECT METADATA & PRESENTATION DETAILS</small>
            <div style="font-size: 0.88rem; color: white; font-weight: 700;">• Lead Presenter: Priyank | Healthcare Informatics Lead</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">• Stack: Spring Boot 3 • Angular 17 • JWT • Relational H2 Persistent Storage</div>
          </div>
        </div>

        <!-- Right Column: Framed Dashboard Mockup -->
        <div style="flex: 1; height: 100%; display: flex; flex-direction: column; gap: 0.65rem; justify-content: center;">
          <img src="{img_dashboard_b64}" alt="CareConnect Clinical Dashboard Mockup" style="max-width: 100%; max-height: 82%; object-fit: contain; border-radius: 14px; box-shadow: 0 20px 45px rgba(0,0,0,0.7);">
          <div style="background: rgba(6, 78, 59, 0.9); border: 1px solid #10b981; border-radius: 8px; padding: 0.45rem 1rem; text-align: center; font-size: 0.75rem; font-weight: 800; color: #6ee7b7; letter-spacing: 0.05em;">
            🟢 LIVE HEALTHCARE TELEMETRY • BED OCCUPANCY: 74% • TAT: 96.8%
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 2: PROBLEM & MISSION -->
    <div class="slide" id="slide-2">
      <div class="slide-header">
        <div>
          <div class="slide-cat">Executive Summary</div>
          <h2 class="slide-title">Clinical Problem Statement & Project Mission</h2>
        </div>
        <div class="slide-page-badge">02 / 08</div>
      </div>

      <div class="grid-2">
        <div class="card" style="border-top: 4px solid var(--rose);">
          <div class="card-title" style="color: var(--rose);">🚨 Traditional Bottlenecks</div>
          <div class="list-items">
            <div class="list-item"><span>•</span><div><strong>Illegible Paper Charts:</strong> Handwriting errors cause life-threatening dosing & allergy mistakes.</div></div>
            <div class="list-item"><span>•</span><div><strong>Dangerous Drug Interactions:</strong> No automated checks when co-prescribing drugs like Warfarin and Aspirin.</div></div>
            <div class="list-item"><span>•</span><div><strong>Delayed Diagnostic Testing:</strong> Paper lab slips cause prolonged turnaround times (TAT) and extended hospital stays.</div></div>
            <div class="list-item"><span>•</span><div><strong>Patient Disconnection:</strong> Zero patient access to personal vitals trends, active medications, or consult summaries.</div></div>
            <div class="list-item"><span>•</span><div><strong>Missing Audit Governance:</strong> Lack of HIPAA audit trails to track who viewed or edited sensitive health records.</div></div>
          </div>
        </div>

        <div class="card" style="border-top: 4px solid var(--primary); background: #f0f9ff;">
          <div class="card-title" style="color: var(--primary);">💡 CareConnect Digital Breakthroughs</div>
          <div class="list-items">
            <div class="list-item"><span>✓</span><div><strong>Paperless CPOE Ordering:</strong> Digital requisitions codifying international LOINC diagnostics with STAT priority routing.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Automated CDSS Guard:</strong> Real-time drug-drug contraindication detection before prescription signature.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Standardized SOAP Encounters:</strong> Structured clinical notes locked with cryptographic provider signatures.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Self-Service Patient Access:</strong> Transparent personal health portal with real-time vitals flowsheets and lab downloads.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Full HIPAA Audit Compliance:</strong> Immutable audit logging capturing every chart view, order creation, and user login.</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 3: ARCHITECTURE -->
    <div class="slide" id="slide-3">
      <div class="slide-header">
        <div>
          <div class="slide-cat">System Architecture</div>
          <h2 class="slide-title">Enterprise 4-Tier Scalable Clinical System</h2>
        </div>
        <div class="slide-page-badge">03 / 08</div>
      </div>

      <div class="grid-4">
        <div class="card" style="border-top: 4px solid #0284c7;">
          <div class="card-title" style="color: #0284c7; font-size: 1.05rem;">🖥️ Frontend</div>
          <div class="card-subtitle">Angular 17 Standalone</div>
          <div class="list-items" style="font-size: 0.85rem;">
            <div>• Component-based reactive state architecture</div>
            <div>• Real-time autocomplete suggestions & filters</div>
            <div>• Custom animated Toast notification service</div>
            <div>• Fully responsive desktop, tablet & mobile layout</div>
          </div>
        </div>

        <div class="card" style="border-top: 4px solid #0d9488;">
          <div class="card-title" style="color: #0d9488; font-size: 1.05rem;">⚙️ Backend</div>
          <div class="card-subtitle">Spring Boot 3 (Java 17)</div>
          <div class="list-items" style="font-size: 0.85rem;">
            <div>• Clean RESTful APIs for clinical modules</div>
            <div>• Spring Data JPA transactional management</div>
            <div>• Pharmacological Rule Evaluation Engine</div>
            <div>• Strict DTO abstraction preventing data leaks</div>
          </div>
        </div>

        <div class="card" style="border-top: 4px solid #e11d48;">
          <div class="card-title" style="color: #e11d48; font-size: 1.05rem;">🔒 Security</div>
          <div class="card-subtitle">Spring Security 6 & JWT</div>
          <div class="list-items" style="font-size: 0.85rem;">
            <div>• HMAC-SHA256 encrypted Bearer token auth</div>
            <div>• 4-Tier RBAC: Doctor, Nurse, Admin, Patient</div>
            <div>• Method-level `@PreAuthorize` guards</div>
            <div>• HIPAA compliance audit logging with remote IP</div>
          </div>
        </div>

        <div class="card" style="border-top: 4px solid #10b981;">
          <div class="card-title" style="color: #10b981; font-size: 1.05rem;">💾 Persistence</div>
          <div class="card-subtitle">File-Backed H2 Database</div>
          <div class="list-items" style="font-size: 0.85rem;">
            <div>• Physical disk storage with zero refresh data loss</div>
            <div>• Pre-seeded patient cohorts & drug safety rules</div>
            <div>• Auto-server concurrency multi-connection lock</div>
            <div>• Seamless production upgrade to Oracle / Postgres</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 4: DASHBOARD -->
    <div class="slide" id="slide-4">
      <div class="slide-header">
        <div>
          <div class="slide-cat">Clinical Operations</div>
          <h2 class="slide-title">Doctor Dashboard & Real-Time Hospital Telemetry</h2>
        </div>
        <div class="slide-page-badge">04 / 08</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="color: #0284c7;">🩺 Real-Time Operational Cockpit</div>
          <div class="list-items">
            <div class="list-item"><span>•</span><div><strong>Live Shift Monitoring:</strong> OPD Block B shift status with animated active telemetry pulse.</div></div>
            <div class="list-item"><span>•</span><div><strong>Ticking Digital Clock:</strong> Real-time second-by-second system clock with ChangeDetectorRef synchronization.</div></div>
            <div class="list-item"><span>•</span><div><strong>Hospital Bed Occupancy (74%):</strong> Inpatient ward capacity telemetry tracked in real time.</div></div>
            <div class="list-item"><span>•</span><div><strong>Lab Turnaround Time (96.8%):</strong> Diagnostic turnaround metric measuring lab responsiveness.</div></div>
            <div class="list-item"><span>•</span><div><strong>Drug Safety Score (100% Guarded):</strong> Active screening score verifying zero unacknowledged contraindications.</div></div>
            <div class="list-item"><span>•</span><div><strong>Accelerated Workflows:</strong> Direct shortcuts for SOAP Notes, Patient Directory, and CPOE Worklist.</div></div>
          </div>
        </div>

        <div class="mockup-display">
          <img src="{img_dashboard_b64}" alt="Clinical Dashboard Mockup" style="max-height: 85%;">
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.45rem 1rem; font-size: 0.78rem; font-weight: 700; color: #334155; width: 100%; text-align: center;">
            🟢 Active Telemetry: Ward beds (74%), Lab TAT (96.8%), and real-time clock sync in Angular 17
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 5: CPOE -->
    <div class="slide" id="slide-5">
      <div class="slide-header">
        <div>
          <div class="slide-cat">Diagnostic Workflows</div>
          <h2 class="slide-title">CPOE: Computerized Order Entry & Result Lifecycle</h2>
        </div>
        <div class="slide-page-badge">05 / 08</div>
      </div>

      <div class="grid-2">
        <div class="mockup-display">
          <img src="{img_cpoe_b64}" alt="CPOE Requisition Mockup" style="max-height: 98%;">
        </div>

        <div class="card">
          <div class="card-title" style="color: #0d9488;">🔬 Paperless Diagnostic Lifecycle</div>
          <div class="list-items">
            <div class="list-item"><span>✓</span><div><strong>LOINC Standard Codification:</strong> Tests mapped to global medical identifiers (e.g. 57698-3 for Lipid Profile, 36554-4 for Chest X-Ray).</div></div>
            <div class="list-item"><span>✓</span><div><strong>Triage Priority Queuing:</strong> Support for ROUTINE, URGENT, and STAT emergency testing queues.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Clinical Indication Mandate:</strong> Doctors specify medical justification (e.g. 'high fever and weakness evaluation').</div></div>
            <div class="list-item"><span>✓</span><div><strong>Result Findings Reporting:</strong> Lab technicians enter quantitative values and biological reference intervals.</div></div>
            <div class="list-item"><span>✓</span><div><strong>⚠️ Red Flag Abnormal Triaging:</strong> Critical abnormal results trigger immediate red highlight flags across physician worklists and dashboards.</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 6: E-PRESCRIBE & CDSS -->
    <div class="slide" id="slide-6">
      <div class="slide-header">
        <div>
          <div class="slide-cat">Patient Safety</div>
          <h2 class="slide-title">E-Prescribing, Drug-Drug Safety & SOAP Notes</h2>
        </div>
        <div class="slide-page-badge">06 / 08</div>
      </div>

      <div class="grid-3">
        <div class="card" style="border-top: 4px solid #0284c7;">
          <div class="card-title" style="color: #0284c7; font-size: 1.05rem;">💊 E-Prescribing</div>
          <div class="list-items" style="font-size: 0.88rem;">
            <div>• Patient search with live autocomplete suggestions</div>
            <div>• Dosage, frequency, administration route & duration</div>
            <div>• Detailed SIG instructions ('Take 1 tablet daily')</div>
            <div>• Refill counters & prescription status tracking</div>
            <div>• Hospital formulary quick-fill chips</div>
          </div>
        </div>

        <div class="card" style="background: #fff1f2; border: 1.5px solid #f43f5e; border-top: 4px solid #e11d48;">
          <div class="card-title" style="color: #e11d48; font-size: 1.05rem;">🛡️ Drug Safety CDSS</div>
          <div class="list-items" style="font-size: 0.88rem;">
            <div>• <strong>Real-Time Background Cross-Check:</strong> Screens concurrent drugs before authorizing</div>
            <div>• <strong>Severity Grading:</strong> HIGH, MODERATE, LOW</div>
            <div>• <strong>Clinical Overrides:</strong> Explicit physician confirmation required for severe bleeding or toxicity risks</div>
            <div>• <strong>Guarded Pairs:</strong> Warfarin + Aspirin, Lisinopril + Spironolactone</div>
          </div>
        </div>

        <div class="card" style="border-top: 4px solid #0d9488;">
          <div class="card-title" style="color: #0d9488; font-size: 1.05rem;">📋 SOAP Documentation</div>
          <div class="list-items" style="font-size: 0.88rem;">
            <div>• <strong>Subjective:</strong> Patient history & symptoms</div>
            <div>• <strong>Objective:</strong> Vitals flowsheet & physical exam</div>
            <div>• <strong>Assessment:</strong> Differential diagnosis & ICD-10</div>
            <div>• <strong>Plan:</strong> Therapy, lab orders & follow-up</div>
            <div>• <strong>Cryptographic Signatures:</strong> Locked audit notes</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 7: PATIENT PORTAL -->
    <div class="slide" id="slide-7">
      <div class="slide-header">
        <div>
          <div class="slide-cat">Patient Empowerment</div>
          <h2 class="slide-title">Self-Service Patient Health Access Portal</h2>
        </div>
        <div class="slide-page-badge">07 / 08</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="color: #0284c7;">🧑 Direct Patient Engagement</div>
          <div class="list-items">
            <div class="list-item"><span>•</span><div><strong>Unique Lifetime MRN:</strong> Instant auto-generated Medical Record Number (e.g. MRN-7061 for Anurag Dwivedi).</div></div>
            <div class="list-item"><span>•</span><div><strong>Personal Vitals Flowsheet:</strong> Patients monitor historical BP, Pulse, SpO2, and WHO BMI spectrums.</div></div>
            <div class="list-item"><span>•</span><div><strong>Diagnostic Lab Access:</strong> Direct online viewing of completed blood panels and radiology impressions.</div></div>
            <div class="list-item"><span>•</span><div><strong>Active Medication Cards:</strong> Transparent instructions and refill counters preventing non-compliance.</div></div>
            <div class="list-item"><span>•</span><div><strong>Doctor Visit Summaries:</strong> Patients can access official attending consult notes anytime, anywhere.</div></div>
            <div class="list-item"><span>•</span><div><strong>Clinician Preview Mode:</strong> Doctors & nurses can preview what any patient sees.</div></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem; height: 100%; min-height: 0;">
          <div style="flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center;">
            <img src="{img_portal_b64}" alt="Patient Portal Mockup" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 14px; filter: drop-shadow(0 15px 25px rgba(15, 23, 42, 0.18));">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
            <div class="card" style="padding: 0.75rem 0.95rem; border-top: 3px solid #0284c7; background: #f0f9ff;">
              <div style="font-weight: 800; font-size: 0.88rem; color: #0284c7; margin-bottom: 0.2rem;">📊 Vitals Telemetry</div>
              <div style="font-size: 0.78rem; color: #475569; line-height: 1.35;">Real-time tracking for Blood Pressure, Heart Rate, SpO2 & BMI recorded during triage.</div>
            </div>
            <div class="card" style="padding: 0.75rem 0.95rem; border-top: 3px solid #10b981; background: #f0fdf4;">
              <div style="font-weight: 800; font-size: 0.88rem; color: #10b981; margin-bottom: 0.2rem;">💊 Active Prescriptions</div>
              <div style="font-size: 0.78rem; color: #475569; line-height: 1.35;">Instant access to verified physician orders, active meds & completed LOINC diagnostic findings.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 8: GOVERNANCE & ROADMAP -->
    <div class="slide" id="slide-8">
      <div class="slide-header">
        <div>
          <div class="slide-cat">Governance & Vision</div>
          <h2 class="slide-title">HIPAA Audit Trail, Regulatory Compliance & Roadmap</h2>
        </div>
        <div class="slide-page-badge">08 / 09</div>
      </div>

      <div class="grid-2">
        <div class="card" style="border-top: 4px solid #0f172a;">
          <div class="card-title" style="color: #0f172a;">🔒 Security & Regulatory Compliance</div>
          <div class="list-items">
            <div class="list-item"><span>✓</span><div><strong>Granular RBAC:</strong> Doctors write orders; Nurses manage triage; Patients access only their own charts.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Immutable Audit Trail:</strong> Every chart view, lab order, and prescription records user, action, timestamp, and IP address.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Data Protection:</strong> Disk-backed relational storage guarantees persistence across system recycles.</div></div>
            <div class="list-item"><span>✓</span><div><strong>Data Minimization:</strong> Structured DTOs strictly prevent unintended disclosure of sensitive health data.</div></div>
          </div>
        </div>

        <div class="card" style="background: #f0fdf4; border: 1.5px solid #10b981; border-top: 4px solid #10b981;">
          <div class="card-title" style="color: #10b981;">🚀 Future Strategic Roadmap</div>
          <div class="list-items">
            <div class="list-item"><span>★</span><div><strong>FHIR / HL7 Interoperability:</strong> RESTful FHIR R4 standard export for cross-hospital data interchange.</div></div>
            <div class="list-item"><span>★</span><div><strong>AI Ambient Clinical Scribe:</strong> Real-time voice-to-text generating draft SOAP notes during consultations.</div></div>
            <div class="list-item"><span>★</span><div><strong>Telehealth WebRTC Video:</strong> Encrypted face-to-face physician video consults in the patient portal.</div></div>
            <div class="list-item"><span>★</span><div><strong>Predictive Sepsis Warning:</strong> Machine learning early warning scores derived from triage vitals trends.</div></div>
            <div class="list-item"><span>★</span><div><strong>BCMA Pharmacy Scanner:</strong> Barcode Medication Administration verification at bedside.</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 9: CINEMATIC AESTHETIC THANK YOU (ZERO EXTRA TEXT) -->
    <div class="slide" id="slide-9" style="background: url('{img_thank_you_b64}') center/cover no-repeat; display: flex; align-items: center; justify-content: center; text-align: center; border: 1px solid rgba(56, 189, 248, 0.4); position: relative; overflow: hidden;">
      <h1 style="font-size: 5.5rem; font-weight: 800; color: white; letter-spacing: -0.02em; line-height: 1; text-shadow: 0 10px 35px rgba(0,0,0,0.9);">
        Thank <span style="color: #38bdf8;">You.</span>
      </h1>
    </div>
  </div>

  <!-- Bottom Navigation Bar -->
  <div class="controls-bar">
    <div style="display: flex; align-items: center; gap: 1rem;">
      <button class="nav-btn" id="prevBtn" onclick="prevSlide()" disabled>← Previous</button>
      <button class="nav-btn" id="nextBtn" onclick="nextSlide()">Next Slide →</button>
      <span style="font-size: 0.85rem; color: #64748b; margin-left: 0.5rem;">Tip: Use Left/Right Arrow Keys</span>
    </div>

    <div class="dots-container" id="dotsContainer"></div>

    <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #94a3b8;">
      <span id="currentSlideNum">1</span> / <span id="totalSlidesNum">9</span>
    </div>
  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = 9;

    const dotsContainer = document.getElementById('dotsContainer');
    for (let i = 1; i <= totalSlides; i++) {{
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 1 ? ' active' : '');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }}

    function updateDeck() {{
      for (let i = 1; i <= totalSlides; i++) {{
        const slide = document.getElementById('slide-' + i);
        if (slide) {{
          slide.classList.toggle('active', i === currentSlide);
        }}
      }}

      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {{
        dot.classList.toggle('active', idx + 1 === currentSlide);
      }});

      document.getElementById('prevBtn').disabled = (currentSlide === 1);
      document.getElementById('nextBtn').disabled = (currentSlide === totalSlides);
      document.getElementById('currentSlideNum').innerText = currentSlide;
      document.getElementById('progressFill').style.width = ((currentSlide / totalSlides) * 100) + '%';
    }}

    function nextSlide() {{
      if (currentSlide < totalSlides) {{
        currentSlide++;
        updateDeck();
      }}
    }}

    function prevSlide() {{
      if (currentSlide > 1) {{
        currentSlide--;
        updateDeck();
      }}
    }}

    function goToSlide(n) {{
      if (n >= 1 && n <= totalSlides) {{
        currentSlide = n;
        updateDeck();
      }}
    }}

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight' || e.key === 'Space') {{
        nextSlide();
      }} else if (e.key === 'ArrowLeft') {{
        prevSlide();
      }}
    }});
  </script>
</body>
</html>
"""

html_path = os.path.join(base_dir, "CareConnect_Presentation.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"SUCCESS: Updated {html_path} with base64 embedded mockups!")
