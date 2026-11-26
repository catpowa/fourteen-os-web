export type CalcState={display:string;stored:number|null;operator:string|null;fresh:boolean;last:number|null;lastOp:string|null;error:boolean};
export const initialCalc:CalcState={display:'0',stored:null,operator:null,fresh:true,last:null,lastOp:null,error:false};
function result(a:number,b:number,op:string){if(op==='÷'&&b===0)throw Error('division');const n=op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b;if(!Number.isFinite(n))throw Error('range');return Number(n.toPrecision(12));}
export function calculate(s:CalcState,key:string):CalcState{
 if(key==='C'||key==='Escape')return {...initialCalc};
 if(s.error)s={...initialCalc};
 if(/^\d$/.test(key))return {...s,...(s.fresh&&!s.operator?{last:null,lastOp:null}:{}),display:s.fresh||s.display==='0'||/[eE]/.test(s.display)?key:s.display.length<14?s.display+key:s.display,fresh:false};
 if(key==='.')return {...s,...(s.fresh&&!s.operator?{last:null,lastOp:null}:{}),display:s.fresh||/[eE]/.test(s.display)?'0.':s.display.includes('.')?s.display:s.display+'.',fresh:false};
 if(key==='Backspace'){
  const remaining=/[eE]/.test(s.display)?'0':s.display.slice(0,-1);
  return {...s,display:remaining&&Number.isFinite(Number(remaining))?remaining:'0',fresh:false};
 }
 if(key==='±')return {...s,display:String(-Number(s.display))};
 if(key==='%')return {...s,display:String(Number(s.display)/100)};
 try{
 if(['+','−','×','÷'].includes(key)){
  const value=s.stored!==null&&s.operator&&!s.fresh?result(s.stored,Number(s.display),s.operator):Number(s.display);
  return {...s,stored:value,operator:key,display:String(value),fresh:true,last:null,lastOp:null};
 }
 if(key==='='||key==='Enter'){
  const op=s.operator??s.lastOp;const rhs=s.operator?Number(s.display):s.last;if(!op||rhs===null)return s;
  const lhs=s.operator?s.stored??Number(s.display):Number(s.display);
  return {...s,display:String(result(lhs,rhs,op)),stored:null,operator:null,fresh:true,last:rhs,lastOp:op};
 }
 }catch{return {...initialCalc,display:'Error',error:true};}
 return s;
}
