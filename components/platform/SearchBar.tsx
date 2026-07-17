type SearchBarProps = {
  action?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export function SearchBar({
  action = '/knowledge',
  name = 'q',
  placeholder = '开放式预算 / 共同基金 / GT-B07 / 受托关系',
  defaultValue,
  buttonLabel = '搜索',
  compact = false,
}: SearchBarProps) {
  return (
    <form action={action} className={`${compact ? 'platformSearch platformSearchCompact' : 'platformSearch'} max-[760px]:!grid-cols-[auto_minmax(0,1fr)]`}>
      <span aria-hidden="true" className="platformSearchIcon">⌕</span>
      <input aria-label="搜索平台知识" defaultValue={defaultValue} name={name} placeholder={placeholder} />
      <button className="max-[760px]:col-span-2" type="submit">{buttonLabel}</button>
    </form>
  );
}
