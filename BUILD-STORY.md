# How Common Goods was built

## Opening request

“I'm analyzing sales and returns for a fictional direct-to-consumer company. Every month I get two CSV exports. I want to upload them, join and summarize them, find product/channel patterns, and explain which apparent sales wins disappear after returns. Can we make this a browser tool that my classmates can explore using sample files?”

## Planning

The [recorded simulated planning exchange](PLANNING-CONVERSATION.md) is a developer/coordinator roleplay, not a real student interview. It chose unique sales lines, repeat partial return events, aggregation before joining, assignment back to sale month, transactional replacement and no profit claim. [PLAN.md](PLAN.md) defines the contract, arithmetic, sample rules and independent known answers; [DECISIONS.md](DECISIONS.md) records material choices.

The user-authorized October9revision expands3months to8, adds varied deterministic lines and a product×channel matrix with counts, and gives the main analysis three concise views. Paid social leads gross revenue but loses that lead after returns. Costs are absent, so this remains a revenue lesson.

## Recipes and evidence

Browser App Builder's Plan/Build/Evaluate/Deploy workflow guided the work. Papa Parse reads and writes local CSV, Arquero aggregates and joins, and Apache ECharts draws comparisons. Native HTML supplies forms and accessible tables. Campus Designer guidance supplies unchanged published blues and local licensed EB Garamond/Open Sans. Vite bundles the application; imported files remain transient in the browser.

[EVALUATION.md](EVALUATION.md) retains actual checks, failures and source checkpoints. [REVIEW.md](REVIEW.md) records independent findings and [DEPLOYMENT.md](DEPLOYMENT.md) records live status. No build or classroom result establishes real business value, complete returns coverage, or institutional endorsement.
