# Motor scene review tools

These tools review repository source locally and do not deploy or change hosting.
The production build contains no review bridge. Install the locked application
dependencies with scripts/codex-setup.sh. Browser dependencies are isolated from
the app: Playwright Core 1.58.2 and packaged Chromium 153.

## Repeatable visual capture

With Vite running on port 5173:

```sh
REVIEW_ONLY=desktop REVIEW_OUT=work/captures node scripts/review-capture.mjs
REVIEW_ONLY=mobile REVIEW_OUT=work/captures node scripts/review-capture.mjs
REVIEW_ONLY=mobile REVIEW_WIDTH=360 REVIEW_OUT=work/captures node scripts/review-capture.mjs
```

Run browser processes sequentially. `REVIEW_BROWSER_PACKAGE` can select another
installed isolated browser package.json; `REVIEW_ORIGIN` can select a different
local port. The default browser package is `/workspace/workshop-browser/package.json`.
The public font requests are fulfilled with curl; TLS verification remains enabled. The current harness reloads the exact
downloaded font bytes as FontFace buffers and gives the numeric DOM label an
invisible compositor layer hint to avoid intermittent software capture glyph
omission. These do not change production source or font assets.
`REVIEW_CAPTURE_ONLY=powered` can restrict a repeat capture to a single state.

`review.html` imports the actual app through `review-entry.jsx`. That entry only
exposes the existing R3F roots and production simulation. UI actions switch states;
the capture tool then seeks repeatable simulation endpoints and settles the actual
source camera. It does not force a shadow refresh. The source schedules moving
shadows during rendering. PNGs are captured with CDP without changing viewport
height, avoiding a mobile `svh` relayout during full-document screenshots.

Checks record browser/renderer, loaded font families, source camera, power/explosion
state, layout rectangles and projected exhibit vertices. Assertions check geometry
margins, separation from the dock, explosion endpoints, overflow and page errors.
These stills establish appearance and endpoint framing, not real animation timing
or device FPS. Native input tests must stay separate and must not seek simulation.

## Source checks

```sh
npm run lint
node scripts/simulation-checks.mjs
npm run dev -- --host 0.0.0.0
# In another terminal, with no capture browser running:
node scripts/review-inputs.mjs
npm run build
git diff --check
```

ESLint now covers application hooks and ordinary JavaScript, while excluding build
output, scratch work and the historical nonportable review-runtime archive.

## Evidence

See `docs/visual-review/refinement-2026-10-08/` for this pass's before/after PNGs,
capture records, independent-review reconciliation and native-input results.
The original seven baseline PNGs remain unchanged. All browser evidence uses
Chromium/SwiftShader, not the live hosted URL or a physical phone.

`review-inputs.mjs` adds genuine desktop mouse picking/drag, dynamic motion-button
changes, inspection/shaft picking, rapid transitions, native dialog Escape and
asset availability. It uses a reduced-motion context to bound rendering work and
reads source state only. It does not replace the separate independent native-touch
and normal moving-shadow checks saved with the evidence. Short desktop captures
can use `REVIEW_ONLY=desktop REVIEW_WIDTH=1365 REVIEW_HEIGHT=768` and a separate
`REVIEW_OUT` directory.

## Managed review setup

The supplied `/workspace/workshop-install-with-capture.sh` installer recreates
`/workspace/workshop-browser/smoke.mjs` and `capture-idle.mjs`. Run the installer
before extending capture. The tracked review scripts extend those generated
tools without changing them, so rerunning installation preserves the extension.
The requested environment Start skill was unavailable; the supplied installer
and repository setup script were used. No user-device setup is required.

## Heart and both flow routes

`review-energy.mjs` checks the current instanced LED heart and both shader cable
routes through genuine input; it reads state without seeking simulation. Run
`REVIEW_ONLY=normal`, `reduced`, and `mobile` separately with distinct `REVIEW_OUT`
directories while the local server runs. Browser processes must be sequential.
It verifies shared phase/distance offsets, shader compilation, coast/reset,
inspection/reassembly, modal pause and native CDP touch. Results and new images
are in `docs/visual-review/heart-flow-2026-10-09/`.
