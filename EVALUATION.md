# Evaluation

## Exploratory round — 2026-10-09, pre-checkpoint

Model test page observed in the Codex in-app browser:31/31 passed,0 failed. Independently specified mini-case (A10×$20, B5×$30; A2+A1 returned and B1 returned) produces35000 gross cents,9000 returned cents,26000 net cents,4/15 units returned. Tests cover strict CSV/schema/date/ID/unit/currency boundaries, aggregation/join identity, no returns, zero price, filters, ties, formula escaping and maximum10000-line exact arithmetic. Source is app/model.js, tests/model.test.js.

Initial rendered accessibility snapshot exposed ECharts auto-generated stacked-data description containing NaN. Fixed by supplying an authored chart description referring to the exact table. This is retained as a failed exploratory presentation check. Default grouping changed from Product to Channel because the sample's gross→net leadership reversal is clearer there. Source not yet checkpointed at this exploratory round.

Chrome browser selection was unavailable; the in-app browser succeeded. Shared browser viewport was exceptionally large, so a fixed-width iframe test page is used without changing browser-wide state. This tests CSS layout but is not a mobile-device emulation.

## Final developer round

Pending checkpoint and production/browser checks. Independent reviewer has been requested; no final PASS is claimed yet.
