"use client";

import React, { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { Eye, ShieldCheck, Music2, Navigation2, SunMedium } from "lucide-react";

interface BottomFeatureDockProps {
  onOpenFeatureModal: (featureKey: string) => void;
  onOpenCockpit?: () => void;
}

export const BottomFeatureDock: React.FC<BottomFeatureDockProps> = ({
  onOpenFeatureModal,
  onOpenCockpit,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      key: "adaptive-led",
      title: "Adaptive LED",
      subtitle: "Laser Matrix Eye",
      icon: Eye,
      color: "cyan",
      borderColor: "border-cyan-400/30 group-hover:border-cyan-400 group-hover:shadow-glow-cyan",
      iconColor: "text-cyan-300",
      bgColor: "bg-cyan-500/10",
    },
    {
      key: "air-suspension",
      title: "Air Suspension",
      subtitle: "Active 2-Axle SkyRide",
      icon: Navigation2,
      color: "blue",
      borderColor: "border-blue-400/30 group-hover:border-blue-400 group-hover:shadow-glow-blue",
      iconColor: "text-blue-300",
      bgColor: "bg-blue-500/10",
    },
    {
      key: "premium-sound",
      title: "Premium Sound",
      subtitle: "Bowers & Wilkins 4D",
      icon: Music2,
      color: "purple",
      borderColor: "border-purple-400/30 group-hover:border-purple-400 group-hover:shadow-glow-purple",
      iconColor: "text-purple-300",
      bgColor: "bg-purple-500/10",
    },
    {
      key: "driver-assistance",
      title: "Driver Assist",
      subtitle: "Nexus Auto-Pilot L4",
      icon: ShieldCheck,
      color: "emerald",
      borderColor: "border-emerald-400/30 group-hover:border-emerald-400",
      iconColor: "text-emerald-300",
      bgColor: "bg-emerald-500/10",
    },
    {
      key: "sky-lounge",
      title: "Sky Lounge",
      subtitle: "Electrochromic Roof",
      icon: SunMedium,
      color: "amber",
      borderColor: "border-amber-400/30 group-hover:border-amber-400",
      iconColor: "text-amber-300",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full px-4 sm:px-6 py-3.5 z-40 pointer-events-auto transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-28 opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-4xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-2.5 border border-cyan-500/25 shadow-2xl flex items-center justify-between gap-2 sm:gap-4">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.key}>
              <button
                onClick={() => {
                  soundEngine.playChime(620 + idx * 40);
                  if (item.key === "sky-lounge" && onOpenCockpit) {
                    onOpenCockpit();
                  } else {
                    onOpenFeatureModal(item.key);
                  }
                }}
                className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-xl hover:bg-white/5 transition-all group text-left cursor-pointer"
              >
                <div
                  className={`w-8 sm:w-9 h-8 sm:h-9 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-all`}
                >
                  <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                    {item.title}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono hidden md:block">
                    {item.subtitle}
                  </div>
                </div>
              </button>

              {idx < features.length - 1 && (
                <div className="w-px h-6 sm:h-8 bg-white/10 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </footer>
  );
};
