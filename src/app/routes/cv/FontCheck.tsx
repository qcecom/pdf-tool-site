import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import FontWorker from "@/pdf/workers/fontCheck.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

interface FontInfo{ name:string; count:number }
interface FontResult{ fonts:FontInfo[]; warnings:string[]; recommended:string[] }

export default function FontCheck(){
  useMeta({title:"Font Check - nouploadpdf.com",description:"Detect risky fonts in your CV"});
  const {run,progress,status,error,result}=useWorker(FontWorker);
  const handleFile=async(file:File)=>{ const buf=await file.arrayBuffer(); run({file:buf},[buf]); };
  const res=result as FontResult | null;
  return(
    <>
      <Header/>
      <main className="container">
        <h2>Font Check</h2>
        <Dropzone onFile={handleFile}/>
        {status==="working"&&<ProgressBar progress={progress}/>}
        {error&&<Toast message={error} onClose={()=>{}}/>}
        {status==="done"&&res&&(
          <div>
            {res.warnings.length>0&&<p style={{color:"var(--muted)"}}>{res.warnings.join(" ")}</p>}
            <ul>
              {res.fonts.map(f=>(<li key={f.name}>{f.name} ({f.count})</li>))}
            </ul>
          </div>
        )}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Prefer common system fonts for better ATS parsing.</aside>
      </main>
      <Footer/>
    </>
  );
}
