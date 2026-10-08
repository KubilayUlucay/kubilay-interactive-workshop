# Crank-and-motor refinement — 2026-10-08

The first requested implementation pass improves the existing scene; no new scene
or deployment is included. One lead owns all application edits on
`codex/motor-scene-refinement`, based on checkout `bc22553`. Existing npm/Vite/
React/Three/R3F/Drei dependencies, photographic assets and hosting remain intact.

## What changed

- Readable idle lighting: broad procedural reflection emitters, neutral fill and
  near-white roughness variation replace black, mirror-like graphite. Steel,
  copper, printed support and rubber retain different finishes. The plinth has
  a separate matte material.
- Complete mobile rig framing at 390×844 and 360×844, using actual canvas aspect.
  Tools, component tabs and descriptions sit in separate document-flow rows.
  Orbit/reset targets are 44px. Mobile inspection intentionally scrolls.
- Desktop floor/dock continuity and camera aim keep the full platform above the
  controls. A shorter 1365×768 layout puts tools clear of the description and
  allows the component card to scroll if needed.
- Stronger component selection: marked buttons, named/announced detail, warm
  material on the selected component and a visible fixed halo. Covers separate
  farther along the original illustrative axis.
- Spotlight shadows refresh for crank, rotor and explosion movement, including
  pointer-driven changes between demand frames. A 1024px PCF map softens the key
  shadow. The scene continues to render on demand at rest.
- Less motion stops continuous mechanical spin while keeping power feedback;
  camera/explosion snap and orbit damping is disabled. Repeated I/R keys do not
  repeatedly toggle/reset; inspection, modal, blur, pointer and visibility
  cancellation clear drag/hold feedback. Manual crank drag remains direct input.
- ESLint configuration is restored. Hook cleanup and resource disposal are
  explicit. No package manager, framework or dependency change was made.

## Genuine visual evidence

`before/` contains eight fresh captures of the unchanged checkout before scene
edits: desktop 1440×1000 and mobile 390×844, idle, powered, fully exploded and
shaft selected. The original seven baseline PNGs elsewhere in visual-review are
untouched. `after/` contains the same four states plus 360px mobile and shorter
desktop captures. The self-contained gallery compares the fresh before/after
images, including mobile's deliberately longer inspection page.

Browser: packaged Chromium 153.0.8010.0. WebGL2 renderer: ANGLE Vulkan SwiftShader
Device (Subzero). DM Sans and IBM Plex Mono actually loaded via public font
requests. No static/generated substitute is used.
These are local source renders, **not screenshots of the live hosted URL**.

The review-only entry imports the production app. Genuine UI actions switch its
state; the capture harness then seeks production-simulation endpoints and settles
the source camera. It does not force shadow refreshes. Final records show power
0/100%, explode 0/1, no horizontal document overflow and projected vertex margins
for the mobile and shorter-desktop rig. Visible images, not metadata alone, were
inspected by the lead and independent visual reviewer.

One 360px powered capture had a blank WebGL layer despite passing state metadata.
It was rejected. Browser-frame/GPU capture synchronization was added, and all
four 360px images were recaptured and inspected successfully. This is not evidence
that production's moving scene was blank. Earlier mobile screenshots also timed
out; overlapping SwiftShader processes were stopped and remaining work ran
sequentially. The scripts and reports distinguish these capture failures from
application verification.

The first shorter-desktop powered PNG omitted numeric glyphs. It was replaced
after reloading the exact downloaded font bytes as FontFace buffers and applying
a capture-only DOM compositor layer hint with no visible transform. The lead
and independent visual reviewer confirmed complete 100% text in the replacement.
These are capture accommodations, not production font or layout changes.

## Checks performed

| Check | Result / evidence |
| --- | --- |
| Locked dependency install | npm ci and build pass on Node 24.19.0. |
| Lint | npm run lint passes, including source hook dependencies. |
| Simulation | Ramp, coast, inspection pause/reassembly, reduced feedback without spin, delayed-frame clamp and direct drag checks pass. Independent 1,200 rapid-transition steps stayed finite/bounded. |
| Production build | Passes; existing ~1.19MB JS / ~338KB gzip chunk warning remains. |
| Desktop keyboard/mouse | Native Space powers/release, focused Enter/Space, captured mouse Hold release outside and I autorepeat guard pass independently. Lead additionally verifies actual 3D mouse handle drag/release and shaft picking. |
| Mobile emulated touch | Native CDP Hold/move/cancel, inspection/tab selection, five rapid UI transitions, actual handle drag/cancel, orbit/reset and actual shaft mesh touch picking pass. |
| Inspection/reassembly | Endpoint capture reaches explode 1/0; fresh reduced-motion normal renderer opens/reassembles/reset correctly. Normal-speed timing is not certified. |
| Reduced motion | Initial OS preference, fixed mechanical angles with power feedback, snapped endpoints and actual shaft touch pass. Lead's dynamic Less motion/Motion on button check passes both directions. |
| Panels and assets | About, Projects and CV open; native Escape closes each. Original CV PDF and browser preview WebM return 200 with content. |
| Moving spotlight shadow | Independent native Space instrument at explode=0 observes five changing-angle frames, each drawing 160 shadow calls; a coast frame also redraws. No simulation seeking or shadow override. |
| Layout / screenshots | Lead and independent visual review accept desktop, 390px and 360px idle/powered/exploded/shaft-selected images; shorter desktop is separately inspected. |
| Diff hygiene | git diff --check; original public assets, package lock and hosting files unchanged. |

The raw input records are in `checks/`. `interaction-review.md` preserves the
independent review, including tests its reviewer did not complete; the lead's
additional results are separately recorded. Native input checks do **not** seek,
mutate simulation, pause the normal loop or manually render. A local reproducible script covers the additional desktop checks.

## Independent review reconciliation

- **Visual:** confirmed baseline failures in source and renders. Broad lighting,
  material roughness, complete rig framing, text separation, dock continuity and
  shaft selection were accepted after refinement. Desktop aim was lowered after
  the first plinth/dock overlap; mobile camera was brought closer after an overly
  distant first pass. The blank 360px powered image was caught and replaced.
- **Interaction/mobile:** independently verified native keyboard/mouse and touch
  behavior, actual crank/orbit/shaft picking, rapid actions and fresh OS reduced
  motion. A natural explosion poll timed out at 60 seconds during concurrent
  software rendering. A fixed-delay reduced-motion/autoscroll sequence initially
  read explode=0; a fresh context with actual Scene props and visible canvas
  reached explode=1 and reassembled successfully. Those initial observations
  remain inconclusive and are retained, rather than reported as passes.
- **Technical:** confirmed genuine spotlight shadow draws independent of
  explosion, reduced-motion behavior, bounded simulation and resource lifecycle.
  The suggested Crank visibility cancellation was added. Installed R3F source has
  no intended offscreen suspension; no repeatable missed-invalidation defect was
  established by the follow-up diagnostics.

## Remaining issues and limits

- The exploded front cover partly obscures the crank. The selected stator tint
  lightens the support, and some angular shadows remain. The requested baseline
  failures are repaired; parity with Atlas/Lusion reference finish is unproven.
  This pass used the principles recorded in the brief, not new live animation
  analysis of those reference sites.
- Normal animation settling/timing is not verified reliably by this software
  renderer. Endpoint seeking and a passing build do not prove smooth animation.
  Native input and shadow regeneration passed, but no real-device FPS claim is
  made. Safari/iOS, hardware touch, phone thermal behavior and physical-device
  accessibility/performance remain untested.
- Mobile inspection is 1066–1070px tall at an 844px viewport: users scroll to the
  dock. Idle is 858px tall, so a small footer scroll is also expected.
- The existing production bundle is large; no unrelated bundling overhaul was
  included. WebMCP tool execution and the live hosted URL were not tested here.
- Finish motion/device validation and remaining artistic refinement before
  adding other workshop scenes. No publishing or hosting changes were performed.

## Review delivery

The draft PR contains the source changes, check reports and 24 genuine PNGs.
[Before/after gallery](gallery.md) compares the fresh desktop and mobile captures
and links the additional viewport checks. Public screenshot publication was
explicitly approved. The browser capture/input tools and their instructions
were separately approved for publication and are included under scripts/.
No merge or deployment was performed.
