export type Lang = 'es' | 'en';
export type EditorMode = 'garden' | 'lab';
export type ObjectKind = 'text' | 'note' | 'shape' | 'sticker' | 'image';
export type ShapeKind = 'rect' | 'ellipse' | 'line';
export interface ArtObject {
  id: string; kind: ObjectKind; x: number; y: number; w: number; h: number;
  text: string; color: string; fill: string; fontSize: number; font: 'mono' | 'serif';
  align: 'left' | 'center' | 'right'; bold: boolean; rotation: number;
  sticker?: string; shape?: ShapeKind; src?: string; locked?: boolean; hidden?: boolean;
  fillEnabled?: boolean; stroke?: string; strokeWidth?: number;
}
export interface ArtDocument {
  version: 1; id: string; name: string; mode: EditorMode; width: number; height: number;
  background: string; brand: boolean; objects: ArtObject[]; updatedAt: number;
}
export const PALETTE = ['#D5DEFD', '#E5FFE6', '#FFF7D6', '#F7F2ED', '#D5F6FD', '#0302FF', '#0E1D24', '#FFFFFF'];
export const FORMATS = [{id:'square', width:1080,height:1080},{id:'portrait',width:1080,height:1350},{id:'story',width:1080,height:1920},{id:'landscape',width:1920,height:1080}];
export const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const cloneDoc = (doc:ArtDocument):ArtDocument => ({...doc, objects:doc.objects.map(o=>({...o}))});
export function makeObject(kind:ObjectKind, patch:Partial<ArtObject>={}):ArtObject {
  return {id:uid(),kind,x:100,y:100,w:400,h:200,text:'',color:'#0E1D24',fill:'#E5FFE6',fontSize:36,font:'mono',align:'left',bold:false,rotation:0,...patch};
}
export function clamp(value:number, min:number, max:number) { return Math.max(min,Math.min(value,max)); }
export function clampObject(o:ArtObject, doc:Pick<ArtDocument,'width'|'height'>):ArtObject {
  const w=clamp(o.w,Math.min(40,doc.width),doc.width),h=clamp(o.h,Math.min(24,doc.height),doc.height);
  return {...o,w,h,x:clamp(o.x,0,doc.width-w),y:clamp(o.y,0,doc.height-h)};
}
export function resizeDocument(doc:ArtDocument,width:number,height:number):ArtDocument {
  const sx=width/doc.width,sy=height/doc.height,s=Math.sqrt(sx*sy);
  return {...doc,width,height,objects:doc.objects.map(o=>clampObject({...o,x:o.x*sx,y:o.y*sy,w:o.w*sx,h:o.h*sy,fontSize:o.fontSize*s,strokeWidth:o.strokeWidth===undefined?undefined:Math.min(100,o.strokeWidth*s)}, {width,height}))};
}
export const STICKERS = ['computer','flower','floppy','star','heart','eye','pencil','camera','scissors','ruler','brush','palette','notebook','stamp','mouse','chip','folder','file','terminal','sun','smile','tape','paper','quote','arrow','line-arrow','label','notion','figma','adobe','chatgpt','claude','canva'];
export const stickerNames: Record<string,[string,string]> = {
computer:['Mi computadora','My computer'],flower:['Flor','Flower'],floppy:['Disquete','Floppy disk'],star:['Estrella','Star'],heart:['Corazón','Heart'],eye:['Ojo curioso','Curious eye'],pencil:['Lápiz','Pencil'],camera:['Cámara','Camera'],scissors:['Tijeras','Scissors'],ruler:['Regla','Ruler'],brush:['Pincel','Brush'],palette:['Paleta','Palette'],notebook:['Cuaderno','Notebook'],stamp:['Sello 14/V','14/V stamp'],mouse:['Ratón','Mouse'],chip:['Chip','Chip'],folder:['Carpeta','Folder'],file:['Archivo','File'],terminal:['Terminal','Terminal'],sun:['Sol','Sun'],smile:['Sonrisa','Smile'],tape:['Cinta','Tape'],paper:['Recorte','Paper scrap'],quote:['Comillas','Quotation'],arrow:['Flecha','Arrow'],'line-arrow':['Flecha lineal','Line arrow'],label:['Etiqueta 14/V','14/V label'],notion:['Notion','Notion'],figma:['Figma','Figma'],adobe:['Adobe','Adobe'],chatgpt:['ChatGPT','ChatGPT'],claude:['Claude','Claude'],canva:['Canva','Canva']
};
export const TEMPLATE_NAMES:[string,string][] = [['Cita editorial','Editorial quote'],['Documento','Document'],['Editorial con foto','Photo editorial'],['Portada','Cover'],['Diagrama','Diagram'],['Manifiesto','Manifesto'],['Tarjeta retro','Retro card']];
export function makeTemplate(index:number,lang:Lang='es'):ArtDocument {
 const es=lang==='es'; const doc:ArtDocument={version:1,id:uid(),mode:'lab',name:TEMPLATE_NAMES[index]?.[es?0:1]||'Graphic Lab',width:1080,height:1080,background:index===0?'#D5DEFD':'#F7F2ED',brand:true,objects:[],updatedAt:Date.now()};
 const txt=(text:string,x:number,y:number,w:number,h:number,size=32,color='#0302FF',bold=false,align:'left'|'center'|'right'='left')=>makeObject('text',{text,x,y,w,h,fontSize:size,color,bold,align});
 const rule=(y:number)=>makeObject('shape',{shape:'line',x:80,y,w:920,h:3,fill:'#0302FF'});
 const common=[txt(es?'14/V / ARCHIVO PERSONAL':'14/V / PERSONAL ARCHIVE',80,90,700,40,18),rule(142),rule(970),txt('CATORCEVIDAS',80,990,510,30,18),txt(es?'HECHO CON CURIOSIDAD':'MADE WITH CURIOSITY',600,990,400,30,16,'#0302FF',false,'right')];
 if(index===0) doc.objects=[...common,txt(es?'UNA SOLA VIDA ES DEMASIADO LARGA PARA SER UNA SOLA PERSONA.':'ONE LIFETIME IS TOO LONG TO BE JUST ONE PERSON.',170,390,740,300,48,'#0302FF',false,'center')];
 if(index===1) doc.objects=[...common,txt(es?'UN JUEVES\nCUALQUIERA':'AN ORDINARY\nTHURSDAY',80,230,900,220,80,'#0E1D24',true),txt(es?'TODO LO QUE NO CABE EN LA PRESENTACIÓN FINAL.':'EVERYTHING THAT DOESN’T MAKE IT INTO THE FINAL PRESENTATION.',80,520,760,180,30,'#0E1D24'),txt(es?'Una idea, una conversación, una nota para después. Empieza aquí.':'An idea, a conversation, a note for later. Start here.',80,760,760,130,25,'#0E1D24')];
 if(index===2) doc.objects=[...common,makeObject('shape',{shape:'rect',x:80,y:210,w:570,h:650,fill:'#D5DEFD'}),makeObject('image',{x:80,y:210,w:570,h:650,src:'/media/portrait-dither.png'}),txt(es?'OTRA FORMA\nDE MIRAR.':'ANOTHER WAY\nTO SEE.',690,280,300,270,47,'#0E1D24',true),txt(es?'Una imagen también puede ser el principio de una idea.':'An image can be the beginning of an idea, too.',690,700,300,170,23,'#0E1D24')];
 if(index===3) {doc.background='#E5FFE6';doc.objects=[...common,txt(es?'AQUÍ\nTODOS\nSOMOS\nCREATIVOS.':'WE ARE\nALL\nCREATIVE\nHERE.',80,260,920,540,92,'#0E1D24',true),txt('LIFE LOG / 14',80,860,600,40,22)];}
 if(index===4) doc.objects=[...common,makeObject('shape',{shape:'ellipse',x:220,y:250,w:640,h:640,fill:'#D5DEFD'}),makeObject('shape',{shape:'ellipse',x:340,y:370,w:400,h:400,fill:'#E5FFE6'}),makeObject('shape',{shape:'ellipse',x:450,y:480,w:180,h:180,fill:'#FFF7D6'}),txt(es?'IDEA':'IDEA',445,540,190,60,28,'#0E1D24',true,'center'),txt(es?'ESTRUCTURA':'STRUCTURE',350,410,380,50,24,'#0E1D24',false,'center'),txt(es?'CONTEXTO':'CONTEXT',350,290,380,50,24,'#0E1D24',false,'center')];
 if(index===5) {doc.background='#0302FF';doc.objects=[txt('CATORCEVIDAS / 14/V',80,90,900,50,22,'#FFFFFF'),txt(es?'NO NECESITAS\nSABERLO TODO.':'YOU DON’T NEED\nTO KNOW\nEVERYTHING.',80,270,920,350,76,'#FFFFFF',true),makeObject('shape',{shape:'rect',x:75,y:680,w:930,h:180,fill:'#FFF7D6'}),txt(es?'NECESITAS SABER\nQUÉ IMPORTA AHORA.':'YOU NEED TO KNOW\nWHAT MATTERS NEXT.',95,710,890,140,47,'#0E1D24',true),txt(es?'[+] UNA IDEA PARA LLEVARTE':'[+] AN IDEA TO TAKE WITH YOU',80,980,900,40,19,'#FFFFFF')];}
 if(index===6) {doc.background='#FFF7D6';doc.objects=[...common,makeObject('shape',{shape:'rect',x:210,y:250,w:660,h:550,fill:'#FFFFFF'}),makeObject('sticker',{sticker:'computer',x:410,y:320,w:260,h:240}),txt(es?'HOLA,\nPERSONA CURIOSA.':'HELLO,\nCURIOUS PERSON.',260,620,560,150,44,'#0E1D24',false,'center')];}
 return doc;
}
export function makeGarden(lang:Lang='es'):ArtDocument {
 const es=lang==='es'; return {version:1,id:uid(),mode:'garden',name:'Tool Garden',width:1440,height:1000,background:'#F7F2ED',brand:true,updatedAt:Date.now(),objects:[
 makeObject('note',{x:120,y:145,w:430,h:360,text:es?'Aquí todos somos creativos.\n\nEmpieza con una nota.':'We are all creative here.\n\nStart with a note.',fill:'#E5FFE6',fontSize:37}),
 makeObject('note',{x:740,y:430,w:440,h:360,text:es?'Mi casa es tu casa, pero mi café es mi café.':'My home is your home, but my coffee is my coffee.',fill:'#FFF7D6',fontSize:38}),
 makeObject('sticker',{sticker:'computer',x:720,y:80,w:280,h:280}),makeObject('sticker',{sticker:'flower',x:390,y:590,w:250,h:250}),makeObject('sticker',{sticker:'star',x:1110,y:140,w:160,h:160}),makeObject('sticker',{sticker:'tape',x:240,y:115,w:180,h:60}),makeObject('sticker',{sticker:'label',x:120,y:810,w:190,h:70})]};
}
export function validateDocument(value:unknown, mode:EditorMode):ArtDocument {
 const d=value as ArtDocument;
 if(!d||d.version!==1||!Array.isArray(d.objects)||d.objects.length>100||!Number.isFinite(d.width)||!Number.isFinite(d.height)||d.width<200||d.height<200||d.width>4096||d.height>4096||typeof d.name!=='string'||typeof d.background!=='string'||!/^#[0-9a-f]{6}$/i.test(d.background)) throw new Error('invalid-project');
 const objects=d.objects.map((o)=>{
 if(!o||!['text','note','shape','sticker','image'].includes(o.kind)||![o.x,o.y,o.w,o.h,o.fontSize,o.rotation].every(Number.isFinite)||typeof o.text!=='string'||o.text.length>12000||typeof o.color!=='string'||typeof o.fill!=='string'||!/^#[0-9a-f]{6}$/i.test(o.color)||!/^#[0-9a-f]{6}$/i.test(o.fill)) throw new Error('invalid-project');
 if(o.fillEnabled!==undefined&&typeof o.fillEnabled!=='boolean')throw new Error('invalid-shape');
 if(o.stroke!==undefined&&(typeof o.stroke!=='string'||!/^#[0-9a-f]{6}$/i.test(o.stroke)))throw new Error('invalid-shape');
 if(o.strokeWidth!==undefined&&(!Number.isFinite(o.strokeWidth)||o.strokeWidth<0||o.strokeWidth>100))throw new Error('invalid-shape');
 if(o.src && (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(o.src) && !/^\/media\/[\w.-]+$/.test(o.src))) throw new Error('invalid-image');
 return clampObject({...o,id:uid(),font:o.font==='serif'?'serif':'mono',fontSize:clamp(o.fontSize,10,240),rotation:clamp(o.rotation,-180,180),align:['left','right','center'].includes(o.align)?o.align:'left'},d);
 });
 return {version:1,id:uid(),name:d.name.slice(0,100),mode,width:d.width,height:d.height,background:d.background,brand:!!d.brand,objects,updatedAt:Date.now()};
}
