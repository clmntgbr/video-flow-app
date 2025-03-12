"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";

interface UploadFileProps {
  onUpload: (file: File) => void;
}

export function UploadFile({ onUpload }: UploadFileProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      onUpload(file);
    }
  };

  return (
    <div className="relative mb-8 rounded-lg border border-dashed p-40 text-center transition-all bg-sidebar">
      <div className="flex flex-col items-center">
        <Upload className="mb-6 h-30 w-30" strokeWidth={1.5} />
        <div className="text-gray-400">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Déposez votre vidéo ici</h2>
          <Button>
            <label htmlFor="image-upload" className="cursor-pointer p-4">
              Parcourez vos fichiers
            </label>
          </Button>
          <label className="cursor-pointer text-black hover:text-black">
            <input id="image-upload" type="file" accept="video/*" multiple className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </div>
  );
}
