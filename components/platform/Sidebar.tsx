type SidebarProps = {
  title: string;
  children: React.ReactNode;
};

export function Sidebar({title, children}: SidebarProps) {
  return (
    <aside className="platformSidebar">
      <h2>{title}</h2>
      {children}
    </aside>
  );
}
