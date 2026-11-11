import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CrimeCase, SuspectProfile } from "../types/game";
import {
  Award,
  CheckCircle2,
  FileCheck2,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { sound } from "../utils/audio";

interface GameOverModalProps {
  isOpen: boolean;
  isVictory: boolean;
  caseData: CrimeCase;
  suspect: SuspectProfile;
  confessionDialogue?: string;
  turnsUsed: number;
  maxTurns: number;
  evidenceUsedCount: number;
  onRestart: () => void;
  onSelectCase: (caseId: string) => void;
  allCases: CrimeCase[];
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory,
  caseData,
  suspect,
  confessionDialogue,
  turnsUsed,
  maxTurns,
  evidenceUsedCount,
  onRestart,
  onSelectCase,
  allCases,
}) => {
  useEffect(() => {
    if (isOpen && isVictory) {
      sound.playVictoryTheme();
      // Fire victory confetti bursts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#d97706", "#ef4444", "#8b5cf6"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    }
  }, [isOpen, isVictory]);

  if (!isOpen) return null;

  // Calculate detective rank
  const calculateRank = () => {
    if (!isVictory) return { rank: "F", title: "수사 실패 (영장 기각)", color: "text-zinc-500" };
    if (turnsUsed <= 6) return { rank: "S", title: "전설의 명탐정 (완벽한 심문)", color: "text-amber-400" };
    if (turnsUsed <= 10) return { rank: "A", title: "베테랑 강력계 반장", color: "text-purple-400" };
    if (turnsUsed <= 13) return { rank: "B", title: "예리한 강력반 형사", color: "text-blue-400" };
    return { rank: "C", title: "간신히 자백 확보", color: "text-emerald-400" };
  };

  const rankInfo = calculateRank();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden text-zinc-100 flex flex-col gap-5">
        {/* Top Status Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          {isVictory ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>
              <div className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                CASE SOLVED • VERDICT GUILTY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-zinc-100">
                진실 규명 성공! 용의자 완전 자백
              </h2>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="text-xs font-mono tracking-widest text-rose-400 uppercase">
                INVESTIGATION FAILED • TIME LIMIT EXCEEDED
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-zinc-100">
                심문 시간 초과 / 용의자 석방
              </h2>
            </>
          )}
        </div>

        {/* Detective Rank & Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">수사 등급</span>
            <div className={`text-2xl font-black font-serif ${rankInfo.color}`}>
              {rankInfo.rank}
            </div>
            <span className="text-[10px] text-zinc-400">{rankInfo.title}</span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">소요 턴 수</span>
            <div className="text-2xl font-black font-mono text-zinc-200">
              {turnsUsed} <span className="text-xs font-normal text-zinc-500">/ {maxTurns}</span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {isVictory ? `${maxTurns - turnsUsed}턴 절약` : "턴 소진"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">제시된 물증</span>
            <div className="text-2xl font-black font-mono text-amber-400">
              {evidenceUsedCount} <span className="text-xs font-normal text-zinc-500">개</span>
            </div>
            <span className="text-[10px] text-zinc-400">모순 정밀 타격</span>
          </div>
        </div>

        {/* Final Confession / Lawyer Gloating Statement */}
        {isVictory ? (
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/60 relative">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-300 font-bold uppercase">
              <FileCheck2 className="w-4 h-4 text-purple-400" />
              <span>녹음된 용의자의 최종 자백 조서 (Confession Tape)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed font-sans">
              "{confessionDialogue ||
                `...모든 게 끝났군요. 그래요, 제가 죽였습니다. 이사장이 내 위작 장부를 폭로하겠다며 평생 쌓은 내 명예를 망가뜨리려 했어요... 칼을 든 건 우발적이었지만, 더 이상 거짓말을 숨길 수가 없네요.`}"
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 text-xs text-rose-200 leading-relaxed">
            <span className="font-bold block mb-1 text-rose-300 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              변호인 강태혁의 최후 통첩:
            </span>
            "수사관님, 체포 영장 기한이 만료될 때까지 자백도, 명백한 혐의 입증도 해내지 못하셨습니다.
            제 의뢰인 {suspect.name} 씨는 지금 즉시 귀가 조치됩니다. 절차적 권리를 침해한 것에
            대해서는 법적 책임을 묻겠습니다."
          </div>
        )}

        {/* Case Switcher / Replay */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>다른 미제 살인 사건 수사하기:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {allCases.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  c.id === caseData.id
                    ? "bg-amber-500/10 border-amber-500/60 text-amber-200"
                    : "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300"
                }`}
              >
                <div className="font-bold truncate">{c.title}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">난이도: {c.difficulty}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            사건 처음부터 다시 심문하기
          </button>
        </div>
      </div>
    </div>
  );
};
