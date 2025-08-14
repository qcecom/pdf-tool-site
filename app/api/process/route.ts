import { NextRequest } from 'next/server';

interface ProcessRequest {
  jobId: string;
}

interface ProcessResponse {
  jobId: string;
}

export async function POST(req: NextRequest) {
  const { jobId } = (await req.json()) as ProcessRequest;
  return Response.json<ProcessResponse>({ jobId });
}
