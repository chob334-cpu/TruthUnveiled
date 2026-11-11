import React, { useEffect, useRef, useState } from "react";
import { InterrogationTurn, SuspectProfile } from "../types/game";
import {
  AlertCircle,
  Eye,
  FileText,
  MessageSquare,
  Scale,
  Sparkles,
  User,
  ShieldAlert,
} from "lucide-react";
import { sound } from "../utils/audio";

interface InterrogationLogProps {
  logs: InterrogationTurn[];
  suspect: SuspectProfile;
  isThinking: boolean;
}

export const InterrogationLog: React.FC<InterrogationLogProps> = ({
  logs,
  suspect,
  isThinking,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState<{ [turnIndex: number]: string }>({});

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isThinking]);

  // Typewriter effect for the latest suspect log
  useEffect(() => {
    if (logs.length === 0) return;
    const lastIndex = logs.length - 1;
    const lastLog = logs[lastIndex];

    if (lastLog.speaker === "suspect" && !typedText[lastIndex]) {
      let currentLength = 0;
      const fullText = lastLog.text;
      const interval = setInterval(() => {
        currentLength += 2;
        if (currentLength >= fullText.length) {
          setTypedText((prev) => ({ ...prev, [lastIndex]: fullText }));
          clearInterval(interval);
        } else {
          setTypedText((prev) => ({ ...prev, [lastIndex]: fullText.slice(0, currentLength) }));
          if (currentLength % 6 === 0) {
            sound.playTypewriterClick();
          }
        }
      }, 25);

      return () => clearInterval(interval);
    }
  }, [logs]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 w-full overflow-y-auto px-4 py-4 space-y-4 font-sans select-text scroll-smooth"
    >
      {logs.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">심문 기록이 비어 있습니다</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              사건 개요와 증거 대장을 확인한 후, 용의자 {suspect.name}의 알리바이 허점을 파고드는
              질문을 던지세요.
            </p>
          </div>
        </div>
      )}

      {logs.map((log, index) => {
        const isDetective = log.speaker === "detective";
        const isLawyer = log.speaker === "lawyer";
        const isSuspect = log.speaker === "suspect";

        const textToShow =
          isSuspect && typedText[index] !== undefined ? typedText[index] : log.text;

        return (
          <div
            key={index}
            className={`flex flex-col gap-1.5 transition-all ${
              isDetective ? "items-end" : "items-start"
            }`}
          >
            {/* Speaker Tag / Header */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 px-1">
              {isDetective && (
                <>
                  <span className="text-amber-400 font-bold">TURN {log.turnNumber}</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-300 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-400" /> 담당 형사
                  </span>
                </>
              )}
              {isSuspect && (
                <>
                  <span className="text-zinc-200 font-bold flex items-center gap-1 font-serif">
                    {suspect.name} ({suspect.role})
                  </span>
                  {log.emotion && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                      {log.emotion.toUpperCase()}
                    </span>
                  )}
                </>
              )}
              {isLawyer && (
                <span className="text-rose-400 font-bold flex items-center gap-1 font-serif">
                  <Scale className="w-3.5 h-3.5" /> 변호인 개입 (강태혁 변호사)
                </span>
              )}
              <span className="text-[10px] text-zinc-400">{log.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg relative ${
                isDetective
                  ? "bg-amber-600/90 text-zinc-950 font-medium rounded-tr-xs border border-amber-500/50"
                  : isLawyer
                  ? "bg-rose-950/80 border border-rose-800 text-rose-100 rounded-tl-xs shadow-rose-950/40"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-xs"
              }`}
            >
              {/* Evidence Tag attachment banner inside Detective bubble */}
              {isDetective && log.evidenceUsed && (
                <div className="mb-2 pb-2 border-b border-amber-700/50 flex items-center gap-1.5 text-xs font-mono font-bold text-amber-950 bg-amber-500/30 px-2 py-1 rounded">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>제시된 물증: [{log.evidenceUsed.name}]</span>
                </div>
              )}

              {/* Spoken Text */}
              <p className="whitespace-pre-wrap">{textToShow}</p>

              {/* Suspect's stress impact pill */}
              {isSuspect && log.stressChange !== undefined && (
                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {log.evaluation || "심리 상태 반응"}
                  </span>
                  <span
                    className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-full ${
                      log.stressChange > 0
                        ? log.stressChange >= 20
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {log.stressChange > 0 ? `동요 +${log.stressChange}%` : `안도 ${log.stressChange}%`}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Typing Indicator for AI Suspect */}
      {isThinking && (
        <div className="flex flex-col items-start gap-1 animate-pulse">
          <div className="text-[11px] font-mono text-zinc-400 px-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>용의자가 진술을 정리하며 표정을 숨기는 중...</span>
          </div>
          <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
    </div>
  );
};
