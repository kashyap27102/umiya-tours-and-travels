import TestimonialManager from "@/components/admin/testimonials/TestimonialManager";
import { TestimonialService } from "@/services/testimonial-service";

export default async function AdminTestimonialsPage() {
  const [items, options] = await Promise.all([
    TestimonialService.listForAdmin(),
    TestimonialService.getFormOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Testimonials
        </h1>
        <p className="text-sm text-brand-muted-600">
          Customer reviews shown on the home page. Add a photo, the destination
          they travelled to and, if you like, the package they booked. Hide a
          review without deleting it, and use the arrows to set the order.
        </p>
      </div>

      <TestimonialManager items={items} options={options} />
    </div>
  );
}
