import { jsPDF } from 'jspdf';
import React from 'react';

export default function Samples(){
  async function makeTextOnly(){
    const doc = new jsPDF(); doc.setFontSize(12);
    for(let p=0;p<3;p++){ if(p) doc.addPage(); for(let i=0;i<40;i++) doc.text(`Line ${i+1} — Lorem ipsum dolor sit amet.`, 20, 20 + i*12); }
    return new Blob([doc.output('arraybuffer')], { type:'application/pdf' });
  }
  async function makeImageHeavy(){
    const doc = new jsPDF(); const img = await fetch('https://picsum.photos/1200/1600').then(r=>r.blob());
    const dataUrl = await new Promise<string>(res => { const fr = new FileReader(); fr.onload=()=>res(fr.result as string); fr.readAsDataURL(img); });
    for(let p=0;p<3;p++){ if(p) doc.addPage(); doc.addImage(dataUrl, 'JPEG', 0, 0, 595, 842); }
    return new Blob([doc.output('arraybuffer')], { type:'application/pdf' });
  }

  async function download(name: string, blob: Blob){
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sample PDFs</h1>
      <button onClick={async()=>download('text-only.pdf', await makeTextOnly())} className="btn">Generate text-only</button>
      <button onClick={async()=>download('image-heavy.pdf', await makeImageHeavy())} className="btn">Generate image-heavy</button>
      <p className="text-sm opacity-70">Use these to measure Compress presets (Smart, ATS-safe, Email&lt;2MB, Smallest).</p>
    </div>
  );
}
