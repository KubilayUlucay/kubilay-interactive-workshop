# Kubilay · Interactive Workshop

The new interactive portfolio for Seyit Kubilay Uluçay. This repository contains the complete current React/Vite source, procedural Three.js motor geometry, portfolio assets, and development notes.

Workshop preview: https://kubilay-interactive-workshop.kubiulucay.chatgpt.site

Existing portfolio: https://kubilay-engineering.kubiulucay.chatgpt.site/

Original project material: https://github.com/KubilayUlucay/website2

## Features

- Procedural axial-flux motor exhibit and hand-crank generator.
- Crank interaction, power ramp/coast feedback, and rotor movement.
- Reversible exploded inspection with selectable component descriptions.
- Camera exploration, reset, reduced-motion support, and a WebGL fallback.
- Project photographs and video, About, Projects, and CV panels.

The geometry is an illustrative exhibit informed by the project photographs, not a dimensionally verified CAD reconstruction. See `docs/assets.md` for asset provenance.

## Development

Requires Node.js 20.19+ or 22.12+. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Production output is generated in `dist/`. Dependencies and generated build output are not committed. No environment variables or secrets are required.

## Project notes

- `docs/portfolio-project-brief.md` — project scope and intended milestones.
- `docs/decisions.md` — implementation and design decisions.
- `docs/assets.md` — original assets, procedural geometry, and media processing.
- `docs/status.md` — completed checks and remaining verification.
- `docs/codex-handoff.md` — current migration context, review findings and environment setup.
- `docs/codex-first-task.md` — the first implementation task, including independent agent review.
- `docs/visual-review/` — seven actual WebGL baseline captures, check records, gallery and historical capture tools.

The production build passes. Seven baseline WebGL screenshots and keyboard/touch checks are now available in `docs/visual-review/`; they reveal lighting, mobile framing and layout problems to fix. They were captured from the published source using software rendering, rather than from the live URL. Full animation, picking/orbit and real-device performance checks remain; the first production milestone is not yet finished.

## Continue in Codex

Create a private Codex Cloud environment for this repository after authorizing its GitHub App for this repository. Use `bash scripts/codex-setup.sh` as the setup command, then review the setup results before publishing the environment. This frontend needs no API keys or environment secrets.

Start the implementation with `docs/codex-first-task.md`. The root `AGENTS.md` preserves the design brief, one-lead workflow and bounded independent reviewers. Native computer/browser use is currently unsupported in Codex Cloud; arrange and verify a supported terminal-driven browser when testing actual 3D renders.

## Hosting

`.openai/hosting.json` records the existing development Site. Copying this source to GitHub does not deploy a change or replace the current live portfolio.

Source snapshot imported from workshop commit `35c78c727a1daf653d7119645326528f6fb2f1cd`.
