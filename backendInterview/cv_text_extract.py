import fitz 
print(dir(fitz.__init__))
class CVTextExtractor:
    def extract_text(self, cv_path):
        text = ""
        with fitz.open(cv_path) as doc:
            for page in doc:
                text += page.get_text()
        return text

#cv=CVTextExtractor()
#cv_path=r"C:\Users\prabh\Downloads\CVfinal_240726_181224.pdf"
#print(cv.extract_text(cv_path))