/**
 * Vanden Recycling Global JavaScript
 * Provides SPA navigation support and global functionality
 */

(function() {
    'use strict';
    
    // Global state management
    window.VandenGlobal = window.VandenGlobal || {
        initialized: false,
        loading: false
    };
    
    // Prevent multiple initializations
    if (window.VandenGlobal.initialized) {
        return;
    }
    
    /**
     * Initialize Vanden Global functionality
     */
    function initializeVanden() {
        if (window.VandenGlobal.loading) return;
        window.VandenGlobal.loading = true;
        
        console.log('Initializing Vanden Global JavaScript');
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        // Initialize mobile menu handling
        initMobileMenus();
        
        // Initialize loading animations
        initLoadingAnimations();
        
        // Initialize accessibility features
        initAccessibility();
        
        window.VandenGlobal.initialized = true;
        window.VandenGlobal.loading = false;
        
        console.log('Vanden Global JavaScript initialized successfully');
    }
    
    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerHeight = getHeaderHeight();
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
    
    /**
     * Get current header height for scroll offset
     */
    function getHeaderHeight() {
        const header = document.querySelector('.vanden-header, header, .navbar');
        return header ? header.offsetHeight : 80;
    }
    
    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenus() {
        // Handle hamburger menu toggles
        document.addEventListener('click', function(e) {
            const menuToggle = e.target.closest('.vanden-menu-toggle, .hamburger-menu, .mobile-menu-toggle');
            if (!menuToggle) return;
            
            e.preventDefault();
            
            const menu = document.querySelector('.vanden-mobile-menu, .mobile-menu');
            const body = document.body;
            
            if (menu) {
                menu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                body.classList.toggle('menu-open');
                
                // Update ARIA attributes
                const expanded = menu.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', expanded);
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const menu = document.querySelector('.vanden-mobile-menu.active, .mobile-menu.active');
            if (!menu) return;
            
            const menuToggle = document.querySelector('.vanden-menu-toggle, .hamburger-menu, .mobile-menu-toggle');
            
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                menu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const menu = document.querySelector('.vanden-mobile-menu.active, .mobile-menu.active');
                if (menu) {
                    menu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    const menuToggle = document.querySelector('.vanden-menu-toggle, .hamburger-menu, .mobile-menu-toggle');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.focus();
                    }
                }
            }
        });
    }
    
    /**
     * Initialize loading animations and intersection observers
     */
    function initLoadingAnimations() {
        // Fade in elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animateElements = document.querySelectorAll('.vanden-animate, .fade-in, .slide-up');
        animateElements.forEach(function(el) {
            observer.observe(el);
        });
    }
    
    /**
     * Initialize accessibility features
     */
    function initAccessibility() {
        // Skip to main content link
        const skipLink = document.querySelector('.skip-to-main');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const main = document.querySelector('main, .main-content, [role="main"]');
                if (main) {
                    main.focus();
                    main.scrollIntoView();
                }
            });
        }
        
        // Improve focus management for dropdowns
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Handle tab navigation in dropdowns
                const activeDropdown = document.querySelector('.dropdown.active, .submenu.active');
                if (activeDropdown) {
                    const focusableElements = activeDropdown.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    /**
     * Utility function to debounce function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Handle window resize events
     */
    const handleResize = debounce(function() {
        // Close mobile menus on resize
        const mobileMenu = document.querySelector('.vanden-mobile-menu.active, .mobile-menu.active');
        if (mobileMenu && window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            const menuToggle = document.querySelector('.vanden-menu-toggle, .hamburger-menu, .mobile-menu-toggle');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    /**
     * SennaJS Event Handlers for SPA Navigation
     */
    function setupSennaJSHandlers() {
        // Handle SPA navigation completion
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing Vanden components');
                
                // Reset global state
                window.VandenGlobal.initialized = false;
                window.VandenGlobal.loading = false;
                
                // Reinitialize after navigation
                setTimeout(initializeVanden, 100);
            });
            
            // Handle screen transitions
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup before navigation
                document.body.classList.remove('menu-open');
            });
            
            Liferay.on('screenFlip', function(event) {
                // Reinitialize after screen flip
                setTimeout(initializeVanden, 50);
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializeVanden, 100);
        });
    }
    
    /**
     * Initialize when DOM is ready
     */
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    // Initialize everything
    ready(function() {
        setupSennaJSHandlers();
        initializeVanden();
    });
    
    // Export utilities for use by fragments
    window.VandenUtils = {
        debounce: debounce,
        getHeaderHeight: getHeaderHeight,
        initializeVanden: initializeVanden
    };
    
})();