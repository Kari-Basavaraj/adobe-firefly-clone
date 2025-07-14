# Firefly AI - Text to Image & Video Generation

A modern, Adobe Firefly-inspired web application for generating images and videos from text descriptions using AI. Built with Next.js 15, TypeScript, Tailwind CSS, and fal.ai API.

## Features

🎨 **Text-to-Image Generation** - Create stunning images from text descriptions
🎬 **Text-to-Video Generation** - Generate dynamic videos from text prompts
🖼️ **Image-to-Video** - Animate your existing images
⚙️ **Advanced Settings** - Fine-tune generation parameters
🌙 **Dark/Light Theme** - Modern UI with theme switching
📱 **Responsive Design** - Works on desktop, tablet, and mobile
⚡ **Real-time Generation** - Fast AI-powered content creation
💾 **Download & Share** - Easy download and sharing capabilities

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **AI API**: fal.ai (Flux, Stable Video, ESRGAN)
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Replicate API token (get one at [replicate.com](https://replicate.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd text-image-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Replicate API Configuration
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required: Your Replicate API token
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### Getting a Replicate API Token

1. Visit [replicate.com](https://replicate.com)
2. Sign up or log in to your account
3. Go to your account settings
4. Find the API tokens section
5. Create a new API token
6. Copy the token and add it to your `.env.local` file

## Usage

### Text to Image Generation

1. Select the "Text to Image" tab
2. Enter a detailed description of the image you want to generate
3. Optionally adjust settings like:
   - Image size and aspect ratio
   - Number of images to generate
   - Guidance scale (how closely to follow the prompt)
   - Inference steps (quality vs speed)
4. Click "Generate" and wait for your images

### Text to Video Generation

1. Select the "Text to Video" tab
2. Optionally upload a source image to animate
3. Enter a description of the video you want to create
4. Adjust settings like:
   - Video length (frames)
   - Frames per second
   - Guidance scale
   - Inference steps
5. Click "Generate Video" and wait for processing

### Tips for Better Results

- **Be specific**: Detailed prompts yield better results
- **Use descriptive language**: Include style, mood, lighting, etc.
- **Experiment with settings**: Different parameters can dramatically change outputs
- **Try different aspect ratios**: Choose the right format for your use case

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main page with tab navigation
├── components/            # React components
│   ├── Header.tsx         # Navigation header with theme toggle
│   ├── ImageGenerator.tsx # Image generation interface
│   └── VideoGenerator.tsx # Video generation interface
├── lib/                   # Utility functions
│   ├── fal.ts            # fal.ai API integration
│   └── utils.ts          # Helper functions
└── hooks/                 # Custom React hooks (for future use)
```

## API Integration

The app uses the fal.ai API for AI generation:

- **Image Generation**: `fal-ai/flux/dev` model
- **Video Generation**: `fal-ai/stable-video` model
- **Image Upscaling**: `fal-ai/esrgan` model

## Customization

### Themes

The app supports both dark and light themes. You can customize colors in:
- `tailwind.config.ts` - Tailwind color palette
- `src/app/globals.css` - CSS custom properties

### Models

To use different AI models, update the model IDs in `src/lib/fal.ts`:

```typescript
// Change these model IDs to use different models
const result = await fal.subscribe("fal-ai/flux/dev", { ... });
const result = await fal.subscribe("fal-ai/stable-video", { ... });
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [fal.ai documentation](https://fal.ai/docs)
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Open an issue in this repository

## Acknowledgments

- [fal.ai](https://fal.ai) for the AI generation API
- [Adobe Firefly](https://firefly.adobe.com) for design inspiration
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://framer.com/motion) for smooth animations

---

**Happy Creating!** 🎨✨
