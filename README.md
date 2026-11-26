# FOURTEEN OS — CATORCEVIDAS

A personal Macintosh-inspired digital environment built with Next.js, React and TypeScript. The interface, bitmap icons, original sounds and composition tools are purpose-built for CATORCEVIDAS. No accounts or remote creative services are required.

## Run locally

Use Node.js 24 LTS (also declared in package.json).

```sh
npm ci
npm run dev
```

Open the Local address printed by Next.js. For a production export:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The deployable static site is generated in `out/`. Serve it over HTTP; opening its HTML directly as a file will not run the app correctly.

## Applications

- Welcome, About Me, Work Stuff and the Finder-style Visual Archive.
- Internet Finds with six bilingual editorial notes and curated references.
- Tool Garden: editable notes, original stickers, layers, colors, resize/move, undo/redo, local persistence and PNG compositions.
- Art Machine: seven templates, text, shapes, uploaded images, layers, four output sizes and real PNG export.
- Calculator, Note Pad with PNG downloads and desktop sticky notes, Clock/Alarm, Scrapbook, Control Panel, Trash, Finder and Help.
- My Documents, Dithering Lab, customizable Terminal, draggable Catpowa and a music player with 31 supplied tracks.
- Native ES/EN interface, five themes, eight wallpaper patterns, optional sound and motion.

## Navigation

Desktop: click an icon to select; double click or keyboard activation to open. Drag title bars to move windows, drag the lower corner to resize, or use arrow keys on the resize handle. Alt + arrow keys move focused desktop icons. Ctrl/Cmd + K opens Finder; F1 opens Help. Menus list open windows. On phones, applications occupy the available screen and one tap opens them.

## Local data

Preferences, desktop layout and Note Pad documents are saved only in the current browser. Garden and Art Machine use IndexedDB. Downloads are ordinary files, and project backups provide an additional portable copy. Browser data is not synchronized between devices; clearing site data removes local documents. Storage errors are shown rather than silently claiming a successful save.

Theme/language changes do not reset creative work. Restoring Control Panel preferences preserves notes and projects. Notes moved to Trash can be restored before permanent deletion. Editor resets require confirmation.

The clock uses the visitor's device time. Its alarm requires the clock window and browser page to stay open. Audio is disabled until explicitly enabled. Network status reflects browser connectivity, not a promise of full offline installation.

## Repository and deployment

The source is ready for a private GitHub repository and Vercel import. `vercel.json` includes the static output and response headers. No environment variables or secrets are needed for the core site.

1. Create a repository and upload this directory, excluding `node_modules`, `.next` and `out`.
2. In Vercel choose **Add New Project**, import that repository, and use the Next.js preset.
3. Build command: `npm run build`. Output: `out`. Install: `npm ci`.
4. Deploy, then test `/`, `/about/`, `/work/`, `/archive/`, `/garden/`, `/lab/`, `/contact/` on the preview domain.
5. Add a custom domain only after the owner chooses it. No domain or social analytics identifier is invented in this project.

This delivery contains no Sites identity, environment secrets, dependencies or local build cache. See DEPLOY-VERCEL.md for the exact upload and import steps.

## Editing and quality evidence

See `docs/CONTENT.md`, `docs/DESIGN-SYSTEM.md`, `docs/REFERENCES.md` and `docs/QA.md`. The sources, optimized media and original icons ship together. Exact dependency versions are locked in `package-lock.json`.
