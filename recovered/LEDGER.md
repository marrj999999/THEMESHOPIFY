# 7pm-swarm change ledger — bbc-theme-new (generated 2026-06-17)

Each entry = the pre-7pm (reconstructed ~17:35 BST) version → current. `+` lines were ADDED by the evening sessions, `-` lines REMOVED.

## templates/index.json  (+9/-1, 5 edits)
```diff
--- pre-7pm
+++ current
@@ -9,0 +10 @@
+            "poster_asset": "bbc-rd-home-poster.jpg",
@@ -277 +278,2 @@
-        "image_alt": "",
+        "image_asset": "bbc-rd-bamboo-tubes.jpg",
+        "image_alt": "Raw bamboo tubes ready to be built into a bicycle frame",
@@ -361,0 +364,2 @@
+        "image_asset": "bbc-rd-workshop.jpg",
+        "image_alt": "Builders at work in the Bamboo Bicycle Club workshop",
@@ -370,0 +375 @@
+            "image_asset": "bbc-rd-bike-field.jpg",
@@ -378,0 +384 @@
+            "image_asset": "bbc-rd-gravel-fence.jpg",
@@ -386,0 +393 @@
+            "image_asset": "bbc-rd-road-charlie.jpg",
@@ -405,0 +413 @@
+        "featured_image_asset": "bbc-rd-gravel-sunset.jpg",
```

## templates/page.impact.json  (+4/-2, 4 edits)
```diff
--- pre-7pm
+++ current
@@ -259 +259,2 @@
-        "photo_alt": "",
+        "photo_asset": "bbc-rd-prison-bamboo.jpg",
+        "photo_alt": "Bamboo frame-building materials in the workshop",
@@ -296 +297,2 @@
-        "photo_alt": "",
+        "photo_asset": "bbc-rd-cohort.jpg",
+        "photo_alt": "A group building bamboo bicycle frames together",
```

## templates/page.our-story-2.json  (+4/-1, 2 edits)
```diff
--- pre-7pm
+++ current
@@ -99 +99,4 @@
-        "gap_size": "lg"
+        "gap_size": "lg",
+        "image_asset": "bbc-rd-team2.jpg",
+        "image_alt": "The Bamboo Bicycle Club team",
+        "image_caption": ""
```

## templates/page.gallery.json  (+18/-18, 27 edits)  ⚠ partial-reconstruct (use Shopify Version History to confirm)
```diff
--- pre-7pm
+++ current
@@ -18,2 +18,2 @@
-            "alt": "Bamboo gravel bike on country lanes",
-            "caption": "Balance bike for the little ones"
+            "alt": "Bamboo gravel bike",
+            "caption": ""
@@ -26,2 +26,2 @@
-            "alt": "Bamboo road bike with red bar tape",
-            "caption": "Out for a ride"
+            "alt": "Bamboo road bike",
+            "caption": ""
@@ -34,2 +34,2 @@
-            "alt": "Rider out on a bamboo bike",
-            "caption": "Bamboo cargo build"
+            "alt": "Bamboo bicycle",
+            "caption": ""
@@ -42,2 +42,2 @@
-            "alt": "Bamboo e-bike build",
-            "caption": "Gravel build, country lanes"
+            "alt": "Bamboo e-bike",
+            "caption": ""
@@ -50,2 +50,2 @@
-            "alt": "Bamboo road bike ready to ride",
-            "caption": "Road build, finishing details"
+            "alt": "Bamboo road bike",
+            "caption": ""
@@ -58,2 +58,2 @@
-            "alt": "Bamboo gravel bike at golden hour",
-            "caption": "Bamboo e-bike build"
+            "alt": "Bamboo gravel bike",
+            "caption": ""
@@ -66,2 +66,2 @@
-            "alt": "Bamboo cargo bike build",
-            "caption": "Out exploring on bamboo"
+            "alt": "Bamboo cargo bike",
+            "caption": ""
@@ -74,2 +74,2 @@
-            "alt": "Bamboo bike out in a field",
-            "caption": "Road build, ready to ride"
+            "alt": "Bamboo bicycle",
+            "caption": ""
@@ -82,2 +82,2 @@
-            "alt": "Bamboo balance bike for children",
-            "caption": "Gravel build at golden hour"
+            "alt": "Bamboo balance bike",
+            "caption": ""
```

## templates/page.why-bamboo.json  (+10/-0, 5 edits)
```diff
--- pre-7pm
+++ current
@@ -74,0 +75,2 @@
+        "image_asset": "bbc-rd-detail.jpg",
+        "image_alt": "Close-up of a bamboo bicycle frame joint showing the natural fibre structure",
@@ -95,0 +98,2 @@
+        "image_asset": "bbc-rd-hero-ride.jpg",
+        "image_alt": "Rider on a bamboo bicycle on the open road",
@@ -181,0 +186,2 @@
+        "image_asset": "bbc-rd-frame-build.jpg",
+        "image_alt": "A bamboo frame being built on a jig with simple hand tools",
@@ -192,0 +199,2 @@
+        "image_asset": "bbc-rd-bamboo-tubes.jpg",
+        "image_alt": "Raw bamboo culms that regrow in 3 to 5 years",
@@ -205,0 +214,2 @@
+        "image_asset": "bbc-rd-lug.jpg",
+        "image_alt": "A carbon-and-epoxy lug joint on a bamboo bicycle frame",
```

## sections/bbc-content.liquid  (+16/-6, 2 edits)
```diff
--- pre-7pm
+++ current
@@ -107 +107 @@
-        {% if section.settings.image != blank %}
+        {% if section.settings.image != blank or section.settings.image_asset != blank %}
@@ -109,5 +109,9 @@
-            {{ section.settings.image | image_url: width: 1200 | image_tag:
-              class: 'bbc-content__image',
-              loading: 'lazy',
-              alt: section.settings.image_alt | default: section.settings.heading
-            }}
+            {% if section.settings.image != blank %}
+              {{ section.settings.image | image_url: width: 1200 | image_tag:
+                class: 'bbc-content__image',
+                loading: 'lazy',
+                alt: section.settings.image_alt | default: section.settings.heading
+              }}
+            {% else %}
+              <img class="bbc-content__image" src="{{ section.settings.image_asset | asset_url }}" loading="lazy" alt="{{ section.settings.image_alt | default: section.settings.heading | escape }}">
+            {% endif %}
@@ -440,0 +445,6 @@
+      "id": "image_asset",
+      "label": "Or theme-asset image filename",
+      "info": "Filename of an image in /assets (e.g. bbc-rd-bamboo-tubes.jpg). Used only if no Image is picked above."
+    },
+    {
+      "type": "text",
```

## sections/bbc-story.liquid  (+21/-6, 2 edits)
```diff
--- pre-7pm
+++ current
@@ -71 +71 @@
-    {% if section.settings.image != blank %}
+    {% if section.settings.image != blank or section.settings.image_asset != blank %}
@@ -73,5 +73,9 @@
-        {{ section.settings.image | image_url: width: 1200 | image_tag:
-          loading: 'lazy',
-          class: 'bbc-story__img',
-          alt: section.settings.image.alt | default: 'BBC workshop'
-        }}
+        {% if section.settings.image != blank %}
+          {{ section.settings.image | image_url: width: 1200 | image_tag:
+            loading: 'lazy',
+            class: 'bbc-story__img',
+            alt: section.settings.image.alt | default: 'BBC workshop'
+          }}
+        {% else %}
+          <img class="bbc-story__img" src="{{ section.settings.image_asset | asset_url }}" loading="lazy" alt="{{ section.settings.image_alt | default: 'BBC workshop' | escape }}">
+        {% endif %}
@@ -576,0 +581,11 @@
+    },
+    {
+      "type": "text",
+      "id": "image_asset",
+      "label": "Or theme-asset image filename",
+      "info": "Filename of an image in /assets (e.g. bbc-rd-workshop.jpg). Used only if no Image is picked above."
+    },
+    {
+      "type": "text",
+      "id": "image_alt",
+      "label": "Image alt text"
```

## sections/bbc-hero-slider.liquid  (+15/-1, 2 edits)
```diff
--- pre-7pm
+++ current
@@ -20 +20 @@
-                <video autoplay muted loop playsinline class="bbc-hero-slider__video">
+                <video autoplay muted loop playsinline class="bbc-hero-slider__video"{% if block.settings.poster_asset != blank %} poster="{{ block.settings.poster_asset | asset_url }}"{% endif %}>
@@ -29,0 +30,2 @@
+              {% elsif block.settings.image_asset != blank %}
+                <img class="bbc-hero-slider__image" src="{{ block.settings.image_asset | asset_url }}" loading="eager" fetchpriority="high" alt="{{ block.settings.heading | escape }}">
@@ -421,0 +424,6 @@
+          "type": "text",
+          "id": "image_asset",
+          "label": "Or theme-asset background filename",
+          "info": "Filename of an image in /assets. Used only if no Background Image is picked and no video is set."
+        },
+        {
@@ -424,0 +433,6 @@
+        },
+        {
+          "type": "text",
+          "id": "poster_asset",
+          "label": "Video poster theme-asset filename",
+          "info": "Filename of a poster image in /assets (e.g. bbc-rd-home-poster.jpg). Shows before the video loads."
```

## sections/bbc-wb-content-block.liquid  (+8/-0, 2 edits)
```diff
--- pre-7pm
+++ current
@@ -32,0 +33,2 @@
+    {%- elsif section.settings.image_asset != blank -%}
+      <img src="{{ section.settings.image_asset | asset_url }}" loading="lazy" alt="{{ section.settings.image_alt | default: section.settings.heading | escape }}">
@@ -104,0 +107,6 @@
+      "id": "image_asset",
+      "label": "Or theme-asset image filename",
+      "info": "Filename of an image in /assets (e.g. bbc-rd-detail.jpg). Used only if no Image is picked above."
+    },
+    {
+      "type": "text",
```

## sections/bbc-participant-story.liquid  (+8/-2, 3 edits)
```diff
--- pre-7pm
+++ current
@@ -271 +271 @@
-  if section.settings.photo != blank
+  if section.settings.photo != blank or section.settings.photo_asset != blank
@@ -304 +304 @@
-              src="{{ section.settings.photo | image_url: width: 800 }}"
+              src="{% if section.settings.photo != blank %}{{ section.settings.photo | image_url: width: 800 }}{% else %}{{ section.settings.photo_asset | asset_url }}{% endif %}"
@@ -469,0 +470,6 @@
+      "id": "photo_asset",
+      "label": "Or theme-asset photo filename",
+      "info": "Filename of an image in /assets (e.g. bbc-rd-prison-jig.jpg). Used only if no Participant photo is picked. Use generic, non-identifying shots."
+    },
+    {
+      "type": "text",
```

## sections/bbc-gallery.liquid  (+11/-6, 2 edits)
```diff
--- pre-7pm
+++ current
@@ -18,6 +18,10 @@
-          {% if block.settings.image != blank %}
-            {{ block.settings.image | image_url: width: 600 | image_tag:
-              loading: 'lazy',
-              class: 'bbc-gallery__image',
-              alt: block.settings.alt | default: block.settings.image.alt | default: 'Gallery image'
-            }}
+          {% if block.settings.image != blank or block.settings.image_asset != blank %}
+            {% if block.settings.image != blank %}
+              {{ block.settings.image | image_url: width: 600 | image_tag:
+                loading: 'lazy',
+                class: 'bbc-gallery__image',
+                alt: block.settings.alt | default: block.settings.image.alt | default: 'Gallery image'
+              }}
+            {% else %}
+              <img class="bbc-gallery__image" src="{{ block.settings.image_asset | asset_url }}" loading="lazy" alt="{{ block.settings.alt | default: block.settings.caption | default: 'Gallery image' | escape }}">
+            {% endif %}
@@ -211,0 +216 @@
+        { "type": "text", "id": "image_asset", "label": "Or theme-asset image filename", "info": "Filename of an image in /assets. Used only if no Image is picked above." },
```

## sections/bbc-journeys.liquid  (+20/-1, 5 edits)
```diff
--- pre-7pm
+++ current
@@ -24 +24,4 @@
-        {% else %}
+        {% elsif section.settings.featured_image_asset != blank %}
+          <img class="bbc-journeys__img" src="{{ section.settings.featured_image_asset | asset_url }}" loading="lazy" alt="{{ section.settings.featured_name | escape }}">
+        {% elsif request.design_mode %}
+          {%- comment -%} Only show placeholder box in the Shopify editor, not on live storefront {%- endcomment -%}
@@ -65,0 +69,4 @@
+            {% elsif block.settings.image_asset != blank %}
+              <div class="bbc-journeys__card-image">
+                <img src="{{ block.settings.image_asset | asset_url }}" loading="lazy" alt="{{ block.settings.route | escape }}">
+              </div>
@@ -371,0 +379,6 @@
+      "id": "featured_image_asset",
+      "label": "Or featured theme-asset filename",
+      "info": "Filename of an image in /assets (e.g. bbc-rd-gravel-sunset.jpg). Used only if no Featured Image is picked."
+    },
+    {
+      "type": "text",
@@ -439,0 +453,6 @@
+        },
+        {
+          "type": "text",
+          "id": "image_asset",
+          "label": "Or theme-asset image filename",
+          "info": "Filename of an image in /assets (e.g. bbc-rd-bike-field.jpg). Used only if no Image is picked."
```

## sections/footer-group.json  (+0/-0, 2 edits)
```diff
```

## layout/theme.liquid  (+1/-0, 2 edits)  ⚠ partial-reconstruct (use Shopify Version History to confirm)
```diff
--- pre-7pm
+++ current
@@ -453,0 +454 @@
+    {{ 'bbc-video-responsive.css' | asset_url | stylesheet_tag }}
```

## NEW files created by the swarm (no pre-7pm version)
- `assets/bbc-video-responsive.css` (3230 bytes) — responsive-video feature
- `snippets/bbc-rd-video.liquid` (2889 bytes) — responsive-video feature
- `del-check.json` (0 bytes) — stray test artefact — safe to delete