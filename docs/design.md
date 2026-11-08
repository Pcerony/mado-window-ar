# Mado / Train Window

Approved direction: hand-painted Japanese train window, full-screen scenery, pause, speed and optional sound.

Canvas 2D renders continuous world-coordinate layers, with deterministic seeded houses, fields, infrastructure and mountains. District density blends between farmland, village and small city. No repeated panoramic image or global wrap. A fixed carriage surround frames the view. Web Audio provides opt-in synthesized rail ambience; pause suspends both movement and audio. Responsive controls have accessible labels. Hidden tabs suspend rendering; frame delta is bounded.

Implementation: test deterministic world and timing; implement generator; render layered scene and carriage; connect controls and audio; verify desktop/mobile with browser screenshots and interaction checks.
