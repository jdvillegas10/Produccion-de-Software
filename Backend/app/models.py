from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users" # Nombre de la tabla en xampp

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(250))
