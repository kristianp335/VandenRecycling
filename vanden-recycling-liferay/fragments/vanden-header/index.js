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
            // Initialize mobile menu and login modal for edit mode
            initializeMobileMenu();
            initializeLoginModal();
            window.VandenHeader.initialized = true;
            window.VandenHeader.loading = false;
            return;
        }
        
        // Load navigation menu
        loadNavigationMenu();
        
        // Initialize mobile menu functionality
        initializeMobileMenu();
        
        // Initialize login modal functionality
        initializeLoginModal();
        
        // Initialize search modal functionality
        initializeSearchModal();
        
        // Fix logo home link
        initializeLogoLink();
        
        // Note: initializeDropdowns() is called after navigation is rendered
        
        window.VandenHeader.initialized = true;
        window.VandenHeader.loading = false;
        
        console.log('Vanden Header Fragment initialized successfully');
    }
    
    /**
     * Initialize logo home link with proper site URL
     */
    function initializeLogoLink() {
        const logoLink = fragmentElement.querySelector('#logo-home-link');
        if (logoLink) {
            logoLink.href = buildPageURL('/home');
        }
    }
    
    /**
     * Initialize search modal functionality
     */
    function initializeSearchModal() {
        const searchBtn = fragmentElement.querySelector('#search-btn');
        const searchOverlay = document.querySelector('#search-overlay');
        const closeSearch = document.querySelector('#close-search');
        
        if (!searchBtn || !searchOverlay) {
            console.log('Search elements not found - search may be disabled in configuration');
            return;
        }
        
        // Open search modal
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openSearchModal();
        });
        
        // Close search modal
        if (closeSearch) {
            closeSearch.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeSearchModal();
            });
        }
        
        // Close on overlay click
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.style.display !== 'none') {
                closeSearchModal();
            }
        });
        
        console.log('Search modal initialized successfully');
    }
    
    /**
     * Open search modal
     */
    function openSearchModal() {
        const searchOverlay = document.querySelector('#search-overlay');
        if (searchOverlay) {
            searchOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus on search input
            setTimeout(() => {
                const searchInput = searchOverlay.querySelector('input[type="text"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
            
            console.log('Search modal opened');
        }
    }
    
    /**
     * Close search modal
     */
    function closeSearchModal() {
        const searchOverlay = document.querySelector('#search-overlay');
        if (searchOverlay) {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Restore background scrolling
            console.log('Search modal closed');
        }
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
                console.log('API Navigation Data:', data);
                console.log('Navigation Menu Items:', data.navigationMenuItems);
                if (data.navigationMenuItems && data.navigationMenuItems.length > 0) {
                    console.log('First nav item structure:', data.navigationMenuItems[0]);
                }
                
                renderNavigation(data.navigationMenuItems || []);
                // Initialize dropdowns after navigation is rendered with small delay
                setTimeout(() => {
                    initializeDropdowns();
                }, 100);
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
                name: 'Home',
                url: '/home'
            },
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
        // Initialize dropdowns after navigation is rendered with small delay
        setTimeout(() => {
            initializeDropdowns();
        }, 100);
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
     * Get the site base path from current URL
     */
    function getSiteBasePath() {
        try {
            const relativeURL = Liferay.ThemeDisplay.getRelativeURL();
            // Extract everything up to the last slash: /web/vanden-recycling/home -> /web/vanden-recycling/
            const lastSlashIndex = relativeURL.lastIndexOf('/');
            return relativeURL.substring(0, lastSlashIndex + 1);
        } catch (error) {
            console.warn('Could not get site base path from ThemeDisplay, using fallback');
            return '/web/guest/'; // Fallback for guest site
        }
    }

    /**
     * Build complete page URL with site context
     */
    function buildPageURL(pagePath) {
        if (!pagePath || pagePath === '#') return '#';
        
        // If it's already a complete URL, return as-is
        if (pagePath.startsWith('/web/') || pagePath.startsWith('http')) {
            return pagePath;
        }
        
        // Remove leading slash if present, we'll add it with site base path
        const cleanPath = pagePath.startsWith('/') ? pagePath.substring(1) : pagePath;
        const siteBasePath = getSiteBasePath();
        
        return `${siteBasePath}${cleanPath}`;
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
        const originalUrl = item.link || item.url || '#';
        const builtUrl = buildPageURL(originalUrl);
        
        console.log(`Navigation item "${item.name || item.title}": ${originalUrl} -> ${builtUrl}`);
        
        link.href = builtUrl;
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
                    childLink.href = buildPageURL(child.link || child.url || '#');
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
                    childLink.href = buildPageURL(child.link || child.url || '#');
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
            
            console.log('Mobile menu toggle clicked');
            
            const isActive = mobileMenu.classList.contains('active');
            console.log('Mobile menu is currently active:', isActive);
            
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
            console.log('Opening mobile menu');
            mobileMenu.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            
            // Trap focus in mobile menu
            const firstFocusable = mobileMenu.querySelector('a, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            console.log('Mobile menu opened, classes:', mobileMenu.className);
        }
        
        function closeMobileMenu() {
            console.log('Closing mobile menu');
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            
            // Return focus to menu toggle
            menuToggle.focus();
            console.log('Mobile menu closed, classes:', mobileMenu.className);
        }
    }
    
    /**
     * Initialize dropdown functionality for desktop
     */
    function initializeDropdowns() {
        console.log('Initializing dropdowns...');
        
        // Initialize fragment navigation dropdowns (scoped)
        const dropdownItems = fragmentElement.querySelectorAll('.nav-item.has-dropdown');
        
        console.log('Found', dropdownItems.length, 'dropdown items');
        
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
        
        // Close dropdowns when clicking outside (only our fragment dropdowns)
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item.has-dropdown')) {
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
     * SennaJS Event Handlers
     */
    function setupSennaJSHandlers() {
        if (typeof Liferay !== 'undefined') {
            Liferay.on('endNavigate', function(event) {
                console.log('SPA Navigation completed, reinitializing header and checking edit mode');
                
                // Reset state
                window.VandenHeader.initialized = false;
                window.VandenHeader.loading = false;
                
                // Reinitialize header and check edit mode
                setTimeout(() => {
                    initializeHeader();
                    initializeEditMode();
                }, 100);
            });
            
            Liferay.on('beforeScreenFlip', function(event) {
                // Cleanup: close mobile menu before navigation
                const mobileMenu = fragmentElement.querySelector('.vanden-mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                // Also cleanup edit mode modal if showing
                const searchOverlay = document.getElementById('search-overlay');
                if (searchOverlay && searchOverlay.classList.contains('vanden-edit-mode')) {
                    searchOverlay.classList.remove('vanden-edit-mode');
                    searchOverlay.style.display = 'none';
                }
            });
            
            // Listen for Liferay page editor events
            Liferay.on('pageEditorModeChanged', function(event) {
                console.log('Page editor mode changed:', event);
                setTimeout(initializeEditMode, 100);
            });
        }
        
        // Fallback for standard navigation
        document.addEventListener('navigate', function(event) {
            setTimeout(() => {
                initializeHeader();
                initializeEditMode();
            }, 100);
        });
        
        // Listen for URL changes (including hash changes that might indicate edit mode)
        window.addEventListener('hashchange', function(event) {
            console.log('Hash changed, checking edit mode');
            setTimeout(initializeEditMode, 200);
        });
        
        // Listen for DOM mutations that might indicate page editor changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.target === document.body && 
                    mutation.attributeName === 'class') {
                    console.log('Body class changed, rechecking edit mode');
                    setTimeout(initializeEditMode, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
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
    
    /**
     * Initialize edit mode functionality
     */
    function initializeEditMode() {
        console.log('Checking for edit mode...');
        console.log('Document body classes:', document.body.className);
        
        const editMode = document.body.classList.contains('has-edit-mode-menu');
        const searchOverlay = document.getElementById('search-overlay');
        
        console.log('Edit mode detected:', editMode);
        console.log('Search overlay found:', !!searchOverlay);
        
        // Also check for alternative edit mode indicators
        const isPageEditor = document.body.classList.contains('page-editor') || 
                            document.querySelector('.page-editor') ||
                            document.querySelector('[data-analytics-asset-type="fragment"]');
        
        console.log('Alternative page editor detection:', !!isPageEditor);
        
        if ((editMode || isPageEditor) && searchOverlay) {
            // Show modal in edit mode for dropzone configuration
            searchOverlay.classList.add('vanden-edit-mode');
            searchOverlay.style.display = 'block';
            console.log('Edit mode detected - showing search modal for configuration');
        } else if (!searchOverlay) {
            console.error('Search overlay element not found');
        } else {
            console.log('Not in edit mode - keeping search modal hidden');
        }
    }

    // Initialize everything
    ready(function() {
        setupSennaJSHandlers();
        initializeHeader();
        initializeEditMode();
    });
    
})();