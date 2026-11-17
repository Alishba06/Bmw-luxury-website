"use client";

import React, { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { 
  ArrowUp, 
  Send, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Award,
  Zap
} from "lucide-react";

export const LuxuryFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Global / English");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    soundEngine.playChime(900);
    setTimeout(() => soundEngine.playChime(1180), 140);
    setIsSubscribed(true);
  };

  const scrollToTop = () => {
    soundEngine.playLaserSweep();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sitemap = [
    {
      title: "MODELS & FLEET",
      links: [
        { label: "BMW Nexus Hyper-EV", href: "#hero" },
        { label: "BMW 1 Series M135i", href: "#test-drive" },
        { label: "BMW i7 M70 Flagship", href: "#test-drive" },
        { label: "BMW XM Label Red", href: "#test-drive" },
        { label: "BMW M8 Competition", href: "#test-drive" },
        { label: "BMW Concept Skytop", href: "#hero" },
      ],
    },
    {
      title: "INNOVATION & TECH",
      links: [
        { label: "800V Solid-State Platform", href: "#technology" },
        { label: "Level 4 Neural Co-Pilot", href: "#technology" },
        { label: "Hans Zimmer Sound Profiles", href: "#hero" },
        { label: "Electrochromic Sky Lounge", href: "#hero" },
        { label: "Adaptive Aerodynamics", href: "#technology" },
        { label: "Cinematic Motion Film", href: "#cinematic-reel" },
      ],
    },
    {
      title: "EXCLUSIVE SERVICES",
      links: [
        { label: "Reserve VIP Test Drive", href: "#test-drive" },
        { label: "BMW Individual Atelier", href: "#hero" },
        { label: "M Driving Experience Academy", href: "#test-drive" },
        { label: "ConnectedDrive Upgrades", href: "#technology" },
        { label: "24/7 Global Private Concierge", href: "#test-drive" },
        { label: "Diplomatic & Armoured Sales", href: "#test-drive" },
      ],
    },
    {
      title: "HERITAGE & FUTURE",
      links: [
        { label: "Bayerische Motoren Werke 1916", href: "#" },
        { label: "Circular Economy RE:BMW", href: "#" },
        { label: "BMW iFACTORY Zero Carbon", href: "#" },
        { label: "BMW Art Cars Collection", href: "#" },
        { label: "BMW Group Investor Relations", href: "#" },
        { label: "BMW Museum Munich", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-[#030508] text-white pt-20 pb-12 border-t border-slate-800/80 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-brand-blue/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">

        {/* 1. TOP NEWSLETTER & VIP INVITATIONS ATELIER */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXCLUSIVE ACCESS • BMW INNER CIRCLE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                RECEIVE PRIVATE ALLOCATIONS & PREVIEWS
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
                Subscribe to confidential dispatches covering limited concept hypercars, 
                private racetrack events at the Nürburgring, and bespoke BMW Individual unveilings.
              </p>
            </div>

            <div className="lg:col-span-5">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your executive email..."
                      className="w-full px-4 py-3.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none pr-32"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Join</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Encrypted submission. Zero spam policy.</span>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Privileged Invitation Dispatched</div>
                    <div className="text-[10px] text-emerald-300 font-mono">
                      Check your inbox shortly for your exclusive BMW Inner Circle welcome key.
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 2. SITEMAP NAVIGATION COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border-2 border-white/80 p-0.5 flex items-center justify-center bg-black shadow-glow-cyan">
                <div className="w-full h-full rounded-full grid grid-cols-2 grid-rows-2 overflow-hidden border border-white/30">
                  <div className="bg-white" />
                  <div className="bg-blue-600" />
                  <div className="bg-blue-600" />
                  <div className="bg-white" />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-wider text-white">BMW</span>
                <span className="text-[9px] font-mono text-cyan-400 block tracking-widest -mt-1">GROUP</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Bayerische Motoren Werke AG. Defining high performance, peerless luxury, and sustainable electromobility since 1916.
            </p>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-cyan-300 text-xs font-semibold hover:border-cyan-400 hover:text-white transition-all cursor-pointer group"
              >
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

          {/* Links Columns */}
          {sitemap.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      onClick={() => soundEngine.playChime(600 + lIdx * 25)}
                      className="text-slate-400 hover:text-cyan-300 transition-colors inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* 3. REGIONAL SELECTOR & ACCREDITATIONS BAR */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedRegion}
                onChange={(e) => {
                  soundEngine.playChime(650);
                  setSelectedRegion(e.target.value);
                }}
                aria-label="Select Region"
                className="bg-black/60 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="Global / English">Global (English)</option>
                <option value="Deutschland / Deutsch">Deutschland (Deutsch)</option>
                <option value="United States / English">United States (English)</option>
                <option value="United Arab Emirates / Arabic">UAE / دبي (العربية)</option>
                <option value="Pakistan / English & Urdu">Pakistan (English / اردو)</option>
                <option value="Japan / Japanese">日本 (日本語)</option>
              </select>
            </div>
            <span>•</span>
            <span>Munich HQ • Petuelring 130</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Legal Notice</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookies Settings</span>
            <span className="hover:text-slate-300 cursor-pointer">WLTP Electric Consumption</span>
          </div>

        </div>

        {/* 4. FINAL COPYRIGHT & MOTTO */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 font-mono">
          <div>
            © 2027 Bayerische Motoren Werke AG (BMW AG), Munich, Germany. All rights reserved.
          </div>
          <div className="text-slate-400 italic">
            “The Ultimate Driving Machine • Freude am Fahren”
          </div>
        </div>

      </div>

    </footer>
  );
};
