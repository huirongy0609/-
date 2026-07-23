import {NextResponse} from 'next/server';
import {knowledgeObjectInputSchema} from '@/lib/domain/knowledge-object';
import {createKnowledgeObject, getKnowledgeObjects} from '@/lib/repositories/knowledge-objects';
import {requireAdmin, requireKnowledgeWrites} from '@/lib/security/admin-response';

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const items = await getKnowledgeObjects();
  return NextResponse.json({items});
}

export async function POST(request: Request) {
  const blocked = requireKnowledgeWrites(request);
  if (blocked) return blocked;
  const body = await request.json();
  const parsed = knowledgeObjectInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
  }

  const item = await createKnowledgeObject(parsed.data);
  return NextResponse.json({item}, {status: 201});
}
