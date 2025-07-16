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

### Liferay Fragment ZIP Structure Requirements

**Individual Fragment ZIP Structure:**
```
fragment-name/
├── fragment.json          # Main fragment metadata
├── configuration.json     # Fragment configuration schema  
├── index.html            # FreeMarker template
├── index.css             # Fragment styles
├── index.js              # Fragment JavaScript
└── thumbnail.png         # Fragment thumbnail (optional)
```

**Fragment Collection ZIP Structure:**
```
collection.json           # Collection metadata (name, description)
fragments/
├── fragment-name-1/
│   ├── fragment.json
│   ├── configuration.json
│   ├── index.html
│   ├── index.css
│   ├── index.js
│   └── thumbnail.png
├── fragment-name-2/
│   └── [same structure]
└── ...
resources/               # Optional shared resources
├── icon-1.svg
├── logo.png
└── ...
```

**Key Requirements:**
- Fragment ZIP: Must contain fragment folder with all files inside
- Collection ZIP: Must have collection.json at root + fragments/ directory
- Fragment.json: Must include all path references (configurationPath, jsPath, etc.)
- Collection.json: Simple object with name and description only
- Select field typeOptions: Must be object with validValues array, not direct array

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
2. **vanden-hero**: Homepage hero with animated recycling symbols and CTAs
3. **vanden-services**: Services showcase displaying Recycle, Trade, Knowledge sections
4. **vanden-footer**: Site footer with contact CTA and social links
5. **pcr-hero**: Post-Consumer Recycled Plastic page hero with plastic type icons
6. **pcr-content**: PCR page content with monitoring aspects and compliance information

### Client Extensions
1. **vanden-global-css**: Authentic Vanden brand colors and responsive design system
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

### July 2025 - Fragment and Client Extension Fixes
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