'use client';
import {useEffect,useRef} from 'react';
import {type OSWindow,type WindowAction,type Lang,fitRect,appMeta} from './model';
export default function Window({win,active,index,hidden,lang,dispatch,children,close}:{win:OSWindow;active:boolean;index:number;hidden:boolean;lang:Lang;dispatch:React.Dispatch<WindowAction>;children:React.ReactNode;close:()=>void}){
 const ref=useRef<HTMLElement>(null);const es=lang==='es';
 const title=(win.payload&&typeof win.payload==='object'&&'title' in win.payload&&typeof win.payload.title==='string')?win.payload.title:appMeta[win.app][lang];
 useEffect(()=>{if(active&&!hidden&&!ref.current?.contains(document.activeElement))ref.current?.focus({preventScroll:true});},[active,hidden]);
 const start=(e:React.PointerEvent,resize=false)=>{
  if(e.button!==0||win.maximized||window.innerWidth<=700)return;
  if(!resize&&(e.target as HTMLElement).closest('button'))return;
  e.preventDefault();dispatch({type:'focus',id:win.id});const el=e.currentTarget as HTMLElement;el.setPointerCapture(e.pointerId);
  const sx=e.clientX,sy=e.clientY,rect={x:win.x,y:win.y,w:win.w,h:win.h};
  const move=(ev:PointerEvent)=>{const dx=ev.clientX-sx,dy=ev.clientY-sy;const r=resize?{...rect,w:Math.max(280,rect.w+dx),h:Math.max(200,rect.h+dy)}:{...rect,x:rect.x+dx,y:rect.y+dy};dispatch({type:'rect',id:win.id,rect:fitRect(r,window.innerWidth-16,window.innerHeight-76)});};
  const end=()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',end);el.removeEventListener('pointercancel',end);};el.addEventListener('pointermove',move);el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 };
 return <section ref={ref} role="dialog" aria-modal="false" aria-label={title} tabIndex={-1} data-app={win.app} data-active={active} className={`os-window ${active?'is-active':''} ${win.maximized?'is-maximized':''}`} hidden={hidden} style={{left:win.x,top:win.y,width:win.w,height:win.h,zIndex:20+index}} onPointerDownCapture={()=>{if(!active)dispatch({type:'focus',id:win.id});}} onKeyDown={e=>{if(e.key==='Escape'&&!e.defaultPrevented&&win.app!=='calculator'&&win.app!=='garden'&&win.app!=='lab'){e.stopPropagation();close();}}}>
  <header className="window-title" onPointerDown={e=>start(e)} onDoubleClick={()=>dispatch({type:'maximize',id:win.id})}>
   <button className="window-close" onClick={close} title={es?'Cerrar':'Close'} aria-label={`${es?'Cerrar':'Close'} ${title}`}><span/></button>
   <h2>{title}</h2><button className="window-zoom" title={es?'Ampliar / restaurar':'Zoom / restore'} aria-label={`${es?'Ampliar o restaurar':'Zoom or restore'} ${title}`} onClick={()=>dispatch({type:'maximize',id:win.id})}><span/></button>
  </header>
  <div className={`window-content app-${win.app}`}>{children}</div>
  <div className="window-bottom"><span>{active?'14/V':'FOURTEEN OS'}</span><button className="resize-grip" onPointerDown={e=>start(e,true)} aria-label={es?'Cambiar tamaño; usa las flechas':'Resize; use arrow keys'} onKeyDown={e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();dispatch({type:'rect',id:win.id,rect:fitRect({...win,w:win.w+(e.key==='ArrowRight'?24:e.key==='ArrowLeft'?-24:0),h:win.h+(e.key==='ArrowDown'?24:e.key==='ArrowUp'?-24:0)},window.innerWidth-16,window.innerHeight-76)});}}/></div>
 </section>
}
