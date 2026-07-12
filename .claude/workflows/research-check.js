export const meta = {
  name: 'research-check',
  description: 'BBC theme: gather context + best-in-class examples for a specific element before building it',
  whenToUse: 'Step 1.5 of qa/WORKFLOW.md — run before building any non-trivial band/component; pass {element, page} as args',
  phases: [{ title: 'Research' }],
}
phase('Research')
const el = (args && args.element) || 'the element being built'
const page = (args && args.page) || 'impact'
const res = await agent(
  `Research pass for the Bamboo Bicycle Club theme (qa/WORKFLOW.md step 1.5). Element being built: "${el}" (page: ${page}).
1. BANKED FIRST: read /Users/jamesmarr/Projects/bbc-theme-new/qa/DESIGN-RESEARCH.md, DESIGN-BRIEF.md, FORMULA.md and any spec covering this element — list what already answers the need (do not re-research it).
2. VAULT: pull relevant verified facts/quotes/orgs/images from the Obsidian vault ("/Users/jamesmarr/Documents/Bamboo bicycle club/" — Proof Bank rules: sourced stats only, Makers language, no banned claims).
3. FRESH EXAMPLES: find 2-3 current best-in-class references for THIS SPECIFIC element (web search + fetch; screenshot-level detail in words). For each: URL, what it does brilliantly, one concrete buildable "steal this" (layout/type/behaviour), and one "skip this".
4. VERDICT: enough context to build? What's still missing and who can supply it (vault gap vs James question)?
Write findings to /Users/jamesmarr/Projects/bbc-theme-new/qa/research/${page}-${el.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.md`,
  { label: 'research', schema: { type: 'object', required: ['enoughContext', 'references', 'missing', 'filePath'], properties: {
      enoughContext: { type: 'boolean' },
      references: { type: 'array', items: { type: 'string' }, maxItems: 5 },
      missing: { type: 'array', items: { type: 'string' }, maxItems: 5 },
      filePath: { type: 'string' } } } }
)
return res
