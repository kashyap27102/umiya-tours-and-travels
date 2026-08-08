import Link from "next/link";
import { Card, CardTitle, CardBody, CardFooter } from "@/components/ui";
import { Button } from "@/components/ui";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  ctaLabel = "Learn More",
  ctaHref = "/about",
}: ServiceCardProps) {
  return (
    <Card
      variant="default"
      padding="md"
      className="flex flex-col gap-4 hover:shadow-[0_14px_36px_rgb(var(--brand-blue-rgb)/0.16)] transition-shadow"
    >
      {/* Icon badge */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-700/10 text-brand-blue-700">
        {icon}
      </div>

      <div className="flex-1">
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardBody>{description}</CardBody>
      </div>

      <CardFooter className="pt-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-0 text-brand-blue-700 underline-offset-4 hover:underline"
        >
          <Link href={ctaHref}>{ctaLabel} →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
