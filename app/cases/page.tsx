import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '案例中心',
  description: '浏览已批准并进入 Foundation 的 CASE 对象。',
  alternates: {canonical: '/cases'},
};

export default function CasesPage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['CASE']}
      basePath="/cases"
      breadcrumbLabel="案例中心"
      description="案例中心只读取已批准的 CASE 对象，不使用旧案例 Mock 数据。"
      emptyDescription="当前 Foundation 尚无可公开 CASE；待 Knowledge PR 批准入库后自动呈现。"
      emptyTitle="暂无公开案例"
      eyebrow="Cases Center"
      searchParams={searchParams}
      title="案例中心"
    />
  );
}
