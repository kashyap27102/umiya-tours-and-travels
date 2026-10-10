"use client";

import { useState } from "react";
import PackageInquiryForm from "@/components/forms/PackageInquiryForm";
import { Button, Modal, type ButtonProps } from "@/components/ui";

interface PackageEnquiryTriggerProps {
  packageSlug: string;
  packages: { slug: string; name: string }[];
  label: string;
  /** Pre-fills the message box, e.g. the stay level the customer picked. */
  initialMessage?: string;
  /** Pre-fills the travellers field, e.g. the group size the customer picked. */
  initialTravelers?: number;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export default function PackageEnquiryTrigger({
  packageSlug,
  packages,
  label,
  initialMessage,
  initialTravelers,
  variant = "primary",
  size = "md",
  className,
}: Readonly<PackageEnquiryTriggerProps>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        mobileDrawer
        size="lg"
        title="Enquire About This Package"
      >
        <PackageInquiryForm
          preselectedPackageSlug={packageSlug}
          packages={packages}
          initialMessage={initialMessage}
          initialTravelers={initialTravelers}
        />
      </Modal>
    </>
  );
}
