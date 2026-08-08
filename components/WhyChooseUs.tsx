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
    icon: <Send size={28} aria-hidden />,
  },
  {
    value: "2+",
    label: "Years of Experience",
    icon: <Award size={28} aria-hidden />,
  },
  {
    value: "15+",
    label: "Vehicles in Fleet",
    icon: <Bus size={28} aria-hidden />,
  },
  {
    value: "50+",
    label: "Destinations Covered",
    icon: <MapPin size={28} aria-hidden />,
  },
];

export default function WhyChooseUs({
  stats = DEFAULT_STATS,
}: WhyChooseUsProps) {
  return (
    <section className="brand-hero relative overflow-hidden py-14 md:py-16">
      {/* Glow accents */}
      <div className="brand-hero-glow pointer-events-none absolute inset-y-0 right-0 w-1/2" />
      <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-brand-lime-400/20 blur-3xl motion-float-slow" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-52 w-52 rounded-full bg-brand-blue-500/30 blur-3xl motion-float-medium" />

      <div className="relative z-10 travel-shell">
        <div className="max-w-2xl motion-fade-up mb-12">
          <p className="text-brand-lime-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Why Choose Us
          </p>
          <h2 className="text-brand-cream-100 text-3xl font-bold md:text-4xl lg:text-5xl">
            Travel with Confidence, Comfort & Care
          </h2>
          <p className="mt-4 text-brand-mist-200 text-base md:text-lg">
            Every journey we plan is built around your safety, comfort, and
            satisfaction. Here&apos;s what sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-8 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_16px_40px_rgb(0_0_0/0.25)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-lime-400/20 text-brand-lime-400 transition-colors duration-300 group-hover:bg-brand-lime-400/30">
                {stat.icon}
              </div>
              <p className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
                {stat.value}
              </p>
              <p className="text-sm text-brand-mist-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
