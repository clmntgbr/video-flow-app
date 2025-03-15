"use client";

import { DataTableDemo } from "@/components/Table";
import { UploadFile } from "@/components/UploadFile";
import VideoConfiguration from "@/components/VideoConfiguration";
import { useRef, useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const uploadRef = useRef<{ resetInput: () => void } | null>(null);

  const handleUploadClick = (file: File) => {
    setFile(file);
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setFile(null);
    setIsOpen(false);
    if (uploadRef.current) {
      uploadRef.current.resetInput();
    }
  };

  return (
    <>
      <UploadFile onUpload={handleUploadClick} ref={uploadRef} />
      <VideoConfiguration isOpen={isOpen} onClose={handleOnClose} video={file} />
      <DataTableDemo />
    </>
  );
}
