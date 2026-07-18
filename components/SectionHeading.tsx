import { Badge, cn } from "@/components/ui";

type SectionHeadingProps = {
  eyebrow?: string;
  badge?: string;
  title: string;
  maxWidth?: "md" | "lg" | "xl";
  className?: string;
};

const MAX_WIDTH_CLASSES = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
} as const;

export default function SectionHeading({
  eyebrow,
  badge,
  title,
  maxWidth = "lg",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8", MAX_WIDTH_CLASSES[maxWidth], className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue-700">
          {eyebrow}
        </p>
      )}
      {badge && (
        <Badge variant="brand" className="mb-3">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl font-bold text-brand-ink-900 md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
