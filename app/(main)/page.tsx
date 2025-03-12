"use client";

import { UploadFile } from "@/components/UploadFile";
import VideoConfiguration from "@/components/VideoConfiguration";
import useMediaPodContext from "@/store/context/media-pods/hooks";
import { useState } from "react";

export default function Page() {
  const { mediaPod } = useMediaPodContext();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUploadClick = (file: File) => {
    setFile(file);
    setIsOpen(true);
  };

  return (
    <>
      <UploadFile onUpload={handleUploadClick} />
      <VideoConfiguration isOpen={isOpen} onClose={() => setIsOpen(false)} video={file} />
    </>
  );
}
