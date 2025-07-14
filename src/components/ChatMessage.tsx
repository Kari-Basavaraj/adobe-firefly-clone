"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Bot, 
  Copy, 
  Download, 
  Share, 
  MoreHorizontal,
  Clock,
  Zap,
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode: 'image' | 'video' | 'text';
  media?: {
    type: 'image' | 'video';
    url: string;
    prompt: string;
    metadata?: {
      model: string;
      parameters: any;
      generationTime: number;
    };
  };
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Content',
          text: message.content,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex space-x-4 max-w-4xl mx-auto",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}

      <div className={cn(
        "flex flex-col space-y-3 max-w-2xl",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl backdrop-blur-sm border",
          isUser 
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-white/20 rounded-br-md shadow-lg" 
            : "bg-white/10 text-white border-white/20 rounded-bl-md"
        )}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Media Content */}
        {message.media && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm shadow-xl max-w-md"
          >
            {message.media.type === 'image' ? (
              <img
                src={message.media.url}
                alt={message.media.prompt}
                className="w-full h-auto max-h-96 object-cover"
              />
            ) : (
              <video
                src={message.media.url}
                controls
                className="w-full h-auto max-h-96"
                poster=""
              />
            )}
            
            {/* Media Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Media Actions */}
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => handleDownload(
                      message.media!.url, 
                      `firefly-${message.media!.type}-${message.id}.${message.media!.type === 'image' ? 'png' : 'mp4'}`
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleCopy(message.media!.prompt)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-white" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare(message.media!.url)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Share className="h-4 w-4 text-white" />
                  </motion.button>
                </div>
                
                {/* Media Info */}
                <div className="flex items-center space-x-2">
                  {message.media.metadata && (
                    <div className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>{(message.media.metadata.generationTime / 1000).toFixed(1)}s</span>
                    </div>
                  )}
                  <div className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded-full flex items-center space-x-1">
                    {message.media.type === 'image' ? (
                      <ImageIcon className="h-3 w-3" />
                    ) : (
                      <VideoIcon className="h-3 w-3" />
                    )}
                    <span className="capitalize">{message.media.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Metadata */}
            {message.media.metadata && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs text-white/80 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <div className="font-medium">{message.media.metadata.model}</div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Message Footer */}
        <div className="flex items-center space-x-2 text-xs text-white/40">
          <Clock className="h-3 w-3" />
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.mode !== 'text' && (
            <>
              <span>•</span>
              <div className="flex items-center space-x-1">
                {message.mode === 'image' ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <VideoIcon className="h-3 w-3" />
                )}
                <span className="capitalize">{message.mode} mode</span>
              </div>
            </>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <User className="h-5 w-5 text-white/80" />
        </div>
      )}
    </motion.div>
  );
}