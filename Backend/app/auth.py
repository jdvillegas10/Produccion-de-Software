import os
from datetime import datetime, timedelta, timezone
from jose import jwt
from dotenv import load_dotenv
from passlib.context import CryptContext

# Configuramos el algoritmo de encriptación (bcrypt es el estándar de la industria)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función 1: Para el registro (Convierte texto plano a Hash)
def get_password_hash(password:str):
    return pwd_context.hash(password)

# Función 2: Para el login (Compara lo que el usuario escribe con lo que hay en la BD)
def verify_password (plain_password:str, hashed_password:str):
    return pwd_context.verify(plain_password, hashed_password)

# ------------- JWT -------------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not SECRET_KEY or not ALGORITHM:
    raise ValueError("Faltan configuraciones de seguridad (SECRET_KEY o ALGORITHM) en el .env")

def create_access_token (data:dict):
    to_encode = data.copy()

    # Definimos cuánto tiempo durará el token antes de caducar
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})

    # Firmamos el token con nuestra SECRET KEY
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # type: ignore
    return encoded_jwt