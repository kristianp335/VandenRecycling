/* JavaScript for sp-awards */

// Global state management for awards
window.spAwards = window.spAwards || {
    initialized: false,
    loading: false
};

// Initialize awards functionality
function initializeAwards() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Awards: Edit mode detected - simplified initialization');
        initializeForEditMode();
        return;
    }
    
    if (window.spAwards.loading || window.spAwards.initialized) {
        return;
    }
    
    window.spAwards.loading = true;
    console.log('Initializing awards...');
    
    initializeAwardsDisplay();
    initializeScrollAnimations();
    
    window.spAwards.loading = false;
    window.spAwards.initialized = true;
}

function initializeForEditMode() {
    const awards = document.querySelectorAll('.award-item');
    awards.forEach(award => {
        award.style.opacity = '1';
        award.style.transform = 'none';
        award.style.visibility = 'visible';
    });
    
    window.spAwards.loading = false;
    window.spAwards.initialized = true;
}

function initializeAwardsDisplay() {
    const awardsContainer = document.querySelector('.awards-grid');
    if (!awardsContainer) return;
    
    // Initialize any carousel or slider functionality
    const carousel = document.querySelector('.awards-carousel');
    if (carousel) {
        // Basic carousel setup
        const track = carousel.querySelector('.awards-track');
        if (track) {
            track.style.display = 'flex';
            track.style.gap = '20px';
        }
    }
}

function initializeScrollAnimations() {
    const awards = document.querySelectorAll('.award-item');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        awards.forEach(award => {
            award.style.opacity = '0';
            award.style.transform = 'translateY(20px)';
            award.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(award);
        });
    }
}

// Setup with SennaJS support
(function setupAwards() {
    if (document.readyState !== 'loading') {
        initializeAwards();
    } else {
        document.addEventListener('DOMContentLoaded', initializeAwards);
    }
    
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            window.spAwards.initialized = false;
            window.spAwards.loading = false;
            setTimeout(initializeAwards, 200);
        });
        
        Liferay.on('screenFlip', function() {
            setTimeout(initializeAwards, 100);
        });
    }
    
    document.addEventListener('navigate', function() {
        setTimeout(initializeAwards, 100);
    });
})();
