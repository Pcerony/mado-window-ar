# MADO / 窗外来客

Procedural Japanese train-window scenery paired with iPhone Safari screen-plane AR. A stylized Godzilla is visible only through the phone camera, behind foreground houses and the window divider.

- [iPhone camera / default home page](https://armado.heisei.space/)
- [Mac screen](https://armado.heisei.space/screen.html?ar)

## Use

1. Open the Mac screen. The phone icon shows a QR code.
2. Scan it with iPhone and open in Safari. Allow camera access.
3. Keep all four black-and-white markers in view. Landscape is recommended, but the portrait reminder can be skipped using its camera button. Avoid screen glare.

The phone interface is entirely Japanese. Portrait orientation shows a nonblocking recommendation; its button starts AR immediately without requiring rotation. The installed-app manifest permits either orientation. The old `ar.html` address redirects to the new home page, preserving query parameters.

Select the coastal route from the Mac route menu, or open [the coast directly](https://armado.heisei.space/screen.html?ar&scene=coast). Both routes also pass naturally between inland and coast as the journey progresses. Godzilla is 1.8 times the original linear size, with framing adjusted to retain the head and tail.

The user's room QR is permanently displayed beside the Mac window, up to 520 CSS pixels wide on large displays. The optical strip now carries window dimensions as well as scenery distance, so the shared QR does not need device-specific pairing parameters. Camera access is HTTPS-only; the custom domain enforces HTTPS and the entry page also upgrades HTTP URLs.

## Encounters

After roughly 8–12 seconds of valid tracking, the coast alternates a Sunflower ferry and a gull; inland encounters show Kyushu National Museum. Each original hand-drawn PNG is rotated 90 degrees counterclockwise at render time. The gull comes close to the window, pauses visibly, then recedes toward Godzilla. Godzilla opens its jaw, consumes the object, turns toward the viewer, and presents a Japanese information bubble. Reading does not time out or queue new popups; close the bubble to resume the interval. Tracking loss pauses the sequence.

Facts are attributed inside the bubble. The supplied Sunflower routes do not call at Fukuoka; the UI states this rather than inventing a port. The illustration is not assigned an unverified vessel name. Likewise, the gull is not identified as a specific species; facts about Fukuoka's black-headed gull are explicitly about a related example.

Camera frames are processed locally and never uploaded. The optical strip synchronizes the scene without a pairing server. This is marker-based screen AR, not room-scale tracking. Rescan the QR after changing the Mac browser window size to refresh divider dimensions.

## Development

```sh
npm test
npm start
```

The local server is at `http://localhost:4178`. Phone camera testing requires the published HTTPS URL. Runtime dependencies are vendored under `dist/vendor`; no CDN or build step is required to serve the app. GitHub Actions tests and publishes `dist` on every push to `main`.

See [AR architecture and verification](docs/iphone-ar.md). `tests/browser-events.js` exercises all three sequences with synthetic camera frames. Physical iPhone testing remains necessary for glare, moire, lens distortion and frame rate.
