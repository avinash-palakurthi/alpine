from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

def generate_pdf(report: dict) -> bytes:

    buffer = io.BytesIO()
    doc    = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story  = []

    # Title
    story.append(Paragraph("AlpineScope — CBAM Compliance Report", styles["Title"]))
    story.append(Paragraph("Q1 2026 — EU Carbon Border Adjustment Mechanism", styles["Normal"]))
    story.append(Paragraph("Beta Version — ETS price static at €70.19/tCO2 (March 2026)", styles["Normal"]))
    story.append(Spacer(1, 0.5 * cm))

    # Summary
    story.append(Paragraph("Summary", styles["Heading2"]))

    total_rows   = report["total_rows"]
    cbam_covered = report["total_covered"]
    exposure     = round((cbam_covered / total_rows) * 100, 1) if total_rows > 0 else 0

    summary_data = [
        ["Total Imports",       str(report["total_rows"])],
        ["CBAM Covered",        str(report["total_covered"])],
        ["Not Covered",         str(report["total_not_covered"])],
        ["Total Emissions",     f"{report['total_emissions']} tCO2"],
        ["Total CBAM Cost",     f"€{report['total_cost']:,.2f}"],
        ["CBAM Exposure",       f"{exposure}%"],
        ["ETS Price Used",      "€70.19/tCO2 (static · March 2026)"],
    ]

    summary_table = Table(summary_data, colWidths=[8*cm, 8*cm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
        ("FONTNAME",   (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE",   (0, 0), (-1, -1), 10),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING",    (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.5 * cm))

    # Risk Summary
    story.append(Paragraph("Risk Summary", styles["Heading2"]))
    risk = report["risk_summary"]
    risk_data = [
        ["Risk Level",  "Count"],
        ["High Risk",   str(risk["high"])],
        ["Medium Risk", str(risk["medium"])],
        ["Low Risk",    str(risk["low"])],
    ]

    risk_table = Table(risk_data, colWidths=[8*cm, 8*cm])
    risk_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
        ("FONTNAME",   (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE",   (0, 0), (-1, -1), 10),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING",    (0, 0), (-1, -1), 6),
    ]))
    story.append(risk_table)
    story.append(Spacer(1, 0.5 * cm))

    # Cost by Category
    story.append(Paragraph("CBAM Cost by Category", styles["Heading2"]))
    cat_data = [["Category", "Estimated Cost (€)"]]
    for category, cost in report["category_costs"].items():
        cat_data.append([category, f"€{cost:,.2f}"])

    cat_table = Table(cat_data, colWidths=[12*cm, 5*cm])
    cat_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
        ("FONTNAME",   (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE",   (0, 0), (-1, -1), 10),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING",    (0, 0), (-1, -1), 6),
    ]))
    story.append(cat_table)
    story.append(Spacer(1, 0.5 * cm))

    # Results Table
    story.append(Paragraph("Classification Results", styles["Heading2"]))
    results_data = [["Product", "CN Code", "Country", "Volume", "Covered", "Cost (€)", "Risk"]]

    for r in report["results"]:
        results_data.append([
            str(r.get("product", ""))[:30],
            str(r.get("cn_code",  "")),
            str(r.get("country",  "")),
            str(r.get("volume",   "")),
            "Yes" if r.get("cbam_covered") else "No",
            f"€{r.get('estimated_cost', 0):,.2f}",
            str(r.get("risk_flag", "")).upper(),
        ])

    results_table = Table(
        results_data,
        colWidths=[4*cm, 2.5*cm, 2.5*cm, 2*cm, 2*cm, 2.5*cm, 1.5*cm]
    )
    results_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
        ("FONTNAME",   (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE",   (0, 0), (-1, -1), 8),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING",    (0, 0), (-1, -1), 4),
    ]))
    story.append(results_table)

    # Build
    doc.build(story)
    buffer.seek(0)
    return buffer.read()