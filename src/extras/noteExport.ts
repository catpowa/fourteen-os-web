import type {Note} from '../accessories/Accessories';
export function wrapLines(ctx:CanvasRenderingContext2D,text:string,width:number):string[]{
 const lines:string[]=[];
 for(const paragraph of text.split('\n')){let line='';for(const char of paragraph){if(ctx.measureText(line+char).width>width&&line){lines.push(line);line='';}line+=char;}lines.push(line);}
 return lines;
}
export async function exportNote(note:Pick<Note,'title'|'text'|'color'>){
 await document.fonts.ready;
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');
 canvas.width=1080;ctx.font='32px "IBM Plex Mono", monospace';const lines=wrapLines(ctx,note.text,920);
 ctx.font='bold 48px "IBM Plex Mono", monospace';const title=wrapLines(ctx,note.title,920);
 const titleH=title.length*62,height=Math.max(1080,180+titleH+lines.length*48+120);
 // Split long documents into readable PNG pages rather than shrinking or clipping their text.
 const pageHeight=3000,firstRoom=Math.floor((pageHeight-300-titleH)/48),otherRoom=54;
 const pages:string[][]=[];const remaining=[...lines];pages.push(remaining.splice(0,Math.max(1,firstRoom)));while(remaining.length)pages.push(remaining.splice(0,otherRoom));
 for(let page=0;page<pages.length;page++){
 canvas.height=pages.length===1?Math.min(height,pageHeight):pageHeight;
 ctx.fillStyle=note.color;ctx.fillRect(0,0,1080,canvas.height);ctx.fillStyle='#0e1d24';ctx.strokeStyle='#0e1d24';ctx.lineWidth=2;ctx.strokeRect(1,1,1078,canvas.height-2);
 ctx.font='22px "IBM Plex Mono", monospace';ctx.fillText('CATORCEVIDAS / NOTE PAD',80,65);
 ctx.font='bold 48px "IBM Plex Mono", monospace';const heading=page===0?title:[note.title.slice(0,25)+' · '+(page+1)];heading.forEach((l,i)=>ctx.fillText(l,80,145+i*62));
 const y=180+heading.length*62;ctx.beginPath();ctx.moveTo(80,y-25);ctx.lineTo(1000,y-25);ctx.stroke();ctx.font='32px "IBM Plex Mono", monospace';pages[page].forEach((l,i)=>ctx.fillText(l,80,y+30+i*48));
 ctx.fillRect(80,canvas.height-78,100,40);ctx.fillStyle='#fff';ctx.font='bold 26px "IBM Plex Mono", monospace';ctx.fillText('14/V',94,canvas.height-49);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG')),'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${note.title.replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,60)||'note'}${pages.length>1?'-'+(page+1):''}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
 }
}
