import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { resumeText, jobDescription } = await req.json();
  if (!resumeText || !jobDescription) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
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
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: 'Parsing failed' }, { status: 500 });
  }
}
