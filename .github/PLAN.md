# Plan: SEO-Friendly Travel Agency Website (Next.js)

## TL;DR

Build a complete travel agency website with all 7 core pages, comprehensive SEO infrastructure, and secure form handling. Strategy: 4 phases — (1) Design system & SEO setup, (2) Core pages (Home, About, Services), (3) Booking & Packages, (4) Polish & performance. Estimated delivery: 2-3 days focused work.

---

## Phase 1: SEO Infrastructure & Design System (Foundation)

_Dependencies: None — run first_

### 1.1 Configure Next.js for SEO & Performance

- [ ] Update `next.config.ts` with image optimization (loader, domains, formats)
- [ ] Add robots.txt (`/public/robots.txt`) with sitemap reference
- [ ] Add sitemap.xml route (`app/sitemap.ts`) generating dynamic URLs for all pages + packages
- [ ] Install `zod` for form validation (missing from package.json)
- [ ] Configure hostname/domain constants (for canonical URLs and OG tags)

**Files modified**: `next.config.ts` | `package.json`  
**Files created**: `public/robots.txt` | `app/sitemap.ts` | `lib/constants.ts`

### 1.2 Update Global Theme with Tailwind & Design Tokens

- [ ] Replace `globals.css` with travel agency color palette (Teal #1A6B72, Orange #E8844A, Cream #F6F4E8, Navy #1E2A38)
- [ ] Import display font (Playfair Display) + body font (DM Sans) from `next/font/google`
- [ ] Define Tailwind theme extension: custom colors, typography scale, spacing utilities for travel context
- [ ] Set up dark mode variables (optional, not critical for travel site)

**Files modified**: `app/globals.css` | `app/layout.tsx`

### 1.3 Create Metadata Template Utility

- [ ] Build `lib/metadata.ts` with reusable `generateMetadata()` function
  - Accepts page title, description, image, canonical URL
  - Returns OpenGraph, Twitter Card, and structural metadata
  - Supports JSON-LD schema (Organization, LocalBusiness, BreadcrumbList, etc.)
- [ ] Set Root Layout metadata (Umiya Tours & Travels branding)

**Files created**: `lib/metadata.ts`

---

## Phase 2: Core Pages & Reusable Components (Pages 1-3)

_Can run **parallel** with Phase 1 if components don't depend on theme_

### 2.1 Build Shared Components Library

Components to build (modular, reusable):

- [ ] `<Navbar />` — Logo, nav links (Home, About, Services, Packages, Contact), "Book Now" CTA, mobile hamburger. Sticky on scroll.
- [ ] `<HeroBanner />` — Full-width image, headline, subheadline, dual CTAs. Support image or video bg.
- [ ] `<ServiceCard />` — Icon, title, description, CTA link. 3-column grid on desktop, 1 on mobile.
- [ ] `<TestimonialCard />` — Avatar, name, stars, review. For carousel/grid display.
- [ ] `<WhyChooseUs />` — 4 stat blocks (years, trips, vehicles, destinations) with icons.
- [ ] `<Footer />` — Logo, services links, contact info, WhatsApp/social icons, copyright.
- [ ] `<FloatingWhatsApp />` — Fixed button (bottom-right, z-40) linking to WhatsApp chat.
- [ ] `<Breadcrumb />` — Navigation context for inner pages.

**Files created**: `components/` folder with individual files for each component

### 2.2 Home Page (`/`)

- [ ] Create `app/page.tsx` with sections:
  - HeroBanner (Umiya Tours hero + "Explore Packages" + "Book Now" CTAs)
  - Quick service highlights (4 services with icons)
  - Featured travel packages (grid of 6 packages, cards with image/name/duration/price/highlights)
  - Testimonials carousel (3-4 testimonials rotating/swiping)
  - Why Choose Us (trust badges with stats)
  - CTA banner ("Plan Your Trip Today")
  - Footer
- [ ] Metadata: homepage title, description, OG image, structured data (Organization + LocalBusiness schemas)

**Files modified**: `app/page.tsx` | `app/layout.tsx` (root metadata)  
**Dependencies**: Phase 1 complete for theme + metadata utility

### 2.3 About Us Page (`/about`)

- [ ] Create `app/about/page.tsx` with sections:
  - Breadcrumb
  - Agency story/mission (2-column: text left, image right)
  - Core values (4 cards: Safety, Comfort, Reliability, Customer-First)
  - Team section (future: photos + names, or placeholder cards)
  - Achievements stats (500+ trips, 10+ years, X destinations, Y vehicles)
  - Timeline or gallery of milestones
- [ ] Metadata: about page title, description, OG image

**Files created**: `app/about/page.tsx`  
**Dependencies**: Navbar, Footer, Breadcrumb components (Phase 2.1)

### 2.4 Services Page (`/services`)

- [ ] Create `app/services/page.tsx` showing all 4 service categories:
  1. Customized Travel Packages (detail, image, "Plan My Trip" link)
  2. Cab Booking (One Way, Round Trip, Airport, Railway variants) — link to form
  3. Travel Vehicle Booking (Tempo, Mini Bus, Full Bus) — link to form
  4. Pre-Designed Packages — link to packages page
- [ ] Each service: image, description, highlights, CTA button
- [ ] Metadata: services title, description, OG image

**Files created**: `app/services/page.tsx`  
**Dependencies**: HeroBanner, Breadcrumb, Footer (Phase 2.1)

---

## Phase 3: Booking Pages & Packages (Pages 4-7)

_Depends on Phase 1 (Zod validation) + Phase 2 (Navbar/Footer/components)_

### 3.1 Build Form Infrastructure

- [ ] Add `zod` to package.json (validation schemas)
- [ ] Create form validation schemas:
  - `schemas/cab-booking.ts` — Trip type, locations, date/time, passengers, vehicle type, special requests
  - `schemas/vehicle-booking.ts` — Vehicle type, locations, dates, passenger count, purpose, contact
  - `schemas/contact.ts` — Name, email, phone, message, service interested
- [ ] Build `hooks/useFormSubmit.ts` — Handles client-side validation + Formspree POST + success/error states + toast notifications
- [ ] Create form helper utilities for common patterns (location input, date picker, vehicle selector, trip type tabs)

**Files created**: `schemas/` folder + `hooks/useFormSubmit.ts` + `lib/form-utils.ts`

### 3.2 Cab Booking Page (`/cab-booking`)

- [ ] Create `app/cab-booking/page.tsx` with form:
  - Trip Type selector (tabs: One Way | Round Trip | Airport Pickup | Airport Drop | Railway Pickup | Railway Drop)
  - Pickup Location (text input + optional map pin visual)
  - Drop Location (text input + optional map pin visual)
  - Date & Time picker
  - Return date & time (conditional: only for Round Trip)
  - Passengers count (numeric input)
  - Vehicle Type selector (cards/tabs: Sedan, SUV, Innova Crysta, Luxury)
  - Special Requests (textarea, optional)
  - Submit button (disabled until form valid)
- [ ] Form validation with Zod
- [ ] Success message after form submit to Formspree
- [ ] Metadata + SEO

**Files created**: `app/cab-booking/page.tsx`  
**Dependencies**: Phase 3.1 (form infrastructure)

### 3.3 Vehicle Booking Page (`/vehicle-booking`)

- [ ] Create `app/vehicle-booking/page.tsx` with form for group transport:
  - Vehicle Type selector (cards: Tempo Traveller 9-14, Mini Bus 20-27, Full Bus 35-50+)
  - Departure Location
  - Destination / Route
  - Travel Start Date
  - Travel End Date (optional, for multi-day trips)
  - Passenger count
  - Purpose dropdown (Tour, Corporate, Wedding, School, Pilgrimage, Other)
  - Contact name, phone, email
  - Submit validation + Formspree integration
- [ ] Success message + confirmation
- [ ] Metadata + SEO

**Files created**: `app/vehicle-booking/page.tsx`

### 3.4 Travel Packages Page (`/packages`)

- [ ] Create `app/packages/page.tsx` listing all packages:
  - Static data (or fetch from CMS later) with 20+ sample packages across categories
  - Filter/sort UI: by destination, duration (days), price range, package type (Beach, Hill, Heritage, Pilgrimage, International, Honeymoon, Family)
  - Package grid (3-column desktop, 1-column mobile)
  - Each card: image, name, duration, price, highlights, "View Details" + "Book Now" links
- [ ] Responsive horizontal scroll on mobile (if preferred) or stack layout
- [ ] Breadcrumb + Metadata

**Files created**: `app/packages/page.tsx` | `lib/packages-data.ts` (sample data)

### 3.5 Package Detail Page (`/packages/[id]`)

- [ ] Create dynamic route `app/packages/[id]/page.tsx`:
  - Full itinerary (day-by-day breakdown)
  - Package highlights (images carousel)
  - Inclusions & exclusions (checklist layout)
  - Price breakdown (accommodation, transport, activities, taxes)
  - Related packages carousel (recommendations)
  - "Book This Package" CTA → links to contact form with package pre-filled
- [ ] Metadata: package name, description, image, canonical URL with ID
- [ ] SEO: JSON-LD schema for Product/Event (package as structured data)

**Files created**: `app/packages/[id]/page.tsx`

### 3.6 Contact Page (`/contact`)

- [ ] Create `app/contact/page.tsx` with:
  - Contact form (Name, Email, Phone, Message, Service interested dropdown)
  - Zod validation + Formspree integration
  - Contact info sidebar/section: phone, email, WhatsApp link, address, business hours
  - Google Maps embed (officer location: Kudasan, Gandhinagar, Gujarat)
  - Social media links
- [ ] Success confirmation message
- [ ] Metadata + SEO

**Files created**: `app/contact/page.tsx`

---

## Phase 4: Polish, Performance & SEO Audit (Finalization)

_Depends on all previous phases_

### 4.1 Image Optimization & Performance

- [ ] Add high-quality placeholder images for:
  - Hero banners (destinations, travel lifestyle)
  - Package cards (Goa, Manali, Shimla, Ooty, Rajasthan, international)
  - Service icons/illustrations
  - Team photos (placeholder avatars if real photos unavailable)
- [ ] Optimize all images: use `next/image`, enable WebP, set lazy loading, define dimensions to prevent CLS
- [ ] Implement responsive image sizes (srcSet) for hero banners
- [ ] Add Lighthouse audit + target score > 85 (Performance, Accessibility, Best Practices, SEO)

### 4.2 SEO Audit & Structured Data

- [ ] Verify all pages have:
  - Unique, keyword-rich title tags (50-60 chars)
  - Meta descriptions (155-160 chars)
  - OpenGraph (OG:title, OG:description, OG:image, OG:type, OG:url)
  - Twitter Card metadata
- [ ] Add JSON-LD structured data:
  - Organization schema (root layout)
  - LocalBusiness schema (Contact page, root)
  - BreadcrumbList (on all inner pages)
  - Product schema (Packages)
  - FAQPage schema (FAQ section if added)
  - AggregateRating schema (testimonials)
- [ ] Verify robots.txt and sitemap.xml are accessible
- [ ] Test with Google Rich Results Test / schema.org validator

### 4.3 Mobile & Cross-Browser Testing

- [ ] Test responsive breakpoints: 320px, 768px, 1024px, 1440px+
- [ ] Verify hamburger menu works on mobile
- [ ] Touch-friendly buttons (min 44px tap targets)
- [ ] Test booking forms on iOS Safari, Android Chrome
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Verify WhatsApp links work (on desktop and mobile)

### 4.4 Form Testing & Security

- [ ] Test all forms (Cab, Vehicle, Contact, Package Booking) with:
  - Valid inputs → success submission
  - Invalid inputs → inline error messages (Zod validation)
  - Empty fields → required field errors
  - Formspree spam protection enabled
- [ ] Add CSRF protection if backend added later
- [ ] Verify Formspree email delivery to configured inbox

### 4.5 Analytics & Monitoring Placeholders

- [ ] Add Google Analytics 4 (GA4) tag to layout (gtag snippet)
- [ ] Set up conversion events (form submissions, "Book Now" clicks)
- [ ] Create placeholder for Razorpay integration (future: online payments)

---

## Critical Files to Be Modified/Created

### Modified:

- [next.config.ts](next.config.ts) — Image optimization, domain config
- [package.json](package.json) — Add `zod`
- [app/globals.css](app/globals.css) — Theme colors, typography
- [app/layout.tsx](app/layout.tsx) — Root metadata, fonts, Navbar/Footer wrapper

### Created (organized):

```
app/
  page.tsx (Home)
  sitemap.ts
  about/
    page.tsx
  services/
    page.tsx
  packages/
    page.tsx
    [id]/
      page.tsx
  cab-booking/
    page.tsx
  vehicle-booking/
    page.tsx
  contact/
    page.tsx

components/
  Navbar.tsx
  Footer.tsx
  HeroBanner.tsx
  ServiceCard.tsx
  PackageCard.tsx
  TestimonialCard.tsx
  WhyChooseUs.tsx
  FloatingWhatsApp.tsx
  Breadcrumb.tsx
  BookingForm.tsx (reusable)
  TripTypeSelector.tsx
  VehicleSelector.tsx

lib/
  metadata.ts
  constants.ts
  packages-data.ts
  form-utils.ts

schemas/
  cab-booking.ts
  vehicle-booking.ts
  contact.ts

hooks/
  useFormSubmit.ts

public/
  robots.txt
```

---

## Key Decisions & Reasoning

1. **External Forms (Formspree) over Backend API**: Reduces infrastructure complexity, no server-side secrets, fully managed spam protection. Upgrade to backend API routes later if needed.

2. **Zod for Validation**: Lightweight, TypeScript-first, minimal bundle impact, industry standard for Next.js forms.

3. **Next.js App Router (SSR/SSG)**: All pages server-side rendered for SEO. Packages can be static if content doesn't change frequently; add ISR (Incremental Static Regeneration) later if needed.

4. **Structured Data (JSON-LD)**: Better SEO visibility in rich snippets, Google Search Console, voice search optimization. Focus on Organization, LocalBusiness, BreadcrumbList, and Product schemas.

5. **Image Optimization Priority**: Travel sites are image-heavy; `next/image` with dynamic sizing reduces CLS, improves Core Web Vitals, critical for SEO ranking.

6. **Phase-Based Delivery**: Allows for early validation of design and functionality before finalizing all pages.

---

## Verification Steps (Testing Checklist)

1. **SEO Validation**:
   - [ ] All pages pass Google Rich Results Test
   - [ ] Sitemap.xml contains all routes (test with URL in browser)
   - [ ] robots.txt returns 200 OK, readable
   - [ ] Lighthouse SEO score ≥ 90

2. **Form Testing**:
   - [ ] Submit cab booking form → email received in Formspree
   - [ ] Form validation prevents submission with empty required fields
   - [ ] Success message displays after submission

3. **Performance**:
   - [ ] Lighthouse Performance ≥ 85
   - [ ] Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
   - [ ] Images load lazily (inspect Network tab for non-critical images)

4. **Mobile**:
   - [ ] All pages responsive at 320px, 768px, 1440px
   - [ ] Hamburger menu toggles on mobile
   - [ ] Buttons have ≥44px tap targets

5. **Accessibility**:
   - [ ] All images have descriptive alt text
   - [ ] Links have sufficient color contrast
   - [ ] Keyboard navigation works (Tab through form, links, buttons)
   - [ ] Lighthouse Accessibility ≥ 90

---

## Excluded from Scope (Deliberate)

- Backend database (use static data + Formspree for now; add database later)
- Authentication/Admin panel (manual content updates initially)
- Payment processing (Razorpay placeholder only; implement after MVP validation)
- Multi-language support (English only for MVP)
- Custom analytics dashboard (GA4 event tracking only)
- Mobile app (web-only for now)

---

## Estimated Effort & Timeline

- **Phase 1** (SEO + Design): 2-4 hours
- **Phase 2** (Home, About, Services): 4-6 hours
- **Phase 3** (Booking forms + Packages): 6-8 hours
- **Phase 4** (Polish + Testing): 4-6 hours
- **Total**: 16-24 hours focused work (2-3 days)

---

## Questions Before Implementation

(These were asked and answered during planning; no action needed)

- Scope: **Complete (all 7 pages)**
- SEO: **Comprehensive (all features)**
- Forms: **Formspree (external service)**
- Content: **Placeholders + product context**
