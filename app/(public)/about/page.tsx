import { createMetadata } from "@/lib/metadata";
import { Card, CardTitle, CardBody } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import { SettingsService } from "@/services";

export const metadata = createMetadata({
  title: "About Us | Umiya Tours & Travels",
  description:
    "Learn about Umiya Tours & Travels — our story, values, and what makes us the most trusted travel agency in Gandhinagar, Gujarat.",
  path: "/about",
  keywords: [
    "about Umiya Tours",
    "travel agency Gandhinagar",
    "Gujarat travel company",
  ],
});

const VALUES = [
  {
    icon: "🛡️",
    title: "Safety First",
    body: "All our vehicles are regularly serviced. Our drivers are trained and verified for your peace of mind.",
  },
  {
    icon: "🛋️",
    title: "Maximum Comfort",
    body: "From AC cabs to luxury coaches, every vehicle is kept clean and comfortable for every trip.",
  },
  {
    icon: "🤝",
    title: "Reliability",
    body: "We show up on time — always. Our customers trust us because we take punctuality seriously.",
  },
  {
    icon: "💛",
    title: "Customer First",
    body: "Your satisfaction is our priority. We tailor every journey to your specific needs and budget.",
  },
];

export default async function AboutPage() {
  const settings = await SettingsService.getCachedSettings();

  return (
    <main className="travel-shell flex flex-col gap-14 py-10 md:py-14">
      {/* Story */}
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl font-bold text-brand-ink-900 md:text-5xl">
            {settings?.aboutHeading ?? ""}
          </h1>
          <p className="mt-5 text-brand-muted-600 leading-relaxed">
            {settings?.aboutDescription ?? ""}
          </p>
          <div className="mt-8">
            <Button asChild variant="solid" size="md">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>

        {/* Stats block */}
        <div className="grid grid-cols-2 gap-4">
          {(settings?.stats ?? []).map((s) => (
            <Card
              key={s.label}
              variant="tinted"
              padding="md"
              className="text-center"
            >
              <p className="text-4xl font-bold text-brand-blue-700">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-brand-muted-600">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section>
        <SectionHeading badge="Our Values" title="What We Stand For" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <Card key={v.title} variant="default" padding="md">
              <div className="text-3xl mb-4" role="img" aria-label={v.title}>
                {v.icon}
              </div>
              <CardTitle className="mb-2">{v.title}</CardTitle>
              <CardBody>{v.body}</CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="brand-hero rounded-3xl px-8 py-14 relative overflow-hidden">
        <div className="brand-hero-glow absolute inset-y-0 right-0 w-1/2 pointer-events-none" />
        <BrandLogo
          variant="white"
          size="lg"
          decorative
          className="pointer-events-none absolute right-4 top-4 h-10 w-auto opacity-60 md:right-6 md:top-6 md:h-14"
        />
        <div className="relative max-w-2xl">
          <Badge variant="solid" className="mb-4">
            Our Mission
          </Badge>
          <h2 className="text-3xl font-bold text-brand-cream-100 md:text-4xl">
            {settings?.missionHeading ?? ""}
          </h2>
          <p className="mt-4 text-brand-mist-200 text-base leading-relaxed">
            {settings?.missionDescription ?? ""}
          </p>
        </div>
      </section>
    </main>
  );
}
