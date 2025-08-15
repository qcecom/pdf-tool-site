import { PDFDocument } from "pdf-lib";
self.onmessage=async(e:MessageEvent<{file:ArrayBuffer}>)=>{
  const post=(m:any,t?:any)=>(self as any).postMessage(m,t);
  try{
    post({type:"progress",value:5});
    const pdf=await PDFDocument.load(e.data.file,{updateMetadata:true});
    pdf.setTitle("");pdf.setAuthor("");pdf.setSubject("");
    pdf.setKeywords([]);pdf.setCreator("");pdf.setProducer("");
    pdf.setCreationDate(new Date(0));pdf.setModificationDate(new Date());
    const out=await pdf.save({useObjectStreams:true,addDefaultPage:false});
    post({type:"result",data:out.buffer},[out.buffer as any]);
  }catch(err:any){post({type:"error",message:err?.message||"Metadata scrub failed"})}
};
