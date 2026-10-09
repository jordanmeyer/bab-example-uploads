# Common Goods — Returns lens

Agreed 2026-10-09 in the simulated conversation preserved in PLANNING-CONVERSATION.md. Intended users are classmates inspecting a fictional direct-to-consumer company's monthly sales and returns. The useful decision is whether gross-sales leadership survives returns, by product or channel. There is no claim to forecast final return behavior or profit.

## Scope and data

The app starts with deterministic invented data for January–March 2026: four products, three channels, 144 sales lines and 99 return events, observed through April 28. Users can download both sample CSVs, upload a replacement pair into transient browser memory, filter sale month/product/channel, group by product/channel/pair, compare gross and net ranks, inspect joined rows, and export current summaries or joined rows. Refresh restores samples. No external services, storage, accounts, mapping wizard, taxes, costs or live feeds. No supplied private file is retained in source/evidence.

The managed build uses approved Papa Parse 5.7.0 for CSV quoting and exports, Arquero 8.0.3 for aggregate-before-join, left join, derivation, filter and grouped aggregation, and Apache ECharts 6.1.0 for kept/returned bars and gross/net monthly trends. Vite 8.3.4 packages all runtime assets locally. Plain native controls and tables need no framework. Canonical Campus Designer tokens/theme use unchanged navy/royal with copper and Georgia/Arial system substitutions. No logos or endorsement.

## Contract and model

Sales headers: line_id,sale_date,product,channel,units,unit_price_usd. Return headers: return_id,line_id,return_date,units. Exact columns in any order, UTF-8, quoted commas allowed, strings trimmed, case-sensitive IDs. IDs and labels are 1–100 characters without control characters. Dates are real YYYY-MM-DD dates in 2000–2099. Units are positive integers through 10,000. Price is USD 0–10,000 with at most two decimals, parsed to integer cents by decimal components, never rounded from a float. Each file allows up to 5 MiB and 10,000 rows. Sales requires one row; a header-only returns file is valid.

Sales line IDs and return-event IDs are unique. Every return must match a sales line, not predate its sale, and cumulative returned units cannot exceed sold units. The pair replaces current state only after both parse and all validation succeeds. Error names the file, data row when relevant, and correction. The previous dashboard survives all failures.

Gross cents = sold units × price cents. Returned cents = sum of returned units for that line × its original price cents. Net cents = gross − returned. Arquero aggregates return events before left-joining so repeated partial returns do not multiply sales. Unmatched sales receive zero returned units. All returned revenue is assigned to the original sale month: this is a sales-cohort view, not refund cash flow. “Observed through” is the maximum supplied date, not assurance the return export is complete. Newer sales have less return time. Tax/shipping/discount/fee adjustments are excluded unless already reflected in input price. No profit claim.

Returned-unit rate = returned units / sold units. Returned-revenue share = returned cents / gross cents. Zero denominators display n/a. Rates are shown to one decimal percent; dollar labels have two decimals. Aggregate bounds are at most 10,000 × 10,000 × 1,000,000 cents = 100,000,000,000,000, safely below JavaScript's exact-integer bound. Competition rank = one plus number of groups with strictly larger revenue; ties share first occupied rank. Chart shows largest 12 refund groups, table largest 100, exports all. Joined rows paginate by 20. Filters affect every summary and export.

## Independent expected answers

Mini-case A: January, 10 units at $20; B: February, 5 units at $30. Returns A2+A1 in February/March and B1 in March. Gross = 10×20 + 5×30 = $350. Returns = (2+1)×20 + 1×30 = $90. Net $260. Sold15, returned4, rate26.666…% displayed26.7%. January remains $200−$60=$140 even though returns occur later. B alone is $150−$30=$120. Two sales lines remain after joining three returns. No returns yields $350 net. Three units at $0.10 less one return yields exactly20c. Zero-priced A contributes units but no dollars; B net$120 is the whole net.

## Acceptance

Browser tests import actual app/model.js and show pass/fail visibly. Check normal cases, quoted/BOM/CRLF text, missing/extra/malformed CSV, blank/fractional/negative/exponent inputs, invalid dates, duplicate IDs, unmatched returns, cumulative over-returns, no returns, zero prices, empty filters, ties, exact cents, 10,000-row bound and overlimit rejection. Browser interaction must exercise transactional valid/invalid file imports, filters, reset, pagination and downloads. Imported HTML/formula-looking labels stay text; exports escape spreadsheet formulas.

Inspect desktop1440 and narrow390/320 CSS-pixel frames, keyboard controls/focus and intentional horizontal scrolling only inside tables. Chart data has textual table equivalents and solid navy/copper hover states. Record console/request observation limits honestly. Reinstall using npm ci, verify approved dependencies and notices, build and serve the /bab-example-uploads/ production prefix. Independent review must pass actual committed source before root publication. No unresolved material product decisions remain.
