# Revenue reality — and the priority flip
*2026-07-27 · Shopify Admin orders API + James's confirmation*

## What the order data shows

Since 2026-01-01 (~7 months):

- **32 orders · £8,213 · ~£1,170/month online**
- Gravel kits are 41% of it: Gravel Lugged (£1,809) + Gravel Frame Build Kit (£1,571)
- The rest is a long tail of components — forks, dropouts, tubing, bottom brackets

## What it does not show, and why that matters more

**Workshops (£595–£695) and prison/school programmes are booked by email, not through Shopify.**
None of that revenue appears in the order data. James has confirmed: **programmes and workshops
dominate the business.**

So the £8,213 is not the business — it is the shop window.

## The priority flip

The plan ordered Tier A by measured page gaps, which put the **PDP second** (15.8 viewports,
add-to-cart below the fold, 41% of online revenue). On the corrected basis that is wrong: it would
have spent the most effort on pages generating ~£1.2k/month while the pages that carry the actual
business sat lower in the queue.

**Old order** (gap-driven): schools → PDP → collection → impact → programmes → workshops → homepage

**New order** (revenue-driven, James confirmed):

| # | Page | Why |
|---|---|---|
| 1 | **workshops** | Direct bookable revenue at £595–695. **No peer set built yet** — this is now the most important missing research |
| 2 | **programmes** | Prison/commissioner contracts — the largest revenue line |
| 3 | **schools** | Education programmes; also the one page genuinely long on main content (642 vs 339 median) |
| 4 | **impact** | Funders and commissioners land here; the one genuine copy outlier at 2.5× median |
| 5 | **homepage** | Routes to all of the above; proof already improved (y3897 → y867) |
| 6 | **PDP** | 41% of online revenue, but online revenue is ~£1.2k/month. Add-to-cart position is still a real defect, just a cheaper one |
| 7 | **collection** | Already leanest in its set (0.3× median main content) |

## Consequences for the work already done

- The **PDP benchmark** (15.8vp, ATC below fold) stands as a finding but drops in priority.
- **Workshops has no peer set at all** — and it is now #1. Building it is the immediate research
  gap. Comparators should be paid craft/experience booking pages, not social-enterprise shops.
- The **length targets** in `R1-main-content-correction.md` remain valid; only the order changes.
- **Mission-page metrics matter more than commerce metrics.** Evidence density, case-study routing
  and quote presentation — where we already lead the field — are the levers that serve
  commissioners and funders, not add-to-cart placement.

## The measurement lesson, again

Two corrections in one day, both from the same cause: **an available number stood in for the real
one.** Total words stood in for page copy; Shopify revenue stood in for business revenue. Both were
easy to get, both looked authoritative, and both pointed the work in the wrong direction.

The check that caught this one was not a better tool — it was asking James what the numbers left
out. **Some context cannot be measured from the outside.**

## Still blocked

Sessions, conversion rate, device split and landing pages remain unavailable:
- GA4 → zero properties · GSC → zero sites · Shopify analytics MCP → `net::ERR_FAILED`
- Browser control: `navigate` works, but `get_page_text`, `read_page` and `screenshot` all return
  "Policy check temporarily unavailable" (3 methods, repeated attempts)

Without device split I cannot say whether the desktop-only cookie-banner defect affects most
visitors or few. Reconnecting the **Shopify analytics MCP** is the cleanest unblock — it exposes
ShopifyQL directly (`FROM sessions SHOW sessions, conversion_rate GROUP BY session_device_type`).
