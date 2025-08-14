import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) {
    return new Response('No file', { status: 400 });
  }
  const jobId = crypto.randomUUID();
  if (typeof window === 'undefined') {
    // store minimal info in memory for mock resume
    (globalThis as any)._jobs = (globalThis as any)._jobs || {};
    (globalThis as any)._jobs[jobId] = { filename: file.name, size: file.size };
  }
  return Response.json({ jobId, filename: file.name, size: file.size });
}
