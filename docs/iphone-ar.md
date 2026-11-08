# iPhone Screen AR

## Entry Points

- Mac: `/screen.html?ar`, with a permanent room QR beside the window. The phone icon also shows a QR dialog.
- iPhone: `/` (the default home page). `ar.html` remains a compatibility redirect. Tap the camera button and allow camera access. All interface strings are Japanese.
- Portrait displays an optional Japanese landscape recommendation. Its primary button dismisses the reminder and requests the camera immediately. Portrait AR is supported, with the information bubble displayed as a bottom sheet.
- Use the Mac route menu or `/screen.html?ar&scene=coast` for the coastal scene. Coast density, foreground placement and AR masks derive from the same optically synchronized distance.
- Camera access requires HTTPS (localhost is only suitable for desktop development).

## Architecture

js-aruco2 detects marker IDs 12–15 from the ARUCO_MIP_36h12 dictionary. perspective-transform fits the screen plane to the four centers. A 64-bit optical strip encodes distance, glass width/height, a preamble and check byte; the camera samples it using the fitted homography. No clock synchronization, room server, microphone, or uploaded camera frames are needed. Geometry updates automatically even when the room QR carries no pairing parameters.

Three.js renders a custom stylized Godzilla with skeletal group walking, jaw movement and tail motion to an alpha canvas. The camera frame remains untouched. The canvas is projected onto the detected screen plane with a CSS projective matrix. Foreground building, tree, pole and window-divider masks erase the relevant creature pixels.

`encounter.mjs` owns the pause-aware 8–12 second scheduler. Coast alternates ferry/gull; inland selects the museum. Phases are approach, lift, bite, turn, information and return. The gull's approach lasts four seconds to include close observation and receding flight. An information bubble stays readable until dismissed; new encounters never stack. Assets preserve the supplied transparency and are rotated counterclockwise in a small offscreen canvas. Only the next required asset is decoded, reducing peak memory.

`secure-entry.js` upgrades nonlocal HTTP pages before application scripts run. GitHub Pages additionally has HTTPS enforcement enabled for `armado.heisei.space`. The supplied QR decodes to the bare domain without a scheme, so the server redirect is essential. Camera permission is requested before importing the AR renderer. Camera and graphics errors have distinct Japanese messages; constraint fallback does not repeat denied permission prompts.

This is screen-plane AR, not room-scale SLAM: walking around the monitor does not reveal new sides of a virtual 3D world. All four markers are required. The effect hides within 220 ms of marker loss or 350 ms of unreadable sync data. Camera shutdown stops every stream track; backgrounding the page also shuts it down. Reopening requires tapping the camera button.

## Verification

`npm test`: deterministic world, pause/timing, optical frame round-trip, corruption rejection, ordered markers, stale tracking removal.

`tests/browser-scenario.js`: run with Playwright CLI `run-code`. Captures the actual desktop page; supplies that image as a synthetic camera stream; checks 4/4 recognition, optical synchronization, nonempty WebGL creature pixels, no horizontal overflow, lost-tracking removal, and camera stop. This is a synthetic browser integration test, not a physical iPhone test.

Physical iPhone/Safari validation remains required for screen glare, moire, focus distance, exposure, lens distortion and practical frame rate. Start near front-on, with a bright Mac screen and enough distance to see all four markers.

## References

- https://github.com/damianofalcioni/js-aruco2
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- https://github.com/jlouthan/perspective-transform
- https://threejs.org/docs/
- https://travel.willer.co.jp/ferry/carrier/71.html
- https://www.ferry-sunflower.co.jp/lp/newship/kurenai_murasaki/
- https://www.kyuhaku.jp/visit/visit_qanda.html
- https://seibutsutayousei.city.fukuoka.lg.jp/learning/2232/
- https://seibutsutayousei.city.fukuoka.lg.jp/learning/2187/

Vendored libraries include their licenses in `dist/vendor/`.
