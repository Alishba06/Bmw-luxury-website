// Web Audio API Sound Synthesizer for BMW NEXUS Futuristic Cockpit

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private motorOsc: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private spoolOsc: OscillatorNode | null = null;
  private spoolSubOsc: OscillatorNode | null = null;
  private spoolGain: GainNode | null = null;

  // Hans Zimmer Studio Engine
  private analyser: AnalyserNode | null = null;
  private studioOsc1: OscillatorNode | null = null;
  private studioOsc2: OscillatorNode | null = null;
  private studioSubOsc: OscillatorNode | null = null;
  private studioFilter: BiquadFilterNode | null = null;
  private studioGain: GainNode | null = null;
  private activeProfile: "comfort" | "sport" | "warp" = "sport";
  private currentThrottle: number = 0; // 0 to 100

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initCtx();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMotorDrone();
    } else {
      this.playChime(520, "sine", 0.2, 0.1);
      this.startMotorDrone();
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playChime(freq = 660, type: OscillatorType = "sine", duration = 0.18, vol = 0.08) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.45, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy
    }
  }

  public playLaserSweep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  private startMotorDrone() {
    if (this.motorOsc || !this.ctx) return;
    try {
      this.motorOsc = this.ctx.createOscillator();
      this.motorGain = this.ctx.createGain();

      this.motorOsc.type = "sawtooth";
      this.motorOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz deep EV purr

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);

      this.motorGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.motorOsc.connect(filter);
      filter.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);

      this.motorOsc.start();
    } catch {}
  }

  private stopMotorDrone() {
    if (!this.motorOsc || !this.motorGain || !this.ctx) return;
    try {
      this.motorGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
      setTimeout(() => {
        if (this.motorOsc) {
          this.motorOsc.stop();
          this.motorOsc.disconnect();
          this.motorOsc = null;
        }
      }, 220);
    } catch {}
  }

  // --- 0-60 MPH LAUNCH CONTROL SOUND SYNTHESIS ---

  public startLaunchSpool() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.stopLaunchSpool();

      const now = this.ctx.currentTime;

      // 1. Dual Inverter High Whine
      this.spoolOsc = this.ctx.createOscillator();
      this.spoolOsc.type = "sawtooth";
      this.spoolOsc.frequency.setValueAtTime(140, now);
      this.spoolOsc.frequency.exponentialRampToValueAtTime(980, now + 1.85);

      // 2. Subharmonic Turbine Rumbling
      this.spoolSubOsc = this.ctx.createOscillator();
      this.spoolSubOsc.type = "sine";
      this.spoolSubOsc.frequency.setValueAtTime(45, now);
      this.spoolSubOsc.frequency.linearRampToValueAtTime(120, now + 1.85);

      // Filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 1.85);

      // Gain Envelope
      this.spoolGain = this.ctx.createGain();
      this.spoolGain.gain.setValueAtTime(0.01, now);
      this.spoolGain.gain.linearRampToValueAtTime(0.18, now + 1.85);

      this.spoolOsc.connect(filter);
      this.spoolSubOsc.connect(filter);
      filter.connect(this.spoolGain);
      this.spoolGain.connect(this.ctx.destination);

      this.spoolOsc.start(now);
      this.spoolSubOsc.start(now);
    } catch {}
  }

  public stopLaunchSpool() {
    try {
      if (this.spoolGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.spoolGain.gain.cancelScheduledValues(now);
        this.spoolGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
      }
      setTimeout(() => {
        if (this.spoolOsc) {
          try { this.spoolOsc.stop(); this.spoolOsc.disconnect(); } catch {}
          this.spoolOsc = null;
        }
        if (this.spoolSubOsc) {
          try { this.spoolSubOsc.stop(); this.spoolSubOsc.disconnect(); } catch {}
          this.spoolSubOsc = null;
        }
        this.spoolGain = null;
      }, 180);
    } catch {}
  }

  public triggerLaunchWarp() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.stopLaunchSpool();

      const now = this.ctx.currentTime;

      // Stage 1: Massive Sub-Bass Torque Kick (0 - 0.4s)
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = "triangle";
      kickOsc.frequency.setValueAtTime(120, now);
      kickOsc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

      kickGain.gain.setValueAtTime(0.35, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.55);

      // Stage 2: Dual M Electric Motor Warp Rocket Scream (0 - 2.15s)
      const warpOsc = this.ctx.createOscillator();
      const warpGain = this.ctx.createGain();
      const warpFilter = this.ctx.createBiquadFilter();

      warpOsc.type = "sawtooth";
      warpOsc.frequency.setValueAtTime(180, now);
      warpOsc.frequency.exponentialRampToValueAtTime(2600, now + 2.12);

      warpFilter.type = "bandpass";
      warpFilter.frequency.setValueAtTime(600, now);
      warpFilter.frequency.exponentialRampToValueAtTime(4200, now + 2.12);
      warpFilter.Q.setValueAtTime(2.2, now);

      warpGain.gain.setValueAtTime(0.05, now);
      warpGain.gain.linearRampToValueAtTime(0.24, now + 1.2);
      warpGain.gain.linearRampToValueAtTime(0.28, now + 2.0);
      warpGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      warpOsc.connect(warpFilter);
      warpFilter.connect(warpGain);
      warpGain.connect(this.ctx.destination);

      warpOsc.start(now);
      warpOsc.stop(now + 2.45);
    } catch {}
  }

  public triggerLaunchSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [880, 1174.66, 1760].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch {}
  }

  // --- HANS ZIMMER "ICONICSOUNDS ELECTRIC" ACOUSTIC STUDIO ---

  public getAnalyserData(dataArray: any): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray);
    }
  }

  public getActiveProfile(): "comfort" | "sport" | "warp" {
    return this.activeProfile;
  }

  public startStudioSound(profile: "comfort" | "sport" | "warp") {
    try {
      this.initCtx();
      if (!this.ctx || !this.analyser) return;
      this.stopStudioSound();
      this.activeProfile = profile;

      const now = this.ctx.currentTime;

      this.studioGain = this.ctx.createGain();
      this.studioFilter = this.ctx.createBiquadFilter();

      // Configure based on profile
      let baseFreq = 70;
      let osc1Type: OscillatorType = "sine";
      let osc2Type: OscillatorType = "triangle";
      let filterCutoff = 450;
      let filterQ = 1.0;
      let targetGain = 0.12;

      if (profile === "comfort") {
        baseFreq = 65;
        osc1Type = "sine";
        osc2Type = "triangle";
        filterCutoff = 320;
        filterQ = 0.8;
        targetGain = 0.09;
      } else if (profile === "sport") {
        baseFreq = 95;
        osc1Type = "sawtooth";
        osc2Type = "triangle";
        filterCutoff = 800;
        filterQ = 2.4;
        targetGain = 0.14;
      } else if (profile === "warp") {
        baseFreq = 52;
        osc1Type = "sawtooth";
        osc2Type = "sawtooth";
        filterCutoff = 1400;
        filterQ = 3.8;
        targetGain = 0.18;
      }

      // 1. Primary Inverter Osc
      this.studioOsc1 = this.ctx.createOscillator();
      this.studioOsc1.type = osc1Type;
      this.studioOsc1.frequency.setValueAtTime(baseFreq, now);

      // 2. Harmonic Overtone Osc
      this.studioOsc2 = this.ctx.createOscillator();
      this.studioOsc2.type = osc2Type;
      this.studioOsc2.frequency.setValueAtTime(baseFreq * 2.01, now);

      // 3. Subharmonic Rumble (for warp & sport)
      if (profile === "warp" || profile === "sport") {
        this.studioSubOsc = this.ctx.createOscillator();
        this.studioSubOsc.type = "sine";
        this.studioSubOsc.frequency.setValueAtTime(36, now);
      }

      // Filter config
      this.studioFilter.type = "lowpass";
      this.studioFilter.frequency.setValueAtTime(filterCutoff, now);
      this.studioFilter.Q.setValueAtTime(filterQ, now);

      // Connect graph to analyser (so visualizer animates)
      this.studioGain.gain.setValueAtTime(0.001, now);
      this.studioGain.gain.linearRampToValueAtTime(targetGain, now + 0.25);

      this.studioOsc1.connect(this.studioFilter);
      this.studioOsc2.connect(this.studioFilter);
      if (this.studioSubOsc) {
        this.studioSubOsc.connect(this.studioFilter);
        this.studioSubOsc.start(now);
      }

      this.studioFilter.connect(this.studioGain);
      this.studioGain.connect(this.analyser);

      this.studioOsc1.start(now);
      this.studioOsc2.start(now);
    } catch {}
  }

  public setStudioThrottle(throttle: number) {
    // throttle: 0 to 100
    this.currentThrottle = throttle;
    if (!this.ctx || !this.studioOsc1 || !this.studioFilter) return;

    try {
      const now = this.ctx.currentTime;
      const normalized = Math.max(0, Math.min(100, throttle)) / 100;

      let baseFreq = 70;
      let maxFreqMult = 2.4;
      let minFilter = 400;
      let maxFilter = 3200;

      if (this.activeProfile === "comfort") {
        baseFreq = 65;
        maxFreqMult = 1.6;
        minFilter = 300;
        maxFilter = 950;
      } else if (this.activeProfile === "sport") {
        baseFreq = 95;
        maxFreqMult = 2.8;
        minFilter = 600;
        maxFilter = 2800;
      } else if (this.activeProfile === "warp") {
        baseFreq = 52;
        maxFreqMult = 4.2;
        minFilter = 800;
        maxFilter = 4800;
      }

      const currentPitch = baseFreq + baseFreq * (maxFreqMult - 1) * Math.pow(normalized, 0.85);
      const currentCutoff = minFilter + (maxFilter - minFilter) * Math.pow(normalized, 0.9);

      this.studioOsc1.frequency.setTargetAtTime(currentPitch, now, 0.05);
      if (this.studioOsc2) {
        this.studioOsc2.frequency.setTargetAtTime(currentPitch * 2.01, now, 0.05);
      }
      if (this.studioSubOsc) {
        this.studioSubOsc.frequency.setTargetAtTime(36 + normalized * 40, now, 0.05);
      }

      this.studioFilter.frequency.setTargetAtTime(currentCutoff, now, 0.05);
    } catch {}
  }

  public stopStudioSound() {
    try {
      if (this.studioGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.studioGain.gain.cancelScheduledValues(now);
        this.studioGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
      }

      setTimeout(() => {
        if (this.studioOsc1) {
          try { this.studioOsc1.stop(); this.studioOsc1.disconnect(); } catch {}
          this.studioOsc1 = null;
        }
        if (this.studioOsc2) {
          try { this.studioOsc2.stop(); this.studioOsc2.disconnect(); } catch {}
          this.studioOsc2 = null;
        }
        if (this.studioSubOsc) {
          try { this.studioSubOsc.stop(); this.studioSubOsc.disconnect(); } catch {}
          this.studioSubOsc = null;
        }
        if (this.studioFilter) {
          try { this.studioFilter.disconnect(); } catch {}
          this.studioFilter = null;
        }
        this.studioGain = null;
      }, 160);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
