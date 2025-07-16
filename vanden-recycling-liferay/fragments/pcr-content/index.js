/**
 * PCR Content Fragment JavaScript
 * Handles content section animations and interactions
 */

(function() {
    'use strict';
    
    // Fragment-specific state management
    window.PCRContent = window.PCRContent || {
        initialized: false,
        loading: false
    };
    
    /**
     * Initialize the PCR content fragment
     */
    function initializePCRContent() {
        if (window.PCRContent.loading) return;
        window.PCRContent.loading = true;
        
        console.log('Initializing PCR Content Fragment');
        
        // Check if we're in edit mode
        const editMode = document.body.classList.contains('has-edit-mode-menu');
        
        if (editMode) {
            // Simplified initialization for edit mode
            window.PCRContent.initialized = true;
            window.PCRContent.loading = false;
            return;
        }
        
        // Initialize scroll animations
        initializeScrollAnimations();
        
        // Initialize monitoring items interactions
        initializeMonitoringItems();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        window.PCRContent.initialized = true;
        window.PCRContent.loading = false;
        
        console.log('PCR Content Fragment initialized successfully');
    }
    
    /**
     * Initialize scroll-based animations
     */
    function initializeScrollAnimations() {
        // Only initialize if Intersection Observer is supported
        if (!window.IntersectionObserver) return;
        
        const monitoringItems = fragmentElement.querySelectorAll('.monitoring-item');
        const complianceSection = fragmentElement.querySelector('.compliance-section');
        const finalCtaSection = fragmentElement.querySelector('.final-cta-section');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe monitoring items
        monitoringItems.forEach(function(item) {
            observer.observe(item);
        });
        
        // Observe sections
        if (complianceSection) {
            observer.observe(complianceSection);
        }
        
        if (finalCtaSection) {
            observer.observe(finalCtaSection);
        }
    }
    
    /**
     * Initialize monitoring items interactions
     */
    function initializeMonitoringItems() {
        const monitoringItems = fragmentElement.querySelectorAll('.monitoring-item');
        
        monitoringItems.forEach(function(item, index) {
            // Add hover effects with enhanced accessibility
            item.addEventListener('mouseenter', function() {
                item.classList.add('item-hovered');
                
                // Add subtle animation to icon
                const icon = item.querySelector('.monitoring-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                item.classList.remove('item-hovered');
                
                // Reset icon animation
                const icon = item.querySelector('.monitoring-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
            
            // Add keyboard navigation
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Could trigger a modal or more info display
                    showMonitoringInfo(item, index);
                }
            });
            
            // Make items focusable for keyboard users
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            
            const itemText = item.querySelector('span');
            if (itemText) {
                item.setAttribute('aria-label', `Learn more about ${itemText.textContent}`);
            }
        });
    }
    
    /**
     * Show monitoring information (placeholder for future enhancement)
     */
    function showMonitoringInfo(item, index) {
        const itemText = item.querySelector('span').textContent;
        console.log(`Monitoring item selected: ${itemText}`);
        
        // This could be enhanced to show detailed information
        // For now, just provide visual feedback
        item.style.animation = 'itemPulse 0.6s ease-out';
        
        setTimeout(() => {
            item.style.animation = '';
        }, 600);
    }
    
    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        const contentSection = fragmentElement.querySelector('.pcr-content');
        const monitoringSection = fragmentElement.querySelector('.monitoring-section');
        const complianceSection = fragmentElement.querySelector('.compliance-section');
        const finalCtaSection = fragmentElement.querySelector('.final-cta-section');
        
        // Add proper section landmarks
        if (contentSection) {
            contentSection.setAttribute('aria-label', 'Post-consumer recycled plastic content');
        }
        
        if (monitoringSection) {
            monitoringSection.setAttribute('aria-label', 'Quality monitoring aspects');
        }
        
        if (complianceSection) {
            complianceSection.setAttribute('aria-label', 'Compliance information');
        }
        
        if (finalCtaSection) {
            finalCtaSection.setAttribute('aria-label', 'Contact call to action');
        }
        
        // Enhance CTA buttons accessibility
        const ctaButtons = fragmentElement.querySelectorAll('.vanden-btn');
        ctaButtons.forEach(function(button) {
            const buttonText = button.textContent.trim();
            if (buttonText.toLowerCase().includes('get in touch')) {
                button.setAttribute('aria-label', 'Contact us about post-consumer recycled plastics');
            }
        });
        
        // Ensure proper heading hierarchy
        const headings = fragmentElement.querySelectorAll('h2, h3');
        headings.forEach(function(heading, index) {
            if (!heading.getAttribute('id')) {
                heading.setAttribute('id', `pcr-content-heading-${index + 1}`);
            }
        });
        
        // Add skip links for screen readers
        addSkipLinks();
    }
    
    /**
     * Add skip links for better navigation
     */
    function addSkipLinks() {
        const contentMain = fragmentElement.querySelector('.content-main');
        const monitoringSection = fragmentElement.querySelector('.monitoring-section');
        
        if (contentMain && monitoringSection) {
            const skipLink = document.createElement('a');
            skipLink.href = '#monitoring-section';
            skipLink.textContent = 'Skip to monitoring aspects';
            skipLink.className = 'sr-only skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--vanden-primary-green);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000;
            `;
            
            skipLink.addEventListener('focus', function() {
                this.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', function() {
                this.style.top = '-40px';
            });
            
            contentMain.insertBefore(skipLink, contentMain.firstChild);
            
            // Add ID to monitoring section
            monitoringSection.setAttribute('id', 'monitoring-section');
        }
    }
    
    /**
     * Add CSS for additional animations
     */
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes itemPulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            .monitoring-item .monitoring-icon {
                transition: transform 0.3s ease;
            }
            
            .monitoring-item:focus {
                outline: 2px solid var(--vanden-primary-green);
                outline-offset: 2px;
            }
            
            .compliance-section.animate-in {
                animation: sectionFadeIn 1s ease-out;
            }
            
            .final-cta-section.animate-in {
                animation: sectionSlideUp 0.8s ease-out;
            }
            
            @keyframes sectionFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes sectionSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .monitoring-item .monitoring-icon {
                    transition: none;
                }
                
                .compliance-section.animate-in,
                .final-cta-section.animate-in {
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
        const contentGrid = fragmentElement.querySelector('.content-grid');
        if (!contentGrid) return;
        
        const layoutClass = Array.from(contentGrid.classList).find(cls => cls.startsWith('content-layout-'));
        
        // Adjust content based on layout
        if (layoutClass === 'content-layout-single-column') {
            const sidebar = fragmentElement.querySelector('.content-sidebar');
            if (sidebar) {
                // Move sidebar content to main content area
                const sidebarCard = sidebar.querySelector('.sidebar-card');
                if (sidebarCard) {
                    sidebarCard.style.marginTop = 'var(--vanden-spacing-lg)';
                }
            }
        }
    }
    
    /**
     * SennaJS Event Handlers
     */
    function setupSennaJSHandlers() {
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing PCR content');
                
                // Reset state
                window.PCRContent.initialized = false;
                window.PCRContent.loading = false;
                
                // Reinitialize PCR content
                setTimeout(initializePCRContent, 100);
            });
            
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup animations before navigation
                const animatedElements = fragmentElement.querySelectorAll('.animate-in, .item-hovered');
                animatedElements.forEach(function(element) {
                    element.classList.remove('animate-in', 'item-hovered');
                });
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializePCRContent, 100);
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
    if (window.PCRContent.initialized) {
        return;
    }
    
    // Initialize everything
    ready(function() {
        addAnimationStyles();
        setupSennaJSHandlers();
        handleLayoutAdjustments();
        initializePCRContent();
    });
    
})();