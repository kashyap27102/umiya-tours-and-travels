"use client";

import { useState } from "react";
import PackageInquiryForm from "@/components/forms/PackageInquiryForm";
import { Button, Modal, type ButtonProps } from "@/components/ui";

interface PackageEnquiryTriggerProps {
  packageSlug: string;
  packages: { slug: string; name: string }[];
  label: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export default function PackageEnquiryTrigger({
  packageSlug,
  packages,
  label,
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
        />
      </Modal>
    </>
  );
}
