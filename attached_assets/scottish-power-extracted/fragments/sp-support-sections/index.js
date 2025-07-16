/* JavaScript for sp-support-sections */

// Global state management for support sections
window.spSupportSections = window.spSupportSections || {
    initialized: false,
    loading: false
};

// Initialize support sections functionality
function initializeSupportSections() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Support sections: Edit mode detected - simplified initialization');
        initializeForEditMode();
        return;
    }
    
    if (window.spSupportSections.loading || window.spSupportSections.initialized) {
        return;
    }
    
    window.spSupportSections.loading = true;
    console.log('Initializing support sections...');
    
    initializeSupportDisplay();
    initializeScrollAnimations();
    
    window.spSupportSections.loading = false;
    window.spSupportSections.initialized = true;
}

function initializeForEditMode() {
    const supportItems = document.querySelectorAll('.support-item');
    supportItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.visibility = 'visible';
    });
    
    window.spSupportSections.loading = false;
    window.spSupportSections.initialized = true;
}

function initializeSupportDisplay() {
    // Initialize webchat functionality
    const webchatButton = document.querySelector('.webchat-button');
    if (webchatButton) {
        webchatButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Webchat button clicked');
            // Handle webchat opening
        });
    }
    
    // Initialize support links
    const supportLinks = document.querySelectorAll('.support-link');
    supportLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Support link clicked:', this.href);
        });
    });
}

function initializeScrollAnimations() {
    const supportItems = document.querySelectorAll('.support-item');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        supportItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
}

// Setup with SennaJS support
(function setupSupportSections() {
    if (document.readyState !== 'loading') {
        initializeSupportSections();
    } else {
        document.addEventListener('DOMContentLoaded', initializeSupportSections);
    }
    
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            window.spSupportSections.initialized = false;
            window.spSupportSections.loading = false;
            setTimeout(initializeSupportSections, 200);
        });
        
        Liferay.on('screenFlip', function() {
            setTimeout(initializeSupportSections, 100);
        });
    }
    
    document.addEventListener('navigate', function() {
        setTimeout(initializeSupportSections, 100);
    });
})();
