'use client';

import { useEditorStore } from '@/store/editor';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Paintbrush, MonitorPlay, ImagePlus, Sparkles, Shapes, Upload, Trash2 } from 'lucide-react';
import { getIconForText, getLucideIcon } from '@/lib/icons';
import Image from 'next/image';

export default function AppHome() {
  const { presentation, setPresentation, activeSlideId, setActiveSlide, updateSlideContent, addAsset } = useEditorStore();
  const [mounted, setMounted] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load mock AST to initialize editor immediately for visualization
    if (!presentation) {
      setPresentation({
        title: "Future of AI Interfaces",
        theme: "neon-cyber",
        slides: [
          {
            id: "slide_1",
            type: "title",
            content: {
              heading: "The Gemini AI Era",
              subtitle: "Architecting generative applications natively.",
              icon: "Cpu"
            }
          },
          {
            id: "slide_2",
            type: "content",
            content: {
              heading: "Parametric Control",
              bullets: [
                "Data-driven AST engines replacing explicit HTML markup.",
                "Integrates with vector platforms natively.",
                "Zustand managed local interactions."
              ],
              icon: "BarChart3"
            }
          },
          {
            id: "slide_3",
            type: "feature-grid",
            content: {
              heading: "Performance Velocity",
              bullets: [
                "10x Render Frame Speed",
                "0% External Dependencies",
                "Hardware Accelerated",
                "Real-time JSON Sync"
              ],
              icon: "Zap"
            }
          }
        ],
        assets: []
      });
    }
  }, [presentation, setPresentation]);

  if (!mounted || !presentation) return <div className="p-8 text-center text-gray-500 animate-pulse">Initializing Data Engine...</div>;

  const activeSlide = presentation.slides.find(s => s.id === activeSlideId);

  const handleGenerateImage = async (slideId: string, prompt: string) => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        updateSlideContent(slideId, { imagePath: data.imageUrl });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleHeadingChange = (slideId: string, val: string) => {
    const suggestedIcon = getIconForText(val);
    updateSlideContent(slideId, {
      heading: val,
      ...(suggestedIcon ? { icon: suggestedIcon } : {})
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      addAsset({
        id: `asset_${Date.now()}`,
        name: file.name,
        type: file.type.includes('svg') ? 'icon' : 'logo',
        url: url
      });
    };
    reader.readAsDataURL(file);
  };

  const handleArchitect = async () => {
    if (!aiInstruction) return;
    setIsArchitecting(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiInstruction })
      });

      const result = await res.json();

      if (result.data) {
        // Intelligent Merge: Append new slides to current deck
        const newSlides = result.data.slides.map((s: any) => ({
          ...s,
          id: s.id || `gen_${Date.now()}_${Math.random()}`
        }));

        setPresentation({
          ...presentation,
          title: result.data.title || presentation.title,
          slides: [...presentation.slides, ...newSlides]
        });

        // Switch to the first newly generated slide
        if (newSlides.length > 0) {
          setActiveSlide(newSlides[0].id);
        }
      } else {
        console.error("AI Error:", result.error);
        alert(result.error || "Failed to generate content");
      }
      setAiInstruction('');
    } catch (e) {
      console.error(e);
      alert("System Exception: Ensure your Gemini API Key is configured.");
    } finally {
      setIsArchitecting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0c10] relative text-slate-200">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* LEFT: SLIDE NAVIGATOR */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#0d0f14]/50 backdrop-blur-xl">
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <h2 className="text-sm font-bold tracking-tight text-white/90">Your Presentation</h2>
          <button
            onClick={() => setPresentation({
              ...presentation,
              slides: [...presentation.slides, { id: `s_${Date.now()}`, type: 'content', content: { heading: 'New Slide' } }]
            })}
            className="p-2 hover:bg-white/5 rounded-full text-sky-400 transition-all active:scale-90"
            title="Add Slide"
          >
            <LayoutDashboard size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
          {presentation.slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(slide.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group ${activeSlideId === slide.id
                ? 'bg-sky-500/10 border-sky-500/30'
                : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/20">{i + 1}</span>
                <span className={`text-xs font-medium truncate ${activeSlideId === slide.id ? 'text-sky-400' : 'text-slate-400'}`}>
                  {slide.content.heading || "Untitled"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-[#0d0f14]">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Styles</div>
          <div className="flex gap-2">
            {['neon-cyber', 'corporate-sharp', 'bold-signal'].map(t => (
              <button
                key={t}
                onClick={() => setPresentation({ ...presentation, theme: t })}
                className={`w-4 h-4 rounded-full transition-all ${presentation.theme === t ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0d0f14] bg-sky-400' : 'bg-slate-700 hover:bg-slate-600'}`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* CENTER: CANVAS AREA */}
      <section className="flex-1 relative flex flex-col">
        {/* TOP MINI-TOOLBAR */}
        <div className="h-16 flex items-center justify-center border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md z-40">
          <div className="flex gap-8 items-center">
            <button className="flex items-center gap-2 text-xs font-bold text-sky-400"><MonitorPlay size={16} /> Present</button>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"><Shapes size={16} /> Edit Layout</button>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"><Paintbrush size={16} /> Customize</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center p-12 bg-[#08090d]">
          <div className="relative w-full max-w-[1000px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden border border-white/5">
            {/* SCANNER OVERLAY */}
            <AnimatePresence>
              {isArchitecting && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-sky-500/5 backdrop-blur-[1px] flex items-center justify-center"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-scan" />
                  <span className="text-sky-400 font-bold tracking-widest uppercase text-sm animate-pulse">Designing...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeSlide && (
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="w-full aspect-video bg-[#0d0f14] flex flex-col items-center justify-center p-20 relative text-center"
                >
                  {/* SLIDE CONTENT RENDERING */}
                  {(activeSlide.content.customIconUrl || activeSlide.content.icon) && (
                    <div className="mb-10 flex justify-center text-sky-400">
                      {activeSlide.content.customIconUrl ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={activeSlide.content.customIconUrl}
                            fill
                            unoptimized={activeSlide.content.customIconUrl.startsWith('data:')}
                            className="object-contain opacity-80"
                            alt="Brand"
                          />
                        </div>
                      ) : (
                        (() => {
                          const IconComp = getLucideIcon(activeSlide.content.icon || '');
                          return IconComp ? <IconComp size={64} strokeWidth={1} /> : null;
                        })()
                      )}
                    </div>
                  )}

                  <input
                    value={activeSlide.content.heading || ''}
                    onChange={(e) => handleHeadingChange(activeSlide.id, e.target.value)}
                    className="bg-transparent text-5xl md:text-7xl font-bold text-white text-center w-full focus:outline-none mb-4 tracking-tight placeholder-white/5"
                    placeholder="Heading"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  />

                  {activeSlide.type === 'title' && (
                    <input
                      value={activeSlide.content.subtitle || ''}
                      onChange={(e) => updateSlideContent(activeSlide.id, { subtitle: e.target.value })}
                      className="bg-transparent text-lg md:text-xl text-sky-400/80 text-center w-full focus:outline-none font-medium placeholder-sky-400/10"
                      placeholder="Enter subtitle..."
                    />
                  )}

                  {activeSlide.type === 'content' && activeSlide.content.bullets && (
                    <ul className="text-left max-w-2xl mx-auto space-y-4 mt-8">
                      {activeSlide.content.bullets.map((b, idx) => (
                        <li key={idx} className="flex gap-4 items-start text-xl text-slate-400 hover:text-white transition-colors">
                          <span className="text-sky-500/40 mt-1">•</span>
                          <textarea
                            value={b}
                            onChange={(e) => {
                              const newBullets = [...(activeSlide.content.bullets || [])];
                              newBullets[idx] = e.target.value;
                              updateSlideContent(activeSlide.id, { bullets: newBullets })
                            }}
                            className="bg-transparent w-full focus:outline-none resize-none overflow-hidden"
                            rows={1}
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeSlide.type === 'feature-grid' && activeSlide.content.bullets && (
                    <div className="grid grid-cols-2 gap-4 mt-12 max-w-4xl mx-auto">
                      {activeSlide.content.bullets.map((b, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300 text-lg font-medium text-center">
                          {b}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSlide.content.imagePath && (
                    <div className="mt-12 relative group max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl aspect-video">
                      <Image
                        src={activeSlide.content.imagePath}
                        alt="Slide Graphic"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => updateSlideContent(activeSlide.id, { imagePath: undefined })}
                        className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all text-white z-10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI INPUT BAR - MINIMALIST */}
        <div className="p-8 flex justify-center border-t border-white/5 bg-[#0a0c10]/50 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white/5 rounded-2xl border border-white/5 flex items-center p-2 focus-within:border-sky-500/40 transition-all shadow-xl">
            <div className="px-4 text-sky-500/40"><Sparkles size={18} /></div>
            <input
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleArchitect()}
              placeholder="Type your presentation topic or paste paragraphs here..."
              className="flex-1 bg-transparent py-4 text-sm text-slate-100 outline-none placeholder-slate-600 font-medium"
            />
            <button
              onClick={handleArchitect}
              disabled={isArchitecting}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-xs font-bold tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95"
            >
              {isArchitecting ? 'Architecting...' : 'CREATE'}
              <Sparkles size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT: PROJECT SETTINGS */}
      <aside className="w-80 border-l border-white/5 bg-[#0d0f14]/50 backdrop-blur-xl flex flex-col">
        <div className="p-8 space-y-10 flex-1 overflow-y-auto hide-scrollbar">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Export Design</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  import('@/lib/export/vanilla-html/renderer').then((mod) => {
                    if (!presentation) return;
                    const html = mod.generateProductionHTML(presentation);
                    const blob = new Blob([html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url;
                    a.download = `${presentation.title.toLowerCase().replace(/\s+/g, '-')}.html`;
                    a.click(); URL.revokeObjectURL(url);
                  });
                }}
                className="w-full text-center py-4 bg-white text-black font-bold text-xs rounded-xl hover:bg-slate-200 transition-all shadow-lg active:scale-95"
              >
                DOWNLOAD PRESENTATION
              </button>
              <button className="w-full text-center py-4 bg-white/5 border border-white/10 text-slate-300 font-bold text-xs rounded-xl hover:bg-white/10 transition-all active:scale-95">
                EXPORT TO FIGMA
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Brand Logos</h3>
              <label className="cursor-pointer text-sky-400 hover:text-sky-300 transition-colors">
                <Upload size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {presentation.assets?.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => updateSlideContent(activeSlideId!, { customIconUrl: asset.url })}
                  className="aspect-square rounded-lg bg-white/5 border border-white/5 hover:border-sky-500/40 p-2 transition-all group overflow-hidden relative"
                >
                  <Image
                    src={asset.url}
                    fill
                    unoptimized={asset.url.startsWith('data:')}
                    className="object-contain p-2"
                    alt="Brand Logo"
                  />
                </button>
              ))}
              {(!presentation.assets || presentation.assets.length === 0) && (
                <div className="col-span-4 py-6 text-[9px] text-slate-600 text-center uppercase tracking-tighter italic border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                  No logos uploaded
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Quick Actions</h3>
            {!activeSlide?.content.imagePath && (
              <button
                disabled={isGeneratingImage}
                onClick={() => handleGenerateImage(activeSlide!.id, activeSlide?.content.heading || 'Abstract technology')}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/5 text-slate-500 text-[10px] font-bold hover:border-sky-500/40 hover:text-sky-400 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ImagePlus size={14} /> ADD AI IMAGE
              </button>
            )}
          </div>
        </div>

        <div className="p-6 bg-[#0a0c10] border-t border-white/5 flex items-center gap-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Sync Active
        </div>
      </aside>
    </div>
  );
}
