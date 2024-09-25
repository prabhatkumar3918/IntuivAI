import redis
import json
import uuid
from langchain_cohere.llms import Cohere

class LLMProcessor:
    def __init__(self, redis_host='localhost', redis_port=6379):
        self.llm = None
        self.max_tokens = 1000
        self.temperature = 0.2
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

    def initialize_llm(self, cohere_api_key):
        # Initialize Cohere with the API key
        self.llm = Cohere(cohere_api_key=cohere_api_key, temperature=self.temperature, max_tokens=self.max_tokens)
        print("Initialized Cohere LLM.")
    
    def generate_questions(self, num_questions, cv_text, job_description, user_id):
        # Create the prompt
        template = f"""
        You are an interviewer conducting an interview based on the provided CV and job description.
        Follow these steps to ask questions:
        1. Analyze the CV and job description provided below to understand the context.
        2. Formulate questions that are directly relevant to the user's past projects, experiences, competitions, skills, and other aspects of the CV.
        3. Ask the questions in a clear and concise manner.
        4. The response should only contain the questions, formatted as a numbered list.
        
        Current CV:
        {cv_text}

        Job Description:
        {job_description}

        Your questions (only the questions, no additional text or remarks):
        """

        prompt = f"Generate {num_questions} different questions based on the CV and job description.\n{template}\nFormat your response as:\nQuestion one\n Question two\n... and so on."
        
        # Call the LLM to generate the questions
        response = self.llm(prompt)
        print("LLM Response:\n", response)
        
        # Process and store the response in Redis
        session_id=self.store_response_in_redis(response, user_id)
        return session_id
    
    def store_response_in_redis(self, response, user_id):
        # Generate a unique key for this user's session
        session_id = str(uuid.uuid4())
        
        # Parse the response into a list of questions
        questions_list = response#.split('\n')
        
        # Prepare the data structure to store in Redis
        data = {
            "user_id": user_id,
            "session_id": session_id,
            "questions": questions_list
        }
        
        # Store the data in Redis using the session_id as the key
        self.redis_client.set(session_id, json.dumps(data))
        print(f"Stored the response in Redis under session_id: {session_id}")
        
        return session_id