# Kubilay — Interactive Electronics Portfolio

## Purpose

Build a memorable, professionally executed interactive portfolio for Seyit Kubilay Uluçay. The audience includes engineering recruiters and master's admissions teams. Visitors should enjoy exploring while also being able to reach real projects, background, CV, and contact information directly.

This brief preserves the design direction and factual constraints. See the current status below and docs/codex-handoff.md for the working implementation and review evidence.

## Established preferences

- Ambitious visual quality and meaningful interaction are central requirements.
- Lusion's Atlas Motion is the strongest visual reference.
- Bruno Simon is the strongest reference for discovery and exploration.
- Dennis Snellenberg is a reference for personal presentation and polish.
- Brittany Chiang's visual direction feels too simple for this project.
- Use relaxed, sincere writing and concrete engineering evidence.
- The user prefers reviewing visual results over managing implementation.
- The user wants the work handled within ChatGPT and does not want to install Blender or other development tools locally. Do not make local software installation a prerequisite.
- The user created a ChatGPT Project named "Kubilay — Interactive Portfolio" and supplied this brief. A separate interactive workshop has since been built, published and imported into the development repository.
- The previous schematic animation demonstrated movement but did not meet the intended visual standard. Do not treat it as the approved design.

## References

- Atlas Motion website: https://atlasmotion.com/
- Lusion's Atlas Motion case study: https://lusion.co/projects/atlas_motion/
- Bruno Simon: https://bruno-simon.com/
- Dennis Snellenberg: https://dennissnellenberg.com/
- Current portfolio, as a source of existing content to inspect: https://kubilay-engineering.kubiulucay.chatgpt.site/
- Authoritative existing material/source repository supplied by the user: https://github.com/KubilayUlucay/website2

Extract visual principles and interaction behaviour rather than copying another person's branding or layout. Inspect live references or user-provided recordings before claiming to have analysed an animation.

## Proposed experience

An explorable electronics workshop connected by energy and control.

1. A hand crank powers a generator and wakes the scene.
2. A choreographed mechanical transition reveals a motor and its internal parts.
3. Electronic components assemble into an embedded-controller scene. Visitors change an input and observe a response.
4. A playful chicken scene may introduce stabilization, then transition into an interactive camera gimbal.
5. Motor, BMS, embedded, and software projects remain accessible for revisiting.
6. A cat can inhabit the workshop as an optional character interaction.

These are concept candidates. The exact camera journey, transformations, and objects must be developed around available project evidence. Keep real project hardware and illustrative models clearly distinguished. Generator-to-controller assembly is a visual transition, not a claim that a generator physically converts into a PCB.

## Proposed visual direction

Sculptural mechanical objects, precise engineering detail, controlled lighting, and playful discoveries. Graphite surfaces and copper accents are a starting proposal, not a locked palette. Prioritize strong composition and readable silhouettes.

## Production approach

Use interactive browser-rendered 3D for objects that respond to visitor input. Handle implementation and asset work in the available hosted environment. Build mechanical geometry procedurally in Three.js or source suitable licensed models. Animate independently movable parts in code. Imported rigs/clips can support character animation. Blender is an optional production tool only if it can be run in the agent environment; the user will not install or operate it.

The existing source uses Vite, React, Three.js, React Three Fiber, Drei, and Framer Motion. Preserve a suitable existing framework and package manager when building from this source. Use Sites for the user-facing preview and hosting if that remains the selected delivery path. Inspect the selected Site source before integrating existing repository material; the older GitHub repository and the current hosted site are separate sources and should not be assumed byte-identical.

Source or model assets with the intended interaction in mind. Mechanical models need independently movable parts. Characters need suitable rigs and clips. Record asset sources, licensing, dimensions, and modifications. Use free or owned assets initially; propose paid assets or commissioned work with concrete examples and costs before any purchase.

## First production milestone

Create a finished-looking crank-and-motor scene before expanding the workshop:

1. Model/source the key parts and create a composed, lit still frame.
2. Compare the render against the visual references and correct specific weaknesses.
3. Animate turning, power feedback, housing separation, and the reveal of internal parts.
4. Make the crank and inspection interaction respond to mouse, keyboard, and touch.
5. Verify the actual browser scene at representative desktop and mobile sizes.

Use a working 3D render to prove the assets, lighting, and composition are achievable. Generated concept images may guide art direction but must not be presented as a working scene.

## Quality criteria

- Geometry reads convincingly in close-up, including edges and visible mechanical detail.
- Metal, copper, and plastic remain distinct under coherent lighting.
- Reflections, contact shadows, and camera framing support the objects.
- Assembly motion has intentional timing and continuity.
- Visitor input produces clear feedback; transitions cannot leave the scene stuck.
- Project information, CV, and contact remain directly accessible.
- Mobile has purposeful framing and touch interactions.
- Provide accessible content and reduced-motion behaviour.
- Assess rendered screenshots, recordings, and interactions. Passing a build or assigning a self-rating does not establish visual quality.

## Collaboration

Keep one lead agent responsible for the canonical website, visual direction, and integration. Specialists can handle bounded reference/asset research and independent visual or technical review when authorized and useful. Multiple project chats do not automatically synchronize every decision or coordinate agents.

Maintain the brief, decisions, asset inventory, and current status with the project source. In a Codex repository, put concise workflow instructions in AGENTS.md and explicitly direct agents to the design brief. For independent implementation tasks outside a Site-owned checkout, use separate branches/worktrees and deliberate integration. Site implementation and publishing remain with the Site-owning lead.

## Existing material verified through GitHub

Repository: KubilayUlucay/website2. Inspected main tree at commit 34c24fac0a10f4a0e100f5bb73177ddc3a9ef80a on 2026-10-07 Istanbul time. Tree listing was not truncated.

- Motor: public/projects/motor/ contains motor_3d.jpg, motoric.jfif, motor-inside-wiring.jpeg, overall-motor.jpeg, receiver/transmitter photographs, and motor-video.mp4.
- BMS: public/projects/bms/ contains front/back PCB images, pcb.png, schematic.png, balancing.png, simulink.png, and SeniorYearProject1.pdf / SeniorYearProject2.pdf.
- Gimbal: public/projects/gimbal/ contains cad-design.png, physical-build and wiring photographs, phone-data.jpeg, and Gimbal_slide.pptx.
- Other material: Zumo robot images/report/code, PLC material, wind-farm analysis, machine-learning material, and deforestation research.
- Documents: public/documents/CV_DUZ.pdf and public/documents/portfolio.pdf. These are existing documents; do not assume they reflect the user's latest employment details.
- Website source: src/App.jsx includes project descriptions and asset references. Fetch the original reports when verifying technical details; generated portfolio copy is not sufficient evidence for every claim.
- No .glb, .gltf, .blend, .fbx, .obj, .stl, .step, or .stp files appear in the inspected tree. A rendered CAD image does not provide editable model geometry.

These findings establish file availability and the existing source stack. The binary images/video/reports have not yet been downloaded or visually/content inspected during this planning stage. The next build agent should inspect the motor images/video before modelling the first scene.

## Optional further user inputs

No additional user material is required to start. The repository is the available material source. Reference screen recordings, budget preference, and device feedback can help later. Work from the existing assets without repeatedly asking the user for CAD files or photographs they do not have.

The user does not need to write code or learn Blender. Asset budget, final colour palette, mobile target devices, and exact workshop layout remain open choices.

## Current status

Updated 2026-10-08: a working procedural crank-and-motor scene is published at https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/ and imported into https://github.com/KubilayUlucay/kubilay-interactive-workshop. Real project media have been inspected and reused; docs/assets.md records their provenance. The earlier movement study remains a discarded concept rather than an approved design.

Seven actual WebGL captures from the published source are saved in docs/visual-review/. They show that readability at zero power, mobile framing, text placement, the desktop canvas boundary and selected-part feedback need refinement. The baseline used software rendering and repeatable simulation endpoints, so full motion, picking/orbit and real-device performance remain unverified. The motor scene is promising but does not yet meet the first milestone's finish criteria.

Next: continue the existing scene in Codex using docs/codex-handoff.md and docs/codex-first-task.md. One lead implements and integrates, with bounded independent visual, interaction/mobile and technical reviewers. Improve and inspect the working scene before expanding the workshop. The user is on mobile; no local software installation or manual file transfer is required.

Codex refinement update, 2026-10-08: the requested lighting/materials, mobile
framing/text, desktop dock, component selection and moving-shadow changes are
implemented and reviewed locally. See docs/visual-review/refinement-2026-10-08/
for the new actual WebGL evidence. The current hosted sites and original assets
remain unchanged. Normal animation timing, physical-device performance and parity
with the visual references remain unproven; further artistic refinement is still
appropriate before expanding the workshop.
