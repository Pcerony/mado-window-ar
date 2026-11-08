# MADO / 窗外来客

Procedural Japanese train-window scenery paired with iPhone Safari screen-plane AR. A stylized Godzilla is visible only through the phone camera, behind foreground houses and the window divider.

- [Mac screen](https://pcerony.github.io/mado-window-ar/?ar)
- [iPhone camera](https://pcerony.github.io/mado-window-ar/ar.html)

## Use

1. Open the Mac screen. The phone icon shows a QR code.
2. Scan it with iPhone and open in Safari. Allow camera access.
3. Hold iPhone in landscape and keep all four black-and-white markers in view. Avoid screen glare.

The phone interface is entirely Japanese. In Safari, portrait orientation shows a rotation prompt; the browser cannot force iPhone to rotate. A landscape orientation preference is also declared for installation as a web app.

Select the coastal route from the Mac route menu, or open [the coast directly](https://pcerony.github.io/mado-window-ar/?ar&scene=coast). Both routes also pass naturally between inland and coast as the journey progresses. Godzilla is 1.8 times the original linear size, with framing adjusted to retain the head and tail.

Camera frames are processed locally and never uploaded. The optical strip synchronizes the scene without a pairing server. This is marker-based screen AR, not room-scale tracking. Rescan the QR after changing the Mac browser window size to refresh divider dimensions.

## Development

```sh
npm test
npm start
```

The local server is at `http://localhost:4178`. Phone camera testing requires the published HTTPS URL. Runtime dependencies are vendored under `dist/vendor`; no CDN or build step is required to serve the app. GitHub Actions tests and publishes `dist` on every push to `main`.

See [AR architecture and verification](docs/iphone-ar.md). Browser tests use synthetic camera frames; physical iPhone testing remains necessary for glare, moire, lens distortion and frame rate.
