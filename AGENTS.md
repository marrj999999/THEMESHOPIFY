# BBC Shopify Theme — Agent Rules

**Read this before every theme edit. No exceptions.**

---

## QUICK START

```bash
cd ~/Projects/bbc-theme-new
shopify theme dev --store=bamboo-bicycle-club-london-uk
```

> ⚠️ **THEME TARGETS CHANGED (verified 2026-06-12).** `191768756598` ("BBC Dawn (New Build)") is now the **`main` / LIVE** theme serving `bamboobicycleclub.org` (still the OLD design). **Do NOT push redesign work to it.**
> The **2026 redesign sandbox = `195991470454`** ("BBC Redesign 2026 (WIP - do not publish)", unpublished). Deploy ALL redesign `sections/*` + `assets/*` there. Sandbox templates/section-groups are the source-of-truth for what's wired — reconcile, don't bulk-overwrite.

**Redesign sandbox (deploy here):** `195991470454` — preview `https://bamboobicycleclub.org/?preview_theme_id=195991470454`
**LIVE theme (do NOT push redesign to it):** `191768756598`
**Token:** `SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV`

---

## 🚨 CRITICAL RULES

| Rule | Why |
|------|-----|
| **NEVER modify templates/*.json** | Contains James's customizations — uploading nukes his work |
| **NEVER modify config/settings_data.json** | Contains theme settings customizations |
| **NEVER hardcode content** | Theme editor becomes useless |
| **ALL content must be editable** | James updates copy/images in Shopify editor |
| **NO URL field defaults** | Shopify schema throws errors |
| **NO emojis** | Use `{% render 'bbc-icons', icon: 'name' %}` |
| **Logos must be editable** | Use `image_picker` blocks + optional asset fallback |
| **Test in preview FIRST** | Live = customer-facing |
| **Backup before push** | No undo in Shopify |

---

## 🔍 BEFORE BUILDING ANYTHING NEW (MANDATORY)

**Run Design Research Protocol before ANY new page, section, or feature.**

**Full Protocol:** `~/.openclaw/workspace/artifacts/tech/shopify/DESIGN_RESEARCH_PROTOCOL.md`
**Research Library:** `~/.openclaw/workspace/artifacts/tech/shopify/research/`

### Workflow
1. **Check existing research** → `research/by-page-type/` or `research/by-element/`
2. **Query Brain API** → customer psychology, objections, motivations
3. **Query Lead agents** → audience-specific insights (Consumer, Corporate, Education, Prison)
4. **If insufficient research** → conduct 50-site analysis:
   - 20 award-winning e-commerce
   - 10 cycle/bike industry
   - 10 social enterprise
   - 10 storytelling sites
5. **Score and document** → weighted criteria, pattern extraction
6. **Present recommendations** → before implementing
7. **Save research** → to library for reuse

### Minimum Viable Research (if time-constrained)
14 sites: 5 e-commerce + 3 cycle + 3 social enterprise + 3 storytelling

### Trigger Response
When James requests new page/feature, respond:
```
🔍 Design Research Initiated
- Request: [parsed type + audience]
- Checking existing research...
- Querying agents...
- Research scope needed: [X sites]
Proceed?
```

---

## 🔒 PRESERVING EDITOR CHANGES

### What Shopify Editor Stores (DON'T TOUCH)
| File Type | Contains | Safe to Edit? |
|-----------|----------|---------------|
| `templates/*.json` | Section order, block content, images James added | ❌ NEVER |
| `config/settings_data.json` | Theme settings, colors James chose | ❌ NEVER |
| `sections/*.liquid` | Section code/structure | ✅ YES |
| `snippets/*.liquid` | Reusable components | ✅ YES |
| `assets/*.css` | Stylesheets | ✅ YES |
| `layout/*.liquid` | Page layouts | ✅ YES (careful) |

### How Editor Changes Work
```
James edits in Shopify Editor
         ↓
Changes saved to templates/*.json
         ↓
If you upload templates/*.json → HIS CHANGES ARE LOST
```

### Safe Workflow
1. **Edit sections/*.liquid** — Structure/code changes
2. **Edit assets/*.css** — Styling changes  
3. **Edit snippets/*.liquid** — Component changes
4. **NEVER push templates/*.json** — James's content lives there

### If You Must Change a Template
```bash
# 1. Pull latest first (gets James's editor changes)
shopify theme pull --theme=191768756598 --only templates/

# 2. Make your change to the JSON structure only
# 3. Push back
shopify theme push --theme=191768756598 --only templates/product.json
```

---

## ✏️ CONTENT EDITABILITY (Mandatory)

### Every Element Must Be Editable
| Content Type | Schema Field Type |
|--------------|-------------------|
| Headlines | `text` or `textarea` |
| Body copy | `textarea` or `richtext` |
| Images | `image_picker` |
| Links/URLs | `url` (NO defaults!) |
| Buttons | `text` for label, `url` for link |
| Colors | `color` or `color_scheme` |
| Yes/No options | `checkbox` |
| Multiple options | `select` |

### ❌ WRONG — Hardcoded Content
```liquid
<h2>Why Choose Bamboo?</h2>
<p>Build your own bicycle frame from sustainable bamboo.</p>
<img src="{{ 'hero.jpg' | asset_url }}">
```

### ✅ CORRECT — Editable Content
```liquid
<h2>{{ section.settings.heading }}</h2>
<p>{{ section.settings.description }}</p>
{{ section.settings.image | image_url: width: 800 | image_tag }}

{% schema %}
{
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Why Choose Bamboo?" },
    { "type": "textarea", "id": "description", "label": "Description" },
    { "type": "image_picker", "id": "image", "label": "Image" }
  ]
}
{% endschema %}
```

### Blocks for Repeating Items
```liquid
{% for block in section.blocks %}
  <div {{ block.shopify_attributes }}>
    <h3>{{ block.settings.title }}</h3>
    <p>{{ block.settings.text }}</p>
  </div>
{% endfor %}

{% schema %}
{
  "blocks": [
    {
      "type": "item",
      "name": "Item",
      "settings": [
        { "type": "text", "id": "title", "label": "Title" },
        { "type": "textarea", "id": "text", "label": "Text" }
      ]
    }
  ]
}
{% endschema %}
```

---

## 📦 PRODUCT & PAGE STRATEGY

| Type | Page Type | Checkout | Notes |
|------|-----------|----------|-------|
| **DIY Kits** | Product page | Cart | `product.kit-*.json` templates |
| **Parts** | Product page | Cart | Standard Shopify |
| **Workshops** | Landing page + contact form | Email booking | NOT product pages |
| **Corporate** | Landing page + contact form | Email booking | Quote-based |

### Workshop Pages (NOT Products)
Workshops are exclusive experiences — no cart checkout.

**Required:**
- Landing page with contact form
- Upcoming dates per location
- Email to book workflow

**Sections:**
```
bbc-workshop-hero
bbc-workshop-locations    # Blocks: venue, dates, description
bbc-workshop-what-included
bbc-workshop-testimonials
bbc-contact-form
```

---

## PERFORMANCE (Shopify Official)

- **JS as progressive enhancement** — HTML/CSS first, JS only when no alternative
- **Minified bundle ≤16KB** — Shopify benchmark
- **No jQuery/React/Vue** — Use native browser APIs
- **Wrap JS in IIFE** — Prevents namespace collisions
- **Use defer/async on scripts** — Avoid parser-blocking
- **Lazy load below-fold images** — `loading: 'lazy'`
- **Eager load above-fold** — `loading: 'eager', fetchpriority: 'high'`
- **Complex operations BEFORE loops** — Not inside

---

## ACCESSIBILITY (WCAG Required)

```css
/* MANDATORY on all interactive elements */
:focus-visible {
  outline: 2px solid var(--bbc-gold);
  outline-offset: 2px;
}

/* MANDATORY on animated elements */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard navigation** | Tab/Shift+Tab works on all controls |
| **Focus visible** | Clear indicator on active elements |
| **Touch targets ≥44×44px** | All buttons, links, controls |
| **Color contrast 4.5:1** | Text against background |
| **Alt text on images** | Content images need descriptions |
| **Skip link** | Keyboard users bypass nav |
| **No zoom disable** | Never use `user-scalable=no` |

---

## CSS RULES

### Use Variables (Never Hardcode)
```css
--bbc-forest: #073e27;  /* Primary */
--bbc-teal: #3f8b66;    /* Secondary */
--bbc-gold: #ffa900;    /* CTAs */
--bbc-cream: #f8f7f4;   /* Backgrounds */
```

### Anti-Patterns
| ❌ Don't | ✅ Do |
|----------|-------|
| Hardcoded hex | CSS variables |
| `!important` | Increase specificity |
| `px` for font-size | `rem` units |
| Fixed heights | `min-height` or auto |
| Inline styles | CSS classes |

### BBC Distinctive (Not Generic)
```css
/* ❌ Generic AI-slop */
border-radius: 12px;
transform: translateY(-4px);

/* ✅ BBC Distinctive */
border-radius: 0;
border-left: 4px solid var(--bbc-gold);
box-shadow: 8px 8px 0 var(--bbc-gold);
```

---

## SECTION PATTERNS

### Always Include
```liquid
{% comment %} Shopify attributes for click-to-edit {% endcomment %}
{% for block in section.blocks %}
  <div {{ block.shopify_attributes }}>
    {{ block content }}
  </div>
{% endfor %}

{% comment %} Presets for "Add section" visibility {% endcomment %}
{% schema %}
{
  "presets": [{ "name": "Section Name", "blocks": [...] }]
}
{% endschema %}
```

### Block Caching Bug
Blocks "freeze" once template added. For shared content (testimonials, awards, press), use **hardcoded sections** that render directly.

### Schema Rules
- All content → schema settings or blocks
- No URL field defaults
- Group related settings with headers
- Use appropriate field types (`image_picker`, `richtext`, etc.)

---

## HTML RULES

### Semantic Elements
```html
<article>   <!-- cards, items -->
<section>   <!-- page sections -->
<nav>       <!-- navigation (with aria-current) -->
<main>      <!-- main content (with tabindex="-1") -->
```

### Images
```liquid
{% comment %} Content images — need alt {% endcomment %}
<img alt="{{ block.settings.alt_text | default: block.settings.title }}">

{% comment %} Decorative — hide from screen readers {% endcomment %}
<img alt="" aria-hidden="true">
```

### Forms
```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" required>
```

---

## FILE CONVENTIONS

| Type | Pattern |
|------|---------|
| Sections | `bbc-[name].liquid` |
| Snippets | `bbc-[name].liquid` |
| Assets | `bbc-[name].[ext]` |

**Safe to edit:** `sections/`, `snippets/`, `assets/`, `layout/`
**DON'T edit:** `templates/*.json`, `config/settings_data.json`

---

## PRE-COMMIT CHECKLIST

### ⚠️ Protect James's Editor Changes
- [ ] NOT pushing `templates/*.json`
- [ ] NOT pushing `config/settings_data.json`
- [ ] Using `--only` flag for specific files
- [ ] If template change needed → pulled latest first

### Editability
- [ ] Every heading editable (schema setting)
- [ ] Every paragraph editable (schema setting)
- [ ] Every image uses `image_picker`
- [ ] Every link uses `url` (no defaults)
- [ ] Repeating content uses blocks
- [ ] Presets include default content

### Quality
- [ ] CSS uses variables (no hardcoded hex)
- [ ] `prefers-reduced-motion` on animations
- [ ] Focus states on interactive elements
- [ ] `{{ block.shopify_attributes }}` on blocks
- [ ] Images have alt text (editable)
- [ ] Semantic HTML
- [ ] Mobile tested (375px)
- [ ] Tested in preview first

---

## ICONS

```liquid
{% render 'bbc-icons', icon: 'bamboo' %}
{% render 'bbc-icons', icon: 'tools', size: 32 %}
```

**Available:** bamboo, tools, ruler, box, clock, shield, truck, users, video, book, message, globe, star, check, check-circle, arrow-right, phone, mail, leaf, bike, award, zap, target, document, instagram, facebook, youtube, tiktok

---

## SAFE PUSH WORKFLOW

```bash
# ✅ SAFE — Push specific files only
shopify theme push --theme=191768756598 --only sections/bbc-hero.liquid
shopify theme push --theme=191768756598 --only assets/bbc-custom.css

# ❌ DANGEROUS — Pushes everything including templates/*.json
shopify theme push --theme=191768756598

# If you MUST change a template:
shopify theme pull --theme=191768756598 --only templates/product.json  # Get latest
# Make structural change only
shopify theme push --theme=191768756598 --only templates/product.json  # Push back
```

---

## UPLOAD VIA API

```bash
content=$(cat path/to/file | jq -Rs .)
curl -X PUT "https://bamboo-bicycle-club-london-uk.myshopify.com/admin/api/2024-10/themes/191768756598/assets.json" \
  -H "X-Shopify-Access-Token: SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV" \
  -H "Content-Type: application/json" \
  -d "{\"asset\": {\"key\": \"path/to/file\", \"value\": $content}}"
```

---

## FULL RULES

Complete rules with all details: `~/.openclaw/workspace/artifacts/tech/shopify/SHOPIFY_AGENT_RULES.md`

---

*Last updated: 2026-02-15*
