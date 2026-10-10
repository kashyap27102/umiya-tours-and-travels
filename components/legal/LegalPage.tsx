import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";

export interface LegalSection {
  heading: string;
  /** Paragraphs, shown in order. */
  body?: string[];
  /** A bullet list shown after the paragraphs. */
  items?: string[];
}

/** A plain, readable page for legal text (privacy policy, terms). */
export default function LegalPage({
  title,
  intro,
  updated,
  sections,
  contact,
}: Readonly<{
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  contact: { email: string; phone: string; address: string };
}>) {
  return (
    <main className="flex flex-col gap-10">
      <PageHero heading={title} description={intro} />

      <div className="travel-shell w-full min-w-0 pb-6">
        <Breadcrumb crumbs={[{ label: title }]} />
        <article className="rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.10)] md:p-10">
          <p className="text-sm text-brand-muted-600">Last updated: {updated}</p>

          <div className="mt-6 space-y-8">
            {sections.map((section, index) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl font-semibold text-brand-ink-900">
                  {index + 1}. {section.heading}
                </h2>
                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-relaxed text-brand-ink-700"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-brand-ink-700">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-brand-ink-900">
                {sections.length + 1}. Contact us
              </h2>
              <p className="text-[15px] leading-relaxed text-brand-ink-700">
                Questions about this page? Reach Umiya Tours &amp; Travels (OPC)
                Pvt. Ltd. at:
              </p>
              <address className="space-y-1 text-[15px] not-italic text-brand-ink-700">
                <p>
                  Email:{" "}
                  <a href={`mailto:${contact.email}`} className="font-medium underline">
                    {contact.email}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href={`tel:${contact.phone}`} className="font-medium underline">
                    {contact.phone}
                  </a>
                </p>
                <p>Address: {contact.address}</p>
              </address>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
