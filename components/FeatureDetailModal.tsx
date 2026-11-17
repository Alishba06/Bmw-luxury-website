"use client";

import React from "react";
import { soundEngine } from "./SoundEngine";
import { X, Check } from "lucide-react";

interface FeatureDetailModalProps {
  featureKey: string | null;
  onClose: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  featureKey,
  onClose,
}) => {
  if (!featureKey) return null;

  const featureDatabase: Record<
    string,
    { title: string; badge: string; description: string; specs: string[] }
  > = {
    "iconic-design": {
      title: "Iconic Design & Aerodynamics",
      badge: "01 / EXTERIOR FORM",
      description:
        "The BMW NEXUS redefines automotive sculpture. Featuring an active kinetic illuminated kidney grille that adapts its intake channels based on dynamic airflow requirements and thermal management. The ultra-slim laser matrix headlights project digital driving paths onto the roadway, while the fluid streamliner silhouette achieves a drag coefficient of just 0.198 Cd.",
      specs: [
        "Active Aero Front Shutter",
        "Laser Headlights with 600m Beam",
        "Flush Kinetic Retracting Handles",
        "Carbon Fiber Composite Monocoque",
      ],
    },
    "power-performance": {
      title: "M Powertrain & Telemetry",
      badge: "02 / ELECTRIC PERFORMANCE",
      description:
        "Engineered by BMW M Motorsport. Dual high-flux permanent magnet synchronous motors deliver an astounding 1,020 horsepower and instant 1,150 lb-ft of torque. Precision torque vectoring distributes power to all four wheels within milliseconds, propelling you from 0 to 60 mph in 2.1 seconds.",
      specs: [
        "1,020 Total System Horsepower",
        "0-60 mph in 2.1 seconds",
        "Top Track Speed: 210 mph",
        "Four-Wheel Active Torque Vectoring",
      ],
    },
    "smart-technology": {
      title: "Nexus Neural iDrive 9 & AI Co-Pilot",
      badge: "03 / INTELLIGENCE",
      description:
        "The cabin is powered by BMW Nexus AI, a multimodal conversational neural engine that anticipates driver needs. Full windshield quantum holographic heads-up display overlays real-time navigation cues, pedestrian telemetry, and hazard radar directly into your line of sight without latency.",
      specs: [
        "Level 4 Autonomous Co-Pilot",
        "Windshield Augmented Reality HUD",
        "Biometric Driver Vital Monitoring",
        "Over-The-Air Neural Firmware Updates",
      ],
    },
    "battery-range": {
      title: "Advanced Solid-State Battery Architecture",
      badge: "04 / ULTRA-DENSE ENERGY",
      description:
        "Powered by BMW revolutionary 135 kWh solid-state electrolyte battery cells. Offering 620 miles of EPA-estimated range on a single charge. The native 800-volt high-voltage architecture enables lightning-fast charging rates up to 350 kW, replenishing 10% to 80% capacity in only 12 minutes.",
      specs: [
        "135 kWh Solid-State Pack",
        "620 Miles Driving Range",
        "800V Ultra-High Voltage Platform",
        "10-80% Ultra-Charge in 12 Minutes",
      ],
    },
    "luxury-interior": {
      title: "Executive Sanctuary & Sky Lounge",
      badge: "05 / BESPOKE LUXURY",
      description:
        "Handcrafted with non-animal sourced Silverstone Merino Leather and plant-tanned Alcantara. Zero-gravity multi-contour seats with dynamic thermal climate zones and 8 kinetic massage programs. The electrochromic Panoramic Sky Lounge adjusts opacity at your command while integrated fiber optics mirror constellations.",
      specs: [
        "Zero-Gravity Executive Lounge Seats",
        "Dynamic Active Climate Control",
        "Electrochromic Sky Lounge Glass Roof",
        "Interactive Ambient Fiber Optics",
      ],
    },
    "adaptive-led": {
      title: "Adaptive Laser Matrix Lights",
      badge: "LIGHTING TECHNOLOGY",
      description:
        "Intelligent digital laser light units that automatically carve anti-dazzle light tunnels around oncoming traffic while maximizing forward illumination up to 600 meters.",
      specs: [
        "600-Meter Illuminating Laser Range",
        "Anti-Glare High Beam Selective Masking",
        "Cornering Predictive Navigation Beam",
        "Choreographed Welcome Lighting Animation",
      ],
    },
    "air-suspension": {
      title: "Adaptive 2-Axle SkyRide Air Suspension",
      badge: "CHASSIS & DYNAMICS",
      description:
        "Continuously active air suspension paired with predictive road-scanning radar. Adjusts individual wheel damper rates 500 times per second to create a sensation of effortless levitation.",
      specs: [
        "Dual-Chamber Pneumatic Springs",
        "500Hz Active Predictive Damping",
        "Automated Aerodynamic Speed Lowering",
        "High-Clearance Terrain Mode (+40mm)",
      ],
    },
    "premium-sound": {
      title: "Bowers & Wilkins 4D Diamond Surround Sound",
      badge: "ACOUSTIC ARCHITECTURE",
      description:
        "30 high-performance speakers including diamond dome tweeters and seat-integrated low-frequency bass exciters for an uncompromised, concert-hall 4D auditory experience.",
      specs: [
        "30 Studio-Grade Acoustic Drivers",
        "1,615 Watts Total System Output",
        "4D Kinetic Seat-Integrated Exciters",
        "Acoustic Active Road Noise Cancellation",
      ],
    },
    "driver-assistance": {
      title: "Nexus Autonomous AI Driving Suite",
      badge: "SAFETY & CO-PILOT",
      description:
        "Combining solid-state LiDAR, 12 high-resolution cameras, and millimeter-wave radar to deliver safe, hands-free highway autopilot and autonomous valet parking.",
      specs: [
        "360° Solid-State LiDAR Perception",
        "Autonomous Highway Hands-Free Cruising",
        "Automated Valet Parking via Mobile App",
        "Emergency Collision Evading Steering",
      ],
    },
    "sky-lounge": {
      title: "Panoramic Sky Lounge LED Roof",
      badge: "ATMOSPHERE & GLASS",
      description:
        "An expansive continuous glass canopy with electrochromic dimming technology that changes from crystal-clear to deep opaque black in 150 milliseconds, with 15,000 fiber-optic light points.",
      specs: [
        "Electrochromic Instant Dimming Glass",
        "15,000 Fiber-Optic Constellation Points",
        "99.9% Infrared & UV Solar Rejection",
        "Acoustic Laminated Privacy Glazing",
      ],
    },
    "nexus-overview": {
      title: "BMW NEXUS: The Vision of Intelligent Mobility",
      badge: "BRAND MANIFESTO",
      description:
        "The BMW NEXUS represents the pinnacle of future luxury mobility. It unites raw electric power with an intelligent neural core, sculpted form with zero-emission efficiency, and supreme comfort with driver engagement. It is not simply an electric vehicle — it is an extension of human will.",
      specs: [
        "Designed in Munich & Silicon Valley",
        "Zero-Emission Carbon Neutral Manufacturing",
        "Next-Generation Circular Materials",
        "Redefining the Ultimate Driving Machine",
      ],
    },
  };

  const data = featureDatabase[featureKey] || featureDatabase["iconic-design"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-3 sm:p-4 transition-all overflow-y-auto">
      <div className="max-w-lg w-full max-h-[92vh] overflow-y-auto my-auto glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-cyan-400/40 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playChime(420);
            onClose();
          }}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
          {data.badge}
        </span>
        <h2 className="text-2xl font-display font-bold text-white mt-1">{data.title}</h2>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">{data.description}</p>

        <div className="mt-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
            Key Engineering Highlights
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.specs.map((spec, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200"
              >
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playChime(450);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
