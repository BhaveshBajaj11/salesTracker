
type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-md md:text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </header>
  );
}
