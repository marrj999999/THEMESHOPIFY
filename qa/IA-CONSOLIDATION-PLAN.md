# Site consolidation plan — lead-gen IA (2026-07-13)

**Goal (James):** drive people to **contact/enquiry**, not a full advert. Minimum pages. One "Programmes" page for schools + prisons.
**Research backing:** website = sales funnel not brochure; each page = one job + one CTA; B2B page's only job = "make them want to talk to you"; organise by conversion goal not audience (so schools+prisons = one page); flat structure ≤3 clicks. (qa/research + tavily, 2026.)

## Target IA — LOCKED with James 2026-07-13 (23 → 14 pages + utility)
| Keep | URL | Job | Primary CTA |
|---|---|---|---|
| Home | `/` | route everyone | shop / enquire |
| Kits (shop) | `/collections/*` `/products/*` | sell kits | add to cart |
| Which-kit | `/pages/which-kit` | help choose — **linked from Kits** | shop |
| Workshops | `/pages/workshops` (absorbs amersfoort) | sell workshops | book |
| Team Building | `/pages/bicycleteambuilding` | corporate revenue — **own page** | request quote |
| **Programmes (NEW)** | `/pages/programmes` | schools + prisons enquiry | **start a conversation → contact** |
| Impact | `/pages/impact` (absorbs support-mission, theory-of-change, build-to-bond, impact-report download) | mission + funders + proof | back the mission |
| Why Bamboo | `/pages/why-bamboo` | **reframe → TECHNICAL page** (material science, specs, engineering) | shop |
| Build Reviews & Guides | `/pages/gallery` (rename/reframe) | **was Gallery → real builds + reviews + how-to guides** | shop / build |
| Blog / News | `/blogs/*` | **keep** — case studies + press (SEO, press-logo links) | — |
| About | `/pages/our-story-2` | trust/credibility | — |
| Contact | `/pages/contact-us` (+ routing field) | conversion destination | send enquiry |
| FAQ | `/pages/frequently-asked-questions` | support | — |
| Help | `/pages/support-centre` | support | — |
| Utility | cart · account · search · 404 (Dawn) | — | — |

**Reframe tasks (draft-safe):** Why Bamboo → technical; Gallery → Build Reviews & Guides.

## BALANCED refinement (James 2026-07-13) — don't over-cut
- **Keep `support-mission`** as the standalone donate/fund page (converts funder giving better than a section on Impact).
- **Programmes keeps commissioner depth**: the prisons section retains budget guide / security & safeguarding / three-ways-to-commission — as an expandable ("for commissioners") block or a linked detail block — so MoJ buyers get enough to act. Lean up top (→ contact), depth on demand.
- **Theory-of-change** still folds into Impact (funder credibility; Impact already carries the two-arms) — flag to James if he wants it standalone too.
- Net **~15 pages** (not 14).
- TRUE deletions remain only the 5 dead/duplicate: about, contact, landing, custom-page, media-page. Everything else is *moved*, not lost.

## Redirect (301) map — set at go-live
- `/pages/prisons` → `/pages/programmes#prisons`  *(killed per James)*
- `/pages/schools` → `/pages/programmes#schools`
- `/pages/bamboo-bicycle-club-education` → `/pages/programmes`
- `/pages/build-to-bond` → `/pages/programmes#prisons`
- `/pages/support-mission` → `/pages/impact`
- `/pages/theory-of-change` → `/pages/impact`
- `/pages/about` → `/pages/our-story-2`
- `/pages/contact` → `/pages/contact-us`
- `/pages/amersfoort-workshop` → `/pages/workshops`
- `/pages/landing`, `/pages/custom-page`, `/pages/media-page` → `/`

## The Programmes page — content plan (lean, contact-driven; lowercase, Impact-style)
Single job: get an enquiry from a school **or** a prison/commissioner. Every section ends in "talk to us".
1. **Hero** — zero-knowledge: *"we bring accredited bike-building programmes to schools and prisons."* eyebrow "our programmes". primary CTA **start a conversation → /pages/contact-us**; jump links: schools · prisons.
2. **Two paths** (reuse the Impact fork/pathway component):
   - **schools** — prevention · OCN Level 1 · SEND/PRU/at-risk · free taster in · "enquire for schools →" (contact, subject=schools)
   - **prisons** — rehabilitation · OCN Level 2 · self-delivery model, no ongoing fees · "talk to us about your site →" (contact, subject=prisons)
3. **Proof** (shared, lean): 90%+ completion · 4 active sites · 4,000+ trained · one attributable quote (Sally Allsopp / a Maker) · OCN + MoJ/HMPPS + a school logo. No full advert.
4. **How it works** (reuse journey timeline): enquire → we scope → we set up & train / we deliver → you run it / accredit.
5. **Closing CTA** — start a conversation → contact (routing field: schools / prisons / funding).
Reuses built components (fork, journey timeline, stat band, one quote) — no new design.

## Build sequence (after approval)
1. **Draft (safe):** create `bbc-programmes-2026` section (merge/trim `bbc-commissioners-2026` + `bbc-education-2026`) + `page.programmes.json`; confirm Impact already carries the folded content (it mostly does); add contact routing field; update `main-menu` nav (GraphQL menuUpdate).
2. **Live (James, or me with explicit OK — these are store-level, not draft):** create the `/pages/programmes` store page on the template; set the 301 redirects; unpublish/delete the retired pages. ⚠️ Pages + redirects are STORE content (affect live), not theme-scoped — done at go-live, not on the draft.
3. **Verify:** Puppeteer mobile+desktop of Programmes + Impact; check every retired URL 301s; nav correct.

## Open decisions for James
- Confirm the "keep" list above (anything to keep that I've cut, e.g. gallery, support-centre?).
- Redirects/page-deletion are LIVE changes — do you set them in admin, or authorise me to via API at go-live?
