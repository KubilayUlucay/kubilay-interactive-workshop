# CAD and energized feedback review — 2026-10-09

This pass follows the user-supplied CAD image, already present as
`public/projects/motor/motor_3d.jpg`. Solid scalloped rotor plates, separate
bearing carriers, a projecting shaft/collar, rectangular inward magnet blocks
and open trapezoid windings replace the earlier windowed exhibit. Nine coils
follow the photographed stator. Dimensions, magnet block count/color and mounting
details remain illustrative; this is not measured CAD or an electrical simulation.

Powered feedback now includes warm motor illumination, copper emission,
cable beads/trace and three moving cyan perimeter arcs. These follow the existing
power ramp/coast. Inspection hides electrical overlays and freezes their phase;
reduced motion keeps steady illumination without continuous mechanical or effect
movement. Overlays cannot intercept selection or enter contact shadows.

## Genuine before/after images

Before images are the unchanged preceding-refinement captures representing the
version 2 workshop, in `../refinement-2026-10-08/after/`. New after images below
use the revised source with Chromium/SwiftShader WebGL2. Both sets seek the
production simulation's endpoints and settle its source camera; they are not
live-URL captures and do not measure animation timing or device FPS.

| State | Before | After |
|---|---|---|
| desktop idle | [Before](../refinement-2026-10-08/after/desktop-idle.png) | [After](after/desktop-idle.png) |
| desktop powered | [Before](../refinement-2026-10-08/after/desktop-powered.png) | [After](after/desktop-powered.png) |
| desktop exploded | [Before](../refinement-2026-10-08/after/desktop-exploded.png) | [After](after/desktop-exploded.png) |
| desktop shaft-selected | [Before](../refinement-2026-10-08/after/desktop-shaft-selected.png) | [After](after/desktop-shaft-selected.png) |
| mobile-390 idle | [Before](../refinement-2026-10-08/after/mobile-390-idle.png) | [After](after/mobile-390-idle.png) |
| mobile-390 powered | [Before](../refinement-2026-10-08/after/mobile-390-powered.png) | [After](after/mobile-390-powered.png) |
| mobile-390 exploded | [Before](../refinement-2026-10-08/after/mobile-390-exploded.png) | [After](after/mobile-390-exploded.png) |
| mobile-390 shaft-selected | [Before](../refinement-2026-10-08/after/mobile-390-shaft-selected.png) | [After](after/mobile-390-shaft-selected.png) |

## Independent review reconciliation

One lead owns implementation. Independent visual review inspected all eight
new PNGs against the CAD and source: solid stack/carriers, winding apertures,
magnet blocks and strong power feedback are recognizable; desktop dock and
phone text stay clear. Technical review checked geometry disposal, effect-layer
isolation, no picking interception, demand rendering, reset and reduced motion.
No blocking source issue was found. Dialogs intentionally freeze warm lighting
while hiding overlays; the crank may coast as inspection opens.

## Limits and remaining finish

The CAD silhouette is interpreted, with subtler mounting ears; the exploded
front plate still hides part of the crank and left stator. Idle cable visibility
is uneven, the selected stator is pale, and some separated-part shadows remain
angular. Hardware/Safari/iOS performance and live-hosted browser QA are unverified.
Normal input checks are recorded separately from the endpoint images. No original
media, dependency or hosting configuration was changed; no new scene was added.

## Checks and reproducibility

Lint, production build and deterministic simulation checks pass (including phase
bounds/reset and reduced/inspection freeze). The existing Vite large-bundle warning
remains. `scripts/review-energy.mjs` uses actual Space input and native CDP touch,
with a read-only R3F bridge: powered phase/motor advance, a subsequent inspection
frame with both frozen, natural reassembly, reduced static feedback, dialog
suspension/Escape, actual crank touch dragging/cancel and all four part buttons
passed. Records are in `checks/`. An initial packaged single-process browser
closed between contexts; the review script now restarts it between phases and
fresh-process checks passed. This is a test-runtime limitation, not a product
failure or a real-device performance result.

Use the existing isolated browser package and local Vite preview; no application
dependency change is required. Run capture and input scripts sequentially:

```sh
REVIEW_ONLY=desktop node scripts/review-capture.mjs
REVIEW_ONLY=mobile node scripts/review-capture.mjs
REVIEW_ONLY=normal node scripts/review-energy.mjs
REVIEW_ONLY=reduced node scripts/review-energy.mjs
REVIEW_ONLY=mobile node scripts/review-energy.mjs
node scripts/review-inputs.mjs
```

`REVIEW_ORIGIN`, `REVIEW_OUT` and `REVIEW_BROWSER_PACKAGE` override local defaults.
Review-only entry points are excluded from the production build. The requested
Start skill remains unavailable in this environment; repository setup, existing
browser installation and the previously restored lint config were reused.

Genuine mouse checks also passed: motion preference switches, actual crank drag/release, actual shaft picking, rapid inspection/reassembly toggles, panels/Escape and original PDF/WebM availability. The reset button was exercised before native picking. See `checks/mouse-inputs.json`.

A narrower360×844 run also passed all four framing/overflow assertions. The lead visually inspected [powered](after/mobile-360-powered.png) and [exploded](after/mobile-360-exploded.png) phone images; the complete rig, power feedback and separate text layout remain intact. Ten new screenshots are retained here.
