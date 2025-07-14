"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ImageIcon, 
  Sparkles, 
  Settings, 
  Download, 
  Copy, 
  Wand2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { generateImage, getImageSizes } from "@/lib/providers";
import { downloadImage, copyToClipboard } from "@/lib/utils";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    image_size: "square_hd",
    num_inference_steps: 25,
    guidance_scale: 7.5,
    num_images: 1,
    enable_safety_checker: true,
  });

  const imageSizes = getImageSizes();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      console.log("🎨 Starting image generation...");
      const result = await generateImage({
        prompt,
        ...settings,
      });
      
      console.log("✅ Generation result:", result);
      setGeneratedImages(prev => [result, ...prev]);
    } catch (error) {
      console.error("❌ Error generating image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, settings, isGenerating]);

  const handleDownload = (imageUrl: string, prompt: string) => {
    const filename = `firefly-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    downloadImage(imageUrl, filename);
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">Text to Image</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into stunning visuals with AI-powered image generation. 
          Describe what you want to see, and watch your imagination come to life.
        </p>
      </motion.div>

      {/* Generation Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 space-y-6"
      >
        {/* Prompt Input */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full h-32 p-4 pr-12 rounded-xl border border-border bg-card/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {prompt.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </motion.button>

            <motion.button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-firefly text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>Generate</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-border/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Size</label>
                    <select
                      value={settings.image_size}
                      onChange={(e) => setSettings(prev => ({ ...prev, image_size: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
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
                      value={settings.num_images}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, num_images: parseInt(e.target.value) }))}
                      className="w-full p-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  {/* Guidance Scale */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guidance Scale</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={settings.guidance_scale}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, guidance_scale: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {settings.guidance_scale}
                    </div>
                  </div>

                  {/* Inference Steps */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Inference Steps (SDXL: 1-50)</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={settings.num_inference_steps}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, num_inference_steps: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {settings.num_inference_steps}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Generated Images */}
      <AnimatePresence>
        {generatedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>Generated Images</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {generatedImages.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  {result.images && result.images.length > 0 && (
                    <>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={result.images[0].url}
                          alt={result.prompt || "Generated image"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => handleDownload(result.images[0].url, result.prompt || "image")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                            >
                              <Download className="h-4 w-4 text-white" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleCopy(result.prompt || "")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                            >
                              <Copy className="h-4 w-4 text-white" />
                            </motion.button>
                          </div>
                          <div className="text-xs text-white/80 bg-black/20 px-2 py-1 rounded">
                            {result.images[0].width || 1024}x{result.images[0].height || 1024}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-muted-foreground">Creating your masterpiece...</p>
        </motion.div>
      )}
    </div>
  );
} 