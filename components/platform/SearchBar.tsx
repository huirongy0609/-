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
  placeholder = '什么是信托制物业？什么是开放式预算？公共收益归谁？',
  defaultValue,
  buttonLabel = '搜索',
  compact = false,
}: SearchBarProps) {
  return (
    <form action={action} className={compact ? 'platformSearch platformSearchCompact' : 'platformSearch'}>
      <span aria-hidden="true" className="platformSearchIcon">⌕</span>
      <input aria-label="搜索平台知识" defaultValue={defaultValue} name={name} placeholder={placeholder} />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
}
