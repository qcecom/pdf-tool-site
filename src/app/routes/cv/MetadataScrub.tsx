import { useEffect } from "react";
import Dropzone from "@/app/components/Dropzone";
import ProgressBar from "@/app/components/ProgressBar";
import Toast from "@/app/components/Toast";
import { useWorker } from "@/app/hooks/useWorker";
import { downloadBuffer } from "@/pdf/utils";
import ScrubWorker from "@/pdf/workers/metadataScrub.worker?worker";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function MetadataScrub(){
  useMeta({title:"Metadata Scrub - ATS CV Toolkit",description:"Remove hidden PDF metadata"});
  const {run,progress,status,error,result}=useWorker(ScrubWorker);
  const handleFile=async(file:File)=>{
    const buf=await file.arrayBuffer();
    run({file:buf});
  };
  useEffect(()=>{if(status==="done"&&result instanceof ArrayBuffer){downloadBuffer(result,"scrubbed.pdf");}},[status,result]);
  return(
    <>
      <Header/>
      <main className="container">
        <h2>Metadata Scrub</h2>
        <Dropzone onFile={handleFile}/>
        {status==="working"&&<ProgressBar progress={progress}/>} 
        {error&&<Toast message={error} onClose={()=>{}}/>}
        <aside style={{marginTop:12,color:"var(--muted)"}}>Strips title, author, and other metadata.</aside>
      </main>
      <Footer/>
    </>
  );
}
