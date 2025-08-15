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

const DBG=import.meta.env.VITE_DEBUG==="true";

export default function MetadataScrub(){
  useMeta({title:"Metadata Scrub - nouploadpdf.com",description:"Remove hidden PDF metadata"});
  const {run,progress,status,error,result}=useWorker(ScrubWorker,"metadata-scrub");
  const handleFile=async(file:File)=>{DBG&&console.log("[metadata-scrub] picked",file.name,file.size);const buf=await file.arrayBuffer();run({file:buf},[buf]);};
  useEffect(()=>{if(status==="done"&&result instanceof ArrayBuffer){DBG&&console.log("[metadata-scrub] finished",result.byteLength);downloadBuffer(result,"scrubbed.pdf");}},[status,result]);
  useEffect(()=>{if(status==="error"&&error&&DBG)console.log("[metadata-scrub] error",error);},[status,error]);
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
