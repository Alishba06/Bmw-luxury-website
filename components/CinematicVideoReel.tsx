"use client";

import React, { useState, useRef } from "react";
import { soundEngine } from "./SoundEngine";
import { Volume2, VolumeX, Sparkles, Film, Maximize2 } from "lucide-react";

interface MotionPanel {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  src: string;
  themeColor: string;
  borderColor: string;
  glowColor: string;
}

export const CinematicVideoReel: React.FC = () => {
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const panels: MotionPanel[] = [
    {
      id: "panel-1",
      number: "01",
      title: "M Track Dynamics",
      subtitle: "Nürburgring High-Speed Apex",
      tag: "TRACK ATTACK",
      src: "/videos/BMW_video_1.mp4",
      themeColor: "text-cyan-400",
      borderColor: "border-cyan-400",
      glowColor: "shadow-[0_0_35px_rgba(0,240,255,0.4)]",
    },
    {
      id: "panel-2",
      number: "02",
      title: "Kinetic Aerodynamics",
      subtitle: "Wind-Tunnel Fluid Dynamics",
      tag: "AERO STREAMLINES",
      src: "/videos/BMW_video_2.mp4",
      themeColor: "text-blue-400",
      borderColor: "border-blue-400",
      glowColor: "shadow-[0_0_35px_rgba(59,130,246,0.4)]",
    },
    {
      id: "panel-3",
      number: "03",
      title: "Autonomous Cruise",
      subtitle: "Neural L4 Cyber-City Night",
      tag: "NIGHT HIGHWAY",
      src: "/videos/BMW_vidoe_3.mp4",
      themeColor: "text-purple-400",
      borderColor: "border-purple-400",
      glowColor: "shadow-[0_0_35px_rgba(168,85,247,0.4)]",
    },
    {
      id: "panel-4",
      number: "04",
      title: "Pure eDrive Launch",
      subtitle: "Instant 1,150 lb-ft Torque",
      tag: "LAUNCH CONTROL",
      src: "/videos/BMW_video_4.mp4",
      themeColor: "text-amber-400",
      borderColor: "border-amber-400",
      glowColor: "shadow-[0_0_35px_rgba(245,158,11,0.4)]",
    },
  ];

  const handlePanelHover = (index: number) => {
    if (activePanelIndex !== index) {
      soundEngine.playChime(600 + index * 40);
      setActivePanelIndex(index);
    }
  };

  const toggleSound = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentVideo = videoRefs.current[index];
    if (!currentVideo) return;

    if (unmutedIndex === index) {
      // Mute it
      currentVideo.muted = true;
      setUnmutedIndex(null);
      soundEngine.playChime(420);
    } else {
      // Mute all others first
      videoRefs.current.forEach((v, i) => {
        if (v) v.muted = true;
      });
      // Unmute this one
      currentVideo.muted = false;
      setUnmutedIndex(index);
      soundEngine.playChime(850);
    }
  };

  return (
    <section 
      id="cinematic-reel" 
      className="relative w-full py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-brand-black via-[#030612] to-brand-black overflow-hidden border-t border-slate-800/80"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>M DYNAMICS MOTION ARCHIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white mb-3">
            POWER IN <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">MOTION</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Experience the unfiltered fury, aerodynamic fluidity, and instant electric torque captured in crystal-clear cinematic motion.
          </p>
        </div>

        {/* 4-COLUMN INTERACTIVE LUXURY MOTION ACCORDION */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 h-auto lg:h-[620px] w-full rounded-3xl p-2.5 bg-black/60 border border-white/10 shadow-[0_25px_100px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
          {panels.map((panel, idx) => {
            const isActive = activePanelIndex === idx;
            const isUnmuted = unmutedIndex === idx;

            return (
              <div
                key={panel.id}
                onMouseEnter={() => handlePanelHover(idx)}
                onClick={() => handlePanelHover(idx)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "lg:flex-[2.8] border-2 " + panel.borderColor + " " + panel.glowColor
                    : "lg:flex-1 border border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                } h-[380px] sm:h-[450px] lg:h-full group`}
              >
                {/* 100% Native Crystal-Clear Video (Zero stretch, crisp native portrait aspect ratio) */}
                <video
                  ref={(el) => { videoRefs.current[idx] = el; }}
                  src={panel.src}
                  autoPlay
                  loop
                  muted={!isUnmuted}
                  playsInline
                  className="w-full h-full object-cover object-center scale-[1.01] group-hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Subtle Cinematic Bottom Vignette for readable luxury labels */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                {/* Top Badge: Number & Category Tag */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white font-bold">
                    {panel.number}
                  </span>

                  <span className={`px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border text-[9px] font-mono tracking-widest uppercase transition-opacity ${
                    isActive ? "opacity-100 " + panel.themeColor + " border-current" : "opacity-0"
                  }`}>
                    {panel.tag}
                  </span>
                </div>

                {/* Bottom Overlay Label & Audio Button */}
                <div className="absolute bottom-4 inset-x-4 z-20 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className={`font-display font-black tracking-tight uppercase truncate transition-all ${
                      isActive ? "text-base sm:text-xl text-white" : "text-xs sm:text-sm text-slate-300"
                    }`}>
                      {panel.title}
                    </h3>
                    <p className={`text-[11px] font-mono truncate transition-opacity ${
                      isActive ? "text-slate-300 opacity-100" : "opacity-0 h-0"
                    }`}>
                      {panel.subtitle}
                    </p>
                  </div>

                  {/* Audio Toggle Button (Shows on Active Panel) */}
                  {isActive && (
                    <button
                      onClick={(e) => toggleSound(idx, e)}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/20 hover:border-cyan-400 text-white flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
                      title={isUnmuted ? "Mute Sound" : "Listen to Engine Sound"}
                    >
                      {isUnmuted ? (
                        <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>

                {/* Active Indicator Bar on Top */}
                {isActive && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                )}

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
