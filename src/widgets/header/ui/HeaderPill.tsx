interface HeaderPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
}

export function HeaderPill({ icon, label, value, secondary }: HeaderPillProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-sm border-r border-border">
      {icon}
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
      {secondary ? (
        <>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{secondary}</span>
        </>
      ) : null}
    </div>
  );
}
