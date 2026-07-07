# Image & video audit — 2026 redesign (3-agent audit, 2026-06-12)

Audited current image usage (quality, appropriateness, repetition) and inventoried three sources — the Shopify media library, the Downloads folder, and the bundled theme assets — to diversify away from repeated placeholders, plus catalogued video. Images were assessed visually (read), not by filename alone.

## 1. ✅ DONE — critical safety fix
Two bundled images carried a wall logo naming **"HM Prison Lowdham Grange"** and were the **About hero** (`bbc-rd-prison-bamboo`) and **Education hero** (`bbc-rd-prison-empty`) — a direct breach of the never-name-a-prison rule. Two more (`bbc-rd-prison-jig`, `bbc-rd-prison-wide`, ×5 each) showed **identifiable participant faces**. All four were replaced (same filenames → every usage fixed) with verified-safe, on-brand images, and the "inside a prison"/"learners" alt text was corrected. (Sandbox was unpublished — never live-public.) Filenames still read `prison-*` (internal only) — rename in the diversification pass.

## 2. The core problem: repetition + a few weak images
14 bundled images do ~56 jobs. Worst reuse:
- `bbc-rd-bike-field.jpg` **×10** (the universal fallback — appears on door cards, stories, anywhere no image is set; this is the main reason the site reads as repetitive)
- `bbc-rd-detail.jpg` **×7** — and it's **out of focus**; used as the Workshops hero and the "why bamboo" craft shot (the very images meant to prove the craft)
- `bbc-rd-road-charlie` ×5, `bbc-rd-prod-gravel` ×5, the two prison images ×5
**Keepers (good quality):** `bbc-rd-hero-ride` (5/5 homepage hero), `road-charlie` (sharp lug crop), the product flat-lays (gravel/flax/build/balance), `team2` (authentic corporate). **Replace:** `detail` (blurry), and stop using `bike-field` as the global fallback.

## 3. Sources available (all real)
- **Shopify media library — 1,954 images + 9 hosted videos + 4 YouTube. Scanned clean of any prison content.** Standouts: `Full-build1.jpg` (mint road bike studio, 3300×2550), `Bamboo_Bicycle_Club_7.jpg` (workshop scene), `SRW08823.jpg` (corporate cohort + bikes), `PXL_…Craig_Warner.jpg` (gravel at sunset), `IMG_0097_…Peter_Evans.jpg` (gravel beauty), `ADAMCARGOBIKE1.jpg` (cargo bike), `1B2A4921-1.jpg` (bamboo macro), `…Alex_Oakes.jpg` (frame on build template), `…Jeremy_Saudrais.jpg` (fibre-wrap detail). Full URL list in `/tmp/bbc-media/`.
  - ⚠️ Rights: many of the best build/lifestyle shots are **customer submissions** (owner name in filename). Confirm permission before featuring as primary marketing.
  - Several large "lifestyle" files are **generic Shopify stock** (park, apron, trees) — skip.
- **Downloads — 378 files.** Best real: `AG-Bespoked-BambooBicycleClub-02-3k.JPG` (studio gravel, 3000×2250 — strong hero), `IMG_1708.PNG` / `IMAGE EBike Preview.jpg` (eBike studio), `IMG_7645.JPG` (red flat-bar), `IMG_5459.jpeg` (grandfather + toddler on balance bike, lifestyle), `IMG_2254.JPG` (lug close-up), `IMAGE Gravel Lugged Kit.jpg` (kit flat-lay). Project-Zero schools photos exist but show **identifiable young people — confirm photo consent** before public use.
- **Bundled theme assets** — the 14 `bbc-rd-*.jpg` (4 now safely replaced).

## 4. Diversification plan (kill the repetition)
> **✅ Pass 2 — "redesign all" executed 2026-06-12 (rights cleared by James).** Added **12 new real images** (clean-named) spanning outdoor riding (gravel-sunset under a moody sky, gravel-fence, family balance-bike), studio (gravel-studio, redbar, ebike), urban (cargo), craft (lug) + clean-named copies of the 4 mislabelled `prison-*` files (→ workshop / cohort / frame-build / bamboo-tubes). **Repointed every page hero + secondary slot** so each image is used 1–2×: About hero=cohort, model=workshop · Impact hero=workshop, Build-to-Bond=family · Education hero=gravel-studio, Justice=frame-build · Workshops hero=gravel-sunset, location cards=gravel-fence/redbar/cargo · Home impact-feature=frame-build, Work-with-us door=workshop · PDP why-bamboo=bamboo-tubes, City kit=ebike. **All 4 `prison-*` references removed** from sections + templates (assets now orphaned, names retired). 24 referenced assets, 0 missing (no 404s); theme-check 0 offenses on every redesign section. **🎬 Video wired:** cut a 50s teaser (fades, 720p, faststart, 7MB) from BBC's own build film + a rainbow-trail poster; the Workshops "watch a build" block now plays it **inline** (native controls, `preload="none"`, poster) with an optional `video_mp4` URL override. (Earlier Pass 1, commit f9a5408, below.)
>
> **✅ Pass 1 executed 2026-06-12 (commit f9a5408):** (a) the blurry `detail.jpg` was replaced sitewide with a sharp BBC-owned bamboo-offcuts macro — fixes the live home "why bamboo" craft shot + the Workshops hero + Toulouse card + search placeholder in one swap; (b) `bbc-rd-build-mint.jpg` (sharp finished mint road bike) was added and the home Romania story moved onto it, so `bike-field` no longer repeats on the live home page. The home page now shows ~12 distinct images.
> **Remaining (blocked, not forgotten):** the Workshops/About/Impact/Education/Product/Blog/Search redesign sections **are not yet wired into sandbox templates**, so diversifying their image defaults has no visible effect until those pages are built — do it then. The strongest lifestyle/riding shots are **customer submissions** (owner name in filename) needing rights confirmation. Video still unwired (§5). Rename `prison-*` files (cosmetic) when those pages are wired.


- **Retire `bike-field` as the global fallback.** Give each home **door** and **community story** card its own image (Full-build1, gravel-sunset, cargo, red flat-bar, grandfather+child, workshop).
- **Replace the blurry `detail`** (Workshops hero + why-bamboo) with sharp craft: `…Jeremy_Saudrais` (fibre-wrap), `IMG_2254` (lug), or `road-charlie`.
- **PDPs:** keep the clean kit flat-lays; add 1–2 real finished-bike photos per discipline for variety.
- **Heroes:** home keeps `hero-ride` (best in set); About = cohort; Education = bamboo macro or workshop; Impact = workshop; Workshops = a sharp riding/build shot, not the blurry detail.
- Net: ~14 reused images → 20–25 varied real images, each used 1–2×.

## 5. Video (currently none wired on the storefront)
- **Workshops "watch a build" section** has a `video_url` setting but no video. Best fits: a Shopify-hosted 1080p clip (≈1:15, 2023-11) or a short cut of the Downloads build film. The 43-min `video_web.mp4` is too long for a teaser — use a 30–60s cut.
- **YouTube** embeds already exist (4 in library); CLAUDE.md records build IDs (Speaker `uhN-yv90F_Y`, Frame `ckCwJXJGKD0`).
- **Downloads housekeeping:** three byte-identical 3.76 GB masters (`1B_BAMBOO_FINAL_MASTER` = `VIDEO Bamboo Build Master` = `video_original`) — keep one, reclaim ~7.5 GB. Three third-party bamboo docs are NOT BBC footage — don't host them.

## 6. ⚠️ DO-NOT-USE (flagged)
- **Prison-named files in Downloads** — `HMP-Foston-Hall.jpg`, `HMP-Lowdham-Grange.jpg`, `HMPnorthumberland.jpg`, `Lindholme.webp`, `aerial-view-of-hmp-garth…jpg`. Never on the public site.
- **AI-generated** (`Gemini_Generated_*`, `Bamboo Bicycle Club Ebike.png`) — James prefers real; skip.
- **Sensitive**: `IMG_2714/2715.JPG` are photos of an **HMRC letter** (company UTR). `IMG_2714 2`/`2715` are corrupt (0 bytes).

## Recraft (generation)
Not needed — Shopify + Downloads cover every context with real photography. Only consider Recraft for a missing specific shot (none identified).
