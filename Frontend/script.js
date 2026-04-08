const API_URL ="http://127.0.0.1:8000"  
  
  
  
  /* ============================================================
    NAVEGACIÓN
    ============================================================ */

  function showPage(pageId, clickedBtn) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

    // Quitar clase activa de botones del navbar
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Mostrar la página elegida
    let pagina = document.getElementById(pageId);
    if (pagina) pagina.style.display = 'block';

    // Marcar el botón activo si se pasó uno
    if (clickedBtn) clickedBtn.classList.add('active');

    // Limpiar formularios y mensajes al cambiar de página
    limpiarFormulario('login');
    limpiarFormulario('registro');

    // Ir al tope de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Mostrar la página de login al cargar
  showPage('login', document.querySelectorAll('.nav-btn')[0]);


  /* ============================================================
    UTILIDADES
    ============================================================ */

  // Mostrar u ocultar la contraseña
  function togglePassword(inputId, btn) {
    let input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  }

  // Mostrar un mensaje de éxito o error en la página indicada
  function mostrarMensaje(idMensaje, texto, tipo) {
    let el = document.getElementById(idMensaje);
    el.textContent = texto;
    el.className = 'mensaje ' + tipo; // 'exito' o 'error'
    // Auto-ocultar después de 5 segundos
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.className = 'mensaje oculto';
    }, 5000);
  }

  // Mostrar error en un campo específico y marcarlo en rojo
  function mostrarErrorCampo(inputId, errorId, mensaje) {
    document.getElementById(inputId).classList.add('invalido');
    document.getElementById(inputId).classList.remove('valido');
    document.getElementById(errorId).textContent = mensaje;
  }

  // Marcar un campo como válido
  function marcarValido(inputId, errorId) {
    document.getElementById(inputId).classList.remove('invalido');
    document.getElementById(inputId).classList.add('valido');
    document.getElementById(errorId).textContent = '';
  }

  // Limpiar un formulario y sus mensajes
  function limpiarFormulario(tipo) {
    if (tipo === 'login') {
      let campos = ['login-email', 'login-password'];
      campos.forEach(id => {
        let el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('invalido', 'valido'); }
      });
      let errores = ['error-login-email', 'error-login-password'];
      errores.forEach(id => { let el = document.getElementById(id); if(el) el.textContent = ''; });
      let msg = document.getElementById('login-mensaje');
      if (msg) msg.className = 'mensaje oculto';
    }

    if (tipo === 'registro') {
      let campos = ['reg-nombre', 'reg-email', 'reg-password', 'reg-confirm'];
      campos.forEach(id => {
        let el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('invalido', 'valido'); }
      });
      let errores = ['error-reg-nombre', 'error-reg-email', 'error-reg-password', 'error-reg-confirm'];
      errores.forEach(id => { let el = document.getElementById(id); if(el) el.textContent = ''; });
      let msg = document.getElementById('registro-mensaje');
      if (msg) msg.className = 'mensaje oculto';
      // Resetear barra de fortaleza
      document.getElementById('fortaleza-fill').style.width = '0%';
      document.getElementById('fortaleza-texto').textContent = '';
      // Resetear requisitos
      ['req-longitud','req-mayuscula','req-numero','req-especial'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('cumplido');
      });
    }
  }


  /* ============================================================
    VALIDACIONES INDIVIDUALES
    ============================================================ */

  // Validar que el nombre solo contenga letras, espacios y tildes
  function validarNombre(nombre) {
    if (nombre.trim() === '') return 'El nombre es obligatorio.';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    // Solo letras (incluyendo tildes y ñ), espacios
    let regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]+$/;
    if (!regex.test(nombre)) return 'El nombre solo puede contener letras y espacios.';
    return null; // sin error
  }

  // Validar formato de correo electrónico
  function validarEmail(email) {
    if (email.trim() === '') return 'El correo es obligatorio.';
    // Formato estándar de email
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regex.test(email)) return 'Ingresa un correo electrónico válido (ej: usuario@correo.com).';
    if (email.length > 100) return 'El correo no puede superar los 100 caracteres.';
    return null;
  }

  // Validar requisitos de contraseña
  function validarPassword(password) {
    if (password === '') return 'La contraseña es obligatoria.';
    if (password.length < 8)       return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(password))   return 'La contraseña debe tener al menos una letra mayúscula.';
    if (!/[0-9]/.test(password))   return 'La contraseña debe tener al menos un número.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password))
      return 'La contraseña debe tener al menos un carácter especial (!@#$%...).';
    return null;
  }

  // Actualizar visualmente los requisitos y la barra de fortaleza en tiempo real
  function evaluarFortaleza(password) {
    let puntos = 0;

    // Requisito 1: longitud
    if (password.length >= 8) {
      document.getElementById('req-longitud').classList.add('cumplido');
      document.getElementById('req-longitud').textContent = '✓ Mínimo 8 caracteres';
      puntos++;
    } else {
      document.getElementById('req-longitud').classList.remove('cumplido');
      document.getElementById('req-longitud').textContent = '✗ Mínimo 8 caracteres';
    }

    // Requisito 2: mayúscula
    if (/[A-Z]/.test(password)) {
      document.getElementById('req-mayuscula').classList.add('cumplido');
      document.getElementById('req-mayuscula').textContent = '✓ Al menos 1 letra mayúscula';
      puntos++;
    } else {
      document.getElementById('req-mayuscula').classList.remove('cumplido');
      document.getElementById('req-mayuscula').textContent = '✗ Al menos 1 letra mayúscula';
    }

    // Requisito 3: número
    if (/[0-9]/.test(password)) {
      document.getElementById('req-numero').classList.add('cumplido');
      document.getElementById('req-numero').textContent = '✓ Al menos 1 número';
      puntos++;
    } else {
      document.getElementById('req-numero').classList.remove('cumplido');
      document.getElementById('req-numero').textContent = '✗ Al menos 1 número';
    }

    // Requisito 4: carácter especial
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
      document.getElementById('req-especial').classList.add('cumplido');
      document.getElementById('req-especial').textContent = '✓ Al menos 1 carácter especial';
      puntos++;
    } else {
      document.getElementById('req-especial').classList.remove('cumplido');
      document.getElementById('req-especial').textContent = '✗ Al menos 1 carácter especial (!@#$%...)';
    }

    // Bonus: longitud extra
    if (password.length >= 12) puntos++;

    // Actualizar barra visual
    let fill  = document.getElementById('fortaleza-fill');
    let texto = document.getElementById('fortaleza-texto');

    if (password.length === 0) {
      fill.style.width = '0%';
      texto.textContent = '';
      return;
    }

    if (puntos <= 1) {
      fill.style.width = '20%';
      fill.style.backgroundColor = '#e74c3c';
      texto.style.color = '#e74c3c';
      texto.textContent = 'Muy débil';
    } else if (puntos === 2) {
      fill.style.width = '40%';
      fill.style.backgroundColor = '#e67e22';
      texto.style.color = '#e67e22';
      texto.textContent = 'Débil';
    } else if (puntos === 3) {
      fill.style.width = '60%';
      fill.style.backgroundColor = '#f1c40f';
      texto.style.color = '#c8a80c';
      texto.textContent = 'Regular';
    } else if (puntos === 4) {
      fill.style.width = '80%';
      fill.style.backgroundColor = '#2ecc71';
      texto.style.color = '#27ae60';
      texto.textContent = 'Fuerte';
    } else {
      fill.style.width = '100%';
      fill.style.backgroundColor = '#1abc9c';
      texto.style.color = '#16a085';
      texto.textContent = 'Muy fuerte';
    }
  }


  /* ============================================================
    REGISTRO DE USUARIO
    ============================================================ */

function registrarUsuario() {

    // 1. RECOLECTAR LOS DATOS (Esto es vital para que no esté vacío)
    let nombre   = document.getElementById('reg-nombre').value.trim();
    let email    = document.getElementById('reg-email').value.trim().toLowerCase();
    let password = document.getElementById('reg-password').value;
    let confirm  = document.getElementById('reg-confirm').value;

    let hayError = false;

    // 2. TUS VALIDACIONES (Mantenemos tu lógica de diseño)
    let errNombre = validarNombre(nombre);
    if (errNombre) {
        mostrarErrorCampo('reg-nombre', 'error-reg-nombre', errNombre);
        hayError = true;
    } else {
        marcarValido('reg-nombre', 'error-reg-nombre');
    }

    let errEmail = validarEmail(email);
    if (errEmail) {
        mostrarErrorCampo('reg-email', 'error-reg-email', errEmail);
        hayError = true;
    } else {
        marcarValido('reg-email', 'error-reg-email');
    }

    let errPass = validarPassword(password);
    if (errPass) {
        mostrarErrorCampo('reg-password', 'error-reg-password', errPass);
        hayError = true;
    } else {
        marcarValido('reg-password', 'error-reg-password');
    }

    if (confirm === '') {
        mostrarErrorCampo('reg-confirm', 'error-reg-confirm', 'Debes confirmar tu contraseña.');
        hayError = true;
    } else if (password !== confirm) {
        mostrarErrorCampo('reg-confirm', 'error-reg-confirm', 'Las contraseñas no coinciden.');
        hayError = true;
    } else {
        marcarValido('reg-confirm', 'error-reg-confirm');
    }

    // Si hay algún error visual, nos detenemos
    if (hayError) return;



  // --- Enviando datos al Backend ---
    const datosUsuario = {
        nombre: nombre,
        email: email,
        password: password
    };

    const btn = document.querySelector('#login .btn-submit'); // Selecciona tu botón
    btn.classList.add('btn-cargando'); // Activa el efecto visual
    
    fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosUsuario)
    })
    .then(async response => {
        const data = await response.json();
        btn.classList.remove('btn-cargando'); // Quita el efecto al recibir respuesta
        
        if (response.ok) {
            mostrarMensaje('login-mensaje', ' ¡Bienvenido! Redirigiendo...', 'exito');
            limpiarFormulario('registro');
            setTimeout(() => {
                showPage('login', document.querySelectorAll('.nav-btn')[0]);
            }, 2000);
        } else {
            // Si el backend responde con un error (ej: correo ya registrado)
            const detalle = data.detail || "Error al registrarse";
            mostrarMensaje('registro-mensaje', ` ${detalle}`, 'error');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarMensaje('registro-mensaje', ' Error de conexión con el servidor.', 'error');
    });

  }


  /* ============================================================
    INICIO DE SESIÓN
    ============================================================ */


function iniciarSesion() {
    // 1. RECOLECTAR LOS DATOS (Indispensable para que el Backend reciba algo)
    let email    = document.getElementById('login-email').value.trim().toLowerCase();
    let password = document.getElementById('login-password').value;

    let hayError = false;

    // 2. VALIDACIONES VISUALES (Usando tus funciones de script.js)
    let errEmail = validarEmail(email);
    if (errEmail) {
        mostrarErrorCampo('login-email', 'error-login-email', errEmail);
        hayError = true;
    } else {
        marcarValido('login-email', 'error-login-email');
    }

    if (password === '') {
        mostrarErrorCampo('login-password', 'error-login-password', 'Ingresa tu contraseña.');
        hayError = true;
    } else {
        marcarValido('login-password', 'error-login-password');
    }

    // Si hay errores en los campos, no hacemos la petición
    if (hayError) return;

    const btn = document.querySelector('#login .btn-submit');

    // ACTIVAR CARGA: Ponemos el botón en estado de espera
    if (btn) {
        btn.classList.add('btn-cargando');
        btn.disabled = true;
    }

    // 3. PETICIÓN AL BACKEND (OAuth2 requiere URLSearchParams)
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI espera 'username' para el email
    formData.append('password', password);    
    
    
  
    fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(async response => {
        const data = await response.json();

        if (btn) {
            btn.classList.remove('btn-cargando');
            btn.disabled = false;
        }

        if (response.ok) {
            // --- GUARDAR EL TOKEN ---
            // Guardamos el token en localStorage para futuras peticiones
            localStorage.setItem('token', data.access_token);
            mostrarMensaje('login-mensaje', ' ¡Bienvenido! Redirigiendo...', 'exito');
            limpiarFormulario('login');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 1500);

        } else {
            const detalle = data.detail || "Credenciales incorrectas";
            mostrarMensaje('login-mensaje', ` ${detalle}`, 'error');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarMensaje('login-mensaje', ' Error de conexión con el servidor.', 'error');
    });
  }