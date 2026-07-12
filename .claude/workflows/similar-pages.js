export const meta = {
  name: 'similar-pages',
  description: 'BBC theme: comparative review of similar pages online — design + UX theory analysis',
  whenToUse: 'Step 1.4 of qa/WORKFLOW.md — once per page at DEFINE; pass {pageType, ourUrl} as args',
  phases: [{ title: 'Compare' }],
}
phase('Compare')
const pt = (args && args.pageType) || 'charity impact / funder page'
const ours = (args && args.ourUrl) || 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710'
const res = await agent(
  `Comparative page research for the Bamboo Bicycle Club theme (qa/WORKFLOW.md step 1.4). Page type: "${pt}". Our current page: ${ours}.
Context first: /Users/jamesmarr/Projects/bbc-theme-new/qa/FORMULA.md + DESIGN-BRIEF.md (brutalist-editorial, Atkinson, lowercase, lime/forest/paper/steel) — recommendations must fit this system, not fight it.
1. Find 3-5 LIVE pages of the same type from strong organisations (mix: sector leaders + design-led brands). Fetch/browse each.
2. Analyse each against design + UX theory, concretely: visual hierarchy (what does the eye hit 1st/2nd/3rd and why), scanning pattern (F/Z/layer-cake), cognitive load (bands per scroll, words per band), Nielsen heuristics where relevant, the conversion path (how many scrolls to the primary action; how CTAs escalate), trust architecture placement, and mobile behaviour.
3. Score OUR page against the same criteria (browse it, mobile 375px first).
4. Output "adopt / adapt / avoid" table: pattern · which site · the theory reason · how it lands in OUR system (selector/band-level suggestion).
Write to /Users/jamesmarr/Projects/bbc-theme-new/qa/research/similar-${pt.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.md. Never recommend banned claims or off-system styling.`,
  { label: 'compare', model: 'opus', schema: { type: 'object', required: ['sites', 'adopt', 'ourGaps', 'filePath'], properties: {
      sites: { type: 'array', items: { type: 'string' }, maxItems: 6 },
      adopt: { type: 'array', items: { type: 'string' }, maxItems: 6 },
      ourGaps: { type: 'array', items: { type: 'string' }, maxItems: 6 },
      filePath: { type: 'string' } } } }
)
return res
