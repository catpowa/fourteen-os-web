# FOURTEEN OS bitmap library

Original CATORCEVIDAS vector drawings on a 32 × 32 integer grid, made for this project. These are not redistributed Apple assets or icons from a third-party pack.

Use 32, 48 or 64 px dimensions, `shape-rendering: crispEdges`, and `image-rendering: pixelated`. Drawings have a 2 px optical margin where the silhouette permits it. Dark ink is `#0E1D24`, paper is `#F7F2ED`. The desktop selected state can invert the drawing while giving the label a distinct dark background. Every functional icon needs a localized accessible name on its surrounding button.

`manifest.json` lists the icons. `sprite.svg` contains the same drawings as SVG symbols. The React `PixelIcon` component references the sprite; standalone SVGs are available for external use or download.

## Cursors

`cursors.json` declares each URL and its 32px canvas hotspot. Apply only to fine pointers and always include native fallbacks:

- pointer: `(1, 1)`, fallback `default`
- hand: `(10, 2)`, fallback `pointer`
- grab / grabbing: `(15, 15)`, corresponding native fallback
- text: `(15, 16)`, fallback `text`
- resize: `(16, 16)`, fallback `nwse-resize`
- pencil: `(4, 28)`, fallback `crosshair`
- wait: `(15, 15)`, fallback `wait`

Do not use a decorative DOM cursor that hides the OS pointer or requires tracking on touch screens.

## Patterns

The dot, checker, diagonal and grid SVGs are small native repeating tiles, transparent so that every official theme supplies its background color. They use ink at 22% opacity. These patterns are decoration and should never interfere with content contrast.
