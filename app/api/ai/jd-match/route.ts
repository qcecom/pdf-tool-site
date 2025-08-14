import { NextResponse } from 'next/server';

interface MatchRequest {
  resumeText: string;
  jobDescription: string;
}

interface MatchSuccess {
  score: number;
  missingKeywords: string[];
  improvedBullets: string[];
}

interface MatchError {
  error: string;
}

export async function POST(req: Request) {
  const { resumeText, jobDescription } = (await req.json()) as MatchRequest;
  if (!resumeText || !jobDescription) {
    return NextResponse.json<MatchError>({ error: 'Missing fields' }, { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json<MatchError>({ error: 'Missing API key' }, { status: 500 });
  }
  const prompt = `Resume:\n${resumeText}\nJob:\n${jobDescription}\nRespond JSON {"score":number,"missingKeywords":[],"improvedBullets":[]}`;
  const body = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  };
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  try {
    const text = data.choices[0].message.content;
    const parsed = JSON.parse(text) as MatchSuccess;
    return NextResponse.json<MatchSuccess>(parsed);
  } catch (e) {
    return NextResponse.json<MatchError>({ error: 'Parsing failed' }, { status: 500 });
  }
}
