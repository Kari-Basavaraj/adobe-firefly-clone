"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Image, 
  Video, 
  Type,
  Paperclip,
  Settings,
  History,
  Cpu,
  Zap,
  BarChart3,
  Wrench,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Share,
  Copy,
  MoreHorizontal,
  Sparkles,
  Clock,
  User,
  Bot
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import GenerationGallery from "@/components/GenerationGallery";
import SmartInput from "@/components/SmartInput";
import AdvancedSettings from "@/components/AdvancedSettings";
import { generateImage, generateVideo } from "@/lib/providers";
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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Firefly AI Command Center. I\'m your AI assistant ready to help you create stunning visuals. What would you like to generate today?',
      timestamp: new Date(),
      mode: 'text',
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMode, setActiveMode] = useState<'image' | 'video' | 'text'>('image');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<GenerationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSettings, setImageSettings] = useState({
    image_size: "square_hd",
    num_inference_steps: 25,
    guidance_scale: 7.5,
    num_images: 1,
    enable_safety_checker: true,
  });

  const [videoSettings, setVideoSettings] = useState({
    video_length: 14,
    fps: 6,
    guidance_scale: 7.5,
    num_inference_steps: 25,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      mode: activeMode,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsGenerating(true);

    try {
      const startTime = Date.now();
      let result;
      
      if (activeMode === 'image') {
        result = await generateImage({
          prompt: userMessage.content,
          ...imageSettings,
        });
        
        const generationTime = Date.now() - startTime;
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Generated ${result.images?.length || 1} image(s) using SDXL model`,
          timestamp: new Date(),
          mode: 'image',
          media: result.images?.[0] ? {
            type: 'image',
            url: result.images[0].url,
            prompt: userMessage.content,
            metadata: {
              model: 'SDXL',
              parameters: imageSettings,
              generationTime,
            }
          } : undefined,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Add to generation history
        if (result.images?.[0]) {
          const historyItem: GenerationItem = {
            id: assistantMessage.id,
            type: 'image',
            url: result.images[0].url,
            prompt: userMessage.content,
            timestamp: new Date(),
            metadata: {
              model: 'SDXL',
              parameters: imageSettings,
              generationTime,
            }
          };
          setGenerationHistory(prev => [historyItem, ...prev]);
        }
        
      } else if (activeMode === 'video') {
        result = await generateVideo({
          prompt: userMessage.content,
          ...videoSettings,
        });
        
        const generationTime = Date.now() - startTime;
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Generated video using Zeroscope V2 XL model`,
          timestamp: new Date(),
          mode: 'video',
          media: result.url ? {
            type: 'video',
            url: result.url,
            prompt: userMessage.content,
            metadata: {
              model: 'Zeroscope V2 XL',
              parameters: videoSettings,
              generationTime,
            }
          } : undefined,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Add to generation history
        if (result.url) {
          const historyItem: GenerationItem = {
            id: assistantMessage.id,
            type: 'video',
            url: result.url,
            prompt: userMessage.content,
            timestamp: new Date(),
            metadata: {
              model: 'Zeroscope V2 XL',
              parameters: videoSettings,
              generationTime,
            }
          };
          setGenerationHistory(prev => [historyItem, ...prev]);
        }
      }
      
    } catch (error) {
      console.error("❌ Generation error:", error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        mode: activeMode,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredHistory = generationHistory.filter(item =>
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <Sidebar 
              generationHistory={filteredHistory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onClose={() => setShowSidebar(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              {!showSidebar && (
                <motion.button
                  onClick={() => setShowSidebar(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Menu className="h-5 w-5 text-white" />
                </motion.button>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/70">AI Command Center Active</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setShowGallery(!showGallery)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  showGallery 
                    ? "bg-blue-500 text-white" 
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                Gallery
              </motion.button>
              
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showSettings 
                    ? "bg-blue-500 text-white" 
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat/Gallery Area */}
            <div className="flex-1 flex flex-col">
              {showGallery ? (
                <GenerationGallery 
                  items={filteredHistory}
                  onItemSelect={(item) => {
                    setInputValue(item.prompt);
                    setShowGallery(false);
                  }}
                />
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                    </AnimatePresence>
                    
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 text-white/60"
                      >
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-sm">Generating {activeMode}...</span>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Smart Input */}
                  <SmartInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    onKeyPress={handleKeyPress}
                    activeMode={activeMode}
                    setActiveMode={setActiveMode}
                    isGenerating={isGenerating}
                    fileInputRef={fileInputRef}
                  />
                </>
              )}
            </div>

            {/* Advanced Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <AdvancedSettings
                  activeMode={activeMode}
                  imageSettings={imageSettings}
                  setImageSettings={setImageSettings}
                  videoSettings={videoSettings}
                  setVideoSettings={setVideoSettings}
                  onClose={() => setShowSettings(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          // Handle file upload
          const file = e.target.files?.[0];
          if (file) {
            // Process file upload
            console.log("File selected:", file);
          }
        }}
      />
    </div>
  );
}