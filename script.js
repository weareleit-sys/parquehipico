// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.querySelector('.search-input input');
    const searchBtn = document.querySelector('.search-btn');

    // Category selection
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            const activeCategory = document.querySelector('.category-btn.active').textContent;
            
            if (searchTerm) {
                alert(`Buscando "${searchTerm}" en la categoría: ${activeCategory}`);
                // Here you would implement actual search functionality
            } else {
                alert('Por favor, ingresa un término de búsqueda');
            }
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
});

// Hero buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    const verCarrerasBtn = document.querySelector('.btn-primary');
    const apostarBtn = document.querySelector('.btn-secondary');

    if (verCarrerasBtn) {
        verCarrerasBtn.addEventListener('click', function() {
            // Scroll to calendar section
            const calendarSection = document.querySelector('.calendar-section');
            if (calendarSection) {
                calendarSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (apostarBtn) {
        apostarBtn.addEventListener('click', function() {
            alert('Redirigiendo al sistema de apuestas...');
            // Here you would redirect to betting system
        });
    }
});

// News card interactions
document.addEventListener('DOMContentLoaded', function() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        card.addEventListener('click', function() {
            const newsLink = this.querySelector('.news-link');
            if (newsLink) {
                alert('Abriendo noticia completa...');
                // Here you would open the full news article
            }
        });
    });
});

// Loading simulation for calendar
document.addEventListener('DOMContentLoaded', function() {
    const loadingMessage = document.querySelector('.loading-message');
    
    if (loadingMessage) {
        // Simulate loading for 3 seconds
        setTimeout(() => {
            loadingMessage.innerHTML = `
                <div style="text-align: center;">
                    <h4>Programa de Carreras Cargado</h4>
                    <p>Próxima jornada: Domingo 10 de Octubre</p>
                    <div style="margin-top: 20px;">
                        <button class="btn-primary" style="margin: 5px;">Ver Programa</button>
                        <button class="btn-secondary" style="margin: 5px;">Ver Resultados</button>
                    </div>
                </div>
            `;
        }, 3000);
    }
});

// Live stream functionality
document.addEventListener('DOMContentLoaded', function() {
    const streamPlaceholder = document.querySelector('.stream-placeholder');
    
    if (streamPlaceholder) {
        streamPlaceholder.addEventListener('click', function() {
            alert('Iniciando transmisión en vivo...');
            // Here you would start the live stream
        });
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Scroll animations
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add scroll animation to elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.news-card, .service-card, .gallery-item');
    
    function handleScrollAnimation() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Check on load
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.header');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = '#8B0000';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = '#8B0000';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    }
});

// Dropdown menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (menu) {
            dropdown.addEventListener('mouseenter', function() {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            });
            
            dropdown.addEventListener('mouseleave', function() {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            });
        }
    });
});

// Footer links functionality
document.addEventListener('DOMContentLoaded', function() {
    const footerLinks = document.querySelectorAll('.footer-column a, .footer-links-bottom a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            alert(`Navegando a: ${linkText}`);
            // Here you would navigate to the actual page
        });
    });
});

// Add loading states to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .search-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Cargando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
});

// Add hover effects to news cards
document.addEventListener('DOMContentLoaded', function() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Add click tracking for analytics (placeholder)
function trackClick(element, action) {
    console.log(`User clicked: ${action} on ${element}`);
    // Here you would send analytics data
}

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Club Hípico de Santiago - Website loaded successfully');
    
    // Add any additional initialization code here
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.backgroundAttachment = 'fixed';
    }
});