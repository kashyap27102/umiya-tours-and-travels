export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
}

export interface SiteSettingsData {
  siteName: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  aboutHeading: string;
  aboutDescription: string;
  missionHeading: string;
  missionDescription: string;
  stats: StatItem[];
  testimonials: Testimonial[];
  footerTagline: string;
}
