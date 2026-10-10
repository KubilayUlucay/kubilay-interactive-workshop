# Milestone 01 status
## Bulb and cable refinement — 2026-10-09
- Replaces the direct motor power light with a separately wired bulb, glowing filament and short-range warm pool beside the motor.
- Repairs the thin slab’s oversized bevel and reroutes both cable pairs above its surface, including glow/bead clearance.
- Lint, build, simulation and8 genuine-input checks pass; bulb ramp/coast/reset, inspection/reassembly, reduced motion, dialogs and native touch are verified in software. Normal reassembly took about114seconds in that environment; physical-device timing remains unverified.
- Eight final frozen-source desktop/mobile renders passed framing/overflow checks. Independent review and evidence are in `visual-review/lamp-cables-2026-10-09/README.md`.
- Workshop version3 was published for the preceding CAD pass; this pass updates that same approved development workshop. Older portfolio, assets, dependencies, GitHub main and hosting configuration remain unchanged.

## CAD and energy refinement — 2026-10-09
- Solid rotor plates, separate bearing carriers, open coil forms and projecting shaft follow the user CAD reference, with dimensionless illustrative details.
- Strong warm powered lighting, cable travel and cyan perimeter arcs; inspection hides effects and reduced motion preserves steady illumination.
- Eight new actual desktop1440×1000/mobile390×844 renders reviewed independently; source review found no blocking issue. See `visual-review/cad-energy-2026-10-09/README.md`.
- Development workshop version2 was published after explicit user approval; this refinement is prepared for that same workshop. Older portfolio, GitHub main, assets and hosting configuration stay unchanged.
- Lint, production build and simulation checks pass; genuine keyboard, mouse, emulated touch, rapid transitions, inspection/reassembly and reduced-motion checks pass. Narrow360px framing also passes. Software-rendering and real-device limits remain.

## Current refinement — 2026-10-08
- The first Codex implementation pass refines the existing crank-and-motor scene only: zero-power lighting/materials, mobile full-rig camera, separate descriptions, continuous desktop dock, warm selected-part feedback and moving spotlight shadows.
- Mobile uses 44px orbit/reset controls and document flow. Inspection deliberately scrolls; the full mechanism remains visible above the description. Less motion preserves power feedback without continuous mechanical spinning.
- ESLint configuration is restored; lint, deterministic simulation checks and production build pass. The existing large-bundle warning remains.
- One lead reconciled independent visual, interaction/mobile and technical reviews against actual source and local WebGL images. No reviewer changed application source.
- Current render/input evidence and exact limitations are in `visual-review/refinement-2026-10-08/README.md`. The original seven baseline captures remain unchanged. All new renders are software Chromium/SwiftShader, not the live URL or physical-device evidence.
- No new workshop scene, factual engineering claim, original asset or hosting file was added/changed; no deployment occurred.
- The requested refinement is implemented. Normal animation timing and real-device performance still need verification; the exploded cover occludes part of the crank, selected stator tint is pale and some shadow shapes remain angular. Reference-level finish is not established, so do not expand the workshop yet.

## Historical implementation and migration record
The following describes the earlier implementation/baseline, not the latest verification.
## Implemented
- Separate development Site; original website2 repository and current public portfolio are untouched.
- Procedural axial-flux exhibit and separate hand-crank generator, nine wound coils, bearings, rotor plates, enclosure and shaft.
- Studio environment lighting, differentiated materials, bevels and contact shadows.
- Crank drag and hold input, keyboard Space, input power ramp/coast, responsive rotor feedback.
- Reversible exploded inspection, selectable component descriptions and highlight ring; orbit and reset.
- Mouse/pointer capture cancellation, reduced-motion camera/explosion behavior, responsive layouts and rendering at rest on demand.
- Project photos/video, About, Projects, embedded/downloadable repository CV, direct email link.
- Graceful photograph/project fallback where WebGL is unavailable.
## Checked
- Production builds pass.
- Deterministic simulation checks pass: ramp, coast, inspection pause, reduced-motion state, reset, delayed frames.
- Independent technical review performed and material findings addressed.
- Actual browser UI at 1365px and nested viewports 390px/600px: panels, keyboard Escape, CV PDF, no mobile horizontal overflow.
- Original MP4 has damaged AAC packets; a silent VP9 WebM preview was made from the same frames. Actual mobile browser playback verified (readyState 4, paused false, currentTime increasing). Original retained.
## Baseline review and migration — 2026-10-08
- Chromium/Playwright became available for the baseline browser review.
- Seven WebGL2 screenshots from the published source are available in visual-review/: desktop 1440×1000 idle/powered/exploded/shaft-selected and mobile 390×844 idle/powered/exploded.
- Software rendering, loaded fonts, no horizontal document overflow, keyboard Space and emulated touch held-state input were verified. The production simulation reached 100% power and fully exploded/reassembled endpoints.
- The actual captures reveal dark idle materials, clipped mobile geometry, overlapping mobile descriptions, an abrupt desktop scene/control boundary and weak selection feedback. The first milestone remains unfinished.
- The public GitHub checkout at decae4ac304d7a9107d91bcfe981fb98b561cf19 installs with npm ci and builds successfully on Node.js 24.19.0. The existing large-chunk warning remains.
## Still not verified
- The baseline captures used matching published source locally; the live URL was unavailable to that test browser.
- Endpoint-seeking still captures and refreshed shadows do not verify normal animation timing, moving-shadow updates, crank picking, orbit gestures or real-device FPS.
- WebMCP inspection tool execution and the complete animated mobile flow remain unverified.
## Required next step
Follow codex-handoff.md and codex-first-task.md to improve the existing scene. Capture and inspect actual desktop/mobile renders and genuine input flows after changes; report limitations accurately. Finish the motor milestone before adding further scenes. No application source or hosting configuration was changed or deployed during this handoff.

## Latest: heart and flow — 2026-10-09
The bulb is replaced by a readable coral LED heart. Both cable routes carry tapered pulses with shared distance phase; reduced motion holds lighting steady. Independent review accepted desktop/mobile framing and appearance. Phone traces remain subtle, and the winding selection ring crosses the board during inspection. See visual-review/heart-flow-2026-10-09/README.md for current evidence and limits.

Final follow-up verification completed 2026-10-10: eight real keyboard/touch, reduced-motion, coast/reset, dialog and inspection/reassembly checks passed with no page/shader errors. Lint, simulation and production build pass. Software Chromium evidence does not verify physical phones, Safari or device FPS.
