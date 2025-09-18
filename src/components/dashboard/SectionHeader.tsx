interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold text-foreground mb-1">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}