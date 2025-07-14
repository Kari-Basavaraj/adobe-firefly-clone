"use client";

import { motion } from "framer-motion";
import { User, Bot, Download, Copy, Share2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    type: "user" | "assistant";
    content: string;
    timestamp: Date;
    generationType?: "image" | "video";
    result?: any;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleShare = (url: string) => {
    if (navigator.share) {
      navigator.share({ url });
    } else {
      handleCopy(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 p-4 rounded-xl",
        isUser 
          ? "bg-primary/5 ml-12" 
          : "bg-card/50 mr-12"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {isUser ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>

        <div className="text-sm leading-relaxed">
          {message.content}
        </div>

        {/* Generated Content */}
        {message.result && !isUser && (
          <div className="space-y-3">
            {message.generationType === "image" && message.result.images && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {message.result.images.map((image: any, index: number) => (
                  <div key={index} className="group relative rounded-lg overflow-hidden bg-card border">
                    <img
                      src={image.url}
                      alt={message.content}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(image.url, `image-${index}.png`)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleCopy(image.url)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleShare(image.url)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message.generationType === "video" && message.result.url && (
              <div className="group relative rounded-lg overflow-hidden bg-card border">
                <video
                  src={message.result.url}
                  controls
                  className="w-full aspect-video"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => handleDownload(message.result.url, "video.mp4")}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleCopy(message.result.url)}
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}