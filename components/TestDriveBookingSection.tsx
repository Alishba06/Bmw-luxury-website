"use client";

import React, { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Car, 
  Sparkles, 
  Send, 
  QrCode, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  User,
  Mail,
  Phone
} from "lucide-react";

interface TestDriveBookingProps {
  preselectedModel?: string;
}

interface BookingDetails {
  model: string;
  location: string;
  date: string;
  timeSlot: string;
  fullName: string;
  email: string;
  phone: string;
  trackInstructor: boolean;
  launchControlSession: boolean;
  vipLoungeAccess: boolean;
  confirmationCode?: string;
}

export const TestDriveBookingSection: React.FC<TestDriveBookingProps> = ({ preselectedModel }) => {
  const models = [
    { id: "m8", name: "BMW M8 Competition Black Edition", badge: "1,020 HP • Solid-State Hyper-AWD", image: "/mirror_portal_car_landed.jpg" },
    { id: "m4-csl", name: "BMW M4 CSL Track Weapon", badge: "820 HP • TwinPower Turbo M", image: "/mirror_car_m4.jpg" },
    { id: "i7-m70", name: "BMW i7 M70 Executive Limousine", badge: "960 HP • Crystal Iconic Glow", image: "/mirror_car_i7.jpg" },
    { id: "m1-cyber", name: "BMW M1 Cyber Hommage Supercar", badge: "1,100 HP • Quantum Turbine Core", image: "/mirror_car_m1.jpg" },
    { id: "nexus", name: "BMW Nexus Hyper-EV Concept", badge: "1,250 HP • 800V Hyper-GT", image: "/bmw_nexus_hero_mockup.jpg" },
    { id: "bmw-s3", name: "BMW M3 CS Touring Edition", badge: "780 HP • M xDrive Track Apex", image: "/Bmw_series1_image/bmw_s3_clean.png" },
  ];

  const locations = [
    { city: "Munich", facility: "BMW Welt & M Innovation Hub", country: "Germany", code: "MUC" },
    { city: "Dubai", facility: "Downtown Boulevard Private Atelier", country: "UAE", code: "DXB" },
    { city: "New York", facility: "Fifth Avenue M Experience Center", country: "USA", code: "NYC" },
    { city: "London", facility: "Mayfair Private Client Lounge", country: "UK", code: "LON" },
    { city: "Karachi", facility: "Clifton Flagship VIP Showroom", country: "Pakistan", code: "KHI" },
    { city: "Tokyo", facility: "Ginza High-Speed Showcase", country: "Japan", code: "TYO" },
  ];

  const timeSlots = [
    { id: "morning", label: "09:30 AM — Morning Track Induction", icon: "🌅" },
    { id: "midday", label: "02:00 PM — Performance Dyno Run", icon: "☀️" },
    { id: "sunset", label: "05:45 PM — Sunset Golden-Hour Aerodrome", icon: "🌆" },
    { id: "night", label: "08:30 PM — Night Autobahn Speed Trial", icon: "🌃" },
  ];

  const [booking, setBooking] = useState<BookingDetails>({
    model: preselectedModel || "BMW Nexus Hyper-EV Concept",
    location: "Munich • BMW Welt & M Innovation Hub",
    date: "2027-04-18",
    timeSlot: "05:45 PM — Sunset Golden-Hour Aerodrome",
    fullName: "",
    email: "",
    phone: "",
    trackInstructor: true,
    launchControlSession: true,
    vipLoungeAccess: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.fullName || !booking.email) {
      soundEngine.playChime(320);
      return;
    }

    soundEngine.playChime(880);
    setTimeout(() => soundEngine.playChime(1120), 120);

    const generatedCode = `BMW-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketCode(generatedCode);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    soundEngine.playChime(500);
    setIsSubmitted(false);
  };

  return (
    <section id="test-drive" className="relative w-full py-28 px-4 sm:px-8 bg-gradient-to-b from-brand-black via-[#06080e] to-brand-black text-white overflow-hidden border-t border-slate-800/80">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>BMW Private Client Commission</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white mb-4">
            RESERVE YOUR <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">VIP TEST DRIVE</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Experience the unfiltered fury of dual-motor electric torque and legendary BMW M driving dynamics. 
            Choose your flagship model, exclusive track session, and international experience center.
          </p>
        </div>

        {!isSubmitted ? (
          /* BOOKING CONSOLE FORM */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Model & Location Customization (7 cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. SELECT VEHICLE */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                      Step 01 • Select Your Model
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">{booking.model}</span>
                </div>

                {/* Active Selected Model Big Preview Banner */}
                {(() => {
                  const activeModelObj = models.find((m) => m.name === booking.model) || models[0];
                  return (
                    <div className="mb-4 relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-cyan-500/40 shadow-glow-cyan bg-slate-950/80 group">
                      <img
                        src={activeModelObj.image}
                        alt={activeModelObj.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            <span>{activeModelObj.badge}</span>
                          </div>
                          <div className="text-sm sm:text-base font-black text-white">{activeModelObj.name}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-cyan-400 text-black text-[10px] font-bold font-mono uppercase tracking-wider shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.6)]">
                          Active Selection
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {models.map((m) => {
                    const isSelected = booking.model === m.name;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          soundEngine.playChime(640);
                          setBooking({ ...booking, model: m.name });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400 shadow-glow-cyan"
                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="w-14 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950 border border-white/15 relative flex items-center justify-center shadow-inner">
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? "text-cyan-300" : "text-white"}`}>
                            {m.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">{m.badge}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SELECT GLOBAL EXPERIENCE CENTER */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                      Step 02 • Global Showroom / Track Facility
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-400">6 Global Cities</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {locations.map((loc) => {
                    const fullName = `${loc.city} • ${loc.facility}`;
                    const isSelected = booking.location === fullName;
                    return (
                      <button
                        type="button"
                        key={loc.city}
                        onClick={() => {
                          soundEngine.playChime(680);
                          setBooking({ ...booking, location: fullName });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-600/20 border-purple-400 shadow-glow-purple"
                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? "text-purple-300" : "text-white"}`}>
                            {loc.city}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-slate-400">
                            {loc.code}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{loc.facility}</div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">{loc.country}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. DATE & TIME SELECTION */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                      Step 03 • Preferred Schedule
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1.5 block">Session Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={booking.date}
                        min="2027-01-01"
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1.5 block">Track Condition</label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Dry Asphalt • Telemetry Sensors Calibrated</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Time & Experience Slot</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeSlots.map((ts) => {
                      const isSelected = booking.timeSlot === ts.label;
                      return (
                        <button
                          type="button"
                          key={ts.id}
                          onClick={() => {
                            soundEngine.playChime(720);
                            setBooking({ ...booking, timeSlot: ts.label });
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-400 text-amber-200"
                              : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-base">{ts.icon}</span>
                          <span className="text-xs truncate">{ts.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: VIP Concierge Details & Live Summary Pass (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              {/* VIP CLIENT INFORMATION */}
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl" />

                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                    Step 04 • VIP Concierge Credentials
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Full Legal Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={booking.fullName}
                      onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Private Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vance@luxuryholdings.com"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Phone / WhatsApp (With Country Code)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 923-4481"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Add-on Privileges */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">Complimentary Inclusions</span>
                    
                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={booking.trackInstructor}
                        onChange={(e) => setBooking({ ...booking, trackInstructor: e.target.checked })}
                        className="rounded accent-cyan-400"
                      />
                      <span>BMW Certified M Track Pro Instructor</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={booking.launchControlSession}
                        onChange={(e) => setBooking({ ...booking, launchControlSession: e.target.checked })}
                        className="rounded accent-cyan-400"
                      />
                      <span>Unrestricted 0–60 MPH Launch Control Runway Run</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={booking.vipLoungeAccess}
                        onChange={(e) => setBooking({ ...booking, vipLoungeAccess: e.target.checked })}
                        className="rounded accent-cyan-400"
                      />
                      <span>Executive Private Lounge & Champagne Reception</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-black" />
                    <span>Generate Instant VIP Digital Access Pass</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-500 font-mono mt-2">
                    ⚡ Instant booking confirmation with high-priority calendar sync.
                  </p>
                </div>
              </div>

            </div>

          </form>
        ) : (
          /* HOLOGRAPHIC VIP ACCESS PASS (CONFIRMED) */
          <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border-2 border-cyan-400/80 shadow-[0_0_80px_rgba(0,240,255,0.35)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            
            {/* Top Glowing Header Badge */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-black text-lg">
                  M
                </div>
                <div>
                  <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">BMW EXPERIENTIAL CLIENT COMMISSION</div>
                  <h3 className="text-xl font-display font-black text-white">OFFICIAL VIP TEST DRIVE PASS</h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400">STATUS</div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CONFIRMED</span>
                </div>
              </div>
            </div>

            {/* Ticket Core Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Reserved Automobile</div>
                  <div className="text-base font-bold text-cyan-300">{booking.model}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Date</div>
                    <div className="text-sm font-semibold text-white">{booking.date}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">VIP Holder</div>
                    <div className="text-sm font-semibold text-white">{booking.fullName}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Showroom / Track Facility</div>
                  <div className="text-xs text-slate-200">{booking.location}</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Session Slot</div>
                  <div className="text-xs text-amber-300">{booking.timeSlot}</div>
                </div>
              </div>

              {/* QR Code Hologram Box */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/70 border border-cyan-500/30 text-center">
                <div className="w-24 h-24 rounded-lg bg-white p-1.5 mb-2 shadow-inner">
                  {/* SVG QR Code Simulation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="10" width="20" height="10" />
                    <rect x="40" y="30" width="10" height="30" />
                    <rect x="60" y="40" width="30" height="10" />
                    <rect x="50" y="70" width="20" height="20" />
                    <rect x="80" y="80" width="10" height="10" />
                  </svg>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 font-bold">{ticketCode}</div>
                <div className="text-[8px] font-mono text-slate-500">Scan at VIP Entrance</div>
              </div>
            </div>

            {/* Included Privileges Badges */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-6 flex flex-wrap gap-2 text-[10px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">✓ M Instructor Included</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">✓ Launch Control Session</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">✓ Executive Lounge Access</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  soundEngine.playChime(950);
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save VIP Pass (PDF)</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs uppercase tracking-wider hover:text-white hover:border-white/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Book Another Vehicle</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </section>
  );
};
