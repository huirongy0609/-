import {NextResponse} from 'next/server';
import {knowledgeObjectInputSchema} from '@/lib/domain/knowledge-object';
import {deleteKnowledgeObject, getKnowledgeObjectById, updateKnowledgeObject} from '@/lib/repositories/knowledge-objects';
import {requireAdmin, requireKnowledgeWrites} from '@/lib/security/admin-response';

export async function GET(request: Request, {params}: {params: {id: string}}) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const item = await getKnowledgeObjectById(params.id);

  if (!item) {
    return NextResponse.json({error: 'Knowledge object not found'}, {status: 404});
  }

  return NextResponse.json({item});
}

export async function PUT(request: Request, {params}: {params: {id: string}}) {
  const blocked = requireKnowledgeWrites(request);
  if (blocked) return blocked;
  const body = await request.json();
  const parsed = knowledgeObjectInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
  }

  const item = await updateKnowledgeObject(params.id, parsed.data);
  if (!item) {
    return NextResponse.json({error: 'Knowledge object not found'}, {status: 404});
  }

  return NextResponse.json({item});
}

export async function DELETE(request: Request, {params}: {params: {id: string}}) {
  const blocked = requireKnowledgeWrites(request);
  if (blocked) return blocked;
  const deleted = await deleteKnowledgeObject(params.id);

  if (!deleted) {
    return NextResponse.json({error: 'Knowledge object not found'}, {status: 404});
  }

  return NextResponse.json({ok: true});
}
