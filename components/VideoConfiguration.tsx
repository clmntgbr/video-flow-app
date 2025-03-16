"use client";
import { useApiClient } from "@/store/context/ApiContext";
import useConfigurationContext from "@/store/context/configurations/hooks";
import { getConfiguration } from "@/store/context/dispatch/configurations/getConfiguration";
import { getMediaPods } from "@/store/context/dispatch/media-pods/getMediaPods";
import useMediaPodContext from "@/store/context/media-pods/hooks";
import { Configuration } from "@/store/interface/configuration";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { SubtitlePreview } from "./SubtitlePreview";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedVideoRef = useRef<File | null>(null);
  const { configuration, configurationDispatch } = useConfigurationContext();
  const { mediaPodDispatch } = useMediaPodContext();
  const [settings, setSettings] = useState<Configuration>(configuration.configuration);
  const apiClient = useApiClient();

  useEffect(() => {
    if (video && video !== processedVideoRef.current) {
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

  const handleSettingChange = (key: keyof Configuration, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleOnSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!processedVideoRef.current) {
      return;
    }

    const formData = new FormData();

    formData.append("video", processedVideoRef.current);

    formData.append("subtitleFont", settings.subtitleFont);
    formData.append("subtitleSize", settings.subtitleSize);
    formData.append("subtitleColor", settings.subtitleColor);
    formData.append("subtitleBold", settings.subtitleBold);
    formData.append("subtitleItalic", settings.subtitleItalic);
    formData.append("subtitleUnderline", settings.subtitleUnderline);

    formData.append("subtitleBold", settings.subtitleBold);
    formData.append("subtitleOutlineColor", settings.subtitleOutlineColor);
    formData.append("subtitleOutlineThickness", settings.subtitleOutlineThickness);
    formData.append("subtitleShadow", settings.subtitleShadow);
    formData.append("subtitleShadowColor", settings.subtitleShadowColor);

    formData.append("split", settings.split);
    formData.append("format", settings.format);

    apiClient?.postUploadVideo(formData).then(() => {
      getMediaPods(mediaPodDispatch, apiClient);
      getConfiguration(configurationDispatch, apiClient);
      onClose();
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} key={"top"}>
        <SheetContent side={"left"} className="h-full w-[95%] sm:w-[95%] sm:max-w-[95%] gap-0">
          <SheetHeader>
            <SheetTitle>Edit your video</SheetTitle>
            <SheetDescription>Make changes to your video here.</SheetDescription>
          </SheetHeader>
          <video ref={videoRef} src={videoSrc || undefined} className="hidden" onLoadedMetadata={handleVideoLoad} onTimeUpdate={handleTimeUpdate} />
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col lg:flex-row">
              <div className="lg:w-2/3 px-6">
                <div className="h-full flex flex-col">{thumbnail && <SubtitlePreview settings={settings} thumbnail={thumbnail} />}</div>
              </div>

              <div className="lg:w-1/3">
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Police</label>
                    <select
                      value={settings.subtitleFont}
                      onChange={(e) => handleSettingChange("subtitleFont", e.target.value)}
                      className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="ARIAL">Arial</option>
                      <option value="TIMES_NEW_ROMAN">Times New Roman</option>
                      <option value="COURIER_NEW">Courier New</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Taille</label>
                    <select
                      value={settings.subtitleSize}
                      onChange={(e) => handleSettingChange("subtitleSize", e.target.value)}
                      className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="small">Petit</option>
                      <option value="medium">Moyen</option>
                      <option value="large">Grand</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Couleur du texte</label>
                      <input
                        type="color"
                        value={settings.subtitleColor}
                        onChange={(e) => handleSettingChange("subtitleColor", e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.subtitleBold == "1" ? true : false}
                          onChange={(e) => handleSettingChange("subtitleBold", e.target.checked ? "1" : "0")}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Gras</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.subtitleItalic == "1" ? true : false}
                          onChange={(e) => handleSettingChange("subtitleItalic", e.target.checked ? "1" : "0")}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Italique</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.subtitleUnderline == "1" ? true : false}
                          onChange={(e) => handleSettingChange("subtitleUnderline", e.target.checked ? "1" : "0")}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Souligné</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Couleur du contour</label>
                      <input
                        type="color"
                        value={settings.subtitleOutlineColor}
                        onChange={(e) => handleSettingChange("subtitleOutlineColor", e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Épaisseur du contour</label>
                      <select
                        value={settings.subtitleOutlineThickness}
                        onChange={(e) => handleSettingChange("subtitleOutlineThickness", e.target.value)}
                        className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="OUTLINE_NONE">Aucun</option>
                        <option value="OUTLINE_SOFT">Fin</option>
                        <option value="OUTLINE_MEDIUM">Moyen</option>
                        <option value="OUTLINE_HARD">Épais</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ombre</label>
                      <select
                        value={settings.subtitleShadow}
                        onChange={(e) => handleSettingChange("subtitleShadow", e.target.value)}
                        className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="SHADOW_NONE">Aucune</option>
                        <option value="SHADOW_SOFT">Légère</option>
                        <option value="SHADOW_MEDIUM">Moyenne</option>
                        <option value="SHADOW_HARD">Forte</option>
                      </select>
                    </div>

                    {settings.subtitleShadow !== "SHADOW_NONE" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de l'ombre</label>
                        <input
                          type="color"
                          value={settings.subtitleShadowColor}
                          onChange={(e) => handleSettingChange("subtitleShadowColor", e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Format</label>
                    <select
                      value={settings.format}
                      onChange={(e) => handleSettingChange("format", e.target.value)}
                      className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="ORIGINAL">Original</option>
                      <option value="ZOOMED_916">Zoom 9:16</option>
                      <option value="NORMAL_916_WITH_BORDERS">Normal 9:16 avec bordures</option>
                      <option value="DUPLICATED_BLURRED_916">Dupliqué et flouté 9:16</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre de vidéos</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.split}
                      onChange={(e) => handleSettingChange("split", parseInt(e.target.value))}
                      className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleOnSubmit}>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
