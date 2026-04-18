"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CustomPackageValues } from "@/hooks/useCustomPackageForm";
import { BRAND_LOGO, CONTACT, SITE_NAME } from "@/lib/constants";

const HEADER_COLOR: [number, number, number] = [15, 47, 99];
const ACCENT_COLOR: [number, number, number] = [159, 196, 74];
const TEXT_DARK: [number, number, number] = [32, 38, 64];
const TEXT_MUTED: [number, number, number] = [85, 102, 134];

const formatDisplayDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatCurrency = (value: string) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const fileSafeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 80);

const loadSvgLogoAsPngDataUrl = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("Could not load logo file.");
  }

  const svgMarkup = await response.text();
  const svgBlob = new Blob([svgMarkup], {
    type: "image/svg+xml;charset=utf-8",
  });

  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not render logo image."));
      img.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || 220;
    canvas.height = image.naturalHeight || 120;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context unavailable.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
};

type ExportablePackagePdfData = CustomPackageValues & {
  createdAt?: string;
};

export async function exportCustomPackagePdf(item: ExportablePackagePdfData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const horizontalPadding = 44;

  doc.setFillColor(...HEADER_COLOR);
  doc.rect(0, 0, pageWidth, 116, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(SITE_NAME, horizontalPadding, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Custom Travel Package Document", horizontalPadding, 61);
  doc.text(
    `${CONTACT.phone}  |  ${CONTACT.email}  |  ${CONTACT.address}`,
    horizontalPadding,
    78,
    {
      maxWidth: pageWidth - horizontalPadding * 2 - 170,
    },
  );

  try {
    const logoData = await loadSvgLogoAsPngDataUrl(BRAND_LOGO.color);
    doc.addImage(logoData, "PNG", pageWidth - 152, 14, 102, 82);
  } catch {
    doc.setDrawColor(...ACCENT_COLOR);
    doc.setLineWidth(1.2);
    doc.roundedRect(pageWidth - 148, 22, 96, 62, 8, 8, "S");
    doc.setTextColor(...ACCENT_COLOR);
    doc.setFontSize(10);
    doc.text("UMIYA", pageWidth - 117, 56, { align: "center" });
  }

  doc.setTextColor(...TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Package: ${item.packageName}`, horizontalPadding, 148);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(
    `Created: ${item.createdAt ?? new Date().toLocaleString()}`,
    horizontalPadding,
    168,
  );

  autoTable(doc, {
    startY: 188,
    margin: { left: horizontalPadding, right: horizontalPadding },
    head: [["Field", "Details"]],
    body: [
      ["Traveler Count", item.travelerCount],
      [
        "Travel Dates",
        `${formatDisplayDate(item.departureDate)} to ${formatDisplayDate(item.arrivalDate)}`,
      ],
      ["Route", `${item.departurePlace} to ${item.arrivalPlace}`],
      ["Amount Per Person", formatCurrency(item.amountPerPerson)],
      ["Vehicle", item.vehicle],
    ],
    headStyles: {
      fillColor: HEADER_COLOR,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      textColor: TEXT_DARK,
      fontSize: 10,
      lineColor: [228, 233, 244],
      lineWidth: 1,
      cellPadding: 8,
    },
    alternateRowStyles: {
      fillColor: [247, 249, 255],
    },
    columnStyles: {
      0: { cellWidth: 136, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    tableLineColor: [228, 233, 244],
    tableLineWidth: 1,
  });

  const summaryEndY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 360;

  doc.setTextColor(...TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Day-wise Itinerary", horizontalPadding, summaryEndY + 28);

  autoTable(doc, {
    startY: summaryEndY + 40,
    margin: { left: horizontalPadding, right: horizontalPadding },
    head: [["Day", "Plan Details"]],
    body: item.itinerary.map((day) => [day.dayLabel, day.details]),
    headStyles: {
      fillColor: ACCENT_COLOR,
      textColor: [15, 47, 99],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      textColor: TEXT_DARK,
      fontSize: 10,
      lineColor: [228, 233, 244],
      lineWidth: 1,
      cellPadding: 8,
      valign: "top",
    },
    alternateRowStyles: {
      fillColor: [251, 253, 245],
    },
    columnStyles: {
      0: { cellWidth: 92, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    tableLineColor: [228, 233, 244],
    tableLineWidth: 1,
  });

  const totalPages = doc.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.text(
      `Generated by ${SITE_NAME} | ${new Date().toLocaleString()} | Page ${page} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 22,
      { align: "center" },
    );
  }

  const fileName = `${fileSafeName(item.packageName || "custom-package")}.pdf`;
  doc.save(fileName);
}
