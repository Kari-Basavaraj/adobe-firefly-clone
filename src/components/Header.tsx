"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Cpu,
  Activity,
  Zap,
  Settings,
  User,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentProvider, setCurrentProvider, providers, type Provider } from "@/lib/providers";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [currentProviderState, setCurrentProviderState] = useState<Provider>(getCurrentProvider());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleProviderChange = (provider: Provider) => {
    setCurrentProvider(provider);
    setCurrentProviderState(provider);
  };

  if (!mounted) return null;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full border-b border-white/10 bg-black/20 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="absolute inset-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 blur-md opacity-50 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Firefly AI
            </span>
            <div className="text-xs text-white/50">Command Center</div>
          </div>
        </motion.div>

        {/* Center Status */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Online Status */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/80 font-medium">Online</span>
          </div>
          
          {/* Provider Selection */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-white/60">Provider:</span>
            <select
              value={currentProviderState}
              onChange={(e) => handleProviderChange(e.target.value as Provider)}
              className="text-sm border border-white/20 rounded-lg px-3 py-1 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
            >
              {Object.values(providers).map((provider) => (
                <option key={provider.id} value={provider.id} className="bg-gray-800">
                  {provider.name}
                </option>
              ))}
            </select>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                providers[currentProviderState].status === "available" 
                  ? "bg-green-400" 
                  : providers[currentProviderState].status === "requires_credits"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              )}
            />
          </div>

          {/* API Status */}
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Activity className="h-4 w-4 text-green-400" />
            <span>API Ready</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors relative"
          >
            <Bell className="h-5 w-5 text-white/70" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Settings className="h-5 w-5 text-white/70" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-white/70" />
            ) : (
              <Moon className="h-5 w-5 text-white/70" />
            )}
          </motion.button>

          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-white/80 hidden sm:block">User</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}