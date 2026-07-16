import Link from 'next/link';

type FrameworkPaginationProps = {
  basePath: string;
  page: number;
  pageCount: number;
  searchParams: Record<string, string | undefined>;
};

export function FrameworkPagination({basePath, page, pageCount, searchParams}: FrameworkPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="分页" className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
      <PageLink basePath={basePath} disabled={page <= 1} label="上一页" page={page - 1} searchParams={searchParams} />
      <span className="text-sm font-semibold text-[var(--muted)]">
        第 {page} 页，共 {pageCount} 页
      </span>
      <PageLink basePath={basePath} disabled={page >= pageCount} label="下一页" page={page + 1} searchParams={searchParams} />
    </nav>
  );
}

function PageLink({
  basePath,
  disabled,
  label,
  page,
  searchParams,
}: {
  basePath: string;
  disabled: boolean;
  label: string;
  page: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (disabled) {
    return <span aria-disabled="true" className="text-sm font-semibold text-[var(--subtle)]">{label}</span>;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== 'page') params.set(key, value);
  }
  params.set('page', String(page));

  return <Link className="platformTextLink" href={`${basePath}?${params.toString()}`}>{label}</Link>;
}
