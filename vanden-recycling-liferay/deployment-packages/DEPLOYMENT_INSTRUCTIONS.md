# Vanden Recycling Liferay Deployment Instructions

## Package Contents

This deployment package contains everything needed to deploy the Vanden Recycling website to Liferay DXP.

### 📦 What's Included

#### Individual Fragment ZIPs (Ready to Import)
- `individual-fragments/vanden-header.zip` - Site header with navigation
- `individual-fragments/vanden-hero.zip` - Homepage hero section  
- `individual-fragments/vanden-services.zip` - Services showcase
- `individual-fragments/vanden-footer.zip` - Site footer
- `individual-fragments/pcr-hero.zip` - PCR page header
- `individual-fragments/pcr-content.zip` - PCR page content

#### Client Extension ZIPs (Ready to Deploy)
- `client-extensions/vanden-global-css.zip` - Global styles and design system
- `client-extensions/vanden-global-js.zip` - Global JavaScript functionality

#### Complete Collection ZIP
- `complete-collection/vanden-fragments-collection.zip` - All fragments in one package

## 🚀 Quick Start Deployment

### Step 1: Deploy Client Extensions FIRST
**Important: Deploy these before importing fragments**

1. **Deploy Global CSS**
   - Go to Liferay Admin → Control Panel → Apps → Client Extensions
   - Upload `client-extensions/vanden-global-css.zip`
   - Deploy and activate

2. **Deploy Global JavaScript**
   - Upload `client-extensions/vanden-global-js.zip`
   - Deploy and activate

### Step 2: Import Fragments

**Option A: Import Complete Collection**
1. Go to Site Administration → Site Builder → Fragments
2. Create new collection named "Vanden Recycling"
3. Import `complete-collection/vanden-fragments-collection.zip`

**Option B: Import Individual Fragments**
1. Create new fragment collection
2. Import each fragment ZIP from `individual-fragments/` folder
3. Import order doesn't matter

### Step 3: Create Navigation Menus
1. Go to Site Administration → Site Builder → Navigation Menus
2. Create primary navigation menu
3. Add pages and configure hierarchy
4. Note the Menu ID for header configuration

### Step 4: Build Pages

#### Homepage
1. Create new page: "Home"
2. Add fragments in order:
   - Vanden Header
   - Vanden Hero  
   - Vanden Services
   - Vanden Footer

#### PCR Page
1. Create new page: "Post-Consumer Recycled Plastic"
2. Set friendly URL: `/post-consumer-recycled-plastic`
3. Add fragments in order:
   - Vanden Header
   - PCR Hero
   - PCR Content
   - Vanden Footer

### Step 5: Configure Fragments

#### Header Configuration
- Set `navigationMenuId` to your primary menu ID
- Configure banner text and recruitment links
- Enable/disable top banner as needed

#### Other Fragments
- Review each fragment's configuration options
- Customize text, layouts, and display options
- Test responsive behavior

## ⚙️ Configuration Guide

### Header Fragment Settings
```
navigationMenuId: [Your Menu ID]
showTopBanner: true
bannerText: "We're hiring! Join our team"
bannerLinkText: "View Careers"
bannerLinkUrl: "https://careers.vandenrecycling.com/"
```

### Hero Fragment Settings
```
heroTitle: "Custom title or leave default"
heroSubtitle: "Custom subtitle or leave default"
backgroundStyle: "gradient-green" (recommended)
showRecyclingIcons: true
```

### Services Fragment Settings
```
servicesLayout: "3-column-grid" (recommended)
showServiceIcons: true
```

## 🎨 Brand Colors Reference

The implementation uses authentic Vanden colors:
- **Primary Green**: #2E7D32
- **Light Green**: #4CAF50  
- **Dark Green**: #1B5E20
- **Accent Green**: #66BB6A

## 📱 Features Included

- **Responsive Design**: Works on all device sizes
- **SPA Navigation**: Smooth page transitions with SennaJS
- **Accessibility**: Screen reader support and keyboard navigation
- **SEO Optimized**: Semantic HTML and proper heading structure
- **Performance**: Optimized loading and animations

## 🔧 Troubleshooting

### Common Issues

**Styles not loading properly:**
- Ensure client extensions are deployed and active
- Check that global CSS is loaded before fragments

**Navigation not working:**
- Verify navigation menu ID is correct in header configuration
- Check that menu items have proper URLs

**Mobile menu not appearing:**
- Confirm global JavaScript is loaded and active
- Test on actual mobile device or browser dev tools

**Fragment configuration not saving:**
- Ensure you have proper permissions
- Try editing in fragment view vs page view

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📞 Support

For deployment assistance:
1. Check the included documentation files
2. Review Liferay DXP fragment documentation
3. Test in a staging environment first

## ✅ Post-Deployment Checklist

- [ ] Client extensions deployed and active
- [ ] All fragments imported successfully  
- [ ] Navigation menus created and configured
- [ ] Homepage built with all sections
- [ ] PCR page built with all sections
- [ ] Mobile responsiveness tested
- [ ] Navigation functionality verified
- [ ] Contact forms linked properly
- [ ] Cross-browser testing completed

The Vanden Recycling website is now ready to go live!