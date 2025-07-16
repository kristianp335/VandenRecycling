/**
 * Vanden Footer Fragment JavaScript
 * Handles footer functionality and dynamic year updates
 */

(function() {
    'use strict';
    
    // Fragment-specific state management
    window.VandenFooter = window.VandenFooter || {
        initialized: false,
        loading: false
    };
    
    /**
     * Initialize the footer fragment
     */
    function initializeFooter() {
        if (window.VandenFooter.loading) return;
        window.VandenFooter.loading = true;
        
        console.log('Initializing Vanden Footer Fragment');
        
        // Update current year
        updateCurrentYear();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Initialize social link tracking
        initializeSocialTracking();
        
        window.VandenFooter.initialized = true;
        window.VandenFooter.loading = false;
        
        console.log('Vanden Footer Fragment initialized successfully');
    }
    
    /**
     * Update current year in copyright
     */
    function updateCurrentYear() {
        const yearElement = fragmentElement.querySelector('.current-year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }
    
    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        const footerNav = fragmentElement.querySelectorAll('.footer-nav');
        const socialLinks = fragmentElement.querySelectorAll('.footer-social a');
        
        // Enhance footer navigation accessibility
        footerNav.forEach(function(nav, index) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', `Footer navigation ${index + 1}`);
        });
        
        // Enhance social links
        socialLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && href.includes('linkedin')) {
                link.setAttribute('aria-label', 'Follow Vanden Recycling on LinkedIn (opens in new tab)');
            } else if (href && href.includes('twitter')) {
                link.setAttribute('aria-label', 'Follow Vanden Recycling on Twitter (opens in new tab)');
            }
        });
        
        // Ensure main footer has proper landmark
        const footer = fragmentElement.querySelector('.vanden-footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
        }
        
        // Enhance CTA section accessibility
        const ctaSection = fragmentElement.querySelector('.vanden-footer-cta');
        if (ctaSection) {
            ctaSection.setAttribute('aria-label', 'Contact us call to action');
        }
    }
    
    /**
     * Initialize social link tracking (optional analytics)
     */
    function initializeSocialTracking() {
        const socialLinks = fragmentElement.querySelectorAll('.footer-social a');
        
        socialLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = link.getAttribute('href');
                let platform = 'unknown';
                
                if (href && href.includes('linkedin')) {
                    platform = 'linkedin';
                } else if (href && href.includes('twitter')) {
                    platform = 'twitter';
                }
                
                // Analytics tracking (if available)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_click', {
                        'social_platform': platform,
                        'location': 'footer'
                    });
                }
                
                console.log(`Social link clicked: ${platform}`);
            });
        });
    }
    
    /**
     * Handle external link behavior
     */
    function handleExternalLinks() {
        const externalLinks = fragmentElement.querySelectorAll('a[target="_blank"]');
        
        externalLinks.forEach(function(link) {
            // Ensure proper security attributes
            if (!link.getAttribute('rel')) {
                link.setAttribute('rel', 'noopener');
            } else if (!link.getAttribute('rel').includes('noopener')) {
                link.setAttribute('rel', link.getAttribute('rel') + ' noopener');
            }
            
            // Add visual indicator for screen readers
            const linkText = link.textContent;
            if (!linkText.includes('(opens in new tab)')) {
                link.setAttribute('aria-label', `${linkText} (opens in new tab)`);
            }
        });
    }
    
    /**
     * SennaJS Event Handlers
     */
    function setupSennaJSHandlers() {
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing footer');
                
                // Reset state
                window.VandenFooter.initialized = false;
                window.VandenFooter.loading = false;
                
                // Reinitialize footer
                setTimeout(initializeFooter, 100);
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializeFooter, 100);
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
    if (window.VandenFooter.initialized) {
        return;
    }
    
    // Initialize everything
    ready(function() {
        setupSennaJSHandlers();
        handleExternalLinks();
        initializeFooter();
    });
    
})();