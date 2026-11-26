# Content and asset editing

## Text and links

`src/content/data.ts` is the bilingual content registry: approved quotes, personal details, professional capabilities, selected work, editorial notes, media metadata and official contact destinations. Each text has explicit Spanish and English variants. Do not translate CATORCEVIDAS or user-created documents.

`src/content/ContentApps.tsx` contains short interface copy and the editorial layouts. `src/os/model.ts` defines application titles. `src/accessories/Accessories.tsx` contains translated accessory controls. `src/editor/` contains the creative tools and their interface dictionary.

Owner's latest instruction: Instagram, YouTube, Substack and LinkedIn use the CATORCEVIDAS handle; email is `catorcevidas@yahoo.com`. WhatsApp is deliberately omitted. LinkedIn may require sign-in to view its profile; no messages are sent by the site.

Professional metrics proposed in earlier documents (years, markets, project counts and creator counts) are not published as validated facts. Model experience is described as more than a decade based on the owner-provided 2015 starting year. Founder of Branditamina is owner-confirmed. Do not add unverified outcomes to collaboration descriptions.

## Photos, moving media and posters

Place approved media in `public/media/` and update the corresponding record in `data.ts`. Every item has a stable identifier, title, bilingual description and media kind. Keep the stable identifier when replacing an asset to preserve existing navigation.

- `portrait.jpg`: owner-supplied real portrait.
- `portrait-dither.png`: bitmap interpretation of the same photograph.
- `portfolio.mp4`: supplied Branditamina work montage.
- `branditamina.mp4`: supplied additional Branditamina motion reel.
- `modeling.mp4`: supplied VSCO/process sequence.
- `work/source-media/talking.mp4` (outside the deployable project): source interview/talking sequence, excluded from the public registry because the source has a burned-in personal-name caption. Replace or crop it before republishing; CATORCEVIDAS is the only public identity.
- `catpowa.webp`: owner-supplied Nyx sprite sheet, presented as Catpowa. The seven nonempty idle frames animate; reduced motion uses the first frame.
- `diagram-business.png` and `marketing-structure.png`: extracts of supplied authored diagrams.

Public thumbnails use `*-poster-dither.png`; source JPG posters remain for reprocessing. The owner requested dithering for every static photograph and thumbnail. Videos keep their original supplied visual treatment, as explicitly allowed, and have no invented soundtrack. Preserve source aspect ratio and supply lightweight posters. Use H.264 MP4 for broad compatibility and test playback after replacing any file. Avoid publishing the original 185 MB GIF.

`public/media/manifest.json` records dimensions, sizes and source conversions. Historic Macintosh screenshots, third-party site captures and the branding reference screenshot are not public site assets.

## New work records

Add a record to `collaborations` only after confirming spelling, role, date, link and authorization. A link to the client's site is an external destination; do not create a fictitious detailed case study. Results need a documentary source.

## Garden and Art Machine

Templates and stickers are editable source data in `src/editor/model.ts`. The rendering logic is shared between the preview and exported PNG. Supported export dimensions are declared there; changing a label without changing the dimensions is not sufficient. Fonts are bundled locally, so core editing/export does not depend on a font CDN.

## Privacy

The site does not transmit notes or uploaded editor photographs to a server. Contact actions open the official external destination or the visitor's mail application. The browser's own media/player controls may use platform-native language. External platforms have their own privacy practices.

## Cómo cambiar Internet Finds y los regalos de Notion

En `src/content/data.ts`, busca `internetFinds`. Cada entrada tiene `title` (nombre), `url` (enlace), `tag` (etiqueta en español e inglés) y `text` (descripción en ambos idiomas). Puedes reemplazar una entrada o añadir otra siguiendo ese formato. El cambio aparece en la pestaña **Internet Finds**; no es necesario editar el componente visual. No vuelvas a añadir las referencias de diseño como recomendaciones personales sin autorización.

En el mismo archivo, `resources` contiene los tres regalos de Notion. La propiedad `note` decide en qué Field Note aparecen: `taste` para The Reference Library y `tools` para las bibliotecas de herramientas y prompts. También aparecen en **Mis documentos → Bibliotecas**. Actualiza `url` si cambia el enlace público. La duplicación ocurre en Notion y depende de los permisos publicados allí; el sitio solamente abre la página oficial.

## Archivo visual y Mis documentos

**Archivo visual** contiene trabajo profesional. Brand & Visual Work abre los montajes suministrados. Creative Systems y Marketing Structure explican el servicio y muestran responsabilidades reales de proyectos; no usan posts como casos ni inventan resultados. Trabajo seleccionado muestra los registros verificados de `collaborations`.

**Mis documentos** reúne el archivo personal, posts/diagramas, ideas y bibliotecas. `mediaItems` conserva todos los identificadores: categoría `brand` va a Archivo visual; `personal`, `systems` y `marketing` van a Mis documentos. Para un futuro caso profesional añade evidencia real con categoría `brand` o amplía explícitamente el modelo antes de publicarlo. La navegación anterior/siguiente permanece dentro del archivo profesional o personal correspondiente.

`quotes` conserva citas aprobadas; `scrapbookQuotes` añade el lema del café, invitaciones a crear y las referencias bíblicas solicitadas. El texto de Proverbios en español es el suministrado por la propietaria. Isaías y el texto inglés se identifican como pensamientos/paráfrasis, no como una traducción bíblica formal. Las tarjetas cambian de color sin modificar contenido del visitante.

No publicar nombres personales, apellidos ni sus abreviaturas en títulos, metadatos visibles, pies, texto alternativo o imágenes. La identidad pública es siempre **CATORCEVIDAS**; **14/V** es solamente el monograma.

## Música, terminal y notas

Las 31 pistas proporcionadas están en `public/music/`, codificadas a MP3 128 kb/s sin metadatos privados. `src/extras/tracks.json` define título, artista y ruta. El audio solo se carga al abrir el reproductor y nunca empieza sin interacción.

La terminal ejecuta comandos internos (escribe `help`), no comandos del dispositivo. Colores y volumen se guardan localmente. Las notas se fijan desde el Bloc de notas o Archivo → Nota en el escritorio. Cerrar la nota adhesiva la desfija, conservándola en el Bloc. PNG incluye título, texto, color y monograma. Las notas extensas se reparten en páginas PNG legibles.

Dithering Lab procesa imágenes localmente con Floyd–Steinberg, Atkinson, Bayer o umbral. Exporta el tamaño que indica la vista previa y no amplía una fuente pequeña. Las imágenes originales solo son fuentes de procesamiento; el contenido fotográfico público usa sus derivados con dithering.
