# Kubilay portfolio visual review

Seven actual browser-rendered 3D captures from the source of published Site version 1. Open portfolio-visual-review.html for the visual findings and image gallery.

## Main findings

- **Lighting and materials:** Make the crank, housing and platform readable at zero power. Use broader reflection lighting and a less mirror-like housing finish.
- **Mobile framing:** Reframe both assembled and exploded states so the complete motor fits. Check the rear housing and the shaft before settling the camera.
- **Mobile information:** Give the component description its own space; increase the small labels people need to read.
- **Desktop canvas boundary:** The scene ends halfway behind the controls. Use a consistent control-dock surface or fade the scene into the page background.
- **Exploded inspection:** Separate the parts more clearly in the camera view and make the selected component easier to identify.

## Scope and limits

Source commit: 35c78c727a1daf653d7119645326528f6fb2f1cd.
Site project ID: appgprj_6ac57bd6b570819183be35695d52cfff.
The current Site source was not changed or republished.

The live URL was unavailable to this hosted test browser. A test-only entry imports the original App, CSS and production simulation, and exposes the existing R3F root. For still captures the production simulation seeks idle, powered and exploded endpoints, and the settled camera is applied. Shadows are refreshed. This does not validate animation timing, moving-shadow behavior, crank picking, orbit gestures or real hardware FPS. The source review found that rotating spotlight shadows are not refreshed during normal crank/rotor movement; still refreshes here do not fix that defect.

Keyboard Space and real emulated touch both set the held state. The production simulation reaches 100% power. Desktop inspection, part tabs, reassembly and mobile inspection controls were exercised. Both viewports had working WebGL2, loaded fonts and no horizontal document overflow. The screenshot filenames and exact snapshot parameters are in checks.json.

## Historical capture tools — adaptation required

The review-runtime folder contains the tools used for this baseline. It intentionally excludes browser binaries, node_modules and the Site checkout. Their original absolute workspace/runtime paths are retained for provenance; these are not ready-to-run Codex scripts. Do not add the review-only entry or endpoint-seeking bridge to the production app.

1. Use this repository's current source and read AGENTS.md and the project documents. Adapt build-review.mjs, qa-entry.jsx and capture.mjs to its paths instead of their historical .sites-checkout. Update source/version metadata and camera assumptions if the implementation changes.
2. Install the Site’s declared dependencies and make its normal production build. Install review-runtime’s dependencies using its package-lock.json. Playwright Core is supplied by the hosted primary runtime at the import path used by the scripts.
3. Run review-runtime/setup-browser.mjs. It unpacks the npm-packaged Chromium and SwiftShader without changing archive ownership. The usual Playwright CDN download failed in this environment.
4. Run review-runtime/build-review.mjs to create the review-only entry. It imports source directly; no product file is edited.
5. Run capture.mjs in two fresh processes, setting REVIEW_ONLY=desktop and then REVIEW_ONLY=mobile. Set REVIEW_CHROMIUM_PATH to the unpacked chromium binary, LD_LIBRARY_PATH to chromium-runtime/al2023/lib and FONTCONFIG_PATH to chromium-runtime/fonts. The scripts currently use the conversation workspace’s absolute path; adapt it to the restored workspace before running.
6. Inspect the actual PNGs. Ensure fonts and text are present and the exploded snapshots record explode=1. Merge the desktop and mobile check records for the final review. Do not present software-renderer timings as hardware performance.

The packaged browser’s font-render-hinting=none, single-process and in-process-gpu flags are needed for reliable glyph painting in this environment. The final capture tool loads the same named font files as FontFace buffers to avoid unavailable font-network requests.

The repository's dependency/build setup is separate: run `bash scripts/codex-setup.sh` from the repository root. Validate the chosen browser/runtime in the new environment before claiming that captures work there. Native computer/browser use is currently unsupported in Codex Cloud; terminal-driven capture must be installed and tested deliberately.

## Files

- screenshots/: seven untouched PNG captures.
- checks.json: verified source identity, viewport, renderer, input and snapshot records.
- portfolio-visual-review.html: gallery with all seven images.
- review-runtime/: capture, review entry/build, browser setup and diagnostic tools, with the npm dependency manifest and lockfile.
