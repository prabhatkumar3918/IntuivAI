from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from hashing import Hash
from jwttoken import create_access_token
from oauth import get_current_user
import logging
from fastapi.security import OAuth2PasswordBearer
from jwttoken import verify_token   
from tts import TextToSpeech
from vtt import VoiceToText
from cv_text_extract import CVTextExtractor
from llm import LLMProcessor
import uuid

# Initialize FastAPI app
app = FastAPI()

# Configure CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection
mongodb_uri = 'mongodb+srv://dangerousdan8888:tqHt0OscZIMz8U3A@cluster0.6vvo7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(mongodb_uri)
db = client["User"]
print(db)

# Pydantic models
class User(BaseModel):
    username: str
    email: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class InterviewRequest(BaseModel):
    user_id: str
    cv_path: str
    job_description: str

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


# Root endpoint
@app.get("/")
def read_root(current_user: User = Depends(get_current_user)):
    return {"data": "Hello World"}

# Register endpoint
@app.post('/signup')
def create_user(request: User):
    try:
        logger.info(f"Received registration request for username: {request.username}")
        
        # Check if the username already exists
        existing_user = db["users"].find_one({"username": request.username})
        if existing_user:
            logger.warning(f"User already exists with username: {request.username}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Username already exists: {request.username}')
        
        # Hash the password
        hashed_pass = Hash.bcrypt(request.password)
        logger.debug(f"Password hashed for username: {request.username}")
        
        # Convert the request to a dictionary and replace the password with the hashed password
        user_object = request.dict()
        user_object["password"] = hashed_pass
        
        # Insert the user into the database
        user_id = db["users"].insert_one(user_object)
        logger.info(f"User created with ID: {user_id.inserted_id}")
        
        # Fetch the newly created user to create a token
        user = db["users"].find_one({"username": request.username})
        if not user:
            logger.warning(f"User not found after creation: {request.username}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User creation failed for username: {request.username}')
        
        # Create JWT token
        access_token = create_access_token(data={"sub": user["username"]})
        logger.info(f"Access token created for username: {request.username}")
        
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        logger.error(f"Error occurred during user registration: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while creating the user")
# Login endpoint
@app.post('/login')
def login(request: Login):
    try:
        logger.info(f"Login attempt for username: {request.username}")
        
        # Find user in the database
        user = db["users"].find_one({"username": request.username})
        if not user:
            logger.warning(f"User not found: {request.username}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No user found with username: {request.username}')
        
        # Verify the password
        if not Hash.verify(user["password"], request.password):
            logger.warning(f"Failed login attempt due to incorrect password for username: {request.username}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Wrong username or password')
        
        # Create JWT token
        access_token = create_access_token(data={"sub": user["username"]})
        logger.info(f"Access token created for username: {request.username}")
        
        return {"access_token": access_token, "token_type": "bearer"}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error occurred during login: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred during login")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.get('/verify')
def verify_token_endpoint(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user = verify_token(token, credentials_exception)
        #if the user is {401: Invalid token} then return status_code 401
        if user == credentials_exception:
            return JSONResponse(content={"message": "Invalid token"}, status_code=status.HTTP_401_UNAUTHORIZED)
        return JSONResponse(content={"message": "Token is valid"}, status_code=status.HTTP_200_OK)
    except HTTPException:
        return JSONResponse(content={"message": "Invalid token"}, status_code=status.HTTP_401_UNAUTHORIZED)
    

@app.post("/run-interview")
def run_interview(request: InterviewRequest, current_user: User = Depends(get_current_user)):
    try:
        # Ensure that only authenticated users can run interviews
        logger.info(f"Starting interview for user ID: {request.user_id}")

        # Initialize the InterviewApp (LLMProcessor) with the necessary API key
        cohere_api_key = "MvISiDVtjUD1qkhxysW3bYVLwbCwOnnlUcZDXynD"
        interview_app = LLMProcessor()

        # Generate a unique session ID
        session_id = str(uuid.uuid4())

        # Initialize the LLM and prepare the interview questions, storing them in Redis
        n = 70  # Example: 70% technical, 30% non-technical
        num_questions = 10  # Example: Total 10 questions
        interview_app.initialize_llm(
            cohere_api_key=cohere_api_key,
            n=n,
            num_questions=num_questions,
            cv_text=request.cv_path,
            job_description=request.job_description,
            session_id=session_id
        )

        # Start the interview process
        interview_app.conduct_interview(session_id)

        logger.info(f"Interview session ended for user ID: {request.user_id}")
        return {"message": "Interview session completed successfully."}

    except Exception as e:
        logger.error(f"Error during interview session: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred during the interview session")