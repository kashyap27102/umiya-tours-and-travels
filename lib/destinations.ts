export type Destination = {
  slug: string;
  name: string;
  /** Matched against package name/destination/highlights on /packages */
  searchTerm: string;
  /** Path under /public, e.g. "/destination-poster/kerala-....jpg" */
  image: string;
  imageAlt: string;
  /** CSS object-position value to control which part of the photo stays in frame (default: "center") */
  focalPoint?: string;
};

// Add a new state/region here to feature it in the homepage
// "Domestic Destinations" row — drop a 2:3 poster into
// public/destination-poster/ (descriptive filename for image SEO)
// and point `image` at it, no other wiring needed.
export const DOMESTIC_DESTINATIONS: Destination[] = [
  {
    slug: "kerala",
    name: "Kerala",
    searchTerm: "Kerala",
    image: "/destination-poster/kerala-india-travel-destination.jpg",
    imageAlt: "Traditional houseboat cruising the Kerala backwaters",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    searchTerm: "Rajasthan",
    image: "/destination-poster/rajasthan-india-travel-destination.jpg",
    imageAlt: "Camel safari silhouetted against a desert sunset in Rajasthan",
  },
  {
    slug: "gujarat",
    name: "Gujarat",
    searchTerm: "Gujarat",
    image: "/destination-poster/gujarat-india-travel-destination.jpg",
    imageAlt: "Waterfall in the monsoon hills of Gujarat",
  },
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    searchTerm: "Manali",
    image: "/destination-poster/himachal-pradesh-india-travel-destination.jpg",
    imageAlt: "Snow-capped Himalayan peaks above a Himachal Pradesh valley town",
  },
  {
    slug: "goa",
    name: "Goa",
    searchTerm: "Goa",
    image: "/destination-poster/goa-india-travel-destination.jpg",
    imageAlt: "Coastal Goa shoreline lined with palms and villas",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    searchTerm: "Kashmir",
    image: "/destination-poster/kashmir-india-travel-destination.jpg",
    imageAlt: "Shikara boat on Dal Lake surrounded by houseboats, Kashmir",
  },
  {
    slug: "sikkim",
    name: "Sikkim",
    searchTerm: "Sikkim",
    image: "/destination-poster/sikkim-india-travel-destination.jpg",
    imageAlt: "Giant Buddha statue overlooking the hills of Sikkim",
  },
];
