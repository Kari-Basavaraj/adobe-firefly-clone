import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt,
      image_size = "square_hd",
      num_images = 1,
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

    // Map our image size options to Google Imagen's aspectRatio parameter  
    const getGoogleAspectRatio = (size: string): string => {
      const aspectRatios: Record<string, string> = {
        "square_hd": "1:1",
        "portrait_4_3": "3:4", 
        "portrait_16_9": "9:16",
        "landscape_4_3": "4:3",
        "landscape_16_9": "16:9"
      };
      return aspectRatios[size] || "1:1";
    };

    const aspectRatio = getGoogleAspectRatio(image_size);

    // Google Imagen API endpoint
    const apiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/imagen-4.0-generate-preview-06-06:predict`;

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
        ...(seed && { seed: seed })
      }
    };

    console.log("🔍 Sending request to Google Imagen API...");

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("❌ Google Imagen API error:", response.status, responseText);
      
      let errorData: Record<string, unknown>;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      return NextResponse.json(
        { error: `Google Imagen API error: ${response.status} ${JSON.stringify(errorData)}` },
        { status: response.status }
      );
    }

    const result = JSON.parse(responseText);
    
    console.log("🔍 Google Imagen response received, processing...");

    // Process the response to extract image URLs
    const predictions = result.predictions || [];
    const images = predictions.flatMap((prediction: Record<string, unknown>) => {
      const bytesBase64Encoded = prediction.bytesBase64Encoded as string;
      const mimeType = prediction.mimeType as string || 'image/jpeg';
      
      if (bytesBase64Encoded) {
        return [{
          url: `data:${mimeType};base64,${bytesBase64Encoded}`,
          alt: prompt
        }];
      }
      return [];
    });

    if (images.length === 0) {
      throw new Error("No images found in Google Imagen response");
    }

    console.log("✅ Image generated successfully with", images.length, "image(s)");
    
    return NextResponse.json({
      images: images,
      metadata: {
        model: "Imagen 4.0",
        prompt: prompt,
        provider: "google"
      }
    });

  } catch (error: unknown) {
    console.error("❌ Error generating image with Google Imagen:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { error: `Failed to generate image: ${errorMessage}` },
      { status: 500 }
    );
  }
} 