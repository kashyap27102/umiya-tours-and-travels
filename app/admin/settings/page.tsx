"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { CONTACT, SITE_NAME } from "@/lib/constants";

/* ── Section wrapper ────────────────────────────────────────── */

function Section({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <Card variant="elevated" padding="lg" className="space-y-5">
      <div className="space-y-1">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardBody>{description}</CardBody>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

/* ── Testimonial row ────────────────────────────────────────── */

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  review: string;
};

function TestimonialRow({
  item,
  index,
  onChange,
  onRemove,
}: Readonly<{
  item: Testimonial;
  index: number;
  onChange: (index: number, field: keyof Testimonial, value: string) => void;
  onRemove: (index: number) => void;
}>) {
  return (
    <div className="rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="brand" size="md">
          Testimonial {index + 1}
        </Badge>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          label="Name"
          value={item.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          inputSize="sm"
        />
        <Input
          label="Location"
          value={item.location}
          onChange={(e) => onChange(index, "location", e.target.value)}
          inputSize="sm"
        />
        <Input
          label="Rating (1–5)"
          type="number"
          min={1}
          max={5}
          value={item.rating}
          onChange={(e) => onChange(index, "rating", e.target.value)}
          inputSize="sm"
        />
      </div>
      <Textarea
        label="Review"
        rows={2}
        value={item.review}
        onChange={(e) => onChange(index, "review", e.target.value)}
      />
    </div>
  );
}

/* ── Stat row ───────────────────────────────────────────────── */

type StatItem = { value: string; label: string };

function StatRow({
  item,
  index,
  onChange,
}: Readonly<{
  item: StatItem;
  index: number;
  onChange: (index: number, field: keyof StatItem, value: string) => void;
}>) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Input
        label={`Stat ${index + 1} — Value`}
        placeholder="e.g. 500+"
        value={item.value}
        onChange={(e) => onChange(index, "value", e.target.value)}
        inputSize="sm"
      />
      <Input
        label="Label"
        placeholder="e.g. Trips Completed"
        value={item.label}
        onChange={(e) => onChange(index, "label", e.target.value)}
        inputSize="sm"
      />
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    location: "Ahmedabad",
    rating: 5,
    review:
      "The entire trip was planned perfectly. No last-minute hassles, great hotels, and the team was just a call away.",
  },
  {
    name: "Rahul Patel",
    location: "Gandhinagar",
    rating: 5,
    review:
      "Booked a cab from Ahmedabad to Udaipur. Clean car, polite driver, and very smooth ride. Will use again for sure.",
  },
  {
    name: "Meena Desai",
    location: "Anand",
    rating: 4,
    review:
      "Family trip to Goa was amazing. Everything from hotel to sightseeing was well-organized. Kids loved it!",
  },
];

const DEFAULT_STATS: StatItem[] = [
  { value: "500+", label: "Trips Completed" },
  { value: "2+", label: "Years of Experience" },
  { value: "50+", label: "Destinations Covered" },
  { value: "15+", label: "Vehicles in Fleet" },
];

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  // Business info
  const [siteName, setSiteName] = useState(SITE_NAME);
  const [phone, setPhone] = useState(CONTACT.phone);
  const [email, setEmail] = useState(CONTACT.email);
  const [whatsapp, setWhatsapp] = useState(CONTACT.whatsappNumber);
  const [address, setAddress] = useState(CONTACT.address);

  // Hero
  const [heroEyebrow, setHeroEyebrow] = useState("Umiya Tours & Travels");
  const [heroHeading, setHeroHeading] = useState(
    "See Your Next Journey Before You Even Pack",
  );
  const [heroSubheading, setHeroSubheading] = useState(
    "Image-rich destinations, smooth transport, and curated plans — from solo getaways to family adventures.",
  );

  // About
  const [aboutHeading, setAboutHeading] = useState(
    "Driven by Passion for Travel",
  );
  const [aboutDescription, setAboutDescription] = useState(
    "What started as a simple idea to make travel easier has grown into a full-service travel operation. Based in Gandhinagar, Gujarat, Umiya Tours & Travels has spent over two years helping families, couples, and groups discover incredible destinations with zero stress.",
  );
  const [missionHeading, setMissionHeading] = useState(
    "Making Every Journey Worth Remembering",
  );
  const [missionDescription, setMissionDescription] = useState(
    "We believe travel should be exciting, not exhausting. From the moment you inquire to the moment you return home, our team handles every detail — route planning, hotel bookings, vehicle arrangements, and on-trip support.",
  );

  // Stats
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);

  // Testimonials
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  // Footer
  const [footerTagline, setFooterTagline] = useState(
    "Your Journey, Our Passion. Serving Gandhinagar, Gujarat with curated travel experiences, dependable cab service, and hassle-free vehicle rentals.",
  );

  const handleStatChange = (
    index: number,
    field: keyof StatItem,
    value: string,
  ) => {
    setStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleTestimonialChange = (
    index: number,
    field: keyof Testimonial,
    value: string,
  ) => {
    setTestimonials((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  };

  const addTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      { name: "", location: "", rating: 5, review: "" },
    ]);
  };

  const removeTestimonial = (index: number) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
            Settings
          </h1>
          <p className="text-sm text-brand-muted-600">
            Manage general content displayed on the public website.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleSave}>
          {saved ? "✓ Saved" : "Save Changes"}
        </Button>
      </div>

      {/* Business Information */}
      <Section
        title="Business Information"
        description="Core contact details used across the site, footer, and meta tags."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Site / Business Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="WhatsApp Number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
        <Textarea
          label="Address"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Section>

      {/* Hero Banner */}
      <Section
        title="Hero Banner"
        description="The main banner visitors see on the homepage."
      >
        <Input
          label="Eyebrow Text"
          value={heroEyebrow}
          onChange={(e) => setHeroEyebrow(e.target.value)}
        />
        <Input
          label="Heading"
          value={heroHeading}
          onChange={(e) => setHeroHeading(e.target.value)}
        />
        <Textarea
          label="Subheading"
          rows={2}
          value={heroSubheading}
          onChange={(e) => setHeroSubheading(e.target.value)}
        />
      </Section>

      {/* About Section */}
      <Section
        title="About Page"
        description="Story and mission content displayed on the About page."
      >
        <Input
          label="Story Heading"
          value={aboutHeading}
          onChange={(e) => setAboutHeading(e.target.value)}
        />
        <Textarea
          label="Story Description"
          rows={3}
          value={aboutDescription}
          onChange={(e) => setAboutDescription(e.target.value)}
        />
        <Input
          label="Mission Heading"
          value={missionHeading}
          onChange={(e) => setMissionHeading(e.target.value)}
        />
        <Textarea
          label="Mission Description"
          rows={3}
          value={missionDescription}
          onChange={(e) => setMissionDescription(e.target.value)}
        />
      </Section>

      {/* Stats */}
      <Section
        title="Stats / Numbers"
        description="Key figures shown on the About and Why Choose Us sections."
      >
        {stats.map((stat, i) => (
          <StatRow
            key={stat.label}
            item={stat}
            index={i}
            onChange={handleStatChange}
          />
        ))}
      </Section>

      {/* Testimonials */}
      <Section
        title="Testimonials"
        description="Customer reviews displayed on the homepage."
      >
        {testimonials.map((t, i) => (
          <TestimonialRow
            key={`${t.name}-${t.location}`}
            item={t}
            index={i}
            onChange={handleTestimonialChange}
            onRemove={removeTestimonial}
          />
        ))}
        <Button variant="outline" size="sm" onClick={addTestimonial}>
          + Add Testimonial
        </Button>
      </Section>

      {/* Footer */}
      <Section
        title="Footer"
        description="Tagline shown in the website footer."
      >
        <Textarea
          label="Footer Tagline"
          rows={2}
          value={footerTagline}
          onChange={(e) => setFooterTagline(e.target.value)}
        />
      </Section>

      {/* Bottom save bar */}
      <div className="flex justify-end pb-4">
        <Button variant="primary" size="md" onClick={handleSave}>
          {saved ? "✓ Saved" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
