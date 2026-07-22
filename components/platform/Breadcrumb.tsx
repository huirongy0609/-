import Link from 'next/link';
import {JsonLd} from '@/components/geo/JsonLd';
import {absoluteUrl} from '@/lib/geo/site';

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumb({items}: {items: BreadcrumbItem[]}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? {item: absoluteUrl(item.href)} : {}),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="面包屑" className="platformBreadcrumb">
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </span>
        ))}
      </nav>
    </>
  );
}
