import React from "react";
import { AlertCircle, BookOpen, Scale, ShieldAlert, UserCheck } from "lucide-react";

interface LawyerBenchProps {
  lawyer: {
    name: string;
    firm: string;
    description: string;
  };
  intervention?: {
    triggered: boolean;
    dialogue: string;
    warningType: "objection" | "advice" | "coaching" | "shaken";
  };
}

export const LawyerBench: React.FC<LawyerBenchProps> = ({ lawyer, intervention }) => {
  const isObjection = intervention?.triggered && intervention?.warningType === "objection";
  const isShaken = intervention?.triggered && intervention?.warningType === "shaken";

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 shadow-xl relative overflow-hidden">
      {/* Dramatic Objection Stamp Overlay */}
      {isObjection && (
        <div className="absolute top-2 right-4 rotate-6 border-4 border-rose-600 bg-rose-950/80 text-rose-200 px-3 py-1 font-serif font-black tracking-widest text-sm rounded shadow-2xl animate-[ping_0.6s_ease-out_1]">
          OBJECTION! 이의 있음!
        </div>
      )}

      <div className="flex items-start gap-3.5">
        {/* Lawyer Avatar / Badge */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 flex items-center justify-center text-amber-300 shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-zinc-900 flex items-center justify-center">
            <span className="text-[9px] font-bold text-zinc-950">法</span>
          </div>
        </div>

        {/* Lawyer Info & Dialogue */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-200 font-serif">{lawyer.name} 변호사</span>
              <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {lawyer.firm}
              </span>
            </div>

            <span
              className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                isObjection
                  ? "bg-rose-950/60 border-rose-500 text-rose-300"
                  : isShaken
                  ? "bg-purple-950/60 border-purple-500 text-purple-300"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400"
              }`}
            >
              {isObjection ? "이의 제기 중" : isShaken ? "동요 / 침묵" : "심문 입회 중"}
            </span>
          </div>

          {/* Dialogue or Status */}
          {intervention?.triggered ? (
            <div
              className={`mt-2 p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                isObjection
                  ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                  : isShaken
                  ? "bg-purple-950/40 border-purple-800/80 text-purple-200"
                  : "bg-zinc-900/90 border-zinc-700/80 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-[11px] mb-1 opacity-90">
                {isObjection ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-400 uppercase font-mono">형사소송법상 이의 신청</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400 uppercase font-mono">변호인 접견 및 조언</span>
                  </>
                )}
              </div>
              <p className="font-sans italic">"{intervention.dialogue}"</p>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mt-0.5">
              {lawyer.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
