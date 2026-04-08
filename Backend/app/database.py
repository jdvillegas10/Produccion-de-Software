import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Se carga la URL del archivo .env
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("No se encontró la variable DATABASE_URL en el archivo .env")

# Creamos el motor de conexion
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Creamos una sesión (cada vez que el backend haga algo en la BD, usará una sesión)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Esta es la clase base de la que heredarán nuestros modelos (tablas)
Base = declarative_base()

# Función de ayuda (Dependency Injection) para obtener la BD en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close