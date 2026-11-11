import React, { useEffect, useState } from "react";
import { Activity, AlertTriangle, Flame, ShieldAlert, Sparkles } from "lucide-react";

interface StressMeterProps {
  currentStress: number;
  lastDelta: number | null;
  evaluation?: string;
}

export const StressMeter: React.FC<StressMeterProps> = ({
  currentStress,
  lastDelta,
  evaluation,
}) => {
  const [displayDelta, setDisplayDelta] = useState<number | null>(null);
  const [deltaKey, setDeltaKey] = useState<number>(0);

  useEffect(() => {
    if (lastDelta !== null && lastDelta !== undefined) {
      setDisplayDelta(lastDelta);
      setDeltaKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setDisplayDelta(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastDelta, currentStress]);

  // Color scheme based on stress level
  const getMeterColor = () => {
    if (currentStress >= 90) return "from-rose-600 via-purple-600 to-pink-500";
    if (currentStress >= 65) return "from-amber-500 via-orange-600 to-rose-600";
    if (currentStress >= 35) return "from-emerald-500 via-amber-500 to-orange-500";
    return "from-teal-500 via-emerald-500 to-cyan-500";
  };

  const getStatusText = () => {
    if (currentStress >= 100) return "【 완전 자백 (CONFESSED) 】 심리적 저항선 전면 붕괴";
    if (currentStress >= 75) return "【 극도의 공황 (PANIC) 】 알리바이 파탄, 횡설수설 시작";
    if (currentStress >= 50) return "【 심각한 동요 (SHAKEN) 】 거짓말 모순점 노출";
    if (currentStress >= 25) return "【 경계심 가동 (DEFENSIVE) 】 수사관 질문에 방어 태세";
    return "【 냉철한 태도 (CALM) 】 철벽 방어 및 여유만만";
  };

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 shadow-xl relative overflow-hidden">
      {/* Background ECG Pulse Line */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center overflow-hidden">
        <svg
          viewBox="0 0 600 80"
          className="w-full h-16 text-rose-500 animate-[pulse_2s_ease-in-out_infinite]"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 40 L 150 40 L 170 15 L 185 65 L 200 40 L 250 40 L 270 20 L 285 60 L 300 40 L 450 40 L 470 10 L 490 70 L 510 40 L 600 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-2.5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-amber-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <span>자백률 / 동요 게이지</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400 font-sans">Confession Meter</span>
              </div>
              <div className="text-xs font-semibold text-zinc-200">{getStatusText()}</div>
            </div>
          </div>

          {/* Large Percentage with animated change badge */}
          <div className="flex items-center gap-2">
            {displayDelta !== null && (
              <span
                key={deltaKey}
                className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded-full border animate-[bounce_1s_ease-in-out] ${
                  displayDelta > 0
                    ? displayDelta >= 20
                      ? "bg-rose-950/80 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50"
                      : "bg-amber-950/80 border-amber-500 text-amber-300"
                    : "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                }`}
              >
                {displayDelta > 0 ? `+${displayDelta}%` : `${displayDelta}%`}
              </span>
            )}
            <div className="flex items-baseline gap-1 font-mono">
              <span
                className={`text-3xl font-black tracking-tight ${
                  currentStress >= 80
                    ? "text-rose-400"
                    : currentStress >= 50
                    ? "text-amber-400"
                    : "text-zinc-100"
                }`}
              >
                {currentStress}
              </span>
              <span className="text-sm font-bold text-zinc-400">%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar with Segments & Target 100% Marker */}
        <div className="relative w-full h-4 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800 shadow-inner">
          {/* Progress fill */}
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getMeterColor()} transition-all duration-700 ease-out shadow-lg relative`}
            style={{ width: `${Math.min(100, Math.max(0, currentStress))}%` }}
          >
            {/* Shimmer light bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
          </div>

          {/* Threshold markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-1 items-center">
            <div className="h-2 w-0.5 bg-zinc-700/60 left-[25%]" style={{ marginLeft: "25%" }} />
            <div className="h-2 w-0.5 bg-zinc-700/60 left-[50%]" style={{ marginLeft: "25%" }} />
            <div className="h-2 w-0.5 bg-zinc-700/60 left-[75%]" style={{ marginLeft: "25%" }} />
          </div>
        </div>

        {/* Progress Footnotes */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 px-1">
          <span>0% 평온</span>
          <span>25% 경계</span>
          <span>50% 알리바이 균열</span>
          <span>75% 패닉</span>
          <span className="text-rose-400 font-bold flex items-center gap-0.5">
            <Flame className="w-3 h-3 text-rose-500 inline" /> 100% 완전 자백
          </span>
        </div>

        {/* Evaluation Banner (Why stress changed) */}
        {evaluation && (
          <div className="mt-1 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-zinc-300 font-medium truncate">{evaluation}</span>
          </div>
        )}
      </div>
    </div>
  );
};
