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
  /Sustainable Design (&|and) Manufacturing/i,   // wrong OCN title; canonical below
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
];

// The correct wording, for reference in fixes and reviews.
export const CANONICAL_OCN = 'OCN London bespoke Level 2, Workshop Skills and Sustainable Manufacturing (centre course ID 1130735)';
