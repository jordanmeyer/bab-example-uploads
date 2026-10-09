# Common Goods · Returns lens

A browser-only sales/returns dashboard for a fictional direct-to-consumer business. Download the two synthetic samples or select local sales and returns CSVs, validate them together, then filter by sale month, product and channel. Compare gross/net revenue, returned-unit rates and ranking changes; inspect or download the joined sales rows.

Source: https://github.com/jordanmeyer/bab-example-uploads

Intended Pages URL: https://jordanmeyer.github.io/bab-example-uploads/ (publication status is in DEPLOYMENT.md).

## Run and verify

Use Node22.19.0/npm10.9.3. Run npm ci (a writable temporary cache can be specified), npm run test:browser -- --port 9503, then open http://127.0.0.1:9503/tests/. Application development is at /app/. npm run build generates notices and production dist; npm run preview -- --port 9504 serves http://127.0.0.1:9504/bab-example-uploads/. npm run dev is also available. Tests import the same model as the application. tests/layout.html provides fixed1440/390/320 frames of the production9504 preview for shared-browser verification. Run both servers when inspecting frames.

## Interpretation

This is a sales-cohort view: every return follows the month of its original sale, including later returns. Refund = returned units × original unit price; net = gross − returned. Exact integer cents are used. Returns are aggregated before joining, preventing repeated partial returns from multiplying sales. A header-only returns CSV means no returns. Files replace dashboard state only when both pass. Files remain in memory, are never uploaded or stored, and refresh restores samples. The file contract is visible in the application and specified in PLAN.md.

“Observed through” is only the latest supplied date. Newer cohorts may still receive returns; missing export records cannot be detected. No profit, tax, shipping, standalone refund cash flow or cost model. Prices must already reflect any relevant merchandise discount. Chart shows the top12 refund groups; table top100; exports all current groups. Joined rows paginate20. Money exports have two decimals; formula-prefixed strings are protected for spreadsheets.

## Provenance and design

Every sample row is deterministically generated in app/sample.js, invented for classroom analysis. There are no real students, customers, results, endorsements or private data. PLANNING-CONVERSATION.md explicitly identifies the role-play. Public Git attribution is Jordan Meyer <jordanmeyer@protonmail.com>, as authorized.

Libraries: Papa Parse5.7.0 (MIT) handles CSV; Arquero8.0.3 (BSD-3-Clause) performs substantive aggregate/join/filter/group transformations; Apache ECharts6.1.0 (Apache-2.0) plots revenue. Vite8.3.4 is the managed build. Exact dependencies and lockfile are retained. The build collects distribution licenses/notices into app/public/THIRD-PARTY-NOTICES.txt, linked from the website. No external runtime assets, remote APIs, analytics or fonts.

Campus Designer's unchanged Duke navy/royal tokens and supporting copper guide the visual design. Georgia replaces EB Garamond; Arial/Helvetica replace Open Sans via local system fonts. No font binaries, institutional marks, affiliation or endorsement. Keyboard controls and tables complement charts; evaluation records the actual rendered checks rather than claiming complete accessibility certification.
