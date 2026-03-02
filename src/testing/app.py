# Block 1/1
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

# Create PDF
pdf_file = "T-henod_invoice.pdf"
doc = SimpleDocTemplate(pdf_file, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=60, bottomMargin=40)
elements = []

styles = getSampleStyleSheet()
styleN = styles["Normal"]
styleH = styles["Heading1"]

# Header
elements.append(Paragraph("INVOICE", styleH))
elements.append(Spacer(1, 12))
elements.append(Paragraph("Invoice To: T-henod", styleN))
elements.append(Paragraph("Date: 02/03/2026", styleN))
elements.append(Paragraph("Project: Shopify Edits", styleN))
elements.append(Paragraph("Hourly Rate: $20", styleN))
elements.append(Spacer(1, 12))

# Table data without Rate column
tasks = [
    ["Task", "Hours", "Total ($)"],
    ["Removing the buttons of the currency (countries)", 0.5, 10],
    ["Adding the stars inside Shopify CSS + JavaScript", 1, 20],
    ["Editing the colors on the + and - button", 0.5, 10],
    ["Glowing effect on homepage heading below images", 0.5, 10],
    ["Gradient cancellation on single product, on more items section", 0.5, 10],
    ["Adding gradient on buttons instead of solid colors", 1.5, 30],
]

# Set column widths (wider Task column)
col_widths = [400, 60, 60]

table = Table(tasks, colWidths=col_widths)
table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.grey),
    ('TEXTCOLOR',(0,0),(-1,0),colors.whitesmoke),
    ('ALIGN',(1,1),(-1,-1),'CENTER'),  # Center Hours and Total
    ('ALIGN',(0,1),(0,-1),'LEFT'),     # Left-align Task column
    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ('GRID', (0,0), (-1,-1), 1, colors.black),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',(0,0),(-1,-1),10),
]))

elements.append(table)
elements.append(Spacer(1, 12))

# Totals
elements.append(Paragraph("Total Hours: 5", styleN))
elements.append(Paragraph("Subtotal: $90", styleN))
elements.append(Paragraph("Tax: $0", styleN))
elements.append(Paragraph("Total Due: $90", styleN))
elements.append(Spacer(1, 12))
elements.append(Paragraph("Payment Terms: Due on receipt", styleN))

# Build PDF
doc.build(elements)
print(f"PDF generated: {pdf_file}")