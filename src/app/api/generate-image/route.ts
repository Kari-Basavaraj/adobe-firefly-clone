import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt,
      num_images = 1,
      seed
    } = body;

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token not found. Please set REPLICATE_API_TOKEN in your environment variables." },
        { status: 500 }
      );
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("🎨 Generating image with SDXL:", prompt);

    // Create input object for SDXL
    const input: Record<string, unknown> = {
      prompt: prompt,
      num_outputs: Math.min(Math.max(num_images, 1), 4),
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      ...(seed && { seed: seed })
    };

    // Create prediction using the predictions API for better URL handling
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
      input: input,
    });

    console.log("🔍 Replicate prediction created:", prediction.id);

    // Wait for the prediction to complete
    let result = prediction;
    while (result.status === "starting" || result.status === "processing") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "failed") {
      console.error("❌ Replicate prediction failed:", result.error);
      return NextResponse.json(
        { error: `Image generation failed: ${result.error}` },
        { status: 500 }
      );
    }

    if (result.status === "succeeded" && result.output) {
      const images = Array.isArray(result.output) ? result.output : [result.output];
      console.log("🔍 Replicate response received, processing URLs...");
      
      const processedImages = images.map((url: string) => ({
        url: url,
        alt: prompt
      }));

      console.log("✅ Image generated successfully with", processedImages.length, "image(s)");
      
      return NextResponse.json({
        images: processedImages,
        metadata: {
          model: "SDXL",
          prompt: prompt,
          provider: "replicate"
        }
      });
    }

    return NextResponse.json(
      { error: "Unexpected result status" },
      { status: 500 }
    );

  } catch (error: unknown) {
    console.error("❌ Error generating image:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { error: `Failed to generate image: ${errorMessage}` },
      { status: 500 }
    );
  }
} 