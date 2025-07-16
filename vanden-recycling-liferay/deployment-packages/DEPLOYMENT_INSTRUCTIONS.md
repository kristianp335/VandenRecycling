# Vanden Recycling Liferay Deployment Instructions

## Package Contents

This deployment package contains everything needed to deploy the Vanden Recycling website to Liferay DXP with proper Liferay fragment structure.

### 📦 What's Included

#### Individual Fragment ZIPs (Proper Liferay Structure)
- `individual-fragments/vanden-header.zip` - Site header with navigation  
- `individual-fragments/vanden-hero.zip` - Homepage hero section
- `individual-fragments/vanden-services.zip` - Services showcase
- `individual-fragments/vanden-footer.zip` - Site footer
- `individual-fragments/pcr-hero.zip` - PCR page header
- `individual-fragments/pcr-content.zip` - PCR page content

#### Client Extension ZIPs (Ready to Deploy)
- `client-extensions/vanden-global-css.zip` - Global styles and design system
- `client-extensions/vanden-global-js.zip` - Global JavaScript functionality

#### Complete Collection ZIP (Proper Liferay Structure)
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

**Option A: Import Complete Collection (RECOMMENDED)**
1. Go to Site Administration → Site Builder → Fragments
2. Click the three dots (⋮) next to Collections
3. Select "Import"
4. Upload `complete-collection/vanden-fragments-collection.zip`
5. All fragments will be imported into a new "Vanden Recycling Fragment Collection"

**Option B: Import Individual Fragments**
1. Create new fragment collection manually
2. For each fragment ZIP in `individual-fragments/` folder:
   - Open the collection → Import → Upload fragment ZIP
   - Each ZIP contains a fragment folder with all required files
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

## ⚙️ Fragment ZIP Structure

Each fragment ZIP follows proper Liferay structure:
```
fragment-name.zip
└── fragment-name/
    ├── fragment.json          # Fragment metadata
    ├── configuration.json     # Configuration schema
    ├── index.html            # FreeMarker template
    ├── index.css             # Fragment styles
    └── index.js              # Fragment JavaScript
```

Collection ZIP structure:
```
collection.zip
├── collection.json           # Collection metadata
└── fragments/
    ├── fragment-1/
    │   ├── fragment.json
    │   ├── configuration.json
    │   ├── index.html
    │   ├── index.css
    │   └── index.js
    └── fragment-2/
        └── [same structure]
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

**Fragments not importing properly:**
- Ensure ZIPs follow proper Liferay structure (fragment-name/files)
- Check that fragment.json includes all required paths
- Verify collection.json is at ZIP root for collections

**Styles not loading properly:**
- Ensure client extensions are deployed and active
- Check that global CSS is loaded before fragments

**Navigation not working:**
- Verify navigation menu ID is correct in header configuration
- Check that menu items have proper URLs

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

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