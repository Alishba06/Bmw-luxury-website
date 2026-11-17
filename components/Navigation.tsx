"use client";

import React, { useState } from "react";
import Link from "next/link";
import { soundEngine } from "./SoundEngine";
import { Volume2, VolumeX, ArrowRight, Bot, Music, Menu, X } from "lucide-react";

interface NavigationProps {
  viewMode?: "render" | "3d";
  onToggleViewMode?: (mode: "render" | "3d") => void;
  onOpenBuildModal: () => void;
  onSelectNav: (section: string) => void;
  onOpenAI?: () => void;
  onOpenSoundStudio?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenBuildModal,
  onSelectNav,
  onOpenAI,
  onOpenSoundStudio,
}) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const active = soundEngine.toggleMute();
    setIsAudioOn(active);
  };

  const navItems = [
    { label: "Overview", id: "overview" },
    { label: "Cinema", id: "videos" },
    { label: "Portal 360°", id: "mirror-portal" },
    { label: "Technology", id: "technology" },
    { label: "VIP Drive", id: "test-drive" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-2xl px-3.5 sm:px-6 py-2 sm:py-3 border border-cyan-500/25 shadow-2xl">

        {/* Brand Logo & Identification */}
        <div
          onClick={() => {
            soundEngine.playChime(640);
            onSelectNav("overview");
          }}
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0"
        >
          {/* Glowing BMW Roundel */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-cyan-400/50 shadow-glow-cyan flex items-center justify-center p-0.5 bg-black/60 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="#02040a" stroke="#00f0ff" strokeWidth="3" />
              <path d="M50 2 A48 48 0 0 1 98 50 L50 50 Z" fill="#0066ff" />
              <path d="M50 50 L98 50 A48 48 0 0 1 50 98 Z" fill="#ffffff" />
              <path d="M50 50 L50 98 A48 48 0 0 1 2 50 Z" fill="#0066ff" />
              <path d="M50 2 L50 50 L2 50 A48 48 0 0 1 50 2 Z" fill="#ffffff" />
              <circle cx="50" cy="50" r="15" fill="#02040a" stroke="#00f0ff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-display font-extrabold tracking-widest text-sm sm:text-lg bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent leading-tight">
              BMW NEXUS
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.22em] text-cyan-400 font-medium uppercase hidden xs:block">
              Intelligent Mobility
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playChime(700);
                onSelectNav(item.id);
              }}
              className="px-3.5 py-1.5 text-xs tracking-wider transition-all duration-200 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-white/5 font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Audio Toggle, Nexus AI, Build CTA & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Nexus AI Assistant Button (Visible on Tablet & Desktop) */}
          {onOpenAI && (
            <button
              onClick={() => {
                soundEngine.playChime(820);
                onOpenAI();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-950/60 to-purple-950/60 hover:from-cyan-900/60 hover:to-purple-900/60 text-cyan-300 hover:text-white text-xs font-semibold shadow-glow-cyan transition-all duration-300"
              title="Launch Nexus AI Co-Pilot"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="tracking-wide">Nexus AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </button>
          )}

          {/* Hans Zimmer Sound Studio in Header (Desktop only) */}
          {onOpenSoundStudio && (
            <button
              onClick={() => {
                soundEngine.playChime(760);
                onOpenSoundStudio();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-400/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 hover:text-white text-xs font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              title="Open Hans Zimmer IconicSounds Audio Studio"
            >
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <span>Acoustics</span>
            </button>
          )}

          {/* Cockpit Audio Toggle (Compact icon on mobile) */}
          <button
            onClick={handleAudioToggle}
            title="Toggle Cockpit Audio Engine"
            className={`flex items-center justify-center gap-1.5 h-8 sm:h-auto px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border transition-all duration-300 text-xs font-medium ${isAudioOn
                ? "border-cyan-400 text-cyan-300 bg-cyan-950/40 shadow-glow-cyan"
                : "border-white/10 text-slate-400 bg-white/5 hover:bg-white/10"
              }`}
          >
            {isAudioOn ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-[10px] tracking-wider uppercase font-semibold hidden md:inline">
              {isAudioOn ? "Audio On" : "Muted"}
            </span>
          </button>

          {/* Build Yours Button (Hidden on tiny screens to avoid wrapping, accessible via mobile drawer) */}
          <button
            onClick={() => {
              soundEngine.playChime(800);
              onOpenBuildModal();
            }}
            className="hidden sm:inline-flex relative group overflow-hidden px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-brand-blue via-cyan-500 to-brand-blue text-white font-semibold text-xs tracking-wider uppercase shadow-glow-cyan hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Build</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all" />
          </button>

          {/* Mobile Hamburger Toggle Button (Always visible on mobile & tablet) */}
          <button
            onClick={() => {
              soundEngine.playChime(isMobileMenuOpen ? 480 : 720);
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-400/40 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-glow-cyan"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />}
          </button>

        </div>

      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-top-3 duration-300 backdrop-blur-2xl">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playChime(700);
                  setIsMobileMenuOpen(false);
                  onSelectNav(item.id);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium tracking-wide text-slate-200 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/20 transition-all flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400/60" />
              </button>
            ))}

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  soundEngine.playChime(800);
                  setIsMobileMenuOpen(false);
                  onOpenBuildModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-blue via-cyan-500 to-brand-blue text-white font-bold text-xs uppercase tracking-wider shadow-glow-cyan flex items-center justify-center gap-2"
              >
                <span>Build & Commission Yours</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                {onOpenAI && (
                  <button
                    onClick={() => {
                      soundEngine.playChime(820);
                      setIsMobileMenuOpen(false);
                      onOpenAI();
                    }}
                    className="py-2.5 px-3 rounded-xl border border-cyan-400/50 bg-cyan-950/60 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-glow-cyan"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nexus AI</span>
                  </button>
                )}

                {onOpenSoundStudio && (
                  <button
                    onClick={() => {
                      soundEngine.playChime(760);
                      setIsMobileMenuOpen(false);
                      onOpenSoundStudio();
                    }}
                    className="py-2.5 px-3 rounded-xl border border-purple-400/40 bg-purple-950/50 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  >
                    <Music className="w-3.5 h-3.5 text-purple-400" />
                    <span>Acoustics</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
