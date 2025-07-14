"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  History, 
  Cpu, 
  Zap, 
  BarChart3, 
  Wrench,
  X,
  Image,
  Video,
  Clock,
  Sparkles,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: Date;
  metadata: {
    model: string;
    parameters: any;
    generationTime: number;
  };
}

interface SidebarProps {
  generationHistory: GenerationItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
}

export default function Sidebar({ 
  generationHistory, 
  searchQuery, 
  setSearchQuery, 
  onClose 
}: SidebarProps) {
  const sidebarItems = [
    { icon: History, label: "History", count: generationHistory.length },
    { icon: Cpu, label: "Models", count: 3 },
    { icon: Zap, label: "Presets", count: 8 },
    { icon: Wrench, label: "Tools", count: 5 },
    { icon: BarChart3, label: "Usage", count: null },
  ];

  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Command Center</h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white/60" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search generations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 4 }}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
              index === 0 
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.count !== null && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Recent Generations */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/80">Recent Generations</h3>
            <Filter className="h-4 w-4 text-white/40" />
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {generationHistory.slice(0, 10).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {item.type === 'image' ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                        <img 
                          src={item.url} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 line-clamp-2 mb-1">
                      {item.prompt}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-white/50">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span>{item.metadata.model}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-xs text-white/50">
          <Sparkles className="h-4 w-4" />
          <span>Powered by Replicate AI</span>
        </div>
      </div>
    </motion.div>
  );
}