"use client";

import { motion } from "framer-motion";
import { 
  Send, 
  Image, 
  Video, 
  Type,
  Paperclip,
  Mic,
  Smile,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  activeMode: 'image' | 'video' | 'text';
  setActiveMode: (mode: 'image' | 'video' | 'text') => void;
  isGenerating: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function SmartInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  activeMode,
  setActiveMode,
  isGenerating,
  fileInputRef
}: SmartInputProps) {
  const modes = [
    { id: 'image' as const, icon: Image, label: 'Image', color: 'from-purple-500 to-pink-500' },
    { id: 'video' as const, icon: Video, label: 'Video', color: 'from-blue-500 to-cyan-500' },
    { id: 'text' as const, icon: Type, label: 'Text', color: 'from-green-500 to-emerald-500' },
  ];

  const suggestions = {
    image: [
      "A futuristic cityscape at sunset",
      "Portrait of a cyberpunk character",
      "Abstract digital art with neon colors"
    ],
    video: [
      "Waves crashing on a beach in slow motion",
      "Time-lapse of clouds moving across sky",
      "Abstract particles floating in space"
    ],
    text: [
      "Write a creative story about...",
      "Explain the concept of...",
      "Generate ideas for..."
    ]
  };

  return (
    <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Mode Selector */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {modes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all",
                  activeMode === mode.id
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-lg`
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <mode.icon className="h-4 w-4" />
                <span className="text-sm">{mode.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs text-white/50">
            <Zap className="h-3 w-3" />
            <span>AI-powered generation</span>
          </div>
        </div>

        {/* Quick Suggestions */}
        {value.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {suggestions[activeMode].map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => onChange(suggestion)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 rounded-full transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input Area */}
        <div className="relative">
          <div className="flex items-end space-x-3">
            {/* Attachment Button */}
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </motion.button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder={`Describe the ${activeMode} you want to generate...`}
                className="w-full p-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm min-h-[60px] max-h-[200px]"
                rows={2}
              />
              
              {/* Character Count */}
              <div className="absolute bottom-2 right-2 text-xs text-white/30">
                {value.length}/500
              </div>
            </div>

            {/* Send Button */}
            <motion.button
              onClick={onSend}
              disabled={!value.trim() || isGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex-shrink-0 p-3 rounded-xl font-medium transition-all",
                value.trim() && !isGenerating
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="flex items-center justify-between mt-2 text-xs text-white/40">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center space-x-4">
              <span>⌘ + K for commands</span>
              <span>⌘ + / for shortcuts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}