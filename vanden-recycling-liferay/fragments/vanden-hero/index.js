/**
 * Vanden Hero Fragment JavaScript
 * Handles hero section animations and interactions
 */

(function() {
    'use strict';
    
    // Fragment-specific state management
    window.VandenHero = window.VandenHero || {
        initialized: false,
        loading: false
    };
    
    /**
     * Initialize the hero fragment
     */
    function initializeHero() {
        if (window.VandenHero.loading) return;
        window.VandenHero.loading = true;
        
        console.log('Initializing Vanden Hero Fragment');
        
        // Check if we're in edit mode
        const editMode = document.body.classList.contains('has-edit-mode-menu');
        
        if (editMode) {
            // Simplified initialization for edit mode
            window.VandenHero.initialized = true;
            window.VandenHero.loading = false;
            return;
        }
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize intersection observer for scroll animations
        initializeScrollAnimations();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        window.VandenHero.initialized = true;
        window.VandenHero.loading = false;
        
        console.log('Vanden Hero Fragment initialized successfully');
    }
    
    /**
     * Initialize hero animations
     */
    function initializeAnimations() {
        const heroSection = fragmentElement.querySelector('.vanden-hero');
        if (!heroSection) return;
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Disable animations for users who prefer reduced motion
            heroSection.style.setProperty('--animation-duration', '0s');
            return;
        }
        
        // Add entrance animation
        heroSection.classList.add('hero-animate-in');
        
        // Stagger animation for hero elements
        const heroText = fragmentElement.querySelector('.hero-text');
        const heroVisual = fragmentElement.querySelector('.hero-visual');
        
        if (heroText) {
            setTimeout(() => {
                heroText.classList.add('animate-in');
            }, 200);
        }
        
        if (heroVisual) {
            setTimeout(() => {
                heroVisual.classList.add('animate-in');
            }, 400);
        }
    }
    
    /**
     * Initialize scroll-based animations
     */
    function initializeScrollAnimations() {
        // Only initialize if Intersection Observer is supported
        if (!window.IntersectionObserver) return;
        
        const heroSection = fragmentElement.querySelector('.vanden-hero');
        if (!heroSection) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                    
                    // Trigger recycling visual fade-in when in view
                    const recyclingVisual = entry.target.querySelector('.recycling-visual');
                    if (recyclingVisual) {
                        recyclingVisual.classList.add('animate-visible');
                        
                        // Fade in the recycling image
                        const recyclingImage = recyclingVisual.querySelector('.recycling-image');
                        if (recyclingImage) {
                            setTimeout(() => {
                                recyclingImage.style.opacity = '1';
                            }, 500);
                        }
                    }
                } else {
                    entry.target.classList.remove('in-viewport');
                }
            });
        }, observerOptions);
        
        observer.observe(heroSection);
    }
    
    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        const heroTitle = fragmentElement.querySelector('.hero-title');
        const heroSubtitle = fragmentElement.querySelector('.hero-subtitle');
        const ctaButton = fragmentElement.querySelector('.hero-cta');
        
        // Ensure proper heading hierarchy
        if (heroTitle) {
            // Check if this is the main page heading (scope limited to avoid conflicts)
            const existingH1 = document.querySelector('h1');
            if (!existingH1 || existingH1 === heroTitle) {
                heroTitle.setAttribute('role', 'banner');
            }
        }
        
        // Enhance CTA button accessibility
        if (ctaButton) {
            const buttonText = ctaButton.textContent.trim();
            if (buttonText.toLowerCase() === 'learn more') {
                ctaButton.setAttribute('aria-label', 'Learn more about our plastic recycling services');
            }
            
            // Add keyboard navigation enhancement
            ctaButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ctaButton.click();
                }
            });
        }
        
        // Add screen reader announcements for animations
        const recyclingVisual = fragmentElement.querySelector('.recycling-visual');
        if (recyclingVisual) {
            recyclingVisual.setAttribute('aria-label', 'Animated recycling symbol representing our circular economy approach');
            recyclingVisual.setAttribute('role', 'img');
        }
    }
    
    /**
     * Handle responsive behavior
     */
    function handleResponsive() {
        const heroSection = fragmentElement.querySelector('.vanden-hero');
        if (!heroSection) return;
        
        function updateLayout() {
            const windowWidth = window.innerWidth;
            
            // Adjust hero height on mobile
            if (windowWidth <= 768) {
                heroSection.style.minHeight = '60vh';
            } else if (windowWidth <= 1024) {
                heroSection.style.minHeight = '65vh';
            } else {
                heroSection.style.minHeight = '70vh';
            }
        }
        
        // Initial layout update
        updateLayout();
        
        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateLayout, 250);
        });
    }
    
    /**
     * Add CSS for entrance animations
     */
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .vanden-hero.hero-animate-in {
                animation: heroFadeIn 1s ease-out;
            }
            
            .hero-text.animate-in {
                animation: heroFadeIn 0.2s ease-out;
            }
            
            .hero-visual.animate-in {
                animation: heroFadeIn 0.2s ease-out;
            }
            
            .recycling-visual.animate-visible {
                animation: recyclingFadeIn 0.2s ease-out;
            }
            
            @keyframes heroFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes recyclingFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .vanden-hero.hero-animate-in,
                .hero-text.animate-in,
                .hero-visual.animate-in,
                .recycling-visual.animate-visible {
                    animation: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * SennaJS Event Handlers
     */
    function setupSennaJSHandlers() {
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing hero');
                
                // Reset state
                window.VandenHero.initialized = false;
                window.VandenHero.loading = false;
                
                // Reinitialize hero
                setTimeout(initializeHero, 100);
            });
            
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup animations before navigation
                const heroSection = fragmentElement.querySelector('.vanden-hero');
                if (heroSection) {
                    heroSection.classList.remove('hero-animate-in', 'in-viewport');
                }
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializeHero, 100);
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
    
    // Prevent multiple initializations
    if (window.VandenHero.initialized) {
        return;
    }
    
    // Initialize everything
    ready(function() {
        addAnimationStyles();
        setupSennaJSHandlers();
        handleResponsive();
        initializeHero();
    });
    
})();