# Kubilay · Interactive Workshop

Editable React/Vite/Three.js source for the electronics portfolio.

Live website: https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/

## Isolated redesign comparison

Branch `design/portfolio-identity-2026-10-30` is a separate design copy, not a production deployment. The unchanged pre-redesign source is preserved at tag `backup/pre-redesign-2026-10-30` (commit `3abd0e10295693f3d5cfb8d7396648a7a60e794e`).

In the current local workspace, the original runs from `workshop-source` at http://127.0.0.1:4173/ and this copy runs from `workshop-redesign` at http://127.0.0.1:4174/. The folders and installed dependencies are independent. Run this copy with `npm run dev -- --host 127.0.0.1 --port 4174 --strictPort`.

This pass updates the engineer's identity, project hierarchy, evidence order, reading sizes and catalog return state. The original reports, lockfile and hosting identity remain unchanged. The downloadable CV remains the original PDF; the web CV corrects project terminology and research scope.

### Motion checkpoint

Page content enters with a 220ms fade and 8px settle while the header stays still. Exhibit navigation uses a moving underline from the existing Framer Motion dependency; project arrows and buttons have short hover/press feedback. No extra scene is kept alive for an exit animation, and navigation, search and simulation inputs are not delayed.

Both the site's Less motion setting and the operating-system reduced-motion preference disable this movement. Catalog filters and return scroll remain preserved. Design references: [purposeful UI motion](https://emilkowal.ski/ui/you-dont-need-animations) and [reduced-motion preferences](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

The approved motion studies are now integrated: the About name reveals through a mask with coordinated content entrances, and its work photographs respond to pointer/focus with a small spring-based tilt and lift. There is no reflection or moving shine layer. The existing About shortcuts still open their 3D exhibits.

The four photographed builds in the project catalog share their image into the matching case study and back using a 580ms browser View Transition. The header stays still, filters and return scroll are preserved, and no second 3D scene is kept running. Reduced motion and unsupported browsers use normal navigation. Background treatments remain proposals, not part of this checkpoint.

The combined About view now includes the selected kinetic-word study: BUILD, ADAPT, BALANCE and SCAN respond to project hover, keyboard focus or the selection buttons, with a short factual explanation. The name reveal and reflection-free image response remain, the four shortcuts still open their exhibits, and reduced motion makes word changes immediate. The unselected story strip and rejected decorative backgrounds are not part of the website.

The four See the real build buttons now carry the approved custom motor, gimbal, cell and Zumo icons to the right of the unchanged label. Hover and keyboard focus preview their mechanisms in fixed-size slots. Clicking plays a one-second sequence before opening the existing technical case study; the cell charges before jumping, and Zumo departs outward from the label. Reduced motion navigates immediately, and leaving an exhibit cancels its pending navigation. Original evidence remains unchanged; the later Motor controller feedback is described below.

The matching Open Motor/Gimbal/BMS/Zumo exhibit buttons on the technical case studies now reuse those icons and the same one-second gesture, with immediate navigation for reduced motion. BMS uses a closer camera for a larger hardware view; its geometry and simulation remain unchanged. Shared charcoal page and panel colours are one shade lighter, with Motor's fog and lower fade matched to the page. Copper/sage accents and the original photographs retain their colours.

Small section labels and project names across the site use the existing DM Sans at semibold weight. The About project selector, photograph captions and exhibit navigation share this treatment. Code blocks, technical readouts and navigation numbers retain their original fonts; label wording, colours and responsive sizes are unchanged.

Image mats in About, Projects and case-study galleries are transparent. Photographs, diagrams and white paper backgrounds inside the original files are not modified; the layouts retain their uncropped contain or existing cover behaviour.

The About photographs have larger viewports on desktop and taller phone tiles while keeping the full builds visible. The shared image inspector opens in a native modal outside the gallery layout, so thumbnail sizing cannot constrain it. Images initially fit the available space; Zoom in/out, Fit and native scrolling expose detail. Escape and Close restore focus to the originating image, and the page is not scrollable behind the modal. The existing About image links still open their exhibits.

### Controller-powered Motor

The Motor scene follows the owner's clarified topology: a potentiometer and ESP32 on a separate copper-board controller send the command wirelessly to a second ESP32 on the motor side. The receiver controls the ESC between the generic DC supply and motor; the handheld controller has no external power or motor cables. The 3D potentiometer can be turned directly and shares its value with the accessible command slider. Inspection, orbit mode and dialogs disable knob manipulation, and pointer release or loss of focus cancels its drag. Clicking the 3D supply or its front rocker toggles the same power state as the retained dock Power button. Inspection, orbit mode and dialogs disable the 3D switch; inspection, reset, losing window focus or opening a dialog disconnects the drive. Reduced motion preserves command feedback without continuous rotor movement. No RF protocol, supply voltage, measured RPM, torque or efficiency is inferred.

The wireless controller occupies its own lower-left foreground area, separate from the motor silhouette and the bio text. A more compact visible board keeps the motor primary while a generous invisible potentiometer target preserves usability. The board faces the viewer with responsive placement and no floating caption; its drag plane follows the board's tilt and scale. The ESC uses a slim heat-shrink sleeve, neutral brushless label, red/black battery pair, three black phase leads and a separate receiver signal cable. Its visual form references the manufacturer's [Skywalker ESC photographs](https://www.hobbywingdirect.com/products/skywalker-esc); no branding, current rating or exact project ESC model is inferred.

The transparent canvas spans the full Motor page, with only local contact shadows below the hardware. The opaque floor and dock shadow were removed so the scene meets the shared page background without rectangular boundaries. Original motor geometry, photographs, video and reports are retained; the existing Nano photograph is labelled as archived material, not documentation of the ESP32 controller. The other exhibits' simulation logic is unchanged.

### About-first and single-view workshop

The default route now opens an About home with the engineer's identity, current role, contact/CV and four real-image exhibit links. Direct links to `#/motor`, `#/gimbal`, `#/bms` and `#/zumo` remain available. The shared brand and About navigation return home.

Gimbal, BMS and Zumo use a viewport-height desktop composition from 1000px wide and 620px high, keeping scene, readings and controls together. Smaller windows and zoomed/mobile layouts retain readable reflow instead of clipping controls. Motor retains its accepted rotor, winding and inspection geometry with the controller-powered arrangement described above. Each exhibit's See the real build action navigates to its existing project page; Zumo's detailed evidence and original report/presentation links live there, while firmware remains available from its dock.

Design references: [homepage identity and meaningful content](https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/), [height and text-size accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/height), and [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Current source

This branch imports the application and required public assets of published **Site version 23**, source commit `9dd4b8c31bea5e601a77d81fbc6f8e0fdb6b40c1`, verified on 30 October 2026. The Site source and GitHub have separate histories; that provenance commit need not exist in this GitHub repository.

Four interactive exhibits: Motor, Gimbal, BMS and Zumo. Updated detail pages include Motor, Gimbal, BMS, Zumo, Power Flow/Economic Dispatch and Off-grid PV. Existing accepted interactions and hash navigation are preserved.

The procedural exhibits are explanatory geometry, not measured CAD or validated physical simulations. Keep original media, team credits and the distinction between plans, simulation and physical results.

## Run locally

Use Node.js 20.19+ or 22.12+ (or newer supported versions) and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`bash scripts/codex-setup.sh` performs the locked installation and build. Output is `dist/`. No environment secrets are required. The prebuild checks the four EE401 PDF segments against the original Git blob; preserve all four segments and the lazy PDF loading implementation. The report was repartitioned for the GitHub connector's 16 MiB request limit; its reconstructed bytes and original hash are unchanged.

## Continue with Copilot

Open this branch in VS Code and paste:

> Read AGENTS.md and README.md. Inspect the current workspace and preserve this version 23 application. Use one agent and minimal context. Verify the build, then wait for my next page selection. Do not rebuild the website, upgrade dependencies, push, merge or deploy without my instruction.

No next project page has been selected after PV. Historical `docs/` and review tooling inherited from the old GitHub baseline describe older versions and are not a current task list. New private review logs, browser state and unfinished drafts were excluded from this migration.

The application and required assets retain the version 23 source, with one transfer adaptation: the EE401 report uses four segments rather than two, with matching loader paths and the original integrity hash. GitHub may retain older unused assets and historical documentation. This source upload does not deploy the Site or enable GitHub Pages. `.openai/hosting.json` identifies the existing Site; keep it intact.
