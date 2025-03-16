"use client";

import { Upload } from "lucide-react";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface UploadFileProps {
  onUpload: (file: File) => void;
}

export interface UploadFileRef {
  resetInput: () => void;
}

export const UploadFile = forwardRef<UploadFileRef, UploadFileProps>(({ onUpload }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    resetInput: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      onUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        onUpload(file);
      }
    }
  };

  const handleZoneClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`relative rounded-lg border items-center hover:bg-slate-100 border-dashed text-center transition-all w-full h-[70vh] ${
        isDragging ? "bg-slate-100 border-blue-500" : "bg-sidebar"
      } cursor-pointer flex flex-col justify-center items-center`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleZoneClick}
    >
      <Upload className="absolute inset-0 m-auto opacity-10 w-100 h-100" strokeWidth={0.5} />
      <div className="flex flex-col items-center">
        <div className="text-gray-400 text-center">
          <input ref={inputRef} id="image-upload" type="file" accept="video/*" multiple={false} className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
});
