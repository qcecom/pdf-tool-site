import { NextRequest } from 'next/server';

interface UploadResponse {
  jobId: string;
  filename: string;
  size: number;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) {
    return new Response('No file', { status: 400 });
  }
  const jobId = crypto.randomUUID();
  if (typeof window === 'undefined') {
    // store minimal info in memory for mock resume
    (global as any)._jobs = (global as any)._jobs || {};
    (global as any)._jobs[jobId] = { filename: file.name, size: file.size };
  }
  return Response.json<UploadResponse>({ jobId, filename: file.name, size: file.size });
}
