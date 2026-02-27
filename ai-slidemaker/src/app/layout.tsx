import type { Metadata } from "next";
import "./globals.css";
import "../styles/engine.css";

export const metadata: Metadata = {
  title: "Lovable Slides — Interactive Presentations",
  description: "AI-powered presentations that go beyond static slides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light overflow-hidden">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-orange-100 selection:text-orange-600">
        <main className="flex-1 flex flex-col overflow-hidden h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

