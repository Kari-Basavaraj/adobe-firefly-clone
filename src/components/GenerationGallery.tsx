"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Grid3X3, 
  List, 
  Filter, 
  Download, 
  Share, 
  Copy, 
  MoreHorizontal,
  Image,
  Video,
  Clock,
  Zap,
  Search,
  SortDesc
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

interface GenerationGalleryProps {
  items: GenerationItem[];
  onItemSelect: (item: GenerationItem) => void;
}

export default function GenerationGallery({ items, onItemSelect }: GenerationGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'model'>('newest');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = items
    .filter(item => filterType === 'all' || item.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'model':
          return a.metadata.model.localeCompare(b.metadata.model);
        default:
          return 0;
      }
    });

  const handleItemClick = (item: GenerationItem) => {
    onItemSelect(item);
  };

  const handleDownload = (item: GenerationItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `firefly-${item.type}-${item.id}.${item.type === 'image' ? 'png' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Generation Gallery</h2>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'grid' 
                  ? "bg-blue-500 text-white" 
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'list' 
                  ? "bg-blue-500 text-white" 
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              <List className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="model">By Model</option>
            </select>
          </div>

          <div className="text-sm text-white/60">
            {filteredItems.length} items
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Image className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium mb-2">No generations yet</p>
            <p className="text-sm">Start creating to see your generations here</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {/* Media Preview */}
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.prompt);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Copy className="h-4 w-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm text-white/90 line-clamp-2 mb-2">
                    {item.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp.toLocaleDateString()}</span>
                    </div>
                    <span className="px-2 py-1 bg-white/10 rounded-full">
                      {item.metadata.model}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 line-clamp-1 mb-1">
                    {item.prompt}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-white/50">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp.toLocaleString()}</span>
                    </div>
                    <span>•</span>
                    <span>{item.metadata.model}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>{(item.metadata.generationTime / 1000).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Download className="h-4 w-4 text-white/60" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.prompt);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-white/60" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}