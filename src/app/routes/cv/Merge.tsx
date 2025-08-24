import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { mergeFiles } from '@/lib/pdf/merge';
import { prettyBytes } from '@/lib/pdf/bytes';
import { Toast } from '@/ui/toast';

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [out, setOut] = useState<Uint8Array | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const show = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2000);
  };
  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { 'application/pdf': ['.pdf'] },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const arr = Array.from(files);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);
    setFiles(arr);
  };

  const mergeNow = async () => {
    show('Processing...');
    try {
      const bytes = await mergeFiles(files);
      setOut(bytes);
      show('Done');
    } catch {
      show('Failed');
    }
  };

  const download = () => {
    if (!out) return;
    const blob = new Blob([out], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div
        {...getRootProps()}
        className="p-4 border border-dashed text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        Drop PDFs here or click to choose
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2"
            >
              {files.map((f, idx) => (
                <Draggable key={f.name + idx} draggableId={f.name + idx} index={idx}>
                  {(p) => (
                    <div
                      ref={p.innerRef}
                      {...p.draggableProps}
                      {...p.dragHandleProps}
                      className="p-2 border flex justify-between"
                    >
                      <span>{f.name}</span>
                      <span>{prettyBytes(f.size)}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {files.length > 1 && (
        <button className="btn" onClick={mergeNow}>
          Merge Now
        </button>
      )}
      {out && (
        <button className="btn" onClick={download}>
          Download
        </button>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
