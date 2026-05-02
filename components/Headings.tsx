type HeadingProps = {
    title: string;
    subtitle?: string;
}

export default function Headings({ title, subtitle }: HeadingProps) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      </div>
    );
}