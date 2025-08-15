const KEY="atscv:quota:v1"; type Quota={ocr:number;jd:number;day:string;pro?:boolean};
const today=()=>new Date().toISOString().slice(0,10);
export const isPro=()=>JSON.parse(localStorage.getItem(KEY)||"{}").pro===true;
function read():Quota{const raw=JSON.parse(localStorage.getItem(KEY)||"{}");if(raw.day!==today()){const n:{ocr:number;jd:number;day:string;pro?:boolean}={ocr:0,jd:0,day:today(),pro:raw.pro};localStorage.setItem(KEY,JSON.stringify(n));return n;}return raw;}
export function canUse(f:"ocr"|"jd"){const limit={ocr:1,jd:1};const q=read();return isPro()||(q[f]??0)<limit[f];}
export function consume(f:"ocr"|"jd"){if(isPro())return;const q=read();localStorage.setItem(KEY,JSON.stringify({...q,[f]:(q[f]??0)+1}));}
export function redeem(code:string){if(code.trim().toUpperCase()===(import.meta.env.VITE_PRO_CODE||"ALPHA-ATS-2025")){const q=read();localStorage.setItem(KEY,JSON.stringify({...q,pro:true}));return true;}return false;}
