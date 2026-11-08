# iPhone Screen AR

## Entry Points

- Mac: `/`, use the phone icon to enable four markers and show the QR code. `/?ar` enables markers directly.
- iPhone: scan the QR code, open in Safari, tap the camera button and allow camera access. Keep all four markers within the camera image. Camera frames stay on the phone.
- Camera access requires HTTPS (localhost is only suitable for desktop development).

## Architecture

js-aruco2 detects marker IDs 12–15 from the ARUCO_MIP_36h12 dictionary. perspective-transform fits the screen plane to the four centers. A 40-bit optical strip encodes the exact landscape distance plus a preamble and check byte; the camera samples it using the fitted homography. No clock synchronization, room server, microphone, or uploaded camera frames are needed.

Three.js renders a custom stylized Godzilla with skeletal group walking and tail motion to an alpha canvas. The camera frame remains untouched. The canvas is projected onto the detected screen plane with a CSS projective matrix. Foreground building, tree, pole and window-divider masks erase the relevant creature pixels. The QR contains current glass dimensions for divider geometry. If the Mac layout is resized after pairing, rescan the QR for exact divider alignment.

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

Vendored libraries include their licenses in `dist/vendor/`.
