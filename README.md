# Kubilay · Interactive Workshop

Editable React/Vite/Three.js source for the electronics portfolio.

Live website: https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/

## Current source

This branch imports the application and required public assets of published **Site version 23**, source commit `9dd4b8c31bea5e601a77d81fbc6f8e0fdb6b40c1`, verified on 30 October 2026. The Site source and GitHub have separate histories; that provenance commit need not exist in this GitHub repository.

Four interactive exhibits: Motor, Gimbal, BMS and Zumo. Updated detail pages include Motor, Gimbal, BMS, Zumo, Power Flow/Economic Dispatch and Off-grid PV. Existing accepted interactions and hash navigation are preserved.

The procedural exhibits are explanatory geometry, not measured CAD or validated physical simulations. Keep original media, team credits and the distinction between plans, simulation and physical results.

## Run locally

Use Node.js 20.19+ or 22.12+ (or newer supported versions) and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`bash scripts/codex-setup.sh` performs the locked installation and build. Output is `dist/`. No environment secrets are required. The prebuild checks the four EE401 PDF segments against the original Git blob; preserve all four segments and the lazy PDF loading implementation. The report was repartitioned for the GitHub connector's 16 MiB request limit; its reconstructed bytes and original hash are unchanged.

## Continue with Copilot

Open this branch in VS Code and paste:

> Read AGENTS.md and README.md. Inspect the current workspace and preserve this version 23 application. Use one agent and minimal context. Verify the build, then wait for my next page selection. Do not rebuild the website, upgrade dependencies, push, merge or deploy without my instruction.

No next project page has been selected after PV. Historical `docs/` and review tooling inherited from the old GitHub baseline describe older versions and are not a current task list. New private review logs, browser state and unfinished drafts were excluded from this migration.

The application and required assets retain the version 23 source, with one transfer adaptation: the EE401 report uses four segments rather than two, with matching loader paths and the original integrity hash. GitHub may retain older unused assets and historical documentation. This source upload does not deploy the Site or enable GitHub Pages. `.openai/hosting.json` identifies the existing Site; keep it intact.
