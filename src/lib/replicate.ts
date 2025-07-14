import Replicate from "replicate";

// Configure Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
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

// Map our image sizes to Replicate's aspect ratios
function getReplicateAspectRatio(size: string): string {
  const sizeMap: Record<string, string> = {
    "square_hd": "1:1",
    "portrait_4_3": "3:4", 
    "portrait_16_9": "9:16",
    "landscape_4_3": "4:3",
    "landscape_16_9": "16:9",
  };
  return sizeMap[size] || "1:1";
}

export async function generateImage(params: ImageGenerationParams): Promise<any> {
  try {
    console.log("🎨 Generating image with Replicate...", params.prompt);
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell" as any,
      {
        input: {
          prompt: params.prompt,
          aspect_ratio: getReplicateAspectRatio(params.image_size || "square_hd"),
          num_outputs: params.num_images || 1,
          guidance_scale: params.guidance_scale || 3.5,
          num_inference_steps: params.num_inference_steps || 4, // FLUX Schnell is optimized for 4 steps
          seed: params.seed,
          disable_safety_checker: !(params.enable_safety_checker ?? true),
        },
      }
    );

    // Transform Replicate response to match our expected format
    const images = Array.isArray(output) ? output : [output];
    const result = {
      images: images.map((url: string, index: number) => ({
        url: url,
        width: 1024,
        height: 1024,
        content_type: "image/jpeg",
        file_name: `generated-image-${index}.jpg`,
      })),
      prompt: params.prompt,
      seed: params.seed || Math.floor(Math.random() * 1000000),
      timings: { inference: 0 },
      has_nsfw_concepts: [false],
    };

    console.log("✅ Image generated successfully!", result);
    return result;
  } catch (error) {
    console.error("❌ Error generating image:", error);
    throw error;
  }
}

export async function generateVideo(params: VideoGenerationParams): Promise<any> {
  try {
    console.log("🎬 Generating video with Replicate...", params.prompt);
    
    let output;
    
    if (params.image_url) {
      // Image-to-video using Stable Video Diffusion
      output = await replicate.run(
        "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4918c6ac10a58e9a4493dc92ec1b6e250e9e5f" as any,
        {
          input: {
            cond_aug: 0.02,
            decoding_t: 7,
            input_image: params.image_url,
            video_length: "14_frames_with_svd",
            sizing_strategy: "maintain_aspect_ratio",
            motion_bucket_id: 127,
            fps: 6,
          },
        }
      );
    } else {
      // Text-to-video using Zeroscope
      output = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351" as any,
        {
          input: {
            prompt: params.prompt,
            width: 1024,
            height: 576,
            num_frames: 24,
            num_inference_steps: params.num_inference_steps || 50,
            guidance_scale: params.guidance_scale || 17.5,
            model: "xl",
            fps: params.fps || 8,
          },
        }
      );
    }

    // Transform Replicate response to match our expected format
    const result = {
      video: {
        url: output,
        width: 1024,
        height: 576,
        duration: 3,
        fps: params.fps || 8,
      },
      prompt: params.prompt,
      seed: params.seed || Math.floor(Math.random() * 1000000),
    };

    console.log("✅ Video generated successfully!", result);
    return result;
  } catch (error) {
    console.error("❌ Error generating video:", error);
    throw error;
  }
}

export async function upscaleImage(imageUrl: string): Promise<any> {
  try {
    console.log("🔍 Upscaling image with Replicate...", imageUrl);
    
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b" as any,
      {
        input: {
          image: imageUrl,
          scale: 4,
        },
      }
    );

    const result = {
      image: {
        url: output,
        width: 4096,
        height: 4096,
        content_type: "image/jpeg",
        file_name: "upscaled-image.jpg",
      },
    };

    console.log("✅ Image upscaled successfully!", result);
    return result;
  } catch (error) {
    console.error("❌ Error upscaling image:", error);
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
    { value: 3, label: "3 seconds (24 frames)" },
    { value: 5, label: "5 seconds (40 frames)" },
  ];
} 