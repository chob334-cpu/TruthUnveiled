import React, { useState } from "react";
import { EvidenceItem } from "../types/game";
import {
  FileText,
  Flame,
  Footprints,
  Paperclip,
  Receipt,
  Search,
  ShieldAlert,
  Sparkles,
  Video,
  Watch,
  X,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

interface EvidenceDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: EvidenceItem[];
  selectedEvidence: EvidenceItem | null;
  onSelectEvidence: (item: EvidenceItem | null) => void;
}

export const EvidenceDossierModal: React.FC<EvidenceDossierModalProps> = ({
  isOpen,
  onClose,
  evidenceList,
  selectedEvidence,
  onSelectEvidence,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeDetailItem, setActiveDetailItem] = useState<EvidenceItem | null>(
    selectedEvidence || evidenceList[0] || null
  );

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "전체 물증" },
    { id: "weapon", label: "흉기 / 직접물증" },
    { id: "cctv", label: "CCTV / 동선" },
    { id: "document", label: "서류 / 영수증" },
    { id: "trace", label: "감식 / 미세섬유" },
  ];

  const filtered =
    activeCategory === "all"
      ? evidenceList
      : evidenceList.filter((e) => e.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-5 h-5 text-rose-400" />;
      case "Watch":
        return <Watch className="w-5 h-5 text-amber-400" />;
      case "Video":
        return <Video className="w-5 h-5 text-cyan-400" />;
      case "Receipt":
        return <Receipt className="w-5 h-5 text-emerald-400" />;
      case "FileText":
      case "FileCheck":
        return <FileText className="w-5 h-5 text-blue-400" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "Footprints":
        return <Footprints className="w-5 h-5 text-orange-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Top Header / Police Dossier Banner */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  CONFIDENTIAL EVIDENCE DOSSIER
                </span>
                <span className="text-[10px] bg-rose-950 border border-rose-800 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">
                  기밀 증거 보관소
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-100 font-serif">
                사건 증거물 관리 대장
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

        {/* Filter categories */}
        <div className="px-5 py-2.5 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                  : "bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Modal Body: Left List + Right Detail Inspector */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800 overflow-y-auto md:overflow-hidden">
          {/* Left: Evidence Grid / Cards */}
          <div className="md:col-span-5 p-4 overflow-y-auto space-y-2.5 max-h-[50vh] md:max-h-none">
            {filtered.map((item) => {
              const isSelected = selectedEvidence?.id === item.id;
              const isInspecting = activeDetailItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveDetailItem(item)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                    isInspecting
                      ? "bg-zinc-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/40"
                      : "bg-zinc-900/60 hover:bg-zinc-800/50 border-zinc-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 shrink-0">
                      {getIcon(item.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          {item.tag}
                        </span>
                        {item.isSmokingGun && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-600 text-rose-300">
                            ★ 결정적 물증
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-zinc-100 mt-1 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      심문 첨부됨
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Inspection Dossier */}
          <div className="md:col-span-7 p-5 overflow-y-auto flex flex-col justify-between bg-zinc-950/50">
            {activeDetailItem ? (
              <div className="space-y-4">
                {/* Evidence Card Header */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-700">
                        {getIcon(activeDetailItem.iconName)}
                      </div>
                      <div>
                        <span className="text-xs font-mono text-zinc-400">
                          증거물 코드: {activeDetailItem.id}
                        </span>
                        <h3 className="text-base font-bold text-zinc-100">
                          {activeDetailItem.name}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold">
                      {activeDetailItem.tag}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                    {activeDetailItem.description}
                  </p>
                </div>

                {/* Discovery Location */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-zinc-400" />
                    <span>발견 장소 및 취득 경위</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-200">
                    {activeDetailItem.discoveryLocation}
                  </div>
                </div>

                {/* Forensics Lab Report */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>국립과학수사연구원 감식 소견</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {activeDetailItem.forensicNote}
                  </p>
                </div>

                {/* Detective's Contradiction Note */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-700/50">
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>수사관 추리 노트 (용의자 알리바이와의 모순점)</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                    {activeDetailItem.contradictionHint}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
                확인할 증거물을 선택하세요.
              </div>
            )}

            {/* Bottom Actions */}
            {activeDetailItem && (
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                {selectedEvidence?.id === activeDetailItem.id ? (
                  <button
                    onClick={() => {
                      onSelectEvidence(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-rose-700/80 bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 transition-colors"
                  >
                    첨부 해제
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSelectEvidence(activeDetailItem);
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Paperclip className="w-4 h-4" />
                    이 증거를 심문에 제시하기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
