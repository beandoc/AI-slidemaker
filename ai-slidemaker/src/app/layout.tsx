import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased bg-canvas text-slate-900 min-h-screen flex flex-col font-sans selection:bg-orange-100 selection:text-orange-600">
        <header className="border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 h-16">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <span className="font-display font-bold text-slate-900">Lovable <span className="text-orange-500">slides</span></span>
          </div>

          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <button className="hover:text-slate-900 transition-colors">Solutions</button>
              <button className="hover:text-slate-900 transition-colors">Resources</button>
              <button className="hover:text-slate-900 transition-colors">Enterprise</button>
              <button className="hover:text-slate-900 transition-colors">Pricing</button>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button className="text-sm font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">Log in</button>
            <button className="text-sm font-bold text-white bg-slate-900 px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors">Get started</button>
          </nav>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}

