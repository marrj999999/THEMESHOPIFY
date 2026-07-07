# BBC Theme Development Rules

**Read this before every theme edit. No exceptions.**

---

## 1. CONTENT EDITABILITY — Mandatory

### ✅ All Content Must Be Editable
- **NO hardcoded text** — Every heading, paragraph, button label, badge → schema setting or block
- **NO hardcoded images** — Use `image_picker` in schema
- **NO hardcoded URLs** — Use `url` type in schema (no default values for URL fields)
- **NO hardcoded colors** — Use CSS variables or color_scheme settings

### ✅ Use Blocks for Repeating Items
- Testimonials → blocks
- Press items → blocks  
- Awards → blocks
- Timeline milestones → blocks
- FAQ items → blocks
- Gallery images → blocks
- Any list of similar items → blocks

### ✅ Block Schema Requirements
```liquid
"blocks": [
  {
    "type": "item_name",
    "name": "Human Readable Name",
    "settings": [
      // All fields the user needs to edit
    ]
  }
]
```

### ✅ Presets Must Include Default Content
- Every section needs a `presets` array
- Presets should include example blocks with real BBC content
- User can add section and immediately see how it looks

---

## 2. CSS RULES — Mandatory

### ✅ Use CSS Variables for Colors
```css
/* Always use these — never hardcode hex values */
--bbc-forest: #073e27;    /* Primary dark green */
--bbc-teal: #3f8b66;      /* Secondary green */
--bbc-gold: #ffa900;      /* Accent/CTA */
--bbc-cream: #f8f7f4;     /* Light background */
--bbc-steel: #8da4c1;     /* Secondary accent */
```

### ✅ Use CSS Variables for Typography
```css
--font-heading-family   /* For headings */
--font-body-family      /* For body text */
```

### ✅ Responsive Breakpoints
```css
@media (max-width: 768px) { /* Tablet and below */ }
@media (max-width: 480px) { /* Mobile only */ }
```

### ✅ Accessibility — Required
```css
/* Every interactive element needs focus state */
:focus-visible {
  outline: 2px solid var(--bbc-gold);
  outline-offset: 2px;
}

/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### ✅ CSS Location
- Section-specific styles → `<style>` tag within section file
- Shared product page styles → `assets/bbc-product-styles.css`
- Global variables → `snippets/bbc-design-system.liquid`

### ❌ CSS Anti-Patterns
- No `!important` unless absolutely necessary
- No inline styles in HTML
- No pixel values for font-size (use rem)
- No fixed heights that break with content
- No z-index over 100 without documentation

---

## 3. HTML/LIQUID RULES — Mandatory

### ✅ Semantic HTML
```html
<article> for cards, posts, items
<section> for page sections
<nav> for navigation
<header>/<footer> for section headers/footers
<blockquote> for quotes
<cite> for attribution
<time> for dates
```

### ✅ Accessibility Attributes
```html
<!-- Images need alt text -->
<img alt="{{ block.settings.alt_text | default: block.settings.title }}">

<!-- Decorative elements hidden from screen readers -->
<span aria-hidden="true">🏆</span>

<!-- Interactive elements need labels -->
<button aria-label="Close menu">
<a aria-label="Read more about {{ article.title }}">
```

### ✅ Shopify Attributes for Theme Editor
```liquid
<!-- Always add to block containers -->
<div {{ block.shopify_attributes }}>
```

### ✅ Loading Performance
```html
<!-- Lazy load images below the fold -->
<img loading="lazy">

<!-- Eager load hero/above-fold images -->
<img loading="eager" fetchpriority="high">
```

---

## 4. SCHEMA RULES — Mandatory

### ✅ URL Fields Cannot Have Defaults
```json
// ❌ WRONG — will cause error
{ "type": "url", "id": "link", "default": "https://..." }

// ✅ CORRECT
{ "type": "url", "id": "link", "label": "Link URL" }
```

### ✅ Use Appropriate Field Types
| Content | Field Type |
|---------|------------|
| Short text (1 line) | `text` |
| Long text (paragraph) | `textarea` |
| Rich text with formatting | `richtext` |
| Image | `image_picker` |
| Link/URL | `url` |
| Page/Collection link | `url` (with link picker) |
| Yes/No toggle | `checkbox` |
| Multiple options | `select` |
| Number | `number` or `range` |
| Color | `color` or `color_scheme` |
| Video | `video` or `video_url` |

### ✅ Helpful Info Text
```json
{
  "type": "image_picker",
  "id": "hero_image",
  "label": "Hero image",
  "info": "Recommended: 1920x1080px, JPG or WebP"
}
```

### ✅ Group Related Settings
```json
{
  "type": "header",
  "content": "Button Settings"
},
{ "type": "text", "id": "button_text" },
{ "type": "url", "id": "button_url" }
```

---

## 5. FILE ORGANIZATION

### Theme Structure
```
sections/
  bbc-*.liquid         # All BBC custom sections
snippets/
  bbc-*.liquid         # Reusable components
assets/
  bbc-*.css            # Stylesheets
  bbc-*.js             # Scripts
templates/
  *.json               # Page templates
config/
  settings_schema.json # Theme settings
  settings_data.json   # Theme data
```

### Naming Convention
- Sections: `bbc-[name].liquid`
- Snippets: `bbc-[name].liquid`  
- Assets: `bbc-[name].[ext]`

---

## 6. PRE-COMMIT CHECKLIST

Before pushing any change:

- [ ] All text content is in schema settings (not hardcoded)
- [ ] All images use `image_picker` (not hardcoded paths)
- [ ] No URL fields have default values
- [ ] CSS uses variables (no hardcoded colors)
- [ ] `@media (prefers-reduced-motion)` included for animations
- [ ] Focus states defined for interactive elements
- [ ] `{{ block.shopify_attributes }}` on block containers
- [ ] Images have `alt` attributes
- [ ] Semantic HTML tags used
- [ ] Mobile responsive (tested at 375px width)
- [ ] Presets include realistic default content

---

## 7. PAGE TEMPLATES — Best Practice

### ✅ Use BBC Custom Sections
When building page templates, prefer BBC custom sections over Dawn defaults:

| Use This | Instead Of |
|----------|------------|
| `bbc-page-hero` | `image-banner` |
| `bbc-stats-section` | `multicolumn` for stats |
| `bbc-founders` | `image-with-text` for people |
| `bbc-timeline` | `multicolumn` for timelines |
| `bbc-awards` | `multicolumn` for awards |
| `bbc-press-wall` | `rich-text` for press |
| `bbc-testimonials` | `testimonials` |
| `bbc-faq` | Dawn FAQ section |
| `bbc-contact-options` | `multicolumn` for contact methods |
| `bbc-quick-faq` | inline FAQ on contact page |
| `bbc-location` | text-only address |
| `bbc-impact` | `image-with-text` for social impact |
| `bbc-community` | `image-gallery` for Instagram |
| `bbc-epic-journeys` | `image-with-text` for journeys |

### ✅ Template Naming
- `page.about.json` — About page
- `page.contact-us.json` — Contact page
- `page.impact.json` — Build to Bond / Impact
- `page.workshop.json` — Workshop info
- `product.bbc-kit.json` — Frame build kits

---

## 8. QUICK REFERENCE

### Shopify API Upload
```bash
SHOP="bamboo-bicycle-club-london-uk.myshopify.com"
TOKEN="SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV"
# ⚠️ 2026-06-12: 191768756598 is now the LIVE 'main' theme (old design). Do NOT push redesign to it.
# Redesign sandbox (deploy redesign here):
THEME="195991470454"

curl -X PUT "https://${SHOP}/admin/api/2024-10/themes/${THEME}/assets.json" \
  -H "X-Shopify-Access-Token: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"asset": {"key": "sections/FILE.liquid", "value": "CONTENT"}}'
```

### Preview URL
```
https://bamboobicycleclub.org/?preview_theme_id=191768756598
```

### Theme Editor
```
Shopify Admin → Online Store → Themes → BBC Dawn → Customize
```

---

---

## 9. DESIGN CRITIC — Anti-Generic Check

Before committing CSS, run this check:

### ❌ Generic Patterns to Reject
```css
border-radius: 12px;           /* Same everywhere */
transform: translateY(-4px);   /* Same hover */
box-shadow: 0 4px 20px...      /* Soft, safe */
padding: 24px;                 /* Same spacing */
```

### ✅ BBC Distinctive Patterns
```css
border-radius: 0;                       /* Sharp edges */
border-left: 4px solid var(--bbc-gold); /* Border accent */
box-shadow: 8px 8px 0 var(--bbc-gold);  /* Offset shadow */
clip-path: polygon(...);                /* Diagonal sections */
```

### Signature Elements Required
- [ ] Bamboo stripe device (`.bamboo-stripe`)
- [ ] At least one sharp-edged element
- [ ] Gold used boldly (backgrounds, not just accents)
- [ ] Asymmetric spacing somewhere
- [ ] Varied hover states (not all translateY)

### CSS Classes Available
See `assets/bbc-distinctive.css`:
- `.bamboo-stripe`, `.bamboo-stripe--horizontal`
- `.bbc-card--sharp`, `.bbc-card--offset`, `.bbc-card--organic`
- `.bbc-button--gold`, `.bbc-button--slide`
- `.bbc-duotone`, `.bbc-highlight`
- `.bbc-feature`, `.bbc-testimonial--bold`

Full design critic checklist: `skills/bbc-design-critic/SKILL.md`

---

*Last updated: 2026-02-12*
