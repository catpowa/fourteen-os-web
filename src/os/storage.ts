export const PREFIX='fourteen-os:v1:';
export function readLocal<T>(key:string,fallback:T):T {
 try {
  const value=localStorage.getItem(PREFIX+key);if(!value)return fallback;
  const parsed:unknown=JSON.parse(value);
  if(parsed===null)return fallback===null?parsed as T:fallback;
  if(Array.isArray(fallback))return Array.isArray(parsed)?parsed as T:fallback;
  if(fallback!==null&&typeof fallback==='object')return typeof parsed==='object'&&!Array.isArray(parsed)?parsed as T:fallback;
  return typeof parsed===typeof fallback?parsed as T:fallback;
 }catch{return fallback;}
}
export function writeLocal(key:string,value:unknown):boolean {try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true;}catch{return false;}}
export function downloadFile(name:string,content:string,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
