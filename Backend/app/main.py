from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routes import users
from fastapi.middleware.cors import CORSMiddleware

# Creamos las tablas en la base de datos xampp
# Esto busca todo lo que herede de Base en models.py

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción pondrías la URL de tu web
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
async def read_root():
    return {"message":"El backend está funcionando y conectado a Xampp"}

# Ruta para creacion de usuarios
app.include_router(users.router)
