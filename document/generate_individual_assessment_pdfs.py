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

assessments = [
    {
        "id": "Q001_Calculate_Factorial",
        "doc_title": "Q001 Calculate Factorial - Comparison",
        "case_tag": "Q001",
        "title": "Calculate Factorial (Clinical Trial Combinatorics & Permutations)",
        "before": "factorial nikalne ka code likh do java me",
        "issue": "Generic Toy Problem: Lacks healthcare context, fails with integer overflow for n > 20, and does not validate negative inputs.",
        "after": """Implement a robust, production-ready Factorial calculation utility in Java 21 for CareConnect EHR:
1. Clinical Context: Used in clinical trial biostatistics and pharmacokinetics for computing combinatorial patient cohort groupings (nCr = n! / (r! * (n - r)!)) and multi-drug interaction trial permutations.
2. Safety & Overflow Protection:
   - Use 'BigInteger' to prevent 64-bit integer overflow when calculating factorial for n > 20.
   - For small integers (n <= 20), provide an optimized iterative long-based implementation with exact overflow checks (Math.multiplyExact).
3. Input Validation: If input n < 0, throw an explicit IllegalArgumentException('Factorial is undefined for negative cohort sizes: ' + n).
4. Edge Cases: Explicitly handle base cases: 0! = 1 and 1! = 1.
5. Unit Testing: Include JUnit 5 tests asserting correct evaluation for 0, 5 (120), 20 (2432902008176640000), and negative inputs.""",
        "why_better": "Transforms a generic toy script into an enterprise biostatistical utility handling BigInteger overflow, negative input exceptions, and clinical cohort calculations."
    },
    {
        "id": "Q002_Email_Domain_Validation",
        "doc_title": "Q002 Email Domain Validation - Comparison",
        "case_tag": "Q002",
        "title": "Email Domain Validation (Healthcare Staff & Hospital Provider Filtering)",
        "before": "email validate karne ka code bnao domain check ke sath",
        "issue": "Brittle Regex & No Security: Basic string matching misses malformed emails, allows malicious injection, and lacks institutional hospital domain whitelisting.",
        "after": """Develop an enterprise Email Domain Validation service for CareConnect EHR staff registration:
1. Clinical Context: Healthcare compliance mandates that clinical staff (Doctors, Nurses, Administrators) must register only using certified institutional healthcare domains (e.g., @careconnect.com, @hospital.org, @hclhealth.com).
2. Validation Pipeline:
   - Format Validation: RFC 5322 compliant regex validation checking syntax, local-part characters, and valid top-level domains.
   - Domain Extraction: Safely parse and sanitize the domain portion case-insensitively.
   - Institutional Whitelist Check: Validate the extracted domain against an approved set of certified hospital healthcare domains in the system configuration.
   - Disposable Email Blocking: Reject public or temporary email domains (gmail.com, mailinator.com) for provider accounts.
3. Exception Handling: Return clear validation messages ('Invalid email format' vs 'Email domain is not authorized for healthcare provider registration').
4. Unit Testing: Comprehensive test suite covering valid corporate emails, subdomains, missing '@', and unauthorized public domains.""",
        "why_better": "Bridges standard email validation with HIPAA/hospital security by enforcing institutional domain whitelisting and RFC-compliant syntax."
    },
    {
        "id": "Q003_Arithmetic_Exception",
        "doc_title": "Q003 Arithmetic Exception - Comparison",
        "case_tag": "Q003",
        "title": "Arithmetic Exception Handling (Biometric BMI & Dosage Zero-Division Safeguard)",
        "before": "arithmetic exception kaise handle kare divide by zero ka code likho",
        "issue": "Abstract Academic Snippet: A simple try-catch block dividing 10 by 0 lacks realistic system error response, logging, or healthcare calculation safeguards.",
        "after": """Architect a clinical division safeguard and global ArithmeticException handler in CareConnect EHR:
1. Clinical Context: Occurs during automated biometric Body Mass Index (BMI = weight / height^2) calculations when height is zero/unrecorded, or during pediatric dosage per kg calculations.
2. Defensive Pre-Computation Checks:
   - Implement zero and negative divisor guards before division: if heightCm <= 0 or durationDays == 0, throw a custom InvalidClinicalDataException with specific diagnostic messages.
3. Global Exception Handler (@ControllerAdvice):
   - Catch unexpected ArithmeticException or division edge-cases centrally.
   - Prevent raw 500 server stack traces from leaking internal database/API schemas.
   - Return a clean RFC 7807 ProblemDetail JSON response with HTTP 400 Bad Request and clinical resolution advice ('Height must be greater than zero to calculate BMI flowsheet').
4. HIPAA Security Audit: Log the biometric calculation anomaly into the audit trail with input parameters for clinical data review.""",
        "why_better": "Replaces generic zero-division try-catches with proactive clinical validation, custom domain exceptions, and global RFC-7807 error responses."
    },
    {
        "id": "Q004_Find_Odd_or_Even_Number",
        "doc_title": "Q004 Find Odd or Even Number - Comparison",
        "case_tag": "Q004",
        "title": "Find Odd or Even Number (Clinical Triage Priority Alternation & Patient Cohort Sharding)",
        "before": "odd even check karne ka program banao",
        "issue": "Trivial Modulo Check: Basic 'n % 2 == 0' lacks real-world application, edge case awareness (negative numbers), and distributed system relevance.",
        "after": """Implement an optimized Odd/Even evaluation utility for CareConnect EHR clinical workload distribution:
1. Clinical Context:
   - Patient MRN Cohort Sharding: Distribute large patient batch analyses evenly across dual background worker threads (Even MRNs -> Worker Node A, Odd MRNs -> Worker Node B).
   - Inpatient Bed Allocation: Validate alternating room numbering standards and biennial clinical audit schedules.
2. Bitwise Optimization & Math Robustness:
   - Use bitwise AND operation '(number & 1) == 0' for maximum CPU-level throughput during high-volume batch processing of millions of medical records.
   - Correctly handle negative integers, zero (0 is even), and boundary values (Integer.MIN_VALUE and Integer.MAX_VALUE).
3. API Exposure: Expose a clean, functional Java 21 predicate 'Predicate<Integer> isEven' usable within Spring Data Streams and batch processors.
4. Unit Testing: Assert odd/even accuracy across positive, negative, zero, and extreme integer boundary values.""",
        "why_better": "Elevates basic odd/even logic into high-throughput bitwise worker sharding for patient batch analysis with comprehensive boundary test coverage."
    }
]

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
doc_dir = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document"

for a in assessments:
    page_html = f"""
<div class="page">
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">{a["case_tag"]}</span>
      <span class="module-title">{a["title"]}</span>
    </div>
    <div class="page-num">CareConnect EHR Assessment</div>
  </div>

  <div class="comparison-container">
    <div class="card-before">
      <div class="card-header-before">
        <span class="badge-before">&#x2717; BEFORE : BASIC / UNCONTEXTUALIZED PROMPT</span>
      </div>
      <div class="prompt-text-before">"{a["before"]}"</div>
      <div class="critique-box">
        <strong>Problem &amp; Limitations:</strong> {a["issue"]}
      </div>
    </div>

    <div class="card-after">
      <div class="card-header-after">
        <span class="badge-after">&#x2713; AFTER : CARECONNECT EHR HEALTHCARE CONTEXT PROMPT</span>
      </div>
      <div class="prompt-text-after">{a["after"].strip()}</div>
      <div class="improvements-bar">
        <strong>Enterprise Engineering &amp; Project Alignment:</strong> {a["why_better"]}
      </div>
    </div>
  </div>

  <div class="footer">
    <div>CareConnect EHR &bull; {a["id"]}</div>
    <div>Strict Side-by-Side Comparison</div>
  </div>
</div>
"""
    full_html = template_html.format(doc_title=a["doc_title"], body_content=page_html)
    html_file = os.path.join(doc_dir, f"{a['id']}.html")
    pdf_file = os.path.join(doc_dir, f"{a['id']}.pdf")
    
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
    print(f"Generated {a['id']}.pdf | Status: {res.returncode} | Exists: {os.path.exists(pdf_file)}")
