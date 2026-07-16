import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FAQ 中心',
  description: '浏览已批准并进入 Foundation 的 FAQ 对象。',
  alternates: {canonical: '/faq'},
};

export default function FaqPage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['FAQ']}
      basePath="/faq"
      breadcrumbLabel="FAQ 中心"
      description="FAQ 中心以问题路径连接已批准的知识、标准、案例与法规对象。"
      emptyDescription="当前 Foundation 尚无可公开 FAQ；页面保持真实空状态。"
      emptyTitle="暂无公开 FAQ"
      eyebrow="FAQ Center"
      searchParams={searchParams}
      title="FAQ 中心"
    />
  );
}
