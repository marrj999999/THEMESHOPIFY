// SINGLE SOURCE OF TRUTH for banned claim patterns (created 2026-07-24).
//
// Escape #6: `claim-lint` gained "nationally recognised" and `estate-check` never did. One scans
// SOURCE, the other scans RENDERED pages, so source-clean + rendered-unchecked left the phrase
// live on two draft pages beneath two green gates. Two hand-maintained lists will always drift.
//
// estate-check imports BANNED from here. claim-lint is bash and cannot import, so it keeps its own
// PATTERNS — but qa/canary.mjs asserts BEHAVIOURALLY that both reject every string in CORPUS.
// If they ever diverge again, the canary fails instead of a claim reaching the site.
//
// Authority: vault `System/Claims Register.md` (canonical; overrides any doc, including CLAUDE.md).
// The durable next step is generating these FROM the register so a James edit propagates itself.

export const BANNED = [
  /28,?000\s*PSI/i,                              // false — tested tensile ≈84 MPa
  /stronger than steel/i,                        // absolute claim; say "comparable to mild steel"
  /56\.7%/,                                      // no named LCA — greenwashing risk
  /£11\.41/,                                     // SROI, no traceable study
  /£280 per learner/i,                           // confidential contract pricing
  /\b36\+? countries/i,                          // superseded by 45 (James 2026-07-07)
  /100% completion/i,                            // use 90%+
  /nationally recognised/i,                      // OCN bespoke courses are not Ofqual-regulated
  /Level 1 ?& ?2/i,                              // per-arm naming only; never the mushed form
  /14,?765/,                                     // BS EN 14765 withdrawn — no external standard claimed
  /guaranteed interview/i,                       // unverifiable promise
  // Added 2026-07-31 after cross-checking the ten new case-study cards against the Shopify blog
  // and the vault. Each of these was PUBLISHED before being caught:
  /100\s*kg[- ]?payload/i,                        // UCL cargo bike is 150kg per the source article
                                                 // (/blogs/impact/ucl-masters-…): "a frame designed
                                                 // to carry a 150kg cargo load". 100kg was live on
                                                 // /pages/impact and I propagated it to /pages/schools.
  /rated the day 9\s*[–-]\s*10/i,                 // Project Zero: the article says ratings
                                                 // "regularly reached" 9–10, not that all 27 rated
                                                 // it so. Approved framing keeps "regularly".
  /Sustainable Design (&|and) Manufacturing/i,   // wrong OCN title; canonical below
  // Added 2026-07-24 by qa/claims-register-sync.mjs, which found these prohibited in the vault
  // register with NO gate covering them:
  /39% reduction in reoffending/i,               // claiming MoJ context as a BBC-measured outcome.
                                                 // The APPROVED framing — "prisoners who receive
                                                 // family visits are 39% less likely to reoffend" —
                                                 // deliberately does not match this pattern.
  /LSBU Innovation Hub/i,                        // no counter-signed agreement on file
  /£70,000\s*(equipment|investment)/i,           // ditto — proposed terms, not mutual execution
  // Added 2026-09-02 after the Site-vs-Vault review (vault: Reports/Website Review vs Vault
  // 2026-09-02) found eleven Register breaches LIVE beneath green gates. Every one below was
  // rendered on a public page that day. Authority for each: System/Claims Register.md.
  /\bFeltham\b/i,                                // not a site (Shaw Trust DD stalled, silent since 19 Jun);
                                                 // Register: never a named-sites list without a fresh check
  /\b(4|four|three|3) (UK )?prison sites?\b/i,   // count formula only: "five UK prison sites, at
                                                 // different delivery stages" (James, 2026-08-19)
  /\bLevel 1\b(?! ?& ?2)/,                       // no external Level 1 claim until OCN evidence is filed
  /independently tested/i,                       // Swansea tested TUBING (BS ISO 22157), never a frame;
                                                 // 19 Aug control incident — cite the standard at point of claim
  /last for years/i,                             // no approved service-life claim for any variant (PS-001 open)
  /\brideable\b/i,                               // product-safety gate while PS-001 is open
  /Enhanced[- ]DBS/i,                            // no Register row; roster incomplete — verify per person
  /\b(six|6) Makers\b/i,                         // cohort size is an open decision (6/7/8 — D2)
  /10% of profits/i,                             // no executed inter-company transfer policy on file
  /Education CIC/i,                              // entity is Bamboo Mobility Project CIC (17 Feb 2025)
];

// Every string here MUST be rejected by BOTH gates. Add a row whenever a claim escapes —
// that is what turns a one-off fix into permanent coverage (see qa/ESCAPES.md).
export const CORPUS = [
  '28,000 PSI',
  'stronger than steel',
  'nationally recognised',
  'Level 1 & 2',
  'guaranteed interview',
  'Sustainable Design & Manufacturing',
  '36+ countries',
  '100% completion',
  // 2026-09-02 additions — each was live on the day of the review
  'HMYOI Feltham',
  '4 prison sites running',
  'Level 1 curriculum',
  'independently tested at Swansea University',
  'with proper care they last for years',
  'a real, rideable bamboo bike',
  'Enhanced-DBS facilitators',
  'cohorts of six Makers',
  '10% of profits',
  'BBC Education CIC',
];

// The correct wording, for reference in fixes and reviews.
export const CANONICAL_OCN = 'OCN London bespoke Level 2, Workshop Skills and Sustainable Manufacturing (centre course ID 1130735)';
