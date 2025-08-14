'use client';
import { useCallback, useEffect, useState } from 'react';
import DropZone from '@/components/DropZone';
import FileCard from '@/components/ux/FileCard';
import StatusToast from '@/components/ux/StatusToast';
import SecurityNote from '@/components/ux/SecurityNote';
import useSSE from '@/lib/useSSE';
import { uploadWithProgress } from '@/lib/uploadWithProgress';
import { FileJob } from '@/lib/jobTypes';

const ERROR_MESSAGES: Record<string, string> = {
  E_UNSUPPORTED_TYPE: 'Unsupported file type.',
  E_TOO_LARGE: 'File too large.',
  E_UPLOAD_FAIL: 'Upload failed.',
  E_PROCESS_FAIL: 'Processing failed.',
  E_STATUS_LOST: 'Connection lost.',
};

export default function ImageToPdfPage() {
  const [jobs, setJobs] = useState<FileJob[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const updateJob = useCallback((index: number, patch: Partial<FileJob>) => {
    setJobs((js) => {
      const arr = [...js];
      arr[index] = { ...arr[index], ...patch };
      return arr;
    });
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newJobs = files.map((f) => ({
      file: f,
      filename: f.name,
      size: f.size,
      state: 'IDLE' as const,
      progress: 0,
    }));
    setJobs((j) => [...j, ...newJobs]);
  }, []);

  // start next job automatically
  useEffect(() => {
    const active = jobs.findIndex((j) => j.state === 'UPLOADING' || j.state === 'PROCESSING');
    if (active !== -1) return;
    const next = jobs.findIndex((j) => j.state === 'IDLE');
    if (next !== -1) startUpload(next);
  }, [jobs]);

  const startUpload = (index: number) => {
    const job = jobs[index];
    const controller = new AbortController();
    updateJob(index, { state: 'UPLOADING', controller });
    uploadWithProgress(
      job.file!,
      (info) => updateJob(index, { progress: info.percent, eta: info.etaSeconds }),
      controller.signal
    )
      .then((res) => {
        updateJob(index, {
          jobId: res.jobId,
          filename: res.filename,
          size: res.size,
          state: 'PROCESSING',
          progress: 0,
        });
        localStorage.setItem('job-' + res.jobId, JSON.stringify({ filename: res.filename, size: res.size }));
        location.hash = res.jobId;
        fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: res.jobId, operation: 'image-to-pdf' }),
        }).catch(() => {
          updateJob(index, {
            state: 'ERROR',
            error: { code: 'E_PROCESS_FAIL', message: ERROR_MESSAGES.E_PROCESS_FAIL },
          });
        });
      })
      .catch(() => {
        updateJob(index, {
          state: 'ERROR',
          error: { code: 'E_UPLOAD_FAIL', message: ERROR_MESSAGES.E_UPLOAD_FAIL },
        });
      });
  };

  const processingJob = jobs.find((j) => j.state === 'PROCESSING');
  const currentId = processingJob?.jobId;

  const sseRef = useSSE(currentId, {
    onProgress: (p) => {
      const idx = jobs.findIndex((j) => j.jobId === currentId);
      if (idx !== -1) updateJob(idx, { progress: p.percent, eta: p.etaSeconds });
    },
    onDone: (d) => {
      const idx = jobs.findIndex((j) => j.jobId === currentId);
      if (idx !== -1)
        updateJob(idx, { state: 'DONE', downloadUrl: d.downloadUrl, progress: 100, eta: 0 });
      setToast({ message: 'Ready to download', type: 'success' });
      if (currentId) {
        localStorage.removeItem('job-' + currentId);
        if (location.hash.slice(1) === currentId) location.hash = '';
      }
    },
    onError: (e) => {
      const idx = jobs.findIndex((j) => j.jobId === currentId);
      if (idx !== -1)
        updateJob(idx, { state: 'ERROR', error: { code: e.code, message: e.message } });
      setToast({ message: e.message, type: 'error' });
      if (currentId) {
        localStorage.removeItem('job-' + currentId);
        if (location.hash.slice(1) === currentId) location.hash = '';
      }
    },
  });

  const cancelJob = (index: number) => {
    const job = jobs[index];
    job.controller?.abort();
    sseRef.current?.close();
    updateJob(index, {
      state: 'ERROR',
      error: { code: 'E_UPLOAD_FAIL', message: 'Cancelled' },
    });
    if (job.jobId) localStorage.removeItem('job-' + job.jobId);
    if (location.hash.slice(1) === job.jobId) location.hash = '';
  };

  const retryJob = (index: number) => {
    updateJob(index, { state: 'IDLE', progress: 0, eta: undefined, error: undefined });
  };

  // resume on refresh
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) {
      const info = localStorage.getItem('job-' + id);
      if (info) {
        const data = JSON.parse(info);
        setJobs([
          {
            file: null,
            filename: data.filename,
            size: data.size,
            jobId: id,
            state: 'PROCESSING',
            progress: 0,
          },
        ]);
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Image to PDF</h1>
      <DropZone accept="image/*" onFiles={handleFiles} />
      {window?.isSecureContext && (
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <span>🔒</span> HTTPS protected
        </p>
      )}
      {jobs.map((job, idx) => (
        <FileCard
          key={idx}
          job={job}
          onCancel={() => cancelJob(idx)}
          onRetry={() => retryJob(idx)}
        />
      ))}
      {jobs.some((j) => j.state === 'DONE') && <SecurityNote />}
      {toast && (
        <StatusToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
