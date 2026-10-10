import ChipLink from "./ChipLink";

/** "Keep exploring" list of links at the foot of a destination or category page. */
export default function ExploreMore({
  title,
  links,
}: Readonly<{
  title: string;
  links: { href: string; label: string; count?: number }[];
}>) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={title} className="space-y-3">
      <h2 className="text-xl font-semibold text-brand-ink-900">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <ChipLink {...link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
