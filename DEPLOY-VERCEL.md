# Subir FOURTEEN OS a GitHub y Vercel

Este es el proyecto fuente completo: incluye fotografías procesadas, iconos, fuentes, videos, las 31 canciones suministradas y todas las aplicaciones. No necesita claves, variables de entorno ni una base de datos externa.

## 1. GitHub

Sube **el contenido de esta carpeta** a la raíz de un repositorio. No subas el ZIP como un archivo al repositorio. `package.json`, `package-lock.json` y `vercel.json` deben verse al abrir la raíz.

La forma más cómoda para esta carpeta con recursos multimedia es GitHub Desktop: crea un repositorio con estos archivos, confirma los cambios y pulsa **Publish repository**. Puedes mantener el repositorio privado; Vercel puede importarlo con la autorización correspondiente.

La estructura esperada es:

```text
package.json
package-lock.json
next.config.ts
vercel.json
tsconfig.json
next-env.d.ts
eslint.config.mjs
.gitignore
README.md
DEPLOY-VERCEL.md
src/
public/
tests/
docs/
qa/
```

## 2. Vercel

En Vercel: **Add New → Project → Import Git Repository**. Selecciona el repositorio y revisa estos valores:

| Campo | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `./` si subiste el contenido a la raíz |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `out` |
| Node.js Version | 24.x |
| Environment Variables | Ninguna |

`vercel.json` ya fija los comandos, el directorio de salida y los encabezados. Pulsa **Deploy**. Si subiste la carpeta completa dentro de otro repositorio, Root Directory debe apuntar a esa carpeta: la que contiene `package.json`.

## 3. Después del deploy

Abre el dominio que te devuelva Vercel. Comprueba escritorio, `/garden/`, `/lab/`, `/dither/` y `/music/`; descarga un PNG y reproduce una canción. Añade tu dominio desde Project → Settings → Domains cuando quieras.

Los ajustes, notas y proyectos del preview local no se trasladan automáticamente al dominio de Vercel: cada navegador y dirección conserva su propio espacio. Los editores permiten guardar y cargar copias JSON de los proyectos.

## Desarrollo local

```sh
npm ci
npm run dev
```

Abre la dirección Local que aparezca. Para comprobar y compilar:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

El resultado de producción se genera en `out/`. No se incluye `next start`: esta aplicación usa exportación estática y no necesita un servidor Next.js en producción.

## Editar contenido

`docs/CONTENT.md` explica dónde reemplazar textos, fotos, canciones, enlaces y bibliotecas. `src/content/data.ts` es la configuración editorial principal. `src/extras/tracks.json` contiene la playlist.

## Documentación oficial consultada

- [Next.js: exportación estática](https://nextjs.org/docs/app/guides/static-exports)
- [Vercel: Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)

## Comprobación de esta entrega · 25 de noviembre de 2026

Instalación limpia con `npm ci`, compilación, TypeScript, ESLint y 31 pruebas automatizadas: aprobados. Verificadas las 13 rutas exportadas, las referencias a recursos locales y las 31 pistas. La carpeta y el ZIP contienen el mismo código fuente; no incluyen dependencias instaladas ni cachés. El despliegue en tu cuenta de Vercel todavía debes realizarlo con los pasos anteriores.
