import {NextResponse} from 'next/server';
import {findDemoScenario, toDemoAnswer, type GovernanceAnswer} from '@/lib/trustpm/demo-data';

export const runtime = 'nodejs';

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as {output_text?: unknown; output?: unknown};
  if (typeof record.output_text === 'string') return record.output_text;
  if (!Array.isArray(record.output)) return null;

  for (const item of record.output) {
    if (!item || typeof item !== 'object') continue;
    const content = (item as {content?: unknown}).content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block && typeof block === 'object' && typeof (block as {text?: unknown}).text === 'string') {
        return (block as {text: string}).text;
      }
    }
  }
  return null;
}

async function enhanceWithOpenAI(base: GovernanceAnswer): Promise<GovernanceAnswer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return base;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.6',
      input: [
        {
          role: 'developer',
          content: 'You are TrustPM AI. Rewrite only the assessment, recommendations, steps, and risks in the supplied JSON. Use only the supplied evidence. Preserve scenarioId, question, and sources exactly. Do not invent legal citations. Return valid JSON only.',
        },
        {role: 'user', content: JSON.stringify(base)},
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI request failed with ${response.status}`);
  const payload = await response.json() as unknown;
  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error('OpenAI response did not contain text output');

  const parsed = JSON.parse(outputText.replace(/^```json\s*|\s*```$/g, '')) as Partial<GovernanceAnswer>;
  if (!parsed.assessment || !Array.isArray(parsed.recommendations) || !Array.isArray(parsed.steps) || !Array.isArray(parsed.risks)) {
    throw new Error('OpenAI response did not match the expected governance answer shape');
  }

  return {
    ...base,
    assessment: parsed.assessment,
    recommendations: parsed.recommendations,
    steps: parsed.steps,
    risks: parsed.risks,
    mode: 'openai',
    disclosure: 'OpenAI Mode: GPT-5.6 organized the response using only the controlled evidence set selected by the local retriever. Sources remain fixed and traceable; demo-only items are labelled.',
  };
}

export async function POST(request: Request) {
  let body: {question?: unknown};
  try {
    body = await request.json() as {question?: unknown};
  } catch {
    return NextResponse.json({error: 'Invalid JSON body.'}, {status: 400});
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (question.length < 8 || question.length > 500) {
    return NextResponse.json({error: 'Please provide a question between 8 and 500 characters.'}, {status: 400});
  }

  const base = toDemoAnswer(findDemoScenario(question), question);

  try {
    return NextResponse.json(await enhanceWithOpenAI(base));
  } catch (error) {
    console.error('TrustPM OpenAI enhancement failed; using controlled demo response.', error);
    return NextResponse.json({
      ...base,
      disclosure: `${base.disclosure} OpenAI enhancement was unavailable, so the stable fallback was used.`,
    });
  }
}
