# Bulb and surface wiring — 2026-10-09

The user requested a visible load beside the motor rather than directly lighting
its metal face. A procedural glass bulb, wound filament, screw/socket and small
pedestal now provide warm powered feedback. The motor-centred power light and
copper-emission ramp are removed. The bulb has a short-range local light, no new
shadow map and no transmission render pass. It follows the existing power
ramp/coast, stays steady in reduced motion, and switches off during inspection
and modal suspension. Cable electrical effects remain illustrative.

The top slab's bevel radius exceeded half its thickness and produced malformed
surface geometry. Its radius is now0.02 for height0.055. Both generator/motor
wires and the new lamp-feed pair are routed above that repaired surface.
Independent source geometry review, using the installed Drei factory and
10,001 samples per source curve, measured a slab top0.277505; main cable margin
at least0.07635, widest haze0.05235, lamp feed0.05951, and pedestal seating gap
about0.00249. These are dimensionless scene units, not project measurements.

## Actual before/after renders

Before images are the preserved version3 source captures in
`../cad-energy-2026-10-09/after/` (public source873cec97652c5916a0c29c4e7f04e6860883cea7).
New images use final frozen source at desktop1440×1000 and phone390×844, with
Chromium/SwiftShader WebGL2. Both sets seek production simulation endpoints and
settle the source camera. They show appearance, not natural animation timing,
physical-device FPS or the hosted URL. An earlier capture was invalidated by
source hot reload and discarded; only fresh final captures are retained here.

| State | Before | After |
|---|---|---|
| desktop idle | [Before](../cad-energy-2026-10-09/after/desktop-idle.png) | [After](after/desktop-idle.png) |
| desktop powered | [Before](../cad-energy-2026-10-09/after/desktop-powered.png) | [After](after/desktop-powered.png) |
| desktop exploded | [Before](../cad-energy-2026-10-09/after/desktop-exploded.png) | [After](after/desktop-exploded.png) |
| desktop shaft-selected | [Before](../cad-energy-2026-10-09/after/desktop-shaft-selected.png) | [After](after/desktop-shaft-selected.png) |
| mobile-390 idle | [Before](../cad-energy-2026-10-09/after/mobile-390-idle.png) | [After](after/mobile-390-idle.png) |
| mobile-390 powered | [Before](../cad-energy-2026-10-09/after/mobile-390-powered.png) | [After](after/mobile-390-powered.png) |
| mobile-390 exploded | [Before](../cad-energy-2026-10-09/after/mobile-390-exploded.png) | [After](after/mobile-390-exploded.png) |
| mobile-390 shaft-selected | [Before](../cad-energy-2026-10-09/after/mobile-390-shaft-selected.png) | [After](after/mobile-390-shaft-selected.png) |

## Review and limits

One lead owns implementation and publishing; bounded visual, interaction/mobile
and technical reviewers inspect actual source and rendered evidence. Visual
review finds a recognizable bulb, much more restrained motor lighting and
continuous visible wiring; desktop dock and mobile text stay separate. Technical
review finds positive wire/effect clearance, proper pedestal seating, disposed
filament geometry, halo excluded from picking/contact shadows and no powered
motor-emission ramp.

The glass/glow has two visible outline layers rather than a soft bloom; the bulb
is small at phone scale. Exploded motor/crank occlusion and angular shadows remain.
Physical phones, Safari/iOS, hardware animation performance and live-URL browser QA
are unverified. Existing assets, dependencies, hosting configuration, older
portfolio and GitHub main are preserved.

## Final checks

Lint, production build and simulation checks pass; the existing large-bundle warning remains. Adapted `scripts/review-energy.mjs` passed8 genuine-input checks across separate normal/reduced/mobile software-browser processes, with no page errors: bulb/cable ramp, inspection pause across another rendered frame, full natural reassembly, static reduced-motion feedback, actual release/coast dimming, reset baselines, dialog/Escape and native mobile crank/all component controls.

Normal reassembly took about114seconds in this software renderer, near the120second test bound. This is a material environment limitation and does not establish physical-device animation speed/FPS. Native touch and software-state observations are separate from endpoint-seeking screenshots.

Automatic approval review blocked uploading App.jsx to GitHub because its unchanged profile includes personal details. The optional bulb wording clarification was omitted; App.jsx is unchanged from the previous public source. All requested scene changes and factual asset provenance remain in the diff. The screenshots and interactions concern the unchanged main scene text; this omitted lab-panel wording has no scene behavior effect.
