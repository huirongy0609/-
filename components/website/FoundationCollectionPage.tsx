import {Breadcrumb} from '@/components/platform/Breadcrumb';
import {PageTitle} from '@/components/platform/PageTitle';
import {FoundationBrowser} from '@/components/website/FoundationBrowser';
import type {WebsiteObjectQuery, WebsiteObjectType} from '@/lib/website/foundation-view-model';

type FoundationCollectionPageProps = {
  allowedTypes: readonly WebsiteObjectType[];
  basePath: string;
  breadcrumbLabel: string;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  eyebrow: string;
  searchParams: WebsiteObjectQuery & {page?: string};
  title: string;
};

export function FoundationCollectionPage({
  allowedTypes,
  basePath,
  breadcrumbLabel,
  description,
  emptyDescription,
  emptyTitle,
  eyebrow,
  searchParams,
  title,
}: FoundationCollectionPageProps) {
  return (
    <main className="platformPage">
      <section className="platformContainer pb-20">
        <Breadcrumb items={[{href: '/', label: '首页'}, {label: breadcrumbLabel}]} />
        <PageTitle description={description} eyebrow={eyebrow} title={title} />
        <FoundationBrowser
          allowedTypes={allowedTypes}
          basePath={basePath}
          emptyDescription={emptyDescription}
          emptyTitle={emptyTitle}
          searchParams={searchParams}
        />
      </section>
    </main>
  );
}
