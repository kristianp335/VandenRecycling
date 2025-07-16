/**
 * Scottish Power Corporate Website JavaScript
 * Handles interactive functionality and animations
 */

(function() {
    'use strict';
    
    // Initialize on DOM ready - Performance optimized
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation(); // Critical for interaction
        
        // Defer non-critical features using requestIdleCallback
        if (window.requestIdleCallback) {
            requestIdleCallback(function() {
                initializeScrollAnimations();
                initializeFormValidation();
                initializeHoverEffects();
                initializeCarousels();
            });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(function() {
                initializeScrollAnimations();
                initializeFormValidation();
                initializeHoverEffects();
                initializeCarousels();
            }, 100);
        }
    });
    
    /**
     * Initialize scroll animations for elements - Performance optimized
     */
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
        if (!animatedElements.length) return;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
    }
    
    /**
     * Initialize navigation functionality
     */
    function initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        // Handle dropdown menus
        dropdownToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                    if (menu !== dropdown) {
                        menu.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('show');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                    menu.classList.remove('show');
                });
            }
        });
        
        // Smooth scrolling for anchor links
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    /**
     * Initialize form validation
     */
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(function(input) {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        showFieldError(input, 'This field is required');
                    } else {
                        input.classList.remove('error');
                        hideFieldError(input);
                    }
                    
                    // Email validation
                    if (input.type === 'email' && input.value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            showFieldError(input, 'Please enter a valid email address');
                        }
                    }
                    
                    // Postcode validation for UK postcodes
                    if (input.name === 'postcode' && input.value.trim()) {
                        const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
                        if (!postcodeRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            showFieldError(input, 'Please enter a valid UK postcode');
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    }
    
    /**
     * Show field error message
     */
    function showFieldError(input, message) {
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '5px';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        errorElement.textContent = message;
    }
    
    /**
     * Hide field error message
     */
    function hideFieldError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }
    
    /**
     * Initialize hover effects
     */
    function initializeHoverEffects() {
        const cards = document.querySelectorAll('.card, .service-block');
        
        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
        });
    }
    
    /**
     * Initialize carousels and sliders
     */
    function initializeCarousels() {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach(function(carousel) {
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');
            let currentIndex = 0;
            
            if (items.length === 0) return;
            
            // Show initial item
            items[0].classList.add('active');
            
            // Next button functionality
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    items[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % items.length;
                    items[currentIndex].classList.add('active');
                });
            }
            
            // Previous button functionality
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    items[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    items[currentIndex].classList.add('active');
                });
            }
            
            // Auto-advance carousel
            setInterval(function() {
                if (nextBtn) {
                    nextBtn.click();
                }
            }, 5000);
        });
    }
    
    /**
     * Utility function to debounce events
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
     * Initialize sticky navigation
     */
    function initializeStickyNav() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const sticky = navbar.offsetTop;
        
        function handleScroll() {
            if (window.pageYOffset > sticky) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        }
        
        window.addEventListener('scroll', debounce(handleScroll, 10));
    }
    
    /**
     * Initialize mobile menu
     */
    function initializeMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }
    
    // Initialize additional features
    window.addEventListener('load', function() {
        initializeStickyNav();
        initializeMobileMenu();
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        // Recalculate layouts if needed
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    }, 250));
    
})();
