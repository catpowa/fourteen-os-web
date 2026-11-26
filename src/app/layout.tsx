import type { Metadata } from 'next';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-700.css';
import '../styles/globals.css';
export const metadata:Metadata={title:'FOURTEEN OS — CATORCEVIDAS',description:'El rincón de internet de Melanie Silva. Creatividad, marcas, sistemas y una vida con muchas vidas. Explora el archivo y crea algo tuyo.',icons:{icon:'/icons/computer.svg'},openGraph:{title:'FOURTEEN OS — CATORCEVIDAS',description:'Una sola vida es demasiado larga para ser una sola persona.',type:'website'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
