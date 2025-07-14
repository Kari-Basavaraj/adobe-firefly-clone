"use client";

import { motion } from "framer-motion";
import { 
  X, 
  Sliders, 
  Image, 
  Video, 
  Zap, 
  Settings, 
  Save,
  RotateCcw,
  Info
} from "lucide-react";
import { getImageSizes, getVideoLengths } from "@/lib/providers";
import { cn } from "@/lib/utils";

interface AdvancedSettingsProps {
  activeMode: 'image' | 'video' | 'text';
  imageSettings: any;
  setImageSettings: (settings: any) => void;
  videoSettings: any;
  setVideoSettings: (settings: any) => void;
  onClose: () => void;
}

export default function AdvancedSettings({
  activeMode,
  imageSettings,
  setImageSettings,
  videoSettings,
  setVideoSettings,
  onClose
}: AdvancedSettingsProps) {
  const imageSizes = getImageSizes();
  const videoLengths = getVideoLengths();

  const presets = {
    image: [
      { name: "Fast", settings: { num_inference_steps: 15, guidance_scale: 5 } },
      { name: "Balanced", settings: { num_inference_steps: 25, guidance_scale: 7.5 } },
      { name: "Quality", settings: { num_inference_steps: 40, guidance_scale: 10 } },
    ],
    video: [
      { name: "Quick", settings: { video_length: 8, fps: 6 } },
      { name: "Standard", settings: { video_length: 14, fps: 8 } },
      { name: "Extended", settings: { video_length: 24, fps: 12 } },
    ]
  };

  const applyPreset = (preset: any) => {
    if (activeMode === 'image') {
      setImageSettings(prev => ({ ...prev, ...preset.settings }));
    } else if (activeMode === 'video') {
      setVideoSettings(prev => ({ ...prev, ...preset.settings }));
    }
  };

  const resetToDefaults = () => {
    if (activeMode === 'image') {
      setImageSettings({
        image_size: "square_hd",
        num_inference_steps: 25,
        guidance_scale: 7.5,
        num_images: 1,
        enable_safety_checker: true,
      });
    } else if (activeMode === 'video') {
      setVideoSettings({
        video_length: 14,
        fps: 6,
        guidance_scale: 7.5,
        num_inference_steps: 25,
      });
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-96 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Advanced Settings</h2>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white/60" />
          </motion.button>
        </div>

        {/* Mode Indicator */}
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
          {activeMode === 'image' ? (
            <Image className="h-4 w-4 text-blue-300" />
          ) : (
            <Video className="h-4 w-4 text-blue-300" />
          )}
          <span className="text-sm font-medium text-blue-300 capitalize">
            {activeMode} Generation
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Quick Presets */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-3">Quick Presets</h3>
          <div className="grid grid-cols-3 gap-2">
            {presets[activeMode === 'text' ? 'image' : activeMode]?.map((preset) => (
              <motion.button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-center"
              >
                <div className="text-xs font-medium text-white/90 mb-1">
                  {preset.name}
                </div>
                <div className="text-xs text-white/50">
                  {activeMode === 'image' ? `${preset.settings.num_inference_steps} steps` : `${preset.settings.video_length}f`}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-6">
          {activeMode === 'image' ? (
            <>
              {/* Image Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">Image Size</label>
                <select
                  value={imageSettings.image_size}
                  onChange={(e) => setImageSettings(prev => ({ ...prev, image_size: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                >
                  {imageSizes.map(size => (
                    <option key={size.value} value={size.value} className="bg-gray-800">
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Images */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">Number of Images</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <motion.button
                      key={num}
                      onClick={() => setImageSettings(prev => ({ ...prev, num_images: num }))}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-2 rounded-lg text-sm font-medium transition-all",
                        imageSettings.num_images === num
                          ? "bg-blue-500 text-white"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      )}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Guidance Scale */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Guidance Scale</label>
                  <span className="text-sm text-blue-400 font-mono">
                    {imageSettings.guidance_scale}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={imageSettings.guidance_scale}
                  onChange={(e) => setImageSettings(prev => ({ ...prev, guidance_scale: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>Creative</span>
                  <span>Precise</span>
                </div>
              </div>

              {/* Inference Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Quality Steps</label>
                  <span className="text-sm text-blue-400 font-mono">
                    {imageSettings.num_inference_steps}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={imageSettings.num_inference_steps}
                  onChange={(e) => setImageSettings(prev => ({ ...prev, num_inference_steps: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>Fast</span>
                  <span>High Quality</span>
                </div>
              </div>

              {/* Safety Checker */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <div className="text-sm font-medium text-white/80">Safety Filter</div>
                  <div className="text-xs text-white/50">Filter inappropriate content</div>
                </div>
                <motion.button
                  onClick={() => setImageSettings(prev => ({ ...prev, enable_safety_checker: !prev.enable_safety_checker }))}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    imageSettings.enable_safety_checker ? "bg-blue-500" : "bg-white/20"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      imageSettings.enable_safety_checker ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </motion.button>
              </div>
            </>
          ) : activeMode === 'video' ? (
            <>
              {/* Video Length */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">Video Duration</label>
                <select
                  value={videoSettings.video_length}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, video_length: parseInt(e.target.value) }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                >
                  {videoLengths.map(length => (
                    <option key={length.value} value={length.value} className="bg-gray-800">
                      {length.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* FPS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Frame Rate</label>
                  <span className="text-sm text-blue-400 font-mono">
                    {videoSettings.fps} fps
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={videoSettings.fps}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, fps: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>Smooth</span>
                  <span>Cinematic</span>
                </div>
              </div>

              {/* Guidance Scale */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Guidance Scale</label>
                  <span className="text-sm text-blue-400 font-mono">
                    {videoSettings.guidance_scale}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={videoSettings.guidance_scale}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, guidance_scale: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Inference Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Quality Steps</label>
                  <span className="text-sm text-blue-400 font-mono">
                    {videoSettings.num_inference_steps}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={videoSettings.num_inference_steps}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, num_inference_steps: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <div className="flex space-x-3">
          <motion.button
            onClick={resetToDefaults}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Reset</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="text-sm">Save Preset</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}