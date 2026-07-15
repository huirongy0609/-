import Link from 'next/link';

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumb({items}: {items: BreadcrumbItem[]}) {
  return (
    <nav aria-label="面包屑" className="platformBreadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
