"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Star, X } from "lucide-react";
import { Button, Input, Modal, Select, Switch, Textarea } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import { ImagePickerDialog } from "@/components/admin/gallery/ImagePickerDialog";
import { MediaThumb } from "@/components/admin/gallery/MediaThumb";
import {
  createTestimonial,
  updateTestimonial,
} from "@/lib/actions/testimonial-actions";
import { notify } from "@/lib/notifications";
import { testimonialFormSchema } from "@/schemas/testimonial";
import type {
  AdminTestimonial,
  TestimonialFormOptions,
} from "@/services/testimonial-service";

interface TestimonialFormModalProps {
  /** null = add a new one. */
  editing: AdminTestimonial | null;
  options: TestimonialFormOptions;
  onClose: () => void;
  onSaved: () => void;
}

const NONE = "";
const FORM_ID = "testimonial-form";

type Photo = { id: string; url: string; alt: string; title: string };

/** Mounted only while open, so each opening starts from the right values. */
export function TestimonialFormModal(props: Readonly<TestimonialFormModalProps>) {
  const { editing, options, onClose, onSaved } = props;
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);

  const [name, setName] = useState(editing?.name ?? "");
  const [location, setLocation] = useState(editing?.location ?? "");
  const [rating, setRating] = useState(editing?.rating ?? 5);
  const [review, setReview] = useState(editing?.review ?? "");
  const [photo, setPhoto] = useState<Photo | null>(editing?.image ?? null);
  const [destinationId, setDestinationId] = useState(
    editing?.destination?.id ?? NONE,
  );
  const [packageId, setPackageId] = useState(editing?.package?.id ?? NONE);
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);

  const destinationOptions = [
    { label: "Not specified", value: NONE },
    ...options.destinations.map((d) => ({ label: d.name, value: d.id })),
  ];
  const packageOptions = [
    { label: "No package link", value: NONE },
    ...options.packages.map((p) => ({
      label: p.status === "active" ? p.name : `${p.name} (${p.status})`,
      value: p.id,
    })),
  ];
  const linkedPackage = options.packages.find((p) => p.id === packageId);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const input = {
      name,
      location,
      rating,
      review,
      imageId: photo?.id ?? null,
      destinationId: destinationId || null,
      packageId: packageId || null,
      isActive,
    };
    const check = testimonialFormSchema.safeParse(input);
    if (!check.success) {
      notify.error("Please check the form", check.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      const result = editing
        ? await updateTestimonial(editing.id, input)
        : await createTestimonial(input);
      if (result.success) {
        notify.success(result.message);
        onSaved();
      } else {
        notify.error("Could not save testimonial", result.error);
      }
    });
  }

  return (
    <>
      <Modal
        open
        onClose={() => !isPending && onClose()}
        title={editing ? "Edit testimonial" : "Add testimonial"}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              variant="primary"
              size="md"
              disabled={isPending}
            >
              {isPending ? "Saving…" : editing ? "Save changes" : "Add"}
            </Button>
          </div>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 space-y-2">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-brand-blue-900/10 bg-brand-mist-200/50">
                {photo ? (
                  <MediaThumb src={photo.url} alt={photo.alt || photo.title} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-brand-muted-600/60">
                    <ImagePlus className="h-7 w-7" aria-hidden />
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0 space-y-2 pt-1">
              <p className="text-sm font-medium text-brand-ink-900">
                Photo <span className="font-normal text-brand-muted-600">(optional)</span>
              </p>
              <p className="text-xs text-brand-muted-600">
                The customer or a photo from their trip. Upload one, add a link,
                or choose from the gallery.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPickerOpen(true)}
                >
                  {photo ? "Change photo" : "Choose photo"}
                </Button>
                {photo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPhoto(null)}
                  >
                    <X className="h-4 w-4" /> Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              autoFocus
            />
            <Input
              label="From (city)"
              placeholder="e.g. Ahmedabad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-brand-ink-900">Rating</p>
            <div
              role="radiogroup"
              aria-label="Rating"
              className="flex items-center gap-1"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  onClick={() => setRating(value)}
                  className="cursor-pointer rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500"
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      value <= rating
                        ? "fill-brand-lime-400 text-brand-lime-400"
                        : "text-brand-muted-600/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Review"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            maxLength={1000}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-brand-ink-900">
                Destination they travelled to{" "}
                <span className="font-normal text-brand-muted-600">(optional)</span>
              </p>
              <Select
                options={destinationOptions}
                value={destinationId}
                onChange={setDestinationId}
                placeholder="Not specified"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-brand-ink-900">
                Package they booked{" "}
                <span className="font-normal text-brand-muted-600">(optional)</span>
              </p>
              <Select
                options={packageOptions}
                value={packageId}
                onChange={setPackageId}
                placeholder="No package link"
              />
              {linkedPackage && linkedPackage.status !== "active" && (
                <p className="text-xs text-amber-700">
                  This package is {linkedPackage.status}, so visitors won&apos;t
                  see a link to it until it is active.
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Show on the website"
            />
            <span className="text-sm text-brand-ink-900">
              Show on the website
            </span>
          </label>
        </form>
      </Modal>

      <ImagePickerDialog
        open={pickerOpen}
        mode="single"
        title="Choose a photo"
        onClose={() => setPickerOpen(false)}
        onSelect={([item]) =>
          item &&
          setPhoto({ id: item.id, url: item.url, alt: item.alt, title: item.title })
        }
      />
    </>
  );
}
