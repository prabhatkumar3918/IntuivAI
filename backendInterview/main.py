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
import json
from uvr import VoiceInterview

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
    def __init__(self):
        self.cv_extractor = CVTextExtractor()
        self.llm_processor = LLMProcessor() 
        
    def run_interview(self, cohere_api_key, user_id, cv_path, job_description, num_questions):
        cv_text = self.cv_extractor.extract_text(cv_path)
        self.llm_processor.initialize_llm(cohere_api_key=cohere_api_key)
        session_id = self.llm_processor.generate_questions(num_questions, cv_text, job_description, user_id)
        
        print("Starting the interview...\n")
        questions_list = json.loads(self.llm_processor.redis_client.get(session_id))
        print(questions_list)
        #print(f"Questions for session {session_id}:")
        #for question in questions_list['questions']:
            #print(question)
        return session_id

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
        interview_app = InterviewApp()

        # Generate a unique session ID
        session_id = str(uuid.uuid4())
        num_questions = 10  
        session_id = interview_app.run_interview(
            cohere_api_key=cohere_api_key,
            user_id=request.user_id,
            cv_path=request.cv_path,
            job_description=request.job_description,
            num_questions=num_questions
        )
        voice_interview = VoiceInterview()
        voice_interview.conduct_interview(session_id)
        logger.info(f"Interview session ended for user ID: {request.user_id}")
        return {"message": "Interview session completed successfully."}

    except Exception as e:
        logger.error(f"Error during interview session: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred during the interview session")