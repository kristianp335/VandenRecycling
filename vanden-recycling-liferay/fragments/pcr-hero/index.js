/**
 * PCR Hero Fragment JavaScript
 * Handles PCR page hero animations and interactions
 */

(function() {
    'use strict';
    
    // Fragment-specific state management
    window.PCRHero = window.PCRHero || {
        initialized: false,
        loading: false
    };
    
    /**
     * Initialize the PCR hero fragment
     */
    function initializePCRHero() {
        if (window.PCRHero.loading) return;
        window.PCRHero.loading = true;
        
        console.log('Initializing PCR Hero Fragment');
        
        // Check if we're in edit mode
        const editMode = document.body.classList.contains('has-edit-mode-menu');
        
        if (editMode) {
            // Simplified initialization for edit mode
            window.PCRHero.initialized = true;
            window.PCRHero.loading = false;
            return;
        }
        
        // Initialize scroll animations
        initializeScrollAnimations();
        
        // Initialize plastic icon interactions
        initializePlasticIcons();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        window.PCRHero.initialized = true;
        window.PCRHero.loading = false;
        
        console.log('PCR Hero Fragment initialized successfully');
    }
    
    /**
     * Initialize scroll-based animations
     */
    function initializeScrollAnimations() {
        // Only initialize if Intersection Observer is supported
        if (!window.IntersectionObserver) return;
        
        const plasticIcons = fragmentElement.querySelectorAll('.plastic-icon');
        if (!plasticIcons.length) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        plasticIcons.forEach(function(icon) {
            observer.observe(icon);
        });
    }
    
    /**
     * Initialize plastic icon interactions
     */
    function initializePlasticIcons() {
        const plasticIcons = fragmentElement.querySelectorAll('.plastic-icon');
        
        plasticIcons.forEach(function(icon) {
            const plasticType = icon.getAttribute('data-plastic');
            
            // Add hover effects
            icon.addEventListener('mouseenter', function() {
                showPlasticInfo(plasticType, icon);
            });
            
            icon.addEventListener('mouseleave', function() {
                hidePlasticInfo(icon);
            });
            
            // Add keyboard navigation
            icon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePlasticInfo(plasticType, icon);
                }
            });
            
            // Make icons focusable
            icon.setAttribute('tabindex', '0');
            icon.setAttribute('role', 'button');
            icon.setAttribute('aria-label', `Learn about ${getPlasticFullName(plasticType)}`);
        });
    }
    
    /**
     * Show plastic information on hover
     */
    function showPlasticInfo(plasticType, iconElement) {
        const info = getPlasticInfo(plasticType);
        if (!info) return;
        
        // Create or update tooltip
        let tooltip = iconElement.querySelector('.plastic-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'plastic-tooltip';
            iconElement.appendChild(tooltip);
        }
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${info.fullName}</strong>
                <p>${info.description}</p>
                <span class="tooltip-arrow"></span>
            </div>
        `;
        
        tooltip.classList.add('visible');
    }
    
    /**
     * Hide plastic information
     */
    function hidePlasticInfo(iconElement) {
        const tooltip = iconElement.querySelector('.plastic-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }
    
    /**
     * Toggle plastic information for keyboard users
     */
    function togglePlasticInfo(plasticType, iconElement) {
        const tooltip = iconElement.querySelector('.plastic-tooltip');
        if (tooltip && tooltip.classList.contains('visible')) {
            hidePlasticInfo(iconElement);
        } else {
            showPlasticInfo(plasticType, iconElement);
        }
    }
    
    /**
     * Get plastic type information
     */
    function getPlasticInfo(plasticType) {
        const plasticData = {
            'rPET': {
                fullName: 'Recycled Polyethylene Terephthalate',
                description: 'Commonly used for bottles and food packaging. Highly recyclable with excellent barrier properties.'
            },
            'rHDPE': {
                fullName: 'Recycled High-Density Polyethylene',
                description: 'Used for containers, bottles, and pipes. Known for excellent chemical resistance and durability.'
            },
            'rLDPE': {
                fullName: 'Recycled Low-Density Polyethylene',
                description: 'Used for films, bags, and flexible packaging. Offers good flexibility and chemical resistance.'
            },
            'rPP': {
                fullName: 'Recycled Polypropylene',
                description: 'Used for automotive parts, packaging, and textiles. Excellent heat resistance and versatility.'
            }
        };
        
        return plasticData[plasticType] || null;
    }
    
    /**
     * Get full name for accessibility
     */
    function getPlasticFullName(plasticType) {
        const info = getPlasticInfo(plasticType);
        return info ? info.fullName : plasticType;
    }
    
    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        const breadcrumbs = fragmentElement.querySelector('.breadcrumbs');
        const heroSection = fragmentElement.querySelector('.pcr-hero');
        const ctaButton = fragmentElement.querySelector('.pcr-cta');
        
        // Enhance breadcrumb accessibility
        if (breadcrumbs) {
            breadcrumbs.setAttribute('aria-label', 'Breadcrumb navigation');
        }
        
        // Ensure proper heading hierarchy
        const pageTitle = fragmentElement.querySelector('.pcr-title');
        if (pageTitle) {
            pageTitle.setAttribute('id', 'page-title');
            document.title = pageTitle.textContent + ' | Vanden Recycling';
        }
        
        // Enhance CTA button accessibility
        if (ctaButton) {
            const buttonText = ctaButton.textContent.trim();
            if (buttonText.toLowerCase() === 'get in touch') {
                ctaButton.setAttribute('aria-label', 'Contact us about post-consumer recycled plastics');
            }
        }
        
        // Add section landmark
        if (heroSection) {
            heroSection.setAttribute('aria-labelledby', 'page-title');
        }
    }
    
    /**
     * Add CSS for tooltips and additional styling
     */
    function addTooltipStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .plastic-tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 10px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                pointer-events: none;
            }
            
            .plastic-tooltip.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .tooltip-content {
                background: var(--vanden-black);
                color: var(--vanden-white);
                padding: var(--vanden-spacing-sm) var(--vanden-spacing-md);
                border-radius: var(--vanden-radius-md);
                box-shadow: var(--vanden-shadow-lg);
                min-width: 200px;
                max-width: 300px;
                text-align: left;
                position: relative;
            }
            
            .tooltip-content strong {
                display: block;
                margin-bottom: var(--vanden-spacing-xs);
                color: var(--vanden-accent-green);
                font-size: 0.9rem;
            }
            
            .tooltip-content p {
                margin: 0;
                font-size: 0.8rem;
                line-height: 1.4;
                opacity: 0.9;
            }
            
            .tooltip-arrow {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid var(--vanden-black);
            }
            
            .plastic-icon {
                position: relative;
            }
            
            @media (max-width: 768px) {
                .plastic-tooltip {
                    display: none;
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .plastic-tooltip {
                    transition: none;
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
                console.log('SPA Navigation completed, reinitializing PCR hero');
                
                // Reset state
                window.PCRHero.initialized = false;
                window.PCRHero.loading = false;
                
                // Reinitialize PCR hero
                setTimeout(initializePCRHero, 100);
            });
            
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup tooltips before navigation
                const tooltips = fragmentElement.querySelectorAll('.plastic-tooltip');
                tooltips.forEach(function(tooltip) {
                    tooltip.remove();
                });
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializePCRHero, 100);
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
    if (window.PCRHero.initialized) {
        return;
    }
    
    // Initialize everything
    ready(function() {
        addTooltipStyles();
        setupSennaJSHandlers();
        initializePCRHero();
    });
    
})();