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
    background: #0969da;
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

frontend_questions = [
    {
        "id": "001_HTML_Basics_Span_Tag",
        "doc_title": "001 HTML Basics Span Tag - Comparison",
        "tag": "001",
        "title": "HTML Basics Span Tag (Clinical Badge & Patient Allergy Highlighting)",
        "before": "span tag use karke text color change krne ka html code likho",
        "issue": "Basic Inline Styling: Lacks semantic healthcare structure, accessibility attributes (ARIA), and clinical risk color-coding standards.",
        "after": """Develop accessible, semantic HTML5 span badges for clinical status markers in CareConnect EHR:
1. Clinical Context:
   - Display patient allergy severity tags (e.g. 'PENICILLIN - SEVERE ANAPHYLAXIS'), blood group indicators ('O-POSITIVE'), and order urgency badges ('STAT - EMERGENCY') in patient charts.
2. Semantic HTML & Accessibility Standards:
   - Use inline 'span' elements equipped with accessibility attributes: role='status', aria-label='Critical Allergy Alert: Penicillin', and tabindex='0'.
   - Avoid inline style attributes; use dedicated CSS class tokens: .badge-allergy-critical, .badge-blood-type, .badge-triage-stat.
3. High-Contrast Healthcare Palette:
   - Ensure color contrast ratios meet WCAG 2.1 AA (minimum 4.5:1 against dark slate container).
4. Code Implementation:
   - Clean HTML template demonstrating patient header banner with multiple semantic span badges.""",
        "why_better": "Transforms simple colored text into accessible (ARIA), high-contrast clinical allergy and triage urgency badges."
    },
    {
        "id": "002_CSS_Lniks",
        "doc_title": "002 CSS Links - Comparison",
        "tag": "002",
        "title": "CSS Links (Hospital Navigation Bar & Interactive Clinical Action Links)",
        "before": "css me link color change karne ka code likho hover aur active ke sath",
        "issue": "Generic Hyperlink Tutorial: Ignores healthcare UI design systems, keyboard focus rings for accessible navigation, and clinical priority states.",
        "after": """Design a modern, accessible interactive link and navigation styling system in SCSS for CareConnect EHR:
1. Clinical Navigation Context:
   - Style primary hospital navigation anchors ('Patients', 'Clinical Notes', 'CPOE Orders', 'Emergency Triage') and inline table action links ('View 360° Chart', 'Review Labs').
2. Pseudo-Class Styling Specification:
   - :link & :visited: Clear clinical cyan (#38bdf8) with smooth color transitions.
   - :hover: Subtle glow and background highlight pill (rgba(56, 189, 248, 0.15)) for clear visual feedback.
   - :focus-visible: Distinct 2px solid #58a6ff outline offset by 2px to satisfy WCAG keyboard navigation guidelines.
   - :active: Slight scale-down transform (scale(0.98)) for tactical tactile feel.
3. SCSS Integration:
   - Author clean, modular SCSS nested rules utilizing CSS custom properties (--primary-link, --link-hover).""",
        "why_better": "Elevates basic link recoloring into an accessible, WCAG-compliant clinical navigation design system with focus rings and tactile states."
    },
    {
        "id": "003_JavaScript_Add_Remove_Class_Comples",
        "doc_title": "003 JavaScript Add Remove Class Comple - Comparison",
        "tag": "003",
        "title": "JavaScript Add Remove Class Complex (Abnormal Vitals & Emergency STAT Triage Class Toggle)",
        "before": "javascript me add class aur remove class ka code likho button click par",
        "issue": "Trivial DOM Manipulation: Lacks multi-state clinical triage logic, threshold evaluation, and smooth medical alert transitions.",
        "after": """Implement a dynamic Clinical Triage Class Management module using modern JavaScript (ES6+):
1. Clinical Context:
   - When vitals are entered in the triage flowsheet, dynamically toggle visual urgency states on the patient card based on biometrics (Normal -> Warning -> STAT Emergency).
2. Multi-Class DOM Logic:
   - If Systolic BP > 180 or SpO2 < 90%:
     classList.remove('status-normal', 'status-warning');
     classList.add('status-stat-alert', 'pulse-animation');
   - If Systolic BP between 140-179:
     classList.remove('status-normal', 'status-stat-alert', 'pulse-animation');
     classList.add('status-warning');
3. Defensive Event Handling:
   - Use element.classList.toggle() and classList.replace() safely with null-checks.
   - Dispatch custom DOM event 'clinicalAlertTriggered' to notify the hospital audio-chime service.""",
        "why_better": "Applies class toggling to real-time clinical vital sign triage alerts with multi-tier thresholds and audio dispatch hooks."
    },
    {
        "id": "004_JavaScript_Blank_Validation&Length_Simple",
        "doc_title": "004 JavaScript Blank Validation and Length - Comparison",
        "tag": "004",
        "title": "JavaScript Blank Validation & Length (Medical Record Number & Phone Sanitization)",
        "before": "input field me text blank h ya length sahi h check karne ka js code do",
        "issue": "Basic Text Check: Lacks medical record number (MRN) format validation, whitespace trimming, and clinical error feedback.",
        "after": """Develop an enterprise Client-Side Validation Utility in JavaScript (ES6+) for CareConnect EHR registration:
1. Clinical Field Requirements:
   - Patient MRN: Must not be blank, must match exact 13-character pattern 'MRN-YYYY-XXXX', and reject leading/trailing whitespace.
   - Emergency Contact Phone: Must not be blank, minimum 10 digits after stripping non-numeric punctuation, adhering to ITU E.164.
2. Validation Functions:
   - validateMRN(mrnString): Trims whitespace, checks length == 13, and validates regex /^MRN-\\d{4}-\\d{4}$/.
   - validatePhone(phoneString): Normalizes string, checks cleaned digits length >= 10.
3. User Experience & Error Objects:
   - Return structured validation result: { isValid: boolean, field: string, errorMessage: string }.
   - Highlight invalid inputs in red with inline accessibility error descriptions (aria-invalid='true').""",
        "why_better": "Replaces generic string emptiness checks with exact MRN format matching, whitespace sanitization, and accessible error objects."
    },
    {
        "id": "005_JavaScript_Form_Login_Medium",
        "doc_title": "005 JavaScript Form Login Medium - Comparison",
        "tag": "005",
        "title": "JavaScript Form Login Medium (Healthcare Provider Authentication & Sanitization)",
        "before": "login form ka validation bnao js me username password check kro",
        "issue": "Insecure Client Validation: Hardcoding credentials or checking plain strings without payload sanitization or asynchronous API submission.",
        "after": """Architect an asynchronous Healthcare Provider Login Form Handler in JavaScript (ES6+):
1. Security & Clinical Context:
   - Authenticate doctors, nurses, and administrators into CareConnect EHR while preventing cross-site scripting (XSS) and injection attempts.
2. Validation & Pre-Submission Workflow:
   - Email Validation: Enforce certified hospital provider domain format (e.g. user@careconnect.com).
   - Password Strength: Minimum 8 characters, requiring uppercase, lowercase, number, and special character.
   - Prevent Default: Intercept form submit event, sanitize payload, and disable the 'Sign In' button with a loading spinner to prevent duplicate clicks.
3. Asynchronous Fetch API:
   - Send POST request with JSON credentials to '/api/auth/login'.
   - On 200 OK: Safely store JWT in secure session state and redirect to role-specific dashboard.
   - On 401 Unauthorized: Display high-visibility alert: 'Invalid medical credentials. Please verify your staff email and password.'""",
        "why_better": "Transforms basic login alerts into a secure async fetch workflow with password strength validation, loading states, and JWT handling."
    },
    {
        "id": "006_Typescript_Welcome_Customer_Simple",
        "doc_title": "006 Typescript Welcome Customer Simple - Comparison",
        "tag": "006",
        "title": "TypeScript Welcome Customer Simple (Personalized Patient Portal Greeting & Vitals Summary)",
        "before": "typescript me welcome message print krne ka function bnao",
        "issue": "Trivial String Concat: Ignores TypeScript interfaces, strict typing, clinical patient records, and time-aware contextual greetings.",
        "after": """Implement a strongly-typed Patient Portal Welcome Service using TypeScript in CareConnect EHR:
1. Strongly-Typed Data Models:
   - Define interface 'PatientProfile' with fields: mrn (string), firstName (string), lastName (string), dateOfBirth (Date), assignedPhysician (string), lastVitalsRecordedAt?: Date.
2. Contextual Greeting Logic:
   - getWelcomeGreeting(patient: PatientProfile): string
   - Determine morning ('Good morning'), afternoon ('Good afternoon'), or evening ('Good evening') based on current hospital local time.
   - Format: 'Good morning, Mr. John Doe (MRN: MRN-2026-0001). Welcome to your CareConnect Health Portal.'
3. Next Appointment & Action Badge:
   - Return a strongly-typed GreetingDTO containing the greeting text, assigned doctor, and an alert if recent vitals or lab reports require patient review.
4. Unit Testing:
   - Test greeting output across different hours of the day using mock Date objects and strict null checks.""",
        "why_better": "Replaces a basic print function with a strongly-typed TypeScript PatientProfile interface and time-aware clinical portal greetings."
    },
    {
        "id": "007_Angular_Display_Text_with_Style_Attributes_using_ngStyle",
        "doc_title": "007 Angular Display Text using ngStyle - Comparison",
        "tag": "007",
        "title": "Angular Display Text using [ngStyle] (Dynamic Clinical Triage Urgency & Vital Severity)",
        "before": "angular me ngStyle use karke text color change karne ka example do",
        "issue": "Static Style Binding: Trivial red/blue examples lack dynamic clinical thresholds, SpO2 hypoxia coloring, and design system encapsulation.",
        "after": """Implement dynamic clinical vital sign color-coding using [ngStyle] in Angular 17 standalone component:
1. Clinical Context:
   - Color-code physiological patient vitals dynamically in the vital flowsheet table to draw immediate physician attention to abnormal biometrics.
2. Dynamic Method Computation:
   - getBpStyle(systolic: number): Record<string, string>
     - Systolic >= 180: {{ 'color': '#ef4444', 'font-weight': '700', 'background': 'rgba(239, 68, 68, 0.15)' }} (Hypertensive Crisis)
     - Systolic 140-179: {{ 'color': '#f59e0b', 'font-weight': '600' }} (Stage 2 Hypertension)
     - Systolic < 120: {{ 'color': '#10b981' }} (Normal)
   - getSpo2Style(spo2: number): Hypoxia warning (< 90% = crimson red with bold styling).
3. Component Template:
   - Bind clean Angular expression: '<span [ngStyle]="getBpStyle(patient.vital.systolic)">{{ patient.vital.systolic }} mmHg</span>'.""",
        "why_better": "Connects [ngStyle] to life-critical vital sign thresholds (hypertensive crisis, hypoxia) with clinical color indicators."
    },
    {
        "id": "008_Angular_List_of_Questionsusing_ngFor",
        "doc_title": "008 Angular List of Questions using ngFor - Comparison",
        "tag": "008",
        "title": "Angular List of Questions using *ngFor (Pre-Operative Triage & Clinical Assessment Questionnaire)",
        "before": "angular me ngFor use karke questions ki list display kro",
        "issue": "Naive Iteration: Uses obsolete *ngFor instead of modern Angular 17 @for, misses two-way form binding, and clinical risk questionnaires.",
        "after": """Develop an interactive Pre-Operative Triage Questionnaire component in Angular 17 using modern control flow (@for / *ngFor):
1. Clinical Assessment Context:
   - Nurses administer pre-surgical safety questionnaires (e.g., 'Have you eaten in the last 8 hours?', 'Do you take blood thinners like Warfarin?', 'History of anesthesia reactions?').
2. Data Model:
   - interface TriageQuestion {{ id: number; questionText: string; category: 'DIET' | 'MEDICATION' | 'ALLERGY'; isRiskTrigger: boolean; answer?: boolean; }}
3. Angular 17 Modern Template:
   - Iterate using optimized track expression:
     @for (q of questions; track q.id) {{
       <div class="question-row" [class.risk-highlight]="q.answer && q.isRiskTrigger">
         <label>{{ q.questionText }}</label>
         <input type="radio" [(ngModel)]="q.answer" [value]="true"> Yes
         <input type="radio" [(ngModel)]="q.answer" [value]="false"> No
       </div>
     }}
4. Real-Time Risk Score:
   - Automatically tally risk flags and trigger an alert if high-risk surgical contraindications are confirmed.""",
        "why_better": "Upgrades basic list printing to modern Angular 17 @for syntax rendering an interactive pre-operative clinical risk triage form."
    },
    {
        "id": "009_Angular_Display_Current_Time_using_Async_Pipe",
        "doc_title": "009 Angular Display Current Time using Async Pipe - Comparison",
        "tag": "009",
        "title": "Angular Display Current Time using Async Pipe (Real-Time ICU Clock & Medication Administration Stamp)",
        "before": "angular me current time display kro async pipe se",
        "issue": "Uncontrolled Interval: Missing RxJS cleanup (memory leaks), lacking high-precision clinical formatting, and missing ICU timestamp context.",
        "after": """Build a precision ICU Clinical Clock & Medication Administration Timestamp service using Angular 17 & Async Pipe:
1. Clinical Context:
   - Intensive Care Units (ICU) and emergency wards require synchronized, real-time clinical clocks to timestamp emergency medication pushes (e.g. Epinephrine STAT) down to the exact second.
2. Reactive RxJS Architecture:
   - Expose 'currentTime$: Observable<Date>' created using timer(0, 1000).pipe(map(() => new Date()), shareReplay(1)).
   - Clean Memory Management: Using the Angular 'async' pipe guarantees automatic subscription and unsubscription on component destruction, preventing memory leaks.
3. Template Implementation:
   - Render: '<div class="icu-clock">{{ currentTime$ | async | date:"yyyy-MM-dd HH:mm:ss" }} EST &bull; WARD 4B</div>'
4. Unit Testing:
   - Test observable emission with RxJS TestScheduler verifying 1-second cadence without thread blocking.""",
        "why_better": "Implements leak-free RxJS async pipe clock formatting critical for timestamping emergency ICU medication dispensation."
    },
    {
        "id": "010_Angular_Display_Product_Details_using_Reactive_Forms",
        "doc_title": "010 Angular Display Product Details using Reactive Forms - Comparison",
        "tag": "010",
        "title": "Angular Reactive Forms (CPOE Diagnostic Lab Order Requisition Form)",
        "before": "reactive form banao product details enter karne ke liye angular me",
        "issue": "Generic CRUD Form: Misses LOINC diagnostic medical test catalogs, priority dropdowns (STAT/ROUTINE), and clinical validation rules.",
        "after": """Architect a Computerized Physician Order Entry (CPOE) Diagnostic Lab Requisition Form using Angular 17 Reactive Forms:
1. Clinical Context:
   - Physicians select and order diagnostic laboratory procedures (CBC, Lipid Panel, Metabolic Panel) with clinical priority triage.
2. Form Structure (FormBuilder):
   - patientMrn: ['', [Validators.required, Validators.pattern(/^MRN-\\d{4}-\\d{4}$/)]]
   - testType: ['LABORATORY', Validators.required]
   - loincCode: ['', Validators.required] (e.g., '58410-2' for Complete Blood Count)
   - priority: ['ROUTINE', Validators.required] (ROUTINE, URGENT, STAT)
   - clinicalIndication: ['', [Validators.required, Validators.minLength(10)]]
3. Dynamic Validation & Pre-Submission Guard:
   - If priority is 'STAT', require mandatory justification in clinicalIndication.
   - Show inline validation errors using accessible form-control states (is-invalid, ng-touched).
4. Submission Handler:
   - On valid submit, dispatch OrderDto to OrderService and trigger toast notification with order tracking number.""",
        "why_better": "Adapts a generic product form into an authentic CPOE diagnostic lab requisition form with LOINC codes and STAT triage validation."
    }
]

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
doc_dir = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\Frontend_Assessments_001_010"

for q in frontend_questions:
    page_html = f"""
<div class="page">
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">{q["tag"]}</span>
      <span class="module-title">{q["title"]}</span>
    </div>
    <div class="page-num">CareConnect EHR Frontend Assessment</div>
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
