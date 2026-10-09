# How Common Goods was built

## Opening request

“I'm analyzing sales and returns for a fictional direct-to-consumer company. Every month I get two CSV exports. I want to upload them, join and summarize them, find product/channel patterns, and explain which apparent sales wins disappear after returns. Can we make this a browser tool that my classmates can explore using sample files?”

## Planning

The [recorded simulated planning exchange](PLANNING-CONVERSATION.md) is a developer/coordinator roleplay, not a real student interview. It chose unique sales lines, repeat partial return events, aggregation before joining, assignment back to sale month, transactional replacement and no profit claim. [PLAN.md](PLAN.md) defines the contract, arithmetic, sample rules and independent known answers; [DECISIONS.md](DECISIONS.md) records material choices.

The user-authorized October9revision expands3months to8, adds varied deterministic lines and a product×channel matrix with counts, and gives the main analysis three concise views. Paid social leads gross revenue but loses that lead after returns. Costs are absent, so this remains a revenue lesson.

## Recipes and evidence

Browser App Builder's Plan/Build/Evaluate/Deploy workflow guided the work. Papa Parse reads and writes local CSV, Arquero aggregates and joins, and Apache ECharts draws comparisons. Native HTML supplies forms and accessible tables. Campus Designer guidance supplies unchanged published blues and local licensed EB Garamond/Open Sans. Vite bundles the application; imported files remain transient in the browser.

[EVALUATION.md](EVALUATION.md) retains actual checks, failures and source checkpoints. [REVIEW.md](REVIEW.md) records independent findings and [DEPLOYMENT.md](DEPLOYMENT.md) records live status. No build or classroom result establishes real business value, complete returns coverage, or institutional endorsement.

## Student investigation

This is a bounded practice task, with supplied checks below. It is not evidence of an actual novice completing the task.

1. In the synthetic sample, predict which channel will lose its gross-sales lead after returns. Use **Channel** grouping, reconcile gross minus returned revenue, and name a second filter you would investigate before recommending a marketing change.
2. Open **Trends & interactions**. Select Everyday tee × Email using the matrix, then select May. Compare that monthly rate with the all-month pair. Explain why one channel average cannot identify every product/month problem. Use **Show all product/channel combinations** to recover the matrix; it deliberately preserves your sale-month filter.
3. Clear filters. Open **Try the cohort-maturity example**, predict the two snapshots, then load each. In **Joined rows**, inspect M1 and reconcile its two raw events, their aggregate and the one joined sale. Explain what goes wrong if the sale joins directly to both events.
4. Restore the sample and download both CSVs. Inspect the exact headers against **File format, calculations and limits**. In copies, change one return's line ID to `MISSING`, import the pair and confirm the current values and source filenames remain. Correct it, then change that return's units so its cumulative returned units exceed the matched sale's sold units. Confirm the second rejection also preserves values and filenames. Correct the units, import the pair, and reconcile a chosen line. Files stay only in this tab; keep your local CSVs and download your summary before leaving.
5. Export a filtered summary. State its grouping, sale-month filter and observed-through date from the CSV. Write a one-sentence finding, your evidence and one limitation. A later cohort may simply have had less time to receive returns.

### Supplied checks

Paid social starts at gross rank 1 with $110,356, returns $33,604 and retains $76,752: net rank 2, behind Organic's $94,765. This is retained merchandise revenue, not contribution or profit. The old three-month example's rank 1→3 and $21,308 figures are historical and do not describe the current sample.

Everyday tee × Email across all months returns 33 of 380 units (8.7%). In May, it returns 10 of 30 (33.3%) and retains $560. This variation warrants inspection of product mix and cohort maturity; it does not prove a causal channel effect.

The maturity example keeps the same June 1 sale: 10 × $20 = $200 gross. By June 10, 2 units have returned: $40 returned, $160 net, 20%. The July 5 snapshot adds 3 returned units: 2 + 3 = 5, $100 returned, $100 net, 50%. There is still one sale row. A direct join to two return events repeats its $200 gross twice and produces $400. Observation time changed; the original sale and cohort did not. Neither date proves returns are complete.

The summary CSV repeats source filenames and counts, original-sale-month time basis, observed-through date, active filters and grouping on each row. Blank filter fields mean all. It keeps cents while on-screen totals show whole USD.

### Optional extension: refund-month cash flow

A separate student exercise could group returned revenue by refund month and reconcile it to the same raw events. That answers a different time-basis question from this app's sale-cohort net revenue. It is deliberately not implemented as another maintained mode; switching bases without an explicit label would mislead. Costs, omitted returns and final cohort maturity remain unknown.
