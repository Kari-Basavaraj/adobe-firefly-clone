import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

function getReplicateAspectRatio(size: string): string {
  const aspectRatios: Record<string, string> = {
    "square_hd": "1:1",
    "portrait_4_3": "3:4", 
    "portrait_16_9": "9:16",
    "landscape_4_3": "4:3",
    "landscape_16_9": "16:9"
  };
  return aspectRatios[size] || "1:1";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      image_size = "square_hd",
      num_images = 1,
      guidance_scale = 3.5,
      num_inference_steps = 4,
      enable_safety_checker = true,
      seed
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Validate parameters for SDXL
    const validatedSteps = Math.min(Math.max(num_inference_steps, 1), 50);
    const validatedGuidance = Math.min(Math.max(guidance_scale, 1), 20);
    const validatedNumImages = Math.min(Math.max(num_images, 1), 4);

    console.log("🎨 Generating image with SDXL:", prompt);

    // Create prediction using the predictions API for better URL handling
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: validatedNumImages,
        guidance_scale: validatedGuidance,
        num_inference_steps: validatedSteps,
        seed: seed,
        apply_watermark: false,
      },
    });

    // Wait for the prediction to complete
    const output = await replicate.wait(prediction);

    // Debug: Log successful generation
    console.log("🔍 Replicate response received, processing URLs...");

    // Handle different possible response formats from Replicate
    let imageUrls: any[] = [];
    
    if (Array.isArray(output)) {
      // For predictions API, output is usually an array of URLs
      imageUrls = output.filter(item => 
        (typeof item === 'string' && item.length > 0) ||
        (Array.isArray(item) && item.length > 0)
      );
    } else if (typeof output === 'string') {
      imageUrls = [output];
    } else if (output && typeof output === 'object') {
      // Handle object response (from prediction.output)
      const outputObj = output as any;
      if (outputObj.output && Array.isArray(outputObj.output)) {
        imageUrls = outputObj.output;
      } else {
        const url = outputObj.url || outputObj.image || outputObj.output || outputObj.path || '';
        if (url) imageUrls = [url];
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("No image URLs found in Replicate response");
    }

    const processedImages = imageUrls.map((url, index) => {
      // Handle case where URL might be in an array
      let finalUrl = url;
      if (Array.isArray(url) && url.length > 0) {
        finalUrl = url[0];
      }
      
      return {
        url: finalUrl,
        width: 1024,
        height: 1024,
        content_type: "image/jpeg",
        file_name: `generated-image-${index}.jpg`,
      };
    });

    const result = {
      images: processedImages,
      prompt: prompt,
      seed: seed || Math.floor(Math.random() * 1000000),
      timings: { inference: 0 },
      has_nsfw_concepts: [false],
    };

    console.log("✅ Image generated successfully with", processedImages.length, "image(s)");
    return NextResponse.json(result);

  } catch (error) {
    console.error("❌ Error generating image:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate image",
        details: "Server-side generation error"
      },
      { status: 500 }
    );
  }
} 