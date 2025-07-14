import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firefly AI - Text to Image & Video Generation",
  description: "Create stunning images and videos from text using advanced AI. Transform your ideas into visual masterpieces with our cutting-edge text-to-image and video generation platform.",
  keywords: ["AI", "text to image", "video generation", "artificial intelligence", "creative tools"],
  authors: [{ name: "Firefly AI" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
  },
  openGraph: {
    title: "Firefly AI - Text to Image & Video Generation",
    description: "Create stunning images and videos from text using advanced AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Firefly AI - Text to Image & Video Generation",
    description: "Create stunning images and videos from text using advanced AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
