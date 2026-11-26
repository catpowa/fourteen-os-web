export type Lang='es'|'en';
export type AppId='welcome'|'about'|'work'|'archive'|'garden'|'lab'|'finds'|'contact'|'calculator'|'notes'|'scrapbook'|'settings'|'clock'|'trash'|'help'|'finder'|'readme'|'media'|'portrait'|'documents'|'dither'|'music'|'terminal';
export type Theme='lavender'|'mint'|'cream'|'yellow'|'mono';
export type Settings={lang:Lang;theme:Theme;pattern:string;sound:boolean;motion:boolean;snap:boolean;mascot:boolean};
export const defaultSettings:Settings={lang:'es',theme:'lavender',pattern:'dither',sound:false,motion:true,snap:true,mascot:true};
export const appMeta:Record<AppId,{es:string;en:string;icon:string;width:number;height:number}>={
 documents:{es:'Mis documentos',en:'My Documents',icon:'folder',width:850,height:620},
 dither:{es:'Dithering Lab',en:'Dithering Lab',icon:'dither',width:1100,height:720},
 music:{es:'Reproductor',en:'Music Player',icon:'music',width:660,height:620},
 terminal:{es:'Terminal',en:'Terminal',icon:'terminal',width:760,height:540},
 welcome:{es:'Bienvenida',en:'Welcome',icon:'computer',width:690,height:530},
 about:{es:'Sobre mí',en:'About Me',icon:'about',width:760,height:650},
 work:{es:'Trabajo',en:'Work Stuff',icon:'work',width:850,height:660},
 archive:{es:'Archivo visual',en:'Visual Archive',icon:'archive',width:850,height:620},
 garden:{es:'Tool Garden',en:'Tool Garden',icon:'garden',width:1100,height:700},
 lab:{es:'Art Machine',en:'Art Machine',icon:'lab',width:1160,height:720},
 finds:{es:'Hallazgos de internet',en:'Internet Finds',icon:'finds',width:850,height:660},
 contact:{es:'Di hola',en:'Say Hello',icon:'contact',width:720,height:580},
 calculator:{es:'Calculadora',en:'Calculator',icon:'calculator',width:320,height:450},
 notes:{es:'Bloc de notas',en:'Note Pad',icon:'notes',width:580,height:560},
 scrapbook:{es:'Álbum',en:'Scrapbook',icon:'scrapbook',width:850,height:630},
 settings:{es:'Panel de control',en:'Control Panel',icon:'settings',width:650,height:620},
 clock:{es:'Reloj',en:'Clock',icon:'clock',width:420,height:480},
 trash:{es:'Papelera',en:'Trash',icon:'trash',width:580,height:480},
 help:{es:'Ayuda',en:'Help',icon:'help',width:700,height:600},
 finder:{es:'14/V Computer',en:'14/V Computer',icon:'computer',width:740,height:590},
 readme:{es:'Léeme',en:'Read Me',icon:'readme',width:680,height:600},
 media:{es:'Archivo',en:'File',icon:'photo',width:780,height:650},
 portrait:{es:'Un poco de mí',en:'A bit of me',icon:'photo',width:300,height:350}
};
export const desktopApps:AppId[]=['about','work','archive','garden','lab','finds','contact','finder','documents','dither','music','terminal'];
export const accessoryApps:AppId[]=['calculator','notes','scrapbook','settings','clock','help'];
export type Rect={x:number;y:number;w:number;h:number};
export type OSWindow=Rect&{id:string;app:AppId;payload?:unknown;maximized:boolean;restore?:Rect};
export type WindowState={windows:OSWindow[];active:string|null};
export type WindowAction={type:'open';window:OSWindow}|{type:'close';id:string}|{type:'focus';id:string}|{type:'rect';id:string;rect:Rect}|{type:'maximize';id:string}|{type:'clamp';width:number;height:number}|{type:'showDesktop'}|{type:'hydrate';windows:OSWindow[]};
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(Number.isFinite(n)?n:min,Math.max(min,max)));
export function fitRect(r:Rect,width:number,height:number):Rect {
 const viewportWidth=Number.isFinite(width)?Math.max(1,width):1,viewportHeight=Number.isFinite(height)?Math.max(1,height):1;
 const w=clamp(r?.w,Math.min(280,viewportWidth),viewportWidth),h=clamp(r?.h,Math.min(200,viewportHeight),viewportHeight);
 return {w,h,x:clamp(r?.x,0,viewportWidth-w),y:clamp(r?.y,0,viewportHeight-h)};
}
export function windowReducer(s:WindowState,a:WindowAction):WindowState {
 switch(a.type){
  case 'open': {const existing=s.windows.find(w=>w.id===a.window.id);return {windows:[...s.windows.filter(w=>w.id!==a.window.id),existing??a.window],active:a.window.id};}
  case 'close': {const windows=s.windows.filter(w=>w.id!==a.id);return {windows,active:s.active===a.id?(windows.at(-1)?.id??null):s.active};}
  case 'focus': {const w=s.windows.find(w=>w.id===a.id);return w?{windows:[...s.windows.filter(x=>x.id!==a.id),w],active:a.id}:s;}
  case 'rect': return {...s,windows:s.windows.map(w=>w.id===a.id?{...w,...a.rect}:w)};
  case 'maximize': return {...s,windows:s.windows.map(w=>w.id===a.id?(w.maximized?{...w,...w.restore,restore:undefined,maximized:false}:{...w,restore:{x:w.x,y:w.y,w:w.w,h:w.h},maximized:true}):w)};
  case 'clamp': return {...s,windows:s.windows.map(w=>({...w,...fitRect(w,a.width,a.height),restore:w.restore?fitRect(w.restore,a.width,a.height):undefined}))};
  case 'showDesktop':return {...s,active:null};
  case 'hydrate':return {windows:a.windows,active:a.windows.at(-1)?.id??null};
 }
}
export const themes:Record<Theme,string>={lavender:'#D5DEFD',mint:'#E5FFE6',cream:'#F7F2ED',yellow:'#FFF7D6',mono:'#E1E1DE'};
export const themeName:Record<Theme,{es:string;en:string}>={lavender:{es:'Lavanda',en:'Lavender'},mint:{es:'Menta',en:'Mint'},cream:{es:'Crema',en:'Cream'},yellow:{es:'Amarillo suave',en:'Soft yellow'},mono:{es:'Monocromo',en:'Classic mono'}};
