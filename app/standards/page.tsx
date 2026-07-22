import type {Metadata} from 'next';
import {FoundationCollectionPage} from '@/components/website/FoundationCollectionPage';
import type {WebsiteObjectQuery} from '@/lib/website/foundation-view-model';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '治理标准中心',
  description: '以 GT Package 为一级对象组织已批准的治理标准包。',
  alternates: {canonical: '/standards'},
};

export default function StandardsPage({searchParams}: {searchParams: WebsiteObjectQuery & {page?: string}}) {
  return (
    <FoundationCollectionPage
      allowedTypes={['GT_PACKAGE']}
      basePath="/standards"
      breadcrumbLabel="治理标准中心"
      description="治理标准中心只承载 GT Package，不混入平台建设标准。"
      emptyDescription="当前 Foundation 尚无可公开的 GT Package；页面保持真实空状态。"
      emptyTitle="暂无公开 GT Package"
      eyebrow="Standards Center"
      searchParams={searchParams}
      title="治理标准中心"
    />
  );
}
