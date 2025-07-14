"use client";

import React from 'react';
import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Palette, 
  Settings, 
  CheckCircle,
  Menu,
  X,
  Github,
  Twitter
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { getCurrentProvider, setCurrentProvider, providers, type Provider } from "@/lib/providers";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentProviderState, setCurrentProviderState] = useState<Provider>(getCurrentProvider());

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleProviderChange = (provider: Provider) => {
    setCurrentProvider(provider);
    setCurrentProviderState(provider);
  };

  const navItems = [
    { icon: Palette, label: "Text to Image", href: "#image" },
    { icon: Settings, label: "Text to Video", href: "#video" },
    { icon: CheckCircle, label: "Upscale", href: "#upscale" },
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <div className="relative">
            <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 h-8 w-8 rounded-full bg-primary/20 blur-sm" />
          </div>
          <span className="text-xl font-bold gradient-text">
            Firefly AI
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </motion.a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Provider Selector */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Provider:</span>
            <select
              value={currentProviderState}
              onChange={(e) => handleProviderChange(e.target.value as Provider)}
              className="text-xs border border-border rounded px-2 py-1 bg-background"
            >
              {Object.values(providers).map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                  {provider.status === "available" && " (Free)"}
                  {provider.status === "requires_credits" && " (Paid)"}
                </option>
              ))}
            </select>
          </div>

          {/* Provider Status Indicator */}
          <div className="hidden sm:flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "w-2 h-2 rounded-full",
                providers[currentProviderState].status === "available" 
                  ? "bg-green-500" 
                  : providers[currentProviderState].status === "requires_credits"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
              title={providers[currentProviderState].description}
            />
          </div>

          {/* Social links */}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Github className="h-5 w-5" />
          </motion.a>
          
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </motion.a>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-accent transition-colors md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur"
        >
          <nav className="container px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </motion.a>
            ))}
            
            {/* Mobile Provider Selector */}
            <div className="px-3 py-3">
              <label className="text-sm font-medium mb-2 block">AI Provider</label>
              <select
                value={currentProviderState}
                onChange={(e) => handleProviderChange(e.target.value as Provider)}
                className="w-full border border-border rounded px-3 py-2 bg-background text-sm"
              >
                {Object.values(providers).map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.description}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
} 