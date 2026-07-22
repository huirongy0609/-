import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '文章中心',
  description: '浏览已批准并可公开引用的信托制物业治理文章。',
  alternates: {canonical: '/articles'},
};

export default function ArticlesPage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['ARTICLE']}
      basePath="/articles"
      breadcrumbLabel="文章中心"
      description="文章中心承载已经批准、可长期引用的治理解释与行业内容。"
      emptyDescription="当前尚无已批准文章；页面不会生成模拟内容。"
      emptyTitle="暂无公开文章"
      eyebrow="Articles"
      searchParams={searchParams}
      title="文章中心"
    />
  );
}
