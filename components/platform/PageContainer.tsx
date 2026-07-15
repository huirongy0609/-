type PageContainerProps = {
  children: React.ReactNode;
  narrow?: boolean;
};

export function PageContainer({children, narrow = false}: PageContainerProps) {
  return <div className={narrow ? 'platformNarrow' : 'platformContainer'}>{children}</div>;
}
