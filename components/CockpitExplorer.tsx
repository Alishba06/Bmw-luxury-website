"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "./SoundEngine";
import {
  Sparkles,
  Sliders,
  X,
  Compass,
  Radio,
  Eye,
  RotateCcw,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Activity,
  Layers,
  Zap,
} from "lucide-react";

interface CockpitExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

type AmbientColor = "cyan" | "purple" | "amber" | "white" | "emerald";
type DisplayTab = "telemetry" | "navigation" | "zen";

export const CockpitExplorer: React.FC<CockpitExplorerProps> = ({
  isOpen,
  onClose,
}) => {
  // Sky Lounge Electrochromic Dimmer: 0 (clear glass) to 100 (15,000 starry night)
  const [starDimmer, setStarDimmer] = useState(85);
  const [ambientColor, setAmbientColor] = useState<AmbientColor>("cyan");
  const [displayTab, setDisplayTab] = useState<DisplayTab>("telemetry");
  const [steeringAngle, setSteeringAngle] = useState(0); // -25 to +25 degrees
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; alpha: number; speed: number }[]>([]);
  const shootingStarRef = useRef<{ x: number; y: number; length: number; speed: number; active: boolean }>({
    x: 0,
    y: 0,
    length: 0,
    speed: 0,
    active: false,
  });

  const ambientThemes: Record<
    AmbientColor,
    { name: string; hex: string; glow: string; border: string; bg: string }
  > = {
    cyan: {
      name: "Cyber Cyan",
      hex: "#00f0ff",
      glow: "rgba(0, 240, 255, 0.45)",
      border: "border-cyan-400",
      bg: "bg-cyan-500",
    },
    purple: {
      name: "Velvet Purple",
      hex: "#8b5cf6",
      glow: "rgba(139, 92, 246, 0.45)",
      border: "border-purple-400",
      bg: "bg-purple-500",
    },
    amber: {
      name: "Executive Amber",
      hex: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.45)",
      border: "border-amber-400",
      bg: "bg-amber-500",
    },
    white: {
      name: "Alpine Pure Ice",
      hex: "#f8fafc",
      glow: "rgba(255, 255, 255, 0.4)",
      border: "border-slate-200",
      bg: "bg-white",
    },
    emerald: {
      name: "M Efficiency Green",
      hex: "#10b981",
      glow: "rgba(16, 185, 129, 0.45)",
      border: "border-emerald-400",
      bg: "bg-emerald-500",
    },
  };

  // Parallax subtle camera look with mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const offsetX = ((clientX / innerWidth) - 0.5) * 16;
    const offsetY = ((clientY / innerHeight) - 0.5) * 12;
    setPanOffset({ x: offsetX, y: offsetY });
  };

  // 15,000 Fiber-Optic Stars Canvas Animation
  useEffect(() => {
    if (!isOpen) return;
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    const h = (canvas.height = canvas.parentElement?.clientHeight || 450);

    // Initialize 240 prominent nodes representing 15,000 microscopic fiber-optics
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 260 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.025 + 0.005,
      }));
    }

    const renderStars = () => {
      ctx.clearRect(0, 0, w, h);

      const dimmerFactor = starDimmer / 100; // 0 to 1

      if (dimmerFactor > 0.05) {
        // Draw constellation stars
        starsRef.current.forEach((star, idx) => {
          star.alpha += Math.sin(Date.now() * star.speed + idx) * 0.015;
          const currentAlpha = Math.max(0.1, Math.min(1, star.alpha)) * dimmerFactor;

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 245, 255, ${currentAlpha})`;
          ctx.shadowBlur = star.r > 1.2 ? 6 * dimmerFactor : 0;
          ctx.shadowColor = "rgba(0, 240, 255, 0.8)";
          ctx.fill();

          // Connect nearby stars with faint constellation threads
          if (idx % 7 === 0 && idx + 1 < starsRef.current.length) {
            const nextStar = starsRef.current[idx + 1];
            const dist = Math.hypot(star.x - nextStar.x, star.y - nextStar.y);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(nextStar.x, nextStar.y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * dimmerFactor})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });

        // Shooting Star logic
        const s = shootingStarRef.current;
        if (!s.active && Math.random() < 0.012 && dimmerFactor > 0.5) {
          s.active = true;
          s.x = Math.random() * (w * 0.7);
          s.y = Math.random() * (h * 0.4);
          s.length = 70 + Math.random() * 60;
          s.speed = 14 + Math.random() * 10;
        }

        if (s.active) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length, s.y + s.length * 0.4);
          const shootGrad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y + s.length * 0.4);
          shootGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          shootGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
          ctx.strokeStyle = shootGrad;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          s.x += s.speed;
          s.y += s.speed * 0.4;
          if (s.x > w || s.y > h) s.active = false;
        }
      }

      animId = requestAnimationFrame(renderStars);
    };

    renderStars();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, starDimmer]);

  const activeTheme = ambientThemes[ambientColor];

  if (!isOpen) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[1000] bg-[#02040b] select-none flex flex-col justify-between overflow-y-auto lg:overflow-hidden animate-in fade-in duration-500"
    >
      {/* 1. TOP SKY LOUNGE GLASS ROOF (Panoramic Canopy) */}
      <div className="relative w-full min-h-[220px] h-[40vh] sm:h-[46vh] shrink-0 overflow-hidden flex flex-col justify-between border-b border-white/10">
        
        {/* Exterior Twilight Horizon Background (Visible when glass is clear) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#061026] via-[#030919] to-[#020512] transition-opacity duration-700 pointer-events-none"
          style={{ opacity: 1 - (starDimmer / 100) * 0.85 }}
        >
          {/* Distant Cyber Skyline Lights */}
          <div className="absolute bottom-6 inset-x-0 h-16 bg-[radial-gradient(ellipse_at_bottom,rgba(0,102,255,0.2)_0,transparent_70%)]" />
        </div>

        {/* Electrochromic Obsidian Tint Layer */}
        <div
          className="absolute inset-0 bg-[#010208] transition-opacity duration-700 pointer-events-none"
          style={{ opacity: (starDimmer / 100) * 0.94 }}
        />

        {/* 15,000 Fiber-Optic Stars Canvas */}
        <canvas
          ref={starCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Crystalline Roof Arch Structural Strut (BMW Geometric Center Rib) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full pointer-events-none z-20 flex flex-col items-center">
          <div className="w-1.5 h-full bg-slate-900/80 border-x border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]" />
          <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/60 mt-16 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Top Floating Control Bar */}
        <div className="relative z-30 p-4 sm:p-6 flex items-center justify-between">
          {/* Back to Exterior Button */}
          <button
            onClick={() => {
              soundEngine.playChime(450);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-cyan-400/40 text-cyan-300 hover:text-white font-mono text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-105 active:scale-95 transition-all"
            title="Return to Exterior Car View"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>Exit Cockpit (Exterior)</span>
          </button>

          {/* Roof Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-cyan-400/30 text-[11px] font-mono text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SKY LOUNGE STAR-CANOPY</span>
            <span className="text-cyan-400 font-bold">
              {Math.round((starDimmer / 100) * 15480).toLocaleString()} STARS
            </span>
          </div>

          {/* Close X */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sky Lounge Dimmer Slider (Top-Right Floating Widget) */}
        <div className="relative z-30 self-end mr-4 sm:mr-6 mb-4 p-3.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-400/40 shadow-2xl flex flex-col gap-2 max-w-xs">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Sky Lounge Dimmer</span>
            </span>
            <span className="text-slate-400 text-[11px] font-bold">
              {starDimmer}% {starDimmer > 60 ? "Night" : "Clear"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono">Day</span>
            <input
              type="range"
              min="0"
              max="100"
              value={starDimmer}
              onChange={(e) => {
                setStarDimmer(Number(e.target.value));
                if (Math.abs(Number(e.target.value) - starDimmer) > 10) {
                  soundEngine.playChime(350 + Number(e.target.value) * 3, "sine", 0.08, 0.05);
                }
              }}
              className="w-40 sm:w-48 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
              <Moon className="w-3 h-3 text-cyan-400" />
              Stars
            </span>
          </div>
        </div>

      </div>

      {/* 2. BOTTOM COCKPIT DASHBOARD & CURVED OLED DISPLAY */}
      <div
        className="relative w-full min-h-[340px] h-auto lg:h-[54vh] flex flex-col justify-between p-3 sm:p-6 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y * 0.4}px)`,
        }}
      >
        {/* Dynamic Ambient Neon Glow Strip across entire dashboard contour */}
        <div
          className="absolute -top-1 inset-x-0 h-1.5 transition-colors duration-500 shadow-lg"
          style={{
            backgroundColor: activeTheme.hex,
            boxShadow: `0 0 25px ${activeTheme.hex}, 0 0 50px ${activeTheme.hex}`,
          }}
        />

        {/* CURVED FLOATING PANORAMIC OLED DISPLAY */}
        <div className="relative mx-auto w-full max-w-4xl bg-slate-950/95 border-2 rounded-2xl p-4 sm:p-5 shadow-[0_15px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300"
          style={{ borderColor: activeTheme.hex }}
        >
          {/* Subtle Ambient Reflected Sheen */}
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-500"
            style={{ backgroundColor: activeTheme.hex }}
          />

          {/* OLED Top Micro Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold tracking-wider">BMW iDRIVE 9 NEURAL</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[9px]">
                5G CONNECTED
              </span>
            </div>

            {/* Display Tab Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px]">
              <button
                onClick={() => {
                  soundEngine.playChime(600);
                  setDisplayTab("telemetry");
                }}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  displayTab === "telemetry"
                    ? "bg-cyan-500/30 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => {
                  soundEngine.playChime(640);
                  setDisplayTab("navigation");
                }}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  displayTab === "navigation"
                    ? "bg-cyan-500/30 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                AR Navigation
              </button>
              <button
                onClick={() => {
                  soundEngine.playChime(680);
                  setDisplayTab("zen");
                }}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  displayTab === "zen"
                    ? "bg-cyan-500/30 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Zen Lounge
              </button>
            </div>

            <div className="text-right">
              <span className="text-slate-300 font-bold">10:42 AM</span> • 72°F COMFORT
            </div>
          </div>

          {/* OLED DISPLAY CONTENT (Changes with tab) */}
          <div className="py-3">
            {displayTab === "telemetry" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                {/* Cluster Left: Speedometer & State */}
                <div className="bg-black/60 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Drive State</span>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white">0</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">MPH</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>READY • DUAL M MOTOR ACTIVE</span>
                  </div>
                </div>

                {/* Cluster Center: Torque Vectoring Radar */}
                <div className="bg-black/60 rounded-xl p-3 border border-white/10 flex flex-col items-center justify-between text-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">All-Wheel Torque Distribution</span>
                  <div className="relative w-20 h-16 my-1 flex items-center justify-center">
                    <div className="w-12 h-14 rounded-lg border border-cyan-400/40 relative flex items-center justify-center">
                      <span className="text-[9px] font-mono text-cyan-300 font-bold">50 / 50</span>
                    </div>
                    <span className="absolute top-0 left-0 text-[8px] font-mono text-emerald-400 font-bold">FL 25%</span>
                    <span className="absolute top-0 right-0 text-[8px] font-mono text-emerald-400 font-bold">FR 25%</span>
                    <span className="absolute bottom-0 left-0 text-[8px] font-mono text-cyan-400 font-bold">RL 25%</span>
                    <span className="absolute bottom-0 right-0 text-[8px] font-mono text-cyan-400 font-bold">RR 25%</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Torque Vectoring: 1,400 Nm</span>
                </div>

                {/* Cluster Right: Battery Energy */}
                <div className="bg-black/60 rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Solid-State Battery</span>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl sm:text-3xl font-display font-black text-cyan-300">98%</span>
                    <span className="text-xs font-mono text-slate-400">/ 608 MILES</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="w-[98%] h-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                  </div>
                </div>
              </div>
            )}

            {displayTab === "navigation" && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Holographic HUD Navigation</h4>
                    <p className="text-[11px] font-mono text-slate-400">Destination: Munich BMW M Innovation Hub (42.8 Miles)</p>
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-cyan-300">
                  <div className="font-bold">Next Exit: 2.4 Mi</div>
                  <div className="text-slate-400">Autobahn A9 North</div>
                </div>
              </div>
            )}

            {displayTab === "zen" && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Zen Lounge Atmosphere</h4>
                    <p className="text-[11px] font-mono text-slate-400">Ionized Himalayan Forest Air Freshener • Active Noise Cancelling</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  Relaxation Mode Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. SCULPTED YOKE STEERING WHEEL & AMBIENT COLOR SELECTOR */}
        <div className="relative mx-auto w-full max-w-lg mt-2 flex flex-col items-center">
          
          {/* Ambient Lighting Theme Palette (Left & Right of Yoke) */}
          <div className="flex items-center gap-2 mb-2 p-1.5 rounded-full bg-black/80 border border-white/15">
            <span className="text-[10px] font-mono text-slate-400 uppercase px-2 font-semibold">
              Ambient Mood:
            </span>
            {(Object.keys(ambientThemes) as AmbientColor[]).map((cKey) => {
              const th = ambientThemes[cKey];
              const isSelected = ambientColor === cKey;
              return (
                <button
                  key={cKey}
                  onClick={() => {
                    soundEngine.playChime(700);
                    setAmbientColor(cKey);
                  }}
                  className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isSelected ? "ring-2 ring-white scale-110 shadow-lg" : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: th.hex }}
                  title={th.name}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </button>
              );
            })}
          </div>

          {/* THE YOKE STEERING WHEEL */}
          <div
            className="relative w-64 sm:w-80 h-28 cursor-grab active:cursor-grabbing transition-transform duration-100"
            style={{ transform: `rotate(${steeringAngle}deg)` }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const diff = (moveEvent.clientX - startX) * 0.25;
                setSteeringAngle(Math.max(-28, Math.min(28, diff)));
              };
              const handleMouseUp = () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
                setSteeringAngle(0);
              };
              window.addEventListener("mousemove", handleMouseMove);
              window.addEventListener("mouseup", handleMouseUp);
            }}
          >
            {/* Yoke Frame Rim */}
            <div className="w-full h-full rounded-2xl border-4 border-slate-700 bg-gradient-to-b from-slate-900 to-black shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center justify-between px-6 relative overflow-hidden">
              
              {/* Grip Inlays */}
              <div className="w-7 h-16 rounded-xl bg-slate-800 border-r border-slate-600" />
              
              {/* Central Hub with Glowing BMW Badge */}
              <div className="w-16 h-16 rounded-full bg-black border-2 border-cyan-400/50 shadow-glow-cyan flex items-center justify-center p-0.5">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="#02040a" stroke="#00f0ff" strokeWidth="3" />
                  <path d="M50 2 A48 48 0 0 1 98 50 L50 50 Z" fill="#0066ff" />
                  <path d="M50 50 L98 50 A48 48 0 0 1 50 98 Z" fill="#ffffff" />
                  <path d="M50 50 L50 98 A48 48 0 0 1 2 50 Z" fill="#0066ff" />
                  <path d="M50 2 L50 50 L2 50 A48 48 0 0 1 50 2 Z" fill="#ffffff" />
                  <circle cx="50" cy="50" r="14" fill="#02040a" stroke="#00f0ff" strokeWidth="2" />
                </svg>
              </div>

              <div className="w-7 h-16 rounded-xl bg-slate-800 border-l border-slate-600" />
            </div>

            {/* Hint text */}
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-500 whitespace-nowrap">
              Drag Yoke to Steer
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
