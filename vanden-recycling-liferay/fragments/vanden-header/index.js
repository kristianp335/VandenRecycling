/**
 * Vanden Header Fragment JavaScript
 * Handles navigation loading and mobile menu functionality
 */

(function() {
    'use strict';
    
    // Fragment-specific state management
    window.VandenHeader = window.VandenHeader || {
        initialized: false,
        loading: false
    };
    
    /**
     * Initialize the header fragment
     */
    function initializeHeader() {
        if (window.VandenHeader.loading) return;
        window.VandenHeader.loading = true;
        
        console.log('Initializing Vanden Header Fragment');
        
        // Check if we're in edit mode
        const editMode = document.body.classList.contains('has-edit-mode-menu');
        
        if (editMode) {
            // Simplified initialization for edit mode
            loadFallbackNavigation();
            window.VandenHeader.initialized = true;
            window.VandenHeader.loading = false;
            return;
        }
        
        // Load navigation menu
        loadNavigationMenu();
        
        // Initialize mobile menu functionality
        initializeMobileMenu();
        
        // Initialize dropdown functionality
        initializeDropdowns();
        
        // Initialize login modal functionality
        initializeLoginModal();
        
        window.VandenHeader.initialized = true;
        window.VandenHeader.loading = false;
        
        console.log('Vanden Header Fragment initialized successfully');
    }
    
    /**
     * Load navigation menu from Liferay API
     */
    function loadNavigationMenu() {
        const menuId = configuration.navigationMenuId || 'primary-menu';
        
        // Check if authentication token is available
        if (typeof Liferay === 'undefined' || !Liferay.authToken) {
            console.warn('Liferay authentication not available, loading fallback navigation');
            loadFallbackNavigation();
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
                renderNavigation(data.navigationMenuItems || []);
            })
            .catch(error => {
                console.error('Error loading navigation menu:', error);
                loadFallbackNavigation();
            });
    }
    
    /**
     * Load fallback navigation when API is unavailable
     */
    function loadFallbackNavigation() {
        const fallbackNav = [
            {
                name: 'What We Do',
                url: '/what-we-do',
                children: [
                    { name: 'Recycle Plastic', url: '/what-we-do/recycle-plastic' },
                    { name: 'Trade', url: '/what-we-do/trade' },
                    { name: 'Training', url: '/what-we-do/training' }
                ]
            },
            {
                name: 'Post-Consumer Recycled Plastic',
                url: '/post-consumer-recycled-plastic'
            },
            {
                name: 'Who We Are',
                url: '/who-we-are',
                children: [
                    { name: 'Meet the Team', url: '/who-we-are/meet-the-team' },
                    { name: 'Our Values', url: '/who-we-are/our-values' },
                    { name: 'Our Mission', url: '/who-we-are/our-mission' }
                ]
            },
            {
                name: 'How We Work',
                url: '/how-we-work',
                children: [
                    { name: 'Our Process', url: '/how-we-work/our-process' },
                    { name: 'Quality Control', url: '/how-we-work/quality-control' }
                ]
            },
            {
                name: 'Knowledge Centre',
                url: 'https://blog.vandenrecycling.com/',
                external: true
            },
            {
                name: 'Get In Touch',
                url: '/get-in-touch'
            }
        ];
        
        renderNavigation(fallbackNav);
    }
    
    /**
     * Render navigation menu in both desktop and mobile containers
     */
    function renderNavigation(menuItems) {
        const desktopNav = fragmentElement.querySelector('.nav-menu');
        const mobileNav = fragmentElement.querySelector('.mobile-nav-menu');
        
        if (!desktopNav || !mobileNav) {
            console.error('Navigation containers not found');
            return;
        }
        
        // Clear existing content
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        // Render desktop navigation
        menuItems.forEach(item => {
            const navItem = createNavItem(item, false);
            desktopNav.appendChild(navItem);
        });
        
        // Render mobile navigation
        menuItems.forEach(item => {
            const mobileItem = createNavItem(item, true);
            mobileNav.appendChild(mobileItem);
        });
    }
    
    /**
     * Create navigation item element
     */
    function createNavItem(item, isMobile) {
        // Check for navigationMenuItems (API response) or children (fallback)
        const hasChildren = (item.navigationMenuItems && item.navigationMenuItems.length > 0) || 
                          (item.children && item.children.length > 0);
        const children = item.navigationMenuItems || item.children || [];
        
        const listItem = document.createElement('li');
        listItem.className = isMobile ? 'mobile-nav-item' : 'nav-item';
        
        if (hasChildren && !isMobile) {
            listItem.classList.add('has-dropdown');
        }
        
        // Create main link
        const link = document.createElement('a');
        link.href = item.link || item.url || '#';
        link.textContent = item.name || item.title;
        link.className = isMobile ? 'mobile-nav-link' : 'nav-link';
        
        if (item.external) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        
        listItem.appendChild(link);
        
        // Add dropdown menu for desktop or submenu for mobile
        if (hasChildren) {
            const dropdown = document.createElement(isMobile ? 'div' : 'ul');
            dropdown.className = isMobile ? 'mobile-dropdown' : 'dropdown-menu';
            
            children.forEach(child => {
                if (isMobile) {
                    const childLink = document.createElement('a');
                    childLink.href = child.link || child.url || '#';
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'mobile-dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    dropdown.appendChild(childLink);
                } else {
                    const childItem = document.createElement('li');
                    const childLink = document.createElement('a');
                    childLink.href = child.link || child.url || '#';
                    childLink.textContent = child.name || child.title;
                    childLink.className = 'dropdown-item';
                    
                    if (child.external) {
                        childLink.target = '_blank';
                        childLink.rel = 'noopener';
                    }
                    
                    childItem.appendChild(childLink);
                    dropdown.appendChild(childItem);
                }
            });
            
            listItem.appendChild(dropdown);
        }
        
        return listItem;
    }
    
    /**
     * Initialize mobile menu functionality
     */
    function initializeMobileMenu() {
        const menuToggle = fragmentElement.querySelector('.vanden-menu-toggle');
        const mobileMenu = fragmentElement.querySelector('.vanden-mobile-menu');
        
        if (!menuToggle || !mobileMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // Toggle mobile menu
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close mobile menu when clicking on links
        mobileMenu.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href') !== '#') {
                closeMobileMenu();
            }
        });
        
        function openMobileMenu() {
            mobileMenu.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            
            // Trap focus in mobile menu
            const firstFocusable = mobileMenu.querySelector('a, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            
            // Return focus to menu toggle
            menuToggle.focus();
        }
    }
    
    /**
     * Initialize dropdown functionality for desktop
     */
    function initializeDropdowns() {
        // Initialize fragment navigation dropdowns (scoped)
        const dropdownItems = fragmentElement.querySelectorAll('.nav-item.has-dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown-menu');
            
            if (!link || !dropdown) return;
            
            // Show dropdown on hover
            item.addEventListener('mouseenter', function() {
                // Close other dropdowns first
                const otherDropdowns = fragmentElement.querySelectorAll('.nav-item.has-dropdown.active');
                otherDropdowns.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                item.classList.add('active');
                dropdown.classList.add('show');
            });
            
            // Hide dropdown when leaving
            item.addEventListener('mouseleave', function() {
                item.classList.remove('active');
                dropdown.classList.remove('show');
            });
            
            // Click to toggle (for touch devices)
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const isActive = item.classList.contains('active');
                
                // Close all dropdowns first
                const allDropdowns = fragmentElement.querySelectorAll('.nav-item.has-dropdown');
                allDropdowns.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherDropdown = otherItem.querySelector('.dropdown-menu');
                    if (otherDropdown) {
                        otherDropdown.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                if (!isActive) {
                    item.classList.add('active');
                    dropdown.classList.add('show');
                }
            });
            
            // Keyboard navigation
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.classList.toggle('active');
                    dropdown.classList.toggle('show');
                    
                    if (item.classList.contains('active')) {
                        const firstDropdownItem = dropdown.querySelector('.dropdown-item');
                        if (firstDropdownItem) {
                            firstDropdownItem.focus();
                        }
                    }
                } else if (e.key === 'Escape') {
                    item.classList.remove('active');
                    dropdown.classList.remove('show');
                    link.focus();
                }
            });
        });
        
        // Initialize global Liferay dropdowns (like user profile widget)
        initializeGlobalDropdowns();
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item.has-dropdown') && !e.target.closest('.dropdown')) {
                const allDropdowns = fragmentElement.querySelectorAll('.nav-item.has-dropdown');
                allDropdowns.forEach(item => {
                    item.classList.remove('active');
                    const dropdown = item.querySelector('.dropdown-menu');
                    if (dropdown) {
                        dropdown.classList.remove('show');
                    }
                });
            }
        });
    }
    
    /**
     * Initialize global dropdown functionality (for Liferay widgets like user profile)
     */
    function initializeGlobalDropdowns() {
        // Target all dropdown toggles on the page (including user profile widget)
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            // Skip if already initialized or if it's within our fragment (handled above)
            if (toggle.hasAttribute('data-vanden-initialized') || 
                fragmentElement.contains(toggle)) {
                return;
            }
            
            // Mark as initialized
            toggle.setAttribute('data-vanden-initialized', 'true');
            
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.nextElementSibling;
                if (!dropdown) return;
                
                // Close other global dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdown && !fragmentElement.contains(menu)) {
                        menu.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('show');
                
                // Handle Clay dropdown menus (Liferay's dropdown system)
                if (dropdown.id && dropdown.id.startsWith('clay-dropdown-menu')) {
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !isExpanded);
                    
                    if (!isExpanded) {
                        dropdown.style.display = 'block';
                        dropdown.classList.add('show');
                    } else {
                        dropdown.style.display = 'none';
                        dropdown.classList.remove('show');
                    }
                }
            });
        });
        
        // Close global dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                // Close all global dropdown menus
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (!fragmentElement.contains(menu)) {
                        menu.classList.remove('show');
                        menu.style.display = 'none';
                    }
                });
                
                // Reset aria-expanded for dropdown toggles
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    if (!fragmentElement.contains(toggle)) {
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    }
    
    /**
     * SennaJS Event Handlers
     */
    function setupSennaJSHandlers() {
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing header');
                
                // Reset state
                window.VandenHeader.initialized = false;
                window.VandenHeader.loading = false;
                
                // Reinitialize header
                setTimeout(initializeHeader, 100);
                
                // Reinitialize global dropdowns after navigation
                setTimeout(initializeGlobalDropdowns, 200);
            });
            
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup: close mobile menu before navigation
                const mobileMenu = fragmentElement.querySelector('.vanden-mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                // Close all global dropdowns before navigation
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (!fragmentElement.contains(menu)) {
                        menu.classList.remove('show');
                        menu.style.display = 'none';
                    }
                });
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(initializeHeader, 100);
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
    if (window.VandenHeader.initialized) {
        return;
    }
    
    /**
     * Initialize login modal functionality
     */
    function initializeLoginModal() {
        const loginBtn = fragmentElement.querySelector('#login-btn');
        const mobileLoginBtn = fragmentElement.querySelector('#mobile-login-btn');
        const loginOverlay = fragmentElement.querySelector('#login-overlay') || document.getElementById('login-overlay');
        const closeBtn = (loginOverlay ? loginOverlay.querySelector('#close-login') : null) || document.getElementById('close-login');
        const loginContent = (loginOverlay ? loginOverlay.querySelector('#login-content') : null) || document.getElementById('login-content');
        
        if (!loginOverlay || !closeBtn || !loginContent) {
            console.warn('Login modal elements not found');
            return;
        }
        
        // Handle desktop login button click
        if (loginBtn) {
            loginBtn.addEventListener('click', function() {
                openLoginModal();
            });
        }
        
        // Handle mobile login button click
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', function() {
                openLoginModal();
            });
        }
        
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
        
        // Handle escape key (scoped to prevent conflicts with other fragments)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const currentOverlay = fragmentElement.querySelector('#login-overlay') || document.getElementById('login-overlay');
                if (currentOverlay && currentOverlay.style.display === 'flex') {
                    closeLoginModal();
                }
            }
        });
        
        console.log('Login modal initialized');
    }
    
    /**
     * Open login modal and load appropriate widget
     */
    function openLoginModal() {
        const loginOverlay = fragmentElement.querySelector('#login-overlay') || document.getElementById('login-overlay');
        const loginContent = (loginOverlay ? loginOverlay.querySelector('#login-content') : null) || document.getElementById('login-content');
        
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
    
    /**
     * Close login modal
     */
    function closeLoginModal() {
        const loginOverlay = fragmentElement.querySelector('#login-overlay') || document.getElementById('login-overlay');
        
        if (!loginOverlay) return;
        
        loginOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    /**
     * Check if user is currently logged in
     */
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
                const userProfileWidget = fragmentElement.querySelector('.user-profile-widget');
                if (userProfileWidget && userProfileWidget.children.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    }
    
    /**
     * Load Liferay login widget  
     */
    function loadLoginWidget() {
        const loginContent = fragmentElement.querySelector('#login-content') || document.getElementById('login-content');
        
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
                loginPortlet.style.background = 'transparent';
            }
        }, 100);
    }
    
    /**
     * Load user profile
     */
    function loadUserProfile() {
        const loginContent = fragmentElement.querySelector('#login-content') || document.getElementById('login-content');
        
        if (!loginContent) return;
        
        // Get user information from Liferay
        const userEmail = Liferay.ThemeDisplay.getUserEmailAddress();
        const userName = Liferay.ThemeDisplay.getUserName();
        const userInitials = userName.split(' ').map(n => n[0]).join('');
        
        // Create user profile content
        const profileHTML = `
            <div class="user-profile">
                <div class="user-avatar">${userInitials}</div>
                <div class="user-name">${userName}</div>
                <div class="user-email">${userEmail}</div>
                <div class="profile-actions">
                    <a href="/c/portal/logout" class="vanden-btn vanden-btn-outline">Logout</a>
                </div>
            </div>
        `;
        
        loginContent.innerHTML = profileHTML;
        console.log('User profile loaded');
    }
    
    // Initialize everything
    ready(function() {
        setupSennaJSHandlers();
        initializeHeader();
    });
    
})();