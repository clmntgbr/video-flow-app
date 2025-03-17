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
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { Slider } from "./ui/slider";

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
    setSettings(configuration.configuration);
  }, [configuration.configuration]);

  console.log(configuration.configuration);

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
    console.log(settings);
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
              <div className="lg:w-2/5 px-6">
                <div className="h-full flex flex-col">{thumbnail && <SubtitlePreview settings={settings} thumbnail={thumbnail} />}</div>
              </div>

              <div className="lg:w-3/5">
                <div className="px-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                  <div className="space-y-2">
                    <Label>Police</Label>
                    <Select defaultValue={settings.subtitleFont} onValueChange={(value) => handleSettingChange("subtitleFont", value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ARIAL">Arial</SelectItem>
                          <SelectItem value="TIMES_NEW_ROMAN">Times New Roman</SelectItem>
                          <SelectItem value="COURIER_NEW">Courier New</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select defaultValue={settings.format} onValueChange={(value) => handleSettingChange("format", value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ORIGINAL">Original</SelectItem>
                          <SelectItem value="ZOOMED_916">Zoomed in 9:16</SelectItem>
                          <SelectItem value="NORMAL_916_WITH_BORDERS">Normal with borders in 9:16</SelectItem>
                          <SelectItem value="DUPLICATED_BLURRED_916">Duplicated blurred in 9:16</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle shadow</Label>
                    <Select defaultValue={settings.subtitleShadow} onValueChange={(value) => handleSettingChange("subtitleShadow", value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">Soft</SelectItem>
                          <SelectItem value="2">Medium</SelectItem>
                          <SelectItem value="3">Hard</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle outline thickness</Label>
                    <Select
                      defaultValue={settings.subtitleOutlineThickness}
                      onValueChange={(value) => handleSettingChange("subtitleOutlineThickness", value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">Soft</SelectItem>
                          <SelectItem value="2">Medium</SelectItem>
                          <SelectItem value="3">Hard</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fontSize">Font size</Label>
                      <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                        {settings.subtitleSize}
                      </span>
                    </div>
                    <Slider
                      id="fontSize"
                      defaultValue={[Number(settings.subtitleSize)]}
                      min={0}
                      max={100}
                      step={1}
                      className="w-[60%]"
                      onValueChange={(value) => handleSettingChange("subtitleSize", value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fontSize">Split</Label>
                      <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                        {settings.split}
                      </span>
                    </div>
                    <Slider
                      id="fontSize"
                      defaultValue={[Number(settings.split)]}
                      min={1}
                      max={50}
                      step={1}
                      className="w-[60%]"
                      onValueChange={(value) => handleSettingChange("split", value[0])}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bold"
                        defaultChecked={settings.subtitleBold == "1" ? true : false}
                        onCheckedChange={(value) => handleSettingChange("subtitleBold", value ? "1" : "0")}
                      />
                      <label htmlFor="bold" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Bold
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="italic"
                        defaultChecked={settings.subtitleItalic == "1" ? true : false}
                        onCheckedChange={(value) => handleSettingChange("subtitleItalic", value ? "1" : "0")}
                      />
                      <label htmlFor="italic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Italic
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="underline"
                        defaultChecked={settings.subtitleUnderline == "1" ? true : false}
                        onCheckedChange={(value) => handleSettingChange("subtitleUnderline", value ? "1" : "0")}
                      />
                      <label
                        htmlFor="underline"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Underline
                      </label>
                    </div>
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
                  </div>

                  <div className="space-y-4">
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
