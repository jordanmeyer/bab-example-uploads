# Evaluation

## Exploratory round — 2026-10-09, pre-checkpoint

Model test page observed in the Codex in-app browser:31/31 passed,0 failed. Independently specified mini-case (A10×$20, B5×$30; A2+A1 returned and B1 returned) produces35000 gross cents,9000 returned cents,26000 net cents,4/15 units returned. Tests cover strict CSV/schema/date/ID/unit/currency boundaries, aggregation/join identity, no returns, zero price, filters, ties, formula escaping and maximum10000-line exact arithmetic. Source is app/model.js, tests/model.test.js.

Initial rendered accessibility snapshot exposed ECharts auto-generated stacked-data description containing NaN. Fixed by supplying an authored chart description referring to the exact table. This is retained as a failed exploratory presentation check. Default grouping changed from Product to Channel because the sample's gross→net leadership reversal is clearer there. Source not yet checkpointed at this exploratory round.

Chrome browser selection was unavailable; the in-app browser succeeded. Shared browser viewport was exceptionally large, so a fixed-width iframe test page is used without changing browser-wide state. This tests CSS layout but is not a mobile-device emulation.

## Final developer round

Checkpoint1daf1f48cd85192dd605753860e756e84ca5f444, Node22.19.0/npm10.9.3. npm ci and dependency check pass; build retained7 package notices; audit0. Browser model31/31 passed after commit. Desktop1440, narrow390 and320 frames have document scrollWidth equal clientWidth (1439,389,319 due iframe borders). Screenshot found missing whitespace where a narrow-layout hidden br joined “thewhole”; fixed in next checkpoint.

Production FAILED at this checkpoint: KPIs remained unset and console said Invalid variable reference "t". Independent reviewer identified Arquero parsing a minified closure variable. The development tests passed because names had not been minified. The fix uses aq.escape for the authored filter closure and removes unused params. This failure is retained; no final PASS is claimed until packaged behavior is retested.


## Developer round — fixed production, checkpoint 036710e852d77dea13973a026e87deb645d53f20

Relevant source: app/, tests/, .github/workflows/, package.json, package-lock.json, .npmrc, .node-version, vite.config.js, scripts/. No extra executable tooling exists; docs are prose only. PLAN.md is unchanged from the tested initial baseline. Fresh npm ci completed with0 vulnerabilities, approved dependency checker passed, notices retained7 runtime packages and production build passed. Vite reports an advisory791.22kB main JS chunk (264.12kB gzip); this is a known payload limit, not hidden by changing its threshold.

The same31 model cases passed after the filter correction at2503a10;036710e changes only authored chart accessibility copy and the production layout harness. Final31/31 rerun at036710e was observed with0 failures; packaged sample and both authored chart descriptions were rechecked on that same checkpoint. Production uses /bab-example-uploads/assets/index-DQ4AyPWd.js and index-2xTRIDm4.css.

Actual production interactions in the Codex in-app browser used native file chooser flow with committed synthetic fixtures. On39f857e (model identical to036710e): sales.csv plus returns.csv loaded2 sale lines and3 return events; gross$350.00, returned$90.00, net$260.00, unit rate26.7%. January filter gave net$140.00. Replacing returns with unmatched.csv reported unmatched line_id Z and retained the selected January$140.00. Pressing Enter on Clear filters restored$260.00. Export summary downloaded a real CSV with Email200.00/60.00/140.00 and Search150.00/30.00/120.00. Restore sample via Enter worked; Next showed lines21–40 of144. Combined Jan/Weekender tote/Paid social gave$4,450/$2,581/$1,869 and29/50 returned units (58.0%).

Sample downloads were actually saved by the browser. A separate Python standard-library csv + Decimal calculation (no imports from app model) computed144 sales,99 returns,1728 sold units,222 returned units, gross91182.00, returned15134.00, net76048.00, exactly matching the dashboard. The mini-case expectations existed before observing the application. Downloaded synthetic files remain outside the repository.

At2503a10, the packaged grouping interactions showed Paid social gross#1→net#3 and pair Weekender tote/Paid social gross#1→net#4 with12 groups. Keyboard Tab from Clear filters focused Compare by; computed outline-style was solid. Labels and file controls are native. Both charts have authored descriptions and exact tables; month table uses a keyboard-operable disclosure. Source review confirms safe textContent for imported values and richText chart tooltips, escaped formula-prefix CSV output, reduced animation and disposal on actual teardown while preserving browser-cache navigation.

Rendered layout uses fixed1440,390 and320 CSS-pixel frames, now loading actual production9504. At036710e the320 frame measured clientWidth319==scrollWidth319 and the heading whitespace fix is visible. Earlier desktop/narrow source frames measured1439==1439 and389==389; independent reviewer repeats production frames. Horizontal table scroll is intentional. The browser's actual viewport is very large and its screenshot clips scale by device pixels; these are CSS frame inspections, not mobile-device emulation. An attempted cross-frame keyboard press returned a browser-tool focus-root error; direct top-level keyboard interactions passed. Full screen-reader certification, device emulation and exhaustive request capture are not claimed.

Observed script/style URLs use the production prefix and same origin. Console contained the preserved prior failure from index-VN6AX90_.js; no new error was observed after index-nl6JhNmp / CvWh7Kkw loaded during those interactions. Runtime asset isolation is also supported by source and generated-bundle inspection; no external-call/telemetry code exists. This is a scoped observation, not a network security certification.

Separate simplification pass: removed redundant Arquero params after using an escaped authored closure; preserved one parse/validate/join operation instead of introducing alternate import paths; used sorted rank maps instead of pairwise comparisons; retained native controls and shared model functions. No redundant framework, local-storage state or schema-mapping layer added. A staged-diff whitespace check caught one trailing blank CSS line during the first checkpoint preparation; removed it before that commit. Browser automation selector errors were tooling issues and are recorded here rather than presented as app failures.

Independent review verdict and rendered chart-state findings are owned by reviewer in REVIEW.md. Publication remains coordinator-owned.

Freshness before and after the final model/production recheck: committed/staged/unstaged relevant diffs exit0, untracked relevant-path listing empty, PLAN status empty and plan diff empty. No executable source changes followed036710e during this developer round.


## Independent narrow review — Round 2 FAIL, checkpoint036710e

Reviewer visually inspected actual320px production. Despite no page overflow, Net sales wrapped the final decimal digit onto another line and value-axis labels crowded together in the narrow plot. Required correction: one-column KPI layout at400px and below, fewer value ticks and hide-overlap behavior. Axis labels use compact USD notation for very large valid amounts; exact cents remain in KPIs/tables/exports. Model/import checks stayed passing. This failed visual round is preserved; a new source checkpoint and rendered review are required.


## Final handoff — independent PASS, source b64d85f7658a18602a9ad5877232d100069ac463

Round3 in REVIEW.md independently approves the current source after preserving both failed rounds. Reviewer reran31/31 browser checks, the actual320px production screenshot, solid chart-hover state, independently authored safe-CSV/zero-price/leap-date examples, keyboard/paging and navigation back. The exact default net amount now occupies one line; developer measured height32.20px equal to line-height32.2px within252.70px width. The model and PLAN did not change in the narrow fix. See REVIEW.md for the independent observations and limits rather than treating them as developer-run checks.

Current build uses index-BLlrDVGi.js and index-CrM2htBU.css. Production build succeeds with the disclosed791.37kB bundle advisory. Final source/PLAN freshness checks against b64d85f pass: all relevant diffs exit0, untracked source listing empty, PLAN status/diff empty. Only evidence reports follow this source checkpoint. No required review finding or unresolved product/model choice remains. Coordinator is authorized to publish after its own final destination/freshness checks; publication/live verification is not claimed here.

## Follow-up history regression,2026-10-09

Targetedregressionafterroadmaprevealedbrowsernativeformrestorationissue: Jan2026+ComparebyProductcorrectlyshows4productrows, butawayto/tests/andBackretainedJan/productcontrolswhilefreshJSrenderedallmonths/channelresults(Paidsocialgross34158). OriginalindependentPASSretained; thisisnewboundedregressionevidence. Onlyfixisnativeautocompleteoffonfiltersformandgroupselect; noarithmetic/CSV/chartlayoutchange. Targetedrecheckrecordedafterbuild.


## Authorized live revision — developer round, 2026-10-09

Tested source 7b6369e27c216a9b24c1931581807983158076e7 (including PLAN, app, tests, build tooling and font licenses). Clean npm ci, approved dependency check and production build passed. Audit reports zero vulnerabilities. Notices now retain nine package/font sections. Vite's 794.06 kB main bundle (265 kB gzip) advisory remains visible.

The actual browser model page on port 9713 passed 32/32 cases. The added case proves joint product/channel grouping keeps two channels of one product separate. Independent Python arithmetic specified sample answers before the browser: 384 sale lines, 326 return events, 5,452 sold units, 834 returned; gross $291,788, refunds $51,827, net $239,961. The packaged default matched. Paid social moves from gross rank 1 to net rank 2; Organic search takes net rank 1. Eight month points and overlapping synthetic return rates replace the earlier uniformly engineered three-month sample.

Production on port 9714: keyboard Enter on the Weekender tote × Paid social matrix button set both filters and showed 756 sold / 308 returned units, 40.7%, net $39,872. May + Everyday tee + Email showed 30 / 10 units and net $560. Clear filters restored totals. The matrix supplies counts and rates; the graph explicitly describes whole-dollar rounding, while CSVs preserve cents. Revenue is explicitly distinguished from profit.

Native file chooser import of the committed two-line sales and three-event returns fixture gave $350 gross / $90 refunds / $260 net and 26.7%. An unmatched return ID rejected replacement and preserved $260. A synthetic 101-product/header-only-returns fixture showed exactly 100 summary rows, with “Chart shows 12 of 101 groups. Table shows 100 of 101 groups.” Its matrix truthfully showed 12 of 101 products and 1 of 1 channels; net remained $1,010. Restoring the sample cleared those exceptional truncation labels. One three-chooser automation batch took about 273 seconds despite the bounded call; later chooser operations completed promptly. This is a browser-tool duration limitation, not an app timing claim. No further slow repetitions were needed.

The authored same-origin production harness measured 1440 / 390 / 320 CSS-pixel frames: client/scroll widths 1439/1439, 389/389, 319/319; page heights 1731, 2896, 3157. All three local font faces loaded. Initial performance entries showed no external resources. No controls below 24 px were found in these paths. Desktop and narrow screenshots were inspected; tables have local horizontal scrolling. The harness tests responsive CSS, not device emulation or complete assistive-technology certification. Console warning/error query returned an empty array.

After May/tee/Email selection, navigating away and Back returned All months/products/channels, $291,788 gross and $239,961 net before interaction. Control/result state was consistent. app pageshow renders from current control values. Lazy initialization of the hidden trend chart prevents zero-width ECharts initialization. A separate simplification pass preserved one join/model path, removed unnecessary disabled paging in favor of bounded views, and kept the existing Papa Parse + Arquero + ECharts recipe without adding a table dependency.

Source and PLAN freshness comparison against the tested checkpoint is clean; subsequent edits are reports/README/ExecPlan only. Independent approval and live deployment are not claimed by this developer round. Historical failures and the original checks above remain intact.

Independent coordinator PASS at 7b6369e received after full source/PLAN and browser review; details are in REVIEW.md. Freshness comparison remains clean for app, tests, PLAN and tooling. Report-only publication is authorized; live status remains pending until root verifies Pages.
