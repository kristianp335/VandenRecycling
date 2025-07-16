/* JavaScript for sp-hero */

// Global state management for hero section
window.spHero = window.spHero || {
    initialized: false,
    loading: false
};

// Initialize hero section functionality
function initializeHero() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Hero: Edit mode detected - simplified initialization');
        // In edit mode, ensure immediate visibility without animations
        initializeForEditMode();
        return;
    }
    
    // Prevent multiple simultaneous loads
    if (window.spHero.loading) {
        console.log('Hero already loading, skipping...');
        return;
    }
    
    if (window.spHero.initialized) {
        console.log('Hero already initialized, skipping...');
        return;
    }
    
    window.spHero.loading = true;
    console.log('Initializing hero section...');
    
    // Initialize hero functionality
    initializeHeroAnimations();
    initializeQuoteForm();
    
    // Mark as completed
    window.spHero.loading = false;
    window.spHero.initialized = true;
}

// Edit mode initialization - no animations or lazy loading
function initializeForEditMode() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'none';
        heroContent.style.visibility = 'visible';
    }
    
    if (heroImage) {
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'none';
        heroImage.style.visibility = 'visible';
    }
    
    // Mark as completed
    window.spHero.loading = false;
    window.spHero.initialized = true;
}

// Initialize hero animations
function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    // Animate hero content on load
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Animate hero image on load
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(30px)';
        heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 400);
    }
}

// Initialize quote form functionality
function initializeQuoteForm() {
    const quoteForm = document.querySelector('.quote-form');
    const quoteButton = document.querySelector('.quote-btn');
    
    if (quoteButton) {
        quoteButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Handle quote form submission
            console.log('Quote form submitted');
        });
    }
    
    // Form validation
    if (quoteForm) {
        const inputs = quoteForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Validate form field
function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('error');
        return false;
    } else {
        field.classList.remove('error');
        return true;
    }
}

// Setup hero with SennaJS support
(function setupHero() {
    // Immediate initialization if DOM is ready
    if (document.readyState !== 'loading') {
        initializeHero();
    } else {
        document.addEventListener('DOMContentLoaded', initializeHero);
    }
    
    // SennaJS support with cleanup
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            console.log('SennaJS navigation completed, reinitializing hero...');
            window.spHero.initialized = false;
            window.spHero.loading = false;
            setTimeout(initializeHero, 200);
        });
        
        Liferay.on('beforeScreenFlip', function() {
            console.log('SennaJS screen flip starting...');
        });
        
        Liferay.on('screenFlip', function() {
            console.log('SennaJS screen flip completed, reinitializing hero...');
            setTimeout(initializeHero, 100);
        });
    }
    
    // Additional SennaJS events
    document.addEventListener('beforeNavigate', function() {
        console.log('Before navigate event triggered for hero');
    });
    
    document.addEventListener('navigate', function() {
        console.log('Navigate event triggered, reinitializing hero...');
        setTimeout(initializeHero, 100);
    });
})();
