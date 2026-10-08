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

The production build and simulation checks passed during implementation. The actual WebGL render and full animated desktop/mobile inspection still need review on a WebGL-capable browser; the first production milestone is not yet marked finished.

## Hosting

`.openai/hosting.json` records the existing development Site. Copying this source to GitHub does not deploy a change or replace the current live portfolio.

Source snapshot imported from workshop commit `35c78c727a1daf653d7119645326528f6fb2f1cd`.
