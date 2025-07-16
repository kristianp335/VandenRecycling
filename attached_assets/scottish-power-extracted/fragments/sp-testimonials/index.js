/* JavaScript for sp-testimonials */

// Global state management for testimonials
window.spTestimonials = window.spTestimonials || {
    initialized: false,
    loading: false
};

// Initialize testimonials functionality
function initializeTestimonials() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Testimonials: Edit mode detected - simplified initialization');
        initializeForEditMode();
        return;
    }
    
    if (window.spTestimonials.loading || window.spTestimonials.initialized) {
        return;
    }
    
    window.spTestimonials.loading = true;
    console.log('Initializing testimonials...');
    
    initializeTestimonialsDisplay();
    initializeScrollAnimations();
    
    window.spTestimonials.loading = false;
    window.spTestimonials.initialized = true;
}

function initializeForEditMode() {
    console.log('Testimonials: Initializing for edit mode...');
    
    // Show all testimonial cards in edit mode
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((testimonial, index) => {
        testimonial.style.display = 'block';
        testimonial.style.opacity = '1';
        testimonial.style.transform = 'none';
        testimonial.style.visibility = 'visible';
        testimonial.style.position = 'relative';
        
        // Ensure all cards are visible in edit mode
        if (index > 0) {
            testimonial.style.marginTop = '20px';
        }
    });
    
    // Show testimonials wrapper in a stacked layout for editing
    const wrapper = document.querySelector('.testimonials-wrapper');
    if (wrapper) {
        wrapper.style.display = 'block';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '20px';
    }
    
    // Hide navigation in edit mode
    const navigation = document.querySelector('.testimonials-navigation');
    if (navigation) {
        navigation.style.display = 'none';
    }
    
    window.spTestimonials.loading = false;
    window.spTestimonials.initialized = true;
    console.log('Testimonials: Edit mode initialization complete');
}

function initializeTestimonialsDisplay() {
    console.log('Initializing testimonials display...');
    
    // Show first testimonial card by default in carousel mode
    const carousel = document.querySelector('.carousel-layout');
    if (carousel) {
        const testimonials = carousel.querySelectorAll('.testimonial-card');
        testimonials.forEach((testimonial, index) => {
            if (index === 0) {
                testimonial.classList.add('active');
                testimonial.style.display = 'block';
            } else {
                testimonial.style.display = 'none';
            }
        });
        
        // Initialize carousel navigation
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn && nextBtn) {
            initializeCarouselNavigation(testimonials, prevBtn, nextBtn);
        }
    } else {
        // Grid or other layout - show all testimonials
        const testimonials = document.querySelectorAll('.testimonial-card');
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'block';
        });
    }
}

function initializeCarouselNavigation(testimonials, prevBtn, nextBtn) {
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            if (i === index) {
                testimonial.style.display = 'block';
                testimonial.classList.add('active');
            } else {
                testimonial.style.display = 'none';
                testimonial.classList.remove('active');
            }
        });
    }
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
        showTestimonial(currentIndex);
    });
}

function generateStars(container, score) {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">★</span>';
    }
    
    container.innerHTML = starsHTML;
}

function initializeScrollAnimations() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        testimonials.forEach(testimonial => {
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateY(20px)';
            testimonial.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(testimonial);
        });
    }
}

// Setup with SennaJS support
(function setupTestimonials() {
    if (document.readyState !== 'loading') {
        initializeTestimonials();
    } else {
        document.addEventListener('DOMContentLoaded', initializeTestimonials);
    }
    
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            window.spTestimonials.initialized = false;
            window.spTestimonials.loading = false;
            setTimeout(initializeTestimonials, 200);
        });
        
        Liferay.on('screenFlip', function() {
            setTimeout(initializeTestimonials, 100);
        });
    }
    
    document.addEventListener('navigate', function() {
        setTimeout(initializeTestimonials, 100);
    });
})();
