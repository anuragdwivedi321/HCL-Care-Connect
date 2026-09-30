import os
from PIL import Image, ImageDraw, ImageFont

def create_window_mockup(
    raw_img_path,
    crop_box,
    output_path,
    title="CareConnect Enterprise EHR",
    subtitle="https://careconnect.hospital/portal",
    status="● LIVE ACTIVE",
    footer_text="✓ HL7/FHIR Compliant • 256-Bit TLS Encryption • HIPAA Audited",
    target_width=1200
):
    # 1. Open and crop raw image
    im = Image.open(raw_img_path)
    if crop_box:
        im = im.crop(crop_box)
    
    # Resize UI to target width while keeping aspect ratio
    aspect = im.height / im.width
    ui_w = target_width - 32  # 16px padding on left and right
    ui_h = int(ui_w * aspect)
    im_resized = im.resize((ui_w, ui_h), Image.Resampling.LANCZOS)
    
    # Header & Footer heights
    header_h = 44
    footer_h = 36
    total_w = target_width
    total_h = header_h + ui_h + footer_h + 16 # 8px top/bottom padding for UI
    
    # 2. Create base canvas with transparency (RGBA)
    canvas = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Outer rounded rectangle (Frame background: Dark Slate Navy #0f172a)
    bg_color = (15, 23, 42, 255)
    border_color = (51, 65, 85, 255)
    radius = 18
    
    draw.rounded_rectangle(
        [(0, 0), (total_w - 1, total_h - 1)],
        radius=radius,
        fill=bg_color,
        outline=border_color,
        width=2
    )
    
    # 3. Draw Header
    # Window controls: Red, Yellow, Green dots
    dot_y = header_h // 2
    draw.ellipse([(20, dot_y - 6), (32, dot_y + 6)], fill=(239, 68, 68, 255))   # Red
    draw.ellipse([(40, dot_y - 6), (52, dot_y + 6)], fill=(245, 158, 11, 255))  # Yellow
    draw.ellipse([(60, dot_y - 6), (72, dot_y + 6)], fill=(16, 185, 129, 255))  # Green
    
    # URL / Title Pill in center
    pill_w = 460
    pill_x1 = (total_w - pill_w) // 2
    pill_x2 = pill_x1 + pill_w
    draw.rounded_rectangle(
        [(pill_x1, 8), (pill_x2, header_h - 8)],
        radius=8,
        fill=(30, 41, 59, 255),
        outline=(51, 65, 85, 255),
        width=1
    )
    
    # Try loading a system font, fallback to default
    try:
        font_title = ImageFont.truetype("arial.ttf", 13)
        font_sub = ImageFont.truetype("arialbd.ttf", 12)
        font_status = ImageFont.truetype("arialbd.ttf", 11)
        font_footer = ImageFont.truetype("arial.ttf", 11)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = font_title
        font_status = font_title
        font_footer = font_title

    # Draw URL pill text
    url_text = f"🔒  {subtitle}"
    draw.text((pill_x1 + 16, 14), url_text, fill=(148, 163, 184, 255), font=font_title)
    
    # Right-aligned status pill
    status_w = 110
    stat_x1 = total_w - status_w - 20
    draw.rounded_rectangle(
        [(stat_x1, 10), (stat_x1 + status_w, header_h - 10)],
        radius=6,
        fill=(6, 78, 59, 255),
        outline=(16, 185, 129, 255),
        width=1
    )
    draw.text((stat_x1 + 10, 15), status, fill=(52, 211, 153, 255), font=font_status)
    
    # Header bottom divider
    draw.line([(0, header_h), (total_w, header_h)], fill=(30, 41, 59, 255), width=1)
    
    # 4. Paste Cropped Application UI
    ui_x = 16
    ui_y = header_h + 8
    
    # Round corners on the UI image
    mask = Image.new("L", (ui_w, ui_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (ui_w, ui_h)], radius=10, fill=255)
    
    if im_resized.mode != "RGBA":
        im_resized = im_resized.convert("RGBA")
    
    canvas.paste(im_resized, (ui_x, ui_y), mask=mask)
    
    # Inner border around UI
    draw.rounded_rectangle(
        [(ui_x, ui_y), (ui_x + ui_w, ui_y + ui_h)],
        radius=10,
        outline=(51, 65, 85, 255),
        width=1
    )
    
    # 5. Draw Footer
    foot_y = header_h + ui_h + 16
    draw.line([(0, foot_y), (total_w, foot_y)], fill=(30, 41, 59, 255), width=1)
    draw.text((20, foot_y + 11), footer_text, fill=(100, 116, 139, 255), font=font_footer)
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    canvas.save(output_path, "PNG")
    print(f"Mockup generated: {output_path} ({total_w}x{total_h})")
    return output_path

if __name__ == "__main__":
    img_dir = r"c:\Users\91905\.gemini\antigravity\brain\9987dd71-e717-4ca9-b551-40cd92e7d342\.user_uploaded"
    out_dir = r"c:\Users\91905\OneDrive\Desktop\HCL Project\assets\mockups"
    os.makedirs(out_dir, exist_ok=True)
    
    # 1. Patient Portal (media_1790798209624.png)
    # Crop out top browser tabs (0..60) and bottom Windows taskbar (540..576)
    create_window_mockup(
        raw_img_path=os.path.join(img_dir, "media_1790798209624.png"),
        crop_box=(0, 60, 1024, 540),
        output_path=os.path.join(out_dir, "portal_mockup.png"),
        title="CareConnect Patient Portal",
        subtitle="careconnect.health/portal/patient?mrn=7061",
        status="● VERIFIED MRN",
        footer_text="✓ Patient: Anurag Dwivedi (MRN-7061) • HIPAA Patient Access • Encrypted TLS 1.3",
        target_width=1200
    )

    # 2. Doctor Dashboard (media_1790795936850.png)
    # Crop out bottom Windows taskbar (708..758)
    create_window_mockup(
        raw_img_path=os.path.join(img_dir, "media_1790795936850.png"),
        crop_box=(0, 0, 1024, 708),
        output_path=os.path.join(out_dir, "dashboard_mockup.png"),
        title="CareConnect Clinical Dashboard",
        subtitle="careconnect.health/doctor/telemetry",
        status="● LIVE SHIFT",
        footer_text="✓ OPD Block B • Bed Capacity: 74% • Lab TAT: 96.8% • CDSS Engine: Active",
        target_width=1200
    )

    # 3. CPOE Order Entry (media_1790795143721.png)
    # Crop out bottom edge artifact (0..788)
    create_window_mockup(
        raw_img_path=os.path.join(img_dir, "media_1790795143721.png"),
        crop_box=(0, 0, 815, 788),
        output_path=os.path.join(out_dir, "cpoe_mockup.png"),
        title="CareConnect CPOE Order Entry",
        subtitle="careconnect.health/cpoe/requisition-entry",
        status="● CPOE ACTIVE",
        footer_text="✓ LOINC Codification • Triage: STAT / URGENT • Red Flag Critical Findings Alerting",
        target_width=1000
    )
