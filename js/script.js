// script.js - Advanced Pro Level Animations & Effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initScrollAnimations();
    initParallaxEffects();
    initCursorEffects();
    initPageTransitions();
    initLoadingAnimations();
    initInteractiveElements();
    initThemeManager();
    initPerformanceOptimizer();
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add different animation classes based on element type
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                } else if (entry.target.classList.contains('fade-left')) {
                    entry.target.style.animation = 'fadeInLeft 0.8s ease forwards';
                } else if (entry.target.classList.contains('fade-right')) {
                    entry.target.style.animation = 'fadeInRight 0.8s ease forwards';
                } else if (entry.target.classList.contains('stagger-item')) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, delay);
                }
                
                // Add glow effect to cards when they come into view
                if (entry.target.classList.contains('glass-card')) {
                    entry.target.classList.add('animate-glow');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that need scroll animations
    document.querySelectorAll('.fade-in, .fade-left, .fade-right, .stagger-item, .glass-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== CUSTOM CURSOR EFFECTS =====
function initCursorEffects() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Cursor styles
    const cursorStyle = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #fdbb2d;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        }
        .custom-cursor.hover {
            transform: scale(1.5);
            background: rgba(253, 187, 45, 0.2);
        }
        .custom-cursor.click {
            transform: scale(0.8);
            background: rgba(253, 187, 45, 0.5);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cursorStyle;
    document.head.appendChild(styleSheet);

    // Cursor movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .class-card, .publication-card, .material-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Cursor click effect
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
    }
}

// ===== PAGE TRANSITIONS =====
function initPageTransitions() {
    // Add transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);

    const transitionStyle = `
        .page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a2a6c, #b21f1f);
            z-index: 9999;
            transform: scaleY(0);
            transform-origin: top;
            transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
            pointer-events: none;
        }
        .page-transition-overlay.active {
            transform: scaleY(1);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = transitionStyle;
    document.head.appendChild(styleSheet);

    // Smooth page transitions for internal links
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('http')) return;
            
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Start transition
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <i class="fas fa-graduation-cap"></i>
                <span>Bofexo</span>
            </div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    document.body.appendChild(loadingScreen);

    const loadingStyle = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f172a, #1a2a6c);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .loading-screen.hidden {
            opacity: 0;
            visibility: hidden;
        }
        .loading-content {
            text-align: center;
            color: white;
        }
        .loading-logo {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 2rem;
            margin-bottom: 2rem;
        }
        .loading-logo i {
            color: #fdbb2d;
            font-size: 2.5rem;
        }
        .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            overflow: hidden;
        }
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #fdbb2d, #ffa500);
            border-radius: 10px;
            animation: loading 2s ease-in-out infinite;
            transform-origin: left;
        }
        @keyframes loading {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(1); }
            100% { transform: scaleX(0); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyle;
    document.head.appendChild(styleSheet);

    // Simulate loading progress
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 800);
    }, 2000);
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Enhanced ripple effect
    document.querySelectorAll('.btn, .class-card, .publication-card, .material-card').forEach(element => {
        element.addEventListener('click', function(e) {
            // Create ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Magnetic buttons effect
    document.querySelectorAll('.btn, .auth-btn').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) * 0.1;
            const deltaY = (y - centerY) * 0.1;
            
            button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // Typewriter effect for headers
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    });
}

// ===== THEME MANAGER =====
function initThemeManager() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('bofexo-theme');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        }
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                this.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
                localStorage.setItem('bofexo-theme', 'dark');
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
                localStorage.setItem('bofexo-theme', 'light');
            }
            
            // Add theme transition animation
            document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        });
    }
}

// ===== PERFORMANCE OPTIMIZER =====
function initPerformanceOptimizer() {
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-based animations
            updateScrollProgress();
        }, 10);
    });

    // Scroll progress indicator
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    // Create scroll progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    progressContainer.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(progressContainer);

    const progressStyle = `
        .scroll-progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: transparent;
            z-index: 1000;
        }
        .scroll-progress {
            height: 100%;
            background: linear-gradient(90deg, #fdbb2d, #ffa500);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressStyle;
    document.head.appendChild(styleSheet);
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        // Add search animation
        const searchBtn = document.querySelector('.search-bar button');
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            searchBtn.innerHTML = '<i class="fas fa-search"></i>';
            // Implement actual search logic here
            alert('Searching for: ' + searchTerm);
        }, 1000);
    }
}

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Add menu animation
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// ===== AUTH MODAL =====
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.toggle('active');
        
        if (modal.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// ===== UTILITY FUNCTIONS =====
// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS animations dynamically
const dynamicAnimations = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes animate-glow {
        0%, 100% { box-shadow: 0 0 5px rgba(253, 187, 45, 0.3); }
        50% { box-shadow: 0 0 20px rgba(253, 187, 45, 0.6); }
    }
    
    .animate-glow {
        animation: animate-glow 2s ease-in-out infinite;
    }
`;

// Inject dynamic animations
const style = document.createElement('style');
style.textContent = dynamicAnimations;
document.head.appendChild(style);

// Export functions for global access
window.performSearch = performSearch;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleAuthModal = toggleAuthModal;