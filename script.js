// script.js - Funcionalidades para GamerStore

document.addEventListener('DOMContentLoaded', function() {
    // 1. SISTEMA DE COMENTARIOS
    inicializarSistemaComentarios();
    
    // 2. NAVEGACIÓN ACTIVA
    marcarPaginaActiva();
    
    // 3. ANIMACIONES DE CARGA
    inicializarAnimaciones();
    
    // 4. FORMULARIO DE CONTACTO MEJORADO
    inicializarFormularioContacto();
});

// ======= SISTEMA DE COMENTARIOS =======
function inicializarSistemaComentarios() {
    const formularios = {
        'formComentarioFortnite': 'comentariosFortnite',
        'formComentarioGTA5': 'comentariosGTA5',
        'formComentarioDota': 'comentariosDota',
        'formComentarioMinecraft': 'comentariosMinecraft',
        'formComentarioPou': 'comentariosPou',
        'formComentarioLeft': 'comentariosLeft'
    };

    // Inicializar cada formulario
    Object.keys(formularios).forEach(formId => {
        const form = document.getElementById(formId);
        const contenedorId = formularios[formId];
        
        if (form) {
            // Cargar comentarios existentes
            cargarComentarios(contenedorId);
            
            // Manejar envío de nuevo comentario
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                enviarComentario(form, contenedorId);
            });
        }
    });
}

function cargarComentarios(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    
    const comentarios = JSON.parse(localStorage.getItem(contenedorId)) || [];
    
    if (comentarios.length === 0) {
        contenedor.innerHTML = '<p class="loading">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        return;
    }
    
    contenedor.innerHTML = comentarios.map(comentario => `
        <div class="comentario-item">
            <div class="comentario-autor">${escapeHTML(comentario.nombre)}</div>
            <div class="comentario-texto">${escapeHTML(comentario.texto)}</div>
            <small>${new Date(comentario.fecha).toLocaleDateString('es-ES')}</small>
        </div>
    `).join('');
}

function enviarComentario(form, contenedorId) {
    const nombreInput = form.querySelector('input[type="text"]');
    const comentarioInput = form.querySelector('textarea');
    
    const nuevoComentario = {
        nombre: nombreInput.value.trim(),
        texto: comentarioInput.value.trim(),
        fecha: new Date().toISOString()
    };
    
    if (!nuevoComentario.nombre || !nuevoComentario.texto) {
        mostrarMensaje('Por favor, completa todos los campos.', 'error');
        return;
    }
    
    // Guardar en localStorage
    const comentarios = JSON.parse(localStorage.getItem(contenedorId)) || [];
    comentarios.unshift(nuevoComentario); // Agregar al inicio
    localStorage.setItem(contenedorId, JSON.stringify(comentarios));
    
    // Actualizar visualización
    cargarComentarios(contenedorId);
    
    // Limpiar formulario y mostrar mensaje
    form.reset();
    mostrarMensaje('¡Comentario enviado correctamente!', 'exito');
}

// ======= NAVEGACIÓN ACTIVA =======
function marcarPaginaActiva() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ======= ANIMACIONES =======
function inicializarAnimaciones() {
    // Animación de fade-in para elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Aplicar a secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ======= FORMULARIO DE CONTACTO MEJORADO =======
function inicializarFormularioContacto() {
    const formContacto = document.querySelector('form[action="#"]');
    if (!formContacto) return;
    
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validación básica
        const nombre = formContacto.querySelector('#nombre');
        const correo = formContacto.querySelector('#correo');
        const mensaje = formContacto.querySelector('#mensaje');
        const terminos = formContacto.querySelector('[name="terminos"]');
        
        if (!nombre.value.trim() || !correo.value.trim() || !mensaje.value.trim() || !terminos.checked) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }
        
        // Simular envío (en un caso real, aquí iría AJAX)
        mostrarMensaje('¡Mensaje enviado! Te contactaremos pronto.', 'exito');
        formContacto.reset();
        
        // Scroll to top para ver el mensaje
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ======= UTILIDADES =======
function mostrarMensaje(mensaje, tipo) {
    // Remover mensajes existentes
    const mensajesExistentes = document.querySelectorAll('.mensaje-temporal');
    mensajesExistentes.forEach(msg => msg.remove());
    
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje-temporal mensaje-${tipo}`;
    mensajeElement.textContent = mensaje;
    mensajeElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        ${tipo === 'exito' ? 'background: #27ae60;' : 'background: #e74c3c;'}
    `;
    
    document.body.appendChild(mensajeElement);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        mensajeElement.remove();
    }, 5000);
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ======= CONTADOR DE VISITAS =======
function inicializarContadorVisitas() {
    const contador = localStorage.getItem('visitasGamerStore') || 0;
    const nuevasVisitas = parseInt(contador) + 1;
    localStorage.setItem('visitasGamerStore', nuevasVisitas);
    
    // Opcional: mostrar en consola para debugging
    console.log(`¡Bienvenido! Visitas totales: ${nuevasVisitas}`);
}

// Inicializar contador al cargar ruleta de imagenes
inicializarContadorVisitas();
const lista = document.querySelector('.game-list');
const items = document.querySelectorAll('.game-item');
let pos = 0;

// DERECHA
document.querySelector('.next-arrow').onclick = () => {
  pos = (pos + 1) % items.length;
  lista.style.transform = `translateX(-${pos * 300}px)`;
};

// IZQUIERDA
document.querySelector('.prev-arrow').onclick = () => {
  pos = (pos - 1 + items.length) % items.length;
  lista.style.transform = `translateX(-${pos * 300}px)`;
};
// ...
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // AÑADE 'mas_jugados.html' a esta condición
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
// ...