# FOURTEEN OS — Verification record

Updated 2026-11-25. This records checks actually performed, not a certification of complete WCAG or cross-browser conformance.

## Automated checks

- TypeScript strict typecheck: passed.
- ESLint: passed, no warnings.
- Unit suite: 31 passed. Covers window bounds, layering and restore behavior; calculator arithmetic and recovery; storage errors; icon asset resolution; four deterministic dithering algorithms; invalid buffers; transparency; image proportions; shape stroke persistence; 14/V lettering without stretching; and format changes without progressive font/stroke shrinking.
- Static Next.js production build: passed on 2026-11-25 from a fresh npm ci in this delivery folder, including the latest copy and cassette icon. 15 pages generated; all 13 application routes verified.

## Browser and exported files

- Dithering Lab: Atkinson selected and an actual 800 × 1200 PNG downloaded; dimensions decoded from the file. Mobile editor rendered at 390 × 844, without document horizontal overflow.
- Note Pad: title and multiline text edited; actual 1080 × 1080 PNG downloaded and visually inspected. Title, body, chosen background and 14/V label present. The same note pinned to the desktop successfully.
- Garden: 14/V sticker resized to 300 × 75 without distorted lettering. Actual 1440 × 1000 PNG downloaded. Original tool symbols and linear arrow visible.
- Art Machine: unfilled ellipse and electric-blue stroke selected. Exports downloaded and decoded at 1080 × 1080, 1080 × 1350, 1080 × 1920 and 1920 × 1080; results in `qa/export-verification.json`. Switching interface language and reloading retained the seven-object test project. A format-cycle typography bug found in that test was fixed and covered by a regression test.
- Music: 31 supplied tracks listed; playback reported readyState 4, unpaused audio, valid duration; Next changed the track; Pause and close worked. No autoplay on opening. Layout also checked at 554 px.
- Terminal: `whoami` returned the approved public identity; `open documents` opened My Documents.
- Content: My Documents showed personal files and posts separately; all five approved Finds and three Notion library URLs are configuration entries. External Notion duplication permissions were not modified or guaranteed.
- Latest requested credit sentence removed in both Spanish and English. Spanish rendered text verified as only “FOURTEEN OS es la casa digital de CATORCEVIDAS.”
- Music launcher changed to an original horizontal bitmap cassette in both standalone SVG and shared sprite.
- Local preview HTTP response: 200 at `http://127.0.0.1:3014/`.

## Preview access

Use `npm ci` and `npm run dev` in this folder for a local preview. See `DEPLOY-VERCEL.md` for GitHub and Vercel instructions. Data is stored per browser and origin; use the same address consistently.

## Remaining external/verification limits

- No public Vercel deployment or GitHub remote has been configured.
- Cross-browser Safari/Firefox runs and a full assistive-technology audit remain outstanding. Browser checks were performed in the Codex in-app browser.
- Static photos and posters use dithering; supplied motion clips retain their original treatment as requested. The talking clip with a burned-in personal name was moved outside the deployable public directory.
