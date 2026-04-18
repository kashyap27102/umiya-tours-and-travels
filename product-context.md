# 🌍 Travel Agency Website — Copilot Context File

> This file provides full product context, site architecture, design direction, and feature specifications for building the travel agency website. Use this as the single source of truth when generating code, components, and content.

---

## 📌 Project Overview

| Field            | Details                                                    |
| ---------------- | ---------------------------------------------------------- |
| **Client Type**  | Travel Agency                                              |
| **Website Type** | Business / Service Landing + Booking Website               |
| **Target Users** | Families, Solo Travelers, Corporate Clients, Tourists      |
| **Primary Goal** | Showcase services and allow users to inquire / book online |
| **Tech Stack**   | NextJs + tailwindcss v4 + zod                              |

---

## 🎨 Design Direction

- **Aesthetic**: Luxurious yet approachable — warm earthy tones (sand, terracotta, deep teal), adventure-inspired typography, hero imagery of iconic destinations
- **Tone**: Friendly, trustworthy, adventurous
- **Typography**: Pairing a bold serif display font (e.g., Playfair Display, Cormorant Garamond) with a clean sans-serif body font (e.g., DM Sans, Nunito)
- **Color Palette**:
  - Primary: `#1A6B72` (Deep Teal)
  - Accent: `#E8844A` (Warm Orange)
  - Background: `#F6F4E8` (Off-White Cream)
  - Dark: `#1E2A38` (Navy)
  - Light Text: `#6B7280`
- **Motion**: Subtle scroll animations, hover card lifts, smooth section transitions
- **Imagery**: High-quality destination photos, vehicle/fleet images, happy traveler lifestyle shots

---

## 🗂️ Site Structure & Pages

### 1. **Home Page** (`/`)

- Hero section with full-width banner image, headline, and CTA ("Explore Packages" / "Book Now")
- Quick service highlights (icons + short description for each service)
- Featured travel packages (card grid)
- Why Choose Us section (trust badges: years of experience, vehicles, destinations, happy customers)
- Testimonials carousel
- Call-to-Action banner ("Plan Your Trip Today")
- Footer

### 2. **About Us Page** (`/about`)

- Agency story and founding mission
- Team section (optional: photos + names)
- Values: Safety, Comfort, Reliability, Customer-First
- Achievements / Stats (e.g., "500+ Trips Completed", "10+ Years of Experience")

### 3. **Services Page** (`/services`)

Full breakdown of all services — see **Services Specification** below.

### 4. **Travel Packages Page** (`/packages`)

- Filter/sort by destination, duration, budget
- Package cards with image, name, duration, price, highlights
- Individual package detail page (`/packages/[id]`)

### 5. **Cab Booking Page** (`/cab-booking`)

- Booking form for One Way, Round Trip, Airport/Railway Pickup & Drop
- Fields: Trip Type selector, Pickup Location, Drop Location, Date, Time, Passengers, Vehicle Type
- Vehicle options display (Sedan, SUV, Innova, etc.)

### 6. **Vehicle / Travels Booking Page** (`/vehicle-booking`)

- Booking form for group/travel vehicle rentals
- Vehicle types: Mini Bus, Tempo Traveller, Full-Size Bus
- Fields: Date, Route/Destination, Number of Passengers, Duration

### 7. **Contact Page** (`/contact`)

- Contact form (Name, Email, Phone, Message, Service Interested In)
- Phone number, email, WhatsApp link
- Google Maps embed (office location)
- Business hours

---

## 🛎️ Services Specification

### 1. 🗺️ Customized Travel Packages

- Fully tailored itineraries based on client preferences
- Budget planning assistance
- Destination suggestions (domestic & international)
- Hotel + transport + sightseeing bundled
- Group, family, honeymoon, and solo packages available

**Card Label**: "Custom Travel Packages"
**Icon**: 🗺️ Map / Compass
**CTA**: "Plan My Trip"

---

### 2. 🚖 Cab Booking

#### a. One Way Trip

- Single direction ride from Point A to Point B
- Intercity and intracity available
- Multiple vehicle categories

#### b. Round Trip

- Return journey included
- Fixed rate with return guarantee
- Flexible departure and return times

#### c. Airport Pickup & Drop

- Flight-time tracking for on-time arrival
- Meet & greet service option
- Available 24/7
- All major airports covered

#### d. Railway Station Pickup & Drop

- Timely service synced with train schedules
- Platform assistance available

**Form Fields for Cab Booking**:

- Trip Type: `[One Way | Round Trip | Airport Pickup | Airport Drop | Railway Pickup | Railway Drop]`
- Pickup Location (text / map pin)
- Drop Location (text / map pin)
- Date & Time
- Return Date & Time (if Round Trip)
- Number of Passengers
- Vehicle Type: `[Sedan | SUV | Innova Crysta | Luxury]`
- Special Requests (optional)

---

### 3. 🚌 Travel Vehicle Booking (Group Transport)

For larger groups, events, tours, or corporate travel.

#### Available Vehicles:

| Vehicle         | Capacity     | Best For                           |
| --------------- | ------------ | ---------------------------------- |
| Tempo Traveller | 9–14 Seats   | Family trips, small group tours    |
| Mini Bus        | 20–27 Seats  | Medium group travel, school trips  |
| Full-Size Bus   | 35–50+ Seats | Corporate tours, large pilgrimages |

**Form Fields for Vehicle Booking**:

- Vehicle Type selector
- Departure Location
- Destination / Route
- Travel Date(s)
- Number of Passengers
- Purpose: `[Tour | Corporate | Wedding | School | Pilgrimage | Other]`
- Contact Name, Phone, Email

---

### 4. 📦 Pre-Designed Travel Packages

Curated packages with fixed itineraries, pricing, and inclusions.

**Package Card Structure**:

- Destination Image (hero)
- Package Name (e.g., "Goa Beach Escape – 4N/5D")
- Duration (e.g., 4 Nights / 5 Days)
- Starting Price (e.g., ₹12,999 per person)
- Highlights (bullet list: Hotel, Meals, Sightseeing, Transport)
- CTA: "View Details" + "Book Now"

**Package Categories**:

- 🏖️ Beach Getaways (Goa, Kerala, Andaman)
- 🏔️ Hill Station Escapes (Manali, Shimla, Ooty, Munnar)
- 🕌 Heritage & Culture (Rajasthan, Varanasi, Agra)
- 🙏 Pilgrimage Tours (Char Dham, Shirdi, Tirupati, Vaishno Devi)
- 🌏 International Packages (Dubai, Thailand, Bali, Singapore)
- 💑 Honeymoon Specials
- 👨‍👩‍👧 Family Packages

---

## 📋 Reusable Components to Build

| Component              | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `<Navbar />`           | Logo, nav links, "Book Now" CTA button, mobile hamburger menu |
| `<HeroBanner />`       | Full-screen video/image, headline, subheadline, dual CTA      |
| `<ServiceCard />`      | Icon, title, short description, CTA link                      |
| `<PackageCard />`      | Image, destination, duration, price, highlights, CTA          |
| `<BookingForm />`      | Dynamic form supporting cab, vehicle, and package booking     |
| `<TripTypeSelector />` | Tab/toggle: One Way / Round Trip / Airport / Railway          |
| `<VehicleSelector />`  | Visual cards for vehicle options with capacity info           |
| `<TestimonialCard />`  | Avatar, name, rating stars, review text                       |
| `<WhyChooseUs />`      | Stat blocks with icons (trips, years, vehicles, customers)    |
| `<Footer />`           | Logo, quick links, services list, contact info, social icons  |
| `<FloatingWhatsApp />` | Fixed WhatsApp button (bottom-right) linking to agency chat   |
| `<Breadcrumb />`       | Navigation context on inner pages                             |

---

## 📱 Responsive Design Requirements

- **Mobile First**: All pages fully responsive from 320px to 1440px+
- Hamburger navigation on mobile
- Booking forms stack vertically on small screens
- Package cards scroll horizontally on mobile or stack to 1-column grid
- Touch-friendly buttons (min 44px tap targets)
- Fast image loading (use `loading="lazy"` and WebP format)

---

## ⚙️ Functional Requirements

- **Booking Form Submission**: Submit to backend API or email (using EmailJS / Formspree / custom API)
- **WhatsApp Integration**: Pre-filled WhatsApp link (`wa.me/91XXXXXXXXXX?text=...`) for quick inquiries
- **Google Maps**: Embed map on Contact page
- **SEO**: Proper meta tags, Open Graph tags, semantic HTML structure
- **Accessibility**: ARIA labels, keyboard navigation, alt text on all images
- **Analytics**: Google Analytics / GTM integration placeholder

---

## 🔠 Content Placeholders

```
Agency Name:       Umiya Tours & Travels (opc) pvt. ltd.
Tagline:           "Your Journey, Our Passion"
Phone:             +91 99741 48390
WhatsApp:          +91 99741 48390
Email:             info@[agencyname].com
Address:           204, Keshav Aaradhyam, Kudasan, Gandhinagar, Gujarat 382419
Years in Business: 2 Years
```

---

## 🧩 Third-Party Integrations

| Integration         | Purpose                               |
| ------------------- | ------------------------------------- |
| Google Maps API     | Location picker + office map embed    |
| EmailJS / Formspree | Contact & booking form email delivery |
| WhatsApp API        | Quick inquiry button                  |
| Google Analytics 4  | User tracking and conversion events   |
| Razorpay (optional) | Online payment for package bookings   |

---

## ✅ Development Checklist

- [ ] Set up project with chosen tech stack
- [ ] Configure CSS variables (colors, fonts, spacing)
- [ ] Build Navbar with mobile responsiveness
- [ ] Build HeroBanner with CTA
- [ ] Build Service Cards section
- [ ] Build Featured Packages section
- [ ] Build Cab Booking form with trip type switching
- [ ] Build Vehicle Booking form
- [ ] Build Package listing page with filter
- [ ] Build individual Package detail page
- [ ] Build About Us page
- [ ] Build Contact page with map embed
- [ ] Add floating WhatsApp button
- [ ] Test all forms for submission
- [ ] SEO meta tags on all pages
- [ ] Performance audit (Lighthouse score > 85)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS & Android)

---

## Reference Website

https://avianexperiences.com/
https://www.nextholidays.com/in
https://www.deyor.in/
