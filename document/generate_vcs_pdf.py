import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Version Control and Release Workflow - Comparison</title>
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
    background: #0969da;
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

items_vcs = [
    {
        "num": 1,
        "title": "Git Branching Strategy (GitFlow vs Trunk-Based)",
        "before": "git me code kaise manage kare sab log direct main branch pe push kr rhe h",
        "issue": "Uncontrolled Main Branch: Direct pushes to main without feature branching or PR reviews cause merge collisions, broken builds, and untracked code regressions.",
        "after": """Establish an enterprise Git branching model for the CareConnect EHR engineering team:
1. Core Protected Branches:
   - 'main': Production-ready, locked branch requiring signed releases and green CI builds.
   - 'develop': Integration branch for testing completed features.
2. Supporting Branches:
   - 'feature/<ticket-id>-<short-desc>': Branched off develop, merged via Pull Request.
   - 'bugfix/<ticket-id>' & 'hotfix/<version>': For urgent production patches directly into main and develop.
3. Branch Protection Rules: Require at least 1 peer code review approval, passing automated CI checks, and disable direct pushes or force pushes to main.""",
        "why_better": "Enforces a structured GitFlow strategy with protected branches, mandatory PR reviews, and eliminates risk of main branch breakage."
    },
    {
        "num": 2,
        "title": "Conventional Commits & Semantic History",
        "before": "git commit me kuch bhi likh dete h jaise 'fixed code' ya 'update'",
        "issue": "Opaque Commit History: Meaningless commit messages make debugging git bisect impossible, obscure code intent, and prevent automated changelog generation.",
        "after": """Enforce the Conventional Commits specification (v1.0.0) across the CareConnect repository:
1. Commit Message Standard: '<type>(<scope>): <imperative summary>'
   - Types: feat (new feature), fix (bug fix), chore (tooling/deps), refactor (no logic change), test (unit/e2e tests), docs.
   - Example: 'feat(cpoe): add LOINC catalog selector and STAT urgency triage'
2. Atomic Commits: Each commit must represent a single logical change with working tests.
3. Pre-Commit Verification: Configure Husky git hooks to validate commit message format before allowing the commit to be recorded.""",
        "why_better": "Creates an audit-ready commit history adhering to Conventional Commits standards, enabling automated versioning and changelogs."
    },
    {
        "num": 3,
        "title": "CI/CD Pipeline & Automated Quality Gate",
        "before": "code push hone par manual build chalao aur dekho chal rha h ya nahi",
        "issue": "Manual Build Vulnerability: Manual verification allows broken dependencies, failing tests, or unlinted code to slip into production unmonitored.",
        "after": """Engineer an automated GitHub Actions CI pipeline (.github/workflows/main.yml) quality gate:
1. Trigger Criteria: Automatically trigger on every push and pull request to 'main' and 'develop'.
2. Build & Test Matrix:
   - Backend: Set up JDK 21, run 'mvn clean verify', execute unit tests, and check test coverage.
   - Frontend: Set up Node.js 20, run linting, and compile Angular production build with 'npm run build'.
3. Gate Enforcement: Block PR merges if any test fails, lint checks error out, or the build fails.
4. Build Artifacts: Cache Maven dependencies and Node modules to optimize pipeline execution speed.""",
        "why_better": "Establishes a zero-touch automated CI gate validating builds, tests, and code quality on every PR before merge."
    },
    {
        "num": 4,
        "title": "Semantic Versioning & Release Tagging Workflow",
        "before": "release ka version kaise de v1 v2 kuch bhi daal de kya",
        "issue": "Arbitrary Versioning: Random version numbers break dependency compatibility, violate SemVer standards, and confuse stakeholders during deployment rollbacks.",
        "after": """Implement Semantic Versioning (SemVer 2.0.0: MAJOR.MINOR.PATCH) and Release Tagging:
1. Increment Criteria:
   - MAJOR (e.g. 2.0.0): Breaking API contract changes or database schema incompatibilities.
   - MINOR (e.g. 1.1.0): New backward-compatible clinical features (e.g. CPOE module added).
   - PATCH (e.g. 1.0.1): Backward-compatible hotfixes (e.g. BMI rounding bug fix).
2. Git Tagging: Create annotated cryptographic tags (e.g., 'git tag -a v1.0.0 -m \"Release 1.0.0\"').
3. Automated Release Notes: Automatically generate release changelogs grouped by Features and Bug Fixes from Conventional Commits.""",
        "why_better": "Standardizes versioning with SemVer 2.0.0, transparent git release tags, and automated changelog generation."
    },
    {
        "num": 5,
        "title": "Production Deployment & Rollback Strategy",
        "before": "production me deploy krte waqt kuch fat jaye to dubara manually theek karo",
        "issue": "Downtime & High Risk: Lack of an automated rollback mechanism causes extended system downtime and potential healthcare data corruption during broken deploys.",
        "after": """Architect a zero-downtime Release Deployment and Automated Rollback strategy:
1. Frontend Deployment (Netlify): Atomic deploys with instant rollback capability to the previous successful deploy hash if smoke tests fail.
2. Backend Deployment (Docker Container): Use immutable image tags (e.g., 'careconnect-backend:v1.0.0') rather than mutable 'latest' tags.
3. Health Check & Verification: Automated post-deployment smoke test pinging '/api/actuator/health' before routing live traffic.
4. Disaster Recovery: Document 1-click rollback procedures to revert DNS or containers to the prior verified stable version.""",
        "why_better": "Ensures zero-downtime releases with immutable Docker container tags, automated health checks, and instant 1-click rollback."
    }
]

total = len(items_vcs)
for idx, it in enumerate(items_vcs):
    html_content += f"""
<div class="page">
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">VCS &bull; {it["num"]:02d}</span>
      <span class="module-title">{it["title"]}</span>
    </div>
    <div class="page-num">Page {idx + 1} of {total}</div>
  </div>

  <div class="comparison-container">
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : AD-HOC / FRAGILE WORKFLOW</span>
      </div>
      <div class="prompt-text-before">"{it["before"]}"</div>
      <div class="critique-box">
        <strong>Workflow Bottleneck / Risk:</strong> {it["issue"]}
      </div>
    </div>

    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : STRUCTURED ENTERPRISE RELEASE WORKFLOW</span>
      </div>
      <div class="prompt-text-after">{it["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Governance &amp; Stability Gains:</strong> {it["why_better"]}
      </div>
    </div>
  </div>

  <div class="footer">
    <div>CareConnect EHR &bull; 001 Version Control and Release Workflow</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""

html_content += """
</body>
</html>
"""

html_path_vcs = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\001_Version_Control_and_Release_Workflow.html"
pdf_path_vcs = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\001_Version_Control_and_Release_Workflow.pdf"

with open(html_path_vcs, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path_vcs}",
    f"file:///{html_path_vcs.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("001 VCS PDF Return code:", res.returncode)
print("001 VCS PDF Size:", os.path.getsize(pdf_path_vcs) / 1024 if os.path.exists(pdf_path_vcs) else "Failed")
