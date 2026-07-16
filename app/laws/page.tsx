import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '法律法规中心',
  description: '浏览已批准并进入 Foundation 的 LAW 对象。',
  alternates: {canonical: '/laws'},
};

export default function LawsPage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['LAW']}
      basePath="/laws"
      breadcrumbLabel="法律法规中心"
      description="法律法规中心提供 LAW 对象的统一检索与列表框架。"
      emptyDescription="当前 Foundation 尚无可公开 LAW；页面不会补写法规内容。"
      emptyTitle="暂无公开法律法规"
      eyebrow="Laws Center"
      searchParams={searchParams}
      title="法律法规中心"
    />
  );
}
