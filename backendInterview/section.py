from langchain.prompts import PromptTemplate
from langchain_cohere.llms import Cohere
from cv_text_extract import CVTextExtractor

class LLMExtractor:
    def __init__(self, api_key, temperature=0.1):
        self.llm = Cohere(cohere_api_key=api_key, temperature=temperature)
        
    def extract_relevant_content(self, cv_text, question):
        #chain-of-thought prompt template
        template = """
        You are an expert CV analyzer. Given the following CV content and a specific question,
        your task is to extract the most relevant section from the CV that best addresses the question.

        First, carefully read and understand the question. Then, analyze the CV content to identify key sections 
        that might be relevant. Finally, pick and extract the single section that is most directly related 
        to the question. Ensure that you extract only the relevant section and do not add any extra text or 
        commentary from your end.

        CV Content:
        {cv_text}
        
        Question:
        {question}
        
        Step-by-Step Reasoning:
        1. Carefully read and understand the question.
        2. Identify the important aspect of the question.
        3. Review the CV content for sections that match these key points.
        4. Extract the most relevant section that best addresses the question.
        5. Do not add anything extra. Extract only the relevant section.

        Extracted Relevant Section:
        """
        
        # Create the prompt with the CV text and the question
        prompt = PromptTemplate(template=template)
        prompt_text = prompt.format(cv_text=cv_text, question=question)
        
        # Use the LLM to get the response
        response = self.llm(prompt_text)
        
        return response

if __name__ == "__main__":
    cv_extractor = CVTextExtractor()
    cv_path = r"C:\Users\prabh\Downloads\CVfinal_240726_181224.pdf"
    cv_text = cv_extractor.extract_text(cv_path)

    # question
    question = '''Your fake news detection project achieved a high accuracy rate. Could you elaborate on the techniques you used, 
    particularly how the Bi-directional LSTM with GloVe embeddings contributed to the model’s performance?'''

    llm_extractor = LLMExtractor(api_key="MvISiDVtjUD1qkhxysW3bYVLwbCwOnnlUcZDXynD", temperature=0.1)
    relevant_content = llm_extractor.extract_relevant_content(cv_text=cv_text, question=question)
    print("Relevant Content:")
    print(relevant_content)
