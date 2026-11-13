import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SDLC Model and Agile Sprint Planning - Comparison</title>
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
    background: #1a7f37;
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
    font-size: 13px;
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
    font-size: 12px;
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

items_sdlc = [
    {
        "num": 1,
        "title": "SDLC Paradigm Selection (Agile Scrum vs Waterfall)",
        "before": "project ko develop krna start kro, waterfall se kare ya agile se kuch plan bna do",
        "issue": "Undefined Lifecycle Model: Without defining an exact SDLC model, requirements drift, healthcare regulatory milestones are missed, and release cadences become unpredictable.",
        "after": """Establish the SDLC framework for the CareConnect EHR engineering initiative:
1. Methodology: Adopt Agile Scrum with 2-week sprint cycles combined with Stage-Gate healthcare compliance checkpoints.
2. Sprint Cadence:
   - Sprint Planning: Bi-weekly backlog prioritization and story point sizing.
   - Daily Standup: 15-minute sync addressing blockers and daily commitments.
   - Sprint Review & Demo: Working software demonstration on staging to clinical stakeholders.
   - Retrospective: Continuous improvement on velocity and deployment automation.
3. Rationale: Agile allows iterative development of complex clinical workflows (SOAP, CPOE) while maintaining adaptability to user feedback.""",
        "why_better": "Formalizes 2-week Agile Scrum sprints with structured ceremonies, ensuring iterative progress while maintaining healthcare compliance gates."
    },
    {
        "num": 2,
        "title": "User Story Mapping & INVEST Criteria",
        "before": "doctor ke liye features likho jo unhe chahiye",
        "issue": "Unstructured Scope: Vague feature requests lack user roles, acceptance criteria, testability, and cannot be estimated or tracked in sprints.",
        "after": """Author production-grade User Stories adhering to the INVEST standard (Independent, Negotiable, Valuable, Estimable, Small, Testable):
1. User Story Format: 'As a <Role>, I want <Goal> so that <Benefit>'
   - Example: 'As a Physician, I want the system to warn me if I prescribe Aspirin to a patient taking Warfarin, so that fatal bleeding complications are prevented.'
2. Acceptance Criteria (Gherkin Given-When-Then syntax):
   - Given a patient with active Warfarin prescription,
   - When the doctor submits an order for Aspirin,
   - Then display a CRITICAL safety alert modal and require clinical override justification.
3. Definition of Done (DoD): Code complete, unit tests > 80% coverage, PR reviewed, and deployed on staging.""",
        "why_better": "Transforms informal feature ideas into measurable INVEST user stories with Gherkin acceptance criteria and a strict Definition of Done."
    },
    {
        "num": 3,
        "title": "Sprint Roadmap & Release Backlog (4 Sprints Breakdown)",
        "before": "sprint me kya kya banana h divide kr do",
        "issue": "Lack of Architectural Sequencing: Without dependency-aware sprint planning, teams try to build UI before auth/database models exist, stalling velocity.",
        "after": """Architect a progressive 4-Sprint Backlog Breakdown for CareConnect EHR:
1. Sprint 1 (Foundations & Security): Project scaffolding, Spring Security 6, JWT, User/Role models, and Angular client setup. (Points: 34)
2. Sprint 2 (Patient EMPI & Encounters): Patient registry, auto-generated MRN, vitals recording with BMI calculation, and SOAP clinical notes. (Points: 40)
3. Sprint 3 (CPOE & Clinical Safety): LOINC lab/radiology orders, technician result entry, and real-time Drug-Drug Interaction engine. (Points: 42)
4. Sprint 4 (Portal & Cloud Deployment): Patient self-service portal, HIPAA audit trail, Docker containerization, and Netlify CI/CD deploy. (Points: 32)""",
        "why_better": "Establishes a logical 4-sprint sequential roadmap where foundational architecture cleanly unlocks downstream clinical workflows."
    },
    {
        "num": 4,
        "title": "Sprint Velocity, Story Estimation & Capacity Planning",
        "before": "kaam kitne din me hoga sab developers ko kaam assign kr do",
        "issue": "Overcommitting & Burnout: Assigning arbitrary deadlines without velocity baselining or story point estimation leads to missed delivery dates and technical debt.",
        "after": """Implement Fibonacci-based Agile Estimation and Capacity Planning:
1. Estimation Method: Planning Poker using modified Fibonacci scale (1, 2, 3, 5, 8, 13) evaluating complexity, uncertainty, and effort.
2. Team Capacity Calculation: 4 developers x 8 days effective focus time = 32 dev-days (~36-40 velocity points per sprint).
3. Spike Stories: Allocate maximum 5-point timeboxed spikes for complex unknowns (e.g. evaluating LOINC library parsing vs custom enum).
4. Buffer Strategy: Reserve 15% sprint capacity for bug fixes, code reviews, and unplanned production hotfixes.""",
        "why_better": "Prevents overcommitment through Fibonacci story point estimation, empirical velocity tracking, and allocated engineering buffer time."
    },
    {
        "num": 5,
        "title": "Continuous Inspection & Sprint Retrospectives",
        "before": "sprint khatam hone ke baad agla sprint chalu kro bina kisi meeting ke",
        "issue": "Recurring Process Inefficiencies: Skipping retrospectives prevents teams from identifying technical bottlenecks, compounding delivery friction over time.",
        "after": """Structure the Sprint Retrospective and Continuous Inspection mechanism:
1. Retrospective Framework: 'What went well', 'What caused friction', 'Actionable commitments for next sprint'.
2. Key Metrics Tracked:
   - Sprint Burndown & Velocity consistency.
   - Defect Escape Rate (bugs found post-merge).
   - PR Cycle Time (time from PR open to merge).
3. Action Item Ownership: Each retrospective must produce no more than 2 high-impact process improvements with dedicated engineer ownership.
4. Continuous Improvement: Re-evaluate testing bottlenecks and CI pipeline latency to continually shorten feedback loops.""",
        "why_better": "Introduces continuous process inspection, defect tracking metrics, and actionable sprint-over-sprint workflow optimizations."
    }
]

total = len(items_sdlc)
for idx, it in enumerate(items_sdlc):
    html_content += f"""
<div class="page">
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">SDLC &bull; {it["num"]:02d}</span>
      <span class="module-title">{it["title"]}</span>
    </div>
    <div class="page-num">Page {idx + 1} of {total}</div>
  </div>

  <div class="comparison-container">
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : INFORMAL / UNPLANNED EXECUTION</span>
      </div>
      <div class="prompt-text-before">"{it["before"]}"</div>
      <div class="critique-box">
        <strong>SDLC Bottleneck / Risk:</strong> {it["issue"]}
      </div>
    </div>

    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : STRUCTURED AGILE SPRINT BLUEPRINT</span>
      </div>
      <div class="prompt-text-after">{it["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Agile &amp; Planning Gains:</strong> {it["why_better"]}
      </div>
    </div>
  </div>

  <div class="footer">
    <div>CareConnect EHR &bull; 002 SDLC Model and Agile Sprint Planning</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path_sdlc = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\002_SDLC_Model_and_Agile_Sprint_Planning.html"
pdf_path_sdlc = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\002_SDLC_Model_and_Agile_Sprint_Planning.pdf"

with open(html_path_sdlc, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path_sdlc}",
    f"file:///{html_path_sdlc.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("002 SDLC PDF Return code:", res.returncode)
print("002 SDLC PDF Size:", os.path.getsize(pdf_path_sdlc) / 1024 if os.path.exists(pdf_path_sdlc) else "Failed")
