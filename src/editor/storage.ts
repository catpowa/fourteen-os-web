import type { ArtDocument, EditorMode } from './model';
const DB='fourteen-creative-v1';
let connection:Promise<IDBDatabase>|undefined;
function openDB(){
 if(!connection)connection=new Promise<IDBDatabase>((resolve,reject)=>{if(!window.indexedDB){reject(new Error('storage'));return;}const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>{request.result.createObjectStore('documents');};request.onsuccess=()=>resolve(request.result);request.onerror=()=>{connection=undefined;reject(request.error);};});return connection;
}
export async function saveDocument(doc:ArtDocument,key=`draft:${doc.mode}`){
 const db=await openDB();return new Promise<void>((resolve,reject)=>{const t=db.transaction('documents','readwrite');t.objectStore('documents').put(doc,key);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});
}
export async function readDocument(key:string):Promise<ArtDocument|undefined>{const db=await openDB();return new Promise((resolve,reject)=>{const t=db.transaction('documents','readonly').objectStore('documents').get(key);t.onsuccess=()=>resolve(t.result);t.onerror=()=>reject(t.error);});}
export async function listDocuments(mode:EditorMode):Promise<ArtDocument[]>{const db=await openDB();return new Promise((resolve,reject)=>{const t=db.transaction('documents','readonly').objectStore('documents');const result:ArtDocument[]=[];const request=t.openCursor();request.onsuccess=()=>{const cursor=request.result;if(cursor){if(String(cursor.key).startsWith(`project:${mode}:`))result.push(cursor.value);cursor.continue();}else resolve(result.sort((a,b)=>b.updatedAt-a.updatedAt));};request.onerror=()=>reject(request.error);});}
export async function deleteDocument(mode:EditorMode,id:string){const db=await openDB();return new Promise<void>((resolve,reject)=>{const t=db.transaction('documents','readwrite');t.objectStore('documents').delete(`project:${mode}:${id}`);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);});}
