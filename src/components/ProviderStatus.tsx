"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, CreditCard, Zap, X } from "lucide-react";
import { getCurrentProvider, providers, type Provider } from "@/lib/providers";
import { cn } from "@/lib/utils";

export default function ProviderStatus() {
  const [currentProvider, setCurrentProvider] = useState<Provider>(getCurrentProvider());
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Update when provider changes
    const interval = setInterval(() => {
      setCurrentProvider(getCurrentProvider());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const provider = providers[currentProvider];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "requires_credits":
        return <CreditCard className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "available":
        return "Ready to generate (Free tier available)";
      case "requires_credits":
        return "Requires credits - Add funds to your account";
      default:
        return "Provider unavailable";
    }
  };

  return (
    <div className="relative">
      <motion.div
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
          provider.status === "available" 
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50" 
            : provider.status === "requires_credits"
            ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50"
        )}
      >
        <div className="flex items-center space-x-2">
          {getStatusIcon(provider.status)}
          <div>
            <div className="font-medium text-sm">
              {provider.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {getStatusMessage(provider.status)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Zap className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {provider.models.image.length} image, {provider.models.video.length} video models
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-border rounded-xl shadow-lg z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{provider.name} Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-400">
                  {provider.status === "available" 
                    ? "Ready to use" 
                    : provider.status === "requires_credits"
                    ? "Requires credits"
                    : "Can&apos;t be reached"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Image Models</h4>
                <div className="flex flex-wrap gap-1">
                  {provider.models.image.map((model) => (
                    <span
                      key={model}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Video Models</h4>
                <div className="flex flex-wrap gap-1">
                  {provider.models.video.map((model) => (
                    <span
                      key={model}
                      className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-md"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {provider.status === "requires_credits" && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">Credits Required</span>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    This provider requires credits. Visit the provider&apos;s dashboard to add funds.
                  </p>
                </div>
              )}

              {provider.status === "available" && (
                <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready to Use</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    This provider has free tier available. You can start generating immediately!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 