"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "./SoundEngine";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Bot,
  Zap,
  Activity,
  ChevronUp,
  Cpu,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  actionTaken?: string;
}

interface NexusAICoPilotProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onColorChange: (key: string, name: string, hex: string) => void;
  onViewModeChange: (mode: "render" | "3d") => void;
  onOpenBuildModal: () => void;
  onOpenFeatureModal: (key: string) => void;
  onOpenLaunchControl?: () => void;
  onOpenSoundStudio?: () => void;
  onOpenCockpit?: () => void;
}

export const NexusAICoPilot: React.FC<NexusAICoPilotProps> = ({
  isOpen,
  onToggle,
  onColorChange,
  onViewModeChange,
  onOpenBuildModal,
  onOpenFeatureModal,
  onOpenLaunchControl,
  onOpenSoundStudio,
  onOpenCockpit,
}) => {
  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Greetings. I am Nexus Neural Intelligence — your autonomous vehicle co-pilot. I can adjust vehicle dynamics, paint finishes, telemetry, and launch systems. How may I assist you?",
      timestamp: "Now",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Speech Synthesis (AI Voice)
  const speakText = (text: string) => {
    if (isVoiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Natural") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.lang.startsWith("en")
      );
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Voice Recognition (Speech to Text)
  const toggleVoiceInput = () => {
    soundEngine.playChime(680);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Voice recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleProcessQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Intelligent Natural Language Command Processor
  const handleProcessQuery = (queryText: string) => {
    const q = queryText.trim().toLowerCase();
    if (!q) return;

    soundEngine.playChime(720);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    let reply = "";
    let action = "";

    // Color Finishes
    if (q.includes("cyan") || q.includes("blue neon")) {
      onColorChange("cyan", "Cyber Cyan Metallic", "#00f0ff");
      reply = "Exterior finish recalibrated to Cyber Cyan Metallic with active specular neon highlight.";
      action = "Finish: Cyber Cyan Metallic";
      soundEngine.playLaserSweep();
    } else if (q.includes("purple") || q.includes("violet")) {
      onColorChange("purple", "Velvet Purple Neon", "#8b5cf6");
      reply = "Applying Velvet Purple Neon finish. Ambient cockpit fiber optics synchronized.";
      action = "Finish: Velvet Purple Neon";
      soundEngine.playLaserSweep();
    } else if (q.includes("black") || q.includes("carbon")) {
      onColorChange("black", "Frozen Carbon Black", "#0a0a0d");
      reply = "Vehicle finish reverted to stealth Frozen Carbon Black with dual ceramic coating.";
      action = "Finish: Frozen Carbon Black";
      soundEngine.playLaserSweep();
    } else if (q.includes("blue") || q.includes("tanzanite")) {
      onColorChange("blue", "M Tanzanite Electric Blue", "#0044aa");
      reply = "Engaging M Tanzanite Electric Blue. M Performance signature tone active.";
      action = "Finish: Tanzanite Blue";
      soundEngine.playLaserSweep();
    } else if (q.includes("white") || q.includes("alpine")) {
      onColorChange("white", "Frozen Pure Alpine", "#f8fafc");
      reply = "Switching to Frozen Pure Alpine with matte pearl finish.";
      action = "Finish: Pure Alpine";
      soundEngine.playLaserSweep();
    }
    // Launch Control Simulator
    else if (q.includes("launch") || q.includes("simulator") || q.includes("accelerat") || q.includes("drag")) {
      if (onOpenLaunchControl) {
        onOpenLaunchControl();
        reply = "Initiating BMW M Launch Control sequence. Hold the pedal or spacebar to spool dual inverters to 100% boost, then release to launch!";
        action = "Simulator: M Launch Control 0-60";
      } else {
        reply = "BMW NEXUS achieves 0 to 60 mph in 2.12 seconds with dual permanent-magnet M motors.";
        action = "Telemetry: 2.12s 0-60 MPH";
      }
    }
    // Track Mode
    else if (q.includes("track mode") || q.includes("sport") || q.includes("hyper")) {
      onColorChange("purple", "Velvet Purple Neon", "#8b5cf6");
      reply = "Track Mode Engaged! Dampers stiffened, active kidney grille aero shutters open, and M dual-motor torque vectoring unlocked to maximum 1,020 horsepower.";
      action = "Mode: Track Performance Unlocked";
      soundEngine.playLaserSweep();
    }
    // Speed & Performance Query
    else if (q.includes("speed") || q.includes("fast") || q.includes("0-60") || q.includes("horsepower") || q.includes("hp")) {
      reply = "BMW NEXUS generates 1,020 HP with 1,150 lb-ft of torque. It catapults from 0 to 60 mph in 2.1 seconds, with an electronically regulated top speed of 210 mph.";
      action = "Telemetry: 1,020 HP | 2.1s 0-60";
    }
    // Battery & Range Query
    else if (q.includes("battery") || q.includes("range") || q.includes("charge") || q.includes("miles")) {
      reply = "Equipped with a 135 kWh solid-state electrolyte battery delivering 620 miles EPA range. The 800V fast-charge architecture replenishes 10% to 80% capacity in only 12 minutes.";
      action = "Energy: 620 Miles | 800V Solid-State";
    }
    // 3D & 360 View
    else if (q.includes("3d") || q.includes("360") || q.includes("rotate") || q.includes("orbit")) {
      onViewModeChange("3d");
      reply = "Initializing Three.js 3D WebGL Orbit Studio. You can now drag with mouse or touch to inspect the vehicle from any angle.";
      action = "View: Interactive 3D WebGL";
    } else if (q.includes("concept") || q.includes("photo") || q.includes("render")) {
      onViewModeChange("render");
      reply = "Returning to high-resolution cinematic concept photograph view.";
      action = "View: Concept Render";
    }
    // Build & Order
    else if (q.includes("build") || q.includes("order") || q.includes("price") || q.includes("buy") || q.includes("reserve")) {
      onOpenBuildModal();
      reply = "Opening your personal vehicle configuration summary and pre-order reservation console.";
      action = "Modal: Build Your BMW";
    }
    // Design & Aero
    else if (q.includes("design") || q.includes("grille") || q.includes("aerodynamic") || q.includes("cd")) {
      reply = "The streamliner form achieves a drag coefficient of 0.198 Cd. The illuminated kidney grille dynamically modulates cooling airflow with integrated biometric radar sensors.";
      action = "Aerodynamics: 0.198 Cd Streamliner";
    }
    // Cockpit & Interior / Sky Lounge
    else if (q.includes("cockpit") || q.includes("interior") || q.includes("inside") || q.includes("sky lounge") || q.includes("stars")) {
      if (onOpenCockpit) {
        onOpenCockpit();
        reply = "Entering the BMW NEXUS intelligent cockpit. Explore the curved panoramic OLED display, steer with the yoke wheel, and dim the 15,000-star Sky Lounge roof!";
        action = "Cockpit: 360° Interior & Sky Lounge";
      } else {
        reply = "The interior features an electrochromic Sky Lounge with 15,000 fiber-optic stars and curved OLED displays.";
        action = "Interior: Sky Lounge & Curved OLED";
      }
    }
    // Sound / Audio / Hans Zimmer
    else if (q.includes("sound") || q.includes("audio") || q.includes("music") || q.includes("zimmer") || q.includes("acoustic")) {
      if (onOpenSoundStudio) {
        onOpenSoundStudio();
        reply = "Accessing the BMW IconicSounds Electric sound studio curated by Hans Zimmer. Select Whisper Comfort, Hyper-EV Sport, or M Track Warp!";
        action = "Studio: Hans Zimmer IconicSounds";
      } else {
        reply = "Acoustics are powered by Bowers & Wilkins 4D Diamond Audio and Hans Zimmer IconicSounds Electric synthesizers.";
        action = "Acoustics: Hans Zimmer & Bowers & Wilkins 4D";
      }
    }
    else {
      reply = `Understood. Analyzing query "${queryText}". All telemetry sensors report optimal status. You can ask me to change vehicle paint, engage track mode, query 0-60 performance, or switch to 3D orbit view.`;
    }

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionTaken: action,
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(reply);
    }, 450);
  };

  const quickPrompts = [
    "💺 Enter 360° Cockpit",
    "⚡ Launch Control (0–60 in 2.1s)",
    "🎵 Hans Zimmer Sound Studio",
    "Change color to Cyber Cyan",
    "Engage track mode",
    "What is the top speed and range?",
    "Switch to 3D Orbit view",
    "Build & price this BMW",
  ];

  return (
    <>
      {/* 1. FLOATING HOLOGRAPHIC AI ORB (Pulsing trigger in bottom corner with z-[999]) */}
      <div className="fixed bottom-6 right-6 z-[999]">
        {!isOpen && (
          <button
            onClick={() => {
              soundEngine.playChime(800);
              onToggle(true);
              speakText("Nexus AI online. How may I assist your drive?");
            }}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-slate-950/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-2xl cursor-pointer"
            title="Open BMW Nexus AI Co-Pilot"
          >
            {/* Glowing Holographic Core Orb */}
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-0.5 animate-pulse shadow-glow-cyan flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black/85 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300 group-hover:rotate-45 transition-transform" />
              </div>
              <span className="absolute -inset-1 rounded-full bg-cyan-400/40 blur-sm animate-ping pointer-events-none" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                BMW NEXUS AI
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Co-Pilot Online</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </button>
        )}
      </div>

      {/* 2. EXPANDED CONVERSATIONAL HUD WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[999] w-[94vw] sm:w-[420px] max-h-[82vh] h-[580px] bg-[#020514]/98 backdrop-blur-3xl border-2 border-cyan-400/70 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Top Header */}
          <div className="p-4 border-b border-cyan-500/25 bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-purple-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-glow-cyan">
                <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-sm text-white">
                    BMW NEXUS AI
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    Neural v4.2
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive Co-Pilot • Voice & Command Core</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mute Voice Toggle */}
              <button
                onClick={() => {
                  soundEngine.playChime(500);
                  setIsVoiceMuted(!isVoiceMuted);
                }}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title={isVoiceMuted ? "Unmute AI Voice" : "Mute AI Voice"}
              >
                {isVoiceMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playChime(420);
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  onToggle(false);
                }}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Minimize AI Co-Pilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Voice Animated Waveform Banner (Active when AI speaks) */}
          {isSpeaking && (
            <div className="px-4 py-1.5 bg-cyan-950/60 border-b border-cyan-400/30 flex items-center justify-between animate-in fade-in duration-200">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Nexus Vocal Engine Active
              </span>
              <div className="flex items-center gap-1">
                {[4, 12, 8, 16, 6, 14, 10, 18, 5, 12].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDuration: `${0.3 + (i % 4) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-glow-cyan"
                      : "bg-[#0b132b]/85 border border-cyan-500/25 text-slate-200"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.actionTaken && (
                    <div className="mt-2 pt-2 border-t border-cyan-500/20 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>{m.actionTaken}</span>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Command Suggestions */}
          <div className="px-3 py-2 border-t border-white/5 bg-black/40 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleProcessQuery(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-[10px] text-slate-300 hover:text-cyan-300 font-mono transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Console Bar */}
          <div className="p-3 bg-black/60 border-t border-cyan-500/25">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessQuery(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                    : "bg-white/5 border-white/15 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300"
                }`}
                title={isListening ? "Listening... click to stop" : "Speak to Nexus AI"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Mic className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : "Command Nexus (e.g. 'Turn car purple', 'Top speed')..."
                }
                className="flex-1 bg-slate-900/80 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 disabled:opacity-40 text-black font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow-cyan"
                title="Send Command"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
