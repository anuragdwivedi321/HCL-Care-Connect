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

questions = [
    {
        "id": "Q001_Discount_Offers",
        "doc_title": "Q001 Discount Offers - Comparison",
        "tag": "Q001",
        "title": "Discount Offers (Hospital Pharmacy Tiered Formulary & Insurance Copay)",
        "before": "discount calculate karne ka program banao amount ke hisab se",
        "issue": "Generic Retail Script: Lacks healthcare billing context, tier thresholds, insurance copay subsidy rules, and negative value validation.",
        "after": """Develop an enterprise Pharmacy Formulary & Insurance Copay Discount Calculator for CareConnect EHR:
1. Clinical & Billing Context:
   - Calculate out-of-pocket patient copays and tiered formulary subsidies for outpatient prescriptions based on insurance policy tier (Tier 1 Generic = 80% subsidy, Tier 2 Preferred Brand = 50%, Tier 3 Non-Preferred = 20%).
   - Senior Citizen & Low-Income Subsidy: Apply an additional 10% hardship discount on eligible patient MRNs.
2. Precision & Rounding:
   - Use 'BigDecimal' with RoundingMode.HALF_UP to prevent floating-point financial discrepancies.
   - Enforce minimum copay floors (copay cannot drop below $0.00).
3. Defensive Input Validation:
   - Reject negative medication price inputs by throwing an InvalidBillingException.
4. Unit Testing:
   - JUnit 5 tests asserting correct final copay across Tier 1, Tier 2, Tier 3, and senior citizen discount exemptions.""",
        "why_better": "Replaces generic retail math with precise BigDecimal pharmacy copay subsidies, insurance tier logic, and negative input guards."
    },
    {
        "id": "Q002_Electricity_Bill_Generation",
        "doc_title": "Q002 Electricity Bill Generation - Comparison",
        "tag": "Q002",
        "title": "Electricity Bill Generation (Hospital Facility Energy & Intensive Care Ward Billing)",
        "before": "electricity bill calculate krne ka code likho units ke hisab se",
        "issue": "Basic Slab Check: Lacks enterprise multi-department hospital cost center allocation, emergency backup generator surcharges, and audit trail logging.",
        "after": """Implement a Hospital Facility Energy Allocation & Ward Utility Billing engine for CareConnect EHR:
1. Facility Context:
   - Distribute hospital electricity consumption across clinical cost centers: General Inpatient Wards (standard slab tariff), ICU & Operating Theaters (uninterrupted UPS power surcharge +25%), and Diagnostic Labs.
2. Tiered Slab Architecture:
   - Base 0-500 kWh: $0.12/kWh; 501-2000 kWh: $0.18/kWh; >2000 kWh: $0.24/kWh.
   - Emergency Generator (DG) Surcharge: Dynamic variable cost added during municipal grid power disruptions.
3. Accounting Standards:
   - Use BigDecimal for exact kilowatt-hour rate computations and tax calculations.
   - Generate automated internal departmental invoice DTOs linked to department codes (e.g., DEPT-ICU-01).
4. Unit Testing:
   - Verify rate calculations across slab boundaries and emergency generator runtime surcharges.""",
        "why_better": "Elevates simple slab logic to hospital facility energy cost-center allocation (ICU/OT/Labs) with UPS backup surcharges and audit DTOs."
    },
    {
        "id": "Q003_Employee_Detail_display",
        "doc_title": "Q003 Employee Detail display - Comparison",
        "tag": "Q003",
        "title": "Employee Detail Display (Clinical Provider Staff Profile & Credential Masking)",
        "before": "employee details print kr do id name salary wagera",
        "issue": "Unsafe Data Exposure: Printing raw salary and personal details violates privacy standards and lacks role-based field masking.",
        "after": """Design a HIPAA-compliant Clinical Provider & Staff Directory Display Service in CareConnect EHR:
1. Clinical Context:
   - Display hospital staff profiles (Doctors, Nurses, Pharmacists, Admins) with role, department, medical license numbers (NPI/DEA), and on-call status.
2. Field-Level Security & Masking:
   - Protect confidential data: Mask compensation and SSN for standard users; only ROLE_ADMIN can view full payroll details.
   - Doctor profiles must showcase clinical specialties, active department, and assigned inpatient ward.
3. Formatted Output:
   - Implement clean JSON and formatted console representation using toString() with credential badges.
4. Unit Testing:
   - Assert that non-admin callers receive masked salary fields while clinical identifiers remain accessible for staff lookup.""",
        "why_better": "Transforms basic sysout printing into a secure clinical staff directory with role-based salary masking and medical license display."
    },
    {
        "id": "Q004_Food_Bill_Discount",
        "doc_title": "Q004 Food Bill Discount - Comparison",
        "tag": "Q004",
        "title": "Food Bill Discount (Inpatient Dietary Nutrition & Meal Plan Billing)",
        "before": "food bill me discount calculate kro hotel bill jaisa",
        "issue": "Irrelevant Restaurant Script: Misses clinical dietary meal plans (diabetic, renal, cardiac) and hospital inpatient insurance bundling.",
        "after": """Develop an Inpatient Clinical Nutrition & Dietary Meal Plan Billing module for CareConnect EHR:
1. Clinical Context:
   - Inpatients receive therapeutic medical nutrition plans prescribed in SOAP notes (e.g., Diabetic Low-Sodium, Renal Diet, Pureed).
   - Inpatient meal plans are 100% bundled and discounted under insurance coverage; companion/visitor guest meals are charged with applicable hospital staff discounts (15%).
2. Calculation Rules:
   - Separate patient therapeutic meals ($0 billable out-of-pocket) from auxiliary guest dietary orders.
   - Apply tax exemption on therapeutic nutrition while calculating local sales tax on cafeteria orders.
3. Financial Integrity:
   - Use BigDecimal for all dietary line-item sums and discounts.
4. Unit Testing:
   - Assert zero-dollar billing for insured inpatient meals and correct 15% discount on guest tray vouchers.""",
        "why_better": "Converts hotel bill discount into an inpatient clinical dietary billing engine distinguishing therapeutic meals from guest cafeteria orders."
    },
    {
        "id": "Q005_Sales_Commission",
        "doc_title": "Q005 Sales Commission - Comparison",
        "tag": "Q005",
        "title": "Sales Commission (Pharmaceutical Vendor Supplies & Diagnostic Equipment Procurement)",
        "before": "sales commission nikalne ka code likho sales target ke hisab se",
        "issue": "Commercial Bias: Sales commissions on patient treatments violate anti-kickback healthcare laws (Stark Law) without strict legal framing.",
        "after": """Implement a Stark Law-Compliant Hospital Procurement & Vendor Volume Rebate module for CareConnect EHR:
1. Healthcare Compliance Context:
   - Medical ethics and anti-kickback laws strictly prohibit commissions on patient referrals or prescribed drugs.
   - Instead, calculate legitimate hospital administrative volume rebates for institutional pharmaceutical supplies and biomedical PPE procurement.
2. Tiered Procurement Rebate Tiers:
   - Volume $10,000 - $50,000: 2% rebate; $50,001 - $200,000: 4% rebate; > $200,000: 6% rebate.
3. Anti-Kickback Safeguards:
   - Restrict rebate calculations strictly to B2B institutional vendor purchases with vendor contract verification IDs.
   - Exclude any physician or individual practitioner referral attribution.
4. Unit Testing:
   - Assert accurate volume tier rebate calculation and verify compliance audit flags on vendor contracts.""",
        "why_better": "Replaces unethical physician commissions with Stark Law-compliant institutional hospital procurement volume rebates."
    },
    {
        "id": "Q006_Driver_Recruitment",
        "doc_title": "Q006 Driver Recruitment - Comparison",
        "tag": "Q006",
        "title": "Driver Recruitment (Emergency Ambulance Paramedic & Critical Transport Onboarding)",
        "before": "driver hire karne ke liye eligibility check krne ka code bnao age aur license dekh ke",
        "issue": "Basic Age Check: Fails to validate emergency vehicle operation, BLS certification, clean driving history, and response readiness.",
        "after": """Build an Emergency Medical Services (EMS) Ambulance Driver & Paramedic Onboarding Service for CareConnect EHR:
1. Clinical Context:
   - Validate qualification criteria for critical emergency ambulance operators transport teams.
2. Multi-Tier Eligibility Rules:
   - Age Requirement: Minimum 23 years, valid Commercial Driver's License (CDL Class B or above).
   - Medical Certifications: Mandatory Basic Life Support (BLS/CPR) certification and Emergency Vehicle Operator Course (EVOC) license.
   - Clean Record: Maximum of 0 major moving violations in the last 36 months, clean drug screening status.
3. Automated Assessment Flow:
   - If all criteria met -> Status: APPROVED_FOR_EVOC_DISPATCH; if medical cert expired -> Status: PENDING_BLS_RECERTIFICATION.
4. Unit Testing:
   - Assert rejection for candidates missing EVOC certification or possessing recent traffic violations.""",
        "why_better": "Elevates simple driver age checking into comprehensive Emergency Ambulance paramedic qualifications (EVOC license, BLS certification)."
    },
    {
        "id": "Q007_Festive_coupons",
        "doc_title": "Q007 Festive coupons - Comparison",
        "tag": "Q007",
        "title": "Festive Coupons (Community Health Wellness Camp & Preventive Screening Vouchers)",
        "before": "festive coupon code apply krne ka program bnao coupon code match kro",
        "issue": "E-Commerce Script: Retail promo coupons mismatch healthcare ethics and lack screening package bundles and expiration validation.",
        "after": """Develop a Community Preventive Health Camp & Wellness Voucher Verification engine for CareConnect EHR:
1. Clinical Context:
   - Hospitals issue public wellness vouchers (e.g., 'HEART-MONTH-2026', 'DIABETES-PREVENT') for discounted preventive health screenings (Lipid Panel, HbA1c, Mammography).
2. Validation Pipeline:
   - Voucher Code Sanitization: Case-insensitive, whitespace-trimmed code matching.
   - Date Validity & Expiration: Verify current date falls strictly within the active screening campaign window.
   - Applicable Service Mapping: Restrict voucher redemption specifically to preventive wellness packages; block redemption on acute inpatient surgery or ER visits.
   - Single-Use per MRN: Ensure a patient cannot redeem the same promotional screening voucher twice.
3. Unit Testing:
   - Assert voucher discount applied to preventive lab orders and rejected on expired or non-wellness services.""",
        "why_better": "Translates retail coupons into ethical public health preventive screening vouchers with date checks and package-specific restrictions."
    },
    {
        "id": "Q008_Shopping_Cart",
        "doc_title": "Q008 Shopping Cart - Comparison",
        "tag": "Q008",
        "title": "Shopping Cart (Inpatient Prescription Cart & Pharmacy Dispensation Queue)",
        "before": "shopping cart bnao item add remove aur total price calculate kro",
        "issue": "Standard Retail Cart: Misses prescription doctor signatures, inventory stock locks, dosage limits, and drug interaction alerts.",
        "after": """Architect a Clinical Pharmacy Dispensation & Inpatient Medication Cart Service in CareConnect EHR:
1. Clinical Context:
   - Hospital nursing cart where prescribed medications for an inpatient are staged, verified, and dispensed during morning/evening medication administration rounds.
2. Clinical Cart Operations:
   - addItem(): Requires certified prescription ID, validates hospital pharmacy formulary stock, and verifies doctor electronic signature.
   - removeItem(): Logs nurse removal rationale for controlled substances into the audit log.
   - calculateTotal(): Tallies dispensed units and updates hospital central inventory automatically.
3. Safety Pre-Check:
   - Prevent adding medications that trigger CRITICAL drug interaction warnings with items already residing in the patient's active cart.
4. Unit Testing:
   - Test adding medications, removing items with audit logging, and calculating total cost using BigDecimal.""",
        "why_better": "Adapts retail shopping cart into a hospital inpatient medication administration cart with stock tracking and prescription validation."
    },
    {
        "id": "Q009_Vehicle_Lifespan",
        "doc_title": "Q009 Vehicle Lifespan - Comparison",
        "tag": "Q009",
        "title": "Vehicle Lifespan (Hospital Fleet & Ambulance Asset Lifecycle Management)",
        "before": "vehicle lifespan calculate kro purchase year aur current year se",
        "issue": "Trivial Subtraction: Merely subtracting years fails to account for mileage wear, emergency patient transport safety limits, and regulatory retirement mandates.",
        "after": """Implement a Hospital Fleet Lifecycle & Ambulance Operational Safety Assessment utility in CareConnect EHR:
1. Fleet Context:
   - Evaluate maintenance lifecycle, engine flight hours, and safety roadworthiness for hospital emergency ambulances, mobile ICUs, and blood transport vans.
2. Multi-Factor Lifespan Algorithm:
   - Age Limit: Maximum 8 years for Type I/III front-line emergency ambulances.
   - Mileage Threshold: Maximum 250,000 km before mandatory transition from critical emergency response to non-emergency patient transfer.
   - Maintenance Health Index: Decrement lifespan based on major engine repairs and cardiac defibrillator onboard power hours.
3. Status Classification:
   - 'ACTIVE_STAT_READY', 'SCHEDULE_MAJOR_OVERHAUL', or 'RETIRE_FROM_EMERGENCY_FLEET'.
4. Unit Testing:
   - Test vehicle transition from active emergency to non-emergency status upon crossing mileage or age thresholds.""",
        "why_better": "Transforms basic age subtraction into a comprehensive ambulance fleet asset lifecycle and patient transport safety evaluator."
    },
    {
        "id": "Q010_Bonus_Calculation_using_Abstract_Class",
        "doc_title": "Q010 Bonus Calculation using Abstract Class - Comparison",
        "tag": "Q010",
        "title": "Bonus Calculation using Abstract Class (Clinical Staff Incentive & On-Call Compensation)",
        "before": "abstract class bnao employee aur bonus calculate kro subclasses me",
        "issue": "Academic Inheritance: Lacks healthcare specialization, clinical quality metrics, on-call night shifts, and hospital compensation guidelines.",
        "after": """Design a Clinical Staff Incentive & On-Call Compensation subsystem using Abstract Classes in Java 21 for CareConnect EHR:
1. Object-Oriented Architecture:
   - Abstract Class 'HealthcareStaff': Fields for staffId, fullName, baseSalary, onCallHours, and abstract method 'calculateIncentive()'.
2. Specialized Subclasses:
   - 'Physician': Incentive calculated on completed patient consultations, peer clinical review score, and complex surgery volume bonus.
   - 'NursePractitioner': Incentive calculated on bedside patient care hours, patient safety score, and night emergency shift differentials.
   - 'DiagnosticTechnician': Incentive based on turnaround time compliance for STAT LOINC lab tests (CBC, BMP).
3. Polymorphic Evaluation:
   - Process hospital department payroll polymorphically across List<HealthcareStaff>.
4. Unit Testing:
   - Assert polymorphic calculation of incentives across physicians, nurses, and lab technicians using BigDecimal.""",
        "why_better": "Implements clean OOP abstract class architecture tailored to clinical compensation (physician surgical metrics, nurse night shifts, lab turnaround)."
    },
    {
        "id": "Q011_Employee_LOP_Management_System",
        "doc_title": "Q011 Employee LOP Management System - Comparison",
        "tag": "Q011",
        "title": "Employee LOP Management System (Hospital Staff Leave Without Pay & Shift Relief)",
        "before": "lop salary deduction ka code bnao total days minus lop days",
        "issue": "Simple Day Subtraction: Misses mandatory clinical coverage minimums, nursing shift handoffs, and medical licensing board requirements.",
        "after": """Implement a Clinical Staff Leave Without Pay (LOP) & Roster Coverage Management System in CareConnect EHR:
1. Operational Context:
   - Manage unpaid leaves for hospital physicians, resident doctors, and nursing staff while enforcing mandatory ward patient-to-nurse staffing ratios.
2. Deduction & Ratio Calculations:
   - Daily Salary Rate: baseSalary / monthlyWorkingDays (using BigDecimal).
   - LOP Deduction: unpaidDays * dailySalaryRate.
   - Critical Ward Minimum Alert: If a nurse takes LOP in ICU, automatically check if active staff drops below the mandatory 1:2 nurse-to-patient ratio.
3. Automated Relief Request:
   - Trigger automated notification to float-pool relief nurses when an LOP request creates a shift deficit.
4. Unit Testing:
   - Assert exact payroll deduction for 3 days LOP and verify triggering of ward staffing ratio safety warnings.""",
        "why_better": "Links payroll LOP deductions directly with clinical shift coverage minimums (mandatory ICU nurse-to-patient ratios)."
    },
    {
        "id": "Q012_Generate_Role_Based_Details",
        "doc_title": "Q012 Generate Role Based Details - Comparison",
        "tag": "Q012",
        "title": "Generate Role Based Details (HIPAA Role-Based Access Control & Navigation Metadata)",
        "before": "role ke hisab se details print kro switch case lga ke",
        "issue": "Insecure Hardcoding: Basic switch cases lack Spring Security integration, permissions arrays, and token claims synchronization.",
        "after": """Architect a Role-Based Clinical Authorization & UI Metadata Generator for CareConnect EHR:
1. Security & Compliance Context:
   - Generate granular permission sets and dashboard routes dynamically based on authenticated user roles: ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN, ROLE_PATIENT.
2. Metadata Specification:
   - DOCTOR: Permissions [READ_PATIENT, WRITE_SOAP_NOTE, ORDER_CPOE, PRESCRIBE_MED]; Route: /dashboard.
   - NURSE: Permissions [READ_PATIENT, RECORD_VITALS, VIEW_ORDERS, DISPENSE_MED]; Route: /patients.
   - ADMIN: Permissions [MANAGE_USERS, VIEW_AUDIT_LOGS, CONFIGURE_SYSTEM]; Route: /audit-trail.
   - PATIENT: Permissions [VIEW_OWN_RECORDS, VIEW_LAB_RESULTS]; Route: /patient-portal.
3. Clean Architecture:
   - Use Java 21 enhanced switch expressions returning immutable RoleMetadata records.
4. Unit Testing:
   - Assert correct permission payload and route allocation across all 4 system roles without privilege escalation.""",
        "why_better": "Replaces crude switch statements with production-grade Java 21 pattern-matched HIPAA role metadata and navigation guards."
    },
    {
        "id": "Q013_Raw_material_price_comparison",
        "doc_title": "Q013 Raw material price comparison - Comparison",
        "tag": "Q013",
        "title": "Raw Material Price Comparison (Pharmaceutical Active Ingredient Procurement & Quality Sourcing)",
        "before": "raw material ka price compare krke cheapest wala find kro",
        "issue": "Naive Minimum Price: Selecting solely based on lowest cost in healthcare risks procuring sub-potent, uncertified active pharmaceutical ingredients (APIs).",
        "after": """Develop a Multi-Criteria Pharmaceutical Raw Material & Active Ingredient Procurement Evaluator for CareConnect EHR:
1. Clinical Context:
   - Hospital compounding pharmacies source Active Pharmaceutical Ingredients (APIs, e.g., Amoxicillin trihydrate, Metformin HCl). Sourcing requires balancing cost with FDA cGMP certification and purity grade.
2. Weighted Score Algorithm:
   - Price Factor (35% weight): Normalized cost per kilogram.
   - Purity & Assay Grade (40% weight): Must be >= 99.0% USP/BP grade.
   - Delivery Reliability & Cold-Chain Compliance (25% weight): Punctuality and temperature logger compliance.
3. Supplier Selection:
   - Rank suppliers by Composite Quality Score; reject any supplier failing purity standards regardless of cheap price.
4. Unit Testing:
   - Assert rejection of lowest-cost vendor if purity grade is below 99% USP standard.""",
        "why_better": "Replaces naive lowest-price sorting with multi-criteria pharmaceutical procurement (purity grade, FDA cGMP compliance, cold-chain safety)."
    },
    {
        "id": "Q014_Shipping_Industry",
        "doc_title": "Q014 Shipping Industry - Comparison",
        "tag": "Q014",
        "title": "Shipping Industry (Biological Specimen & Temperature-Controlled Medical Logistics)",
        "before": "shipping cost calculate kro distance aur weight se",
        "issue": "Generic Freight Math: Fails to address cold-chain biohazard shipping, dry ice preservation, and regulatory diagnostic sample transport.",
        "after": """Architect a Clinical Laboratory Diagnostic Specimen & Cold-Chain Shipping Logistics engine for CareConnect EHR:
1. Clinical Context:
   - Calculate shipping logistics, transit time windows, and preservation requirements for biological blood samples, biopsies, and pathology specimens sent to reference laboratories.
2. Specimen Classification & Surcharges:
   - Category A (Infectious Substances): UN2814 certified biohazard packaging surcharge.
   - Temperature Requirements: Ambient (15-25°C), Refrigerated (2-8°C, gel packs), Frozen (< -20°C, dry ice sublimation allowance).
3. Critical Transit Window:
   - If transit time exceeds specimen viability threshold (e.g. CBC blood sample > 24 hours), flag as 'SPECIMEN_INTEGRITY_RISK'.
4. Unit Testing:
   - Verify calculation of cold-chain surcharges and flagging of expired viability transit routes.""",
        "why_better": "Converts generic shipping freight math into specialized diagnostic specimen logistics (UN2814 biohazard rules, dry ice, sample viability hours)."
    },
    {
        "id": "Q015_Mutilevel_Inheritance_Credit_Card",
        "doc_title": "Q015 Multilevel Inheritance Credit Card - Comparison",
        "tag": "Q015",
        "title": "Multilevel Inheritance – Credit Card (Healthcare Insurance Card & Multi-Tier Health Benefits)",
        "before": "multilevel inheritance use krke credit card ka program bnao class A extends B extends C",
        "issue": "Generic OOP Tutorial: Lacks enterprise domain value; credit card hierarchies fail to model healthcare copays, deductibles, and catastrophic coverage.",
        "after": """Implement a Multi-Tier Health Insurance Card & Benefit Deductible hierarchy using Multilevel Inheritance in Java 21:
1. Inheritance Hierarchy:
   - Level 1: 'HealthCard' (cardHolderName, policyNumber, groupNumber, effectiveDate).
   - Level 2: 'InsurancePolicy' extends HealthCard (annualDeductible, deductibleMet, copayPercentage).
   - Level 3: 'ComprehensiveCareCard' extends InsurancePolicy (prescriptionCoverageLimit, wellnessIncentiveCredits, emergencyOutofPocketMax).
2. Adjudication Methods:
   - processClaim(amount): Deducts against annual deductible first; once deductible met, applies copay percentage until out-of-pocket maximum is reached.
3. Clean Architecture:
   - Use BigDecimal for financial operations with strict immutability where appropriate.
4. Unit Testing:
   - Test claim progression across the 3-level inheritance hierarchy verifying deductible transition to copay phase.""",
        "why_better": "Transforms an abstract credit card tutorial into a domain-relevant 3-tier health insurance policy adjudication model (Card -> Policy -> Benefits)."
    },
    {
        "id": "Q016_Product_Payment_By_Overloading",
        "doc_title": "Q016 Product Payment By Overloading - Comparison",
        "tag": "Q016",
        "title": "Product Payment By Overloading (Hospital Patient Bill Settlement by Method Overloading)",
        "before": "payment method overloading bnao alag alag parameter leke",
        "issue": "Superficial Polymorphism: A toy print method with different arguments ignores split payments, insurance claims, and transaction receipts.",
        "after": """Implement a Hospital Billing & Multi-Channel Patient Settlement Service using Method Overloading in Java 21 for CareConnect EHR:
1. Clinical Billing Context:
   - Patients settle medical bills using diverse settlement avenues: self-pay cash/card, insurance claim copay, or employer health savings accounts (HSA/FSA).
2. Overloaded Method Signatures:
   - processPayment(BigDecimal amount, String cardToken): Direct card settlement for self-pay patients.
   - processPayment(BigDecimal amount, String insurancePolicyNo, BigDecimal copayAmount): Dual split settlement between insurance payer and patient.
   - processPayment(BigDecimal amount, String hsaAccountNumber, String employerCode, boolean isEligibleMedicalExpense): Tax-advantaged health savings account settlement.
3. Financial Integrity & Receipts:
   - Return an immutable PaymentReceipt record with unique transaction reference, timestamp, and audit trail hash.
4. Unit Testing:
   - Verify all 3 overloaded settlement methods produce valid receipts and maintain zero balance discrepancies.""",
        "why_better": "Applies method overloading to real-world healthcare billing (Credit Card vs Insurance Copay Split vs HSA/FSA account)."
    },
    {
        "id": "Q017_Vehicle_Computation_Details",
        "doc_title": "Q017 Vehicle Computation Details - Comparison",
        "tag": "Q017",
        "title": "Vehicle Computation Details (Emergency Ambulance Response Time & Speed Calculations)",
        "before": "vehicle speed aur distance compute krne ka code banao",
        "issue": "High School Physics Formula: Basic speed = distance / time lacks GPS telemetry, emergency sirens response latency, and golden-hour triage windows.",
        "after": """Develop an Emergency Ambulance Dispatch & 'Golden Hour' Response Telemetry computation service in CareConnect EHR:
1. Emergency Medical Context:
   - Calculate critical response metrics for ambulances dispatched to acute cardiac or trauma emergency incidents.
2. Computational Telemetry:
   - Estimated Time of Arrival (ETA): Compute real-time arrival taking into account distance, urban traffic speed profiles, and emergency siren right-of-way factor (-20% transit time).
   - Golden Hour Compliance Check: Evaluate if total dispatch-to-door time is under the critical 60-minute window for trauma care.
3. Safe Numerical Handling:
   - Guard against zero transit times (throw InvalidTelemetryException).
   - Return duration formatted cleanly in minutes and seconds with alert flags for delays.
4. Unit Testing:
   - Assert accurate ETA computation across clear road vs congested urban scenarios and verify Golden Hour threshold alarms.""",
        "why_better": "Elevates basic physics speed math into emergency ambulance dispatch telemetry with siren-assisted ETA and Golden Hour alerts."
    },
    {
        "id": "Q018_Product_Price_Exception",
        "doc_title": "Q018 Product Price Exception - Comparison",
        "tag": "Q018",
        "title": "Product Price Exception (Pharmaceutical Pricing Integrity & Zero-Cost Guard Exception)",
        "before": "custom exception bnao price negative hone par throw karo",
        "issue": "Toy Exception: Throwing an exception without error codes, HTTP status mapping, or regulatory audit logging in an API.",
        "after": """Architect a Clinical Formulary Pricing Validation & Custom Exception subsystem in CareConnect EHR:
1. Healthcare Compliance Context:
   - Medication and medical device prices must adhere to government price caps (e.g., DPCO/CMS fee schedules) and cannot be negative, zero, or exceed statutory ceiling rates.
2. Custom Exception Architecture:
   - Create 'InvalidPharmaceuticalPricingException' extending RuntimeException with fields: errorCode, medicationId, attemptedPrice, statutoryCeilingPrice, and timestamp.
3. Validation Pipeline:
   - If attemptedPrice <= 0 -> throw InvalidPharmaceuticalPricingException('ERR-PRICE-ZERO-NEGATIVE', 'Medication price must be greater than zero.').
   - If attemptedPrice > statutoryCeiling -> throw InvalidPharmaceuticalPricingException('ERR-PRICE-CEILING-BREACH', 'Price exceeds CMS ceiling cap.').
4. Spring Integration:
   - Map exception in @RestControllerAdvice to RFC 7807 ProblemDetail with HTTP 422 Unprocessable Entity.
5. Unit Testing:
   - Assert custom exception thrown on negative prices and statutory cap breaches with correct error codes.""",
        "why_better": "Transforms a basic custom exception into an enterprise pharmaceutical regulatory pricing validator mapped to RFC-7807 REST responses."
    },
    {
        "id": "Q019_Exceptional_Performance_Reward",
        "doc_title": "Q019 Exceptional Performance Reward - Comparison",
        "tag": "Q019",
        "title": "Exceptional Performance Reward (Clinical Excellence & Patient Safety Outcome Recognition)",
        "before": "best employee find krke reward calculate kro rating ke hisab se",
        "issue": "Commercial Rating Bias: Rating clinical healthcare staff on commercial volume compromises patient safety and invites gaming of metrics.",
        "after": """Implement a Clinical Excellence & Healthcare Quality Performance Recognition engine in CareConnect EHR:
1. Healthcare Governance Context:
   - Recognize outstanding medical staff (Physicians, Nursing teams) based on objective clinical quality metrics rather than revenue generation.
2. Evaluated Quality Dimensions:
   - Zero Hospital-Acquired Infections (HAI) rate in assigned ward (+30 points).
   - High Patient Satisfaction & Empathetic Communication score (+25 points).
   - 100% Timely Completion of SOAP Documentation & Electronic Signatures (+25 points).
   - Active participation in Morbidity & Mortality clinical peer review boards (+20 points).
3. Recognition Awards:
   - Score >= 90: 'Gold Award for Clinical Excellence'; Score 80-89: 'Silver Patient Safety Commendation'.
4. Unit Testing:
   - Assert correct ranking of clinical providers based on infection prevention and chart completion metrics.""",
        "why_better": "Shifts reward calculation from unethical commercial volume to patient safety metrics (zero infection rate, documentation compliance)."
    },
    {
        "id": "Q020_Contact_Details_Validation_Exception",
        "doc_title": "Q020 Contact Details Validation Exception - Comparison",
        "tag": "Q020",
        "title": "Contact Details Validation Exception (Emergency Contact & Guardian Telephony Validation)",
        "before": "phone number aur email validate krne ka exception bnao",
        "issue": "Shallow Regex: Fails international ITU E.164 telephony standards, emergency guardian relationship constraints, and HIPAA breach notifications.",
        "after": """Develop an Emergency Contact & Patient Telephony Validation subsystem with custom exceptions in CareConnect EHR:
1. Clinical Safety Context:
   - Every patient registered in an EHR must have a verified primary phone number and a designated Next-of-Kin Emergency Contact for urgent surgical consents and critical lab alerts.
2. Validation & Custom Exceptions:
   - Validate phone numbers against ITU E.164 international standard format (e.g. +1XXXXXXXXXX or +91XXXXXXXXXX).
   - Create 'InvalidContactDetailsException' with detailed field rejection reasons:
     - 'ERR-PHONE-INVALID': Malformed characters or invalid country digit lengths.
     - 'ERR-EMERGENCY-CONTACT-MISSING': Next-of-kin contact empty for pediatric (<18) or incapacitated patient.
3. REST Layer Binding:
   - Intercept via GlobalExceptionHandler to return clean HTTP 400 Bad Request with field-by-field validation error maps.
4. Unit Testing:
   - Assert custom exception thrown on invalid phone lengths, missing emergency guardian contacts, and malformed emails.""",
        "why_better": "Connects contact validation to critical patient safety (next-of-kin emergency contact, E.164 phone standard) with custom domain exceptions."
    }
]

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
doc_dir = r"C:\Users\91905\OneDrive\Desktop\HCL Project\document\Assessments_Q001_Q020"

for q in questions:
    page_html = f"""
<div class="page">
  <div class="header-bar">
    <div class="header-left">
      <span class="case-tag">{q["tag"]}</span>
      <span class="module-title">{q["title"]}</span>
    </div>
    <div class="page-num">CareConnect EHR Assessment</div>
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
