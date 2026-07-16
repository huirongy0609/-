import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '知识中心',
  description: '跨 JD、GT Package、CASE、LAW 与 FAQ 检索可公开 Foundation 对象。',
  alternates: {canonical: '/knowledge'},
};

export default function KnowledgePage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['JD', 'GT_PACKAGE', 'CASE', 'LAW', 'FAQ']}
      basePath="/knowledge"
      breadcrumbLabel="知识中心"
      description="按对象类型、来源和稳定标识检索已批准的 Foundation 对象。"
      emptyDescription="请调整关键词或筛选条件；页面不会生成模拟知识对象。"
      emptyTitle="没有匹配的公开知识对象"
      eyebrow="Knowledge Center"
      searchParams={searchParams}
      title="知识中心"
    />
  );
}
