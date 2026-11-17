"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "./SoundEngine";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Music,
  Disc,
  X,
  Zap,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface HansZimmerSoundStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

type SoundMode = "comfort" | "sport" | "warp";

export const HansZimmerSoundStudio: React.FC<HansZimmerSoundStudioProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<SoundMode>("sport");
  const [isPlaying, setIsPlaying] = useState(false);
  const [throttle, setThrottle] = useState(25); // 0 to 100%
  const [appliedToVehicle, setAppliedToVehicle] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRevvingRef = useRef(false);

  const profiles: {
    id: SoundMode;
    name: string;
    tag: string;
    desc: string;
    color: string;
    border: string;
    bgBadge: string;
    rpmRange: string;
  }[] = [
    {
      id: "comfort",
      name: "Whisper Comfort",
      tag: "Serene Gliding",
      desc: "Warm sinusoidal harmonic drone, evoking effortless high-speed levitation.",
      color: "from-cyan-400 to-teal-400",
      border: "border-cyan-400/40",
      bgBadge: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
      rpmRange: "0 – 8,000 RPM",
    },
    {
      id: "sport",
      name: "Hyper-EV Sport",
      tag: "Cybernetic Pulse",
      desc: "Punchy dual-inverter frequencies with sharp acoustic response to acceleration.",
      color: "from-blue-500 to-cyan-400",
      border: "border-blue-400/50",
      bgBadge: "bg-blue-500/20 text-cyan-300 border-blue-400/40",
      rpmRange: "0 – 14,000 RPM",
    },
    {
      id: "warp",
      name: "M Track Warp",
      tag: "Hans Zimmer Hyperdrive",
      desc: "Cinematic, deep sub-bass resonance fused with screaming high-voltage magnetic coils.",
      color: "from-purple-500 via-pink-500 to-amber-400",
      border: "border-purple-400/50",
      bgBadge: "bg-purple-500/20 text-purple-300 border-purple-400/40",
      rpmRange: "0 – 18,500 RPM",
    },
  ];

  // Sync audio on open/close
  useEffect(() => {
    if (isOpen) {
      soundEngine.startStudioSound(activeMode);
      soundEngine.setStudioThrottle(throttle);
      setIsPlaying(true);
    } else {
      soundEngine.stopStudioSound();
      setIsPlaying(false);
    }

    return () => {
      soundEngine.stopStudioSound();
    };
  }, [isOpen]);

  // Audio visualizer canvas loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const render = () => {
      soundEngine.getAnalyserData(dataArray);

      const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
      const height = (canvas.height = 120);

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / dataArray.length) * 0.72;
      let x = (width - dataArray.length * (barWidth + 3)) / 2;

      for (let i = 0; i < dataArray.length; i++) {
        let val = isPlaying ? dataArray[i] : 8;
        // Inject idle organic pulse when value is low
        if (val < 15 && isPlaying) {
          val = 15 + Math.sin(Date.now() * 0.006 + i) * 10;
        }

        const barHeight = Math.max(4, (val / 255) * height * 0.88);
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (activeMode === "comfort") {
          grad.addColorStop(0, "rgba(0, 240, 255, 0.9)");
          grad.addColorStop(1, "rgba(20, 184, 166, 0.4)");
        } else if (activeMode === "sport") {
          grad.addColorStop(0, "rgba(0, 102, 255, 0.95)");
          grad.addColorStop(1, "rgba(0, 240, 255, 0.6)");
        } else {
          grad.addColorStop(0, "rgba(236, 72, 153, 0.95)");
          grad.addColorStop(0.5, "rgba(139, 92, 246, 0.8)");
          grad.addColorStop(1, "rgba(245, 158, 11, 0.6)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3]);
        ctx.fill();

        x += barWidth + 3;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, activeMode]);

  const handleSelectMode = (mode: SoundMode) => {
    soundEngine.playChime(640);
    setActiveMode(mode);
    soundEngine.startStudioSound(mode);
    soundEngine.setStudioThrottle(throttle);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundEngine.stopStudioSound();
      setIsPlaying(false);
    } else {
      soundEngine.startStudioSound(activeMode);
      soundEngine.setStudioThrottle(throttle);
      setIsPlaying(true);
    }
  };

  const handleThrottleChange = (val: number) => {
    setThrottle(val);
    soundEngine.setStudioThrottle(val);
  };

  // Quick Rev button hold (revs to 95% on press, drops back down on release)
  const startRevving = () => {
    isRevvingRef.current = true;
    let curr = throttle;
    const interval = setInterval(() => {
      if (!isRevvingRef.current) {
        clearInterval(interval);
        return;
      }
      curr = Math.min(95, curr + 8);
      handleThrottleChange(curr);
      if (curr >= 95) clearInterval(interval);
    }, 30);
  };

  const stopRevving = () => {
    isRevvingRef.current = false;
    let curr = throttle;
    const interval = setInterval(() => {
      if (isRevvingRef.current) {
        clearInterval(interval);
        return;
      }
      curr = Math.max(25, curr - 6);
      handleThrottleChange(curr);
      if (curr <= 25) clearInterval(interval);
    }, 30);
  };

  const calculatedRPM = Math.round((throttle / 100) * (activeMode === "warp" ? 18500 : activeMode === "sport" ? 14000 : 8000));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 select-none overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto my-auto bg-[#020514]/95 border-2 border-cyan-400/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between">
        
        {/* Subtle Top Glowing Line Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-glow-cyan">
              <div className="w-full h-full rounded-2xl bg-black/80 flex items-center justify-center">
                <Music className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-xl text-white tracking-tight uppercase">
                  BMW IconicSounds Electric
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/30 font-bold uppercase">
                  Hans Zimmer Lab
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 italic">
                “Sound is the emotional bridge between driver and machine.” — Hans Zimmer
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playChime(420);
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Close Sound Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. SOUND PROFILE SELECTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          {profiles.map((p) => {
            const isSelected = activeMode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectMode(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900/90 border-cyan-400 shadow-glow-cyan scale-[1.02]"
                    : "bg-black/50 border-white/10 hover:border-cyan-400/40 hover:bg-white/5"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono tracking-widest uppercase border ${p.bgBadge}`}>
                      {p.tag}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-base text-white">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>RPM Range:</span>
                  <span className="text-cyan-300 font-bold">{p.rpmRange}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. REAL-TIME NEON AUDIO OSCILLOSCOPE & VISUALIZER */}
        <div className="p-4 rounded-2xl bg-black/80 border border-cyan-500/25 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>SYNTHESIZED HARMONIC SPECTRUM</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              {isPlaying ? "LIVE 800V AUDIO FEED" : "PAUSED"}
            </span>
          </div>

          <div className="w-full flex items-center justify-center py-1">
            <canvas ref={canvasRef} className="w-full h-[100px]" />
          </div>
        </div>

        {/* 3. INTERACTIVE THROTTLE / RPM ACCELERATOR */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Interactive Motor Accelerator
              </span>
            </div>
            <div className="text-xs font-mono">
              <span className="text-slate-400">Simulated: </span>
              <span className="text-cyan-300 font-bold text-sm">
                {calculatedRPM.toLocaleString()} RPM
              </span>
              <span className="text-slate-500 ml-1">({throttle}%)</span>
            </div>
          </div>

          {/* Slider */}
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={throttle}
              onChange={(e) => handleThrottleChange(Number(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />

            {/* Tactile Rev Button */}
            <button
              onMouseDown={startRevving}
              onMouseUp={stopRevving}
              onTouchStart={startRevving}
              onTouchEnd={stopRevving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Hold to Rev Motor</span>
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-cyan-500/20">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="px-4 py-2.5 rounded-xl border border-cyan-400/50 bg-cyan-950/40 text-cyan-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-all hover:shadow-glow-cyan"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-cyan-400" />
                  <span>Pause Acoustics</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-cyan-400" />
                  <span>Play Acoustics</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playChime(750);
                setAppliedToVehicle(true);
                setTimeout(() => setAppliedToVehicle(false), 2400);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className={`w-4 h-4 ${appliedToVehicle ? "text-emerald-400" : "text-cyan-400"}`} />
              <span>{appliedToVehicle ? "Applied to Drive Mode!" : "Apply to Vehicle"}</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playChime(420);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
