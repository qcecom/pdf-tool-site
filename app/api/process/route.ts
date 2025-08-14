import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  return Response.json({ jobId });
}
