export const meta = {
  name: 'page-pass',
  description: 'BBC theme: CRIT a page against FORMULA.md, save evidence, return verdict',
  whenToUse: 'After deploying page changes to the draft theme — runs the fresh-eyes FORMULA scorecard (steps 5 of qa/WORKFLOW.md)',
  phases: [{ title: 'CRIT' }],
}
phase('CRIT')
const page = (args && args.page) || 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710'
const date = (args && args.date) || 'today'
const verdict = await agent(
  `You are the CRIT gate for the Bamboo Bicycle Club theme (qa/WORKFLOW.md step 5). You did not build the page; be sceptical.
Checklist: /Users/jamesmarr/Projects/bbc-theme-new/qa/FORMULA.md (score rows mechanically). Context: qa/QA-LOG.md top entries, qa/OPERATIONS-MAP.md.
Page: ${page} — drive headless Chrome via the repo's Playwright (the in-app pane freezes on long pages). Mobile 375x812 FIRST, decline cookies, screenshot EVERY band, save to /Users/jamesmarr/Projects/bbc-theme-new/qa/evidence/${date}/ as band-NN-name.png; then a 1280px desktop pass. Measure computed px and contrast ratios — never estimate.
Write the per-band scorecard + ranked defects (selector + fix each) + binary verdict to qa/CRIT-<page-slug>-${date}.md.`,
  { label: 'crit', schema: { type: 'object', required: ['ready', 'topDefects', 'reportPath'], properties: {
      ready: { type: 'boolean' },
      topDefects: { type: 'array', items: { type: 'string' }, maxItems: 5 },
      reportPath: { type: 'string' } } } }
)
return verdict
