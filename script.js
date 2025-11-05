// Parque Hípico La Montaña - Interactive Website JavaScript
// Main functionality for carousel, calendar, and navigation

document.addEventListener('DOMContentLoaded', function() {
    console.log('Parque Hípico La Montaña - Website loaded successfully');
    
    // Initialize all components
    initCarousel();
    initCalendar();
    initNavigation();
    initEventHandlers();
});

// Carousel Banner Functionality
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    // Apply background images from data attributes to avoid inline styles in HTML
    document.querySelectorAll('.slide-image').forEach(el => {
        const bg = el.getAttribute('data-bg');
        if (bg) {
            el.style.backgroundImage = `url('${bg}')`;
        }
    });
    let currentSlide = 0;
    let slideInterval;

    // Auto-advance slides every 5 seconds
    function startCarousel() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        indicators[currentSlide].setAttribute('aria-selected', 'false');
        
        currentSlide = (currentSlide + 1) % slides.length;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        indicators[currentSlide].setAttribute('aria-selected', 'true');
    }

    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        indicators[currentSlide].setAttribute('aria-selected', 'false');
        
        currentSlide = slideIndex;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        indicators[currentSlide].setAttribute('aria-selected', 'true');
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Diapositiva ${index + 1}`);
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('aria-selected', indicator.classList.contains('active') ? 'true' : 'false');
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            startCarousel();
        });
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clearInterval(slideInterval);
                goToSlide(index);
                startCarousel();
            }
        });
    });

    // Pause carousel on hover
    const carouselContainer = document.querySelector('.carousel-banner');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startCarousel();
        });
    }

    // Start the carousel
    startCarousel();
}

// Interactive Calendar Functionality
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Sample events data (in real implementation, this would come from a database)
    const eventsData = {
        2025: {
            10: { // November (0-indexed)
                30: { title: 'Clásico de Noviembre', type: 'regular' }
            },
            11: { // December
                13: { title: 'Copa Diciembre', type: 'special' },
                31: { title: 'Gran Cierre de Año', type: 'main' }
            }
        },
        2026: {
            0: { // January
                1: { title: 'Apertura de Año Nuevo', type: 'special' }
            }
        }
    };

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    function renderCalendar() {
        if (!calendarGrid || !currentMonthElement) return;

        // Update month display
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Clear previous calendar
        calendarGrid.innerHTML = '';

        // Add day headers - Starting from Monday
        const dayHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Adjust starting day for Monday-first calendar
        // If Sunday (0), show 6 empty cells; if Monday (1), show 0; if Tuesday (2), show 1; etc.
        const mondayFirstStartingDay = startingDay === 0 ? 6 : startingDay - 1;

        // Add empty cells for days before month starts
        for (let i = 0; i < mondayFirstStartingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            emptyDay.textContent = '';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if this day has an event
            const hasEvent = eventsData[currentYear] && 
                           eventsData[currentYear][currentMonth] && 
                           eventsData[currentYear][currentMonth][day];

            if (hasEvent) {
                dayElement.classList.add('has-event');
                dayElement.title = hasEvent.title;
                
                // Add click handler for events
                dayElement.addEventListener('click', () => {
                    showEventDetails(hasEvent, day, currentMonth + 1, currentYear);
                });
            }

            // Add click handler for regular days
            if (!hasEvent) {
                dayElement.addEventListener('click', () => {
                    showDayDetails(day, currentMonth + 1, currentYear);
                });
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    function showEventDetails(event, day, month, year) {
        const eventModal = document.createElement('div');
        eventModal.className = 'event-modal';
        eventModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${event.title}</h3>
                    <button class="modal-close">&times;</button>
                    </div>
                <div class="modal-body">
                    <p><strong>Fecha:</strong> ${day}/${month}/${year}</p>
                    <p><strong>Tipo:</strong> ${event.type}</p>
                    <p>Este evento está programado para esta fecha. Haz clic en "Ver más" para obtener información detallada.</p>
                    <button class="btn-ver-mas">Ver más</button>
                </div>
            </div>
        `;

        // Add modal styles
        eventModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const modalContent = eventModal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(eventModal);

        // Close modal handlers
        eventModal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(eventModal);
        });

        eventModal.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                document.body.removeChild(eventModal);
            }
        });
    }

    function showDayDetails(day, month, year) {
        // No hay eventos programados para esta fecha
        console.log(`Día ${day}/${month}/${year} - No hay eventos programados`);
    }

    // Month navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // Initial render
    renderCalendar();
}

// Navigation Menu Functionality
function initNavigation() {
    // Dropdowns: Soporte para hover (CSS) y click (JS)
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    
    dropdowns.forEach(dropdown => {
        const navLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const dropdownLinks = dropdownMenu.querySelectorAll('a');
        
        let isOpen = false;
        
        // Toggle dropdown con click (solo si hay enlaces en el dropdown)
        navLink.addEventListener('click', (e) => {
            // Solo prevenir navegación si el dropdown tiene enlaces
            // Permitir navegación normal si no hay dropdown items
            if (dropdownLinks.length > 0) {
                // Si el dropdown está abierto y clickeamos de nuevo, cerrar
                // Si está cerrado, abrir
                if (isOpen) {
                    e.preventDefault();
                    isOpen = false;
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                    dropdown.classList.remove('open');
                } else {
                    e.preventDefault();
                    isOpen = true;
                    
                    // Cerrar otros dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            const otherMenu = other.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.style.opacity = '0';
                                otherMenu.style.visibility = 'hidden';
                                otherMenu.style.transform = 'translateY(-10px)';
                                other.classList.remove('open');
                            }
                        }
                    });
                    
                    // Abrir dropdown actual
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                    dropdownMenu.style.transform = 'translateY(0)';
                    dropdown.classList.add('open');
                    // Focus en el primer enlace
                    dropdownLinks[0].focus();
                }
            }
        });
        
        // Sincronizar estado cuando hover abre el dropdown (desktop)
        dropdown.addEventListener('mouseenter', () => {
            if (dropdownMenu.style.opacity === '1' || getComputedStyle(dropdownMenu).opacity === '1') {
                isOpen = true;
                dropdown.classList.add('open');
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            // Si no hay focus, cerrar
            if (!dropdown.querySelector(':focus')) {
                isOpen = false;
                dropdown.classList.remove('open');
            }
        });
        
        // Navegación por teclado en dropdowns
        navLink.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLink.click();
            }
            
            if (e.key === 'ArrowDown' && !isOpen) {
                e.preventDefault();
                navLink.click();
                dropdownLinks[0]?.focus();
            }
        });
        
        // Navegación con Tab y flechas en enlaces del dropdown
        dropdownLinks.forEach((link, index) => {
            // Añadir tabindex para navegación por teclado
            link.setAttribute('tabindex', '0');
            
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // El click se manejará automáticamente
                    // Cerrar dropdown después del click
                    setTimeout(() => {
                        isOpen = false;
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                        dropdownMenu.style.transform = 'translateY(-10px)';
                        dropdown.classList.remove('open');
                    }, 100);
                }
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = dropdownLinks[index + 1] || dropdownLinks[0];
                    nextLink.focus();
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = dropdownLinks[index - 1] || dropdownLinks[dropdownLinks.length - 1];
                    prevLink.focus();
                }
                
                if (e.key === 'Escape') {
                    isOpen = false;
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                    dropdown.classList.remove('open');
                    navLink.focus();
                }
            });
            
            // Cerrar dropdown al hacer click en ancla
            link.addEventListener('click', () => {
                isOpen = false;
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(-10px)';
                dropdown.classList.remove('open');
            });
        });
    });

    // Cierre por click fuera (click-away) - simplificado
    document.addEventListener('click', (e) => {
        const ddOpen = document.querySelector('.nav-item.dropdown.open');
        if (!ddOpen) return;
        if (!ddOpen.contains(e.target)) {
            const dropdownMenu = ddOpen.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(-10px)';
            }
            ddOpen.classList.remove('open');
        }
    });
    
    // Cerrar dropdowns al hacer click en cualquier enlace del dropdown (UX mejorada)
    document.querySelectorAll('.dropdown-menu a, .dropdown-item').forEach(a => {
        a.addEventListener('click', () => {
            // Cierra cualquier dropdown abierto (si usas clase open)
            document.querySelectorAll('.nav-item.dropdown.open').forEach(d => {
                const dropdownMenu = d.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
                d.classList.remove('open');
            });
        });
    });

    // Mobile menu toggle (if hamburger menu is added later)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Event Handlers for Interactive Elements
function initEventHandlers() {
    // Social media links - solo log para debugging
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.classList.contains('instagram') ? 'Instagram' : 
                            link.classList.contains('facebook') ? 'Facebook' : 
                            link.classList.contains('tiktok') ? 'TikTok' : 'Social';
            console.log(`Opening ${platform} profile...`);
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.calendar-container, .upcoming-events, .summary-column');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Window resize handler
window.addEventListener('resize', debounce(() => {
    console.log('Window resized, recalculating layout...');
    // Add any responsive recalculations here
}, 250));

// Performance monitoring
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}

window.addEventListener('load', logPerformance);

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCarousel,
        initCalendar,
        initNavigation,
        initEventHandlers
    };
}

// === Próximas Fechas: rotación en grupos de 3 + controles manuales ===
(function() {
    const wrapper = document.querySelector('.upcoming-events');
    const list = wrapper?.querySelector('.events-list');
    const btnPrev = wrapper?.querySelector('.events-prev');
    const btnNext = wrapper?.querySelector('.events-next');
    if (!wrapper || !list || !btnPrev || !btnNext) return;

    // 1) Obtener y ordenar eventos por fecha (requiere data-date="YYYY-MM-DD")
    let items = Array.from(list.querySelectorAll('.event-item'))
        .map(el => ({ el, date: new Date(el.dataset.date) }))
        .filter(({ date }) => !isNaN(date))
        .sort((a, b) => a.date - b.date);

    const today = new Date();
    const futuros = items.filter(({ date }) => date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const base = futuros.length ? futuros : items;
    if (!base.length) return;

    // 2) Chunk en grupos de 3
    const chunks = [];
    for (let i = 0; i < base.length; i += 3) {
        chunks.push(base.slice(i, i + 3));
    }

    // 3) Renderizador
    let idx = 0;
    function renderChunk(i) {
        list.innerHTML = '';
        (chunks[i] || []).forEach(({ el }) => list.appendChild(el));
    }

    renderChunk(idx);

    // 4) Timer 20s con pausa/reinicio
    let timer = null;
    const INTERVALO_MS = 20000; // 20s

    function start() {
        if (chunks.length <= 1) return; // no rotar si <=3 eventos
        stop();
        timer = setInterval(() => {
            idx = (idx + 1) % chunks.length;
            renderChunk(idx);
        }, INTERVALO_MS);
    }

    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    function restart() {
        stop();
        start();
    }

    // 5) Controles manuales (mismo comportamiento que calendario)
    btnNext.addEventListener('click', () => {
        idx = (idx + 1) % chunks.length;
        renderChunk(idx);
        restart();
    });

    btnPrev.addEventListener('click', () => {
        idx = (idx - 1 + chunks.length) % chunks.length;
        renderChunk(idx);
        restart();
    });

    // Accesibilidad con teclado
    [btnPrev, btnNext].forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // Pausa en hover y tab focus
    wrapper.addEventListener('mouseenter', stop);
    wrapper.addEventListener('mouseleave', start);
    wrapper.addEventListener('focusin', stop);
    wrapper.addEventListener('focusout', start);

    // Pausa si la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    start();
})();

// Función para obtener offset dinámico del header
const getOffset = () => {
    const header = document.querySelector('.header');
    return (header?.offsetHeight || 0) + 12;
};

// Actualizar CSS custom property para scroll-margin-top
const updateScrollMargin = () => {
    const offset = getOffset();
    document.documentElement.style.setProperty('--header-offset', `${offset}px`);
};

// Actualizar scroll-margin al cargar y al redimensionar
updateScrollMargin();
window.addEventListener('resize', debounce(updateScrollMargin, 100));

// === Navegación limpia (sin alerts) + scroll suave a secciones ===
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href');

    // Enlaces deshabilitados
    if (a.dataset.disabled === 'true') {
        e.preventDefault();
        return;
    }

    // Ancla MISMA página (#...) - scroll fix offset
    if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
            // Calcular offset dinámico del header
            const offset = getOffset();
            
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Cierra dropdowns si aplica
            const dropdown = a.closest('.dropdown');
            if (dropdown) {
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                    dropdown.classList.remove('open');
                }
            }
        }
        return;
    }

    // Enlaces a OTRA página con hash (/parquehipico/#id): dejar fluir
    // El navegador manejará la navegación y el hash se resolverá al cargar
});

// Manejar scroll al hash cuando la página carga con hash en la URL - scroll fix offset
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                // Calcular offset dinámico del header
                const offset = getOffset();
                
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// Smooth scroll con offset dinámico del header para enlaces del subnav
(function () {
    document.querySelectorAll('.subnav a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            const el = document.querySelector(id);
            if (!el) return;

            e.preventDefault();
            // Calcular offset dinámico antes de cada scroll
            const offset = getOffset();
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });

            // Cierra dropdowns si están abiertos
            document.querySelectorAll('.nav-item.dropdown.open')
                .forEach(d => {
                    const dropdownMenu = d.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                        dropdownMenu.style.transform = 'translateY(-10px)';
                    }
                    d.classList.remove('open');
                });
        });
        
        // Navegación por teclado: Enter activa smooth scroll
        a.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                a.click();
            }
        });
    });
})();

// === DEV HELPERS para abrir con file:// ===
(function () {
    const isFile = location.protocol === 'file:';
    if (!isFile) return; // en producción no hace nada

    // 1) Reescribir ENLACES absolutos "/algo" -> "algo"
    //   Ejemplo: <a href="/parquehipico/#vision"> -> "parquehipico/#vision"
    document.querySelectorAll('a[href^="/"]').forEach(a => {
        const href = a.getAttribute('href');
        // Quita el primer "/" solamente
        a.setAttribute('href', href.replace(/^\//, ''));
    });

    // 2) Reescribir ASSETS absolutos a relativos y agregar cache-busting
    const bust = `dev=${Date.now()}`;

    // <link rel="stylesheet" href="/styles.css">
    document.querySelectorAll('link[rel="stylesheet"][href^="/"]').forEach(link => {
        const clean = link.getAttribute('href').replace(/^\//, '');
        const sep = clean.includes('?') ? '&' : '?';
        link.setAttribute('href', `${clean}${sep}${bust}`);
    });

    // <script src="/script.js">
    document.querySelectorAll('script[src^="/"]').forEach(scr => {
        const clean = scr.getAttribute('src').replace(/^\//, '');
        const sep = clean.includes('?') ? '&' : '?';
        scr.setAttribute('src', `${clean}${sep}${bust}`);
    });

    // <img src="/assets/..."> y backgrounds inline si los usas
    document.querySelectorAll('img[src^="/"]').forEach(img => {
        const clean = img.getAttribute('src').replace(/^\//, '');
        img.setAttribute('src', clean);
    });

    // 3) Mejora UX: botón oculto para "forzar recarga sin caché"
    //    Presiona Ctrl+Alt+R para recargar con nuevo bust
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) {
            const url = new URL(location.href);
            url.searchParams.set('dev', Date.now().toString());
            location.href = url.toString();
        }
    });

    // 4) Enlaces internos "#id" siguen haciendo scroll suave
    //    (si ya tienes un handler, no cambies nada)
})();