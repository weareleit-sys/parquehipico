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
            9: { // October (0-indexed)
                15: { title: 'Gran Carrera de Primavera', type: 'main' },
                22: { title: 'Campeonato Nacional', type: 'championship' },
                29: { title: 'Festival Hípico Familiar', type: 'family' }
            },
            10: { // November
                5: { title: 'Carrera de Noviembre', type: 'regular' },
                12: { title: 'Gran Premio', type: 'main' },
                19: { title: 'Día del Caballo', type: 'special' }
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
        alert(`Día ${day}/${month}/${year}\n\nNo hay eventos programados para esta fecha.`);
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
    // ELIMINADO: Todo el código de hover - ahora se maneja solo con CSS
    console.log('Navigation initialized - hover handled by CSS only');

    // Handle dropdown menu clicks
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.trim();
            console.log(`Dropdown link clicked: ${linkText}`);
            
            // Show loading state
            const originalText = link.textContent;
            link.textContent = 'Cargando...';
            link.style.pointerEvents = 'none';
            
            setTimeout(() => {
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';
                alert(`Navegando a: ${linkText}\n\nEsta sección se implementará en la versión completa.`);
            }, 1000);
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
    // "Ver más" buttons in upcoming events
    const verMasButtons = document.querySelectorAll('.btn-ver-mas');
    verMasButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const eventItem = button.closest('.event-item');
            const eventTitle = eventItem.querySelector('h4').textContent;
            alert(`Abriendo detalles de: ${eventTitle}\n\nEsta funcionalidad se implementará en la versión completa del sitio.`);
        });
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.classList.contains('instagram') ? 'Instagram' : 'Facebook';
            console.log(`Opening ${platform} profile...`);
        });
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.trim();
            console.log(`Navigating to: ${linkText}`);
            
            // Show loading state
            const originalText = link.textContent;
            link.textContent = 'Cargando...';
            link.style.pointerEvents = 'none';
            
            setTimeout(() => {
                link.textContent = originalText;
                link.style.pointerEvents = 'auto';
                alert(`Navegando a: ${linkText}\n\nEsta sección se implementará en la versión completa.`);
            }, 1000);
        });
    });

    // Summary section links
    const summaryLinks = document.querySelectorAll('.summary-column a');
    summaryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent;
            console.log(`Summary link clicked: ${linkText}`);
            alert(`Navegando a: ${linkText}\n\nEsta funcionalidad se implementará en la versión completa.`);
        });
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent;
            console.log(`Footer link clicked: ${linkText}`);
            alert(`Abriendo: ${linkText}\n\nEsta funcionalidad se implementará en la versión completa.`);
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