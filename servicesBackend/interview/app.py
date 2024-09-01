from tts import TextToSpeech
from vtt import VoiceToText
from cv_text_extract import CVTextExtractor
from llm import LLMProcessor

class InterviewApp:
    def __init__(self, cohere_api_key):
        self.text_to_speech = TextToSpeech()
        self.voice_to_text = VoiceToText()
        self.cv_extractor = CVTextExtractor()
        self.llm_processor = LLMProcessor()
        self.llm_processor.initialize_llm(cohere_api_key)

    def run_interview(self, user_id, cv_path, job_description):
        # Extract text from CV
        cv_text = self.cv_extractor.extract_text(cv_path)
        
        # Setup the conversation chain with CV text and job description
        self.llm_processor.setup_conversation_chain(cv_text, job_description)

        print("Starting the interview...\n")
        # Start the interview and get the initial greeting or question
        first_question = self.llm_processor.ask_question("Please begin the interview.")
        self.text_to_speech.speak_text(first_question)
        print("LLM:", first_question)

        while True:
            # Convert user response to text
            user_response = self.voice_to_text.recognize_speech()
            print("User Response:", user_response)

            # Check for exit commands
            if user_response.lower() in ['end', 'exit']:
                print(f"Ending interview session for user {user_id}.")
                break

            # Generate the next question based on the user's response
            next_question = self.llm_processor.ask_question(user_response)
            self.text_to_speech.speak_text(next_question)
            print("LLM:", next_question)

if __name__ == "__main__":
    cohere_api_key = "MvISiDVtjUD1qkhxysW3bYVLwbCwOnnlUcZDXynD"
    app = InterviewApp(cohere_api_key)
    
    user_id = "user123"
    cv_path = r"C:\Users\prabh\Downloads\CVfinal_240726_181224.pdf"
    job_description = '''Need a candidate who is good at machine learning and Artificial Intelligence. Has good coding skills.'''
    
    app.run_interview(user_id, cv_path, job_description)
