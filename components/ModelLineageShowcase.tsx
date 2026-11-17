"use client";

import React, { useState } from "react";
import Image from "next/image";
import { soundEngine } from "./SoundEngine";
import {
  Car,
  ChevronRight,
  Sparkles,
  Zap,
  Gauge,
  SlidersHorizontal,
  X,
  ArrowRight,
  Flame,
  Award,
  Layers,
} from "lucide-react";

interface CarModel {
  id: string;
  name: string;
  series: string;
  category: "m-sport" | "luxury" | "compact" | "concept";
  tag: string;
  image: string;
  basePrice: number;
  specs: {
    power: string;
    acceleration: string;
    topSpeed: string;
    drivetrain: string;
  };
  highlight: string;
  description: string;
}

interface ModelLineageShowcaseProps {
  onOpenBooking: (modelName?: string) => void;
}

export const ModelLineageShowcase: React.FC<ModelLineageShowcaseProps> = ({
  onOpenBooking,
}) => {
  const models: CarModel[] = [
    {
      id: "bmw-s1",
      name: "BMW 128ti M Sport Track Edition",
      series: "Series 1 • M Performance",
      category: "m-sport",
      tag: "TRACK TUNED",
      image: "/Bmw_series1_image/bmw_s1_clean.png",
      basePrice: 42800,
      specs: {
        power: "265 HP",
        acceleration: "5.1s 0-60",
        topSpeed: "155 MPH",
        drivetrain: "Torsen LSD Front-Drive",
      },
      highlight: "Torsen Mechanical Limited-Slip Differential with M Sport Suspension",
      description: "Purist front-wheel agility with distinctive red ti exterior accents, 18-inch Y-spoke bicolour alloys, and M Sport braking.",
    },
    {
      id: "bmw-s2",
      name: "BMW M135i xDrive Intelligent AWD",
      series: "Series 1 • Flagship M",
      category: "m-sport",
      tag: "FLAGSHIP AWD",
      image: "/Bmw_series1_image/bmw_s2_clean.png",
      basePrice: 51200,
      specs: {
        power: "306 HP",
        acceleration: "4.7s 0-60",
        topSpeed: "155 MPH",
        drivetrain: "BMW xDrive All-Wheel",
      },
      highlight: "TwinPower Turbo 2.0L 4-Cylinder with Active Variable Torque",
      description: "Cerium Grey kidney grille mesh, dual 100mm exhaust pipes, and launch control standard for all-weather supremacy.",
    },
    {
      id: "bmw-s3",
      name: "BMW 118i M Aerodynamics Edition",
      series: "Series 1 • Urban Luxury",
      category: "compact",
      tag: "URBAN SPORT",
      image: "/Bmw_series1_image/bmw_s3_clean.png",
      basePrice: 34500,
      specs: {
        power: "140 HP",
        acceleration: "8.5s 0-60",
        topSpeed: "132 MPH",
        drivetrain: "7-Speed Steptronic DCT",
      },
      highlight: "Dynamic Stability Control with BMW Live Cockpit Professional",
      description: "Sophisticated aerodynamic profile crafted for urban agility, offering 48.7 MPG combined efficiency and modern luxury.",
    },
    {
      id: "bmw-s4",
      name: "BMW 120d xDrive M Gran Tourer",
      series: "Series 1 • Diesel Sport",
      category: "luxury",
      tag: "EXTENDED RANGE",
      image: "/Bmw_series1_image/bmw_s4_clean.png",
      basePrice: 44900,
      specs: {
        power: "190 HP",
        acceleration: "7.0s 0-60",
        topSpeed: "143 MPH",
        drivetrain: "Intelligent xDrive AWD",
      },
      highlight: "400 Nm High-Torque Multi-Stage Turbocharger",
      description: "Effortless long-distance touring prowess, combining 60+ MPG economy with responsive xDrive all-weather traction.",
    },
    {
      id: "bmw-s5",
      name: "BMW 1 Series Shadowline Edition",
      series: "Series 1 • Stealth Black",
      category: "luxury",
      tag: "HIGH GLOSS SHADOW",
      image: "/Bmw_series1_image/bmw_s5_clean.png",
      basePrice: 38700,
      specs: {
        power: "178 HP",
        acceleration: "7.1s 0-60",
        topSpeed: "146 MPH",
        drivetrain: "8-Speed Steptronic Sport",
      },
      highlight: "Extended High-Gloss Shadowline Exterior Trim with Darkened LEDs",
      description: "Understated menace featuring black kidney surrounds, high-gloss window contours, and dark smoke tail lamps.",
    },
    {
      id: "bmw-s6",
      name: "BMW M140i Pure Heritage Special",
      series: "Series 1 • Heritage Icon",
      category: "m-sport",
      tag: "HERITAGE COLLECTOR",
      image: "/Bmw_series1_image/bmw_s6_clean.png",
      basePrice: 53900,
      specs: {
        power: "340 HP",
        acceleration: "4.4s 0-60",
        topSpeed: "168 MPH",
        drivetrain: "Rear-Biased xDrive",
      },
      highlight: "Straight-Six Acoustic Lineage & Lightweight Forged Wheels",
      description: "A tribute to BMW's legendary compact hot-hatch pedigree, engineered for pure driver connection on twisty mountain passes.",
    },
    {
      id: "bmw-s7",
      name: "BMW 128ti Frozen Carbon Track Pack",
      series: "Series 1 • Track Pack",
      category: "m-sport",
      tag: "CARBON PACK",
      image: "/Bmw_series1_image/bmw_s7_clean.png",
      basePrice: 47200,
      specs: {
        power: "280 HP",
        acceleration: "4.9s 0-60",
        topSpeed: "158 MPH",
        drivetrain: "M Differential Lock",
      },
      highlight: "Carbon Fibre Rear Spoiler & Lightweight Aerodynamic Splitter",
      description: "Weight-optimized for closed circuit track days with Michelin Pilot Sport Cup 2 tires and high-friction brake compounds.",
    },
    {
      id: "bmw-s8",
      name: "BMW Nexus Next-Gen Electric Sprint",
      series: "Series 1 • Future Concept",
      category: "concept",
      tag: "ALL-ELECTRIC 800V",
      image: "/Bmw_series1_image/bmw_s8_clean.png",
      basePrice: 58500,
      specs: {
        power: "420 HP",
        acceleration: "3.4s 0-60",
        topSpeed: "162 MPH",
        drivetrain: "Dual Electric eDrive AWD",
      },
      highlight: "800V Solid-State Battery with 420 Miles Range",
      description: "The bridge between compact agility and futuristic hyper-EV performance, pioneering sustainable luxury.",
    },
  ];

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);

  const filterOptions = [
    { key: "all", label: "All Models (8)" },
    { key: "m-sport", label: "///M Performance (4)" },
    { key: "luxury", label: "Executive Luxury (2)" },
    { key: "compact", label: "Urban Sport (1)" },
    { key: "concept", label: "Electric Concept (1)" },
  ];

  const filteredModels = models.filter((m) =>
    activeFilter === "all" ? true : m.category === activeFilter
  );

  return (
    <section id="fleet" className="relative w-full py-24 px-4 sm:px-8 bg-brand-black overflow-hidden border-t border-cyan-500/20">

      {/* Background Neon Gradients */}
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-brand-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-24 w-80 h-80 bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] uppercase tracking-widest mb-3">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE 1 SERIES & M FLEET SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              Pure Driving <span className="bg-gradient-to-r from-brand-cyan via-white to-brand-purple bg-clip-text text-transparent">Heritage</span>
            </h2>
            <p className="text-slate-400 font-sans text-sm sm:text-base mt-2 max-w-2xl">
              From track-honed M Sport dynamics to intelligent xDrive all-weather mastery, explore BMW&apos;s athletic compact lineage engineered for the spirited driver.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  soundEngine.playChime(640);
                  setActiveFilter(opt.key);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${activeFilter === opt.key
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400/50 shadow-glow-cyan font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="group relative rounded-3xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-400/60 p-4 transition-all duration-300 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:shadow-glow-cyan hover:-translate-y-1 overflow-hidden"
            >
              <div>
                {/* Image Container with Zoom */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-black/60 mb-4 border border-white/10">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Tag Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 border border-cyan-400/40 text-cyan-300 font-mono text-[9px] font-bold tracking-widest uppercase backdrop-blur-md">
                    {model.tag}
                  </span>

                  {/* Starting Price */}
                  <span className="absolute bottom-3 right-3 text-xs font-mono text-white bg-black/80 px-2 py-0.5 rounded-lg border border-white/15">
                    From <strong className="text-cyan-300">${model.basePrice.toLocaleString()}</strong>
                  </span>
                </div>

                {/* Series & Title */}
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  {model.series}
                </span>
                <h3 className="font-display font-extrabold text-base text-white tracking-tight mt-0.5 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {model.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {model.description}
                </p>

                {/* Specs Pill Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-[11px] font-mono">
                  <div className="bg-black/60 rounded-xl p-2 border border-white/5 text-center">
                    <span className="text-slate-500 block text-[9px] uppercase">Power</span>
                    <span className="text-white font-bold">{model.specs.power}</span>
                  </div>
                  <div className="bg-black/60 rounded-xl p-2 border border-white/5 text-center">
                    <span className="text-slate-500 block text-[9px] uppercase">0–60 MPH</span>
                    <span className="text-cyan-300 font-bold">{model.specs.acceleration}</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Action Buttons */}
              <div className="mt-4 pt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEngine.playChime(720);
                    setSelectedModel(model);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <span>Quick Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    soundEngine.playChime(850);
                    onOpenBooking(model.name);
                  }}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all"
                  title="Schedule a Test Drive"
                >
                  Test Drive
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* DETAILED MODEL MODAL LIGHTBOX */}
      {selectedModel && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-cyan-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">

            {/* Top Glowing Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            {/* Header & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  {selectedModel.series}
                </span>
                <h3 className="font-display font-extrabold text-xl text-white">
                  {selectedModel.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModel(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden my-4 border border-white/10">
              <img
                src={selectedModel.image}
                alt={selectedModel.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-sm font-mono text-cyan-300 font-bold bg-black/70 px-3 py-1 rounded-lg border border-cyan-400/30">
                Starting at ${selectedModel.basePrice.toLocaleString()} MSRP
              </div>
            </div>

            {/* Highlights & Full Specs */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              {selectedModel.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block">Engine Output</span>
                <span className="text-white font-bold text-sm">{selectedModel.specs.power}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block">0–60 MPH</span>
                <span className="text-cyan-300 font-bold text-sm">{selectedModel.specs.acceleration}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block">Top Speed</span>
                <span className="text-purple-300 font-bold text-sm">{selectedModel.specs.topSpeed}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block">Drivetrain</span>
                <span className="text-emerald-400 font-bold text-sm truncate">{selectedModel.specs.drivetrain}</span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 rounded-xl border border-white/15 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close View
              </button>

              <button
                onClick={() => {
                  const mName = selectedModel.name;
                  setSelectedModel(null);
                  onOpenBooking(mName);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Book This Model for Test Drive</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
