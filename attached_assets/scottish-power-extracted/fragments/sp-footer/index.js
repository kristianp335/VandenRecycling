/* JavaScript for sp-footer */

// Global state management for footer
window.spFooter = window.spFooter || {
    initialized: false,
    loading: false
};

// Initialize footer functionality
function initializeFooter() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Footer: Edit mode detected - simplified initialization');
        initializeForEditMode();
        return;
    }
    
    if (window.spFooter.loading || window.spFooter.initialized) {
        return;
    }
    
    window.spFooter.loading = true;
    console.log('Initializing footer...');
    
    initializeFooterFunctionality();
    initializeScrollAnimations();
    
    window.spFooter.loading = false;
    window.spFooter.initialized = true;
}

function initializeForEditMode() {
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.opacity = '1';
        footer.style.transform = 'none';
        footer.style.visibility = 'visible';
    }
    
    window.spFooter.loading = false;
    window.spFooter.initialized = true;
}

function initializeFooterFunctionality() {
    // Initialize newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                console.log('Newsletter signup:', email);
                // Handle newsletter signup
            }
        });
    }
    
    // Initialize social media links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add analytics tracking if needed
            console.log('Social link clicked:', this.href);
        });
    });
}

function initializeScrollAnimations() {
    const footer = document.querySelector('.footer');
    
    if ('IntersectionObserver' in window && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(20px)';
        footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(footer);
    }
}

// Setup with SennaJS support
(function setupFooter() {
    if (document.readyState !== 'loading') {
        initializeFooter();
    } else {
        document.addEventListener('DOMContentLoaded', initializeFooter);
    }
    
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            window.spFooter.initialized = false;
            window.spFooter.loading = false;
            setTimeout(initializeFooter, 200);
        });
        
        Liferay.on('screenFlip', function() {
            setTimeout(initializeFooter, 100);
        });
    }
    
    document.addEventListener('navigate', function() {
        setTimeout(initializeFooter, 100);
    });
})();
