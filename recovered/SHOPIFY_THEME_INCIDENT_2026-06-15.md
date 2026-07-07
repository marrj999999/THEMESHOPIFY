# Shopify Theme Incident - 2026-06-15

Restored locally on 2026-06-17 12:43 BST.

## Local Restore

The following local files in `/Users/jamesmarr/Projects/bbc-theme-new` were restored from verified Claude/Shopify read-back data for the unpublished preview theme `195991470454` (`BBC Redesign 2026 (WIP - do not publish)`):

| File | Source state | Size | MD5 |
| --- | --- | ---: | --- |
| `sections/bbc-home-2026.liquid` | Server-side GraphQL read-back after deploy at 2026-06-15 16:47 BST | 62071 | `907a0445b69e8826e0f6adafa09de322` |
| `sections/bbc-header-2026.liquid` | Server-side GraphQL read-back after deploy at 2026-06-15 16:44 BST | 12509 | `5c81228028dd12f19f4423774e8d02ba` |
| `assets/bbc-layout.css` | Server-side GraphQL read-back after deploy at 2026-06-15 16:51 BST | 5265 | `26af1519ebe42c932629c04be403f734` |

The pre-restore local versions were backed up here:

`/Users/jamesmarr/Projects/bbc-theme-new/recovered/current-before-2026-section-restore-20260617-124336/`

No Shopify remote write or publish was performed during this restore.

## What Was Recovered

The recovered preview state includes:

- Official dark logo lockup in `bbc-header-2026.liquid`.
- CSS triangle nav caret, no persistent nav/brand underline.
- Country/currency/help utility and accessibility skip link already present in header.
- Home page why-bamboo image set to `why-bamboo-joint.webp?v=1781537805`.
- Home page video set to the YouTube no-cookie build embed `ckCwJXJGKD0`.
- Home page community section has `/blogs/news`.
- `assets/bbc-layout.css` includes `AUDIT FIXES v2` and `AUDIT FIXES v3` for Atkinson/nav polish, logo sizing, and video aspect ratio.

Verification after local restore:

- Home schema parses as JSON and file size is 62071 bytes.
- Header schema parses as JSON and file size is 12509 bytes.
- CSS file size is 5265 bytes.
- Expected markers are present.
- Old home markers `<video` and `parts-laid-out` are absent.

## Incident Timeline

- 2026-06-15 15:42-16:57 BST: Work in the instructor Claude session deployed and verified the preview theme `195991470454`. This included curated imagery, official logo, working YouTube build video, Atkinson/font fixes, nav polish, and responsive video CSS.
- 2026-06-15 17:35-20:15 BST: Later autonomous Claude Code sessions in `/Users/jamesmarr/Projects/bbc-theme-new` edited the theme under conflicting assumptions about live vs preview theme targets.
- 2026-06-15 19:03 BST: A later task explicitly instructed work against live/main theme `191768756598`.
- 2026-06-15 19:36 BST: James interrupted one session: "Stop your working on the live theme not the preview".
- 2026-06-15 19:47 BST onward: Recovery questions began, asking for the old `BBC Redesign 2026 (WIP - do not publish)` files from around 16:45 BST.

## Evidence Sources

- Main afternoon session: `~/.claude/projects/-Users-jamesmarr-Documents-bbc-instructor/87f2bcd1-4df6-476d-a9fc-994ac472fc32.jsonl`
- Home read-back: `~/.claude/projects/-Users-jamesmarr-Documents-bbc-instructor/87f2bcd1-4df6-476d-a9fc-994ac472fc32/tool-results/mcp-18e4e196-5449-4141-8b13-aff96ac5c63d-graphql_query-1781538480272.txt`
- Header read-back: `~/.claude/projects/-Users-jamesmarr-Documents-bbc-instructor/87f2bcd1-4df6-476d-a9fc-994ac472fc32/subagents/agent-a9379bdf7ea9ebd3c.jsonl`
- CSS read-back: `~/.claude/projects/-Users-jamesmarr-Documents-bbc-instructor/87f2bcd1-4df6-476d-a9fc-994ac472fc32/subagents/agent-a6a999e4938ae8379.jsonl`
- Later 7pm-swarm ledger: `/Users/jamesmarr/Projects/bbc-theme-new/recovered/LEDGER.md`

## Caveats

- No Time Machine or filesystem snapshot from 15:00-16:00 BST was found.
- `/tmp/bbctheme`, the original scratch folder used during the afternoon deploys, no longer exists.
- The restore above is still exact for these three files because the final server-side bodies were captured in Claude/Shopify read-back logs.
- Other files touched in the later evening sessions are separately covered in `recovered/LEDGER.md`; some of those pre-7pm reconstructions are marked partial and should be confirmed through Shopify Version History before any remote revert.
- Any remote Shopify restore/deploy needs James's explicit approval first.
