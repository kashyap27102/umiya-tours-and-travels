import { Send, Award, Bus, MapPin } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface WhyChooseUsProps {
  stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
  {
    value: "500+",
    label: "Trips Completed",
    icon: <Send size={24} aria-hidden />,
  },
  {
    value: "2+",
    label: "Years of Experience",
    icon: <Award size={24} aria-hidden />,
  },
  {
    value: "15+",
    label: "Vehicles in Fleet",
    icon: <Bus size={24} aria-hidden />,
  },
  {
    value: "50+",
    label: "Destinations Covered",
    icon: <MapPin size={24} aria-hidden />,
  },
];

export default function WhyChooseUs({
  stats = DEFAULT_STATS,
}: WhyChooseUsProps) {
  return (
    <section className="rounded-3xl brand-hero overflow-hidden py-14 px-6 md:px-12">
      <div className="max-w-xl mb-10">
        <p className="text-brand-lime-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Why Choose Us
        </p>
        <h2 className="text-brand-cream-100 text-3xl font-bold md:text-4xl">
          Travel with Confidence, Comfort & Care
        </h2>
        <p className="mt-3 text-brand-mist-200 text-sm md:text-base">
          Every journey we plan is built around your safety, comfort, and
          satisfaction. Here&apos;s what sets us apart.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 px-4 py-6 text-center backdrop-blur"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-lime-400/20 text-brand-lime-400">
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-brand-cream-100">
              {stat.value}
            </p>
            <p className="text-xs text-brand-mist-200">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
