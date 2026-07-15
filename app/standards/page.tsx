import type {Metadata} from 'next';
import {EmptyState} from '@/components/platform/EmptyState';
import {PageTitle} from '@/components/platform/PageTitle';
import {StandardCard} from '@/components/platform/StandardCard';
import {getPlatformStandards} from '@/lib/repositories/standards';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '标准中心',
  description: '阅读中国信托制物业发展平台当前批准或提交审核的治理标准。',
  alternates: {canonical: '/standards'},
};

export default async function StandardsPage() {
  const standards = await getPlatformStandards();

  return (
    <main className="platformPage">
      <section className="platformContainer">
        <PageTitle
          description="标准中心用于阅读平台当前批准或提交审核的治理标准，与历史 Source Archive 分轨管理。"
          eyebrow="Standards Center"
          title="标准中心"
        />

        {standards.length ? (
          <div className="platformGrid platformGridTwo">
            {standards.map((standard) => (
              <StandardCard
                href={`/standards/${standard.slug}`}
                key={standard.slug}
                status={standard.status}
                summary={standard.summary}
                title={standard.title}
                version={standard.version}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="当前标准目录为空" description="标准中心不会生成模拟标准。" />
        )}
      </section>
    </main>
  );
}
