// Web Audio API procedural sound engine for Noir Interrogation atmosphere

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private heartbeatInterval: number | null = null;

  constructor() {
    this.isMuted = localStorage.getItem("truth_unveiled_muted") === "true";
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem("truth_unveiled_muted", String(this.isMuted));
    if (this.isMuted) {
      this.stopHeartbeat();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Typewriter key click sound
  public playTypewriterClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      osc.type = "sine";
      osc.frequency.setValueAtTime(180 + Math.random() * 60, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext policy safe catch
    }
  }

  // Dramatic critical hit (Heavy bass boom + metal clang when contradiction is exposed)
  public playCriticalHit() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Deep sub bass impact
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.7);

      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.8);

      // Metallic high sting
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = "sawtooth";
      metalOsc.frequency.setValueAtTime(587.33, now); // D5
      metalOsc.frequency.exponentialRampToValueAtTime(220, now + 0.4);

      metalGain.gain.setValueAtTime(0.15, now);
      metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      metalOsc.connect(metalGain);
      metalGain.connect(this.ctx.destination);
      metalOsc.start(now);
      metalOsc.stop(now + 0.4);
    } catch {
      // safe catch
    }
  }

  // Lawyer Objection sound (Sharp gavel or warning siren)
  public playObjectionSting() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // safe catch
    }
  }

  // Relief / mistake tone (Soft sigh tone when suspect calms down)
  public playReliefTone() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // safe catch
    }
  }

  // Single heartbeat thump (Lub-dub)
  public playSingleHeartbeat(volumeMultiplier: number = 1.0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const vol = Math.min(0.3, 0.08 * volumeMultiplier);

      // First beat (Lub)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain1.gain.setValueAtTime(vol, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Second beat (Dub) - 0.14s later
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(70, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.28);

      gain2.gain.setValueAtTime(vol * 0.8, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.28);
    } catch {
      // safe catch
    }
  }

  // Dynamic heartbeat loop that changes BPM based on stress (50% to 100%)
  public updateHeartbeat(stress: number) {
    if (this.isMuted || stress < 30) {
      this.stopHeartbeat();
      return;
    }

    // Stress 30% -> 65 BPM (~920ms), Stress 100% -> 145 BPM (~410ms)
    const bpm = 65 + ((stress - 30) / 70) * 80;
    const intervalMs = (60 / bpm) * 1000;
    const vol = 0.8 + (stress / 100) * 1.2;

    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval);
    }

    this.playSingleHeartbeat(vol);
    this.heartbeatInterval = window.setInterval(() => {
      this.playSingleHeartbeat(vol);
    }, intervalMs);
  }

  public stopHeartbeat() {
    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Victory Fanfare / Confession Accord
  public playVictoryTheme() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [261.63, 329.63, 392.0, 523.25, 659.25]; // C major arpeggio
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.9);
      });
    } catch {
      // safe catch
    }
  }
}

export const sound = new SoundEngine();
