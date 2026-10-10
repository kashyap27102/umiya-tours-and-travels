"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { Badge, Button, Modal, Select, Textarea } from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import {
  deleteEnquiry,
  saveEnquiryNotes,
  setEnquiryStatus,
} from "@/lib/actions/enquiry-actions";
import { notify } from "@/lib/notifications";
import {
  ENQUIRY_STATUS_LABEL,
  ENQUIRY_STATUSES,
  ENQUIRY_TYPE_LABEL,
} from "@/lib/enquiry-constants";
import type { AdminEnquiry } from "@/services/enquiry-service";
import { detailRows, formatWhen, whatsappUrl } from "./enquiry-format";

const STATUS_OPTIONS = ENQUIRY_STATUSES.map((s) => ({
  label: ENQUIRY_STATUS_LABEL[s],
  value: s,
}));

const actionLink =
  "inline-flex items-center gap-2 rounded-xl border border-brand-blue-900/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-ink-900 transition-colors hover:border-brand-blue-500 hover:text-brand-blue-700";

/** Mounted only while open, so the notes box starts from the saved notes. */
export function EnquiryDetailModal({
  enquiry,
  onClose,
}: Readonly<{ enquiry: AdminEnquiry; onClose: () => void }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(enquiry.status);
  const [notes, setNotes] = useState(enquiry.notes);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rows = detailRows(enquiry);
  const wa = whatsappUrl(
    enquiry.phone,
    `Hello ${enquiry.name || ""}, this is Umiya Tours & Travels about your enquiry.`.replace("Hello ,", "Hello,"),
  );

  function changeStatus(next: string) {
    const previous = status;
    setStatus(next as typeof status);
    startTransition(async () => {
      const result = await setEnquiryStatus(enquiry.id, next);
      if (result.success) {
        notify.success(result.message);
      } else {
        setStatus(previous);
        notify.error("Could not change status", result.error);
      }
      router.refresh();
    });
  }

  function saveNotes() {
    startTransition(async () => {
      const result = await saveEnquiryNotes(enquiry.id, notes);
      if (result.success) {
        notify.success(result.message);
        router.refresh();
      } else {
        notify.error("Could not save notes", result.error);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEnquiry(enquiry.id);
      if (result.success) {
        notify.success(result.message);
        onClose();
      } else {
        notify.error("Could not delete enquiry", result.error);
      }
      setConfirmDelete(false);
      router.refresh();
    });
  }

  return (
    <>
      <Modal
        open
        onClose={() => !isPending && onClose()}
        title={enquiry.name || "Vehicle request (no name given)"}
        size="lg"
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm">
              {ENQUIRY_TYPE_LABEL[enquiry.type]}
            </Badge>
            <span className="text-xs text-brand-muted-600">
              Received {formatWhen(enquiry.createdAt)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {enquiry.phone && (
              <a href={`tel:${enquiry.phone}`} className={actionLink}>
                <Phone className="h-4 w-4" aria-hidden /> Call {enquiry.phone}
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className={actionLink}>
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            )}
            {enquiry.email && (
              <a href={`mailto:${enquiry.email}`} className={actionLink}>
                <Mail className="h-4 w-4" aria-hidden /> {enquiry.email}
              </a>
            )}
            {!enquiry.phone && !enquiry.email && (
              <p className="text-sm text-amber-700">
                No contact details were given, so this request can&apos;t be
                followed up.
              </p>
            )}
          </div>

          {enquiry.packageName && (
            <p className="text-sm">
              <span className="text-brand-muted-600">Package: </span>
              {enquiry.packageSlug ? (
                <Link
                  href={`/admin/package-management/${enquiry.packageSlug}/edit`}
                  className="font-medium text-brand-blue-700 underline"
                >
                  {enquiry.packageName}
                </Link>
              ) : (
                <span className="font-medium">
                  {enquiry.packageName}{" "}
                  <span className="font-normal text-brand-muted-600">(deleted)</span>
                </span>
              )}
            </p>
          )}

          {rows.length > 0 && (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-xl bg-brand-mist-200/40 p-4 text-sm sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-brand-muted-600">{label}</dt>
                  <dd className="font-medium text-brand-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {enquiry.message && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
                Message
              </p>
              <p className="whitespace-pre-wrap text-sm text-brand-ink-900">
                {enquiry.message}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
              Status
            </p>
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={changeStatus}
              disabled={isPending}
              className="sm:w-56"
            />
            {enquiry.statusChangedAt && (
              <p className="text-xs text-brand-muted-600">
                Last changed {formatWhen(enquiry.statusChangedAt)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Textarea
              label="Private notes"
              rows={3}
              maxLength={2000}
              placeholder="What was discussed, quote sent, follow-up date…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || notes.trim() === enquiry.notes}
                onClick={saveNotes}
              >
                Save notes
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => setConfirmDelete(true)}
                className="text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <AlertDialog
        open={confirmDelete}
        variant="danger"
        title="Delete enquiry"
        description="Delete this enquiry and its notes? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
