import { test, expect } from '@playwright/test';
 
test('formulario de login: validación de campos requeridos', async ({ page }) => {
 
  await page.goto('http://localhost:3000/');
 
  // El botón no tiene type="submit", dispara iniciarSesion() con onclick
  // Se busca por rol de botón con texto visible del formulario de login
  await page.getByRole('button', { name: /iniciar sesión|login|ingresar/i }).click();
 
  // Los errores se muestran en spans con IDs específicos, no como texto suelto
  // El mensaje de email vacío viene de validarEmail() → 'El correo es obligatorio.'
  await expect(page.locator('#error-login-email')).toHaveText('El correo es obligatorio.');
 
  // El mensaje de contraseña vacía viene de iniciarSesion() → 'Ingresa tu contraseña.'
  await expect(page.locator('#error-login-password')).toHaveText('Ingresa tu contraseña.');
 
});
 
test('formulario de login: credenciales válidas', async ({ page }) => {
 
  await page.goto('http://localhost:3000/');
 
  // El formulario guarda usuarios en localStorage, se inserta uno de prueba
  // antes de intentar iniciar sesión para que las credenciales sean válidas
  await page.evaluate(() => {
    localStorage.setItem('spa_usuarios', JSON.stringify([
      { nombre: 'Usuario Test', email: 'usuario@test.com', password: 'Test1234!' }
    ]));
  });
 
  // Los campos reales usan IDs login-email y login-password, no #email ni #password
  await page.fill('#login-email', 'usuario@test.com');
  await page.fill('#login-password', 'Test1234!');
 
  // El botón llama a iniciarSesion() con onclick
  await page.getByRole('button', { name: /iniciar sesión|login|ingresar/i }).click();
 
  // La página no redirige a un /dashboard, muestra un mensaje de éxito en #login-mensaje
  await expect(page.locator('#login-mensaje')).toContainText('Credenciales correctas');
 
});
  