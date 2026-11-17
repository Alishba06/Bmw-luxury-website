"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { soundEngine } from "./SoundEngine";
import {
  Sparkles,
  Zap,
  RotateCcw,
  Lightbulb,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Gauge,
  Compass,
} from "lucide-react";

interface PhotorealisticBMWModel {
  id: string;
  series: string;
  name: string;
  category: string;
  tagline: string;
  imageLanded: string; // Photorealistic 8K render landed on platform
  thumbnail: string;
  hp: number;
  zeroToSixty: string;
  topSpeed: string;
  powertrain: string;
  description: string;
  accentColor: string;
}

const BMW_PORTAL_MODELS: PhotorealisticBMWModel[] = [
  {
    id: "m8-competition",
    series: "M8",
    name: "BMW M8 Competition Black Edition",
    category: "HYPER-LUXURY COUPE",
    tagline: "Obsidian Metallic • Cyan Electric Aerodynamic Lines",
    imageLanded: "/mirror_portal_car_landed.jpg",
    thumbnail: "/mirror_portal_car_landed.jpg",
    hp: 1020,
    zeroToSixty: "1.95s",
    topSpeed: "225 mph",
    powertrain: "Quad-Motor Solid-State 800V Hyper-AWD",
    description: "The benchmark black luxury coupe. Cloaked in liquid obsidian paint with cyan laser optics, glowing twin kidney grille, and M blue calipers.",
    accentColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "m4-csl",
    series: "M4 CSL",
    name: "BMW M4 CSL Track Weapon",
    category: "MOTORSPORT COMPETITION",
    tagline: "Carbon Fiber Aero Splitter • Yellow Laser Optics",
    imageLanded: "/mirror_car_m4.jpg",
    thumbnail: "/mirror_car_m4.jpg",
    hp: 820,
    zeroToSixty: "2.55s",
    topSpeed: "215 mph",
    powertrain: "High-RPM TwinPower Turbo M E-Drive",
    description: "Nürburgring apex hunter featuring aggressive carbon splitter, motorsport ducktail spoiler, yellow-cyan laser beams, and red M compound calipers.",
    accentColor: "from-amber-400 to-cyan-500",
  },
  {
    id: "i7-limousine",
    series: "i7 M70",
    name: "BMW i7 M70 Executive Flagship",
    category: "ELECTRIC GRAN LIMOUSINE",
    tagline: "Illuminated Iconic Glow Grille • Split Crystal Lights",
    imageLanded: "/mirror_car_i7.jpg",
    thumbnail: "/mirror_car_i7.jpg",
    hp: 960,
    zeroToSixty: "2.40s",
    topSpeed: "205 mph",
    powertrain: "Tri-Motor Luxury Whisper-Drive",
    description: "Supreme imperial elegance with radiating crystal twin kidney outline, executive ambient lounge lighting, and ultra-smooth magnetic ride.",
    accentColor: "from-blue-400 to-purple-600",
  },
  {
    id: "m1-cyber",
    series: "M1 VISION",
    name: "BMW M1 Cyber Hommage Supercar",
    category: "CYBERPUNK CONCEPT SUPERCAR",
    tagline: "Liquid Obsidian Wedge • Glowing Aero Turbine Wheels",
    imageLanded: "/mirror_car_m1.jpg",
    thumbnail: "/mirror_car_m1.jpg",
    hp: 1100,
    zeroToSixty: "1.85s",
    topSpeed: "235 mph",
    powertrain: "Hyper-Flux Solid-State Quantum Inverter",
    description: "Reborn wedge supercar with active illuminated kidney intake blades, glowing turbine aero rims, and holographic side air-duct channels.",
    accentColor: "from-cyan-400 to-teal-500",
  },
];

type PortalState = "inside" | "rippling" | "emerging" | "landed" | "reversing";

export const MirrorPortalShowcase: React.FC = () => {
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [portalState, setPortalState] = useState<PortalState>("landed"); // Default landed so user instantly sees 8K car
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Optical toggles
  const [headlightsGlow, setHeadlightsGlow] = useState<boolean>(true);
  const [grilleGlow, setGrilleGlow] = useState<boolean>(true);
  const [calipersGlow, setCalipersGlow] = useState<boolean>(true);

  // Parallax 3D tilt
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const arenaRef = useRef<HTMLDivElement>(null);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  const activeCar = BMW_PORTAL_MODELS[selectedModelIndex];

  // Mouse Parallax for subtle 3D depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({
      x: +(yRatio * -4).toFixed(2),
      y: +(xRatio * 5).toFixed(2),
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Summon or switch car out of the mirror
  const handleSummonCar = (targetIndex: number) => {
    soundEngine.playChime(760, "triangle", 0.35, 0.15);

    // Trigger ripple on the mirror portal
    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId, x: 50, y: 44 }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1800);

    setPortalState("rippling");

    // Stage 1: Energy warp audio
    setTimeout(() => {
      try {
        soundEngine.triggerLaunchWarp();
      } catch {}
      setSelectedModelIndex(targetIndex);
      setPortalState("emerging");
    }, 550);

    // Stage 2: Car lands on glowing platform
    setTimeout(() => {
      soundEngine.playChime(920, "sine", 0.45, 0.12);
      setPortalState("landed");
    }, 1350);
  };

  // Recall car into mirror
  const handleRecallToMirror = () => {
    if (portalState !== "landed") return;
    soundEngine.playLaserSweep();
    setPortalState("reversing");

    setTimeout(() => {
      soundEngine.playChime(500, "sine", 0.3, 0.1);
      setPortalState("inside");
    }, 1000);
  };

  // Scroll carousel left/right
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselScrollRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    carouselScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    soundEngine.playChime(580);
  };

  return (
    <section
      id="mirror-portal"
      className="relative w-full min-h-screen py-14 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#02050f] overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* 1. CINEMATIC AMBIENT LIGHTING */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] bg-gradient-to-b from-indigo-950/45 via-cyan-950/30 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/6 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[110px]" />
        <div className="absolute top-1/3 right-1/6 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:64px_64px] opacity-10" />
      </div>

      {/* 2. HEADER */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mb-6 sm:mb-10 px-2">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] shadow-[0_0_25px_rgba(0,240,255,0.25)] mb-3 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>BMW M QUANTUM DIMENSIONAL MIRROR • 8K RENDER</span>
        </div>

        <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-400 tracking-tight leading-tight">
          BREACH THE MIRROR
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-cyan-200/70 max-w-2xl mx-auto font-light leading-relaxed">
          Scroll through the models inside the card below. Click any BMW model to trigger the ripple wave on the giant
          circular neon mirror and watch it smoothly drive out onto the glowing circular platform!
        </p>
      </div>

      {/* 3. MAIN CINEMATIC 8K STAGE (The Masterpiece Card) */}
      <div
        ref={arenaRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full max-w-6xl h-[520px] sm:h-[580px] lg:h-auto lg:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(0,240,255,0.3)] bg-black transition-transform duration-300 ease-out flex flex-col justify-between group"
        style={{
          transform: `perspective(1000px) rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* --- SCENE LAYER 1: CAR INSIDE MIRROR IN DREAMY ROOM (Pre-Summon) --- */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            portalState === "inside" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src="/mirror_portal_scene.jpg"
            alt="BMW Giant Circular Neon Mirror Portal in Night Showroom"
            fill
            className={`object-cover object-center transition-transform duration-1000 ${
              portalState === "rippling" ? "scale-105 filter brightness-125" : "scale-100"
            }`}
            priority
          />
        </div>

        {/* --- SCENE LAYER 2: ACTIVE 8K PHOTOREALISTIC BMW MODEL ON GLOWING PLATFORM --- */}
        {BMW_PORTAL_MODELS.map((model, idx) => {
          const isCurrent = selectedModelIndex === idx;
          const isVisible = portalState !== "inside" && isCurrent;

          return (
            <div
              key={model.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={model.imageLanded}
                alt={model.name}
                fill
                className={`object-cover object-center transition-transform duration-1000 ${
                  portalState === "emerging" ? "scale-105 filter brightness-110" : "scale-100"
                }`}
                priority={idx === 0}
              />
            </div>
          );
        })}

        {/* --- DYNAMIC OPTICAL EFFECTS OVERLAYS --- */}
        {portalState === "landed" && (
          <>
            {/* Headlights Laser Beams Flare */}
            {headlightsGlow && (
              <div
                className="absolute bottom-[30%] left-[34%] w-40 sm:w-56 h-20 pointer-events-none -z-10 origin-right transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(240deg, rgba(0, 240, 255, 0.75) 0%, rgba(0, 240, 255, 0.2) 40%, transparent 100%)",
                  clipPath: "polygon(100% 40%, 100% 60%, 0% 100%, 0% 0%)",
                  filter: "drop-shadow(0 0 25px #00f0ff) blur(2px)",
                }}
              />
            )}

            {/* Iconic Grille Cyan Glow Pulse */}
            {grilleGlow && (
              <div className="absolute bottom-[36%] left-[39%] w-10 sm:w-14 h-6 sm:h-8 rounded-full bg-cyan-400/25 blur-md pointer-events-none animate-pulse" />
            )}

            {/* Blue Brake Calipers Glow */}
            {calipersGlow && (
              <div className="absolute bottom-[23%] left-[53%] w-6 h-6 rounded-full bg-blue-500/40 blur-sm pointer-events-none animate-pulse" />
            )}
          </>
        )}

        {/* --- INTERACTIVE RIPPLE WAVES OVER MIRROR SURFACE --- */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-300 shadow-[0_0_40px_#00f0ff] animate-[ripple_1.7s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              backdropFilter: "blur(3px)",
            }}
          />
        ))}

        {/* --- MIRROR CLICKABLE BREACH HOTSPOT (When car is inside) --- */}
        {portalState === "inside" && (
          <div
            onClick={() => handleSummonCar(selectedModelIndex)}
            className="absolute top-[18%] sm:top-[23%] left-1/2 -translate-x-1/2 w-[48%] sm:w-[34%] aspect-square rounded-full cursor-pointer z-30 flex items-center justify-center group/mirror"
            title="Click to Breach Portal and Drive Out"
          >
            <div className="w-[85%] h-[85%] rounded-full border border-cyan-400/50 group-hover/mirror:border-cyan-300 group-hover/mirror:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center">
              <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400 text-cyan-300 text-[10px] sm:text-xs font-mono tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.6)] backdrop-blur-md animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>CLICK MIRROR TO SUMMON CAR</span>
              </div>
            </div>
          </div>
        )}

        {/* --- ENERGY FLASH DURING PORTAL EMERGENCE --- */}
        {(portalState === "rippling" || portalState === "emerging") && (
          <div className="absolute inset-0 bg-cyan-400/20 mix-blend-screen pointer-events-none animate-pulse flex items-center justify-center z-40">
            <div className="w-64 h-64 rounded-full border-4 border-cyan-300 shadow-[0_0_80px_#00f0ff] animate-ping" />
          </div>
        )}

        {/* --- TOP HUD BAR INSIDE CARD --- */}
        <div className="relative z-20 w-full p-4 sm:p-6 flex items-center justify-between pointer-events-none">
          {/* Active Model Status Tag */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 border border-cyan-500/35 text-cyan-300 text-[11px] font-mono tracking-wider backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                portalState === "landed" ? "bg-cyan-400 animate-ping" : "bg-purple-400 animate-pulse"
              }`}
            />
            <span className="font-bold text-white">{activeCar.series}</span>
            <span className="text-slate-400">•</span>
            <span>{portalState === "landed" ? "DRIVEN OUT ON PLATFORM" : "INSIDE DREAMY ROOM"}</span>
          </div>

          {/* Quick Recall / Summon Action */}
          <div className="pointer-events-auto">
            {portalState === "landed" ? (
              <button
                onClick={handleRecallToMirror}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Recall into Mirror</span>
              </button>
            ) : (
              <button
                onClick={() => handleSummonCar(selectedModelIndex)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-black" />
                <span>Drive Out Now</span>
              </button>
            )}
          </div>
        </div>

        {/* --- BOTTOM SCROLLABLE CAR DOCK INSIDE CARD (Requested by user) --- */}
        <div className="relative z-20 w-full p-3 sm:p-5 bg-gradient-to-t from-black/95 via-black/75 to-transparent backdrop-blur-sm pointer-events-auto">
          {/* Section subtitle & scroll arrows */}
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300/80 uppercase tracking-widest font-semibold">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>SCROLL MODELS • CLICK ANY CAR TO DRIVE OUT</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HORIZONTAL SCROLL REEL */}
          <div
            ref={carouselScrollRef}
            className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{
              scrollbarWidth: "none",
            }}
          >
            {BMW_PORTAL_MODELS.map((car, idx) => {
              const isSelected = selectedModelIndex === idx && portalState === "landed";

              return (
                <div
                  key={car.id}
                  onClick={() => handleSummonCar(idx)}
                  className={`min-w-[195px] sm:min-w-[250px] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-2.5 sm:gap-3 relative group/card shrink-0 ${
                    isSelected
                      ? "bg-slate-900/95 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.45)] scale-[1.02]"
                      : "bg-slate-950/80 border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/80"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border border-slate-700/60 bg-black/80 shrink-0">
                    <Image
                      src={car.thumbnail}
                      alt={car.name}
                      fill
                      className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                        {car.series}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{car.zeroToSixty}</span>
                    </div>

                    <h4 className="text-xs font-black text-white truncate mt-0.5">{car.name}</h4>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold tracking-wider flex items-center gap-1 ${
                          isSelected
                            ? "bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                            : "bg-slate-900 text-cyan-300 border border-slate-700"
                        }`}
                      >
                        <Zap className="w-2.5 h-2.5" />
                        <span>{isSelected ? "DRIVEN OUT" : "CLICK TO DRIVE OUT"}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. SLEEK FLOATING TELEMETRY HUD CARDS */}
      <div className="relative z-20 w-full max-w-6xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* CARD 1: ACTIVE VEHICLE SPECIFICATIONS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/25 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
              <span>MANIFESTED MODEL</span>
              <span className="text-cyan-400 font-bold">{activeCar.series}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1 leading-tight">{activeCar.name}</h3>
            <p className="text-xs text-cyan-200/80 font-light mt-0.5">{activeCar.tagline}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-400">HORSEPOWER</span>
              <span className="text-sm font-black text-cyan-300">{activeCar.hp} HP</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-400">0–60 MPH</span>
              <span className="text-sm font-black text-purple-300">{activeCar.zeroToSixty}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-400">TOP SPEED</span>
              <span className="text-sm font-black text-blue-300">{activeCar.topSpeed}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: OPTICAL & SENSORY CONTROLS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/25 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Optics & Illumination</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">CYAN / BLUE SPECTRUM</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                soundEngine.playChime(680);
                setHeadlightsGlow(!headlightsGlow);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-mono tracking-wider flex flex-col items-center justify-center gap-1 border cursor-pointer transition-all ${
                headlightsGlow
                  ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "bg-slate-950 border-slate-800 text-slate-500"
              }`}
            >
              <span>Headlights</span>
              <span className={`w-2 h-2 rounded-full ${headlightsGlow ? "bg-cyan-400 animate-pulse" : "bg-slate-700"}`} />
            </button>

            <button
              onClick={() => {
                soundEngine.playChime(680);
                setGrilleGlow(!grilleGlow);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-mono tracking-wider flex flex-col items-center justify-center gap-1 border cursor-pointer transition-all ${
                grilleGlow
                  ? "bg-blue-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "bg-slate-950 border-slate-800 text-slate-500"
              }`}
            >
              <span>Kidney Grille</span>
              <span className={`w-2 h-2 rounded-full ${grilleGlow ? "bg-cyan-400 animate-pulse" : "bg-slate-700"}`} />
            </button>

            <button
              onClick={() => {
                soundEngine.playChime(680);
                setCalipersGlow(!calipersGlow);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-mono tracking-wider flex flex-col items-center justify-center gap-1 border cursor-pointer transition-all ${
                calipersGlow
                  ? "bg-blue-950/80 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  : "bg-slate-950 border-slate-800 text-slate-500"
              }`}
            >
              <span>M Calipers</span>
              <span className={`w-2 h-2 rounded-full ${calipersGlow ? "bg-blue-400 animate-pulse" : "bg-slate-700"}`} />
            </button>
          </div>

          <p className="mt-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
            <Flame className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{activeCar.powertrain}</span>
          </p>
        </div>

        {/* CARD 3: DIMENSIONAL GATE TELEMETRY */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/25 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Dimensional Wormhole</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-black">ACTIVE</span>
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Ring Resonance:</span>
              <span className="text-cyan-400 font-bold">142.8 GHz Superconducting</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Floor Surface:</span>
              <span className="text-cyan-300">Dark Obsidian High-Gloss</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Platform Maglev:</span>
              <span className="text-purple-400 font-bold">Zero-G Synchronized</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-300/80">
            <span>Scroll & click card to summon</span>
            <span className="text-cyan-400">8K CINEMATIC</span>
          </div>
        </div>

      </div>

      {/* RIPPLE KEYFRAME ANIMATION */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(0.1);
          }
          50% {
            opacity: 0.7;
          }
          100% {
            width: 650px;
            height: 650px;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.6);
          }
        }
      `}</style>
    </section>
  );
};
