/* JavaScript for sp-service-blocks */

// Global state management for service blocks
window.spServiceBlocks = window.spServiceBlocks || {
    initialized: false,
    loading: false
};

// Initialize service blocks functionality
function initializeServiceBlocks() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Service blocks: Edit mode detected - simplified initialization');
        // In edit mode, ensure immediate visibility without animations
        initializeForEditMode();
        return;
    }
    
    // Prevent multiple simultaneous loads
    if (window.spServiceBlocks.loading) {
        console.log('Service blocks already loading, skipping...');
        return;
    }
    
    if (window.spServiceBlocks.initialized) {
        console.log('Service blocks already initialized, skipping...');
        return;
    }
    
    window.spServiceBlocks.loading = true;
    console.log('Initializing service blocks...');
    
    // Initialize scroll animations and interactions
    initializeScrollAnimations();
    initializeHoverEffects();
    
    // Mark as completed
    window.spServiceBlocks.loading = false;
    window.spServiceBlocks.initialized = true;
}

// Edit mode initialization - no animations or lazy loading
function initializeForEditMode() {
    const serviceBlocks = document.querySelectorAll('.service-block');
    serviceBlocks.forEach(block => {
        // Make immediately visible in edit mode
        block.style.opacity = '1';
        block.style.transform = 'none';
        block.style.visibility = 'visible';
    });
    
    // Mark as completed
    window.spServiceBlocks.loading = false;
    window.spServiceBlocks.initialized = true;
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const serviceBlocks = document.querySelectorAll('.service-block');
    
    // Use Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '20px'
        });
        
        serviceBlocks.forEach(block => {
            // Set initial state for animation
            block.style.opacity = '0';
            block.style.transform = 'translateY(20px)';
            block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            observer.observe(block);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        serviceBlocks.forEach(block => {
            block.style.opacity = '1';
            block.style.transform = 'none';
        });
    }
}

// Initialize hover effects
function initializeHoverEffects() {
    const serviceBlocks = document.querySelectorAll('.service-block');
    
    serviceBlocks.forEach(block => {
        // Enhanced hover effects
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Setup service blocks with SennaJS support
(function setupServiceBlocks() {
    // Immediate initialization if DOM is ready
    if (document.readyState !== 'loading') {
        initializeServiceBlocks();
    } else {
        document.addEventListener('DOMContentLoaded', initializeServiceBlocks);
    }
    
    // SennaJS support with cleanup
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            console.log('SennaJS navigation completed, reinitializing service blocks...');
            window.spServiceBlocks.initialized = false;
            window.spServiceBlocks.loading = false;
            setTimeout(initializeServiceBlocks, 200);
        });
        
        Liferay.on('beforeScreenFlip', function() {
            console.log('SennaJS screen flip starting...');
        });
        
        Liferay.on('screenFlip', function() {
            console.log('SennaJS screen flip completed, reinitializing service blocks...');
            setTimeout(initializeServiceBlocks, 100);
        });
    }
    
    // Additional SennaJS events
    document.addEventListener('beforeNavigate', function() {
        console.log('Before navigate event triggered for service blocks');
    });
    
    document.addEventListener('navigate', function() {
        console.log('Navigate event triggered, reinitializing service blocks...');
        setTimeout(initializeServiceBlocks, 100);
    });
})();
