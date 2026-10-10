"use client";

import { useState } from "react";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import {
  ENQUIRY_STATUS_LABEL,
  ENQUIRY_TYPE_LABEL,
} from "@/lib/enquiry-constants";
import type { AdminEnquiry } from "@/services/enquiry-service";
import { EnquiryDetailModal } from "./EnquiryDetailModal";
import { ENQUIRY_STATUS_BADGE, formatWhen, summarize } from "./enquiry-format";

export default function EnquiryTable({
  items,
}: Readonly<{ items: AdminEnquiry[] }>) {
  const [openId, setOpenId] = useState<string | null>(null);
  // Looked up by id so the modal always shows the latest data after a refresh.
  const open = items.find((item) => item.id === openId) ?? null;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
        <p className="text-sm text-brand-muted-600">
          No enquiries here yet. They appear as soon as a customer submits a
          form on the website.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Customer</TableHeader>
            <TableHeader>About</TableHeader>
            <TableHeader className="whitespace-nowrap">Type</TableHeader>
            <TableHeader className="whitespace-nowrap">Received</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-brand-mist-200/40"
              onClick={() => setOpenId(item.id)}
            >
              <TableCell>
                <button
                  type="button"
                  className="text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenId(item.id);
                  }}
                >
                  <p className={item.status === "new" ? "font-semibold text-brand-ink-900" : "font-medium text-brand-ink-900"}>
                    {item.name || "No name given"}
                  </p>
                  <p className="text-xs text-brand-muted-600">
                    {item.phone || item.email || "No contact details"}
                  </p>
                </button>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-sm">{summarize(item)}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline" size="sm">
                  {ENQUIRY_TYPE_LABEL[item.type]}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-brand-muted-600">
                {formatWhen(item.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={ENQUIRY_STATUS_BADGE[item.status]} size="sm">
                  {ENQUIRY_STATUS_LABEL[item.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {open && (
        <EnquiryDetailModal enquiry={open} onClose={() => setOpenId(null)} />
      )}
    </>
  );
}
