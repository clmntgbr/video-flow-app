"use client";
import { useApiClient } from "@/store/context/ApiContext";
import useConfigurationContext from "@/store/context/configurations/hooks";
import useMediaPodContext from "@/store/context/media-pods/hooks";
import { Configuration } from "@/store/interface/configuration";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { SubtitlePreview } from "./SubtitlePreview";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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
  const { mediaPodDispatch } = useMediaPodContext();
  const { configuration, configurationDispatch } = useConfigurationContext();
  const [settings, setSettings] = useState<Configuration>(configuration.configuration);

  const apiClient = useApiClient();

  useEffect(() => {
    if (!configuration.loading) {
      setSettings(configuration.configuration);
    }
  }, [configuration.loading, configuration.configuration]);

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

  const handleSubtitleColorChange = (value: string) => {
    handleSettingChange("subtitleColor", value);
  };

  const handleSubtiteOutlineColorChange = (value: string) => {
    handleSettingChange("subtitleOutlineColor", value);
  };

  const handleSubtitleShadowColorChange = (value: string) => {
    handleSettingChange("subtitleShadowColor", value);
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

    // apiClient?.postUploadVideo(formData).then(() => {
    //   getMediaPods(mediaPodDispatch, apiClient);
    //   getConfiguration(configurationDispatch, apiClient);
    //   onClose();
    // });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Edit your video</DialogTitle>
            <DialogDescription>Make changes to your video here.</DialogDescription>
          </DialogHeader>

          <video ref={videoRef} src={videoSrc || undefined} className="hidden" onLoadedMetadata={handleVideoLoad} onTimeUpdate={handleTimeUpdate} />
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex h-full">
            <div className="flex-1 w-3/5 flex items-center justify-center">
              {thumbnail && <SubtitlePreview settings={settings} thumbnail={thumbnail} />}
            </div>

            <div className="w-2/5 space-y-6 overflow-y-auto max-h-[calc(60vh-8rem)] px-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Police</Label>
                  <Select defaultValue={settings.subtitleFont} onValueChange={(value) => handleSettingChange("subtitleFont", value)}>
                    <SelectTrigger className="w-full">
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
                    <SelectTrigger className="w-full">
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
                  <Label>Font color</Label>
                  <ColorPicker defaultColor={settings.subtitleColor} onChange={handleSubtitleColorChange} />
                </div>

                <div className="space-y-2">
                  <Label>Outline color</Label>
                  <ColorPicker defaultColor={settings.subtitleOutlineColor} onChange={handleSubtiteOutlineColorChange} />
                </div>

                <div className="space-y-2">
                  <Label>Shadow color</Label>
                  <ColorPicker defaultColor={settings.subtitleShadowColor} onChange={handleSubtitleShadowColorChange} />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle outline thickness</Label>
                  <Select
                    defaultValue={settings.subtitleOutlineThickness}
                    onValueChange={(value) => handleSettingChange("subtitleOutlineThickness", value)}
                  >
                    <SelectTrigger className="w-full">
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
                  <Label>Subtitle shadow</Label>
                  <Select defaultValue={settings.subtitleShadow} onValueChange={(value) => handleSettingChange("subtitleShadow", value)}>
                    <SelectTrigger className="w-full">
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
                  <div className="flex items-center justify-between mb-2.5">
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
                    className="w-full"
                    onValueChange={(value) => handleSettingChange("subtitleSize", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2.5">
                    <Label htmlFor="fontSize">Split</Label>
                    <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                      {settings.split}
                    </span>
                  </div>
                  <Slider
                    id="split"
                    defaultValue={[Number(settings.split)]}
                    min={1}
                    max={50}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => handleSettingChange("split", value[0])}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Checkbox
                  id="bold"
                  defaultChecked={settings.subtitleBold == "1"}
                  onCheckedChange={(value) => handleSettingChange("subtitleBold", value ? "1" : "0")}
                />
                <Label htmlFor="bold">Bold</Label>

                <Checkbox
                  id="italic"
                  defaultChecked={settings.subtitleItalic == "1"}
                  onCheckedChange={(value) => handleSettingChange("subtitleItalic", value ? "1" : "0")}
                />
                <Label htmlFor="italic">Italic</Label>

                <Checkbox
                  id="underline"
                  defaultChecked={settings.subtitleUnderline == "1"}
                  onCheckedChange={(value) => handleSettingChange("subtitleUnderline", value ? "1" : "0")}
                />
                <Label htmlFor="underline">Underline</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
