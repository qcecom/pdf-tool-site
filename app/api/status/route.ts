export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId') || '';
  if (process.env.MOCK_PROGRESS !== '1') {
    return new Response('Mock only', { status: 501 });
  }
  const stream = new ReadableStream({
    start(controller) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += 10;
        const progress = {
          phase: 'processing',
          percent,
          bytesDone: percent,
          bytesTotal: 100,
          etaSeconds: Math.max(0, (100 - percent) / 10),
        };
        controller.enqueue(
          `event: progress\n` +
            `data: ${JSON.stringify(progress)}\n\n`
        );
        if (percent >= 100) {
          clearInterval(interval);
          controller.enqueue(
            `event: done\n` +
              `data: ${JSON.stringify({ downloadUrl: `/api/download/${jobId}` })}\n\n`
          );
          controller.close();
        }
      }, 500);
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
