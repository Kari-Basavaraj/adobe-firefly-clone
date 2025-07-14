"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Play, 
  Download, 
  Copy, 
  Sparkles, 
  Settings,
  Loader2,
  Upload,
  FileImage,
  Clock,
  AlertCircle
} from "lucide-react";
import { generateVideo, getVideoLengths } from "@/lib/providers";
import { cn, downloadImage, copyToClipboard } from "@/lib/utils";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    video_length: 14,
    fps: 6,
    guidance_scale: 7.5,
    num_inference_steps: 25,
  });

  const videoLengths = getVideoLengths();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      console.log("🎬 Starting video generation...");
      const result = await generateVideo({
        prompt,
        image_url: sourceImage || undefined,
        ...settings,
      });
      
      console.log("✅ Video generation result:", result);
      setGeneratedVideos(prev => [{ ...result, prompt }, ...prev]);
    } catch (error) {
      console.error("❌ Error generating video:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate video. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, sourceImage, settings, isGenerating]);

  const handleDownload = (videoUrl: string, prompt: string) => {
    const filename = `firefly-video-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
    downloadImage(videoUrl, filename);
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
          <Video className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">Text to Video</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Bring your stories to life with AI-powered video generation. 
          Create dynamic videos from text descriptions or animate your images.
        </p>
      </motion.div>

      {/* Generation Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 space-y-6"
      >
        {/* Source Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Source Image (Optional)</label>
            <span className="text-xs text-muted-foreground">
              Upload an image to animate, or leave empty for text-only generation
            </span>
          </div>
          
          <div className="relative">
            {sourceImage ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                <img 
                  src={sourceImage} 
                  alt="Source" 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSourceImage(null)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
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
                  <Play className="h-5 w-5" />
                  <span>Generate Video</span>
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
                  {/* Video Length */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video Duration</label>
                    <select
                      value={settings.video_length}
                      onChange={(e) => setSettings((prev: any) => ({ ...prev, video_length: parseInt(e.target.value) }))}
                      className="w-full p-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
                    >
                      {getVideoLengths().map(length => (
                        <option key={length.value} value={length.value}>
                          {length.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video Model</label>
                    <select
                      className="w-full p-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
                      defaultValue="auto"
                    >
                      <option value="auto">Auto Select</option>
                      <option value="minimax">MiniMax (Text-to-Video)</option>
                      <option value="kling">Kling (Image-to-Video)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Generated Videos */}
      <AnimatePresence>
        {generatedVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>Generated Videos</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedVideos.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  {result.video && (
                    <>
                      <div className="aspect-video overflow-hidden">
                        <video
                          src={result.video.url}
                          controls
                          className="w-full h-full object-cover"
                          poster={sourceImage || undefined}
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => handleDownload(result.video.url, result.prompt || "video")}
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
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-white/80 bg-black/20 px-2 py-1 rounded flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Video</span>
                            </div>
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
          <p className="text-muted-foreground">Creating your video masterpiece...</p>
          <p className="text-xs text-muted-foreground">This may take a few minutes</p>
        </motion.div>
      )}
    </div>
  );
} 