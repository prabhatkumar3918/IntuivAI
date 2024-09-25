import fitz  # PyMuPDF
import re

def extract_sections(pdf_path):
    # Open the PDF
    doc = fitz.open(pdf_path)
    text = ""

    # Extract text from all pages
    for page in doc:
        text += page.get_text()

    # Close the document
    doc.close()

    # Define patterns for identifying section headings, assuming headings are often uppercase or title-cased
    section_pattern = r"(?P<section>^[A-Z][A-Z ]+|^[A-Z][a-z]+(?: [A-Z][a-z]+)*)\n"
    matches = list(re.finditer(section_pattern, text, re.MULTILINE))

    sections = {}

    # Iterate over matches to extract content between headings
    for i, match in enumerate(matches):
        section = match.group('section').strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        content = text[start:end].strip()
        sections[section] = content

    return sections


# Usage
#"C:\Users\prabh\Downloads\PrabhatKumar_Resume.pdf"
#"C:\Users\prabh\Downloads\Manya_MittalResume.pdf"
#"C:\Users\prabh\Downloads\CV_Ashraf Alam.pdf"
pdf_path = r"C:\Users\prabh\Downloads\CVfinal.pdf"
sections = extract_sections(pdf_path)

# Print extracted sections
for section, content in sections.items():
    print(f"Section: {section}\nContent:\n{content}\n")