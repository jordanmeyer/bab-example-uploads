# Independent review

Reviewer owns this record; developer owns implementation. Publication requires verified PASS for actual source. All data used here is synthetic. Current status: **PASS for source81cbd7110caef07f754d9b377e183dca4e17f5a7**, including the bounded history follow-up after the preserved Round3 PASS.

## Round 1 — FAIL — 2026-10-09

Reviewed source checkpoint: `1daf1f48cd85192dd605753860e756e84ca5f444` (source initially clean). Read PLAN, simulated planning exchange, model, UI, tests, package/config and workflow. Browser: Codex in-app browser, independent background tab, production `http://127.0.0.1:9504/bab-example-uploads/`.

Required P1: Production remains at “Loading application modules…”; KPIs stay at em dashes and summary/join tables remain empty. Reproduced in initial render and subsequent DOM snapshot. Browser console reports `Invalid variable reference: "t"` from minified `assets/index-VN6AX90_.js`, with Arquero warning that table expressions do not support closures. `summarize` uses parameter names captured in the filter expression; bundling renames them without matching the table parameter keys. Development model tests do not exercise that production transformation. Sent finding directly to developer. Require minification-safe authored expression, fresh committed source, build and production interaction/known-answer verification before PASS.

Other review remains in progress. This is not a publication approval.

## Round 2 — FAIL — 2026-10-09

Repaired production checkpoint `39f857e347a61811fad9384a096995b885e0bb10` uses `aq.escape` for the actual filter closure. Independent production import of committed two-line/three-return fixtures displayed $350 gross, $90 returned, $260 net and 26.7% returned units. January filter displayed $140 net. Replacing returns with unmatched Z preserved that $140 and showed a correction message. Combining Travel mug + Email displayed no rows, $0, n/a rates, and disabled both exports. Browser model suite independently observed 31/31 passed. Production packaging blocker is fixed.

Subsequent source `036710e852d77dea13973a026e87deb645d53f20` was reviewed for the small followups: persisted-pagehide handling, wrapping, authored trend description and production layout harness. Desktop production1440 and narrow390 rendered cleanly. At320, document client/scroll widths both319, but the actual screenshot exposed required P2 presentation defects: default net currency wrapped as `$76,048.0` with final `0` alone on the next line, and bar-axis dollar ticks overlapped across the small plot. Lack of page overflow is insufficient. Sent developer the bounded fixes: provide enough narrow KPI width/fitting typography and reduce or hide overlapping ticks; new committed source and actual320 rendered verification required.

## Round 3 — PASS — 2026-10-09

Actual reviewed source: `b64d85f7658a18602a9ad5877232d100069ac463`. Inspected delta: one-column KPIs at400px and below, compact currency axis labels with smaller split count and overlap suppression. No model or PLAN changes. Reopened production1440/390/320 harness; actual320 screenshot shows `$15,134.00` and `$76,048.00` intact, clear $0/$10K/$20K/$30K/$40K ticks, readable group labels, legend and analysis text. Document widths remain319/319. Desktop chart hover screenshot shows Organic search tooltip with $26,366 kept/$2,284 returned while marks remain solid navy/copper. Responsive frames test CSS layouts, not a mobile device. Host frame click/keyboard errors were handled by doing keyboard checks in the top-level app; no alternate browser automation was used.

Independently observed current browser model suite:31/31 passed, zero failed. Exact plan calculations and failure cases were inspected, including aggregate-before-join identity, bounded integer cents, dates/schema/IDs, cumulative overreturns, no returns, zero money, empty filters and ties. Round2 import/transaction/empty-state checks remain applicable because the model/import paths are unchanged. Additional reviewer-authored synthetic files used reordered headers and leap date2000-02-29: A sells1 at$0.10 and returns1; B sells2 at$0.00 and returns1. Independently expected gross10c, refund10c, net0, returned units2/3. Production matched exactly and displayed66.7%. Product labels `=2+2` and `<b>Canvas</b>` remained literal in native tables and filter options. Actual joined-row download was read: formula label prefixed with an apostrophe, HTML-like label literal, exact0.10/0.00 accounting fields. No test fixture was inferred from app outputs.

Verified Enter on Restore sample and Next produces lines21–40 of144; Tab after Clear filters reaches Compare by. Current production sample shows $91,182 gross/$15,134 returned/$76,048 net,222/1,728 units. January filter changes net to$22,721. Navigate away/back and keyboard Clear filters returns$76,048 with working charts. Same production build shows the authored chart descriptions and all local notices under `/bab-example-uploads/`.

Dependency checker independently accepted exact approved packages/registry lockfile; inspected workflow/base/source destination and tracked executable file list. Developer reinstall/build and independent sample recomputation are recorded in EVALUATION, not represented as reviewer-run npm ci. Relevant committed/staged/working-tree diff checks and untracked source/PLAN checks were clean before/after final browser run. PLAN unchanged. Browser log inspection retains only the historical Round1 error from old asset `index-VN6AX90_.js`; no new warning/error from current build was observed. Source and DOM runtime references are local; available tools lack complete request capture, so universal network isolation is not claimed. Live repository/link and Pages behavior remain coordinator publication checks.

No required findings remain. The tool is useful within its agreed sales-cohort boundary, with transparent return completeness and non-profit limitations. Approved to publish this source or report-only descendants after freshness checks. Large bundle, omitted-return uncertainty and fixed-width rather than device emulation remain disclosed limits. This is not full accessibility or business-model certification.

## Bounded follow-up — native history restoration

After the same browser behavior was confirmed in other native-form examples, reviewer requested one targeted regression: set January and Product grouping, navigate away and Back, then compare controls and results **before any interaction**. Developer reproduced January/Product controls against restored all-month data and a three-channel table. The earlier reviewer test had checked after pressing Clear filters, so it did not cover this pre-interaction state. The previous arithmetic/import/visual findings remain valid; this newly observed inconsistency reopens the history boundary only.

Developer notified the coordinator before changing the published source and is correcting autocomplete policy on the filters form and separate grouping selector. Prior PASS and deployment are historical evidence, not silently rewritten as never having occurred. Revised source and independent pre-interaction return checks remain pending; no new feature is requested.

## Follow-up PASS — source81cbd7110caef07f754d9b377e183dca4e17f5a7

Reviewer inspected the full diff against the prior passing executable source: only autocomplete disabled on the filters form and grouping selector. Model, PLAN, JavaScript, CSS and tests are unchanged. Final relevant-source diff is empty.

Coordinator independently selected January/Product in production: four product rows, including Weekender gross12282/refund2937/net9345. After navigating to the test page and Back, **before interaction**, month/product/channel controls are empty and grouping is Channel. The table correctly shows three channel rows: Paid social34158/12850/21308; Organic search28650/2284/26366; Email28374/0/28374. KPIs are91182/15134/76048. Both chart canvases remain mounted and captured warning/error logs are empty. The independent witness closes the exact failed boundary; no full arithmetic rerun was necessary for this HTML-only change.

This follow-up browser work was performed by the coordinator independently of the developer because the reviewer's browser was unavailable; earlier Round3 browser work was personally performed by this reviewer. All required findings are again closed. Root may publish the ordinary update after freshness/build/live checks.

## Authorized live revision — independent PASS, 2026-10-09

Coordinator reviewed full model, UI, tests and PLAN at source 7b6369e27c216a9b24c1931581807983158076e7. Independently summed generated CSVs in Python: gross 291788 / refunds 51827 / net 239961; Paid social 110356 → 76752, Organic search 107664 → 94765, and tote × paid net 39872. Observed 32/32 browser tests and keyboard matrix filtering to 308/756 units. Actual 320 px frame has no page overflow or small controls; all three local fonts loaded and initial external-resource entries were empty. Source and table output safely use text. PASS applies to the revised source; publication and live observations follow separately. Existing fixtures and prior failed rounds remain retained. No repeated slow file-chooser run was required.
