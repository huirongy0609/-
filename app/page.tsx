import {
  ContentCardGrid,
  HeroSection,
  HomeSection,
  PageShell,
  PortalEntryGrid,
  portalEntries,
} from '@/components/KnowledgePortalMvp';
import {knowledgeObjectTypeLabels} from '@/lib/domain/knowledge-object';
import {getKnowledgeObjects, getKnowledgeObjectsByType} from '@/lib/repositories/knowledge-objects';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [latestKnowledge, latestArticles] = await Promise.all([getKnowledgeObjects(), getKnowledgeObjectsByType('Article')]);
  const knowledgeCards = latestKnowledge.slice(0, 6).map((item) => ({
    title: item.title,
    summary: item.summary,
    tag: knowledgeObjectTypeLabels[item.type],
  }));
  const articleCards = latestArticles.slice(0, 3).map((item) => ({
    title: item.title,
    summary: item.summary,
    tag: item.category,
  }));

  return (
    <PageShell>
      <HeroSection />
      <PortalEntryGrid entries={portalEntries} />

      <HomeSection eyebrow="Knowledge Objects" title="最新知识">
        <ContentCardGrid items={knowledgeCards} />
      </HomeSection>

      <HomeSection eyebrow="Articles" title="最新文章">
        <ContentCardGrid items={articleCards} />
      </HomeSection>
    </PageShell>
  );
}
