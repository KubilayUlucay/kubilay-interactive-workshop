# Independent interaction/mobile review

Read-only review of the migrated brief, handoff, baseline, actual App/MotorScene/simulation source, desktop after images, and normal working app. Browser: packaged Chromium 153.0.8010.0, software ANGLE/SwiftShader. Browser interaction tests used real Playwright keyboard/mouse and Chromium CDP emulated touch. Simulation and R3F state were read through React Fiber/test-entry roots only; the reviewer did not seek or mutate simulation, pause the demand loop, or edit application source.

## Verified

- Desktop Space started the hold, production power rose to 0.568, keyup released it. Focused Hold supported Enter and Space start/release. Mouse hold captured release outside the button. Repeated KeyI down kept inspection open.
- At 390×844: native touch Hold started, remained held when moved outside, and touchCancel released. Native touch inspection, shaft tab selection, and five rapid inspection transitions ended reassembled.
- Actual 3D handle touch picking/drag/cancel passed: projected handle at (112.32,449.33), dragging true, crankAngle changed from −0.72 to −1.193, dragImpulse 2.977, power 0.374. Pointer cancellation cleared dragging.
- Actual native touch orbit gesture moved the camera from [5.721,3.799,10.387] to [−1.992,5.500,11.462]. Reset restored Orbit camera aria-pressed=false.
- Fresh context initialized with prefers-reduced-motion=reduce and explicit scrollTo(0,0) reached inspection explode=1. Root diagnostics: frameloop=demand, frames=0; actual Scene props inspection=true, reduced=true, suspended=false. Native touch at projected shaft mesh (131.05,372.20) selected Output shaft. Reassembly reached explode=0 and reset inspect=false.
- Initial 390×844 layout had scrollWidth=390 and document height=858, scene (x0,y277.31,w390,h337.59); no horizontal document overflow.
- Desktop after idle/exploded images show a readable generator handle, complete rotor/housing framing, clear winding selection feedback, and description outside geometry. Dock boundary is substantially improved.

## Limits and inconclusive observations

- Initial normal explosion exact endpoint did not arrive within a 60-second poll while another software-rendered capture ran. Subsequent browser commands stalled. This does not establish normal animation timing or a particular application defect; normal settling remains unverified by this reviewer.
- A later dynamic prefers-reduced-motion change after rapid, scrolled native touches produced explode=0 after a fixed delay and missing inspection DOM on the subsequent layout check. These observations are retained in bounded-checks.json. Fresh initial OS-preference and visible-scene reduced-motion tests passed; the previous observations do not establish a demand-loop defect.
- Screenshots from the normal moving browser stalled even using CDP. The lead's endpoint-capture evidence must be evaluated separately. This reviewer makes no hardware FPS, real-device, live-hosting, or moving-shadow visual claim.
- Modal Escape, dynamic Less motion button, desktop actual 3D handle drag, native normal full reassembly timing, and 360-width visual/text measurements were not completed by this reviewer. Source review and emulated mobile interaction are not real-device testing.

## Files

- initial-partial-checks.json: first desktop input passes plus original natural endpoint timeout.
- bounded-checks.json: native touch hold/selection/rapid transition passes and inconclusive reduced/layout failures.
- reduced-checks.json: final successful fresh reduced-motion diagnostics, actual shaft mesh native touch, and reassembly/reset.
- inputs.mjs, bounded.mjs, gestures.mjs, reduced.mjs: review-only local tools. The gesture and reduced scripts share a checkpoint-path artifact; use this report for the two genuine handle/orbit results, which were printed by the gestures process and are copied here faithfully.

Browser-free at handoff. No application edits, hosting changes, or deployment.
