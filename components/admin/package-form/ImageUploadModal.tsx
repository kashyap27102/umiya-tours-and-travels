"use client";

import { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (url: string) => void;
}

export default function ImageUploadModal({
  open,
  onClose,
  onUploadComplete,
}: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setFile(selectedFile);
    setError(null);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadComplete(data.url);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Image"
      size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {!preview ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-brand-blue-900/20 rounded-lg p-8 text-center cursor-pointer hover:border-brand-blue-900/40 transition-colors"
          >
            <div className="text-sm text-brand-muted-600">
              <p className="font-medium mb-2">Drop your image here</p>
              <p className="text-xs">or click to browse</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative w-full bg-gray-50 rounded-lg overflow-auto border border-brand-blue-900/10 flex items-center justify-center" style={{ maxHeight: "400px" }}>
              <img
                src={preview}
                alt="Preview"
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium"
            >
              Change Image
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading}
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
