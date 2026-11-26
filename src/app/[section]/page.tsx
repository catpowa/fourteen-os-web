import Desktop from '../../os/Desktop';
import {appMeta,type AppId} from '../../os/model';
const routes:Record<string,AppId>={about:'about',work:'work',archive:'archive',garden:'garden',lab:'lab',contact:'contact',finds:'finds',help:'help',documents:'documents',dither:'dither',music:'music',terminal:'terminal'};
export function generateStaticParams(){return Object.keys(routes).map(section=>({section}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;return {title:`${appMeta[routes[section]??'welcome'].es} — FOURTEEN OS`};}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <Desktop initialApp={routes[section]??'welcome'}/>}
