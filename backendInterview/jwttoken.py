from datetime import datetime, timedelta
from jose import JWTError, jwt
import main


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token:str,credentials_exception):
	print(token, " This is the token")
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
		print(payload)
		# username: str = payload.get("sub")
		# if username is None:
		# 	raise credentials_exception
		# token_data = main.TokenData(username=username)
		return payload
	except JWTError:
	    return credentials_exception