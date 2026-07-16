import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '研究中心',
  description: '浏览已批准并进入 Foundation 的 RESEARCH 对象。',
  alternates: {canonical: '/research'},
};

export default function ResearchPage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['RESEARCH']}
      basePath="/research"
      breadcrumbLabel="研究中心"
      description="研究中心为专题研究、政策观察、方法论和行业判断提供统一对象框架。"
      emptyDescription="当前 Foundation 尚无可公开 RESEARCH；页面不会引入其它 Registry 的预留内容。"
      emptyTitle="暂无公开研究对象"
      eyebrow="Research Center"
      searchParams={searchParams}
      title="研究中心"
    />
  );
}
