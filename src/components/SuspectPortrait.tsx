import React from "react";
import { SuspectEmotion, SuspectProfile } from "../types/game";
import { AlertCircle, Eye, Heart, Shield, Sparkles } from "lucide-react";

interface SuspectPortraitProps {
  suspect: SuspectProfile;
  emotion: SuspectEmotion;
  stress: number;
  innerThought?: string;
  isThinking?: boolean;
}

export const SuspectPortrait: React.FC<SuspectPortraitProps> = ({
  suspect,
  emotion,
  stress,
  innerThought,
  isThinking,
}) => {
  // Determine heart rate BPM for display
  const bpm = Math.round(65 + (stress / 100) * 85);

  // Status badge config
  const getEmotionConfig = () => {
    switch (emotion) {
      case "calm":
        return {
          label: "평온 / 비웃음",
          color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/60",
          glow: "shadow-emerald-950/30",
        };
      case "defensive":
        return {
          label: "경계 / 방어적",
          color: "border-sky-500/40 text-sky-300 bg-sky-950/60",
          glow: "shadow-sky-950/30",
        };
      case "nervous":
        return {
          label: "초조 / 시선 회피",
          color: "border-amber-500/40 text-amber-300 bg-amber-950/60",
          glow: "shadow-amber-950/30",
        };
      case "sweating":
        return {
          label: "식은땀 / 동요 심화",
          color: "border-orange-500/40 text-orange-300 bg-orange-950/60",
          glow: "shadow-orange-950/40",
        };
      case "panicked":
        return {
          label: "극도의 공황 / 붕괴 위기",
          color: "border-rose-500/60 text-rose-300 bg-rose-950/70 animate-pulse",
          glow: "shadow-rose-950/50",
        };
      case "breakdown":
        return {
          label: "자백 / 멘탈 붕괴",
          color: "border-purple-500/70 text-purple-200 bg-purple-950/80 ring-2 ring-purple-500/50",
          glow: "shadow-purple-950/60",
        };
    }
  };

  const emotionConfig = getEmotionConfig();

  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* Noir Overhead Spotlight Cone */}
      <div className="absolute -top-16 inset-x-12 h-28 bg-gradient-to-b from-amber-100/10 via-amber-200/5 to-transparent blur-xl pointer-events-none" />

      {/* Portrait Container */}
      <div
        className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-700/60 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-2xl transition-all duration-700 ${
          stress > 70
            ? "border-rose-900/60 shadow-rose-950/40"
            : stress > 40
            ? "border-amber-900/50"
            : "border-zinc-800"
        }`}
      >
        {/* Cold Interrogation Room Wall & Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_3px)] pointer-events-none" />

        {/* Dynamic Vignette / Stress Red Pulse */}
        {stress > 65 && (
          <div
            className="absolute inset-0 bg-rose-950/20 mix-blend-color-dodge pointer-events-none animate-pulse"
            style={{ animationDuration: `${Math.max(0.4, 1.4 - (stress / 100))}s` }}
          />
        )}

        {/* Character Illustration SVG with emotion states */}
        <div className="relative w-full h-full flex items-center justify-center pt-8">
          <svg
            viewBox="0 0 400 480"
            className={`w-full h-full drop-shadow-2xl transition-transform duration-500 ${
              emotion === "panicked"
                ? "animate-[wiggle_0.4s_ease-in-out_infinite]"
                : emotion === "sweating"
                ? "scale-[1.02]"
                : emotion === "breakdown"
                ? "translate-y-4 filter brightness-90"
                : "scale-100"
            }`}
          >
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={emotion === "breakdown" ? "#a89f91" : emotion === "sweating" || emotion === "panicked" ? "#e4c2a8" : "#f0d5be"} />
                <stop offset="100%" stopColor={emotion === "breakdown" ? "#7c7265" : emotion === "sweating" ? "#caa185" : "#dcb397"} />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2c2830" />
                <stop offset="100%" stopColor="#121115" />
              </linearGradient>
              <linearGradient id="clothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={suspect.id === "suspect_seo" ? "#381720" : suspect.id === "suspect_han" ? "#1e293b" : "#1e1e24"} />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
              <radialGradient id="shadowGlow" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Background aura */}
            <circle cx="200" cy="180" r="160" fill="url(#shadowGlow)" />

            {/* Body / Clothing (Suit or Blouse) */}
            <path
              d="M100 480 C110 370 140 330 200 330 C260 330 290 370 300 480 Z"
              fill="url(#clothGrad)"
            />

            {/* Collar & Details */}
            {suspect.id === "suspect_seo" ? (
              // Seo Ji-woo's luxury burgundy coat collar & pearl necklace
              <>
                <path
                  d="M165 330 L200 410 L235 330 L220 370 L200 415 L180 370 Z"
                  fill="#541e2d"
                  stroke="#7f263e"
                  strokeWidth="2"
                />
                <circle cx="200" cy="365" r="4" fill="#fdfbf7" />
                <circle cx="192" cy="363" r="3.5" fill="#fdfbf7" />
                <circle cx="208" cy="363" r="3.5" fill="#fdfbf7" />
              </>
            ) : suspect.id === "suspect_han" ? (
              // Han Min-jae's casual jacket
              <path
                d="M170 330 L200 395 L230 330"
                stroke="#334155"
                strokeWidth="4"
                fill="none"
              />
            ) : (
              // Dr. Yoon's lab coat collar
              <path
                d="M160 330 L200 405 L240 330"
                fill="#f1f5f9"
                stroke="#94a3b8"
                strokeWidth="2"
              />
            )}

            {/* Neck */}
            <path
              d="M175 250 L175 340 C185 345 215 345 225 340 L225 250 Z"
              fill="url(#skinGrad)"
            />

            {/* Head Silhouette */}
            <ellipse
              cx="200"
              cy={emotion === "breakdown" ? 235 : 220}
              rx="64"
              ry="76"
              fill="url(#skinGrad)"
            />

            {/* Hair */}
            {suspect.id === "suspect_seo" ? (
              // Seo Ji-woo's sleek updo / bob with loose strands
              <g>
                <path
                  d="M130 220 C130 130 270 130 270 220 C270 235 260 250 255 240 C250 170 150 170 145 240 C140 250 130 235 130 220 Z"
                  fill="url(#hairGrad)"
                />
                {/* Hair Bun */}
                <ellipse cx="200" cy="130" rx="36" ry="24" fill="#18151c" />
                {emotion === "panicked" || emotion === "breakdown" ? (
                  // Disheveled loose strands when panicked
                  <path
                    d="M148 180 Q130 220 142 270 M252 180 Q270 220 258 270"
                    stroke="#1c1920"
                    strokeWidth="3"
                    fill="none"
                  />
                ) : null}
              </g>
            ) : (
              // Modern messy hair
              <path
                d="M135 210 C135 120 265 120 265 210 C265 230 255 240 250 220 C240 150 160 150 150 220 C145 240 135 230 135 210 Z"
                fill="url(#hairGrad)"
              />
            )}

            {/* Eyebrows based on emotion */}
            {emotion === "calm" && (
              <g stroke="#2a2220" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M162 195 Q178 190 190 196" />
                <path d="M210 196 Q222 190 238 195" />
              </g>
            )}
            {emotion === "defensive" && (
              <g stroke="#2a2220" strokeWidth="3.2" strokeLinecap="round" fill="none">
                <path d="M162 196 Q178 194 190 192" />
                <path d="M210 192 Q222 194 238 196" />
              </g>
            )}
            {(emotion === "nervous" || emotion === "sweating") && (
              <g stroke="#2a2220" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M162 192 Q178 195 190 198" />
                <path d="M210 198 Q222 195 238 192" />
              </g>
            )}
            {emotion === "panicked" && (
              <g stroke="#2a2220" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M160 188 Q176 195 190 200" />
                <path d="M210 200 Q224 195 240 188" />
              </g>
            )}
            {emotion === "breakdown" && (
              <g stroke="#3a3230" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M162 210 Q178 214 190 216" />
                <path d="M210 216 Q222 214 238 210" />
              </g>
            )}

            {/* Eyes */}
            {emotion === "breakdown" ? (
              // Closed, weeping eyes
              <g stroke="#3a302a" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M166 226 Q178 234 190 226" />
                <path d="M210 226 Q222 234 234 226" />
                {/* Tears */}
                <path d="M170 232 Q168 250 172 265" stroke="#93c5fd" strokeWidth="1.8" />
                <path d="M228 232 Q230 250 226 265" stroke="#93c5fd" strokeWidth="1.8" />
              </g>
            ) : emotion === "panicked" ? (
              // Wide open terrified pupils
              <g>
                <ellipse cx="178" cy="214" rx="12" ry="11" fill="#fff" />
                <circle cx="178" cy="214" r="5" fill="#1e1816" />
                <circle cx="176" cy="212" r="1.5" fill="#fff" />

                <ellipse cx="222" cy="214" rx="12" ry="11" fill="#fff" />
                <circle cx="222" cy="214" r="5" fill="#1e1816" />
                <circle cx="220" cy="212" r="1.5" fill="#fff" />
              </g>
            ) : emotion === "sweating" || emotion === "nervous" ? (
              // Shifting nervous gaze (looking sideways)
              <g>
                <ellipse cx="178" cy="214" rx="11" ry="8" fill="#fff" />
                <circle cx="174" cy="214" r="5" fill="#2d211d" />
                <circle cx="173" cy="212" r="1.2" fill="#fff" />

                <ellipse cx="222" cy="214" rx="11" ry="8" fill="#fff" />
                <circle cx="218" cy="214" r="5" fill="#2d211d" />
                <circle cx="217" cy="212" r="1.2" fill="#fff" />
              </g>
            ) : (
              // Sharp confident gaze
              <g>
                <ellipse cx="178" cy="214" rx="11" ry="7" fill="#f8fafc" />
                <circle cx="178" cy="214" r="5.5" fill="#2a1f1b" />
                <circle cx="176" cy="212" r="1.5" fill="#fff" />

                <ellipse cx="222" cy="214" rx="11" ry="7" fill="#f8fafc" />
                <circle cx="222" cy="214" r="5.5" fill="#2a1f1b" />
                <circle cx="220" cy="212" r="1.5" fill="#fff" />
              </g>
            )}

            {/* Nose */}
            <path
              d="M198 218 L196 238 L204 239"
              stroke="#b58d74"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mouth */}
            {emotion === "calm" && (
              // Slight arrogant smirk
              <path
                d="M184 256 Q198 259 214 254"
                stroke="#8d3d3d"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
            {emotion === "defensive" && (
              // Tight straight line
              <path
                d="M185 258 L215 258"
                stroke="#783434"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
            {emotion === "nervous" && (
              // Slightly wavy / bitten lip
              <path
                d="M186 258 Q198 261 214 257"
                stroke="#783434"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
            {emotion === "sweating" && (
              // Parted lips, breathing fast
              <ellipse cx="200" cy="260" rx="9" ry="4" fill="#3b1b1b" stroke="#783434" strokeWidth="1.5" />
            )}
            {emotion === "panicked" && (
              // Gritted teeth / open trembling mouth
              <rect x="190" y="255" width="20" height="9" rx="3" fill="#fff" stroke="#5a2222" strokeWidth="2" />
            )}
            {emotion === "breakdown" && (
              // Quivering sad mouth
              <path
                d="M186 270 Q200 262 214 270"
                stroke="#682a2a"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Sweat Drops when Sweating or Panicked */}
            {(emotion === "sweating" || emotion === "panicked") && (
              <g fill="#7dd3fc" opacity="0.85">
                <path d="M245 198 Q247 208 245 214 Q243 208 245 198 Z" />
                <path d="M152 205 Q154 215 152 222 Q150 215 152 205 Z" />
                <path d="M236 240 Q238 248 236 253 Q234 248 236 240 Z" />
              </g>
            )}
          </svg>
        </div>

        {/* Live ECG Vitals Overlay (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-zinc-800 text-xs">
          <Heart
            className={`w-3.5 h-3.5 ${
              stress > 70 ? "text-rose-500 animate-ping" : stress > 40 ? "text-amber-400" : "text-emerald-400"
            }`}
          />
          <span className="font-mono font-bold tracking-wider text-zinc-200">
            {bpm} <span className="text-[10px] text-zinc-400 font-normal">BPM</span>
          </span>
        </div>

        {/* Emotion Badge (Top Left) */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-md flex items-center gap-1.5 shadow-lg ${emotionConfig.color} ${emotionConfig.glow}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {emotionConfig.label}
          </div>
        </div>

        {/* Suspect Nameplate & Role (Bottom Overlay) */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1">
              <span>SUSPECT DOSSIER</span>
              <span className="text-zinc-600">/</span>
              <span className="text-amber-400">{suspect.role}</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 tracking-tight font-serif flex items-center gap-2">
              {suspect.name}
              <span className="text-xs font-mono font-normal text-zinc-400">({suspect.age}세)</span>
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] block text-zinc-400 font-mono uppercase">STRESS INDEX</span>
            <span
              className={`text-lg font-mono font-black ${
                stress >= 80 ? "text-rose-400" : stress >= 50 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {stress}%
            </span>
          </div>
        </div>

        {/* Thinking / Calculating Spinner Overlay */}
        {isThinking && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div className="text-xs font-mono text-amber-200/90 tracking-widest uppercase">
              진술 심리 분석 중...
            </div>
          </div>
        )}
      </div>

      {/* Secret Inner Monologue Box (Player Clue System) */}
      {innerThought && (
        <div className="w-full mt-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-rose-500" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">용의자의 포착된 내면 심리 (포렌식 프로파일러 분석)</span>
          </div>
          <p className="text-xs text-zinc-300 italic font-sans leading-relaxed pl-1">
            "{innerThought}"
          </p>
        </div>
      )}
    </div>
  );
};
