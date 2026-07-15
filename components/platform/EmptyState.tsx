type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({title, description}: EmptyStateProps) {
  return (
    <div className="emptyState">
      <p>{title}</p>
      {description ? <span>{description}</span> : null}
    </div>
  );
}
