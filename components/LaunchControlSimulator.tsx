"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "./SoundEngine";
import {
  Zap,
  Activity,
  Gauge,
  RotateCcw,
  X,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Volume2,
} from "lucide-react";

interface LaunchControlSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

type LaunchStage = "idle" | "spooling" | "launching" | "completed";

export const LaunchControlSimulator: React.FC<LaunchControlSimulatorProps> = ({
  isOpen,
  onClose,
}) => {
  const [stage, setStage] = useState<LaunchStage>("idle");
  const [spoolProgress, setSpoolProgress] = useState(0); // 0 to 100
  const [speed, setSpeed] = useState(0); // 0 to 60 mph
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [currentGForce, setCurrentGForce] = useState(0); // Gs
  const [peakGForce, setPeakGForce] = useState(1.48);
  const [powerOutput, setPowerOutput] = useState(0); // HP
  const [telemetryHistory, setTelemetryHistory] = useState<
    { time: number; speed: number; g: number }[]
  >([]);

  const spoolIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const launchAnimRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const warpStarsRef = useRef<{ x: number; y: number; z: number; speed: number }[]>([]);

  // Key listeners (Press & hold Spacebar to spool)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && stage === "idle") {
        e.preventDefault();
        startSpool();
      }
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (stage === "spooling") {
          releasePedal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, stage, spoolProgress]);

  // Warp tunnel canvas animation during launching
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize stars
    if (warpStarsRef.current.length === 0) {
      warpStarsRef.current = Array.from({ length: 180 }, () => ({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * width,
        speed: 4 + Math.random() * 8,
      }));
    }

    const renderWarp = () => {
      ctx.fillStyle = "rgba(2, 4, 12, 0.4)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const isWarping = stage === "launching";
      const speedMult = isWarping ? 3.5 : stage === "spooling" ? 1.4 : 0.4;

      warpStarsRef.current.forEach((star) => {
        star.z -= star.speed * speedMult;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width;
          star.y = (Math.random() - 0.5) * height;
        }

        const k = 280 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.6, (1 - star.z / width) * (isWarping ? 4.5 : 2.2));
          const alpha = (1 - star.z / width) * (isWarping ? 0.95 : 0.45);

          if (isWarping) {
            // Draw speed line streak
            const prevK = 280 / (star.z + star.speed * 8);
            const prevPx = star.x * prevK + cx;
            const prevPy = star.y * prevK + cy;

            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = size * 0.9;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.fill();
          }
        }
      });

      animId = requestAnimationFrame(renderWarp);
    };

    renderWarp();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, stage]);

  // START SPOOLING (Building Boost)
  const startSpool = () => {
    if (stage === "launching" || stage === "completed") return;
    setStage("spooling");
    setSpoolProgress(0);
    soundEngine.startLaunchSpool();

    const startTime = Date.now();
    const spoolDuration = 1850; // 1.85 seconds to reach 100% boost

    if (spoolIntervalRef.current) clearInterval(spoolIntervalRef.current);

    spoolIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / spoolDuration) * 100));
      setSpoolProgress(progress);

      if (progress >= 100) {
        if (spoolIntervalRef.current) clearInterval(spoolIntervalRef.current);
      }
    }, 25);
  };

  // RELEASE PEDAL (Trigger Launch if at 100% boost, or cancel if released too early)
  const releasePedal = () => {
    if (stage !== "spooling") return;

    if (spoolIntervalRef.current) {
      clearInterval(spoolIntervalRef.current);
      spoolIntervalRef.current = null;
    }

    if (spoolProgress >= 90) {
      // SUCCESSFUL LAUNCH!
      executeLaunchRun();
    } else {
      // Released too early
      soundEngine.stopLaunchSpool();
      soundEngine.playChime(320, "sine", 0.3, 0.15);
      setStage("idle");
      setSpoolProgress(0);
    }
  };

  // EXECUTE 0-60 MPH WARP RUN
  const executeLaunchRun = () => {
    setStage("launching");
    soundEngine.triggerLaunchWarp();

    const targetSpeed = 60.0;
    const targetDuration = 2120; // Exact 2.12s
    const startTime = performance.now();
    const history: { time: number; speed: number; g: number }[] = [];

    // Trigger haptic vibration if supported (Mobile)
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([80, 40, 150, 40, 200]);
      } catch {}
    }

    const animateRun = (now: number) => {
      const elapsedMs = now - startTime;
      const progress = Math.min(1, elapsedMs / targetDuration);

      // Hyper-EV acceleration curve (high initial torque, relentless pull)
      // Ease-out cubic with electric torque kick
      const currentSpd = Math.round((Math.pow(progress, 0.88) * targetSpeed) * 10) / 10;
      const currentSec = Math.round((elapsedMs / 1000) * 100) / 100;

      // Realistic EV G-Force profile (peaks at 1.48G within first 0.6s then smooths to 1.15G)
      let g = 0;
      if (progress < 0.28) {
        g = 0.8 + (progress / 0.28) * 0.68;
      } else {
        g = 1.48 - (progress - 0.28) * 0.35;
      }
      g = Math.round(g * 100) / 100;

      const hp = Math.min(1150, Math.round(progress * 1150));

      setSpeed(currentSpd);
      setElapsedTime(currentSec);
      setCurrentGForce(g);
      setPowerOutput(hp);

      if (history.length === 0 || elapsedMs - history[history.length - 1].time * 1000 >= 80) {
        history.push({ time: currentSec, speed: currentSpd, g });
      }

      if (progress < 1) {
        launchAnimRef.current = requestAnimationFrame(animateRun);
      } else {
        // FINISHED!
        setSpeed(60);
        setElapsedTime(2.12);
        setCurrentGForce(1.48);
        setPeakGForce(1.48);
        setPowerOutput(1150);
        setTelemetryHistory(history);
        setStage("completed");
        soundEngine.triggerLaunchSuccess();
      }
    };

    launchAnimRef.current = requestAnimationFrame(animateRun);
  };

  const resetSimulator = () => {
    soundEngine.playChime(650);
    soundEngine.stopLaunchSpool();
    if (launchAnimRef.current) cancelAnimationFrame(launchAnimRef.current);
    if (spoolIntervalRef.current) clearInterval(spoolIntervalRef.current);
    setStage("idle");
    setSpoolProgress(0);
    setSpeed(0);
    setElapsedTime(0);
    setCurrentGForce(0);
    setPowerOutput(0);
  };

  const handleClose = () => {
    soundEngine.playChime(450);
    soundEngine.stopLaunchSpool();
    if (launchAnimRef.current) cancelAnimationFrame(launchAnimRef.current);
    if (spoolIntervalRef.current) clearInterval(spoolIntervalRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Background Starfield Warp Tunnel Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-70"
      />

      {/* Outer Cockpit Container */}
      <div
        className={`relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto bg-slate-950/90 border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-all duration-300 ${
          stage === "launching"
            ? "border-cyan-400 shadow-[0_0_90px_rgba(0,240,255,0.45)] scale-[1.01]"
            : stage === "spooling" && spoolProgress >= 90
            ? "border-amber-400 shadow-[0_0_90px_rgba(245,158,11,0.5)] animate-pulse"
            : "border-cyan-500/30"
        }`}
      >
        {/* Top Cockpit Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            {/* BMW M Tri-color Stripe */}
            <div className="flex items-center h-4 w-7 rounded overflow-hidden">
              <span className="w-1/3 h-full bg-[#0066b1]" />
              <span className="w-1/3 h-full bg-[#002663]" />
              <span className="w-1/3 h-full bg-[#e31b23]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl tracking-tight text-white uppercase">
                  BMW M Launch Control
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/30 font-bold uppercase">
                  0–60 MPH Track Lab
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Dual High-Torque M Inverters • 800V Solid-State Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              title="Close Simulator (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Telemetry Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Dual M Motors</span>
            <span className="text-cyan-300 font-bold text-sm">
              {stage === "launching" ? "100% FULL TORQUE" : "PRE-STAGED"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Inverter Boost</span>
            <span
              className={`font-bold text-sm ${
                spoolProgress >= 90 ? "text-amber-400" : "text-cyan-400"
              }`}
            >
              {spoolProgress}% BOOST
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">G-Force (Longitudinal)</span>
            <span className="text-purple-400 font-bold text-sm">
              {stage === "completed" ? `${peakGForce} G PEAK` : `${currentGForce.toFixed(2)} G`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Track Condition</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DRY ASPHALT
            </span>
          </div>
        </div>

        {/* MAIN COCKPIT VIEWPORT (Speedometer & G-Meter) */}
        <div className="relative py-6 flex flex-col items-center justify-center min-h-[290px] rounded-2xl bg-gradient-to-b from-black/60 via-slate-950/80 to-black/80 border border-cyan-500/20 overflow-hidden">
          {/* Radial Grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0,transparent_70%)] pointer-events-none" />

          {/* 1. SPEEDOMETER HEADS-UP DISPLAY */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Speed Digits */}
            <div className="flex items-baseline gap-2">
              <span
                className={`text-6xl sm:text-8xl font-display font-black tracking-tighter leading-none transition-colors ${
                  stage === "launching"
                    ? "text-cyan-300 drop-shadow-[0_0_35px_rgba(0,240,255,0.8)]"
                    : stage === "completed"
                    ? "text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.8)]"
                    : "text-white"
                }`}
              >
                {speed.toFixed(1)}
              </span>
              <span className="text-lg sm:text-xl font-mono text-cyan-400 font-bold uppercase">
                MPH
              </span>
            </div>

            {/* Metric Equivalent */}
            <div className="text-xs font-mono text-slate-400 -mt-1">
              {Math.round(speed * 1.60934)} KM/H • {powerOutput} HP PEAK
            </div>

            {/* Stopwatch Elapsed Time Display */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-black/80 border border-cyan-400/40 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-400 uppercase">
                0–60 Stopwatch:
              </span>
              <span className="text-sm font-mono font-bold text-cyan-300">
                {elapsedTime.toFixed(2)}s
              </span>
            </div>
          </div>

          {/* 2. SPOOLING PROGRESS INDICATOR (When building boost) */}
          {stage === "spooling" && (
            <div className="w-full max-w-md px-6 mt-6 flex flex-col items-center animate-in fade-in">
              <div className="w-full flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  SPOOLING M HYPER-TURBINE...
                </span>
                <span className="text-amber-400 font-bold">{spoolProgress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    spoolProgress >= 90
                      ? "bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
                      : "bg-gradient-to-r from-cyan-400 to-blue-500"
                  }`}
                  style={{ width: `${spoolProgress}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] font-mono text-center font-bold tracking-wider">
                {spoolProgress >= 90 ? (
                  <span className="text-amber-300 animate-bounce block">
                    ⚡ 100% BOOST LOCKED! RELEASE PEDAL TO LAUNCH! ⚡
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Keep holding pedal until boost reaches 100%...
                  </span>
                )}
              </p>
            </div>
          )}

          {/* 3. VICTORY RESULTS BANNER (When completed) */}
          {stage === "completed" && (
            <div className="w-full max-w-lg px-4 mt-6 flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold mb-3">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL 0–60 RUN CERTIFIED</span>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full text-center">
                <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/30">
                  <div className="text-[10px] font-mono text-slate-400">0–60 Time</div>
                  <div className="text-lg font-display font-black text-emerald-400">2.12s</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-purple-500/30">
                  <div className="text-[10px] font-mono text-slate-400">Peak G-Force</div>
                  <div className="text-lg font-display font-black text-purple-400">1.48 G</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/30">
                  <div className="text-[10px] font-mono text-slate-400">1/4 Mile Est.</div>
                  <div className="text-lg font-display font-black text-cyan-400">8.89s</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION & PEDAL CONTROLLER */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
            <div>
              <span className="text-cyan-400 font-semibold">Desktop:</span> Press & Hold{" "}
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] border border-white/20">
                SPACEBAR
              </kbd>
            </div>
            <div>
              <span className="text-cyan-400 font-semibold">Touch / Mouse:</span> Press & Hold the
              Launch Pedal below
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {stage === "completed" ? (
              <button
                onClick={resetSimulator}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-cyan to-blue-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-black" />
                <span>Launch Again</span>
              </button>
            ) : (
              /* THE INTERACTIVE TACTILE LAUNCH PEDAL */
              <button
                onMouseDown={startSpool}
                onMouseUp={releasePedal}
                onTouchStart={startSpool}
                onTouchEnd={releasePedal}
                disabled={stage === "launching"}
                className={`w-full sm:w-72 relative py-4 px-6 rounded-2xl border-2 font-display font-extrabold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  stage === "spooling" && spoolProgress >= 90
                    ? "bg-gradient-to-r from-amber-500 to-red-600 border-amber-300 text-white shadow-[0_0_40px_rgba(245,158,11,0.8)] scale-105 animate-pulse"
                    : stage === "spooling"
                    ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(0,240,255,0.5)] scale-100"
                    : "bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400 text-white hover:text-cyan-300 hover:shadow-glow-cyan"
                }`}
              >
                <Flame
                  className={`w-5 h-5 ${
                    spoolProgress >= 90 ? "text-amber-200 animate-bounce" : "text-cyan-400"
                  }`}
                />
                <span>
                  {stage === "spooling" && spoolProgress >= 90
                    ? "RELEASE TO LAUNCH!"
                    : stage === "spooling"
                    ? `HOLD TO SPOOL (${spoolProgress}%)`
                    : "HOLD PEDAL TO LAUNCH"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
