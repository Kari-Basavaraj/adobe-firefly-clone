// Provider management for AI generation services
import * as falApi from "./fal";

export type Provider = "fal" | "replicate" | "google";

export interface ProviderInfo {
  id: Provider;
  name: string;
  description: string;
  status: "available" | "requires_credits" | "error";
  models: {
    image: string[];
    video: string[];
  };
}

export const providers: Record<Provider, ProviderInfo> = {
  fal: {
    id: "fal",
    name: "fal.ai",
    description: "High-quality FLUX & MiniMax models",
    status: "requires_credits",
    models: {
      image: ["FLUX.1 [dev]", "FLUX.1 [schnell]"],
      video: ["MiniMax Video", "Kling Video", "Stable Video"],
    },
  },
  replicate: {
    id: "replicate",
    name: "Replicate",
    description: "Free tier with SDXL",
    status: "available",
    models: {
      image: ["SDXL"],
      video: ["Zeroscope V2 XL", "Stable Video Diffusion"],
    },
  },
  google: {
    id: "google",
    name: "Google AI",
    description: "Requires billing enabled",
    status: "requires_credits",
    models: {
      image: ["Imagen 4.0"], // Google Imagen API
      video: [], // No free video model available via this API yet
    },
  },
};

// Current active provider
let currentProvider: Provider = "replicate"; // Default to Replicate (free tier available)

export function getCurrentProvider(): Provider {
  return currentProvider;
}

export function setCurrentProvider(provider: Provider): void {
  currentProvider = provider;
  console.log(`🔄 Switched to provider: ${providers[provider].name}`);
}

// Replicate API functions (using server-side routes)
const replicateApi = {
  async generateImage(params: any) {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    return response.json();
  },

  async generateVideo(params: any) {
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate video');
    }

    return response.json();
  },

  async upscaleImage(imageUrl: string) {
    throw new Error("Upscaling not yet implemented for Replicate");
  },

  getImageSizes() {
    return [
      { value: "square_hd", label: "Square HD", width: 1024, height: 1024 },
      { value: "portrait_4_3", label: "Portrait 4:3", width: 768, height: 1024 },
      { value: "portrait_16_9", label: "Portrait 16:9", width: 576, height: 1024 },
      { value: "landscape_4_3", label: "Landscape 4:3", width: 1024, height: 768 },
      { value: "landscape_16_9", label: "Landscape 16:9", width: 1024, height: 576 },
    ];
  },

  getVideoLengths() {
    return [
      { value: 8, label: "8 frames (~1s)" },
      { value: 14, label: "14 frames (~2s)" },
      { value: 24, label: "24 frames (~4s)" },
    ];
  },
};

const googleApi = {
  async generateImage(params: any) {
    const response = await fetch('/api/generate-image-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image with Google AI');
    }

    return response.json();
  },

  async generateVideo(params: any) {
    throw new Error("Video generation not supported by Google AI provider yet.");
  },

  async upscaleImage(imageUrl: string) {
    throw new Error("Upscaling not yet implemented for Google AI");
  },

  getImageSizes() {
    // Google Imagen supports various aspect ratios
    return [
      { value: "square_hd", label: "Square (1:1)", width: 1024, height: 1024 },
      { value: "portrait_4_3", label: "Portrait 3:4", width: 896, height: 1280 },
      { value: "portrait_16_9", label: "Portrait 9:16", width: 768, height: 1408 },
      { value: "landscape_4_3", label: "Landscape 4:3", width: 1280, height: 896 },
      { value: "landscape_16_9", label: "Landscape 16:9", width: 1408, height: 768 },
    ];
  },

  getVideoLengths() {
    return []; // No video support
  },
};

export function getProviderApi(provider?: Provider) {
  const activeProvider = provider || currentProvider;
  switch (activeProvider) {
    case "fal":
      return falApi;
    case "replicate":
      return replicateApi;
    case "google":
      return googleApi;
    default:
      return replicateApi; // Default to Replicate (free tier available)
  }
}

export async function generateImage(params: any) {
  const api = getProviderApi();
  return api.generateImage(params);
}

export async function generateVideo(params: any) {
  const api = getProviderApi();
  return api.generateVideo(params);
}

export async function upscaleImage(imageUrl: string) {
  const api = getProviderApi();
  return api.upscaleImage(imageUrl);
}

export function getImageSizes() {
  const api = getProviderApi();
  return api.getImageSizes();
}

export function getVideoLengths() {
  const api = getProviderApi();
  return api.getVideoLengths();
} 