import Link from 'next/link';
import {EmptyState} from '@/components/platform/EmptyState';
import {FrameworkPagination} from '@/components/website/FrameworkPagination';
import {WebsiteObjectCard} from '@/components/website/WebsiteObjectCard';
import {getPublicWebsiteObjects} from '@/lib/repositories/website-foundation';
import {
  filterWebsiteObjects,
  paginateWebsiteObjects,
  websiteTypeLabels,
  type WebsiteObjectQuery,
  type WebsiteObjectType,
} from '@/lib/website/foundation-view-model';

type FoundationBrowserProps = {
  allowedTypes: readonly WebsiteObjectType[];
  basePath: string;
  emptyDescription: string;
  emptyTitle: string;
  pageSize?: number;
  searchParams: WebsiteObjectQuery & {page?: string};
};

export async function FoundationBrowser({
  allowedTypes,
  basePath,
  emptyDescription,
  emptyTitle,
  pageSize = 9,
  searchParams,
}: FoundationBrowserProps) {
  const objects = await getPublicWebsiteObjects();
  const eligibleObjects = objects.filter((object) => allowedTypes.includes(object.type));
  const sources = [...new Set(eligibleObjects.flatMap((object) => object.sources))].sort((a, b) => a.localeCompare(b));
  const filtered = filterWebsiteObjects(objects, searchParams, allowedTypes);
  const result = paginateWebsiteObjects(filtered, searchParams.page, pageSize);
  const activeType = allowedTypes.includes(searchParams.type as WebsiteObjectType)
    ? searchParams.type as WebsiteObjectType
    : allowedTypes.length === 1 ? allowedTypes[0] : '';
  const hasFilters = Boolean(searchParams.q || searchParams.source || searchParams.sort || (searchParams.type && allowedTypes.length > 1));
  const controlId = basePath === '/' ? 'home' : basePath.slice(1).replaceAll('/', '-');

  return (
    <section aria-label="Foundation 对象浏览器" className="mt-8">
      <form action={basePath} className="platformFilterPanel">
        <label className="sr-only" htmlFor={`${controlId}-query`}>搜索</label>
        <input
          defaultValue={searchParams.q}
          id={`${controlId}-query`}
          name="q"
          placeholder="搜索 Object ID、标题或来源"
        />
        <label className="sr-only" htmlFor={`${controlId}-type`}>对象类型</label>
        <select defaultValue={activeType} id={`${controlId}-type`} name="type">
          {allowedTypes.length > 1 ? <option value="">全部对象类型</option> : null}
          {allowedTypes.map((type) => <option key={type} value={type}>{websiteTypeLabels[type]}</option>)}
        </select>
        <label className="sr-only" htmlFor={`${controlId}-source`}>来源</label>
        <select defaultValue={searchParams.source ?? ''} id={`${controlId}-source`} name="source">
          <option value="">全部来源</option>
          {sources.map((source) => <option key={source} value={source}>{source}</option>)}
        </select>
        <label className="sr-only" htmlFor={`${controlId}-sort`}>排序</label>
        <select defaultValue={searchParams.sort ?? 'id'} id={`${controlId}-sort`} name="sort">
          <option value="id">按 Object ID</option>
          <option value="updated">按更新时间</option>
          <option value="title">按标题</option>
        </select>
        <button type="submit">应用筛选</button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted)]">{result.total} 个可公开 Foundation 对象</p>
        {hasFilters ? <Link className="platformTextLink" href={basePath}>清除筛选</Link> : null}
      </div>

      <section aria-live="polite" className="platformSection !pt-8">
        {result.items.length ? (
          <div className="platformGrid platformGridThree">
            {result.items.map((item) => <WebsiteObjectCard item={item} key={item.id} />)}
          </div>
        ) : (
          <EmptyState description={emptyDescription} title={emptyTitle} />
        )}
      </section>

      <FrameworkPagination
        basePath={basePath}
        page={result.page}
        pageCount={result.pageCount}
        searchParams={searchParams}
      />
    </section>
  );
}
