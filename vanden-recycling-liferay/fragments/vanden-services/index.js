/**
 * Vanden Services Fragment JavaScript
 * Handles service cards animations and interactions
 */

(function() {
    'use strict';
    
    // Fragment-specific state management
    window.VandenServices = window.VandenServices || {
        initialized: false,
        loading: false
    };
    
    /**
     * Initialize the services fragment
     */
    function initializeServices() {
        if (window.VandenServices.loading) return;
        window.VandenServices.loading = true;
        
        console.log('Initializing Vanden Services Fragment');
        
        // Check if we're in edit mode
        const editMode = document.body.classList.contains('has-edit-mode-menu');
        
        if (editMode) {
            // Simplified initialization for edit mode
            window.VandenServices.initialized = true;
            window.VandenServices.loading = false;
            return;
        }
        
        // Initialize scroll animations
        initializeScrollAnimations();
        
        // Initialize card interactions
        initializeCardInteractions();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        window.VandenServices.initialized = true;
        window.VandenServices.loading = false;
        
        console.log('Vanden Services Fragment initialized successfully');
    }
    
    /**
     * Initialize scroll-based animations
     */
    function initializeScrollAnimations() {
        // Only initialize if Intersection Observer is supported
        if (!window.IntersectionObserver) return;
        
        const serviceCards = fragmentElement.querySelectorAll('.service-card');
        if (!serviceCards.length) return;
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate icon on first view
                    const icon = entry.target.querySelector('.service-icon svg');
                    if (icon) {
                        setTimeout(() => {
                            icon.style.animation = 'iconBounce 0.6s ease-out';
                        }, 300);
                    }
                }
            });
        }, observerOptions);
        
        serviceCards.forEach(function(card) {
            observer.observe(card);
        });
    }
    
    /**
     * Initialize card interactions
     */
    function initializeCardInteractions() {
        const serviceCards = fragmentElement.querySelectorAll('.service-card');
        
        serviceCards.forEach(function(card) {
            const serviceLink = card.querySelector('.service-link');
            const serviceCta = card.querySelector('.service-cta');
            
            // Card hover effects
            card.addEventListener('mouseenter', function() {
                card.classList.add('card-hovered');
            });
            
            card.addEventListener('mouseleave', function() {
                card.classList.remove('card-hovered');
            });
            
            // Make entire card clickable (accessibility-friendly)
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on an actual link
                if (e.target.closest('a')) return;
                
                // Find the primary link and trigger it
                const primaryLink = serviceLink || serviceCta;
                if (primaryLink) {
                    primaryLink.click();
                }
            });
            
            // Keyboard navigation for cards
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const primaryLink = serviceLink || serviceCta;
                    if (primaryLink) {
                        primaryLink.click();
                    }
                }
            });
            
            // Add tabindex for keyboard navigation if no focusable elements
            if (!card.querySelector('a, button, [tabindex]')) {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', `Learn more about ${card.querySelector('.service-title')?.textContent || 'this service'}`);
            }
        });
    }
    
    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        const serviceCards = fragmentElement.querySelectorAll('.service-card');
        
        serviceCards.forEach(function(card, index) {
            const serviceTitle = card.querySelector('.service-title');
            const serviceDescription = card.querySelector('.service-description');
            const serviceCta = card.querySelector('.service-cta');
            
            // Ensure proper heading hierarchy
            if (serviceTitle) {
                serviceTitle.setAttribute('id', `service-${index + 1}-title`);
            }
            
            // Link descriptions to titles for screen readers
            if (serviceCta && serviceTitle) {
                serviceCta.setAttribute('aria-describedby', `service-${index + 1}-title`);
            }
            
            // Enhance CTA accessibility
            if (serviceCta) {
                const ctaText = serviceCta.textContent.trim();
                const serviceText = serviceTitle ? serviceTitle.textContent.trim() : '';
                
                if (ctaText.toLowerCase().includes('learn more') || ctaText.toLowerCase().includes('view') || ctaText.toLowerCase().includes('our')) {
                    serviceCta.setAttribute('aria-label', `${ctaText} about ${serviceText}`);
                }
                
                // Check if link is external
                const href = serviceCta.getAttribute('href');
                if (href && (href.includes('blog.vandenrecycling.com') || href.startsWith('http'))) {
                    serviceCta.setAttribute('aria-label', `${serviceCta.getAttribute('aria-label') || ctaText} (opens in new tab)`);
                }
            }
            
            // Add semantic structure
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `service-${index + 1}-title`);
        });
        
        // Ensure section has proper landmark
        const servicesSection = fragmentElement.querySelector('.vanden-services');
        if (servicesSection) {
            servicesSection.setAttribute('aria-label', 'Our Services');
        }
    }
    
    /**
     * Add CSS for additional animations
     */
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes iconBounce {
                0%, 100% {
                    transform: scale(1);
                }
                25% {
                    transform: scale(1.1);
                }
                50% {
                    transform: scale(1.05);
                }
                75% {
                    transform: scale(1.15);
                }
            }
            
            .service-card.card-hovered .service-icon svg {
                animation: iconBounce 0.6s ease-out;
            }
            
            .service-card:focus {
                outline: 2px solid var(--vanden-primary-green);
                outline-offset: 2px;
            }
            
            .service-card[role="button"]:hover {
                cursor: pointer;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .service-card.card-hovered .service-icon svg {
                    animation: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Handle layout adjustments based on configuration
     */
    function handleLayoutAdjustments() {
        const servicesGrid = fragmentElement.querySelector('.services-grid');
        if (!servicesGrid) return;
        
        const layoutClass = Array.from(servicesGrid.classList).find(cls => cls.startsWith('services-layout-'));
        
        // Adjust card interactions based on layout
        if (layoutClass === 'services-layout-horizontal' || layoutClass === 'services-layout-stacked') {
            const serviceCards = fragmentElement.querySelectorAll('.service-card');
            serviceCards.forEach(function(card) {
                // Enhance focus management for horizontal/stacked layouts
                const links = card.querySelectorAll('a');
                links.forEach(function(link, index) {
                    if (index === 0) {
                        link.classList.add('primary-link');
                    }
                });
            });
        }
    }
    
    /**
     * SennaJS Event Handlers
     */
    function setupSennaJSHandlers() {
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing services');
                
                // Reset state
                window.VandenServices.initialized = false;
                window.VandenServices.loading = false;
                
                // Reinitialize services
                setTimeout(initializeServices, 100);
            });
            
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup animations before navigation
                const serviceCards = fragmentElement.querySelectorAll('.service-card');
                serviceCards.forEach(function(card) {
                    card.classList.remove('animate-in', 'card-hovered');
                });
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializeServices, 100);
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
    if (window.VandenServices.initialized) {
        return;
    }
    
    // Initialize everything
    ready(function() {
        addAnimationStyles();
        setupSennaJSHandlers();
        handleLayoutAdjustments();
        initializeServices();
    });
    
})();