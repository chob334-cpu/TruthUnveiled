import React, { useState } from "react";
import { EvidenceItem } from "../types/game";
import {
  Clock,
  CornerDownLeft,
  FileQuestion,
  FolderOpen,
  Paperclip,
  Send,
  Sparkles,
  X,
  AlertTriangle,
} from "lucide-react";

interface DetectiveConsoleProps {
  currentTurn: number;
  maxTurns: number;
  selectedEvidence: EvidenceItem | null;
  onClearEvidence: () => void;
  onOpenEvidenceModal: () => void;
  onOpenCaseModal: () => void;
  onSubmitQuestion: (question: string) => void;
  isThinking: boolean;
  suggestedTactics: Array<{
    label: string;
    prompt: string;
    evidenceId?: string;
  }>;
  onSelectTactic: (tactic: { label: string; prompt: string; evidenceId?: string }) => void;
}

export const DetectiveConsole: React.FC<DetectiveConsoleProps> = ({
  currentTurn,
  maxTurns,
  selectedEvidence,
  onClearEvidence,
  onOpenEvidenceModal,
  onOpenCaseModal,
  onSubmitQuestion,
  isThinking,
  suggestedTactics,
  onSelectTactic,
}) => {
  const [inputText, setInputText] = useState("");
  const turnsLeft = maxTurns - currentTurn + 1;
  const isUrgent = turnsLeft <= 3;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSubmitQuestion(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 p-3 sm:p-4 shadow-2xl relative z-20">
      {/* Top Bar: Turns Count & Quick Modals & Tactic chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        {/* Turns counter pill */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
              isUrgent
                ? "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse"
                : "bg-zinc-900 border-zinc-700 text-zinc-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              TURN {currentTurn} / {maxTurns}
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">
              ({turnsLeft}회 남음)
            </span>
          </div>

          {isUrgent && (
            <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              구속 기한 만료 임박!
            </span>
          )}
        </div>

        {/* Dossier Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCaseModal}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 flex items-center gap-1.5 transition-colors"
          >
            <FileQuestion className="w-3.5 h-3.5 text-amber-400" />
            <span>사건 개요서</span>
          </button>

          <button
            type="button"
            onClick={onOpenEvidenceModal}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              selectedEvidence
                ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-sm"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>증거 보관함</span>
            {selectedEvidence && (
              <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Suggested Tactics Bar */}
      <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" /> 추천 심문 전술:
        </span>
        {suggestedTactics.map((tac, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setInputText(tac.prompt);
              onSelectTactic(tac);
            }}
            className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/40 text-[11px] whitespace-nowrap transition-all"
          >
            {tac.label}
          </button>
        ))}
      </div>

      {/* Evidence Attached Slot */}
      {selectedEvidence && (
        <div className="mb-2.5 p-2 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 truncate">
            <span className="p-1 rounded bg-amber-500 text-zinc-950 font-mono font-bold text-[10px]">
              {selectedEvidence.id}
            </span>
            <span className="font-bold text-amber-200 truncate">
              [제시할 증거] {selectedEvidence.name}
            </span>
            <span className="text-zinc-400 text-[11px] hidden sm:inline">
              ({selectedEvidence.tag})
            </span>
          </div>

          <button
            type="button"
            onClick={onClearEvidence}
            className="p-1 rounded-lg hover:bg-amber-900/40 text-amber-400 hover:text-amber-200"
            title="증거 첨부 취소"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="relative flex-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedEvidence
                ? `[${selectedEvidence.name}] 증거를 제시하며 용의자의 모순을 추궁하세요...`
                : "용의자에게 질문을 입력하거나 위의 추천 전술을 선택하세요. (Enter 전송)"
            }
            rows={2}
            disabled={isThinking}
            className="w-full resize-none rounded-xl bg-zinc-900/90 border border-zinc-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 p-3 pr-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none transition-all disabled:opacity-50"
          />

          {/* Quick Evidence Attachment trigger on the right side of textarea */}
          <button
            type="button"
            onClick={onOpenEvidenceModal}
            title="증거 선택"
            className="absolute right-2.5 bottom-3.5 p-1 rounded-md text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="h-[58px] px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all shrink-0"
        >
          <div className="flex items-center gap-1">
            <span>심문하기</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono font-normal opacity-80">Enter</span>
        </button>
      </form>
    </div>
  );
};
