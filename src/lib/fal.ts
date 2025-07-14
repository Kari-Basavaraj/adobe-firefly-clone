import { fal } from "@fal-ai/client";

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_KEY || process.env.NEXT_PUBLIC_FAL_KEY,
});

export interface ImageGenerationParams {
  prompt: string;
  image_size?: "square_hd" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
  num_inference_steps?: number;
  guidance_scale?: number;
  num_images?: number;
  enable_safety_checker?: boolean;
  seed?: number;
}

export interface VideoGenerationParams {
  prompt: string;
  image_url?: string;
  video_length?: number;
  fps?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  content_type?: string;
  file_name?: string;
  file_size?: number;
}

export interface GeneratedVideo {
  url: string;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  file_size?: number;
}

export async function generateImage(params: ImageGenerationParams): Promise<any> {
  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: params.prompt,
        image_size: params.image_size || "square_hd",
        num_inference_steps: params.num_inference_steps || 28,
        guidance_scale: params.guidance_scale || 3.5,
        num_images: params.num_images || 1,
        enable_safety_checker: params.enable_safety_checker ?? true,
        seed: params.seed,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation progress:", update.status);
        }
      },
    });

    return result.data;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function generateVideo(params: VideoGenerationParams): Promise<any> {
  try {
    // Use MiniMax video generation for text-to-video
    if (!params.image_url) {
      const result = await fal.subscribe("fal-ai/minimax/video-01", {
        input: {
          prompt: params.prompt,
          prompt_optimizer: true,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Video generation progress:", update.status);
          }
        },
      });
      return result.data;
    } else {
      // Use Kling for image-to-video
      const result = await fal.subscribe("fal-ai/kling-video/v2.1/standard/image-to-video", {
        input: {
          prompt: params.prompt,
          image_url: params.image_url,
          duration: "5",
          cfg_scale: 0.5,
          negative_prompt: "blur, distort, and low quality",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Video generation progress:", update.status);
          }
        },
      });
      return result.data;
    }
  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
}

export async function upscaleImage(imageUrl: string): Promise<any> {
  try {
    const result = await fal.subscribe("fal-ai/esrgan", {
      input: {
        image_url: imageUrl,
        scale: 4,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Upscaling progress:", update.status);
        }
      },
    });

    return result.data;
  } catch (error) {
    console.error("Error upscaling image:", error);
    throw error;
  }
}

export function getImageSizes() {
  return [
    { value: "square_hd", label: "Square HD (1024x1024)", aspect: "1:1" },
    { value: "portrait_4_3", label: "Portrait 4:3 (768x1024)", aspect: "3:4" },
    { value: "portrait_16_9", label: "Portrait 16:9 (576x1024)", aspect: "9:16" },
    { value: "landscape_4_3", label: "Landscape 4:3 (1024x768)", aspect: "4:3" },
    { value: "landscape_16_9", label: "Landscape 16:9 (1024x576)", aspect: "16:9" },
  ];
}

export function getVideoLengths() {
  return [
    { value: 5, label: "5 seconds" },
    { value: 10, label: "10 seconds" },
  ];
}