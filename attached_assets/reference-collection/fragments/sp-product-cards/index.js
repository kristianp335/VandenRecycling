/* JavaScript for sp-product-cards */

// Global state management for product cards
window.spProductCards = window.spProductCards || {
    initialized: false,
    loading: false
};

// Initialize product cards functionality
function initializeProductCards() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Product cards: Edit mode detected - simplified initialization');
        initializeForEditMode();
        return;
    }
    
    if (window.spProductCards.loading || window.spProductCards.initialized) {
        return;
    }
    
    window.spProductCards.loading = true;
    console.log('Initializing product cards...');
    
    initializeCarousel();
    initializeScrollAnimations();
    
    window.spProductCards.loading = false;
    window.spProductCards.initialized = true;
}

function initializeForEditMode() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.visibility = 'visible';
    });
    
    window.spProductCards.loading = false;
    window.spProductCards.initialized = true;
}

function initializeCarousel() {
    const carousel = document.querySelector('.product-carousel');
    if (!carousel) return;
    
    // Basic carousel functionality
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const track = carousel.querySelector('.carousel-track');
    
    if (prevBtn && nextBtn && track) {
        let currentIndex = 0;
        const cards = track.querySelectorAll('.product-card');
        const cardWidth = cards[0]?.offsetWidth || 300;
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
        });
    }
}

function initializeScrollAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Setup with SennaJS support
(function setupProductCards() {
    if (document.readyState !== 'loading') {
        initializeProductCards();
    } else {
        document.addEventListener('DOMContentLoaded', initializeProductCards);
    }
    
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            window.spProductCards.initialized = false;
            window.spProductCards.loading = false;
            setTimeout(initializeProductCards, 200);
        });
        
        Liferay.on('screenFlip', function() {
            setTimeout(initializeProductCards, 100);
        });
    }
    
    document.addEventListener('navigate', function() {
        setTimeout(initializeProductCards, 100);
    });
})();
