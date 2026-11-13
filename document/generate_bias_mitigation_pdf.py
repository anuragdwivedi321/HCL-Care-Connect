import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Bias Mitigation and Ethical Framing - Comparison</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&family=Consolas&display=swap');

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

  /* Minimal Header */
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
    background: #8250df;
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

  /* Comparison Area */
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

  /* Minimal Footer */
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
        "title": "Emergency Room (ER) Triage & STAT Prioritization",
        "before": "urgent triage ka algorithm bnao jo insurance aur age dekh kar decide kare ki kis patient ko pehle doctor milega",
        "issue": "Socioeconomic & Demographic Bias: Prioritizing clinical care based on insurance status, ability to pay, or age introduces unethical discrimination and violates emergency care laws (EMTALA).",
        "after": """Design an ethical and unbiased Clinical Priority Triage engine for the Emergency Department:
1. Base triage strictly on objective physiological biometrics (Systolic BP, SpO2, Heart Rate, Glasgow Coma Scale) and verified clinical severity (Emergency Severity Index - ESI levels 1 to 5).
2. Explicitly exclude socioeconomic variables, insurance payer tier, employment status, race, or ethnicity from priority decision trees.
3. Treat all patients requiring STAT emergency intervention equally regardless of coverage, ensuring strict compliance with EMTALA and bioethical justice principles.
4. Log all priority override decisions with physician justification in the tamper-proof audit trail.""",
        "why_better": "Replaces biased socioeconomic sorting with objective clinical biometrics (ESI standards), ensuring equitable emergency care for all patients."
    },
    {
        "num": 2,
        "title": "EHR Clinical Decision Support & Risk Scoring",
        "before": "patient ka chronic disease risk score calculate kro aur unka background ya race dekh ke risk level badha do",
        "issue": "Algorithmic Racial Bias: Using demographic/racial proxies to inflate disease risk perpetuates systemic healthcare disparities instead of relying on clinical biomarkers.",
        "after": """Develop an evidence-based, bias-mitigated Clinical Risk Assessment engine for chronic conditions:
1. Base all cardiovascular, diabetic, and hypertensive risk calculations purely on verified clinical data: lab biomarkers (HbA1c, lipid panel), vitals, family medical history, and documented comorbidities.
2. Avoid demographic or race-based multipliers in diagnostic risk algorithms unless backed by specific, peer-reviewed pharmacogenomic guidelines (e.g. HLA allele testing).
3. Frame AI recommendations as advisory Clinical Decision Support (CDS), always requiring human physician evaluation before clinical orders are finalized.
4. Provide explainability factors showing exactly which clinical biomarkers contributed to the risk score.""",
        "why_better": "Eliminates racial proxies in risk scoring, grounds assessments in objective biomarkers (HbA1c, BP), and maintains physician oversight."
    },
    {
        "num": 3,
        "title": "Clinical Documentation & Neutral Medical Phrasing",
        "before": "patient ke baare me likho ki patient non-compliant h aur doctor ki baat sunne me interest nahi le rha",
        "issue": "Subjective Stigmatizing Language: Subjective labels like 'non-compliant' or 'uncooperative' introduce documentation bias that negatively biases future clinicians.",
        "after": """Build the clinical SOAP note generation and documentation assistant with ethical phrasing guardrails:
1. Enforce neutral, objective, and non-judgmental clinical terminology across all Subjective (S) and Assessment (A) notes.
2. Replace biased phrasing ('non-compliant', 'uncooperative') with factual, contextual observations (e.g. 'Patient reports difficulty taking medication daily due to transportation and cost barriers').
3. Distinguish between patient-reported subjective narrative and physician objective physical findings.
4. Provide clinical decision guidance addressing root-cause social determinants of health (SDOH) to support patient adherence empathetically.""",
        "why_better": "Enforces objective, stigma-free clinical documentation that identifies root causes (cost/access barriers) rather than assigning patient blame."
    },
    {
        "num": 4,
        "title": "Protected Health Information (PHI) & Minimum Necessary Access",
        "before": "hospital ke saare staff ko sabhi patient ke clinical notes aur personal records ka full access de do taaki koi dikkat na ho",
        "issue": "HIPAA Privacy Violation & Trust Breach: Granting universal unrestricted access violates the HIPAA 'Minimum Necessary' standard and exposes sensitive patient data to unauthorized snooping.",
        "after": """Implement ethical, privacy-preserving Role-Based Access Control (RBAC) following HIPAA 'Minimum Necessary' rules:
1. Restrict sensitive PHI access strictly based on clinical necessity: Nurses view assigned ward vitals, Doctors access treated encounters, and Technicians access only order requisitions.
2. Shield high-stigma medical records (e.g., behavioral health, substance abuse history, psychotherapy notes) behind secondary access verification.
3. Automatically record immutable audit logs capturing every record view with user ID, role, timestamp, and IP address.
4. Provide patients with granular consent tracking and transparent visibility into who has accessed their health chart.""",
        "why_better": "Enforces HIPAA 'Minimum Necessary' data partitioning, protects stigmatized health categories, and guarantees transparent auditability."
    },
    {
        "num": 5,
        "title": "Patient Portal Accessibility & Digital Health Equity",
        "before": "patient portal banao english me standard high-speed desktop view ke liye",
        "issue": "Digital Divide & Accessibility Exclusion: Building only for English-fluent, high-speed desktop users excludes low-literacy, elderly, multilingual, and mobile-dependent patients.",
        "after": """Engineer an inclusive, accessible Patient Self-Service Portal designed for health equity:
1. Comply fully with WCAG 2.1 AA accessibility guidelines: high color-contrast ratios, keyboard-only navigation, and screen-reader compatible ARIA semantics.
2. Present diagnostic reports, lab reference ranges, and medication instructions in plain, patient-friendly language (6th-grade reading level) alongside clinical LOINC terms.
3. Ensure full responsive performance on low-bandwidth networks and budget mobile devices.
4. Prepare multi-language localization architecture allowing patients to view medical instructions in their preferred primary language.""",
        "why_better": "Ensures health equity by supporting low-bandwidth mobile devices, screen readers (WCAG AA), and plain-language medical translations."
    },
    {
        "num": 6,
        "title": "AI Drug Interaction Alerts & Physician Autonomy",
        "before": "aisa system bnao jo doctor ko koi medicine prescribe hi na krne de agar system ko lagta h interaction h aur order permanently block kr de",
        "issue": "Paternalistic Automation Bias: Hard-blocking physician clinical orders without override capability strips clinician autonomy and may prevent life-saving emergency therapy.",
        "after": """Architect an ethical Clinical Safety & Drug-Drug Interaction (DDI) alert system that respects clinician autonomy:
1. Flag critical contraindications (e.g. Warfarin + Aspirin) with high-visibility warnings, clear pathophysiological rationales, and suggested safer alternatives.
2. Provide a legally certified, reasoned clinical override mechanism allowing licensed physicians to proceed when therapeutic benefits outweigh risks.
3. Require mandatory clinical justification notes whenever critical safety alerts are overridden, recording them in the HIPAA audit log.
4. Prevent alert fatigue by suppressing low-significance notifications, ensuring physicians remain vigilant for genuine high-risk events.""",
        "why_better": "Balances automated safety guards with physician clinical autonomy, requiring documented justification rather than blind algorithmic lockouts."
    }
]

total = len(items)
for idx, it in enumerate(items):
    html_content += f"""
<div class="page">
  <!-- Minimal Header -->
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">ETHICS #{it["num"]:02d}</span>
      <span class="module-title">{it["title"]}</span>
    </div>
    <div class="page-num">Page {idx + 1} of {total}</div>
  </div>

  <!-- Pure Comparison Area -->
  <div class="comparison-container">
    <!-- BEFORE (UNETHICAL / BIASED) -->
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : BIASED / UNETHICAL PROMPT</span>
      </div>
      <div class="prompt-text-before">"{it["before"]}"</div>
      <div class="critique-box">
        <strong>Ethical / Bias Hazard:</strong> {it["issue"]}
      </div>
    </div>

    <!-- AFTER (BIAS-MITIGATED / ETHICAL) -->
    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : BIAS-MITIGATED &amp; ETHICAL PROMPT</span>
      </div>
      <div class="prompt-text-after">{it["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Ethical Safeguards &amp; Fairness:</strong> {it["why_better"]}
      </div>
    </div>
  </div>

  <!-- Minimal Footer -->
  <div class="footer">
    <div>CareConnect EHR &bull; Bias Mitigation and Ethical Framing</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Bias_Mitigation_Comparison.html"
pdf_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Bias_Mitigation_Comparison.pdf"

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
