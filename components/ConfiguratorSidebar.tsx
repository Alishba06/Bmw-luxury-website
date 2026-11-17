"use client";

import React, { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { Sliders, ArrowRight, RotateCcw, CheckCircle, ChevronRight, ChevronLeft, Palette } from "lucide-react";

export interface ConfigState {
  colorKey: string;
  colorName: string;
  colorHex: string;
  wheelKey: string;
  wheelName: string;
  interiorKey: string;
  interiorName: string;
  basePrice: number;
}

interface ConfiguratorSidebarProps {
  config: ConfigState;
  onChangeColor: (key: string, name: string, hex: string) => void;
  onChangeWheel: (key: string, name: string) => void;
  onChangeInterior: (key: string, name: string) => void;
  onReset: () => void;
  onOpenBuildModal: () => void;
}

export const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({
  config,
  onChangeColor,
  onChangeWheel,
  onChangeInterior,
  onReset,
  onOpenBuildModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Responsive: on screens >= 1024px show sidebar; on mobile/tablet keep collapsed so hero car & text are 100% visible
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colors = [
    { key: "black", name: "Frozen Carbon Black", hex: "#0a0a0d", gradient: "from-[#1c1d24] to-[#08080a]" },
    { key: "blue", name: "M Tanzanite Electric Blue", hex: "#0044aa", gradient: "from-[#0066ff] to-[#001f5c]" },
    { key: "cyan", name: "Cyber Cyan Metallic", hex: "#00f0ff", gradient: "from-[#00f0ff] to-[#008899]" },
    { key: "purple", name: "Velvet Purple Neon", hex: "#8b5cf6", gradient: "from-[#8b5cf6] to-[#4c1d95]" },
    { key: "white", name: "Frozen Pure Alpine", hex: "#f8fafc", gradient: "from-[#ffffff] to-[#cbd5e1]" },
  ];

  const wheels = [
    { key: "22-vspoke", name: '22" Aero V-Spoke', tag: "Bicolor Jet", size: '22" Aero' },
    { key: "23-turbine", name: '23" Carbon Jet Turbine', tag: "Carbon Aero", size: '23" Jet' },
    { key: "22-mstar", name: '22" M Frozen Star', tag: "Forged M", size: '22" Star' },
  ];

  const interiors = [
    { key: "merino-black", name: "Silverstone Merino Black", dotBg: "bg-slate-900 border-slate-600" },
    { key: "night-blue", name: "Alcantara Night Blue", dotBg: "bg-blue-950 border-blue-500" },
  ];

  // Dynamic price calculation
  let totalPrice = config.basePrice;
  if (config.colorKey === "cyan") totalPrice += 2400;
  if (config.colorKey === "purple") totalPrice += 3200;
  if (config.wheelKey === "23-turbine") totalPrice += 4500;
  if (config.interiorKey === "night-blue") totalPrice += 2800;

  const toggleSidebar = () => {
    soundEngine.playChime(isOpen ? 450 : 650);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY WHEN OPEN */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* MINIMIZED FLOATING TRIGGER (When sidebar is collapsed, keeping car & text 100% visible) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-5 right-3 sm:bottom-auto sm:top-28 sm:right-6 z-30 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl glass-panel border border-cyan-400/50 bg-black/75 backdrop-blur-xl text-white shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in cursor-pointer"
          title="Open Customizer"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-semibold leading-tight">
              Customize
            </span>
            <span className="text-xs font-bold text-white leading-tight">Choose Your Style</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-cyan-400 ml-1 hidden sm:block" />
        </button>
      )}

      {/* EXPANDED FULL SIDEBAR */}
      <aside
        className={`fixed inset-x-3 sm:inset-x-auto sm:right-6 top-16 sm:top-24 bottom-4 sm:bottom-24 z-40 w-auto sm:w-80 max-w-sm glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-y-auto transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-[115%] opacity-0 pointer-events-none"
        }`}
      >
        <div>
          {/* Header with Collapse Button */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Studio Customizer
              </span>
              <h2 className="font-display font-bold text-lg text-white">Choose Your Style</h2>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSidebar}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Collapse to view car & background"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Exterior Color Finish */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Exterior Finish
              </label>
              <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[140px] text-right">
                {config.colorName}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => {
                const isSelected = config.colorKey === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => {
                      soundEngine.playChime(560);
                      onChangeColor(c.key, c.name, c.hex);
                    }}
                    title={c.name}
                    className={`relative group h-9 rounded-xl bg-gradient-to-b ${c.gradient} border-2 transition-all ${
                      isSelected
                        ? "border-cyan-400 shadow-glow-cyan scale-105"
                        : "border-transparent hover:border-cyan-300/60"
                    }`}
                  >
                    <span className="absolute inset-0 rounded-xl bg-black/30 group-hover:opacity-0 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Aerodynamic Wheels */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Aerodynamic Wheels
              </label>
              <span className="text-[10px] font-mono text-cyan-400">{config.wheelName}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {wheels.map((w) => {
                const isSelected = config.wheelKey === w.key;
                return (
                  <button
                    key={w.key}
                    onClick={() => {
                      soundEngine.playChime(600);
                      onChangeWheel(w.key, w.name);
                    }}
                    className={`p-2 rounded-xl bg-black/50 border text-left transition-all ${
                      isSelected
                        ? "border-cyan-400 shadow-glow-cyan bg-cyan-950/20"
                        : "border-white/10 hover:border-cyan-300/40"
                    }`}
                  >
                    <div className="text-[11px] font-bold text-white">{w.size}</div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">{w.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Interior Cabin */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Interior Cabin
              </label>
              <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[130px] text-right">
                {config.interiorName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {interiors.map((i) => {
                const isSelected = config.interiorKey === i.key;
                return (
                  <button
                    key={i.key}
                    onClick={() => {
                      soundEngine.playChime(640);
                      onChangeInterior(i.key, i.name);
                    }}
                    className={`p-2.5 rounded-xl bg-black/50 border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? "border-cyan-400 shadow-glow-cyan bg-cyan-950/20"
                        : "border-white/10 hover:border-cyan-300/40"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border ${i.dotBg}`} />
                    <span className="text-xs font-medium text-white truncate">{i.name.split(" ")[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Guarantee Card */}
          <div className="mt-5 p-3 rounded-xl bg-brand-deep/60 border border-cyan-500/20 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Estimated MSRP</span>
              <span className="text-base font-bold font-display text-white">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1">
              <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Includes 3-Year Unlimited Supercharging</span>
            </div>
          </div>
        </div>

        {/* Build Your BMW Button */}
        <div className="pt-4 border-t border-cyan-500/20">
          <button
            onClick={() => {
              soundEngine.playChime(880);
              onOpenBuildModal();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan via-cyan-400 to-brand-blue text-black font-extrabold text-xs uppercase tracking-widest shadow-glow-cyan hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Build Your BMW</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <div className="text-center mt-2 flex items-center justify-between px-1">
            <button
              onClick={() => {
                soundEngine.playChime(440);
                onReset();
              }}
              className="text-[10px] text-slate-400 hover:text-cyan-400 font-mono uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={toggleSidebar}
              className="text-[10px] text-cyan-400 hover:text-white font-mono uppercase tracking-wider transition-colors"
            >
              Hide Sidebar ⇥
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
