import {NextResponse} from 'next/server';
import {knowledgeObjectInputSchema} from '@/lib/domain/knowledge-object';
import {createKnowledgeObject, getKnowledgeObjects} from '@/lib/repositories/knowledge-objects';

export async function GET() {
  const items = await getKnowledgeObjects();
  return NextResponse.json({items});
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = knowledgeObjectInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
  }

  const item = await createKnowledgeObject(parsed.data);
  return NextResponse.json({item}, {status: 201});
}
