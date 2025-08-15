import { useState } from "react";
import { redeem } from "@/pro/gating";
export default function UpgradeModal({open,onClose}:{open:boolean;onClose:()=>void}){
  const [code,setCode]=useState(""); const [msg,setMsg]=useState<string|null>(null);
  if(!open) return null;
  return(<div role="dialog" aria-modal="true" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"grid",placeItems:"center",zIndex:50}}>
    <div className="card" style={{width:"min(420px,92vw)"}}>
      <h3 style={{marginTop:0}}>Go Pro</h3>
      <p className="mono">Unlimited OCR & JD-Match, batch tools.</p>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Redeem code"
        style={{padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"transparent",color:"var(--text)",width:"100%"}}/>
      <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
        <button className="btn" onClick={()=>{const ok=redeem(code);setMsg(ok?"Activated!":"Invalid code"); if(ok) setTimeout(onClose,800);}}>Activate</button>
        <a className="btn ghost" href="/pro">Buy a Pro code</a>
        <button className="btn ghost" onClick={onClose}>Close</button>
      </div>
      {msg&&<div className="mono" style={{color:"var(--muted)",marginTop:8}}>{msg}</div>}
    </div>
  </div>);
}
