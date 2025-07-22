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
        
        // Removed animations for LCP optimization - content shows immediately
        
        // Initialize accessibility features
        initializeAccessibility();
        
        window.VandenHero.initialized = true;
        window.VandenHero.loading = false;
        
        console.log('Vanden Hero Fragment initialized successfully');
    }
    
    // Removed initializeAnimations function - no delays for LCP optimization
    
    // Removed initializeScrollAnimations function - no intersection observer delays for LCP
    
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
        
        // Add screen reader support
        const recyclingVisual = fragmentElement.querySelector('.recycling-visual');
        if (recyclingVisual) {
            recyclingVisual.setAttribute('aria-label', 'Recycling symbol representing our circular economy approach');
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
    
    // Removed addAnimationStyles function - no CSS animations for LCP optimization
    
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
    
    // Initialize everything - removed animation styles for LCP optimization
    ready(function() {
        setupSennaJSHandlers();
        handleResponsive();
        initializeHero();
    });
    
})();