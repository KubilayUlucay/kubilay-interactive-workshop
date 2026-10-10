# Heart display and cable-flow review — 2026-10-09

The user requested a more intentional flow design, visible motor-to-output flow,
and a heart formed from LEDs instead of the bulb. One lead implemented the
application changes; independent visual, technical and interaction reviewers
checked bounded areas against actual source and rendered evidence.

## Genuine comparison images

The before source is testing-branch commit
`940856c1a646ec4bbbb38470fbd5d20dd090f619` (development Site version 4).
Its preserved matching images are in
[the bulb/cable report](../lamp-cables-2026-10-09/).
The eight PNGs in this directory are fresh after renders of desktop 1440×1000
and mobile 390×844: idle, powered, fully exploded, and shaft selected.
They are actual local WebGL renders, not generated images or hosted-URL captures.

| State | Desktop after | Mobile after |
|---|---|---|
| Idle | [image](desktop-idle.png) | [image](mobile-390-idle.png) |
| Powered | [image](desktop-powered.png) | [image](mobile-390-powered.png) |
| Exploded | [image](desktop-exploded.png) | [image](mobile-390-exploded.png) |
| Shaft selected | [image](desktop-shaft-selected.png) | [image](mobile-390-shaft-selected.png) |

## Implementation and reconciled review

A tilted PCB carries 28 evenly spaced instanced LEDs forming a heart. A soft
per-LED glow and short-range coral light respond to the existing power signal.
The motor stays neutral. This is an original dimensionless illustrative indicator,
not photographed hardware, measured current or a calibrated electrical model.

Both physical cable runs now have tapered surface pulses and a faint outer halo.
World-distance phase offsets preserve continuity across the motor connection.
The technical reviewer caught an initially hidden core inside the input cable;
the final core radius is .029, outside the physical .025 cable. Wider .045 halos
still clear the actual platform. No bead particles or motor arcs remain.
Reduced motion uses steady traces/LED illumination. Inspection and modal dialogs
suspend powered feedback. Effects do not add a shadow map or transmission pass;
geometry is shared/instanced and manually disposed where necessary.

The visual reviewer accepted all eight endpoints: the heart is recognizable at
phone size, materials remain readable, the platform and board fit, text stays
clear, and the selected shaft cue remains visible. The downstream cyan pulse is
visible at the connector, but cable flow is subtle in the sampled phone phase.
Stills do not establish smoothness or direction in real time.

A minor existing inspection artifact remains: the winding selection ring draws
through the foreground heart board because the ring disables depth testing.
The exploded cover can still obscure part of the crank. No physical phone,
Safari/iOS, GPU performance or hosted-page browser verification is claimed.

## Verification limits

Capture switches states through UI actions then seeks production-simulation
endpoints and settles the actual source camera. The two capture JSON records
check framing and overflow. All screenshots/input checks use Chromium with
software SwiftShader; timing and FPS cannot be generalized to devices.
Separate genuine input results are recorded below once checks complete.

## Final checks

Lint, production build, deterministic simulation checks and diff whitespace checks
passed. The existing large JavaScript chunk warning remains. Eight genuine input
checks passed: normal Space ramp/rotor/phase, inspection pause, full normal
reassembly; reduced-motion steady feedback, release coast/reset, modal pause and
Escape; native CDP crank touch/cancel, all four part selections and reassembly.
[Normal](inputs/normal.json), [reduced](inputs/reduced.json) and
[mobile](inputs/mobile.json) records contain no page or shader-compilation errors.
Normal checks ran before the interrupted session; remaining reduced/mobile checks
completed on 2026-10-10 after restarting the same unchanged local source.
An initial resumed reduced-check launch found the expired preview server and
failed to connect; the server was restarted before the successful full run.

The earlier pass's mouse/orbit/rapid-transition evidence remains in the bulb/cable
report; this follow-up retests the changed power-output contract and touch controls.
No claim is made that software rendering proves physical-device frame rate or
normal animation timing. No review bridge is included in the production build.
