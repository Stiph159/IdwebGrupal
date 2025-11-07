// script.js - Funcionalidades para GamerStore

document.addEventListener('DOMContentLoaded', function() {
    // 1. SISTEMA DE COMENTARIOS (TEMPORALES)
    inicializarSistemaComentarios();
    
    // 2. NAVEGACIÓN ACTIVA
    marcarPaginaActiva();
    
    // 3. ANIMACIONES DE CARGA
    inicializarAnimaciones();
    
    // 4. FORMULARIO DE CONTACTO MEJORADO
    inicializarFormularioContacto();
});

// ======= SISTEMA DE COMENTARIOS (TEMPORALES - 5 SEGUNDOS) =======
function inicializarSistemaComentarios() {
    const formularios = {
        'formComentarioFortnite': 'comentariosFortnite',
        'formComentarioGTA5': 'comentariosGTA5',
        'formComentarioDota': 'comentariosDota',
        'formComentarioMinecraft': 'comentariosMinecraft',
        'formComentarioPou': 'comentariosPou',
        'formComentarioLeft': 'comentariosLeft',
        'formComentarioMasJugados': 'comentariosMasJugados' // Para mas_jugados.html
    };

    Object.keys(formularios).forEach(formId => {
        const form = document.getElementById(formId);
        const contenedorId = formularios[formId];
        
        if (form) {
            // Mostrar mensaje inicial
            cargarComentarios(contenedorId);
            
            // Enviar comentario
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
    
    // Siempre vacío al inicio (nada en localStorage)
    contenedor.innerHTML = '<p class="no-comentarios">No hay comentarios aún. ¡Sé el primero!</p>';
}

function enviarComentario(form, contenedorId) {
    const nombreInput = form.querySelector('input[type="text"]');
    const comentarioInput = form.querySelector('textarea');
    
    const nombre = nombreInput.value.trim();
    const texto = comentarioInput.value.trim();
    
    if (!nombre || !texto) {
        mostrarMensaje('Por favor, completa todos los campos.', 'error');
        return;
    }

    const contenedor = document.getElementById(contenedorId);
    
    // Crear comentario con clase temporal
    const comentarioHTML = `
        <div class="comentario-item comentario-temporal">
            <div class="comentario-autor">${escapeHTML(nombre)}</div>
            <div class="comentario-texto">${escapeHTML(texto)}</div>
            <small>Ahora</small>
        </div>
    `;

    // Insertar al inicio
    contenedor.insertAdjacentHTML('afterbegin', comentarioHTML);

    // Limpiar formulario
    form.reset();
    mostrarMensaje('¡Comentario enviado!', 'exito');

    // ELIMINAR DESPUÉS DE 5 SEGUNDOS CON ANIMACIÓN
    setTimeout(() => {
        const comentario = contenedor.querySelector('.comentario-temporal');
        if (comentario) {
            comentario.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
            comentario.style.opacity = '0';
            comentario.style.transform = 'translateY(-10px)';
            
            // Remover del DOM después de la animación
            setTimeout(() => {
                if (comentario.parentElement) {
                    comentario.remove();
                }
                // Si no quedan comentarios, mostrar mensaje
                if (contenedor.children.length === 0) {
                    contenedor.innerHTML = '<p class="no-comentarios">No hay comentarios aún. ¡Sé el primero!</p>';
                }
            }, 500);
        }
    }, 10000);
}

// ======= NAVEGACIÓN ACTIVA =======
function marcarPaginaActiva() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        const isHome = (currentPage === '' || currentPage === 'index.html') && linkPage === 'index.html';
        const isMatch = linkPage === currentPage;
        
        if (isHome || isMatch) {
            link.classList.add('active');
        }
    });
}

// ======= ANIMACIONES DE CARGA =======
function inicializarAnimaciones() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
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
        
        const nombre = formContacto.querySelector('#nombre');
        const correo = formContacto.querySelector('#correo');
        const mensaje = formContacto.querySelector('#mensaje');
        const terminos = formContacto.querySelector('[name="terminos"]');
        
        if (!nombre.value.trim() || !correo.value.trim() || !mensaje.value.trim() || !terminos.checked) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }
        
        mostrarMensaje('¡Mensaje enviado! Te contactaremos pronto.', 'exito');
        formContacto.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ======= UTILIDADES =======
function mostrarMensaje(mensaje, tipo) {
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
    
    setTimeout(() => {
        mensajeElement.remove();
    }, 5000);
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ======= RULETA DE IMÁGENES =======
const lista = document.querySelector('.game-list');
const items = document.querySelectorAll('.game-item');
let pos = 0;

document.querySelector('.next-arrow')?.addEventListener('click', () => {
    pos = (pos + 1) % items.length;
    lista.style.transform = `translateX(-${pos * 300}px)`;
});

document.querySelector('.prev-arrow')?.addEventListener('click', () => {
    pos = (pos - 1 + items.length) % items.length;
    lista.style.transform = `translateX(-${pos * 300}px)`;
});