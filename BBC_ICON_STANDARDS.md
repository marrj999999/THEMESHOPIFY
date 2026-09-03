# BBC Icon & CSS Standards

**Rule: NO EMOJIS**
- Use **Google Material Symbols** for UI icons
- Use **Official brand SVGs** for company logos (Instagram, Facebook, YouTube, etc.)

---

## Icon System

### Loading Material Symbols (already in theme.liquid)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
```

### Using Icons

```liquid
{% render 'bbc-icons', icon: 'award' %}
{% render 'bbc-icons', icon: 'award', size: 32 %}
```

---

## Available Icons

### UI Icons (Material Symbols)

| Icon Name | Material Symbol | Use For |
|-----------|-----------------|---------|
| `award` | emoji_events | Awards, trophies |
| `leaf` | eco | Sustainability |
| `star` | star | Featured, reviews |
| `globe` | public | International |
| `document` | description | Documents, papers |
| `bike` | pedal_bike | Bicycles |
| `users` | group | Community, teams |
| `zap` | bolt | Innovation, energy |
| `target` | target | Goals, aims |
| `shield` | verified_user | Trust, security |
| `mail` | mail | Email |
| `phone` | call | Phone calls |
| `message` | chat | Chat, messaging |
| `clock` | schedule | Time, hours |
| `video` | videocam | Video calls |
| `book` | menu_book | Guides, learning |
| `package` | package_2 | Packages, kits |
| `tools` | construction | Workshop, building |
| `wrench` | build | Tools, DIY |
| `truck` | local_shipping | Shipping |
| `check` | check | Checkmarks |
| `check-circle` | check_circle | Success |
| `arrow-right` | arrow_forward | Navigation |
| `map-pin` | location_on | Location |
| `camera` | photo_camera | Photos |
| `building` | apartment | Office |
| `image` | image | Image placeholder |
| `bamboo` | forest | Nature, bamboo |
| `ruler` | straighten | Measuring |
| `mountain` | terrain | Adventure |
| `certificate` | workspace_premium | Certifications |
| `school` | school | Education |
| `workshop` | handyman | Hands-on work |
| `calendar` | calendar_month | Scheduling |
| `support` | support_agent | Customer support |
| `help` | help | Help, FAQ |
| `cart` | shopping_cart | Shopping |
| `heart` | favorite | Wishlist |
| `search` | search | Search |

### Brand Logos (Official SVGs)

| Icon Name | Brand |
|-----------|-------|
| `instagram` | Instagram |
| `facebook` | Facebook |
| `youtube` | YouTube |
| `whatsapp` | WhatsApp |
| `twitter` | X (Twitter) |
| `linkedin` | LinkedIn |
| `tiktok` | TikTok |

---

## CSS Styling

### Material Symbols (font-based)

```css
.icon-container .material-symbols-outlined {
  font-size: 24px;
  color: var(--bbc-forest, #073e27);
}

/* Dark background */
.icon-container--dark .material-symbols-outlined {
  color: var(--bbc-gold, #ffa900);
}
```

### Brand Logos (SVG)

```css
.social-icon svg {
  width: 20px;
  height: 20px;
  fill: var(--bbc-forest, #073e27);
}

.social-link:hover .social-icon svg {
  fill: white;
}
```

---

## Section Schema Pattern

```json
{
  "type": "select",
  "id": "icon",
  "label": "Icon",
  "options": [
    { "value": "award", "label": "Award/Trophy" },
    { "value": "leaf", "label": "Leaf/Eco" },
    { "value": "star", "label": "Star" },
    { "value": "globe", "label": "Globe/World" },
    { "value": "document", "label": "Document" },
    { "value": "bike", "label": "Bicycle" },
    { "value": "users", "label": "People" },
    { "value": "mail", "label": "Email" },
    { "value": "phone", "label": "Phone" },
    { "value": "package", "label": "Package" },
    { "value": "tools", "label": "Workshop" }
  ],
  "default": "star"
}
```

---

## ❌ What NOT To Do

```liquid
{# WRONG - Text emoji #}
<span>📧</span>
<span>🏆</span>

{# WRONG - Emoji in text input #}
"default": "📦"
```

## ✅ What To Do

```liquid
{# CORRECT - Icon snippet #}
{% render 'bbc-icons', icon: 'mail' %}
{% render 'bbc-icons', icon: 'instagram' %}

{# CORRECT - Select dropdown in schema #}
"type": "select",
"id": "icon"
```

---

## Browse All Material Symbols

https://fonts.google.com/icons?icon.set=Material+Symbols

To add a new icon:
1. Find it on Google Fonts
2. Add a new `{% when 'name' %}` case in `bbc-icons.liquid`
3. Use the Material Symbol name (e.g., `schedule` for clock)

---

*Last updated: 2026-02-13*
