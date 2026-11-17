"use client";

import React, { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { X, CheckCircle, Sparkles, Shield, Zap } from "lucide-react";
import { ConfigState } from "./ConfiguratorSidebar";

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigState;
}

export const BuildModal: React.FC<BuildModalProps> = ({ isOpen, onClose, config }) => {
  const [isReserved, setIsReserved] = useState(false);
  const [tokenNumber, setTokenNumber] = useState("");

  if (!isOpen) return null;

  let totalPrice = config.basePrice;
  if (config.colorKey === "cyan") totalPrice += 2400;
  if (config.colorKey === "purple") totalPrice += 3200;
  if (config.wheelKey === "23-turbine") totalPrice += 4500;
  if (config.interiorKey === "night-blue") totalPrice += 2800;

  const handleReserve = () => {
    soundEngine.playChime(880, "sine", 0.3);
    const token = "NEXUS-2027-" + Math.floor(1000 + Math.random() * 9000);
    setTokenNumber(token);
    setIsReserved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-3 sm:p-4 transition-all overflow-y-auto">
      <div className="max-w-2xl w-full max-h-[92vh] overflow-y-auto my-auto glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-cyan-400/40 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
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

        {isReserved ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-glow-cyan">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              Reservation Confirmed
            </span>
            <h2 className="text-3xl font-display font-extrabold text-white mt-1">
              Welcome to the Nexus Collective
            </h2>
            <p className="text-slate-300 text-sm mt-3 max-w-md mx-auto">
              Your BMW NEXUS custom vehicle build has been recorded under priority build slot:
            </p>

            <div className="my-5 inline-block px-5 py-2.5 rounded-xl bg-black/60 border border-cyan-400/50 font-mono text-cyan-300 font-bold text-lg tracking-widest shadow-glow-cyan">
              {tokenNumber}
            </div>

            <p className="text-xs text-slate-400">
              A BMW Concierge specialist will contact you with VIP delivery schedule and test circuit access.
            </p>

            <div className="mt-6">
              <button
                onClick={() => {
                  setIsReserved(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors"
              >
                Return to Studio
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  Personal Configuration
                </span>
                <h2 className="text-2xl font-display font-extrabold text-white">
                  Your Bespoke BMW NEXUS
                </h2>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="text-xs text-slate-400">Selected Exterior Finish</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {config.colorName}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  Multi-coat metallic & clearcoat
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="text-xs text-slate-400">Wheel Package</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {config.wheelName}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  Turbine active aero airflow blades
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="text-xs text-slate-400">Interior Luxury Cabin</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {config.interiorName}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  Ventilated zero-gravity massage seats
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="text-xs text-slate-400">Powertrain & Architecture</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Dual M eDrive 1,020 HP
                </div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">
                  800V Solid-State 135 kWh Pack
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/30 flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-slate-300">Total Configured MSRP</div>
                <div className="text-2xl font-bold font-display text-white">
                  ${totalPrice.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Build Slots Available
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReserve}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white font-bold text-xs sm:text-sm tracking-widest uppercase shadow-glow-cyan hover:scale-[1.02] active:scale-95 transition-all"
              >
                Submit Nexus Pre-Order
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-colors"
              >
                Back to Studio
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
