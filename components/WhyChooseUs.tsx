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
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
      </svg>
    ),
  },
  {
    value: "2+",
    label: "Years of Experience",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
      </svg>
    ),
  },
  {
    value: "15+",
    label: "Vehicles in Fleet",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
  {
    value: "50+",
    label: "Destinations Covered",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
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
