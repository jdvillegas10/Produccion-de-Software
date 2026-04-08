function showPage(pageId, clickedBtn) {
  // Ocultar todas las páginas
  let pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });

  // Quitar clase activa de todos los botones del navbar
  let btns = document.querySelectorAll('.nav-btn');
  btns.forEach(btn => btn.classList.remove('active'));

  // Mostrar la página seleccionada
  let selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }

  // Si se pasó un botón del navbar, marcarlo como activo
  // (las cards no pasan botón, así que ninguno queda activo)
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  // Scroll al inicio cada vez que se cambia de página
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar la página de inicio por defecto al cargar
showPage('inicio', document.querySelectorAll('.nav-btn')[0]);
