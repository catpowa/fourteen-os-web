import { ArtDocument, ArtObject, clamp } from './model';
const imageCache=new Map<string,HTMLImageElement>();
const pendingImages=new Map<string,Promise<HTMLImageElement>>();
export function loadImage(src:string):Promise<HTMLImageElement> {
 if(imageCache.has(src)) return Promise.resolve(imageCache.get(src)!);
 if(pendingImages.has(src)) return pendingImages.get(src)!;
 const task=new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>{imageCache.set(src,img);pendingImages.delete(src);resolve(img);};img.onerror=()=>{pendingImages.delete(src);reject(new Error('image-load'));};img.src=src;});pendingImages.set(src,task);return task;
}
export function fontString(o:ArtObject,size=o.fontSize) {return `${o.bold?'600':'400'} ${size}px ${o.font==='serif'?'"Instrument Serif", Georgia, serif':'"IBM Plex Mono", "Roboto Mono", monospace'}`;}
export function wrapText(ctx:CanvasRenderingContext2D,text:string,width:number):string[] {
 const result:string[]=[];
 for(const paragraph of text.split('\n')){
  if(!paragraph){result.push('');continue;}
  let line='';
  for(const word of paragraph.split(/\s+/)){
   const next=line?`${line} ${word}`:word;
   if(ctx.measureText(next).width<=width){line=next;continue;}
   if(line){result.push(line);line='';}
   if(ctx.measureText(word).width<=width){line=word;continue;}
   for(const char of Array.from(word)){if(line && ctx.measureText(line+char).width>width){result.push(line);line=char;}else line+=char;}
  }
  result.push(line);
 }
 return result.length?result:[''];
}
export function textLayout(ctx:CanvasRenderingContext2D,o:ArtObject) {
 const padding=o.kind==='note'?Math.min(28,o.w*.08):0;
 const bottom=o.kind==='note'?48:0;
 const width=Math.max(8,o.w-padding*2),height=Math.max(8,o.h-padding*2-bottom);
 let size=clamp(o.fontSize,4,240); ctx.font=fontString(o,size);let lines=wrapText(ctx,o.text,width);
 while(lines.length*size*1.35>height && size>4){size=Math.max(4,size-1);ctx.font=fontString(o,size);lines=wrapText(ctx,o.text,width);}
 return {size,lines,padding,lineHeight:size*1.35,width,height};
}
function drawText(ctx:CanvasRenderingContext2D,o:ArtObject){
 const l=textLayout(ctx,o);ctx.font=fontString(o,l.size);ctx.fillStyle=o.color;ctx.textAlign=o.align;ctx.textBaseline='top';
 const x=o.align==='center'?o.w/2:o.align==='right'?o.w-l.padding:l.padding;
 l.lines.forEach((line,i)=>ctx.fillText(line,x,l.padding+i*l.lineHeight));
}
function polygon(ctx:CanvasRenderingContext2D,points:number[][],fill:string,stroke='#0E1D24'){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
export function drawSticker(ctx:CanvasRenderingContext2D,key:string,w:number,h:number,fill='#D5DEFD',ink='#0E1D24'){
 ctx.save();
 // Labels fill their bounds, but their lettering is never stretched with the box.
 if(key==='label'){
  ctx.fillStyle=ink;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#FFFFFF';ctx.font=`600 ${Math.min(h*.56,w/3.1)}px "IBM Plex Mono",monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('14/V',w/2,h/2);ctx.restore();return;
 }
 // Every illustrated sticker uses an isotropic transform, including after resizing.
 const scale=Math.min(w,h)/32;ctx.translate((w-32*scale)/2,(h-32*scale)/2);ctx.scale(scale,scale);ctx.lineWidth=1;ctx.lineJoin='miter';ctx.strokeStyle=ink;ctx.fillStyle=fill;
 const rect=(x:number,y:number,rw:number,rh:number,color=fill,outline=true)=>{ctx.fillStyle=color;ctx.fillRect(x,y,rw,rh);if(outline){ctx.strokeStyle=ink;ctx.strokeRect(x+.5,y+.5,rw-1,rh-1);}};
 const line=(a:number,b:number,c:number,d:number)=>{ctx.strokeStyle=ink;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();};
 const circle=(x:number,y:number,r:number,color=fill)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();};
 const label=(text:string,x:number,y:number,size=5,color=ink)=>{ctx.fillStyle=color;ctx.font=`600 ${size}px "IBM Plex Mono",monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);};
 if(key==='computer'){rect(5,2,22,25,'#F7F2ED');rect(8,5,16,13,'#D5DEFD');rect(11,9,2,2,ink,false);rect(19,9,2,2,ink,false);line(13,14,19,14);rect(17,21,7,2,ink,false);rect(8,26,16,3,'#F7F2ED');rect(3,29,26,2,'#F7F2ED');}
 else if(key==='flower'){line(16,16,16,31);polygon(ctx,[[16,25],[7,21],[10,28],[16,29]],'#E5FFE6');polygon(ctx,[[16,28],[23,21],[25,25],[16,31]],'#E5FFE6');[[16,6],[24,11],[23,20],[10,20],[8,11]].forEach(([x,y])=>circle(x,y,6,fill));circle(16,14,5,'#FFF7D6');rect(13,13,1,1,ink,false);rect(18,13,1,1,ink,false);line(14,17,18,17);}
 else if(key==='floppy'){polygon(ctx,[[3,2],[25,2],[29,6],[29,30],[3,30]],fill);rect(8,2,15,10,'#F7F2ED');rect(17,4,3,6,ink,false);rect(7,17,18,13,'#FFFFFF');line(10,21,22,21);line(10,25,20,25);}
 else if(key==='star'){polygon(ctx,[[16,1],[20,11],[31,12],[23,20],[25,31],[16,25],[6,31],[9,20],[1,12],[12,11]],fill);}
 else if(key==='heart'){polygon(ctx,[[16,29],[2,15],[2,7],[7,3],[12,3],[16,7],[20,3],[25,3],[30,7],[30,15]],fill);}
 else if(key==='eye'){polygon(ctx,[[1,16],[8,8],[16,5],[24,8],[31,16],[24,24],[16,27],[8,24]],'#FFFFFF');circle(16,16,7,fill);circle(16,16,3,ink);rect(17,12,2,2,'#FFFFFF',false);}
 else if(key==='pencil'||key==='brush'){polygon(ctx,[[5,29],[8,19],[25,2],[30,7],[13,24]],key==='brush'?ink:'#FFF7D6');line(10,20,27,4);polygon(ctx,[[5,29],[8,20],[13,25]],'#F7F2ED');rect(5,27,2,2,ink,false);}
 else if(key==='camera'){rect(2,8,28,20,'#F7F2ED');rect(7,4,10,5,fill);circle(16,18,8,fill);circle(16,18,5,'#FFFFFF');rect(25,10,3,3,ink,false);}
 else if(key==='scissors'){circle(7,25,5,fill);circle(24,25,5,fill);line(10,21,25,2);line(21,21,6,2);circle(16,14,2,'#FFFFFF');}
 else if(key==='ruler'){rect(1,10,30,12,'#FFF7D6');for(let x=4;x<30;x+=3)line(x,11,x,x%2===0?17:15);}
 else if(key==='palette'){circle(16,16,14,'#F7F2ED');[[10,8,'#D5DEFD'],[21,9,'#E5FFE6'],[25,18,'#FFF7D6'],[16,24,'#0302FF']].forEach(([x,y,c])=>circle(x as number,y as number,3,c as string));circle(8,19,3,'#FFFFFF');}
 else if(key==='notebook'||key==='file'||key==='paper'){rect(5,2,23,28,key==='paper'?'#FFF7D6':'#F7F2ED');if(key==='notebook'){for(let y=6;y<29;y+=5){line(2,y,8,y);}line(10,3,10,29);}else{polygon(ctx,[[21,2],[28,9],[21,9]],fill);}for(let y=13;y<26;y+=4)line(13,y,24,y);}
 else if(key==='stamp'){rect(3,13,26,15,fill);rect(11,4,10,10,'#F7F2ED');rect(1,27,30,3,ink);label('14/V',16,21,7);}
 else if(key==='mouse'){ctx.beginPath();ctx.moveTo(16,10);ctx.bezierCurveTo(4,10,5,30,16,30);ctx.bezierCurveTo(28,30,28,10,16,10);ctx.fillStyle='#F7F2ED';ctx.fill();ctx.stroke();line(16,11,16,19);line(8,19,24,19);line(16,10,16,5);line(16,5,25,5);line(25,5,25,1);}
 else if(key==='chip'){rect(8,8,16,16,ink);rect(11,11,10,10,fill);for(let i=10;i<24;i+=4){line(i,2,i,8);line(i,24,i,30);line(2,i,8,i);line(24,i,30,i);}label('14',16,16,5);}
 else if(key==='folder'){polygon(ctx,[[2,7],[12,7],[15,11],[30,11],[30,28],[2,28]],'#FFF7D6');line(3,15,29,15);}
 else if(key==='terminal'){rect(1,5,30,23,ink);rect(2,6,28,3,fill);label('>_',12,18,10,'#E5FFE6');}
 else if(key==='sun'){for(let i=0;i<8;i++){const a=i*Math.PI/4;line(16+Math.cos(a)*11,16+Math.sin(a)*11,16+Math.cos(a)*15,16+Math.sin(a)*15);}circle(16,16,9,'#FFF7D6');rect(12,13,2,2,ink,false);rect(19,13,2,2,ink,false);line(13,20,20,20);}
 else if(key==='smile'){circle(16,16,14,'#FFF7D6');rect(10,10,3,4,ink,false);rect(19,10,3,4,ink,false);ctx.beginPath();ctx.arc(16,17,8,0,Math.PI);ctx.stroke();}
 else if(key==='tape'){polygon(ctx,[[1,3],[31,0],[29,8],[32,13],[29,19],[31,28],[2,31],[4,24],[1,17],[3,10]],'#D5DEFD');for(let x=6;x<28;x+=5)line(x,5,x-2,26);}
 else if(key==='quote'){label('“',16,19,37);}
 else if(key==='arrow'){polygon(ctx,[[2,12],[20,12],[20,4],[31,16],[20,28],[20,20],[2,20]],fill);}
 else if(key==='line-arrow'){line(2,16,29,16);line(21,8,29,16);line(21,24,29,16);}
 else if(key==='notion'){
  polygon(ctx,[[4,4],[24,2],[28,6],[28,28],[7,30],[4,26]],'#F7F2ED',ink);line(7,8,7,29);line(7,8,28,6);
  rect(10,11,3,14,ink,false);rect(22,10,3,14,ink,false);polygon(ctx,[[12,11],[15,11],[23,21],[23,25],[20,25],[12,15]],ink,'');
 }
 else if(key==='figma'){
  // A tiny node editor: linked blocks instead of a word-only software badge.
  line(11,7,23,13);line(11,7,11,25);line(11,17,23,13);
  rect(4,2,12,9,fill);rect(17,2,11,9,'#FFF7D6');rect(4,12,12,9,'#E5FFE6');rect(4,22,12,9,fill);circle(23,16,5,'#F7F2ED');
 }
 else if(key==='adobe'){
  polygon(ctx,[[2,28],[13,3],[19,3],[30,28],[22,28],[16,13],[9,28]],ink,'');
  polygon(ctx,[[12,24],[20,24],[22,29],[10,29]],fill,ink);rect(25,3,4,4,fill);
 }
 else if(key==='chatgpt'){
  // Six linked conversation tiles around an open center.
  for(let i=0;i<6;i++){ctx.save();ctx.translate(16,16);ctx.rotate(i*Math.PI/3);polygon(ctx,[[0,-14],[7,-14],[10,-10],[10,-4],[6,-4],[6,-9],[0,-9]],fill,ink);ctx.restore();}
  circle(16,16,3,'#F7F2ED');
 }
 else if(key==='claude'){
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const r=i%2?12:15;line(16+Math.cos(a)*4,16+Math.sin(a)*4,16+Math.cos(a)*r,16+Math.sin(a)*r);}
  polygon(ctx,[[13,11],[20,13],[21,19],[15,22],[10,17]],'#FFF7D6',ink);
 }
 else if(key==='canva'){
  polygon(ctx,[[26,6],[20,2],[11,2],[4,8],[2,17],[6,26],[13,30],[23,28],[28,23],[24,20],[20,24],[13,25],[8,20],[7,13],[12,7],[19,7],[22,10]],fill,ink);
  polygon(ctx,[[14,23],[17,15],[27,5],[31,9],[21,19]],ink,'');polygon(ctx,[[14,23],[17,15],[21,19]],'#FFF7D6',ink);
 }
 else {rect(1,2,30,28,'#F7F2ED');rect(1,2,30,6,fill);label(key==='chatgpt'?'ChatGPT':key.charAt(0).toUpperCase()+key.slice(1),16,17,key.length>6?4:5);label('TOOL',16,25,3);}
 ctx.restore();
}
export function drawObject(ctx:CanvasRenderingContext2D,o:ArtObject,brand=false){
 if(o.hidden)return;ctx.save();ctx.translate(o.x+o.w/2,o.y+o.h/2);ctx.rotate(o.rotation*Math.PI/180);ctx.translate(-o.w/2,-o.h/2);
 if(o.kind==='shape'){
  const strokeWidth=o.strokeWidth??(o.shape==='line'?Math.min(o.h,4):0);
  ctx.fillStyle=o.fill;ctx.strokeStyle=o.stroke??o.fill;ctx.lineWidth=strokeWidth;ctx.lineJoin='miter';
  ctx.beginPath();
  if(o.shape==='line'){
   // The object height is a touch-friendly hit area, not the line's thickness.
   ctx.moveTo(0,o.h/2);ctx.lineTo(o.w,o.h/2);if(strokeWidth>0)ctx.stroke();
  }else{
   const inset=Math.min(strokeWidth/2,o.w/2,o.h/2);
   if(o.shape==='ellipse')ctx.ellipse(o.w/2,o.h/2,Math.max(.01,o.w/2-inset),Math.max(.01,o.h/2-inset),0,0,Math.PI*2);
   else ctx.rect(inset,inset,Math.max(0,o.w-inset*2),Math.max(0,o.h-inset*2));
   if(o.fillEnabled!==false)ctx.fill();if(strokeWidth>0)ctx.stroke();
  }
 }
 if(o.kind==='note'){ctx.fillStyle='rgba(14,29,36,.12)';ctx.fillRect(6,7,o.w,o.h);ctx.fillStyle=o.fill;ctx.fillRect(0,0,o.w,o.h);ctx.fillStyle='rgba(14,29,36,.055)';ctx.fillRect(0,0,o.w,12);drawText(ctx,o);if(brand){ctx.fillStyle='#0E1D24';ctx.fillRect(20,o.h-36,62,24);ctx.fillStyle='#FFFFFF';ctx.font='500 16px "IBM Plex Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('14/V',51,o.h-24);}}
 if(o.kind==='text') drawText(ctx,o);
 if(o.kind==='sticker') drawSticker(ctx,o.sticker||'star',o.w,o.h,o.fill,o.color);
 if(o.kind==='image' && o.src){const image=imageCache.get(o.src);if(image){const scale=Math.max(o.w/image.naturalWidth,o.h/image.naturalHeight);ctx.save();ctx.beginPath();ctx.rect(0,0,o.w,o.h);ctx.clip();ctx.drawImage(image,(o.w-image.naturalWidth*scale)/2,(o.h-image.naturalHeight*scale)/2,image.naturalWidth*scale,image.naturalHeight*scale);ctx.restore();}}
 ctx.restore();
}
export function drawDocument(canvas:HTMLCanvasElement,doc:ArtDocument,selection?:string,guide=false){
 if(canvas.width!==doc.width)canvas.width=doc.width;if(canvas.height!==doc.height)canvas.height=doc.height;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');ctx.clearRect(0,0,doc.width,doc.height);ctx.fillStyle=doc.background;ctx.fillRect(0,0,doc.width,doc.height);
 if(doc.mode==='garden'){ctx.fillStyle='rgba(14,29,36,.14)';for(let y=16;y<doc.height;y+=24)for(let x=16;x<doc.width;x+=24)ctx.fillRect(x,y,1,1);}
 for(const object of doc.objects)drawObject(ctx,object,doc.brand);
 if(doc.brand && doc.mode==='lab'){ctx.fillStyle='#0E1D24';ctx.fillRect(doc.width-138,42,96,42);ctx.fillStyle='#FFFFFF';ctx.font='600 28px "IBM Plex Mono",monospace';ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillText('14/V',doc.width-90,63);}
 if(guide){ctx.save();ctx.strokeStyle='#0302FF';ctx.lineWidth=1;ctx.setLineDash([8,8]);ctx.strokeRect(doc.width*.075,doc.height*.075,doc.width*.85,doc.height*.85);ctx.restore();}
 const selected=doc.objects.find(o=>o.id===selection&&!o.hidden);if(selected){ctx.save();ctx.translate(selected.x+selected.w/2,selected.y+selected.h/2);ctx.rotate(selected.rotation*Math.PI/180);ctx.translate(-selected.w/2,-selected.h/2);ctx.strokeStyle='#0302FF';ctx.lineWidth=3;ctx.setLineDash([8,5]);ctx.strokeRect(-4,-4,selected.w+8,selected.h+8);ctx.setLineDash([]);ctx.fillStyle='#FFFFFF';ctx.fillRect(selected.w-10,selected.h-10,20,20);ctx.strokeRect(selected.w-10,selected.h-10,20,20);ctx.restore();}
}
export async function prepareImages(doc:ArtDocument){await Promise.all(doc.objects.filter(o=>o.kind==='image'&&o.src).map(o=>loadImage(o.src!)));}
export async function documentPNG(doc:ArtDocument,selected?:ArtObject):Promise<Blob>{
 await document.fonts.ready;await prepareImages(doc);const canvas=document.createElement('canvas');
 if(selected){const padding=selected.kind==='note'?12:4;const angle=selected.rotation*Math.PI/180;const width=Math.ceil(Math.abs(selected.w*Math.cos(angle))+Math.abs(selected.h*Math.sin(angle)))+padding*2,height=Math.ceil(Math.abs(selected.h*Math.cos(angle))+Math.abs(selected.w*Math.sin(angle)))+padding*2;canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d')!;drawObject(ctx,{...selected,x:(width-selected.w)/2,y:(height-selected.h)/2},doc.brand);}else drawDocument(canvas,doc);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('export')),'image/png'));
}
export function pointInObject(x:number,y:number,o:ArtObject){const a=-o.rotation*Math.PI/180,dx=x-o.x-o.w/2,dy=y-o.y-o.h/2;const ox=dx*Math.cos(a)-dy*Math.sin(a)+o.w/2,oy=dx*Math.sin(a)+dy*Math.cos(a)+o.h/2;return ox>=0&&ox<=o.w&&oy>=0&&oy<=o.h;}
export function downloadBlob(blob:Blob,name:string){const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
