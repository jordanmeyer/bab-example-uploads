# Build a trustworthy sales/returns browser workspace

This plan follows the provided ~/.codex/PLANS.md conventions and is maintained as work proceeds.

## Purpose / Big Picture

Classmates can replace two local CSV exports, find gross sales leadership that vanishes after returns, and inspect joined lines. Common Goods is fictional. Open the sample and compare by Channel: Paid social is gross rank1 and net rank3. The tool never uploads or saves selected files.

## Progress

- [x] (2026-10-09) Read all five workflow skills, library workflows and design references.
- [x] (2026-10-09) Ask and record consequential model choices with simulated student.
- [x] (2026-10-09) Prepare isolated managed application with approved pinned libraries.
- [x] (2026-10-09) Build strict transactional CSV parsing, exact-cent joins/aggregates and explanatory interface.
- [x] (2026-10-09) Observe31/31 exploratory model tests passing in browser.
- [x] (2026-10-09) Commit source, verify31 model cases, and exercise packaged imports/filters/errors/downloads; inspect fixed-width layouts and keyboard focus.
- [x] (2026-10-09) Resolve production parsing and narrow-layout findings; independent Round3 PASS at b64d85f7658a18602a9ad5877232d100069ac463.
- [ ] Coordinator publishes and verifies exact live revision.

## Surprises & Discoveries

ECharts' generated accessibility description exposed internal stacked dimensions including NaN despite valid visible values; an explicit description now directs readers to the exact table. A huge shared browser viewport made an unbounded screenshot unhelpful, so tests/layout.html supplies separate fixed1440/390/320 frames without changing shared settings. Chrome was unavailable; Codex in-app browser worked.

Production checkpoint1daf1f48 failed: minified closure names caused Arquero Invalid variable reference "t". Use aq.escape for the authored filter closure; production tests are mandatory because source-mode success missed this boundary.

## Decision Log

2026-10-09: Assign returns to original sale months as agreed by simulated student; display maturity limits and avoid profit/cash-flow claims. Aggregate returns before the left join to preserve one row per sale. Parse USD into bounded integer cents to avoid floating point accounting. Use sorted rank maps and top12 chart/top100 table presentation bounds so the10,000-line input limit remains usable. Select channel by default to make the sample reversal immediate. Refresh restores samples and all imports remain transient.

## Outcomes & Retrospective

A usable dashboard and31 model checks exist. A production-only Arquero minification failure was found and fixed, then known-answer imports and failed transactional replacements passed in the packaged app. Independent review passed after a second rendered round fixed narrow currency wrapping and crowded chart ticks. Publication remains coordinator-owned and pending. The sample illustrates why high gross revenue alone is insufficient; it does not establish a business recommendation.

## Context and Orientation

This is a new standalone repository. app/model.js owns schema/validation and Arquero return aggregation, left join, derived cents, filtered grouped summaries and CSV export. app/sample.js generates invented data. app/app.js connects native controls, safe text tables and two ECharts charts. app/style.css and app/theme hold visual styles. tests/index.html imports model.test.js; tests/fixtures hold only synthetic mini-case files. vite.config.js makes app/ production input and project-root the test input. scripts/notices.mjs collects package licenses; .github/workflows/pages.yml publishes only dist.

## Plan of Work

Finish the source checkpoint after npm ci, dependency checks and notices generation. Run the model page and UI interactions, using the saved mini-case files for valid and invalid imports. Inspect fixed-width frames, text tables and keyboard controls. Build production and check the exact repository prefix. Ask independent reviewer to inspect the actual checkpoint and preserve every finding/revision in REVIEW.md and EVALUATION.md. Only root publishes after PASS.

## Concrete Steps

From the application root run npm ci --cache /private/tmp/bab-npm-cache, then node /Users/jordan/Projects/decision-999/plugins/browser-app-builder/scripts/check-dependencies.mjs /private/tmp/bab-recipe-examples-2026-10-09/uploads. Run npm run build. Stage named authored paths and inspect git diff --cached before committing on main with the approved local identity. npm run test:browser -- --port 9503 serves /tests/ and /app/. npm run preview -- --port 9504 serves /bab-example-uploads/. Record the full commit before final checks and compare relevant paths before/after.

## Validation and Acceptance

At /tests/, expect31/31 passed and0 failed. At /app/, sample displays$91,182 gross,$15,134 returned,$76,048 net,1728 units and222 returned. Import tests/fixtures/sales.csv plus returns.csv: expect$350,$90,$260 and26.7%. Import unmatched.csv instead: current values survive and unmatched ID error appears. Filter January: net$140. Restore sample; exports download and include all matching rows. Read plan for exact schema and bounds. Inspect1440/390/320 frames with no horizontal page overflow; table scrolling is intentional. Production prefix loads hashed assets and linked notices. No console errors or external runtime requests in the observed path; document limitations of that observation.

## Idempotence and Recovery

npm ci/build are repeatable. Generated dist/node_modules stay ignored. The test and production servers have unique ports; stop only these servers. Failed import never changes active state. Source edits invalidate affected evaluation; record a new commit and rerun affected checks instead of changing the SHA beside old evidence. Root owns remote creation and never force-pushes.

## Artifacts and Notes

Exploratory result:31/31 passed;0 failed. Public attribution authorized: Jordan Meyer <jordanmeyer@protonmail.com>. No actual student testimonials or data are present.

## Interfaces and Dependencies

joinData(salesCsv, returnsCsv) returns validated rows, returnCount and observedThrough. summarize(dataset, filters) returns rows, totals, groups and months. exportCsv(rows) quotes safely and escapes spreadsheet formula prefixes. Papa Parse5.7.0, Arquero8.0.3, ECharts6.1.0 and Vite8.3.4 are exact approved versions; Node22.19.0/npm10.9.3 build locally and in CI. No backend or runtime external service exists.

Revision note: initial living plan records implementation and exploratory checks; final review remains explicit rather than inferred from compilation.

Revision note: both failed independent rounds remain in REVIEW.md/EVALUATION.md. Final source b64d85f is approved; later commits contain reports only.
