"use client";

import React, { useState } from "react";
import { soundEngine } from "./SoundEngine";
import {
  BatteryCharging,
  Cpu,
  Zap,
  ShieldCheck,
  Eye,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

export const TechnologyArchitectureSection: React.FC = () => {
  // Interactive Charging Time Slider: 0 to 30 Minutes
  const [chargingMinutes, setChargingMinutes] = useState(12);

  // Dynamic calculations based on 800V fast-charge curve
  // 0 min = 10% (62 mi)
  // 12 min = 80% (496 mi)
  // 24 min = 100% (620 mi)
  let batteryPercent = 10;
  let rangeMiles = 62;
  let chargingKw = 350;

  if (chargingMinutes <= 12) {
    batteryPercent = Math.round(10 + (chargingMinutes / 12) * 70);
    rangeMiles = Math.round(62 + (chargingMinutes / 12) * 434);
    chargingKw = 350;
  } else {
    const extra = (chargingMinutes - 12) / 18;
    batteryPercent = Math.round(80 + extra * 20);
    rangeMiles = Math.round(496 + extra * 124);
    chargingKw = Math.round(350 - extra * 175); // Trickle taper above 80%
  }
  batteryPercent = Math.min(100, Math.max(10, batteryPercent));
  rangeMiles = Math.min(620, Math.max(62, rangeMiles));

  const [activeSensor, setActiveSensor] = useState<string>("lidar");

  const sensorSystems = [
    {
      id: "lidar",
      title: "Solid-State 905nm LiDAR",
      range: "300 Meters Range",
      rate: "1.2M Points / Sec",
      desc: "Penetrates through heavy rain, dense fog, and pitch-black darkness to generate real-time 3D point cloud topology.",
    },
    {
      id: "radar",
      title: "4D High-Definition Imaging Radar",
      range: "250 Meters Range",
      rate: "Sub-Millimeter Precision",
      desc: "Instantaneous velocity vectoring of surrounding traffic, pedestrians, and obstacles even behind road barriers.",
    },
    {
      id: "vision",
      title: "8K Surround Machine Vision",
      range: "360° Sphere Perception",
      rate: "60 FPS Neural Processing",
      desc: "Eight ultra-high dynamic range optical cameras processing lane markers, road signage, and subtle hazard warnings.",
    },
  ];

  return (
    <section id="technology" className="relative w-full py-24 px-4 sm:px-8 bg-gradient-to-b from-brand-black via-[#030617] to-brand-black overflow-hidden border-t border-cyan-500/20">
      
      {/* Background Ambient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] uppercase tracking-widest mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>800V ARCHITECTURE & NEURAL PERCEPTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
            Intelligence Meets <span className="bg-gradient-to-r from-brand-cyan via-white to-brand-purple bg-clip-text text-transparent">Power</span>
          </h2>
          <p className="text-slate-400 font-sans text-sm sm:text-base mt-2">
            The next generation of mobility is powered by high-density solid-state batteries, 350 kW ultra-fast charging, and Level 4 autonomous neural intelligence.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* COLUMN 1: INTERACTIVE 800V SOLID-STATE CHARGING SIMULATOR */}
          <div className="rounded-3xl bg-slate-950/80 border-2 border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            
            {/* Top Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <BatteryCharging className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                      800V Solid-State Fast-Charge
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      135 kWh Liquid-Free Electrolyte Pack
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold uppercase">
                  350 kW DC Peak
                </span>
              </div>

              {/* Big Interactive Gauge Readout */}
              <div className="my-6 p-6 rounded-2xl bg-black/70 border border-cyan-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-display font-black text-cyan-300 drop-shadow-glow-cyan">
                    {batteryPercent}%
                  </span>
                  <span className="text-sm font-mono text-slate-400 font-bold uppercase">
                    CAPACITY
                  </span>
                </div>

                <div className="flex items-center gap-6 mt-3 text-xs font-mono">
                  <div className="text-center">
                    <span className="text-slate-500 uppercase text-[9px] block">Total Range</span>
                    <span className="text-white font-bold text-base">{rangeMiles} Miles</span>
                  </div>
                  <div className="w-px h-6 bg-slate-700/60" />
                  <div className="text-center">
                    <span className="text-slate-500 uppercase text-[9px] block">Charging Speed</span>
                    <span className="text-cyan-400 font-bold text-base">{chargingKw} kW</span>
                  </div>
                  <div className="w-px h-6 bg-slate-700/60" />
                  <div className="text-center">
                    <span className="text-slate-500 uppercase text-[9px] block">Plug Time</span>
                    <span className="text-purple-400 font-bold text-base">{chargingMinutes} Mins</span>
                  </div>
                </div>

                {/* Animated Battery Bar */}
                <div className="w-full h-3 rounded-full bg-slate-900 border border-cyan-400/30 overflow-hidden mt-6 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.7)]"
                    style={{ width: `${batteryPercent}%` }}
                  />
                </div>
              </div>

              {/* Interactive Charging Duration Slider */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Drag Charging Duration:</span>
                  </span>
                  <span className="text-cyan-300 font-bold">{chargingMinutes} Minutes</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="30"
                  value={chargingMinutes}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setChargingMinutes(val);
                    if (val % 3 === 0) {
                      soundEngine.playChime(400 + val * 12, "sine", 0.05, 0.04);
                    }
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                  <span>0 Min (10%)</span>
                  <span className="text-cyan-400 font-bold">12 Min (80% Optimal)</span>
                  <span>30 Min (100% Full)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono mt-6 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Proprietary solid-state electrolyte cells prevent thermal degradation and provide 20-year cycle longevity.</span>
            </p>
          </div>

          {/* COLUMN 2: LEVEL 4 AUTONOMOUS PERCEPTION MATRIX */}
          <div className="rounded-3xl bg-slate-950/80 border-2 border-purple-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            
            {/* Top Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                    <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                      Neural L4 Autonomous Shield
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Multi-Sensor Fusion Radar & LiDAR Array
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-mono font-bold uppercase">
                  Level 4 Ready
                </span>
              </div>

              {/* Sensor Selector Pills */}
              <div className="grid grid-cols-3 gap-2 my-4">
                {sensorSystems.map((s) => {
                  const isSelected = activeSensor === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundEngine.playChime(660);
                        setActiveSensor(s.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-950/70 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                          : "bg-black/50 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold block truncate">
                        {s.id.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono truncate block mt-0.5">
                        {s.range}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Sensor Deep Dive Box */}
              {sensorSystems
                .filter((s) => s.id === activeSensor)
                .map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl bg-black/70 border border-purple-500/30 my-4 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display font-bold text-white text-base">
                        {s.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-400/30">
                        {s.rate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
                      {s.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Effective Radius</span>
                        <span className="text-purple-300 font-bold">{s.range}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Latency</span>
                        <span className="text-emerald-400 font-bold">&lt; 2.5 Milliseconds</span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Features List */}
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hands-free motorway autopilot cruising up to 130 km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated Valet Parking with millimeter-precise obstacle evasion</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono mt-6 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Redundant fail-safe dual compute cores certified to ISO 26262 ASIL-D automotive safety integrity.</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
