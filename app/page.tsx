"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Navigation } from "@/components/Navigation";
import { ConfiguratorSidebar, ConfigState } from "@/components/ConfiguratorSidebar";
import { BuildModal } from "@/components/BuildModal";
import { FeatureDetailModal } from "@/components/FeatureDetailModal";
import { NexusAICoPilot } from "@/components/NexusAICoPilot";
import { LaunchControlSimulator } from "@/components/LaunchControlSimulator";
import { HansZimmerSoundStudio } from "@/components/HansZimmerSoundStudio";
import { CockpitExplorer } from "@/components/CockpitExplorer";
import { CinematicVideoReel } from "@/components/CinematicVideoReel";
import { MirrorPortalShowcase } from "@/components/MirrorPortalShowcase";
import { TechnologyArchitectureSection } from "@/components/TechnologyArchitectureSection";
import { TestDriveBookingSection } from "@/components/TestDriveBookingSection";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { soundEngine } from "@/components/SoundEngine";
import { ArrowRight, Bot, Music } from "lucide-react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"render" | "3d">("render");
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [activeFeatureModal, setActiveFeatureModal] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isLaunchControlOpen, setIsLaunchControlOpen] = useState(false);
  const [isSoundStudioOpen, setIsSoundStudioOpen] = useState(false);
  const [isCockpitOpen, setIsCockpitOpen] = useState(false);

  const [config, setConfig] = useState<ConfigState>({
    colorKey: "black",
    colorName: "Frozen Carbon Black",
    colorHex: "#0a0a0d",
    wheelKey: "22-vspoke",
    wheelName: '22" Aero V-Spoke',
    interiorKey: "merino-black",
    interiorName: "Silverstone Merino Black",
    basePrice: 148500,
  });

  const handleColorChange = (key: string, name: string, hex: string) => {
    setConfig((prev) => ({
      ...prev,
      colorKey: key,
      colorName: name,
      colorHex: hex,
    }));
  };

  const handleWheelChange = (key: string, name: string) => {
    setConfig((prev) => ({
      ...prev,
      wheelKey: key,
      wheelName: name,
    }));
  };

  const handleInteriorChange = (key: string, name: string) => {
    setConfig((prev) => ({
      ...prev,
      interiorKey: key,
      interiorName: name,
    }));
  };

  const handleResetConfig = () => {
    setConfig({
      colorKey: "black",
      colorName: "Frozen Carbon Black",
      colorHex: "#0a0a0d",
      wheelKey: "22-vspoke",
      wheelName: '22" Aero V-Spoke',
      interiorKey: "merino-black",
      interiorName: "Silverstone Merino Black",
      basePrice: 148500,
    });
  };

  const handleNavSelect = (section: string) => {
    if (section === "design") setActiveFeatureModal("iconic-design");
    else if (section === "performance") setActiveFeatureModal("power-performance");
    else if (section === "technology") {
      const el = document.getElementById("technology");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else setActiveFeatureModal("smart-technology");
    }
    else if (section === "videos") {
      const el = document.getElementById("cinematic-reel");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    else if (section === "mirror-portal") {
      const el = document.getElementById("mirror-portal");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    else if (section === "test-drive") {
      const el = document.getElementById("test-drive");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    else if (section === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    else if (section === "colors") {
      soundEngine.playChime(600);
      // Highlight sidebar
    }
  };

  // Color reactive image filter for the photorealistic render mode
  const getImageFilter = () => {
    switch (config.colorKey) {
      case "blue":
        return "drop-shadow(0 20px 50px rgba(0,102,255,0.65)) hue-rotate(15deg) saturate(1.15)";
      case "cyan":
        return "drop-shadow(0 20px 50px rgba(0,240,255,0.65)) hue-rotate(-20deg) brightness(1.05)";
      case "purple":
        return "drop-shadow(0 20px 50px rgba(139,92,246,0.65)) hue-rotate(60deg) saturate(1.2)";
      case "white":
        return "drop-shadow(0 20px 50px rgba(255,255,255,0.45)) brightness(1.15) contrast(0.95)";
      default:
        return "drop-shadow(0 20px 50px rgba(0,102,255,0.35))";
    }
  };

  return (
    <div id="hero" className="relative min-h-screen w-full bg-brand-black overflow-x-hidden flex flex-col selection:bg-brand-cyan selection:text-black">

      {/* BACKGROUND NEON GLOWS & SCANLINES */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] bg-brand-blue/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[150px]" />
        <div className="absolute top-[25%] -right-[10%] w-[600px] h-[600px] bg-brand-cyan/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-[30%] w-[800px] h-[350px] bg-brand-blue/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 scanline opacity-25" />
      </div>

      {/* 1. TOP FLOATING NAVIGATION */}
      <Navigation
        onOpenBuildModal={() => setIsBuildModalOpen(true)}
        onSelectNav={handleNavSelect}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenSoundStudio={() => setIsSoundStudioOpen(true)}
      />

      {/* 2. MAIN HERO VIEWPORT */}
      <main className="relative w-full min-h-[100svh] sm:h-screen flex items-center justify-center overflow-hidden">

        {/* PHOTOREALISTIC CONCEPT RENDER */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Backdrop Horizon Lighting & City Skyline Silhouette */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-navy/60 to-transparent pointer-events-none" />

            {/* Mobile dark vignette to ensure text is 100% readable on phone screens */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent sm:hidden pointer-events-none" />

            {/* Central Hero Car Image */}
            <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] flex items-center justify-center overflow-hidden">
              <img
                src="/bmw_nexus_hero_mockup.jpg"
                alt="BMW NEXUS — Futuristic Metallic Black Concept Hypercar"
                style={{ filter: getImageFilter() }}
                className="w-full h-full object-cover object-center select-none transition-all duration-700 ease-out hover:scale-[1.01]"
              />

              {/* Wet Reflections Overlay */}
              <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-brand-black via-brand-black/85 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. HERO TYPOGRAPHY & BRAND TAGLINE (Left-Center) */}
        <div className="absolute left-3.5 right-3.5 sm:right-auto sm:left-6 md:left-14 top-20 sm:top-24 md:top-32 z-20 max-w-full sm:max-w-lg pointer-events-auto p-3.5 sm:p-0 rounded-2xl bg-black/50 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-cyan-500/25 sm:border-transparent shadow-2xl sm:shadow-none">

          {/* Futuristic HUD Micro Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/30 text-[9px] sm:text-[11px] font-mono text-cyan-400 mb-2 sm:mb-3 tracking-wider sm:tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse shrink-0" />
            <span className="truncate">SERIES NEXUS 2027 • THE HYPER-EV CONCEPT</span>
          </div>

          {/* Large Headings */}
          <h1 className="text-3xl sm:text-5xl xl:text-7xl font-display font-black tracking-tight leading-none text-white drop-shadow-2xl">
            BMW <span className="bg-gradient-to-r from-brand-cyan via-white to-brand-purple bg-clip-text text-transparent">NEXUS</span>
          </h1>

          <p className="text-sm sm:text-xl font-display font-medium text-cyan-300 tracking-wide mt-1 sm:mt-2">
            Luxury Meets Intelligence
          </p>

          <p className="text-xs sm:text-base font-light text-slate-300 tracking-wider italic mt-0.5 sm:mt-1 drop-shadow">
            “More than a car. It&apos;s a feeling.”
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-3 sm:mt-5">
            <button
              onClick={() => {
                soundEngine.playChime(750);
                setActiveFeatureModal("nexus-overview");
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan via-cyan-400 to-blue-600 text-black font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <span>Experience Nexus</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
            </button>

            <button
              onClick={() => {
                soundEngine.playChime(820);
                setIsAIOpen(true);
              }}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-900/50 via-cyan-950/60 to-blue-900/50 border border-cyan-400/60 text-cyan-300 hover:text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:border-cyan-400 shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-ping" />
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
              <span>Ask Nexus AI</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playChime(760);
                setIsSoundStudioOpen(true);
              }}
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl glass-panel border border-purple-400/50 text-purple-300 hover:text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              title="Explore Hans Zimmer IconicSounds Electric Audio Profiles"
            >
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <span>Acoustics</span>
            </button>
          </div>

        </div>

        {/* 3. RIGHT SIDEBAR CONFIGURATOR (Choose Your Style) */}
        <ConfiguratorSidebar
          config={config}
          onChangeColor={handleColorChange}
          onChangeWheel={handleWheelChange}
          onChangeInterior={handleInteriorChange}
          onReset={handleResetConfig}
          onOpenBuildModal={() => setIsBuildModalOpen(true)}
        />

      </main>

      {/* 4. CINEMATIC 4K VIDEO REEL SHOWCASE (Using all 4 public/videos) */}
      <CinematicVideoReel />

      {/* 5. THE GIANT CIRCULAR MIRROR PORTAL & 360° DIMENSIONAL SHOWCASE */}
      <MirrorPortalShowcase />

      {/* 6. 800V SOLID-STATE ARCHITECTURE & SENSORY MATRIX */}
      <TechnologyArchitectureSection />

      {/* 6. VIP TEST DRIVE & COMMISSIONING RESERVATION */}
      <TestDriveBookingSection preselectedModel="BMW Nexus Hyper-EV Concept" />

      {/* 7. LUXURY GLOBAL SITEMAP & FOOTER */}
      <LuxuryFooter />

      {/* 7. CONFIGURATOR & ORDER MODAL */}
      <BuildModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        config={config}
      />

      {/* 8. FEATURE DETAIL MODAL */}
      <FeatureDetailModal
        featureKey={activeFeatureModal}
        onClose={() => setActiveFeatureModal(null)}
      />

      {/* 9. BMW NEXUS AI CO-PILOT (Interactive Holographic Voice & Chat Agent) */}
      <NexusAICoPilot
        isOpen={isAIOpen}
        onToggle={(open) => setIsAIOpen(open)}
        onColorChange={handleColorChange}
        onViewModeChange={(mode) => setViewMode(mode)}
        onOpenBuildModal={() => setIsBuildModalOpen(true)}
        onOpenFeatureModal={(key) => setActiveFeatureModal(key)}
        onOpenLaunchControl={() => setIsLaunchControlOpen(true)}
        onOpenSoundStudio={() => setIsSoundStudioOpen(true)}
        onOpenCockpit={() => setIsCockpitOpen(true)}
      />

      {/* 10. STEP 2: INTERACTIVE 0–60 MPH LAUNCH CONTROL SIMULATOR */}
      <LaunchControlSimulator
        isOpen={isLaunchControlOpen}
        onClose={() => setIsLaunchControlOpen(false)}
      />

      {/* 11. STEP 5: HANS ZIMMER ICONICSOUNDS ELECTRIC STUDIO */}
      <HansZimmerSoundStudio
        isOpen={isSoundStudioOpen}
        onClose={() => setIsSoundStudioOpen(false)}
      />

      {/* 12. STEP 4: 360° INTERIOR COCKPIT & SKY LOUNGE EXPLORER */}
      <CockpitExplorer
        isOpen={isCockpitOpen}
        onClose={() => setIsCockpitOpen(false)}
      />

    </div>
  );
}
