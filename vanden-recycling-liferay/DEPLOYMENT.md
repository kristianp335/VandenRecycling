# Vanden Recycling Liferay Deployment Guide

## Overview

This package contains a complete Liferay implementation of the Vanden Recycling website, featuring authentic brand colors, responsive design, and modular fragment architecture.

## Package Contents

### Client Extensions
1. **vanden-global-css** - Global CSS with authentic Vanden brand colors
2. **vanden-global-js** - Global JavaScript for SPA navigation and functionality

### Fragments
1. **vanden-header** - Site header with dynamic navigation
2. **vanden-hero** - Homepage hero section with recycling animations
3. **vanden-services** - Services showcase (Recycle, Trade, Knowledge)
4. **vanden-footer** - Site footer with contact CTA
5. **pcr-hero** - Post-Consumer Recycled Plastic page hero
6. **pcr-content** - PCR page content sections

## Deployment Steps

### 1. Deploy Client Extensions First

Deploy the client extensions in this order:
1. Deploy `vanden-global-css`
2. Deploy `vanden-global-js`

These provide the foundation styling and functionality for all fragments.

### 2. Import Fragment Collection

1. Create a new Fragment Collection in Liferay
2. Import all fragments from the collection ZIP
3. Verify all fragments appear correctly in the fragment library

### 3. Configure Navigation

1. Create navigation menus in Liferay DXP
2. Note the menu IDs for configuration
3. Configure the header fragment with the correct menu ID

### 4. Create Pages

#### Homepage
1. Create a new page for the homepage
2. Add fragments in this order:
   - Vanden Header
   - Vanden Hero
   - Vanden Services
   - Vanden Footer

#### PCR Page
1. Create the PCR page at `/post-consumer-recycled-plastic`
2. Add fragments in this order:
   - Vanden Header
   - PCR Hero
   - PCR Content
   - Vanden Footer

### 5. Configure Fragments

#### Header Configuration
- Set `navigationMenuId` to your primary menu ID
- Configure banner text and links as needed
- Enable/disable top banner as required

#### Hero Configuration
- Customize titles and CTAs
- Choose background style (gradient-green recommended)
- Configure recycling icon display

#### Services Configuration
- Update service descriptions and links
- Choose layout style (3-column grid recommended)
- Customize service icons and content

#### Footer Configuration
- Configure contact CTA section
- Update footer links and descriptions
- Set social media links

## Brand Colors Used

The implementation uses authentic Vanden Recycling colors:

- **Primary Green**: #2E7D32
- **Light Green**: #4CAF50
- **Dark Green**: #1B5E20
- **Accent Green**: #66BB6A

These colors are applied consistently across all components and match the original website design.

## Features Included

### Responsive Design
- Mobile-first approach
- Hamburger navigation for mobile
- Adaptive layouts for all screen sizes

### Accessibility
- Screen reader support
- Keyboard navigation
- ARIA labels and landmarks
- High contrast compliance

### SPA Navigation
- SennaJS compatibility
- Smooth page transitions
- Proper fragment re-initialization

### Performance
- Optimized CSS and JavaScript
- Efficient DOM manipulation
- Lazy loading animations

## Configuration Options

Each fragment includes extensive configuration options:

- **Text Content**: Editable titles, descriptions, and CTAs
- **Layout Options**: Multiple layout styles for different use cases
- **Visual Settings**: Background styles, icon displays, color schemes
- **Functionality**: Toggle features like breadcrumbs, banners, sections

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers

## SEO Features

- Semantic HTML structure
- Proper heading hierarchy
- Meta description support
- Open Graph compatibility

## Maintenance

### Content Updates
- Use Liferay's inline editing for quick text changes
- Access fragment configuration for structural changes
- Update navigation menus through Liferay admin

### Color Customization
- Modify CSS custom properties in the global CSS file
- Update the client extension and redeploy
- Changes apply site-wide automatically

### Adding New Sections
- Create additional fragments using the established patterns
- Follow the naming convention: `vanden-[section-name]`
- Include proper SennaJS event handling

## Support

For technical issues or customization requests, refer to:
- Fragment configuration documentation
- Liferay DXP fragment development guide
- The included README.md files in each fragment directory

## Version

Current Version: 1.0
Last Updated: 2024
Compatible with: Liferay DXP 7.4+