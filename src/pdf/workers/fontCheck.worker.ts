import { getPdfFromData } from '../utils/safePdf';
import { ensurePdfWorker } from '../utils/ensurePdfWorker';
const ATS_GOOD=["Arial","Calibri","Helvetica","Times New Roman","Times-Roman"];
const ATS_RISK=["Garamond","Courier","Papyrus","Comic Sans","Symbol"];
self.onmessage=async(e:MessageEvent<{file:ArrayBuffer;maxPages?:number}>)=>{
  const post=(m:any)=>(self as any).postMessage(m);
  try{
    await ensurePdfWorker();
    const {file,maxPages=20}=e.data;
    const pdf=(await getPdfFromData(file));
    const seen:Record<string,number>={}; const total=Math.min(pdf.numPages,maxPages);
    for(let i=1;i<=total;i++){
      const p=await pdf.getPage(i); const c=await p.getTextContent();
      Object.values<any>(c.styles||{}).forEach(s=>{
        const fam=String(s.fontFamily||"").replace(/["']/g,""); if(!fam) return;
        seen[fam]=(seen[fam]||0)+1;
      });
      post({type:"progress",value:Math.round(i/total*95)});
    }
    const fonts=Object.entries(seen).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
    const risky=fonts.filter(f=>ATS_RISK.some(r=>f.name.includes(r)));
    const warnings:string[]=[];
    if(risky.length) warnings.push(`Potentially ATS-unfriendly: ${risky.map(r=>r.name).join(", ")}`);
    if(!fonts.some(f=>ATS_GOOD.some(g=>f.name.includes(g))))
      warnings.push("Consider common system fonts like Arial/Calibri for better ATS parsing.");
    post({type:"result",data:{fonts,warnings,recommended:ATS_GOOD}});
  }catch(err:any){post({type:"error",message:err?.message||"Font check failed"})}
};
