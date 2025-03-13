"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";

interface VideoConfigurationProps {
  isOpen?: boolean;
  onClose: () => void;
  video: File | null;
}

export default function VideoConfiguration({ isOpen = false, onClose, video }: VideoConfigurationProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedVideoRef = useRef<File | null>(null);

  useEffect(() => {
    if (video && video !== processedVideoRef.current) {
      setIsLoading(true);
      setThumbnail(null);
      const videoURL = URL.createObjectURL(video);
      setVideoSrc(videoURL);
      processedVideoRef.current = video;

      return () => {
        URL.revokeObjectURL(videoURL);
      };
    } else if (!video) {
      setVideoSrc(null);
      setThumbnail(null);
      processedVideoRef.current = null;
    }
  }, [video]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setThumbnail(dataUrl);
        setIsLoading(false);
      }
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const seekTime = video.duration > 2 ? 1 : video.duration / 2;
      video.currentTime = seekTime;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !thumbnail) {
      captureFrame();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} key={"top"}>
        <SheetContent side={"left"} className="h-full w-[70%] sm:w-[70%] sm:max-w-[70%]">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <video ref={videoRef} src={videoSrc || undefined} className="hidden" onLoadedMetadata={handleVideoLoad} onTimeUpdate={handleTimeUpdate} />
            <canvas ref={canvasRef} className="hidden" />

            {thumbnail && (
              <div>
                <img src={thumbnail} alt="Aperçu de la vidéo" className="max-w-full max-h-64 rounded-md shadow-md" />
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
