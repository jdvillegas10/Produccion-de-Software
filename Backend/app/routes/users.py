from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


# Ruta para crear usuario
@router.post("/", response_model=schemas.UserRespose)
def create_user(user:schemas.UserCreate, db:Session = Depends(get_db)):
    # 1. Verificar si el email ya existe para no romper la base de datos
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # 2. Hashear la contraseña que viene del esquema
    hashed_pwd = auth.get_password_hash(user.password)

    # 3. Crear el objeto del modelo (Base de Datos)
    new_user = models.User(
        nombre=user.nombre,
        email=user.email,
        hashed_password=hashed_pwd
    )

    # 4. Guardar en XAMPP
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# Ruta para comparar e iniciar sesión
@router.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):

    # 1. Buscar al usuario por su email (username en OAuth2)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    # 2. Si no existe el correo...
    if user is None:
        raise HTTPException(status_code=401, detail="El correo electrónico no es valido")
    
    # Si no existe la contraseña
    if not auth.verify_password(form_data.password, str(user.hashed_password)):
        raise HTTPException(status_code=401, detail="La contraseña no es válida")

    # 3. CREAR EL TOKEN REAL
    # Guardamos el email dentro del token (puedes guardar el ID también)
    access_token = auth.create_access_token(data={"sub":user.email})

    # 4. Responder con el estándar de OAuth2
    return {
        "access_token": access_token,
        "token_type":"bearer",
        "username": user.nombre
    }
