import type {Metadata} from 'next';
import {BetaNav} from '@/components/beta/BetaNav';
import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {PageTitle} from '@/components/platform/PageTitle';

export const metadata: Metadata = {
  title: '关于平台',
  description: '了解中国信托制物业发展平台的定位、发布方式与 Beta 数据边界。',
  alternates: {canonical: '/about'},
};

export default function AboutPage() {
  return (
    <main className="platformPage">
      <article className="platformNarrow pb-20">
        <BetaNav />
        <Breadcrumb items={[{href: '/', label: '首页'}, {label: '关于平台'}]} />
        <PageTitle
          description="建设可运行、可维护、可扩展的信托制物业知识发布平台。"
          eyebrow="About judao.club"
          title="中国信托制物业发展平台"
        />

        <div className="grid gap-6 pt-8">
          <section className="articleBody">
            <h2>平台定位</h2>
            <p>judao.club 面向物业企业、街道社区、业委会、研究者与公共治理参与者，持续发布信托制物业相关知识、治理标准、案例、法律依据、常见问题与研究成果。</p>
          </section>
          <section className="articleBody">
            <h2>为什么使用 Topic</h2>
            <p>单个知识对象解决一个明确问题，Topic 则把相关 JD、GT、FAQ、LAW、CASE 与 Research 组织成连续阅读路径。用户可以先理解概念，再进入标准、案例与依据。</p>
          </section>
          <section className="articleBody">
            <h2>Beta 数据边界</h2>
            <p>正式知识只展示 Approved 且 Foundation Ready 的对象。当前正式 Website Ready Topic 为 0，因此 Topic 页面使用明确标注的 Beta Preview 目录验证产品结构；待 Topic 通过 Architecture Review 并进入 Foundation 后，由正式 Provider 替换。</p>
          </section>
          <section className="articleBody">
            <h2>本阶段</h2>
            <p>Website Beta Sprint 1 优先交付可浏览、可搜索、可持续迭代的网站基础版本。登录、收藏、评论、个性化推荐与 AI 对话不在本阶段范围内。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
