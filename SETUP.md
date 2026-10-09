# Setup

Isolated new app root: /private/tmp/bab-recipe-examples-2026-10-09/uploads. Inspection confirmed this was not inside an existing Git repository. Copied only the managed starter, canonical designer tokens, ECharts adapter/tokens and managed Pages workflow from the installed Browser App Builder package. No prior example implementation/evidence was copied.

Host: macOS. Existing /Users/jordan/.nvm/versions/node/v22.19.0/bin/node, Node22.19.0, npm10.9.3; Git2.50.1 (Apple Git-155). No runtime installation. .npmrc disables lifecycle scripts and saves exact versions. Installed papaparse5.7.0, arquero8.0.3, echarts6.1.0 with npm install --save-exact and --cache /private/tmp/bab-npm-cache. Initial audit:24 packages,0 vulnerabilities. Check-dependencies passed. Canonical package scripts preserved.

Development/testing: npm run test:browser -- --port 9503 (loopback), session50707 initially. App http://127.0.0.1:9503/app/; tests http://127.0.0.1:9503/tests/; desktop/narrow frame page /tests/layout.html. Stop only that server with Ctrl+C and restart the same command if filesystem changes are missed. Chrome was unavailable; the Codex in-app browser worked. Model test page initially showed31/31 passed and application controls rendered. Use a separate background tab, never change shared browser viewport.

Production: npm run build then npm run preview -- --port 9504. App is http://127.0.0.1:9504/bab-example-uploads/. The base/source/workflow are prepared before final evaluation. node_modules and dist are ignored; only dist deploys. Git initialized on main with the approved local identity and named paths staged/inspected before commits. Public author attribution is disclosed in DECISIONS.md.


Live revision uses test port 9713 (session 88193) and production port 9714 (session 17772). Run npm run test:browser -- --port 9713 and npm run preview -- --port 9714. The authored tests/review.html harness is copied into ignored dist/review.html after the production build with the app URL replaced by /bab-example-uploads/. This local review harness is not part of the production build output. Clean install cache: /private/tmp/bab-npm-cache-uploads. Existing Node/npm and package pins are unchanged.
