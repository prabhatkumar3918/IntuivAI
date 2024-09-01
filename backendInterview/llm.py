import redis
import pyttsx3
import speech_recognition as sr
from langchain_cohere.llms import Cohere
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts.prompt import PromptTemplate
import uuid
import json

class LLMProcessor:
    def __init__(self, redis_host='localhost', redis_port=6379):
        self.llm = None
        self.conversation_chain = None
        self.max_tokens = 100
        self.temperature = 0.2
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)
        self.tts_engine = pyttsx3.init()
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()

    def start_user_session(self, user_id):
        # Generate a unique session_id for the user session
        session_id = f"{user_id}"
        return session_id

    
    def initialize_llm(self, cohere_api_key, n, num_questions, cv_text, job_description, session_id):
        # Initialize Cohere with the API key
        self.llm = Cohere(cohere_api_key=cohere_api_key, temperature=self.temperature, max_tokens=self.max_tokens)
        print("Initialized Cohere LLM.")

        # Generate the list of questions and store in Redis
        self.setup_conversation_chain(cv_text, job_description)
        session_id = self.generate_questions(n, num_questions, session_id)
    
    def setup_conversation_chain(self, cv_text, job_description):
        # Define the chain-of-thought interview instruction template
        template = f"""
        You are an interviewer conducting an interview based on the provided CV and job description.
        Follow these steps to ask questions:
        1. Analyze the CV and job description provided below to understand the context.
        2. Formulate a question that is relevant to the CV and job description.
        3. Ask the question in a clear and concise manner.
        4. Wait for the interviewee's response.
        5. Adapt your next question based on the interviewee's response and the context of the CV and job description.

        Current CV:
        {cv_text}

        Job Description:
        {job_description}

        Current conversation:
        {{history}}
        
        Interviewee's response: {{input}}

        Your next question (only the question, no additional text or remarks):
        """

        # Setup the prompt template
        PROMPT = PromptTemplate(input_variables=["history", "input"], template=template)
        
        # Initialize the conversation chain with the prompt and LLM
        self.conversation_chain = ConversationChain(
            prompt=PROMPT,
            llm=self.llm,
            verbose=True,
            memory=ConversationBufferMemory(ai_prefix="Interviewer"),
        )

    def generate_questions(self, n, num_questions, user_id):
        # Start a session for the user
        session_id = self.start_user_session(user_id)

        # Generate a single access token for the session
        session_access_token = str(uuid.uuid4())

        # Calculate the number of technical and non-technical questions
        num_technical = int(num_questions * (n / 100))
        num_non_technical = num_questions - num_technical

        print("Generating questions...\n")
        
        # Combine the prompts for generating technical and non-technical questions
        technical_prompt = f"Generate {num_technical} different technical questions based on the CV and job description."
        non_technical_prompt = f"Generate {num_non_technical} different non-technical questions based on the CV and job description."

        # Call the LLM once for each category
        technical_questions_response = self.ask_question(technical_prompt)
        non_technical_questions_response = self.ask_question(non_technical_prompt)

        # Split the responses into individual questions
        technical_questions = technical_questions_response.split('\n')
        non_technical_questions = non_technical_questions_response.split('\n')

        # Prepare the list of questions with the session access token
        questions_list = [
            {"access_token": session_access_token, "question": question.strip(), "type": "Technical"}
            for question in technical_questions if question.strip()
        ]

        questions_list.extend([
            {"access_token": session_access_token, "question": question.strip(), "type": "Non-Technical"}
            for question in non_technical_questions if question.strip()
        ])

        # Store questions in Redis using the unique session ID
        self.redis_client.set(session_id, json.dumps(questions_list))
        print(f"Stored {num_technical} technical and {num_non_technical} non-technical questions in Redis.\n")
        print(f"Session ID: {session_id}\n")
        print(f"questions list: {questions_list}\n")
        return session_id


    def ask_question(self, user_input):
        # Provide the user's response to the conversation chain and get the next question
        response = self.conversation_chain.run(user_input)
        return response

    def speak_text(self, text):
        # Use TTS to speak the text
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()

    def listen_for_response(self):
        with self.microphone as source:
            # Adjust the energy threshold based on the ambient noise level
            self.recognizer.adjust_for_ambient_noise(source)
            print("Listening for response...")

            # Listen with a timeout and a phrase time limit to avoid infinite listening
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            except sr.WaitTimeoutError:
                print("No speech detected within the timeout period")
                return None

        try:
            # Recognize the speech using Google Web Speech API
            response = self.recognizer.recognize_google(audio)
            print(f"Recognized Response: {response}")
            return response
        except sr.UnknownValueError:
            print("Could not understand the audio")
            return None
        except sr.RequestError:
            print("Could not request results from Google Speech Recognition service")
            return None

    def conduct_interview(self, session_id):
        print("Starting the interview...\n")

        # Retrieve questions from Redis using session ID
        questions_list = json.loads(self.redis_client.get(session_id))
        
        for idx, question_data in enumerate(questions_list):
            question = question_data['question']
            print(f"Question {idx + 1} (Type: {question_data['type']}): {question}")
            self.speak_text(f"Question {idx + 1}: {question}")
            user_response = self.listen_for_response()

            if user_response and user_response.lower() in ['exit', 'quit']:
                print("Interview ended.")
                break

            if user_response:
                # Ask a follow-up question based on the user's response
                follow_up_question = self.ask_follow_up_question(user_response, question_data['type'])
                print(f"Follow-up Question: {follow_up_question}")
                self.speak_text(f"Follow-up Question: {follow_up_question}")
                user_response = self.listen_for_response()

    def ask_follow_up_question(self, user_response, question_type):
        # Generate a follow-up question based on the user's response and the question type
        prompt = f"Generate a follow-up {question_type.lower()} question based on this response: {user_response}"
        follow_up_question = self.ask_question(prompt)
        return follow_up_question
