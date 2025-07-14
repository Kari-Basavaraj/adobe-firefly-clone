import { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Image, Video, Zap } from "lucide-react";
import { getImageSizes, getVideoLengths } from "@/lib/providers";
import { cn } from "@/lib/utils";

interface GenerationPanelProps {
  activeMode: 'image' | 'video';
  imageSettings: any;
  setImageSettings: (settings: any) => void;
  videoSettings: any;
  setVideoSettings: (settings: any) => void;
}

export default function GenerationPanel({ 
  activeMode, 
  imageSettings, 
  setImageSettings, 
  videoSettings, 
  setVideoSettings 
}: GenerationPanelProps) {

  const imageSizes = getImageSizes();
  const videoLengths = getVideoLengths();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Generation Settings</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Mode Indicator */}
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/10">
          {activeMode === 'image' ? (
            <Image className="h-4 w-4 text-primary" />
          ) : (
            <Video className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium capitalize">{activeMode} Generation</span>
        </div>

        {activeMode === 'image' ? (
          <div className="space-y-4">
            {/* Image Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Size</label>
              <select
                value={imageSettings.image_size}
                onChange={(e) => setImageSettings(prev => ({ ...prev, image_size: e.target.value }))}
                className="w-full p-2 rounded-lg border border-border bg-background text-sm"
              >
                {imageSizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Images</label>
              <select
                value={imageSettings.num_images}
                onChange={(e) => setImageSettings(prev => ({ ...prev, num_images: parseInt(e.target.value) }))}
                className="w-full p-2 rounded-lg border border-border bg-background text-sm"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Guidance Scale
                <span className="text-xs text-muted-foreground ml-1">({imageSettings.guidance_scale})</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={imageSettings.guidance_scale}
                onChange={(e) => setImageSettings(prev => ({ ...prev, guidance_scale: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Creative</span>
                <span>Precise</span>
              </div>
            </div>

            {/* Inference Steps */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Quality Steps
                <span className="text-xs text-muted-foreground ml-1">({imageSettings.num_inference_steps})</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={imageSettings.num_inference_steps}
                onChange={(e) => setImageSettings(prev => ({ ...prev, num_inference_steps: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Fast</span>
                <span>High Quality</span>
              </div>
            </div>

            {/* Safety Checker */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Safety Filter</label>
              <button
                onClick={() => setImageSettings(prev => ({ ...prev, enable_safety_checker: !prev.enable_safety_checker }))}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  imageSettings.enable_safety_checker ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    imageSettings.enable_safety_checker ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Length */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Duration</label>
              <select
                value={videoSettings.video_length}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, video_length: parseInt(e.target.value) }))}
                className="w-full p-2 rounded-lg border border-border bg-background text-sm"
              >
                {videoLengths.map(length => (
                  <option key={length.value} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>

            {/* FPS */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Frame Rate
                <span className="text-xs text-muted-foreground ml-1">({videoSettings.fps} fps)</span>
              </label>
              <input
                type="range"
                min="6"
                max="24"
                value={videoSettings.fps}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, fps: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smooth</span>
                <span>Cinematic</span>
              </div>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Guidance Scale
                <span className="text-xs text-muted-foreground ml-1">({videoSettings.guidance_scale})</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={videoSettings.guidance_scale}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, guidance_scale: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Inference Steps */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Quality Steps
                <span className="text-xs text-muted-foreground ml-1">({videoSettings.num_inference_steps})</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={videoSettings.num_inference_steps}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, num_inference_steps: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Quick Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            <button className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">Fast</div>
                <div className="text-xs text-muted-foreground">Quick generation</div>
              </div>
            </button>
            <button className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <Sliders className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Balanced</div>
                <div className="text-xs text-muted-foreground">Good quality & speed</div>
              </div>
            </button>
            <button className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <Image className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">High Quality</div>
                <div className="text-xs text-muted-foreground">Best results</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}