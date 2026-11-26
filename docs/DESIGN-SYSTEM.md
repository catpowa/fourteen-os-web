# FOURTEEN OS design system

The official Brand Board v2 overrides provisional PRD colors.

| Token | Hex | Purpose |
| --- | --- | --- |
| Electric blue | #0302FF | Focus, selected action, editorial accent |
| Lavender | #D5DEFD | Default desktop and creative surfaces |
| Soft yellow | #FFF7D6 | Notes and small editorial surfaces |
| Warm cream | #F7F2ED | Window paper |
| Deep ink | #0E1D24 | Text, borders, bitmap drawings |
| Cyan | #D5F6FD | Optional creative composition color |
| Mint | #E5FFE6 | Desktop, notes and creative surfaces |
| White | #FFFFFF | Inputs and canvas |

Main typeface: locally bundled IBM Plex Mono regular, medium, semibold and bold. The included font is distributed under its package's open font license; no unprovided Adapter Mono files are used.

Window grammar: compact menubar, opaque rectilinear surfaces, striped active title, left close box, right zoom control, hard offset shadow, visible resize grip, classic scrollbar, persistent focus and viewport constraints. Mobile adapts these controls to a full available-screen application window.

Icon drawing grid: 32 × 32, crisp integer paths, common visual weight, two-pixel optical margin, minimal color. Full icon inventory and cursor hotspots are in `public/icons/`. These are original drawings, not redistributed Apple assets. Eight wallpaper patterns are implemented in `src/styles/globals.css`.

Sounds are original short synthesised tones from `src/os/sound.ts`; there are no external audio recordings or autoplay audio. The browser's reduced-motion preference overrides decorative animation settings. Moving media has explicit playback controls; the companion switches to a still image.

White text is paired with deep ink/electric blue. Body text is dark ink on light paper. Theme changes alter surfaces while keeping readable semantic foregrounds. Custom notes and arbitrary uploaded imagery are creative content; visitors can change their chosen colors in the editor.
