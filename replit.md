# Vanden Recycling Liferay Implementation

## Overview

This repository contains a complete Liferay-native recreation of the Vanden Recycling website using fragments and client extensions. The implementation features authentic Vanden brand colors, responsive design, and improved UX while maintaining compatibility with Liferay's SPA navigation system. The project includes both homepage and Post-Consumer Recycled Plastic page implementations with modular, reusable components.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Brand Colors Implemented
- Primary Green: #2E7D32 (exact match to Vanden website)
- Light Green: #4CAF50
- Dark Green: #1B5E20
- Accent Green: #66BB6A
- Supporting neutrals: whites, grays, and blacks for proper contrast

### Features Completed
- Mobile-responsive design with hamburger navigation
- SennaJS SPA navigation compatibility
- Intersection Observer animations
- Keyboard navigation and accessibility
- Fragment configuration systems
- Error handling and graceful fallbacks
- Print-friendly styles
- Reduced motion support