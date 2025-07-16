
/* JavaScript for sp-header */

// Global state management
window.spNavigation = window.spNavigation || {
    initialized: false,
    loading: false,
    retryCount: 0
};

// Clean initialization function
function initializeNavigation() {
    // Check if in edit mode
    const editMode = document.body.classList.contains('has-edit-mode-menu');
    
    if (editMode) {
        console.log('Edit mode detected - simplified initialization');
        // In edit mode, skip complex initialization and just ensure basic structure
        initializeBasicNavigation();
        return;
    }
    
    // Prevent multiple simultaneous loads
    if (window.spNavigation.loading) {
        console.log('Navigation already loading, skipping...');
        return;
    }
    
    // Check if navigation already exists and is populated
    const navContainer = document.querySelector('.navbar-nav');
    if (navContainer && navContainer.children.length > 1) {
        console.log('Navigation already loaded, skipping...');
        return;
    }
    
    window.spNavigation.loading = true;
    console.log('Initializing header navigation...');
    
    // Get configuration
    const fragmentElement = document.querySelector('[data-lfr-fragment-entry-link-id]');
    const configurationNamespace = fragmentElement ? 
        fragmentElement.getAttribute('data-lfr-fragment-entry-link-id') : '';
    
    const navigationMenuId = window.fragmentNamespace && 
        window.fragmentNamespace[configurationNamespace] && 
        window.fragmentNamespace[configurationNamespace].navigationMenuId || '36850';
    
    console.log('Using navigation menu ID:', navigationMenuId);
    
    // Fetch navigation menu data
    fetchNavigationMenu(navigationMenuId);
}

// Edit mode basic initialization
function initializeBasicNavigation() {
    // Ensure mobile menu and dropdowns work in edit mode
    initializeMobileMenu();
    initializeDropdowns();
    initializeLoginModal();
    
    // Mark as completed
    window.spNavigation.loading = false;
    window.spNavigation.initialized = true;
}

// Single robust initialization setup
(function setupNavigation() {
    // Immediate initialization if DOM is ready
    if (document.readyState !== 'loading') {
        initializeNavigation();
    } else {
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    }
    
    // SennaJS support with cleanup
    if (typeof Liferay !== 'undefined' && Liferay.on) {
        Liferay.on('endNavigate', function() {
            console.log('SennaJS navigation completed, reinitializing...');
            window.spNavigation.initialized = false;
            window.spNavigation.loading = false;
            setTimeout(initializeNavigation, 200);
        });
        
        Liferay.on('beforeScreenFlip', function() {
            console.log('SennaJS screen flip starting...');
        });
        
        Liferay.on('screenFlip', function() {
            console.log('SennaJS screen flip completed, reinitializing...');
            setTimeout(initializeNavigation, 100);
        });
    }
    
    // Additional SennaJS events
    document.addEventListener('beforeNavigate', function() {
        console.log('Before navigate event triggered');
    });
    
    document.addEventListener('navigate', function() {
        console.log('Navigate event triggered, reinitializing...');
        setTimeout(initializeNavigation, 100);
    });
})();

function fetchNavigationMenu(menuId) {
    console.log('Fetching navigation menu ID:', menuId);
    
    // Check if Liferay object exists and has authToken
    if (typeof Liferay === 'undefined' || !Liferay.authToken) {
        console.warn('Liferay context not available. Building fallback navigation.');
        buildFallbackNavigation();
        
        // Initialize mobile menu and dropdowns
        initializeMobileMenu();
        initializeDropdowns();
        initializeLoginModal();
        
        window.spNavigation.loading = false;
        window.spNavigation.initialized = true;
        return;
    }
    
    const apiUrl = `/o/headless-delivery/v1.0/navigation-menus/${menuId}?nestedFields=true&p_auth=${Liferay.authToken}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Navigation menu loaded with', data.navigationMenuItems ? data.navigationMenuItems.length : 0, 'items');
            renderNavigationMenu(data.navigationMenuItems);
            
            // Initialize mobile menu and dropdowns
            initializeMobileMenu();
            initializeDropdowns();
            initializeLoginModal();
            
            // Mark as completed
            window.spNavigation.loading = false;
            window.spNavigation.initialized = true;
        })
        .catch(error => {
            console.error('Error fetching navigation menu:', error);
            
            // Build fallback navigation
            buildFallbackNavigation();
            
            // Initialize mobile menu and dropdowns
            initializeMobileMenu();
            initializeDropdowns();
            initializeLoginModal();
            
            // Mark as completed
            window.spNavigation.loading = false;
            window.spNavigation.initialized = true;
        });
}

function renderNavigationMenu(menuItems) {
    const navContainer = document.querySelector('.navbar-nav');
    
    if (!navContainer) {
        console.warn('Navigation container not found');
        return;
    }
    
    if (!menuItems || menuItems.length === 0) {
        console.warn('No menu items to render');
        buildFallbackNavigation();
        return;
    }
    
    // Clear existing navigation items
    navContainer.innerHTML = '';
    
    // Build navigation HTML
    menuItems.forEach(item => {
        const navItem = createNavigationItem(item);
        navContainer.appendChild(navItem);
    });
    
    console.log('Navigation rendered successfully');
}

function buildFallbackNavigation() {
    console.log('Building fallback navigation...');
    
    const navContainer = document.querySelector('.navbar-nav');
    if (!navContainer) {
        console.error('Cannot build fallback navigation - no container found');
        return;
    }
    
    // Clear loading state
    navContainer.innerHTML = '';
    
    // Create basic navigation structure
    const fallbackItems = [
        { name: 'Energy', link: '/energy' },
        { name: 'Solar', link: '/solar' },
        { name: 'EV Charging', link: '/ev-charging' },
        { name: 'Home Services', link: '/home-services' },
        { name: 'Help', link: '/help' }
    ];
    
    fallbackItems.forEach(item => {
        const navItem = createNavigationItem(item);
        navContainer.appendChild(navItem);
    });
    
    console.log('Fallback navigation built successfully');
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarNav = document.querySelector('.navbar-nav');
    const navbarActions = document.querySelector('.navbar-actions');
    
    if (!menuToggle || !navbarNav) {
        return;
    }
    
    // Remove any existing event listeners
    menuToggle.replaceWith(menuToggle.cloneNode(true));
    const newMenuToggle = document.querySelector('.menu-toggle');
    
    newMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle menu state
        const isActive = navbarNav.classList.contains('active');
        
        if (isActive) {
            navbarNav.classList.remove('active');
            navbarActions.classList.remove('active');
            newMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        } else {
            navbarNav.classList.add('active');
            navbarActions.classList.add('active');
            newMenuToggle.classList.add('active');
            document.body.classList.add('menu-open');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar-header')) {
            navbarNav.classList.remove('active');
            navbarActions.classList.remove('active');
            newMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navbarNav.classList.remove('active');
            navbarActions.classList.remove('active');
            newMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    console.log('Mobile menu initialized');
}

function createNavigationItem(item) {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    
    // Check if item has children for dropdown
    if (item.navigationMenuItems && item.navigationMenuItems.length > 0) {
        navItem.classList.add('dropdown');
        
        // Create dropdown toggle
        const navLink = document.createElement('a');
        navLink.href = item.link || '#';
        navLink.className = 'nav-link dropdown-toggle';
        navLink.textContent = item.name;
        navItem.appendChild(navLink);
        
        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        
        // Add child items
        item.navigationMenuItems.forEach(childItem => {
            const dropdownItem = document.createElement('a');
            dropdownItem.href = childItem.link || '#';
            dropdownItem.className = 'dropdown-item';
            dropdownItem.textContent = childItem.name;
            dropdownMenu.appendChild(dropdownItem);
        });
        
        navItem.appendChild(dropdownMenu);
    } else {
        // Simple navigation link
        const navLink = document.createElement('a');
        navLink.href = item.link || '#';
        navLink.className = 'nav-link';
        navLink.textContent = item.name;
        navItem.appendChild(navLink);
    }
    
    return navItem;
}

// Initialize dropdown functionality
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Ensure script persists across SennaJS navigation
if (typeof window.scottishPowerHeaderInitialized === 'undefined') {
    window.scottishPowerHeaderInitialized = true;
    
    // Mark this script as permanent for SennaJS
    const scriptElements = document.querySelectorAll('script[src*="sp-header"]');
    scriptElements.forEach(script => {
        script.setAttribute('data-senna-track', 'permanent');
    });
}

// Initialize dropdowns with SennaJS support
function initializeDropdownsWithSennaSupport() {
    setTimeout(function() {
        initializeDropdowns();
        console.log('🎯 Dropdowns initialized with SennaJS support');
    }, 100);
}

// Initialize dropdowns after navigation events
document.addEventListener('DOMContentLoaded', initializeDropdownsWithSennaSupport);

// Re-initialize dropdowns after SennaJS navigation
if (typeof Liferay !== 'undefined' && Liferay.on) {
    Liferay.on('endNavigate', initializeDropdownsWithSennaSupport);
}

// Initialize login modal functionality
function initializeLoginModal() {
    const loginBtn = document.getElementById('login-btn');
    const loginOverlay = document.getElementById('login-overlay');
    const closeBtn = document.getElementById('close-login');
    const loginContent = document.getElementById('login-content');
    
    if (!loginBtn || !loginOverlay || !closeBtn || !loginContent) {
        console.warn('Login modal elements not found');
        return;
    }
    
    // Handle login button click
    loginBtn.addEventListener('click', function() {
        openLoginModal();
    });
    
    // Handle close button click
    closeBtn.addEventListener('click', function() {
        closeLoginModal();
    });
    
    // Handle overlay click (close modal)
    loginOverlay.addEventListener('click', function(e) {
        if (e.target === loginOverlay) {
            closeLoginModal();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginOverlay.style.display === 'flex') {
            closeLoginModal();
        }
    });
    
    console.log('Login modal initialized');
}

// Open login modal and load appropriate widget
function openLoginModal() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    
    if (!loginOverlay || !loginContent) return;
    
    // Show overlay
    loginOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Check if user is logged in
    checkUserLoginStatus()
        .then(isLoggedIn => {
            if (isLoggedIn) {
                loadUserProfile();
            } else {
                loadLoginWidget();
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
            loadLoginWidget(); // Fallback to login widget
        });
}

// Close login modal
function closeLoginModal() {
    const loginOverlay = document.getElementById('login-overlay');
    
    if (!loginOverlay) return;
    
    loginOverlay.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Check if user is currently logged in
function checkUserLoginStatus() {
    return new Promise((resolve) => {
        // Check if Liferay user object exists and user is signed in
        if (typeof Liferay !== 'undefined' && 
            Liferay.ThemeDisplay && 
            Liferay.ThemeDisplay.isSignedIn && 
            Liferay.ThemeDisplay.isSignedIn()) {
            resolve(true);
        } else {
            // Also check for user profile widget presence (FreeMarker conditional rendered it)
            const userProfileWidget = document.querySelector('.user-profile-widget');
            if (userProfileWidget && userProfileWidget.children.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        }
    });
}

// Load Liferay login widget  
function loadLoginWidget() {
    const loginContent = document.getElementById('login-content');
    
    if (!loginContent) return;
    
    // The login portlet is already embedded via FreeMarker template
    // Just ensure it's visible and properly styled
    console.log('Login portlet loaded via FreeMarker template');
    
    // Add custom styling to the login portlet if needed
    setTimeout(() => {
        const loginPortlet = loginContent.querySelector('.portlet');
        if (loginPortlet) {
            loginPortlet.style.border = 'none';
            loginPortlet.style.boxShadow = 'none';
        }
    }, 100);
}

// Load user profile widget
function loadUserProfile() {
    const loginContent = document.getElementById('login-content');
    const loginTitle = document.querySelector('#login-overlay h3');
    
    if (!loginContent) return;
    
    // Update modal title
    if (loginTitle) {
        loginTitle.textContent = 'My Account';
    }
    
    // Get user information from Liferay
    let userName = 'User';
    let userEmail = '';
    let userInitials = 'U';
    
    if (typeof Liferay !== 'undefined' && Liferay.ThemeDisplay) {
        userName = Liferay.ThemeDisplay.getUserName() || 'User';
        userEmail = Liferay.ThemeDisplay.getUserEmailAddress() || '';
        userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    const profileHTML = `
        <div class="user-profile">
            <div class="user-avatar">${userInitials}</div>
            <div class="user-name">${userName}</div>
            <div class="user-email">${userEmail}</div>
            <div class="profile-actions">
                <a href="/group/customer-portal/my-account" class="btn btn-primary">My Account</a>
                <a href="/c/portal/logout" class="btn btn-secondary">Sign Out</a>
            </div>
        </div>
    `;
    
    loginContent.innerHTML = profileHTML;
}
