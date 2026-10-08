# Kubilay — Codex handoff

Prepared 2026-10-08 for `KubilayUlucay/kubilay-interactive-workshop`.

## What is authoritative

- The authoritative development repository is https://github.com/KubilayUlucay/kubilay-interactive-workshop. Its public `main` branch, source, npm lockfile, project guidance and assets were inspected and downloaded on 2026-10-08 at commit `decae4ac304d7a9107d91bcfe981fb98b561cf19`. Read and write access were verified after the user approved the official Codex connector for this repository only.
- The current workshop Site is https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/. Native Site metadata checked on 2026-10-08 still reports published version 1.
- The seven saved screenshots were rendered from the source of that published version, commit `35c78c727a1daf653d7119645326528f6fb2f1cd`. A GitHub upload may have a different commit SHA; compare source files rather than assuming identical history.
- `website2` is the older material repository. Do not replace the new workshop with that older website.
- Read the existing `portfolio-project-brief.md`, `decisions.md`, `status.md` and `assets.md` alongside this handoff. The brief's planning status has been updated to reflect the working scene and completed baseline review; its design preferences and factual content constraints remain relevant.

## User's goal and working preference

An ambitious, explorable electronics portfolio for recruiters and master's admissions teams. Atlas Motion/Lusion guides visual quality, Bruno Simon guides exploration, and Dennis Snellenberg guides presentation. Relaxed, sincere copy; concrete engineering evidence. The user is on mobile and wants the agent to handle files and implementation. Local installation or learning Blender must not be a prerequisite.

Finish the crank-and-motor scene before adding embedded-controller, BMS, gimbal/chicken or cat scenes. The motor geometry is an illustrative procedural exhibit, not measured project CAD. Do not invent dimensions, motor ratings or performance figures. Preserve access to projects, CV, contact and the older live portfolio.

## Existing implementation to verify

The reviewed source uses npm, Vite, React, Three.js, React Three Fiber, Drei and Framer Motion. Important reviewed files were `src/App.jsx`, `src/MotorScene.jsx`, `src/simulation.js`, and `src/index.css`. Read the actual GitHub files and all applicable `AGENTS.md` instructions before editing. Existing source documents included `docs/portfolio-project-brief.md`, `docs/decisions.md` and `docs/status.md`.

Check the source, package manifest, lockfile and asset paths first. Use `npm ci` with the existing npm lockfile; run the declared build and any relevant declared checks. Start the Vite server on an accessible host and port when browser testing is available. Select a Node version compatible with the actual Vite version. Do not migrate frameworks or add a new package manager as part of this handoff.

## Next implementation pass

1. Improve zero-power readability of the crank, housing and platform. Broaden reflection lighting and tune housing roughness; powered highlights should supplement readable base lighting.
2. Frame the entire motor on mobile in both assembled and exploded states.
3. Give mobile component descriptions their own layout area; remove overlap with the motor and improve small labels.
4. Remove the abrupt desktop canvas/floor boundary through the controls.
5. Improve separation and selection feedback during exploded inspection.
6. Investigate the spotlight-shadow refresh policy: the reviewed source freezes spotlight shadows while moving the crank/rotor. The prior still-capture harness refreshed shadows, so its screenshots do not prove this defect is fixed.

## Agent coordination

One lead owns implementation, visual decisions and integration. The user has explicitly requested agents sharing tasks and reviewing each other's work. Delegate bounded independent review to a visual reviewer, an interaction/mobile reviewer and a technical reviewer when available. Give reviewers actual source and rendered evidence. They should return specific failures and proposed checks; the lead reconciles findings and makes integrated edits. Avoid concurrent edits to the same source files.

## Verification and honest reporting

Capture desktop and mobile idle, powered and fully exploded states, plus a selected component. Baseline sizes were 1440×1000 and 390×844. Also check another narrow mobile width. Verify mouse, keyboard and touch controls, inspection/reassembly, rapid input, reduced motion, component selection and normal animation timing. Confirm fonts, readable text, unclipped objects and no document overflow. A successful build is not proof of visual quality.

The saved baseline screenshots are actual WebGL renders from matching source, **not screenshots of the live URL**. The direct live URL could not be reached by the prior test browser. The harness sought repeatable simulation endpoints and used the source's settled camera. Software rendering does not establish real-device FPS. Document the current test environment and do not claim unavailable browser or hardware checks passed.

`visual-review/` contains all seven baseline PNGs, `checks.json`, the gallery and the historical capture tools in `review-runtime/`. Their workspace and runtime import paths require adaptation; they are not portable, ready-to-run Codex setup scripts.

## Codex Cloud setup

Use a private Codex Cloud environment selecting only the intended workshop repository. Let setup inspect the actual repository, install dependencies and validate the build. Resolve failures before publishing the environment. Then start a coding task using `codex-first-task.md`.

Do not add secrets: the reviewed frontend has no known need for an API key. Keep existing hosting configuration and the public Site intact. Moving source into GitHub/Codex does not authorize changing hosting, access mode, domain or publishing a redesign without the relevant task instructions.

Official setup guide: https://learn.chatgpt.com/docs/environments/cloud-environments

That guide currently lists native computer/browser use as unsupported in Codex Cloud. A terminal-driven browser test needs its own supported installation and verification. If actual 3D renders cannot be inspected in the chosen environment, report that gap and use another authorized review environment; do not replace the evidence with a static fallback image.

## External design tools

Figma is connected in this ChatGPT conversation. No Figma portfolio design has been created here yet. Do not invent a design URL or assume that connection automatically carries into Codex Cloud. Create or connect the required design context deliberately when using it.

Spline's official MCP integration requires the Spline desktop app running locally; it does not run from the browser editor alone. Treat it as an optional later desktop workflow, not a mobile/cloud prerequisite. Blender may be automated in a suitable agent environment if needed, but the user does not need to install or operate it.

Official Spline integration guide: https://docs.spline.design/generate/spline-mcp-server

## Migration verification and remaining setup

- Repository checkout and source inspection succeeded. `npm ci --no-audit --no-fund` and `npm run build` passed on Node.js 24.19.0; the existing large JavaScript chunk warning remains. No frontend secrets are required.
- The handoff, first task, baseline review evidence and additional agent guidance are integrated into this repository. The setup script is `scripts/codex-setup.sh`; run it from the repository root. It installs the locked dependencies and builds the app without deploying it.
- Codex sign-in succeeded and the profile showed the user's Plus account. The user approved the official GitHub App for only `KubilayUlucay/kubilay-interactive-workshop`. GitHub email verification and installation succeeded, and native write access was verified. Public visibility alone had not granted App write access.
- Refresh the Codex repository picker, select this repository, complete setup, review and publish the private environment. Environment publication is tracked in `status.md`.

No application source, assets or hosting configuration was changed, and no website was deployed during this migration. Repository changes contain the handoff, review evidence, development instructions and setup script.
