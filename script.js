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
  let nombre   = document.getElementById('reg-nombre').value.trim();
  let email    = document.getElementById('reg-email').value.trim().toLowerCase();
  let password = document.getElementById('reg-password').value;
  let confirm  = document.getElementById('reg-confirm').value;

  let hayError = false;

  // --- Validar nombre ---
  let errNombre = validarNombre(nombre);
  if (errNombre) {
    mostrarErrorCampo('reg-nombre', 'error-reg-nombre', errNombre);
    hayError = true;
  } else {
    marcarValido('reg-nombre', 'error-reg-nombre');
  }

  // --- Validar email ---
  let errEmail = validarEmail(email);
  if (errEmail) {
    mostrarErrorCampo('reg-email', 'error-reg-email', errEmail);
    hayError = true;
  } else {
    marcarValido('reg-email', 'error-reg-email');
  }

  // --- Validar password ---
  let errPass = validarPassword(password);
  if (errPass) {
    mostrarErrorCampo('reg-password', 'error-reg-password', errPass);
    hayError = true;
  } else {
    marcarValido('reg-password', 'error-reg-password');
  }

  // --- Validar confirmación ---
  if (confirm === '') {
    mostrarErrorCampo('reg-confirm', 'error-reg-confirm', 'Debes confirmar tu contraseña.');
    hayError = true;
  } else if (password !== confirm) {
    mostrarErrorCampo('reg-confirm', 'error-reg-confirm', 'Las contraseñas no coinciden.');
    hayError = true;
  } else {
    marcarValido('reg-confirm', 'error-reg-confirm');
  }

  // Si hay algún error, detener aquí
  if (hayError) return;

  // --- Verificar si el correo ya está registrado ---
  let usuarios = JSON.parse(localStorage.getItem('spa_usuarios') || '[]');
  let yaExiste = usuarios.find(u => u.email === email);
  if (yaExiste) {
    mostrarErrorCampo('reg-email', 'error-reg-email', 'Este correo ya está registrado.');
    return;
  }

  // --- Guardar el nuevo usuario en localStorage ---
  usuarios.push({ nombre: nombre, email: email, password: password });
  localStorage.setItem('spa_usuarios', JSON.stringify(usuarios));

  // Mostrar mensaje de éxito
  mostrarMensaje('registro-mensaje', '✅ ¡Cuenta creada con éxito! Ya puedes iniciar sesión.', 'exito');

  // Limpiar el formulario después de registrar
  limpiarFormulario('registro');

  // Redirigir al login después de 2 segundos
  setTimeout(() => {
    showPage('login', document.querySelectorAll('.nav-btn')[0]);
  }, 2000);
}


/* ============================================================
   INICIO DE SESIÓN
   ============================================================ */

function iniciarSesion() {
  let email    = document.getElementById('login-email').value.trim().toLowerCase();
  let password = document.getElementById('login-password').value;

  let hayError = false;

  // --- Validar que los campos no estén vacíos ---
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

  if (hayError) return;

  // --- Buscar el usuario en localStorage ---
  let usuarios = JSON.parse(localStorage.getItem('spa_usuarios') || '[]');
  let usuario  = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    // Credenciales correctas ✅
    mostrarMensaje(
      'login-mensaje',
      '✅ ¡Credenciales correctas! Bienvenido, ' + usuario.nombre + '.',
      'exito'
    );
    // Limpiar campos
    limpiarFormulario('login');
  } else {
    // Credenciales incorrectas ❌
    mostrarMensaje(
      'login-mensaje',
      '❌ El correo o la contraseña son inválidos. Verifica tus datos.',
      'error'
    );
  }
}
