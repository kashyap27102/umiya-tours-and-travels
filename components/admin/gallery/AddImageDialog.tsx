"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { LinkPanel } from "./LinkPanel";
import { TabButtons } from "./TabButtons";
import { UploadPanel } from "./UploadPanel";
import type { MediaItem } from "@/services/media-service";

interface AddImageDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: (items: MediaItem[]) => void;
}

type Tab = "upload" | "link";

/** Add images to the gallery: upload files, or add one by link. */
export function AddImageDialog({
  open,
  onClose,
  onAdded,
}: Readonly<AddImageDialogProps>) {
  const [tab, setTab] = useState<Tab>("upload");

  return (
    <Modal open={open} onClose={onClose} title="Add images" size="md">
      <div className="space-y-5">
        <TabButtons
          tabs={[
            { value: "upload", label: "Upload files" },
            { value: "link", label: "From a link" },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === "upload" ? (
          <UploadPanel onAdded={onAdded} />
        ) : (
          <LinkPanel onAdded={onAdded} />
        )}
      </div>
    </Modal>
  );
}
