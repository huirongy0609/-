import Link from 'next/link';
import {foundationTypeLabels, lifecycleLabels, type FoundationKnowledgeObject} from '@/lib/domain/foundation';

export function FoundationObjectCard({item}: {item: FoundationKnowledgeObject}) {
  const status = item.lifecycleStatus ? lifecycleLabels[item.lifecycleStatus] : '状态未登记';

  return (
    <Link
      className="block rounded-lg border border-[#2a3431] bg-[#151c1a]/72 p-5 transition duration-150 hover:-translate-y-0.5 hover:border-[#4fbda8]/45"
      href={`/knowledge/${item.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6fafa2]">
          {item.id} · {foundationTypeLabels[item.type]}
        </p>
        <span className="rounded-full border border-[#2a3431] px-2.5 py-1 text-xs text-[#b8c4bf]">{status}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-8 text-[#f3f6f4]">{item.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#b8c4bf]">{item.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#4fbda8]/10 px-2.5 py-1 text-xs text-[#9bd8cd]">{item.category}</span>
        {item.tags.slice(0, 2).map((tag) => (
          <span className="rounded-full border border-[#2a3431] px-2.5 py-1 text-xs text-[#b8c4bf]" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
