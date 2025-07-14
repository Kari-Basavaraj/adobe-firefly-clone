import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt,
      image_url,
      video_length = 14,
      fps = 6,
      guidance_scale = 7.5,
      num_inference_steps = 25,
      seed
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("🎬 Generating video with Replicate:", prompt);

    let output;
    
    if (image_url) {
      // Image-to-video using Stable Video Diffusion
      output = await replicate.run(
        "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4f3482439eb5d8dceb3a764f527a8f7c8b5b3a",
        {
          input: {
            input_image: image_url,
            video_length: "14_frames_with_svd", // Fixed for SVD
            sizing_strategy: "maintain_aspect_ratio",
            frames_per_second: fps,
            motion_bucket_id: 127,
            cond_aug: 0.02,
            seed: seed,
          },
        }
      );
    } else {
      // Text-to-video using Zeroscope
      output = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
        {
          input: {
            prompt: prompt,
            width: 1024,
            height: 576,
            batch_size: 1,
            num_frames: Math.min(video_length, 24), // Zeroscope max
            num_inference_steps: num_inference_steps,
            guidance_scale: guidance_scale,
            seed: seed,
          },
        }
      );
    }

    // Transform response to match our expected format
    const videoUrl = Array.isArray(output) ? output[0] : output;
    const result = {
      url: videoUrl,
      width: 1024,
      height: 576,
      duration: video_length,
      fps: fps,
      prompt: prompt,
      seed: seed || Math.floor(Math.random() * 1000000),
    };

    console.log("✅ Video generated successfully");
    return NextResponse.json(result);

  } catch (error) {
    console.error("❌ Error generating video:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate video",
        details: "Server-side generation error"
      },
      { status: 500 }
    );
  }
} 