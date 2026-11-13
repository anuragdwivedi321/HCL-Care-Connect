import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Chatbot Dialogue Design - Comparison</title>
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
    background: #0284c7;
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
        "title": "Clinical Chatbot System Persona & Safety Boundaries",
        "before": "ek healthcare chatbot bna do jo user ke saare sawalo ke medical jawab de de",
        "issue": "Dangerous Unbounded Persona: Allows the chatbot to hallucinate definitive medical diagnoses or prescribe medications, risking patient safety and medical malpractice liability.",
        "after": """Design the System Persona and Safety Guardrails for 'CareConnect Clinical Assistant':
1. Persona: Professional, empathetic healthcare triage navigator. Explicitly state: 'I am an AI assistant, not a licensed medical practitioner.'
2. Core Boundaries: Never make definitive diagnoses, prescribe medications, or advise discontinuing prescribed therapies.
3. Conversational Tone: Objective, reassuring, clear (6th-to-8th grade reading level), avoiding clinical jargon unless explained.
4. Mandatory Clinical Disclaimers: Append standardized medical advisory: 'This information is for educational and navigation purposes. Please consult your physician for definitive diagnosis.'""",
        "why_better": "Establishes strict medical safety boundaries, transparent AI identity disclosure, and protects patients from dangerous automated medical advice."
    },
    {
        "num": 2,
        "title": "Emergency Escalation & Red Flag Protocol",
        "before": "agar patient bole tabiyat kharab h to use dawai batao ya relax karne ko bolo",
        "issue": "Life-Threatening Emergency Neglect: Failing to recognize high-risk acute symptoms (chest pain, stroke, anaphylaxis) can result in fatal delays in emergency care.",
        "after": """Implement the Emergency Escalation and Red-Flag Protocol for the clinical chatbot:
1. Keyword Trigger Detection: Continuously monitor for acute emergency symptoms (chest pain, shortness of breath, sudden numbness, severe allergic reaction, suicidal ideation).
2. Immediate Conversational Halt: Instantly suspend routine dialogue; do not ask non-critical follow-up questions.
3. High-Priority Emergency Directives: Display prominent STAT Emergency Card: 'Call 911 (or local emergency) immediately or visit the nearest Emergency Room.'
4. Geolocation & Emergency Contacts: Offer one-tap emergency call link and quick navigation to the nearest hospital facility.""",
        "why_better": "Halts casual chat upon detecting life-threatening red flags, immediately providing urgent 911/ER escalation directives."
    },
    {
        "num": 3,
        "title": "Patient Symptom Triage & Guided Clarification",
        "before": "patient symptoms likhe to internet se search krke bimari bata do",
        "issue": "Unvalidated Diagnosis & Cognitive Overload: Web scraping raw search results creates anxiety (cyberchondria) and presents unvetted diagnostic guesses.",
        "after": """Construct a Structured Symptom Assessment conversational tree:
1. Clarification Dialogue: When a symptom is mentioned (e.g., headache), ask structured clarifying questions:
   - Onset & Duration: 'When did it begin?'
   - Severity Scale: 'Rate your discomfort from 1 to 10.'
   - Associated Symptoms: 'Are you experiencing fever, nausea, or visual changes?'
2. Structured Response Layout: Provide possible clinical categories to discuss with a doctor, organized into 'Common Scenarios' and 'When to Seek Immediate Care'.
3. Actionable Next Step: Offer one-click action: 'Schedule an Appointment with Dr. Smith' or 'Message Clinical Care Team.'""",
        "why_better": "Replaces speculative diagnoses with clinical clarification dialogue (onset, severity, red flags) and direct appointment scheduling."
    },
    {
        "num": 4,
        "title": "Medication Guidance & Explanatory Dialogue",
        "before": "patient ko uski dawaiyo ke baare me batao agar wo puche",
        "issue": "Missing Clinical Context & Verification: Giving generic drug info without cross-checking the patient's verified EHR chart leads to inaccurate dosage advice.",
        "after": """Develop the Patient Medication Inquiry dialogue module integrated with CareConnect EHR:
1. Authenticated Chart Verification: Retrieve the patient's actual active prescriptions from the EHR database rather than relying on unverified user input.
2. Clear Explanatory Breakdown:
   - Purpose: Why the medication was prescribed (in plain language).
   - Dosing Schedule: 'Take 1 tablet (10mg) by mouth daily with morning meal.'
   - Common Non-Critical Side Effects vs Warning Signs requiring doctor contact.
3. Adherence Counseling: If patient mentions missing a dose, provide protocol-based guidance: 'Take as soon as remembered unless close to next scheduled dose; never take double doses.'""",
        "why_better": "Grounds medication advice in verified EHR records, explaining purpose, dosing schedules, and safe missed-dose protocols in plain language."
    },
    {
        "num": 5,
        "title": "Lab Results Interpretation in Plain Language",
        "before": "lab report aane par test values patient ko send kr do",
        "issue": "Incomprehensible Data Dumps: Sending raw numeric lab values without interpretation causes unnecessary panic over harmless borderline fluctuations.",
        "after": """Design the Diagnostic Lab Results explanatory dialogue:
1. Patient-Friendly Translation: When patient asks about recent lab results (e.g. Lipid Panel, HbA1c), translate clinical LOINC terminology into accessible summaries:
   - Metric Name: 'Total Cholesterol' (instead of code 57698-3).
   - Status Indicator: 'Within Normal Range' or 'Slightly Above Target Range'.
2. Contextual Reassurance: Explain that single lab numbers are part of an overall health picture and cannot be interpreted in isolation without physician review.
3. Conversational Follow-up: Provide pre-filled conversation prompts: 'Would you like to leave a question for your physician regarding these results?'""",
        "why_better": "Transforms confusing numerical lab codes into reassuring, plain-language summaries with direct doctor messaging integration."
    },
    {
        "num": 6,
        "title": "Chatbot Fallback, Ambiguity & Human Handoff",
        "before": "agar chatbot ko kuch samajh na aaye to bol do 'I don't know' ya chup ho jao",
        "issue": "Dead-End Conversation: Leaving patients stranded with generic errors erodes trust and abandons patients seeking medical support.",
        "after": """Implement a Multi-Tier Fallback and Human-in-the-Loop Clinical Handoff workflow:
1. Ambiguity Detection: If confidence score < 0.70 or input is contradictory/unclear, acknowledge gracefully: 'I want to make sure I give you accurate information, but I need a bit more detail.'
2. Multi-Choice Quick Replies: Present guided category buttons: 'Billing & Insurance', 'Appointment Scheduling', 'Refill Request', 'Speak to Nurse'.
3. Seamless Human Handoff: After 2 consecutive failed intents, trigger automated routing: 'Let me connect you directly with a CareConnect triage nurse or your physician's clinic.'
4. Session Context Transfer: Package conversation transcript and verified patient MRN into the nurse triage dashboard to avoid repetitive questioning.""",
        "why_better": "Eliminates conversational dead-ends by offering guided quick-replies and seamlessly escalating with full context to human clinic nurses."
    }
]

total = len(items)
for idx, it in enumerate(items):
    html_content += f"""
<div class="page">
  <!-- Minimal Header -->
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">DIALOGUE #{it["num"]:02d}</span>
      <span class="module-title">{it["title"]}</span>
    </div>
    <div class="page-num">Page {idx + 1} of {total}</div>
  </div>

  <!-- Pure Comparison Area -->
  <div class="comparison-container">
    <!-- BEFORE (POOR / HAZARDOUS DIALOGUE) -->
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : NAIVE / UNSAFE DIALOGUE DESIGN</span>
      </div>
      <div class="prompt-text-before">"{it["before"]}"</div>
      <div class="critique-box">
        <strong>Dialogue &amp; Clinical Hazard:</strong> {it["issue"]}
      </div>
    </div>

    <!-- AFTER (OPTIMIZED / SAFE DIALOGUE) -->
    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : HIGH-CLARITY &amp; SAFE DIALOGUE DESIGN</span>
      </div>
      <div class="prompt-text-after">{it["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Dialogue Improvements &amp; Safety:</strong> {it["why_better"]}
      </div>
    </div>
  </div>

  <!-- Minimal Footer -->
  <div class="footer">
    <div>CareConnect EHR &bull; Chatbot Dialogue Design</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Chatbot_Dialogue_Design_Comparison.html"
pdf_path = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\CareConnect_Chatbot_Dialogue_Design_Comparison.pdf"

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
