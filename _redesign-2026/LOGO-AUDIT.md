# Schools case-study LOGOS — audit + decision (2026-06-12)

**Asked:** get the institution logos and use them on the schools page.
**Did:** sourced + visually inspected the official logo file for all 9 institutions (via Wikimedia/brand pages), researched logo-wall best practice (13-agent workflow), then decided.

## Decision: clean forest-green WORDMARK wall (not the scraped logos)
The real logo files **do not form a consistent wall** — and a CIC shouldn't republish
non-free trademarked marks without written sign-off. Per-file findings:

| Institution | Sourced file | Why it can't go on the wall as-is |
|---|---|---|
| London South Bank (Southbank Uni) | Wikimedia SVG wordmark | **The one clean candidate** — plain transparent text wordmark, low permission risk. Ready to drop in *if you want one real mark + are OK on permission*. |
| University College London | wikipedia/en SVG | Non-free fair-use; two-colour wordmark+portico — forcing to one ink drops the icon. |
| King's College London | Commons SVG | White text **baked on a solid red panel** — normalises to a red box, not a clean mark. Trademark. |
| Coventry University | Commons PNG | Blue raster wordmark+phoenix — fuzzy at retina, blue clashes, lossy to recolour. Trademark. |
| The Oratory School | Newman coat-of-arms SVG | 82-path, 5-colour **heraldic crest** — blobs at wall size; also the founder's arms, not the school logo. |
| Bradfield College | wikipedia/en PNG | 200×200 multicolour **crest** — pixelates/blobs; non-free. |
| Stoke-on-Trent College | wikipedia/en PNG | Tiny 213×93 raster, colour flame; official SVG is hotlink-protected (403). Non-free. |
| Reed's School | school-site SVG | **All-WHITE reversed** crest (for a navy header) — invisible on our warm-white cards. Wrong polarity. |
| UTC South Bank | Commons JPG | 4267px **navy JPG, no transparency** — lands as a solid tile. Also the *successor* brand (SBU Sixth), risks double-counting LSBU. |

## What shipped
A uniform wall of institution **names** typeset in Atkinson Hyperlegible, single forest-green,
equal weight — AAA-legible, consistent, permission-light — under the honest label
*"A few of the schools, colleges and universities we've worked with."* The case-study cards
keep their real BBC build photos + standout quotes.

## To turn wordmarks into real logos
The card + wall both have a `logo` image field ready. For any institution: send a **clean,
transparent, single-colour (or simple) vector/PNG** + confirm you have permission to show it,
and I'll swap that cell to the real mark. (LSBU's is the one already clean enough.)
Best practice = don't mix 1–2 real logos with wordmarks; either all wordmarks (now) or a
fully-built logo set once the assets + permissions are in.
