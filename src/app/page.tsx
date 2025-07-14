"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Video, Wand2, Sparkles, ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import ImageGenerator from "@/components/ImageGenerator";
import VideoGenerator from "@/components/VideoGenerator";
import ProviderStatus from "@/components/ProviderStatus";
import { cn } from "@/lib/utils";

type Tab = "image" | "video";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("image");

  const tabs = [
    {
      id: "image" as Tab,
      label: "Text to Image",
      icon: Image,
      description: "Generate stunning images from text",
    },
    {
      id: "video" as Tab,
      label: "Text to Video",
      icon: Video,
      description: "Create dynamic videos from descriptions",
    },
  ];

  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Generation",
      description: "State-of-the-art models for exceptional quality",
    },
    {
      icon: Sparkles,
      title: "Creative Control",
      description: "Fine-tune every aspect of your generations",
    },
    {
      icon: Star,
      title: "Professional Quality",
      description: "High-resolution outputs ready for any use",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 mb-12"
        >
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold gradient-text"
            >
              Create with AI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Transform your imagination into reality with cutting-edge AI technology. 
              Generate stunning images and videos from simple text descriptions.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Provider Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <ProviderStatus />
          </motion.div>
        </motion.section>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 p-1 bg-muted rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === "image" && <ImageGenerator />}
            {activeTab === "video" && <VideoGenerator />}
          </motion.div>
        </AnimatePresence>

        {/* Getting Started */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Getting Started</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready to unleash your creativity? Follow these simple steps to start generating amazing content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose Your Mode",
                description: "Select between image or video generation based on your needs",
              },
              {
                step: "2",
                title: "Describe Your Vision",
                description: "Write a detailed prompt describing what you want to create",
              },
              {
                step: "3",
                title: "Generate & Download",
                description: "Click generate and download your AI-created masterpiece",
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center space-y-4 p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{step.step}</span>
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Firefly AI. Powered by cutting-edge artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
