# Milestone 01 status
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
- The user subsequently authorized installing Chromium/Playwright in the hosted agent environment. Nothing was installed on the user's computer. The earlier browser-installation blocker is resolved.
- Seven WebGL2 screenshots from the published source are available in visual-review/: desktop 1440×1000 idle/powered/exploded/shaft-selected and mobile 390×844 idle/powered/exploded.
- Software rendering, loaded fonts, no horizontal document overflow, keyboard Space and emulated touch held-state input were verified. The production simulation reached 100% power and fully exploded/reassembled endpoints.
- The actual captures reveal dark idle materials, clipped mobile geometry, overlapping mobile descriptions, an abrupt desktop scene/control boundary and weak selection feedback. The first milestone remains unfinished.
- The public GitHub checkout at decae4ac304d7a9107d91bcfe981fb98b561cf19 installs with npm ci and builds successfully on Node.js 24.19.0. The existing large-chunk warning remains.
- Codex sign-in succeeded with the user's Plus account. The user approved the official GitHub App for only this repository, completed email verification, and installation and native write access were verified. The handoff, baseline evidence and setup script are integrated into the repository. Codex Cloud environment setup is the remaining migration step.
## Still not verified
- The baseline captures used matching published source locally; the live URL was unavailable to that test browser.
- Endpoint-seeking still captures and refreshed shadows do not verify normal animation timing, moving-shadow updates, crank picking, orbit gestures or real-device FPS.
- WebMCP inspection tool execution and the complete animated mobile flow remain unverified.
## Required next step
Follow codex-handoff.md and codex-first-task.md to improve the existing scene. Capture and inspect actual desktop/mobile renders and genuine input flows after changes; report limitations accurately. Finish the motor milestone before adding further scenes. No application source or hosting configuration was changed or deployed during this handoff.
