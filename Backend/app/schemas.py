from pydantic import BaseModel, EmailStr
from typing import Optional


#Lo que el frontend nos envia para registrarse
class UserCreate(BaseModel):
    nombre:str
    email:EmailStr #Valida que sea un correo electrónico real
    password:str

#Lo que el Backend le responde al Frontend (Sin la contraseña)
class UserRespose(BaseModel):
    id:int
    nombre:str
    email:EmailStr

    class Config:
        from_attributes = True # Permite que Pydantic lea modelos de SQLAlchemy