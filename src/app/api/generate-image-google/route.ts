import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt,
      image_size = "square_hd",
      num_images = 1,
      guidance_scale = 7.5,
      num_inference_steps = 25,
      enable_safety_checker = true,
      seed
    } = body;

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google AI API key not found. Please set GOOGLE_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("🎨 Generating image with Google Imagen:", prompt);

    // Convert image_size to aspect ratio for Google Imagen
    const aspectRatioMap: Record<string, string> = {
      "square_hd": "1:1",
      "portrait_4_3": "3:4", 
      "portrait_16_9": "9:16",
      "landscape_4_3": "4:3",
      "landscape_16_9": "16:9"
    };

    const aspectRatio = aspectRatioMap[image_size] || "1:1";

    // Prepare the request payload for Google Imagen API
    const payload = {
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: Math.min(Math.max(num_images, 1), 4), // Google Imagen supports 1-4 images
        aspectRatio: aspectRatio,
        // Add seed if provided (only when safety is disabled)
        ...(seed && !enable_safety_checker && { seed: seed })
      }
    };

    // Call Google Imagen API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict",
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GOOGLE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Google Imagen API error:", response.status, errorData);
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid Google API key. Please check your GOOGLE_API_KEY environment variable." },
          { status: 401 }
        );
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: "Access denied. Make sure your Google API key has access to Imagen API and you're on a paid plan." },
          { status: 403 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `Google Imagen API error: ${response.status}. ${errorData}` },
          { status: response.status }
        );
      }
    }

    const result = await response.json();
    console.log("🔍 Google Imagen response received");

    // Process the response from Google Imagen
    if (!result.predictions || !Array.isArray(result.predictions)) {
      throw new Error("Invalid response format from Google Imagen API");
    }

    const processedImages = result.predictions.map((prediction: any, index: number) => {
      if (!prediction.bytesBase64Encoded) {
        throw new Error(`No image data found in prediction ${index}`);
      }

      // Convert base64 to data URL for consistency with other providers
      const mimeType = prediction.mimeType || 'image/png';
      const imageUrl = `data:${mimeType};base64,${prediction.bytesBase64Encoded}`;

      return {
        url: imageUrl,
        width: aspectRatio === "1:1" ? 1024 : (aspectRatio.includes("16:9") ? (aspectRatio === "16:9" ? 1408 : 768) : 1024),
        height: aspectRatio === "1:1" ? 1024 : (aspectRatio.includes("16:9") ? (aspectRatio === "16:9" ? 768 : 1408) : 1024),
        content_type: mimeType,
        file_name: `generated-image-google-${index}.png`,
      };
    });

    const finalResult = {
      images: processedImages,
      prompt: prompt,
      seed: seed || Math.floor(Math.random() * 1000000),
      timings: { inference: 0 },
      has_nsfw_concepts: [false], // Google handles safety automatically
    };

    console.log("✅ Image generated successfully with Google Imagen");
    return NextResponse.json(finalResult);

  } catch (error) {
    console.error("❌ Error generating image with Google Imagen:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate image with Google Imagen",
        details: "Server-side generation error"
      },
      { status: 500 }
    );
  }
} 