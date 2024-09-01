from langchain_cohere.llms import Cohere
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts.prompt import PromptTemplate

class LLMProcessor:
    def __init__(self):
        self.llm = None
        self.conversation_chain = None
        self.max_tokens = 100
        self.temperature = 0.2

    def initialize_llm(self, cohere_api_key):
        # Initialize Cohere with the API key
        self.llm = Cohere(cohere_api_key=cohere_api_key, temperature=self.temperature, max_tokens=self.max_tokens)
        print("Initialized Cohere LLM.")

    def setup_conversation_chain(self, cv_text, job_description):
        # Define the chain-of-thought interview instruction template
        instruction = '''
        You are the interviewer, and you are conducting an interview with the user who is the interviewee. 
        Your goal is to ask questions based on the CV and job description provided. 
        Follow these steps:
        1. Carefully review the CV and job description to understand the context.
        2. Formulate a relevant question based on the CV and job description.
        3. Ask one question at a time.
        4. After asking the question, wait for the interviewee's response.
        5. Based on the interviewee's response, ask follow-up questions if necessary.
        6. Keep questions concise and relevant to the context.
        7. Do not include introductory or closing remarks—just the question.
        '''

        # Create a prompt template with chain-of-thought guidance
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

    def ask_question(self, user_input):
        # Provide the user's response to the conversation chain and get the next question
        response = self.conversation_chain.run(user_input)
        return response

    def conduct_interview(self):
        print("Starting the interview...\n")

        # Start by asking the first question
        first_question = self.ask_question("Please begin the interview.")
        print(f"Interviewer: {first_question}")

        while True:
            # Get user response
            user_response = input("Your Response: ")

            if user_response.lower() in ['exit', 'quit']:
                print("Interview ended.")
                break

            # AI asks the next question based on user's response
            next_question = self.ask_question(user_response)
            print(f"Interviewer: {next_question}")