# MADO / 窗外来客

Procedural Japanese train-window scenery paired with iPhone Safari screen-plane AR. A stylized Godzilla is visible only through the phone camera, behind foreground houses and the window divider.

- [Mac screen](https://pcerony.github.io/mado-window-ar/?ar)
- [iPhone camera](https://pcerony.github.io/mado-window-ar/ar.html)

## Use

1. Open the Mac screen. The phone icon shows a QR code.
2. Scan it with iPhone and open in Safari. Allow camera access.
3. Keep all four black-and-white markers in view. Avoid screen glare.

Camera frames are processed locally and never uploaded. The optical strip synchronizes the scene without a pairing server. This is marker-based screen AR, not room-scale tracking. Rescan the QR after changing the Mac browser window size to refresh divider dimensions.

## Development

```sh
npm test
npm start
```

The local server is at `http://localhost:4178`. Phone camera testing requires the published HTTPS URL. Runtime dependencies are vendored under `dist/vendor`; no CDN or build step is required to serve the app. GitHub Actions tests and publishes `dist` on every push to `main`.

See [AR architecture and verification](docs/iphone-ar.md). Browser tests use synthetic camera frames; physical iPhone testing remains necessary for glare, moire, lens distortion and frame rate.
