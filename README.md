# Kubilay · Interactive Workshop

Editable React/Vite/Three.js source for the electronics portfolio.

Live website: https://ulucay.me/

Also available at https://www.ulucay.me/ and https://kubilay-interactive-workshop.pages.dev/. The original Site remains available at https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/.

Hosting uses Cloudflare Pages Free with direct uploads of the production build. Domain registration remains with Squarespace; Cloudflare manages DNS, HTTPS and DNSSEC. GitHub pushes do not automatically redeploy this Pages project.

## Isolated redesign comparison

Branch `design/portfolio-identity-2026-10-30` is the redesigned source copy used for the Cloudflare publication. Publishing the build does not commit or push local source changes. The unchanged pre-redesign source is preserved at tag `backup/pre-redesign-2026-10-30` (commit `3abd0e10295693f3d5cfb8d7396648a7a60e794e`).

In the current local workspace, the original runs from `workshop-source` at http://127.0.0.1:4173/ and this copy runs from `workshop-redesign` at http://127.0.0.1:4174/. The folders and installed dependencies are independent. Run this copy with `npm run dev -- --host 127.0.0.1 --port 4174 --strictPort`.

This pass updates the engineer's identity, project hierarchy, evidence order, reading sizes and catalog return state. Original report sources are preserved privately; public report copies are privacy-reviewed. The lockfile and hosting identity remain unchanged. The public CV and portfolio PDFs omit the retired ML project; untouched source documents remain private. The web CV reflects the current project selection.

Public portfolio copy leads with completed work, engineering contributions and methods. Normal page content avoids internal review notes, failure inventories and missing-archive commentary. Simulation, research and report-extract labels remain accurate, and shared work retains team credit. Runtime load/retry messages and simulated protection-state feedback remain functional.

### Motion checkpoint

The current UI baseline is Ink/ice: near-black `#141518`, panel `#1b1f25`, foreground `#f0f3f7` and ice accent `#a2cadc`. Accenture retains its purple glow and 24 continuously looping sparks, an accessible pause/resume control, and reduced-motion support. `npm run verify:ui` checks these accepted features before development startup and production builds. Historical checkpoint descriptions do not authorize reverting later accepted work.

Page content enters with a 220ms fade and 8px settle while the header stays still. Exhibit navigation uses a moving underline from the existing Framer Motion dependency; buttons have short hover/press feedback. Link and navigation arrow indicators are removed throughout the interface. No extra scene is kept alive for an exit animation, and navigation and simulation inputs are not delayed.

Both the site's Less motion setting and the operating-system reduced-motion preference disable this movement. Catalog return scroll remains preserved. Design references: [purposeful UI motion](https://emilkowal.ski/ui/you-dont-need-animations) and [reduced-motion preferences](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

The approved motion studies are now integrated: the About name reveals through a mask with coordinated content entrances, and its work photographs respond to pointer/focus with a small spring-based tilt and lift. There is no reflection or moving shine layer. The existing About shortcuts still open their 3D exhibits.

The four photographed builds in the project catalog share their image into the matching case study and back using a 580ms browser View Transition. The header stays still, return scroll is preserved, and no second 3D scene is kept running. Reduced motion and unsupported browsers use normal navigation. Background treatments remain proposals, not part of this checkpoint.

The combined About view now includes the selected kinetic-word study: BUILD, ADAPT, BALANCE and SCAN respond to project-photo hover or keyboard focus, with a short factual explanation. Owner-clarified captions describe the completed two-month class motor, phone/gyroscope cross-checking and custom BMS hardware for cell sensing and active balancing; SCAN makes no trial-count claim. The redundant project-word selector is removed; All projects is a copper-edged contact-sheet control, inset slightly from the project group's right edge. Four existing build photographs assemble from a fan into a grid on hover or keyboard focus without changing the button size or delaying navigation. Reduced motion shows a static grid. The name reveal and reflection-free image response remain, the four shortcuts still open their exhibits, and reduced motion makes word changes immediate. The unselected story strip and rejected decorative backgrounds are not part of the website.

The earlier animated real-build buttons are preserved in checkpoint `d57eef2f50600116ec56a361a2479656fd622c8b`. The current design combines each exhibit with its technical case study instead of requiring a separate page; those interactive-page buttons are removed. BMS retains its closer camera. The shared UI uses the approved Ink/ice palette; original photographs and physical-model material colors remain unchanged.

Small section labels and project names across the site use the existing DM Sans at semibold weight. Photograph captions and exhibit navigation share this treatment. Code blocks, technical readouts and navigation numbers retain their original fonts; label wording, colours and responsive sizes are unchanged.

Image mats in About, Projects and case-study galleries are transparent. Photographs, diagrams and white paper backgrounds inside the original files are not modified; the layouts retain their uncropped contain or existing cover behaviour.

The About photographs have larger viewports on desktop and taller phone tiles while keeping the full builds visible. The shared image inspector opens in a native modal outside the gallery layout, so thumbnail sizing cannot constrain it. Images initially fit the available space; Zoom in/out, Fit and native scrolling expose detail. Escape and Close restore focus to the originating image, and the page is not scrollable behind the modal. The existing About image links still open their exhibits.

### Controller-powered Motor

The Motor scene uses Arduino Nano boards, matching the original controller photograph and the owner's corrected identification. A potentiometer on the separate perfboard controller supplies the speed command; external radio modules connect the controller to the motor-side Arduino and ESC. The receiver controls the ESC between the generic DC supply and motor; the handheld controller has no motor or supply cables. The 3D potentiometer shares its value with the accessible command slider. Inspection, orbit mode and dialogs disable knob manipulation, and pointer release or loss of focus cancels its drag. Clicking the 3D supply or its front rocker toggles the same power state as the dock Power button. Inspection, orbit mode and dialogs disable the 3D switch; inspection, reset, losing window focus or opening a dialog disconnects the drive. Reduced motion preserves command feedback without continuous rotor movement. The illustration does not assign a radio protocol, supply voltage, measured RPM, torque or efficiency.

The wireless controller occupies its own lower-left foreground area, separate from the motor silhouette and the project introduction. A compact blue Nano model includes its dual pin rows, microcontroller, reset button and Mini-USB connector, while a generous invisible potentiometer target preserves usability. The board faces the viewer with responsive placement and no floating caption; its drag plane follows the board's tilt and scale. The ESC uses a slim heat-shrink sleeve, neutral brushless label, red/black battery pair, three black motor leads and a receiver signal cable. Its visual form references the manufacturer's [Skywalker ESC photographs](https://www.hobbywingdirect.com/products/skywalker-esc); no branding, current rating or exact project ESC model is inferred.

The transparent Motor canvas occupies the shared desktop scene column, with local contact shadows and no decorative frame. Original motor geometry, photographs, video and reports are retained, and the Nano photograph is shown as original controller evidence. The Motor introduction explains its stator, twin rotors and Arduino drive rather than repeating the About identity; its Selected work action is removed. All four exhibits use common desktop grid rows for the 84px header, 58px navigation area, scene, 176px control area, 56px action area and 30px footer. Heading, control and footer anchors remain fixed when changing projects. The selector uses the same responsive content gutter as the headings, including wide-screen centering. Phone headers remain 74px, and tablet/phone headings retain aligned responsive reflow. Inspection still uses its dedicated composition; interaction handlers and simulation logic are unchanged.

Opening Gimbal's educational-code panel lets its control row and page expand in flow, keeping the footer and case study below the code. Closing the panel restores the normal shared-grid anchors.

### Selected lab evidence

PV embeds the complete 11-page source report. EE401 retains four lazy-loaded segments and all 80 pages, with its redacted public bytes verified by SHA-256 during the build and before creating the browser PDF Blob. These core-project reports are unchanged by coursework curation.

The catalog has 11 projects after the owner's removal of circuit analysis and LabVIEW. Electronics retains one selected bench study: multimeter/DC measurements and diode curves. Mechatronics retains four studies: analog/reflectance sensing, an oscillator timing capture, two-board I2C and observed proportional motor-position responses. The public pages label these downloads as selected original report pages, not complete submissions or new tests.

| Study | Original PDF pages retained |
| --- | --- |
| Electronics bench measurements and diodes | 4, 5, 6, 7 |
| Analog inputs and reflectance sensing | 3, 4, 8, 9 |
| Timing circuit and oscilloscope waveform | 4, 5 |
| Arduino I2C link and LED control | 2, 3, 4, 5, 6 |
| Proportional motor-position response | 6, 7 |

Every selected page retains its original text, dimensions and rendered pixels. Figure references use the original PDF page numbers, and each figure is present in its selected-page download. The motor-response image is correctly described as serial-monitor readings, not a waveform plot. The later full-PID extension remains explicitly untested in the source and is not presented as validated control.

Full lab submissions, superseded public variants, excluded figures and the latest pre-curation evidence metadata are preserved outside the application in the workspace's private `.backups/lab-selection-2026-11-03/` archive. The legacy full-report publisher is disabled so it cannot silently restore retired coursework.

### Report privacy

The 3 November 2026 privacy pass checked all 63 public project PDFs, including unlinked report copies and reconstructed segmented documents. Twenty-eight reports required redaction of student identifiers or email addresses. Redaction removes the underlying PDF content, identifying links and metadata, not just its visible appearance. Author/team names, technical text, page counts and page sizes are retained. Every changed report was compared with its original for text equality outside identifiers and rendered-pixel equality outside redaction regions.

After the approved coursework selection, the reviewed public inventory contains 17 PDFs delivered through 20 report assets. Removed public copies remain in private, fingerprinted archives outside the application. The earlier BJT/ML retirement is preserved.

Untouched original bytes and SHA-256 receipts are stored outside the application repository and build output, in the workspace's private `.backups/report-privacy-2026-11-03/` folder. Do not copy this folder into `public`, `dist` or a source upload. The original EE401 Git blob hash remains private provenance; public integrity checks deliberately use the reviewed redacted hash instead.

`src/publicReportPrivacy.json` pins the reviewed report inventory and file/reconstructed SHA-256 hashes. The existing predev/prebuild script rejects changed or unreviewed PDFs and stale viewer metadata. Report editing uses local PyMuPDF utilities; ordinary website builds still require only Node/npm. Selected-page preparation verifies source fingerprints and exact page preservation, and an independent PDFium pass checks public text and decoded PDF metadata. Re-review changed PDFs and refresh the approved fingerprints before publishing. The CV's intended public contact details are outside this report-only pass.

Project stories use short explanation-and-figure sections: each photo, diagram or readout follows the text it supports. PLC sections explain the light sequence, HMI inputs, claw motion and the actual variables visible in its animation table. Power Flow keeps its complete App Designer screenshot without duplicate close-ups. The hardware, PV and wind stories pair their source figures with the corresponding mechanism, design input or result.

The five retained lab studies have concise text-first walkthroughs with descriptive captions, original report-page references, image zoom and direct selected-page downloads. Mechatronics figures show the actual sensor setup, oscillator capture, I2C wiring and proportional-control serial readings. Circuit-analysis and LabVIEW assets, including alternate public copies and the old VI bundle, are archived privately. Confidential internship material stays private, and source credits and simulation labels remain accurate.

### Combined exhibits and technical case studies

Motor, Gimbal, BMS and Zumo each open with their interactive scene and controls, followed by the existing technical case study, photographs, reports, limitations and credits. The interactive desktop composition keeps its current height; scrolling continues into the evidence below. There is one main landmark, one portfolio header and one live canvas per project. Back to interactive returns to the controls without remounting the scene or resetting its settings.

The shared Project details cue uses one constant-size connected line and arrow. It enters a transparent clipping area from above, travels downward and fades while leaving below, then resets invisibly for the next 4.2-second cycle. It does not stretch, retract or reverse visibly. The vertical label stays still, with no repeated text, ticks or second arrow. Its desktop position remains fixed in the clear outer gutter throughout scrolling; there is no docking jump. The cue remains visible while approaching the details, then eases out over 420ms after arrival. On smaller screens, it sits between the interactive area and the case study without covering controls.

Activation focuses the details heading and scrolls without navigating or remounting the scene. Inspection and dialogs hide the cue; the site's motion setting and OS reduced-motion preference stop the animation and make activation scroll instantly. This revision draws on [Codrops' elastic SVG techniques](https://tympanus.net/codrops/2014/12/15/elastic-svg-elements/) and the line/filling-arrow approaches in this [scroll-arrow collection](https://blog.stackfindover.com/html-css-scroll-down-arrow-examples/). The site keeps its own palette, typography and graphics.

Direct routes `#/motor`, `#/gimbal`, `#/bms` and `#/zumo` open at the scene. Existing `#/projects/motor`, `#/projects/gimbal`, `#/projects/bms` and `#/projects/zumo` URLs open the technical section of that same combined page. The catalog always shows its complete grouped project list and retains return scroll. The redundant Find a project search, Area selector and filter-reset controls were removed. Other case-study routes remain available. The default About page and its four exhibit shortcuts are unchanged.

### About-first workshop

The default route now opens an About home with the engineer's identity, current role, contact/CV and four real-image exhibit links. Direct links to `#/motor`, `#/gimbal`, `#/bms` and `#/zumo` remain available. The shared brand and About navigation return home.

Gimbal, BMS and Zumo use a viewport-height desktop composition from 1000px wide and 620px high, keeping scene, readings and controls together above their case studies. Smaller windows and zoomed/mobile layouts retain readable reflow instead of clipping controls. Motor retains its accepted rotor, winding and inspection geometry with the controller-powered arrangement described above. Zumo's detailed evidence and original report/presentation links follow its arena, while firmware remains available from its dock.

Design references: [homepage identity and meaningful content](https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/), [height and text-size accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/height), and [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

### Evidence and usability notes

The BJT characteristics report and tweet-classifier project were retired at the owner's request. Their public PDFs, alternate BJT report, project images, catalog/CV entries and ML page implementation remain removed. The public CV and portfolio PDFs retain their other text and pages but omit their ML sections; untouched originals and removal fingerprints are stored in the workspace's private `.backups/project-curation-2026-11-03/` archive. The later coursework selection removes circuit analysis and LabVIEW while retaining the five hands-on lab studies listed above. The nine core build, work-experience and design-study entries are unchanged.

These changes affect the current source and build only. They do not rewrite Git history or remove copies from previous hosting deployments.

Zumo's firmware dialog returns focus to its opener after Close, Escape or cancel, without changing scroll position. On desktop windows between 620px and 748px high, Motor, Gimbal and BMS preserve a 260px minimum scene area. At 1000x620, the interactive section grows to 748px and its lower controls remain reachable by scrolling; it no longer compresses the scene to 132px. Normal-height desktop, mobile, inspection layouts and the Ink / ice palette retain their existing behavior.

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

`bash scripts/codex-setup.sh` performs the locked installation and build. Output is `dist/`. No environment secrets are required. Predev and prebuild run the approved-UI regression check and verify the reviewed public PDF inventory and SHA-256 fingerprints, including all four EE401 segments. Preserve segmented delivery, integrity verification and lazy loading; do not restore identifying original bytes to public assets.

## Parallel agent workflow

Use this folder as the integration workspace, with one coordinating writer. Other agents may research read-only here, work on unrelated files outside this application, or edit in their own Git worktree. A different chat or branch in the same folder is not isolation.

1. Review and checkpoint the approved working state with the owner's permission. Current uncommitted work is not automatically included in a new worktree.
2. Create one task branch/worktree from that checkpoint and open it in a separate VS Code window. For example, after the checkpoint, `git worktree add ../portfolio-agent-content -b agent/content` creates an isolated content workspace.
3. Give each worker a short task brief: goal, assigned files, preserved features, and required checks. Keep context task-specific instead of copying every conversation into every agent.
4. Return a scoped diff and verification results to the coordinator. Review and integrate one task at a time; run `npm run verify:ui` and `npm run build` before accepting it. Commit, push or deploy only with authorization.

The guidance in AGENTS.md is not a filesystem lock, and the UI guard detects specific regressions rather than preventing arbitrary writes. Already-running agents must be told to follow the workflow. Do not let another writer edit this integration folder concurrently.

## Continue with Copilot

Open this branch in VS Code and paste:

> Read AGENTS.md and README.md. Confirm whether this is the integration workspace or an assigned isolated worktree. Preserve current accepted work and use minimal task-specific context. Do not write to the integration workspace while another coordinator is active. Run the required checks, and do not upgrade dependencies, commit, push, merge or deploy without authorization.

No next project page has been selected after PV. Historical `docs/` and review tooling inherited from the old GitHub baseline describe older versions and are not a current task list. New private review logs, browser state and unfinished drafts were excluded from this migration.

The application and required assets derive from the version 23 source. EE401 uses four segments rather than two, with matching loader paths; the later privacy pass updates public report bytes and their integrity fingerprints while preserving originals privately. GitHub may retain older unused assets and historical documentation. Local redaction does not remove existing copies from Git history or older hosting deployments. This source upload does not deploy the Site or enable GitHub Pages. `.openai/hosting.json` identifies the existing Site; keep it intact.
