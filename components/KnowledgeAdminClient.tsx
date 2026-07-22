'use client';

import {useEffect, useMemo, useState} from 'react';

type KnowledgeObjectType = 'JD' | 'GT' | 'QA' | 'Article';
type KnowledgeObjectStatus = 'Draft' | 'Review' | 'Approved' | 'Superseded' | 'Archived';

type KnowledgeObject = {
  id: string;
  type: KnowledgeObjectType;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  version: string;
  status: KnowledgeObjectStatus;
  references: string[];
  evidenceRefs: string[];
  body: string;
  createdAt: string;
  updatedAt: string;
};

const knowledgeObjectTypeLabels: Record<KnowledgeObjectType, string> = {
  JD: '治理词典',
  GT: '治理工具',
  QA: '标准问答',
  Article: '文章',
};

type KnowledgeObjectFormState = {
  id: string;
  type: KnowledgeObjectType;
  title: string;
  summary: string;
  tags: string;
  category: string;
  version: string;
  status: KnowledgeObjectStatus;
  references: string;
  evidenceRefs: string;
  body: string;
};

const emptyForm: KnowledgeObjectFormState = {
  id: '',
  type: 'Article',
  title: '',
  summary: '',
  tags: '',
  category: '',
  version: 'v0.1',
  status: 'Draft',
  references: '',
  evidenceRefs: '',
  body: '## 标题\n\n在这里输入 Markdown 正文。',
};

const statusOptions: KnowledgeObjectStatus[] = ['Draft', 'Review', 'Approved', 'Superseded', 'Archived'];

export function KnowledgeAdminClient({initialItems}: {initialItems: KnowledgeObject[]}) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string>('');
  const [form, setForm] = useState<KnowledgeObjectFormState>(emptyForm);
  const [message, setMessage] = useState('');
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  useEffect(() => {
    if (!selectedItem) return;
    setForm({
      id: selectedItem.id,
      type: selectedItem.type,
      title: selectedItem.title,
      summary: selectedItem.summary,
      tags: selectedItem.tags.join(', '),
      category: selectedItem.category,
      version: selectedItem.version,
      status: selectedItem.status,
      references: selectedItem.references.join(', '),
      evidenceRefs: selectedItem.evidenceRefs.join(', '),
      body: selectedItem.body,
    });
  }, [selectedItem]);

  async function refreshItems() {
    const response = await fetch('/api/knowledge-objects', {cache: 'no-store'});
    const data = (await response.json()) as {items: KnowledgeObject[]};
    setItems(data.items);
  }

  async function submitForm() {
    setMessage('');
    const payload = toPayload(form);
    const isUpdate = Boolean(selectedId);
    const response = await fetch(isUpdate ? `/api/knowledge-objects/${selectedId}` : '/api/knowledge-objects', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage('保存失败，请检查必填字段。');
      return;
    }

    const data = (await response.json()) as {item: KnowledgeObject};
    await refreshItems();
    setSelectedId(data.item.id);
    setMessage('已保存。');
  }

  async function deleteSelected() {
    if (!selectedId) return;
    const response = await fetch(`/api/knowledge-objects/${selectedId}`, {method: 'DELETE'});

    if (!response.ok) {
      setMessage('删除失败。');
      return;
    }

    await refreshItems();
    setSelectedId('');
    setForm(emptyForm);
    setMessage('已删除。');
  }

  function startCreate() {
    setSelectedId('');
    setForm(emptyForm);
    setMessage('');
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-4">
        <button className="w-full rounded-md bg-[#4fbda8] px-4 py-3 text-sm font-semibold text-[#07110f]" onClick={startCreate} type="button">
          新增知识对象
        </button>
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <button
              className={`w-full rounded-md border px-3 py-3 text-left text-sm transition ${
                selectedId === item.id ? 'border-[#4fbda8] bg-[#4fbda8]/10' : 'border-[#2a3431] bg-[#0b1110]/48 hover:border-[#4fbda8]/45'
              }`}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              type="button"
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#6fafa2]">{knowledgeObjectTypeLabels[item.type]}</span>
              <span className="mt-1 block font-semibold text-[#f3f6f4]">{item.title}</span>
              <span className="mt-1 block text-xs text-[#b8c4bf]">{item.status}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="ObjectID">
            <input className={inputClassName} disabled={Boolean(selectedId)} value={form.id} onChange={(event) => setForm({...form, id: event.target.value})} placeholder="留空自动生成" />
          </Field>
          <Field label="类型">
            <select className={inputClassName} value={form.type} onChange={(event) => setForm({...form, type: event.target.value as KnowledgeObjectType})}>
              {Object.entries(knowledgeObjectTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="标题">
            <input className={inputClassName} value={form.title} onChange={(event) => setForm({...form, title: event.target.value})} />
          </Field>
          <Field label="分类">
            <input className={inputClassName} value={form.category} onChange={(event) => setForm({...form, category: event.target.value})} />
          </Field>
          <Field label="版本">
            <input className={inputClassName} value={form.version} onChange={(event) => setForm({...form, version: event.target.value})} />
          </Field>
          <Field label="状态">
            <select className={inputClassName} value={form.status} onChange={(event) => setForm({...form, status: event.target.value as KnowledgeObjectStatus})}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="摘要">
          <textarea className={textareaClassName} rows={3} value={form.summary} onChange={(event) => setForm({...form, summary: event.target.value})} />
        </Field>
        <Field label="标签（逗号分隔）">
          <input className={inputClassName} value={form.tags} onChange={(event) => setForm({...form, tags: event.target.value})} />
        </Field>
        <Field label="引用对象（逗号分隔）">
          <input className={inputClassName} value={form.references} onChange={(event) => setForm({...form, references: event.target.value})} />
        </Field>
        <Field label="Evidence 引用（逗号分隔）">
          <input className={inputClassName} value={form.evidenceRefs} onChange={(event) => setForm({...form, evidenceRefs: event.target.value})} />
        </Field>
        <Field label="Markdown 正文">
          <textarea className={textareaClassName} rows={12} value={form.body} onChange={(event) => setForm({...form, body: event.target.value})} />
        </Field>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="rounded-md bg-[#4fbda8] px-5 py-3 text-sm font-semibold text-[#07110f]" onClick={submitForm} type="button">
            保存
          </button>
          <button className="rounded-md border border-[#2a3431] px-5 py-3 text-sm font-semibold text-[#b8c4bf]" disabled={!selectedId} onClick={deleteSelected} type="button">
            删除
          </button>
          {message ? <p className="text-sm text-[#b8c4bf]">{message}</p> : null}
        </div>
      </section>
    </div>
  );
}

function Field({children, label}: {children: React.ReactNode; label: string}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#6fafa2]">{label}</span>
      {children}
    </label>
  );
}

function toPayload(form: KnowledgeObjectFormState) {
  return {
    id: form.id.trim() || undefined,
    type: form.type,
    title: form.title,
    summary: form.summary,
    tags: readCommaList(form.tags),
    category: form.category,
    version: form.version,
    status: form.status,
    references: readCommaList(form.references),
    evidenceRefs: readCommaList(form.evidenceRefs),
    body: form.body,
  };
}

function readCommaList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const inputClassName = 'w-full rounded-md border border-[#2a3431] bg-[#0b1110] px-4 py-3 text-sm text-[#f3f6f4] outline-none focus:border-[#4fbda8] disabled:opacity-60';
const textareaClassName = 'w-full rounded-md border border-[#2a3431] bg-[#0b1110] px-4 py-3 text-sm leading-7 text-[#f3f6f4] outline-none focus:border-[#4fbda8]';
