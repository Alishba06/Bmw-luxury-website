"use client";

import React, { useState } from "react";
import { soundEngine } from "./SoundEngine";
import {
  Zap,
  Cpu,
  BatteryCharging,
  Sparkles,
  Eye,
  X,
  ChevronRight,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface FloatingHudPanelsProps {
  onOpenFeatureModal: (featureKey: string) => void;
  onOpenLaunchControl?: () => void;
}

export const FloatingHudPanels: React.FC<FloatingHudPanelsProps> = ({
  onOpenFeatureModal,
  onOpenLaunchControl,
}) => {
  // Active panel key: 'design' | 'performance' | 'tech' | 'battery' | 'interior' | null
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const panels = [
    {
      id: "design",
      modalKey: "iconic-design",
      number: "01",
      badge: "EXTERIOR FORM",
      title: "Iconic Design",
      shortSubtitle: "Kinetic Kidney Grille",
      icon: Eye,
      colorClass: "text-cyan-400",
      borderClass: "border-cyan-400/40",
      glowClass: "shadow-glow-cyan",
      bgBadge: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
      description:
        "Active crystalline twin kidney grille with integrated biometric air channels and razor-thin laser headlights.",
      specs: [
        { label: "Aero Drag", val: "0.198 Cd" },
        { label: "Laser Beam", val: "600 Meters" },
        { label: "Front Shutter", val: "Active Adaptive" },
      ],
    },
    {
      id: "performance",
      modalKey: "power-performance",
      number: "02",
      badge: "M POWERTRAIN",
      title: "Power & Performance",
      shortSubtitle: "1,020 HP • 2.1s",
      icon: Zap,
      colorClass: "text-purple-400",
      borderClass: "border-purple-400/40",
      glowClass: "shadow-glow-purple",
      bgBadge: "bg-purple-500/15 text-purple-300 border-purple-400/30",
      description:
        "Dual high-flux M permanent-magnet motors delivering instantaneous 1,150 lb-ft of four-wheel torque vectoring.",
      specs: [
        { label: "Horsepower", val: "1,020 HP" },
        { label: "0-60 MPH", val: "2.1 Seconds" },
        { label: "Top Track Speed", val: "210 MPH" },
      ],
    },
    {
      id: "tech",
      modalKey: "smart-technology",
      number: "03",
      badge: "INTELLIGENCE",
      title: "Smart Technology",
      shortSubtitle: "Neural iDrive 9 • L4",
      icon: Cpu,
      colorClass: "text-cyan-400",
      borderClass: "border-cyan-400/40",
      glowClass: "shadow-glow-cyan",
      bgBadge: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
      description:
        "Multimodal AI co-pilot with full-windshield holographic AR HUD and solid-state LiDAR perception.",
      specs: [
        { label: "Autonomous", val: "Level 4 Autopilot" },
        { label: "AR HUD", val: "Quantum Display" },
        { label: "AI Core", val: "BMW Nexus Neural" },
      ],
    },
    {
      id: "battery",
      modalKey: "battery-range",
      number: "04",
      badge: "ULTRA-DENSE ENERGY",
      title: "Advanced Battery",
      shortSubtitle: "620 Mi • 135 kWh",
      icon: BatteryCharging,
      colorClass: "text-emerald-400",
      borderClass: "border-emerald-400/40",
      glowClass: "shadow-glow-cyan",
      bgBadge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
      description:
        "135 kWh solid-state electrolyte pack with native 800V architecture enabling ultra-fast 350 kW charging.",
      specs: [
        { label: "Driving Range", val: "620 Miles EPA" },
        { label: "Capacity", val: "135 kWh Pack" },
        { label: "Fast Charge", val: "10-80% in 12m" },
      ],
    },
    {
      id: "interior",
      modalKey: "luxury-interior",
      number: "05",
      badge: "BESPOKE LUXURY",
      title: "Luxury Interior",
      shortSubtitle: "Sky Lounge & Merino",
      icon: Sparkles,
      colorClass: "text-purple-400",
      borderClass: "border-purple-400/40",
      glowClass: "shadow-glow-purple",
      bgBadge: "bg-purple-500/15 text-purple-300 border-purple-400/30",
      description:
        "Zero-gravity executive seats with kinetic massage and electrochromic starry Sky Lounge canopy.",
      specs: [
        { label: "Upholstery", val: "Silverstone Merino" },
        { label: "Glass Canopy", val: "Electrochromic" },
        { label: "Audio", val: "Bowers & Wilkins 4D" },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    soundEngine.playChime(640);
    if (activePanel === id) {
      setActivePanel(null); // toggle close
    } else {
      setActivePanel(id);
    }
  };

  const activeData = panels.find((p) => p.id === activePanel);

  return (
    <div className="z-30 pointer-events-auto">

      {/* 1. HORIZONTAL HUD SELECTOR STRIP (Clean, perfectly organized in one row) */}
      <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5 max-w-xl">
        {panels.map((p) => {
          const Icon = p.icon;
          const isCurrent = activePanel === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 border cursor-pointer ${isCurrent
                  ? "bg-cyan-500/25 border-cyan-400 text-white shadow-glow-cyan scale-105"
                  : "bg-black/60 hover:bg-black/80 border-white/15 text-slate-300 hover:border-cyan-400/40 hover:text-white"
                }`}
            >
              <Icon className={`w-3.5 h-3.5 ${p.colorClass}`} />
              <span className="font-semibold">{p.number} {p.title.split(" ")[0]}</span>
              <span className="text-[10px] text-cyan-400 opacity-80">
                {isCurrent ? "▲" : "▼"}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. EXPANDED HUD INFORMATION CARD (Clean, High Contrast, Guaranteed Zero Text Overflow) */}
      {activeData && (
        <div className="mt-3.5 w-full max-w-md bg-[#020512]/95 backdrop-blur-2xl border-2 border-cyan-400/50 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

          {/* Subtle Top Glowing Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              soundEngine.playChime(420);
              setActivePanel(null);
            }}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Close Card"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Card Header */}
          <div className="flex items-center gap-2.5 mb-2 pr-8">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono tracking-widest uppercase border ${activeData.bgBadge}`}
            >
              {activeData.badge}
            </span>
            <span className="text-xs font-mono text-slate-400">
              FEATURE {activeData.number}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-wide">
            {activeData.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-normal">
            {activeData.description}
          </p>

          {/* Spec Grid (Clean 3-column layout) */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-500/20">
            {activeData.specs.map((spec, i) => (
              <div
                key={i}
                className="bg-black/60 rounded-xl p-2 border border-white/10 text-center"
              >
                <div className="text-[9px] text-slate-400 uppercase font-mono truncate">
                  {spec.label}
                </div>
                <div className="text-xs sm:text-sm font-bold text-cyan-300 font-display mt-0.5 truncate">
                  {spec.val}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playChime(700);
                  onOpenFeatureModal(activeData.modalKey);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider shadow-glow-cyan flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Explore Full Specs</span>
                <ChevronRight className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => setActivePanel(null)}
                className="px-3 py-2 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
              >
                Hide
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
