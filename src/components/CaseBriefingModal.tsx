import React, { useState } from "react";
import { CrimeCase } from "../types/game";
import {
  AlertCircle,
  Clock,
  FileText,
  MapPin,
  Shield,
  User,
  X,
  Scale,
  Crosshair,
} from "lucide-react";

interface CaseBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: CrimeCase;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "victim" | "suspect">("summary");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-950 border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  OFFICIAL POLICE DOSSIER
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                  사건번호 #2026-KR-701
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-100 font-serif">
                {caseData.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-5 py-2 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "summary"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300"
            }`}
          >
            수사 개요 및 현장 정보
          </button>
          <button
            onClick={() => setActiveTab("victim")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "victim"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300"
            }`}
          >
            피해자 정보 & 부검 소견
          </button>
          <button
            onClick={() => setActiveTab("suspect")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "suspect"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300"
            }`}
          >
            용의자 프로필 & 초기 진술
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  사건 브리핑 개요
                </h4>
                <p>{caseData.summary}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  현장 수사팀 보고 사항
                </h4>
                <div className="space-y-2">
                  {caseData.detailedBriefing.map((line, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-start gap-2.5"
                    >
                      <Crosshair className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200">
                💡 <span className="font-bold">수사 팁:</span> 용의자가 주장하는 식당 알리바이와
                발견된 시계의 정지 시각, 그리고 주차장 CCTV 시간을 대조하여 허점을 찌르세요.
              </div>
            </div>
          )}

          {activeTab === "victim" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500 block font-mono">성명 및 연령</span>
                  <span className="font-bold text-zinc-100 text-sm">
                    {caseData.victim.name} ({caseData.victim.age}세)
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono">직업 / 신분</span>
                  <span className="font-bold text-zinc-100">{caseData.victim.occupation}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-zinc-500 block font-mono">사체 발견 장소</span>
                  <span className="font-bold text-zinc-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {caseData.victim.location}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-zinc-500 block font-mono">사망 추정 시각</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {caseData.victim.timeEstimated}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-1.5">
                  부검 감정 소견서 (사인)
                </h4>
                <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
                  {caseData.victim.causeOfDeath}. 사체 우측 손톱 밑에서 가해자의 것으로 추정되는
                  미세 섬유가 채취되었으며, 서재 테이블 위에는 2개의 와인잔이 놓여 있어 면식범의
                  우발적 범행 가능성이 매우 높음.
                </p>
              </div>
            </div>
          )}

          {activeTab === "suspect" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 font-serif">
                      {caseData.suspect.name} ({caseData.suspect.age}세)
                    </h3>
                    <span className="text-xs text-amber-400 font-mono">
                      {caseData.suspect.role}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-500 font-mono block">심리 성향 / 페르소나</span>
                    <p className="text-zinc-300 mt-0.5">{caseData.suspect.personality}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono block">진술 태도 및 어조</span>
                    <p className="text-zinc-300 mt-0.5">{caseData.suspect.voiceStyle}</p>
                  </div>
                </div>
              </div>

              {/* Official Alibi */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  용의자의 공식 진술 (알리바이)
                </h4>
                <blockquote className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 italic text-zinc-200">
                  "{caseData.suspect.initialAlibi}"
                </blockquote>
              </div>

              {/* Lawyer Info */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    동석 변호인: {caseData.lawyer.name}
                  </div>
                  <div className="text-[11px] text-zinc-400">{caseData.lawyer.firm}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors"
          >
            심문 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
