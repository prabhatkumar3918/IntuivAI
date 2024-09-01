import cohere
from cv_text_extract import CVTextExtractor
# Cohere API key
cohere_api_key = "MvISiDVtjUD1qkhxysW3bYVLwbCwOnnlUcZDXynD"
co = cohere.Client(cohere_api_key)

def extract_skills_using_llm(job_description,total_time):
    # Prompt the LLM to extract important skills from the job description
    prompt = f"Suppose your a an interviewer who is interviewing a candidate based on his cv and you are given a task to distribute given total time:{total_time} for various skills mentioned in job description:{job_description} you would spend to hire a candidate.DONT CONSIDER YOURSELF AS HR.ALSO SUM OF TIME OF INTERVIEW SHOULD NOT CROSS total_time of interview given. Skills and time you would spend on that in a interview (in a dictionary format with skills as keys and time you would spend):"
    
    response = co.generate(
        model='command-r-plus',  # Use a model appropriate for your use case
        prompt=prompt,
        max_tokens=150,
        temperature=0.3
    )

    # Extract the text from the response
    response_text = response.generations[0].text.strip()
    print(response_text)


def process_job_description(cv_path, total_time):
    # Extract text from the job description PDF
    cv_extractor = CVTextExtractor()
    job_description = cv_extractor.extract_text(cv_path)
    skills = extract_skills_using_llm(job_description,total_time)

if __name__ == '__main__':
    cv_path = r"C:\Users\prabh\Downloads\Jd4.pdf" 
    total_time = 30 
    time_distribution = process_job_description(cv_path, total_time)
    print("Time Distribution for Interview:")
