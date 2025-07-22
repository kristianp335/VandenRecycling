# Vanden Recycling Liferay Implementation

## Overview

This repository contains a complete Liferay-native recreation of the Vanden Recycling website using fragments and client extensions. The implementation features authentic Vanden brand colors, responsive design, and improved UX while maintaining compatibility with Liferay's SPA navigation system. The project includes both homepage and Post-Consumer Recycled Plastic page implementations with modular, reusable components.

## User Preferences

Preferred communication style: Simple, everyday language.

### Liferay Fragment Image Editing Requirements
- All images in fragments must be made editable using Liferay's inline editing system
- Required attributes for editable images:
  ```html
  <img
     src="placeholder.jpg"
     alt="Placeholder"
     data-lfr-editable-id="img1"
     data-lfr-editable-type="image"
  >
  ```
- Apply to all images where it makes sense for content editors to customize them

### Login Modal Implementation Requirements
- Login button must open a modal overlay with embedded Liferay login portlet
- Use FreeMarker template to embed login portlet: `[@liferay_portlet["runtime"] portletName="com_liferay_login_web_portlet_LoginPortlet" /]`
- Modal should check user login status and show appropriate content (login form vs user profile)
- Include proper modal structure with overlay, close button, and escape key handling
- Modal should prevent background scrolling when open
- Use `themeDisplay.isSignedIn()` to conditionally show login button vs user profile widget

### Login Modal Theme Styling Implementation
- **Problem**: Embedded Liferay login portlet inherits global Liferay styles instead of Vanden theme
- **Solution**: Comprehensive CSS overrides with `!important` declarations target actual DOM structure
- **Key CSS Targets**:
  - `.form-control`, `input.field`, `.clearable.form-control` - Input field styling with Vanden red focus
  - `.control-label` - Label styling with Vanden dark gray text
  - `.btn-primary` - Sign In button with Vanden red background and hover effects
  - `.lfr-btn-label` - Button text styling with white color
  - `.taglib-text a` - Footer links with Vanden red color and hover effects
  - `.portlet`, `.portlet-content`, `.portlet-body` - Remove unwanted portlet container styling
- **Features**: Red focus borders, themed buttons, consistent typography, proper error styling
- **Implementation**: All styling scoped to `.login-content` to prevent interference with other elements

### Secondary Navigation Implementation Requirements
- **Problem**: Navigation dropdowns not working due to API structure mismatch
- **Root Cause**: Code looked for `item.children` but Liferay API returns `item.navigationMenuItems`
- **Solution**: Updated `createNavItem()` function to handle both API and fallback structures
- **Key Features**:
  - **API Support**: Handles `navigationMenuItems` from Liferay Headless Delivery API
  - **Fallback Support**: Maintains `children` compatibility for manual navigation
  - **Property Mapping**: Supports both `item.link || item.url` and `item.name || item.title`
  - **Dropdown Behavior**: Hover to show, click to toggle, keyboard navigation (Enter/Space/Escape)
  - **Outside Click**: Closes all dropdowns when clicking outside navigation
  - **Multiple Dropdown Management**: Closes other dropdowns when opening new ones
- **CSS Classes**: `.has-dropdown`, `.dropdown-menu`, `.show`, `.active` for proper styling
- **Accessibility**: Full keyboard navigation and screen reader support
- **Implementation**: Fragment-scoped queries prevent interference with other components

### Fragment Dropdown Scoping Requirements
- **Problem**: Fragment dropdown code was interfering with other Liferay functionality
- **Root Cause**: Global dropdown initialization caused conflicts with Liferay's native dropdown systems
- **Solution**: Strictly scope all dropdown functionality to only affect header navigation within the fragment
- **Key Features**:
  - **Fragment-Only Scope**: All dropdown queries strictly limited to `fragmentElement`
  - **No Global Interference**: Removed all document-wide dropdown handling
  - **Native Liferay Compatibility**: Allows Liferay's native dropdown systems to work uninterrupted
  - **Header Navigation Only**: Dropdown functionality limited to navigation menu items within fragment
- **Implementation**: All dropdown selectors use `fragmentElement.querySelectorAll()` exclusively
- **Outside Click**: Only closes dropdowns within the fragment scope
- **Accessibility**: Maintains keyboard navigation for fragment dropdowns only

### Header JavaScript Scoping Requirements
- **Critical Rule**: All JavaScript in header fragment must be scoped ONLY to navigation menu functionality
- **Scope Limitation**: JavaScript must only affect elements within the header fragment's navigation area
- **DOM Query Requirements**:
  - Use `fragmentElement.querySelector()` for all DOM queries
  - Never use `document.querySelector()` or global selectors
  - Scope all event listeners to elements within the fragment
- **Timing Requirements**:
  - Initialize dropdowns AFTER navigation rendering is complete
  - Use `setTimeout()` delay to ensure DOM elements exist before attaching handlers
  - Call `initializeDropdowns()` only after `renderNavigation()` completes
- **Event Handler Scoping**:
  - All event handlers must be scoped to fragment elements only
  - Outside click detection limited to fragment scope
  - No interference with Liferay's global event systems
- **Debugging**: Include console logs to verify dropdown initialization and element counts

### CSS Wrapper Scoping Requirements
- **Critical Rule**: ALL CSS must be scoped to `#wrapper` to prevent interference with Liferay admin interface
- **Global CSS Scoping**: Every selector in global CSS client extension must be prefixed with `#wrapper`
- **Fragment CSS Scoping**: Every selector in fragment CSS files must be prefixed with `#wrapper`
- **Scope Coverage**:
  - Typography: `#wrapper h1`, `#wrapper h2`, etc.
  - Buttons: `#wrapper .vanden-btn`
  - Utilities: `#wrapper .vanden-*`
  - Grids: `#wrapper .vanden-grid`
  - Responsive: `@media { #wrapper .class }`
  - Custom scrollbars: `#wrapper ::-webkit-scrollbar`
- **Admin Interface Protection**: Ensures Liferay admin interface styling remains unaffected
- **Implementation Pattern**: 
  - Before: `.vanden-btn { ... }`
  - After: `#wrapper .vanden-btn { ... }`
- **Scope Verification**: Test that admin interface functions normally with scoped CSS

### Liferay Fragment ZIP Structure Requirements

**Individual Fragment ZIP Structure:**
```
fragment-name/
├── fragment.json          # Main fragment metadata
├── configuration.json     # Fragment configuration schema  
├── index.html            # FreeMarker template
├── index.css             # Fragment styles
├── index.js              # Fragment JavaScript
└── thumbnail.png         # Fragment thumbnail (REQUIRED)
```

**Fragment Collection ZIP Structure:**
```
collection-name/           # Root directory REQUIRED for proper import
├── collection.json       # Collection metadata (name, description)
├── fragments/
│   ├── fragment-name-1/
│   │   ├── fragment.json
│   │   ├── configuration.json
│   │   ├── index.html
│   │   ├── index.css
│   │   ├── index.js
│   │   └── thumbnail.png
│   ├── fragment-name-2/
│   │   └── [same structure]
│   └── ...
└── resources/            # Optional shared resources
    ├── icon-1.svg
    ├── logo.png
    └── ...
```

**Critical ZIP Creation Fix (Fixed Fragment Collection Resources Upload Issue):**
- **Problem**: Fragment collection resources not appearing in Liferay Resources tab
- **Root Cause**: Incorrect ZIP structure without proper root directory
- **Solution**: Use Python zipfile module to create ZIP with collection-name/ as root directory
- **Working Implementation**:
  ```python
  with zipfile.ZipFile('collection.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
      zipf.write('collection.json', 'collection-name/collection.json')
      zipf.write('resources', 'collection-name/resources/')
      # Add all files with collection-name/ prefix
  ```
- **Key Requirements**:
  - Root directory must match collection name (e.g., `vanden-recycling/`)
  - All files must be prefixed with root directory path
  - Use Python zipfile.ZIP_DEFLATED compression method
  - Structure must match working Liferay collections exactly

**Fragment Collection Resources Implementation:**
- **Resources Directory**: Place all shared assets (SVG, PNG, etc.) in `resources/` at collection root
- **Reference Syntax**: Use `[resources:filename.svg]` in fragment HTML to reference collection resources
- **Performance Benefits**: Resources are cached and shared across all fragments in the collection
- **Best Practice**: Prefer resources over base64 data URLs for better performance and maintainability
- **Example Implementation**:
  ```html
  <!-- Instead of base64 data URL -->
  <img src="[resources:vanden-logo.svg]" alt="Logo" />
  
  <!-- Resources directory structure -->
  resources/
  ├── vanden-logo.svg
  ├── recycling-visual.svg
  └── icons/
      ├── recycle-icon.svg
      └── trade-icon.svg
  ```

**Key Requirements:**
- Fragment ZIP: Must contain fragment folder with all files inside
- Collection ZIP: Must have proper root directory structure (collection-name/) containing collection.json + fragments/ + resources/
- Fragment.json: Must include all path references AND thumbnailPath (thumbnails are REQUIRED)
- Collection.json: Simple object with name and description only
- Thumbnail files: Every fragment must have thumbnail.png file (70+ bytes) and thumbnailPath reference
- Select field typeOptions: Must be object with validValues array, not direct array
- Resources: Place in resources/ directory and reference with `[resources:filename]` syntax
- ZIP Creation: Use Python zipfile module with proper root directory structure to ensure resources upload correctly

**Select Field Configuration Format:**
```json
"typeOptions": {
  "validValues": [
    {"value": "option1", "label": "Option 1"},
    {"value": "option2", "label": "Option 2"}
  ]
}
```

### Liferay Client Extension YAML Structure Requirements

**Working Client Extension YAML Format:**
```yaml
assemble:
  - from: src
    into: static

extension-name:
  name: Human Readable Name
  type: globalCSS  # or globalJS
  url: css/file.css  # single file reference
  # For JS only:
  async: true
  data-senna-track: permanent
  fetchpriority: low
```

**Common Client Extension Issues:**
- Missing `name` field causes blank deployment
- Using `cssURLs: [array]` instead of `url: file.css` breaks loading
- Must use single file reference, not array format
- JS extensions should include async, data-senna-track attributes for SPA compatibility

**Fragment Configuration Validation Errors:**
- `options` field is deprecated - must use `typeOptions`
- `typeOptions` must be object with `validValues` array, not direct array
- Validation error: "expected type: JSONObject, found: JSONArray" means wrong structure

## System Architecture

### Completed Implementation
- **Fragment Collection**: 6 production-ready fragments recreating Vanden Recycling website
- **Client Extensions**: Global CSS and JavaScript for site-wide functionality
- **Authentic Branding**: Exact color scheme and design patterns from vandenrecycling.com
- **Responsive Design**: Mobile-first approach with hamburger menus and adaptive layouts
- **SPA Navigation**: Full SennaJS compatibility with proper event handling

### Authentication & Security
- **CSRF Protection**: All API calls secured with `?p_auth={Liferay.authtoken}` parameter
- **Conditional Rendering**: Authentication-aware UI components using `themeDisplay.isSignedIn()`
- **Native Portlet Integration**: Leveraging Liferay's built-in login and user profile portlets

### API Integration
- **Headless Delivery API**: Dynamic content loading from Liferay's REST APIs
- **Navigation API**: `/o/headless-delivery/v1.0/navigation-menus/{menuId}?nestedFields=true`
- **Authenticated Requests**: Consistent security parameter usage across all API calls

## Key Components

### Implemented Fragments
1. **vanden-header**: Site header with dynamic navigation and recruitment banner
   - **JavaScript Scoping**: All JS limited to navigation menu functionality only
   - **DOM Queries**: Use `fragmentElement.querySelector()` exclusively
   - **Event Handlers**: Scoped to fragment elements, no global interference
   - **Dropdown Timing**: Initialize after navigation rendering with setTimeout delay
2. **vanden-hero**: Homepage hero with animated recycling symbols and CTAs
3. **vanden-services**: Services showcase displaying Recycle, Trade, Knowledge sections
4. **vanden-footer**: Site footer with contact CTA and social links
5. **pcr-hero**: Post-Consumer Recycled Plastic page hero with plastic type icons
6. **pcr-content**: PCR page content with monitoring aspects and compliance information

### Client Extensions
1. **vanden-global-css**: Authentic Vanden brand colors and responsive design system
   - **CSS Scoping**: ALL selectors prefixed with `#wrapper` to prevent admin interface conflicts
   - **Scope Coverage**: Typography, buttons, utilities, grids, responsive styles, custom scrollbars
   - **Admin Protection**: Ensures Liferay admin interface styling remains unaffected
2. **vanden-global-js**: SPA navigation support and global interactive functionality

### Fragment Configuration System
- **Type-Safe Configuration**: Structured configuration.json with proper field types
- **Default Value Patterns**: `${configuration.fieldName!'defaultValue'}` syntax for null safety
- **Boolean Configuration**: Explicit true/false defaults for boolean fields
- **Select Options**: Dropdown configuration fields with predefined options
- **Conditional Rendering**: FreeMarker conditionals based on configuration values

### Fragment Instance Management
- **Built-in fragmentElement**: Automatic fragment container reference provided by Liferay
- **Scoped DOM Queries**: All queries use `fragmentElement.querySelector()` for instance isolation
- **Multiple Instance Support**: Prevents conflicts when same fragment appears multiple times
- **CSS Scoping**: Fragment-specific styling using `[data-lfr-fragment-entry-link-id]` selectors

### Fragment Collection Resources System
- **Shared Asset Management**: Resources directory enables sharing assets across multiple fragments
- **Reference Syntax**: `[resources:filename.ext]` in FreeMarker templates automatically resolves to collection resources
- **Performance Optimization**: Resources are cached by Liferay and served efficiently vs inline base64 data
- **Asset Organization**: Supports subdirectories within resources/ for organized asset structure
- **Deployment Structure**: Resources are deployed with the collection and available to all fragments
- **Implementation Benefits**:
  - Cleaner fragment HTML without embedded SVG/base64 data
  - Reduced fragment file sizes and faster parsing
  - Centralized asset management for brand consistency
  - Easy updates to shared assets across all fragments
  - Better browser caching and network performance

## Data Flow

1. **Fragment Initialization**: Liferay provides `fragmentElement` and `configuration` objects
2. **Configuration Processing**: Fragment reads settings from configuration.json values
3. **API Authentication**: Security token retrieved from `Liferay.authtoken`
4. **Data Fetching**: Authenticated API calls to Liferay's Headless Delivery endpoints
5. **DOM Manipulation**: Updates scoped to fragment instance using `fragmentElement`
6. **Event Handling**: SennaJS navigation events ensure proper lifecycle management

## External Dependencies

### Liferay Platform Services
- **Headless Delivery API**: RESTful content and navigation services
- **Authentication System**: CSRF token generation and user session management
- **Portlet Framework**: Login, user profile, and other native Liferay components
- **SennaJS**: Single Page Application navigation library
- **FreeMarker**: Server-side templating engine

### Frontend Technologies
- **Vanilla JavaScript**: No external framework dependencies for fragment logic
- **CSS3**: Modern styling with fragment-scoped selectors
- **Responsive Design**: Mobile-optimized layouts with media queries

## Recent Changes

### July 2025 - Fragment Collection Resources Implementation & ZIP Structure Fix
- ✅ Migrated from base64 SVG data URLs to proper Liferay fragment collection resources
- ✅ Created centralized resources/ directory with optimized SVG assets (vanden-logo.svg, recycling-visual.svg)
- ✅ Updated all fragments to use `[resources:filename.svg]` syntax following Liferay best practices
- ✅ Improved performance by eliminating large base64 strings from fragment HTML
- ✅ Enhanced maintainability with centralized asset management approach
- ✅ **CRITICAL FIX**: Resolved fragment collection resources not uploading to Liferay Resources tab
- ✅ **ZIP Structure Fix**: Added proper root directory structure (vanden-recycling/) using Python zipfile module
- ✅ **Thumbnail Requirements**: Added required thumbnail.png files (70 bytes) and thumbnailPath references to all fragment.json
- ✅ **Working Collection**: Fragment collection resources now properly upload and appear in Liferay Resources tab
- ✅ Documented fragment collection ZIP creation fix and requirements for future implementations
- ✅ Regenerated all deployment packages with proper resource structure and working ZIP format
- ✅ **Search Functionality**: Added complete search modal with embedded Liferay search bar using `[@liferay.search_bar /]` macro
- ✅ **Search Button Styling**: Fixed contrast issues with proper hover states (transparent to red background)
- ✅ **Embedded Search Styling**: Comprehensive CSS targeting for all Liferay search components with Vanden theme
- ✅ **Search Configuration**: Added configurable search button via `showSearch` checkbox (default: enabled)
- ✅ **Search Portlet Configuration**: Configured with proper scope (`this-site`), destination page (`/search`), and parameters for site-specific searching
- ✅ **Fragment FreeMarker Fix**: Corrected syntax to avoid `<` character conflicts in fragment context, using inline preferences string
- ✅ **Proper Portlet Preferences**: Updated to use `freeMarkerPortletPreferences.getPreferences(preferencesMap)` approach following Liferay best practices

### December 2024 - Complete Vanden Recycling Implementation
- ✓ Analyzed original vandenrecycling.com website for authentic recreation
- ✓ Created global CSS client extension with exact Vanden brand colors
- ✓ Implemented global JavaScript client extension for SPA navigation
- ✓ Built responsive header fragment with dynamic navigation and mobile menu
- ✓ Created homepage hero section with animated recycling symbols
- ✓ Developed services showcase highlighting Recycle, Trade, Knowledge areas
- ✓ Implemented footer with contact CTA and proper social links
- ✓ Built PCR page hero with interactive plastic type icons (rPET, rHDPE, rLDPE, rPP)
- ✓ Created comprehensive PCR content section with monitoring aspects
- ✓ Added compliance section and final CTA components
- ✓ Implemented comprehensive accessibility features and ARIA support
- ✓ Added scroll-based animations and intersection observers
- ✓ Created deployment documentation and configuration guides

### July 2025 - Header Navigation and Image Enhancement Fixes
- ✓ Fixed fragment configuration validation errors (options → typeOptions)
- ✓ Corrected typeOptions format to use validValues object structure
- ✓ Fixed client extension YAML format issues causing blank deployments
- ✓ Updated client extensions to use proper name field and url structure
- ✓ Documented proper Liferay ZIP structure requirements
- ✓ Created final deployment packages with all validation fixes applied
- ✓ Corrected brand colors from incorrect green to authentic Vanden red scheme
- ✓ Updated all CSS variables to use proper red-based color palette
- ✓ Fixed all fragment color references (gradient-green → gradient-red, etc.)
- ✓ Created custom Vanden logo SVG with recycling theme and red branding
- ✓ Added editable image attributes to header and footer logos
- ✓ Applied data-lfr-editable-id and data-lfr-editable-type="image" to all images
- ✓ Implemented proper login modal functionality from reference fragment
- ✓ Login button opens modal overlay instead of redirecting to /c/portal/login
- ✓ Uses FreeMarker template to embed Liferay login portlet in modal
- ✓ Modal checks user login status and shows appropriate content
- ✓ Added proper modal styling with backdrop blur and animations
- ✓ Documented login modal implementation requirements in User Preferences
- ✓ Fixed dropdown menu interference by properly scoping all JavaScript to fragmentElement
- ✓ All DOM queries now use fragmentElement.querySelector() for proper fragment isolation
- ✓ Modal functions use fragment-scoped selectors with document fallback for compatibility
- ✓ Added comprehensive CSS overrides for login modal theme styling
- ✓ CSS selectors target actual Liferay DOM structure (.form-control, .btn-primary, .lfr-btn-label)
- ✓ Login modal content now inherits Vanden red theme instead of global Liferay styles
- ✓ Fixed secondary navigation dropdown functionality to match reference implementation
- ✓ Updated createNavItem() to handle navigationMenuItems from Liferay API response
- ✓ Enhanced dropdown initialization with hover, click, and keyboard navigation support
- ✓ Fixed dropdown initialization timing issue - moved initializeDropdowns() to after renderNavigation()
- ✓ Added setTimeout delay to ensure DOM elements exist before attaching event handlers
- ✓ Fixed dropdown functionality not working due to premature initialization
- ✓ Added debugging console logs to track dropdown initialization status
- ✓ Scoped ALL CSS to #wrapper to prevent interference with Liferay admin interface
- ✓ Updated global CSS client extension with #wrapper scoping for all selectors
- ✓ Updated all fragment CSS files with #wrapper scoping to prevent conflicts
- ✓ Fixed CSS affecting Liferay admin interface (typography, buttons, utilities, etc.)
- ✓ Maintained full functionality within #wrapper container while protecting admin interface
- ✓ Documented CSS wrapper scoping requirements and JavaScript header scoping rules
- ✓ Established critical rules for fragment JavaScript to only affect navigation functionality
- ✓ Created comprehensive scoping guidelines to prevent future Liferay conflicts
- ✓ Fixed Knowledge text overflow in services section SVG circle by adjusting font size and position
- ✓ Created editable Liferay image for hero recycling visual with animated SVG placeholder
- ✓ Added new vanden-btn-outline-white class for transparent white buttons on red backgrounds
- ✓ Fixed mobile menu CSS selector issues (.vanden-mobile-menu.active vs malformed selectors)
- ✓ Fixed dropdown menu CSS scoping issues preventing proper hover and active states
- ✓ Added comprehensive debugging to mobile menu and dropdown functionality
- ✓ Corrected hamburger menu animation CSS selectors for proper mobile menu toggle
- ✓ Fixed header dropdown horizontal overflow and positioning issues
- ✓ Improved dropdown menu styling with better spacing and hover effects
- ✓ Made recycling visual 25% larger (375px) with proper IMG tag containing base64 SVG for Liferay compliance
- ✓ Removed repetitive floating animations, using only clean fade-in effect
- ✓ Centered dropdown menus and prevented overflow on larger screens
- ✓ Fixed unclosed IMG tag in header fragment for proper HTML validation
- ✓ Fixed unclosed IMG tag in hero fragment for proper HTML validation
- ✓ Converted base64 SVG data URLs to proper fragment collection resources approach
- ✓ Created resources/ directory with recycling-visual.svg and vanden-logo.svg files
- ✓ Updated fragments to use [resources:filename.svg] syntax following Liferay best practices
- ✓ Regenerated all deployment packages with proper resource structure

### Brand Colors Implemented (Corrected to Authentic Vanden Red)
- Primary Red: #C41E3A (authentic Vanden brand color)
- Light Red: #DC3545
- Dark Red: #8B1E2E  
- Accent Red: #E74C3C
- Burgundy: #7D1935
- Maroon: #6B1B2E
- Supporting neutrals: whites, grays, and blacks for proper contrast

**Note**: Previously incorrectly used green colors - now corrected to match Vanden's actual red branding.

### Features Completed
- Mobile-responsive design with hamburger navigation
- SennaJS SPA navigation compatibility
- Intersection Observer animations
- Keyboard navigation and accessibility
- Fragment configuration systems
- Error handling and graceful fallbacks
- Print-friendly styles
- Reduced motion support