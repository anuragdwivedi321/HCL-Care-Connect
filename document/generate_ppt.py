import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Ensure UI mockups are generated
try:
    import build_ui_frames
except Exception as e:
    print("Notice: build_ui_frames run:", e)

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Enterprise Brand Colors
    COLOR_PRIMARY = RGBColor(2, 132, 199)       # Sky Blue
    COLOR_NAVY = RGBColor(15, 23, 42)           # Slate 900
    COLOR_BG_CARD = RGBColor(248, 250, 252)     # Slate 50
    COLOR_CARD_BORDER = RGBColor(203, 213, 225) # Slate 300
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)      # Slate 900
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)  # Slate 500
    COLOR_GREEN = RGBColor(16, 185, 129)        # Emerald
    COLOR_RED = RGBColor(225, 29, 72)           # Rose Red
    COLOR_TEAL = RGBColor(13, 148, 136)         # Teal
    COLOR_WHITE = RGBColor(255, 255, 255)

    base_dir = r"c:\Users\91905\OneDrive\Desktop\HCL Project"
    mockup_dir = os.path.join(base_dir, "assets", "mockups")
    img_dashboard = os.path.join(mockup_dir, "dashboard_mockup.png")
    img_portal = os.path.join(mockup_dir, "portal_mockup.png")
    img_cpoe = os.path.join(mockup_dir, "cpoe_mockup.png")

    def add_header(slide, title, category="CARECONNECT ENTERPRISE EHR • PROJECT PRESENTATION"):
        # Top banner category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_PRIMARY

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_MAIN

        # Decorative dividing line
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_CARD_BORDER
        line.line.color.rgb = COLOR_CARD_BORDER

    def add_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        return card

    # =========================================================================
    # SLIDE 1: Premium Executive Cover Slide
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(11, 19, 38)
    bg1.line.fill.background()

    # Decorative Cyan Glow Shape Top-Right
    glow = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), 0, Inches(6.533), Inches(7.5))
    glow.fill.solid()
    glow.fill.fore_color.rgb = RGBColor(15, 27, 53)
    glow.line.fill.background()

    # LEFT COLUMN: Branding & System Highlights
    brand_pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.65), Inches(5.6), Inches(0.38))
    brand_pill.fill.solid()
    brand_pill.fill.fore_color.rgb = RGBColor(18, 38, 70)
    brand_pill.line.color.rgb = RGBColor(56, 189, 248)
    brand_pill.line.width = Pt(1.0)
    
    tb_pill = s1.shapes.add_textbox(Inches(0.9), Inches(0.68), Inches(5.4), Inches(0.35))
    p = tb_pill.text_frame.paragraphs[0]
    p.text = "⚕️  CARECONNECT HEALTHCARE IT • ENTERPRISE CLINICAL PLATFORM"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = RGBColor(56, 189, 248)

    # Giant Main Title
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(5.8), Inches(1.8))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    r1 = p.add_run()
    r1.text = "CareConnect "
    r1.font.size = Pt(44)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_WHITE
    r2 = p.add_run()
    r2.text = "EHR"
    r2.font.size = Pt(44)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(56, 189, 248)

    p2 = tf.add_paragraph()
    p2.text = "Next-Gen Clinical Healthcare Management & Telemetry System"
    p2.font.size = Pt(15)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(148, 163, 184)
    p2.space_before = Pt(4)

    # 4 High-Impact Feature Highlights
    feats_box = s1.shapes.add_textbox(Inches(0.8), Inches(3.0), Inches(5.8), Inches(2.2))
    tf_f = feats_box.text_frame
    tf_f.word_wrap = True
    
    cover_bullets = [
        ("⚡ Real-Time CPOE Diagnostics:", " LOINC-coded lab & imaging requisitions with STAT priority queues."),
        ("🛡️ Drug Safety CDSS Engine:", " Automated drug-drug interaction & allergy contraindication safeguards."),
        ("📋 SOAP Clinical Encounters:", " Standardized medical history & cryptographically locked physician notes."),
        ("🏥 Patient Access Portal:", " Lifetime MRN self-service vitals, medication cards & lab results.")
    ]
    for i, (b_title, b_desc) in enumerate(cover_bullets):
        p_b = tf_f.paragraphs[0] if i == 0 else tf_f.add_paragraph()
        if i > 0:
            p_b.space_before = Pt(6)
        r1 = p_b.add_run()
        r1.text = b_title
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = RGBColor(226, 232, 240)
        r2 = p_b.add_run()
        r2.text = b_desc
        r2.font.size = Pt(11)
        r2.font.color.rgb = RGBColor(148, 163, 184)

    # Bottom Presenter & Project Card
    card_pres = add_card(s1, Inches(0.8), Inches(5.5), Inches(5.8), Inches(1.4), bg_color=RGBColor(18, 30, 54), border_color=RGBColor(38, 56, 89))
    tb_pres = s1.shapes.add_textbox(Inches(0.95), Inches(5.6), Inches(5.5), Inches(1.2))
    tf_pres = tb_pres.text_frame
    tf_pres.word_wrap = True
    
    p = tf_pres.paragraphs[0]
    p.text = "PROJECT METADATA & PRESENTATION DETAILS"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = RGBColor(56, 189, 248)

    p_p1 = tf_pres.add_paragraph()
    p_p1.space_before = Pt(3)
    p_p1.text = "• Lead Presenter: Priyank | Healthcare Informatics Lead"
    p_p1.font.size = Pt(11)
    p_p1.font.bold = True
    p_p1.font.color.rgb = COLOR_WHITE

    p_p2 = tf_pres.add_paragraph()
    p_p2.space_before = Pt(2)
    p_p2.text = "• Stack: Spring Boot 3 • Angular 17 • JWT • Relational H2 Persistent Storage"
    p_p2.font.size = Pt(10)
    p_p2.font.color.rgb = RGBColor(203, 213, 225)

    # RIGHT COLUMN: Integrated Mockup Window
    if os.path.exists(img_dashboard):
        s1.shapes.add_picture(img_dashboard, Inches(6.9), Inches(1.0), width=Inches(5.6))
    
    badge_bot = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(5.4), Inches(5.6), Inches(0.55))
    badge_bot.fill.solid()
    badge_bot.fill.fore_color.rgb = RGBColor(6, 78, 59)
    badge_bot.line.color.rgb = RGBColor(16, 185, 129)
    badge_bot.line.width = Pt(1.2)

    tb_bb = s1.shapes.add_textbox(Inches(7.0), Inches(5.45), Inches(5.4), Inches(0.45))
    p = tb_bb.text_frame.paragraphs[0]
    p.text = "🟢 LIVE HOSPITAL TELEMETRY STREAM ACTIVE • WARD CAPACITY: 74% • TAT: 96.8%"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = RGBColor(110, 231, 183)

    # =========================================================================
    # SLIDE 2: Clinical Problem Statement & Project Mission
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Executive Summary: The Healthcare Transformation Need")

    # Card 1: Traditional Hospital Pitfalls
    add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1))
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🚨 Traditional Healthcare Bottlenecks"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED

    points_trad = [
        ("Fragmented Paper Records:", " Illegible physician handwriting causes life-threatening medication administration errors."),
        ("Dangerous Drug Interactions:", " No automated checks when co-prescribing drugs like Warfarin and Aspirin (bleeding risk)."),
        ("Diagnostic Requisition Delays:", " Lost paper slips for lab/radiology increase Lab Turnaround Time (TAT) and patient length-of-stay."),
        ("Lack of Patient Transparency:", " Patients cannot review their vital histories, laboratory trends, or consult summaries remotely."),
        ("Absence of Audit Governance:", " Non-compliance with HIPAA standards for tracking who viewed or altered medical charts.")
    ]
    for bold_txt, norm_txt in points_trad:
        p = tf.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "• " + bold_txt
        r1.font.bold = True
        r1.font.size = Pt(12)
        r1.font.color.rgb = COLOR_TEXT_MAIN
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.size = Pt(12)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    # Card 2: CareConnect Mission & Breakthrough Solutions
    add_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1), bg_color=RGBColor(240, 249, 255), border_color=COLOR_PRIMARY)
    tb2 = s2.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.7))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "💡 CareConnect Digital Breakthroughs"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    points_sol = [
        ("End-to-End Paperless CPOE:", " Instant digital order routing with international LOINC diagnostic coding and STAT prioritization."),
        ("Automated Drug Safety CDSS:", " Real-time clinical decision engine scanning drug-drug interactions and allergies prior to signature."),
        ("Structured SOAP Encounters:", " Standardized clinical histories locked with digital clinician authentication."),
        ("Self-Service Patient Access:", " Direct patient empowerment with real-time vitals flowsheets, lab releases, and active Rx cards."),
        ("Full HIPAA Audit Readiness:", " Immutable audit trail capturing every chart view, order issuance, and clinician login with remote IP.")
    ]
    for bold_txt, norm_txt in points_sol:
        p = tf2.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "✓ " + bold_txt
        r1.font.bold = True
        r1.font.size = Pt(12)
        r1.font.color.rgb = COLOR_TEXT_MAIN
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.size = Pt(12)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 3: System Architecture & Technology Stack
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Enterprise Architecture: 4-Tier Scalable Clinical System")

    pillars = [
        ("🖥️ Frontend Layer", "Angular 17 Standalone", COLOR_PRIMARY, [
            "Component-driven reactive UI architecture",
            "Real-time autocomplete & patient filters",
            "Reactive state management via RxJS",
            "Responsive clinical workstations & tablets"
        ]),
        ("⚙️ Backend Core", "Spring Boot 3 (Java 17)", COLOR_TEAL, [
            "Modular RESTful micro-architecture",
            "Spring Data JPA transactional persistence",
            "Clinical Decision Support (CDSS) rules",
            "Strict DTO isolation preventing data leaks"
        ]),
        ("🔒 Identity & Access", "Spring Security 6 & JWT", COLOR_RED, [
            "HMAC-SHA256 encrypted Bearer token auth",
            "4-Tier RBAC: Doctor, Nurse, Admin, Patient",
            "Method-level `@PreAuthorize` guards",
            "HIPAA compliance audit trail logging"
        ]),
        ("💾 Persistence Engine", "File-Backed H2 Database", COLOR_GREEN, [
            "Persistent disk storage (zero data loss on refresh)",
            "Automated schema synchronization via Hibernate",
            "Pre-seeded mock patient cohorts & clinical rules",
            "Production-ready path to Oracle / PostgreSQL"
        ])
    ]

    col_w = Inches(2.78)
    for i, (title, sub, col, items) in enumerate(pillars):
        left_pos = Inches(0.8 + i * 2.98)
        add_card(s3, left_pos, Inches(1.8), col_w, Inches(5.1))
        
        # Color bar on top of card
        top_bar = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(1.8), col_w, Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = col
        top_bar.line.fill.background()

        tb_p = s3.shapes.add_textbox(left_pos + Inches(0.15), Inches(2.05), col_w - Inches(0.3), Inches(4.7))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True
        
        p = tf_p.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        p_sub = tf_p.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_TEXT_MUTED
        p_sub.space_before = Pt(2)
        
        for item in items:
            p_it = tf_p.add_paragraph()
            p_it.space_before = Pt(8)
            p_it.text = "• " + item
            p_it.font.size = Pt(11)
            p_it.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 4: Doctor Clinical Dashboard & Real-Time Telemetry
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Doctor Control Room: Clinical Queue & Real-Time Telemetry")

    # Left Column: Features & Telemetry
    add_card(s4, Inches(0.8), Inches(1.8), Inches(5.3), Inches(5.1))
    tb_d = s4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(4.9), Inches(4.7))
    tf_d = tb_d.text_frame
    tf_d.word_wrap = True
    
    p = tf_d.paragraphs[0]
    p.text = "🩺 Real-Time Operational Cockpit"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    dash_features = [
        ("Live Clinical Shift Monitor:", " Displays active duty shift (OPD Block B) with pulsing green live status indicator."),
        ("Live Ticking Digital Clock:", " Monospace real-time clock updating every second via Angular ChangeDetectorRef."),
        ("Hospital Bed Occupancy (74%):", " Live telemetry tracking available ward and intensive care unit capacities."),
        ("Lab Turnaround Time (96.8%):", " Performance metric measuring swiftness of diagnostic reporting from labs to doctors."),
        ("Drug Safety Guard Score (100%):", " Real-time clinical decision engine preventing concurrent contraindications."),
        ("Accelerated Action Shortcuts:", " One-click jump to Patient Directory, CPOE Labs, E-Prescribe, and SOAP Notes.")
    ]
    for bold_txt, norm_txt in dash_features:
        p = tf_d.add_paragraph()
        p.space_before = Pt(7)
        r1 = p.add_run()
        r1.text = "• " + bold_txt
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = COLOR_TEXT_MAIN
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.size = Pt(11)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    # Right Column: Framed Dashboard Mockup (Seamlessly Integrated)
    if os.path.exists(img_dashboard):
        s4.shapes.add_picture(img_dashboard, Inches(6.5), Inches(1.8), width=Inches(6.0))
    
    dash_pill = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.5), Inches(6.4), Inches(6.0), Inches(0.5))
    dash_pill.fill.solid()
    dash_pill.fill.fore_color.rgb = RGBColor(241, 245, 249)
    dash_pill.line.color.rgb = RGBColor(203, 213, 225)
    tb_dp = s4.shapes.add_textbox(Inches(6.6), Inches(6.45), Inches(5.8), Inches(0.4))
    p = tb_dp.text_frame.paragraphs[0]
    p.text = "🟢 Active Telemetry: Ward beds (74%), Lab TAT (96.8%), and real-time clock sync in Angular 17"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = RGBColor(51, 65, 85)

    # =========================================================================
    # SLIDE 5: CPOE & Diagnostic Reporting Lifecycle
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "CPOE: Computerized Provider Order Entry & Diagnostic Findings")

    # Left Column: Framed CPOE Modal Mockup
    if os.path.exists(img_cpoe):
        s5.shapes.add_picture(img_cpoe, Inches(0.8), Inches(1.8), width=Inches(4.9))

    # Right Column: Features
    add_card(s5, Inches(6.0), Inches(1.8), Inches(6.5), Inches(5.1))
    tb_c = s5.shapes.add_textbox(Inches(6.2), Inches(2.0), Inches(6.1), Inches(4.7))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    
    p = tf_c.paragraphs[0]
    p.text = "🔬 Paperless Diagnostic Lifecycle"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    cpoe_steps = [
        ("Standard LOINC Tagging:", " Every lab & imaging test uses international LOINC standards (e.g., 57698-3 for Lipid Panel, 36554-4 for Chest X-Ray)."),
        ("Triage Priority Routing:", " Support for ROUTINE, URGENT, and emergency STAT queues to accelerate critical lab samples."),
        ("Clinical Indication Mandate:", " Doctors specify diagnostic justifications (e.g. 'high fever and weakness evaluation')."),
        ("Result Findings & Reporting:", " Lab techs and radiologists record quantitative results and biological normal ranges."),
        ("⚠️ Red Flag (Abnormal) Triaging:", " One-click abnormal flag highlights critical results in red on doctor worklists and hospital telemetry.")
    ]
    for bold_txt, norm_txt in cpoe_steps:
        p = tf_c.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "✓ " + bold_txt
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = COLOR_TEXT_MAIN
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.size = Pt(11)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 6: E-Prescribing & Real-Time Drug Safety Engine
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Clinical Safety: E-Prescribing & Drug-Drug Interaction CDSS")

    # 3 Horizontal Cards
    card1 = add_card(s6, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.1))
    tb_rx1 = s6.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(3.3), Inches(4.7))
    tf1 = tb_rx1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "💊 E-Prescription Workflow"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    
    rx_points = [
        "Patient Autocomplete & Search with instant suggestion popups",
        "Dosage, Route (Oral, IV, Topical), Frequency, and Duration",
        "Pharmacy SIG Instructions ('Take 1 tablet daily after food')",
        "Prescription Refill tracking & status lifecycle (ACTIVE / DISCONTINUED)",
        "Hospital Formulary Quick-Fill chips for common drugs"
    ]
    for pt in rx_points:
        p = tf1.add_paragraph()
        p.space_before = Pt(8)
        p.text = "• " + pt
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN

    card2 = add_card(s6, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.1), bg_color=RGBColor(255, 241, 242), border_color=COLOR_RED)
    tb_rx2 = s6.shapes.add_textbox(Inches(5.0), Inches(2.0), Inches(3.3), Inches(4.7))
    tf2 = tb_rx2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "🛡️ Drug Interaction Engine"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED

    cdss_points = [
        "Real-Time Background Cross-Check before doctor authorization",
        "Severity Classification: HIGH, MODERATE, LOW clinical risk",
        "Mechanism Explanation (e.g. CYP2C19 inhibition)",
        "Clinical Override Protocol: Doctors must explicitly review & confirm risk",
        "High-Risk Pairs Guarded: Warfarin + Aspirin, Lisinopril + Spironolactone"
    ]
    for pt in cdss_points:
        p = tf2.add_paragraph()
        p.space_before = Pt(8)
        p.text = "⚠️ " + pt
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN

    card3 = add_card(s6, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.1))
    tb_rx3 = s6.shapes.add_textbox(Inches(9.0), Inches(2.0), Inches(3.3), Inches(4.7))
    tf3 = tb_rx3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "📋 SOAP Clinical Documentation"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    soap_points = [
        "Subjective (S): Patient history, symptoms, and chief complaint",
        "Objective (O): Physical exam, vitals flowsheet, and lab findings",
        "Assessment (A): Differential diagnosis & ICD-10 codification",
        "Plan (P): Medications, follow-up schedule, and patient counseling",
        "Cryptographic Digital Signatures locking notes upon completion"
    ]
    for pt in soap_points:
        p = tf3.add_paragraph()
        p.space_before = Pt(8)
        p.text = "✓ " + pt
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 7: Patient Health Access Portal (Self-Service)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Patient Empowerment: Self-Service Health Access Portal")

    # Left Column: Features
    add_card(s7, Inches(0.8), Inches(1.8), Inches(5.5), Inches(5.1))
    tb_pt = s7.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.1), Inches(4.7))
    tf_pt = tb_pt.text_frame
    tf_pt.word_wrap = True
    
    p = tf_pt.paragraphs[0]
    p.text = "🧑 Direct Patient Engagement"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    portal_features = [
        ("Unique Medical Record (MRN):", " Automated generation of lifetime identifier (e.g. MRN-7061 for Anurag Dwivedi)."),
        ("Personal Vitals Flowsheet:", " Patients track historical trends of Blood Pressure, Heart Rate, SpO2, and WHO BMI status."),
        ("Diagnostic Lab Results Access:", " Complete visibility into completed blood panels and radiology impressions."),
        ("Pharmacy Medication Cards:", " Clear dosage, frequency, and instructions to ensure medication adherence."),
        ("Visit Consult Summaries:", " Patients can review attending doctor advice from any internet-connected device."),
        ("Clinician Preview Switcher:", " Doctors and nurses can preview how records appear to any patient.")
    ]
    for bold_txt, norm_txt in portal_features:
        p = tf_pt.add_paragraph()
        p.space_before = Pt(7)
        r1 = p.add_run()
        r1.text = "• " + bold_txt
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = COLOR_TEXT_MAIN
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.size = Pt(11)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    # Right Column: Framed Patient Portal Mockup + 2 Highlight Cards (Zero Overflow!)
    if os.path.exists(img_portal):
        s7.shapes.add_picture(img_portal, Inches(6.7), Inches(1.8), width=Inches(5.8))
    
    # 2 Polished Highlight Feature Cards underneath Mockup
    card_sub1 = add_card(s7, Inches(6.7), Inches(5.15), Inches(2.8), Inches(1.75), bg_color=RGBColor(240, 249, 255), border_color=COLOR_PRIMARY)
    tb_s1 = s7.shapes.add_textbox(Inches(6.8), Inches(5.2), Inches(2.6), Inches(1.6))
    tf_s1 = tb_s1.text_frame
    tf_s1.word_wrap = True
    p = tf_s1.paragraphs[0]
    p.text = "📊 Vitals Telemetry"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p_sub1 = tf_s1.add_paragraph()
    p_sub1.space_before = Pt(3)
    p_sub1.text = "Real-time tracking for Blood Pressure, Heart Rate, SpO2 & BMI recorded during triage."
    p_sub1.font.size = Pt(9.5)
    p_sub1.font.color.rgb = COLOR_TEXT_MUTED

    card_sub2 = add_card(s7, Inches(9.7), Inches(5.15), Inches(2.8), Inches(1.75), bg_color=RGBColor(240, 253, 244), border_color=COLOR_GREEN)
    tb_s2 = s7.shapes.add_textbox(Inches(9.8), Inches(5.2), Inches(2.6), Inches(1.6))
    tf_s2 = tb_s2.text_frame
    tf_s2.word_wrap = True
    p = tf_s2.paragraphs[0]
    p.text = "💊 Active Prescriptions"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GREEN
    p_sub2 = tf_s2.add_paragraph()
    p_sub2.space_before = Pt(3)
    p_sub2.text = "Instant access to verified doctor consults, medications, dosages & LOINC lab reports."
    p_sub2.font.size = Pt(9.5)
    p_sub2.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 8: Governance, HIPAA Compliance & Strategic Roadmap
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Regulatory Governance, Audit Trail & Future Horizon")

    # Left Box: HIPAA Compliance
    add_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1))
    tb_sec = s8.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.7))
    tf_sec = tb_sec.text_frame
    tf_sec.word_wrap = True
    p = tf_sec.paragraphs[0]
    p.text = "🔒 Security & Regulatory Compliance"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    hipaa_items = [
        ("Granular Role Separation (RBAC):", " Doctors have prescribing privileges; Nurses manage triage and vitals; Patients have read-only access to their charts."),
        ("Immutable Audit Trail:", " Every chart view, order creation, and diagnosis entry records timestamp, user, action, and remote IP address."),
        ("Data Loss Prevention:", " Relational file-backed database ensures persistent operational durability during server restarts."),
        ("Data Minimization:", " Endpoints expose only required DTO schemas to prevent accidental data leaks.")
    ]
    for b_txt, n_txt in hipaa_items:
        p = tf_sec.add_paragraph()
        p.space_before = Pt(10)
        r1 = p.add_run()
        r1.text = "✓ " + b_txt
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = COLOR_TEXT_MAIN
        r2 = p.add_run()
        r2.text = n_txt
        r2.font.size = Pt(11)
        r2.font.color.rgb = COLOR_TEXT_MUTED

    # Right Box: Future Roadmap
    add_card(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1), bg_color=RGBColor(240, 253, 244), border_color=COLOR_GREEN)
    tb_fut = s8.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.7))
    tf_fut = tb_fut.text_frame
    tf_fut.word_wrap = True
    p = tf_fut.paragraphs[0]
    p.text = "🚀 Future Strategic Roadmap"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_GREEN

    future_items = [
        ("HL7 / FHIR Interoperability:", " RESTful FHIR R4 standard export for seamless health data sharing between hospitals."),
        ("AI-Powered Clinical Scribe:", " Ambient voice-to-text generating automated draft SOAP notes during consultations."),
        ("Telehealth WebRTC Consultations:", " Integrated encrypted video calling directly inside the patient portal."),
        ("Predictive Sepsis & ICU Triage:", " Machine learning early warning scores (NEWS2) derived from real-time vitals flowsheets."),
        ("Smart Pharmacy Dispense Integration:", " Barcode Medication Administration (BCMA) scanning verification at bedside.")
    ]
    for b_txt, n_txt in future_items:
        p = tf_fut.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "★ " + b_txt
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = COLOR_GREEN
        r2 = p.add_run()
        r2.text = n_txt
        r2.font.size = Pt(11)
        r2.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 9: Cinematic Aesthetic Thank You Slide (Zero Extra Text)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    
    # Full-Bleed 16:9 3D Neon Glassmorphism Cinematic Background
    img_thank_you = os.path.join(base_dir, "assets", "thank_you_bg.jpg")
    if os.path.exists(img_thank_you):
        s9.shapes.add_picture(img_thank_you, 0, 0, width=Inches(13.333), height=Inches(7.5))
    else:
        bg9 = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg9.fill.solid()
        bg9.fill.fore_color.rgb = RGBColor(11, 19, 38)
        bg9.line.fill.background()

    # Pure, Elegant, Centered Two-Tone "Thank You." (Zero Extra Text)
    tb_ty = s9.shapes.add_textbox(Inches(1.5), Inches(2.7), Inches(10.333), Inches(2.0))
    tf_ty = tb_ty.text_frame
    tf_ty.word_wrap = True
    p = tf_ty.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r1 = p.add_run()
    r1.text = "Thank "
    r1.font.size = Pt(72)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_WHITE
    r2 = p.add_run()
    r2.text = "You."
    r2.font.size = Pt(72)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(56, 189, 248)

    # Save Presentation
    output_path = r"c:\Users\91905\OneDrive\Desktop\HCL Project\CareConnect_EHR_Master_V3.pptx"
    try:
        prs.save(output_path)
        print("SUCCESS: Master V3 saved at:", output_path)
    except Exception as e:
        print("Failed to save to master v3:", e)

    # Also save to CareConnect_EHR_Presentation_V2.pptx
    try:
        v2_path = r"c:\Users\91905\OneDrive\Desktop\HCL Project\CareConnect_EHR_Presentation_V2.pptx"
        prs.save(v2_path)
        print("SUCCESS: Fresh Aesthetic 9-Slide Deck saved at:", v2_path)
    except Exception as e:
        print("Failed to save v2 deck:", e)

    # Also save to CareConnect_EHR_Clean.pptx so user has an unlocked fresh copy
    try:
        clean_path = r"c:\Users\91905\OneDrive\Desktop\HCL Project\CareConnect_EHR_Clean.pptx"
        prs.save(clean_path)
        print("SUCCESS: Fresh Clean 9-Slide Deck saved at:", clean_path)
    except Exception as e:
        print("Failed to save clean deck:", e)

    # Also save to CareConnect_EHR_Complete_Deck.pptx as a guaranteed fresh file
    try:
        deck_path = r"c:\Users\91905\OneDrive\Desktop\HCL Project\CareConnect_EHR_Complete_Deck.pptx"
        prs.save(deck_path)
        print("SUCCESS: Fresh 9-Slide Deck saved at:", deck_path)
    except Exception as e:
        print("Failed to save complete deck:", e)

    # Also save to CareConnect_EHR_Final.pptx so user has an unlocked fresh copy
    try:
        final_path = r"c:\Users\91905\OneDrive\Desktop\HCL Project\CareConnect_EHR_Final.pptx"
        prs.save(final_path)
        print("SUCCESS: Fresh copy saved at:", final_path)
    except Exception as e:
        print("Failed to save final:", e)

    # Also try to overwrite original if unlocked
    try:
        prs.save(r"c:\Users\91905\OneDrive\Desktop\HCL Project\CareConnect_EHR_Presentation.pptx")
        print("SUCCESS: Original presentation updated too!")
    except Exception:
        print("Note: Original file was locked in PowerPoint; Master file saved successfully.")

if __name__ == "__main__":
    create_presentation()
