/* JavaScript for sp-half-price-weekends */

// Global state management for half-price weekends
window.spHalfPriceWeekends = window.spHalfPriceWeekends || {
    initialized: false,
    loading: false
};

// Initialize half-price weekends functionality
function initializeHalfPriceWeekends() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Half-price weekends: Edit mode detected - simplified initialization');
        initializeForEditMode();
        return;
    }
    
    if (window.spHalfPriceWeekends.loading || window.spHalfPriceWeekends.initialized) {
        return;
    }
    
    window.spHalfPriceWeekends.loading = true;
    console.log('Initializing half-price weekends...');
    
    initializePromoDisplay();
    initializeScrollAnimations();
    
    window.spHalfPriceWeekends.loading = false;
    window.spHalfPriceWeekends.initialized = true;
}

function initializeForEditMode() {
    const promoSection = document.querySelector('.half-price-weekends');
    if (promoSection) {
        promoSection.style.opacity = '1';
        promoSection.style.transform = 'none';
        promoSection.style.visibility = 'visible';
    }
    
    window.spHalfPriceWeekends.loading = false;
    window.spHalfPriceWeekends.initialized = true;
}

function initializePromoDisplay() {
    // Initialize CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Half-price weekends CTA clicked');
            // Handle CTA action
        });
    });
    
    // Initialize benefits highlights
    const benefitsList = document.querySelector('.benefits-list');
    if (benefitsList) {
        const benefits = benefitsList.querySelectorAll('.benefit-item');
        benefits.forEach((benefit, index) => {
            benefit.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

function initializeScrollAnimations() {
    const promoSection = document.querySelector('.half-price-weekends');
    
    if ('IntersectionObserver' in window && promoSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        promoSection.style.opacity = '0';
        promoSection.style.transform = 'translateY(20px)';
        promoSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(promoSection);
    }
}

// Setup with SennaJS support
(function setupHalfPriceWeekends() {
    if (document.readyState !== 'loading') {
        initializeHalfPriceWeekends();
    } else {
        document.addEventListener('DOMContentLoaded', initializeHalfPriceWeekends);
    }
    
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            window.spHalfPriceWeekends.initialized = false;
            window.spHalfPriceWeekends.loading = false;
            setTimeout(initializeHalfPriceWeekends, 200);
        });
        
        Liferay.on('screenFlip', function() {
            setTimeout(initializeHalfPriceWeekends, 100);
        });
    }
    
    document.addEventListener('navigate', function() {
        setTimeout(initializeHalfPriceWeekends, 100);
    });
})();
