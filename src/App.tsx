import React, { useState, useEffect } from "react";
import { CASES_DATA } from "./data/cases";
import {
  CrimeCase,
  EvidenceItem,
  InterrogationResponse,
  InterrogationTurn,
  SuspectEmotion,
} from "./types/game";
import { SuspectPortrait } from "./components/SuspectPortrait";
import { StressMeter } from "./components/StressMeter";
import { LawyerBench } from "./components/LawyerBench";
import { InterrogationLog } from "./components/InterrogationLog";
import { DetectiveConsole } from "./components/DetectiveConsole";
import { EvidenceDossierModal } from "./components/EvidenceDossierModal";
import { CaseBriefingModal } from "./components/CaseBriefingModal";
import { GameOverModal } from "./components/GameOverModal";
import { sound } from "./utils/audio";
import {
  FileText,
  FolderOpen,
  HelpCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function App() {
  // Case selection
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case_penthouse");
  const currentCase = CASES_DATA.find((c) => c.id === selectedCaseId) || CASES_DATA[0];

  // Game state
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const maxTurns = 15;
  const [currentStress, setCurrentStress] = useState<number>(0);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<SuspectEmotion>("calm");
  const [innerThought, setInnerThought] = useState<string>(
    "(시간만 잘 끌면 돼. 겉으로는 태연하게 굴어야 이 얼치기 형사들이 물러설 테니까.)"
  );
  const [evaluation, setEvaluation] = useState<string>("심문 대기 중 - 알리바이의 모순을 지적하세요.");
  const [evidenceUsedSet, setEvidenceUsedSet] = useState<Set<string>>(new Set());

  // Selected Evidence for current interrogation turn
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  // Lawyer intervention
  const [lawyerIntervention, setLawyerIntervention] = useState<{
    triggered: boolean;
    dialogue: string;
    warningType: "objection" | "advice" | "coaching" | "shaken";
  }>({
    triggered: true,
    dialogue: `제 의뢰인 ${currentCase.suspect.name} 씨는 참고인 신분으로 자진 출석했습니다. 근거 없는 억측이나 강압적 수사는 즉각 이의를 제기할 것입니다.`,
    warningType: "advice",
  });

  // Interrogation log transcript
  const [logs, setLogs] = useState<InterrogationTurn[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Modals
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [finalConfessionText, setFinalConfessionText] = useState<string>("");

  // Initialize Case
  const initCase = (caseObj: CrimeCase) => {
    setCurrentTurn(1);
    setCurrentStress(0);
    setLastDelta(null);
    setEmotion("calm");
    setInnerThought(
      "(시간만 잘 끌면 돼. 겉으로는 태연하게 굴어야 이 얼치기 형사들이 물러설 테니까.)"
    );
    setEvaluation("심문 대기 중 - 알리바이의 모순을 지적하세요.");
    setEvidenceUsedSet(new Set());
    setSelectedEvidence(null);
    setIsGameOver(false);
    setIsVictory(false);
    setFinalConfessionText("");
    sound.stopHeartbeat();

    setLawyerIntervention({
      triggered: true,
      dialogue: `제 의뢰인 ${caseObj.suspect.name} 씨는 참고인 신분으로 자진 출석했습니다. 근거 없는 억측이나 강압적 수사는 즉각 이의를 제기할 것입니다.`,
      warningType: "advice",
    });

    // Initial greeting transcript
    const initialLogs: InterrogationTurn[] = [
      {
        turnNumber: 0,
        speaker: "suspect",
        text: `형사님, 전 고인 강도윤 이사장님을 진심으로 존경하던 사람입니다. 사건 당일 밤 저는 강남 파인다이닝 식당에 계속 있었고, 영수증도 다 제출했습니다. 더 이상 제 결백을 의심하지 말아 주십시오.`,
        emotion: "calm",
        timestamp: "23:45",
      },
    ];
    setLogs(initialLogs);
  };

  useEffect(() => {
    initCase(currentCase);
  }, [selectedCaseId]);

  // Handle Question Submission
  const handleInterrogate = async (questionText: string) => {
    if (isThinking || isGameOver) return;
    setIsThinking(true);

    const usedEvidence = selectedEvidence;

    // 1. Append Detective's question to transcript
    const nowTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    const detectiveTurn: InterrogationTurn = {
      turnNumber: currentTurn,
      speaker: "detective",
      text: questionText,
      evidenceUsed: usedEvidence || undefined,
      timestamp: nowTime,
    };

    setLogs((prev) => [...prev, detectiveTurn]);

    if (usedEvidence) {
      setEvidenceUsedSet((prev) => new Set(prev).add(usedEvidence.id));
    }

    try {
      // 2. Call backend /api/interrogate (which queries Gemini API)
      const res = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: currentCase.id,
          suspectId: currentCase.suspect.id,
          caseDetails: {
            title: currentCase.title,
            victim: `${currentCase.victim.name} (${currentCase.victim.occupation})`,
            timeOfCrime: currentCase.victim.timeEstimated,
            location: currentCase.victim.location,
            suspectName: currentCase.suspect.name,
            suspectRole: currentCase.suspect.role,
            suspectPersonality: currentCase.suspect.personality,
            suspectAlibi: currentCase.suspect.initialAlibi,
            hiddenTruth: currentCase.suspect.crimeTruth,
            motive: currentCase.suspect.hiddenMotive,
            coreContradictions: currentCase.coreContradictions,
          },
          evidenceAttached: usedEvidence
            ? {
                id: usedEvidence.id,
                name: usedEvidence.name,
                type: usedEvidence.category,
                description: usedEvidence.description,
                forensicNote: usedEvidence.forensicNote,
                contradicts: usedEvidence.contradictionHint,
              }
            : null,
          question: questionText,
          currentStress,
          turnNumber: currentTurn,
          maxTurns,
          history: logs.map((l) => ({
            speaker: l.speaker,
            text: l.text,
            evidenceUsed: l.evidenceUsed?.name,
            stressChange: l.stressChange,
          })),
        }),
      });

      const data: InterrogationResponse = await res.json();

      // 3. Update Audio & Visual feedback
      if (data.stressChange >= 20) {
        sound.playCriticalHit();
      } else if (data.stressChange < 0) {
        sound.playReliefTone();
      }

      if (data.lawyerIntervention?.triggered && data.lawyerIntervention.warningType === "objection") {
        setTimeout(() => sound.playObjectionSting(), 300);
      }

      // Update stress meter & heartbeat
      setCurrentStress(data.newStressLevel);
      setLastDelta(data.stressChange);
      setEmotion(data.emotion);
      setInnerThought(data.innerThought);
      setEvaluation(data.evaluation);
      sound.updateHeartbeat(data.newStressLevel);

      // 4. Update Lawyer state
      if (data.lawyerIntervention) {
        setLawyerIntervention(data.lawyerIntervention);
      }

      // 5. Add Lawyer comment to logs if triggered
      if (data.lawyerIntervention?.triggered) {
        const lawyerLog: InterrogationTurn = {
          turnNumber: currentTurn,
          speaker: "lawyer",
          text: data.lawyerIntervention.dialogue,
          timestamp: nowTime,
        };
        setLogs((prev) => [...prev, lawyerLog]);
      }

      // 6. Add Suspect response to transcript
      const suspectLog: InterrogationTurn = {
        turnNumber: currentTurn,
        speaker: "suspect",
        text: data.suspectDialogue,
        emotion: data.emotion,
        stressChange: data.stressChange,
        newStressLevel: data.newStressLevel,
        evaluation: data.evaluation,
        innerThought: data.innerThought,
        timestamp: nowTime,
      };
      setLogs((prev) => [...prev, suspectLog]);

      // Reset selected evidence slot for next question
      setSelectedEvidence(null);

      // Check win/loss conditions
      if (data.isFinalConfession || data.newStressLevel >= 100) {
        setIsVictory(true);
        setFinalConfessionText(data.suspectDialogue);
        setIsGameOver(true);
      } else if (currentTurn >= maxTurns) {
        setIsVictory(false);
        setIsGameOver(true);
      } else {
        setCurrentTurn((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Interrogation failed:", err);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Police Header Bar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif font-black text-sm">
            審
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                CRIMINAL INVESTIGATION DIVISION
              </span>
              <span className="text-[9px] bg-rose-950 border border-rose-800 text-rose-300 px-1.5 py-0.2 rounded font-mono">
                LIVE INTERROGATION
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight font-serif truncate">
              Project: Truth Unveiled (진실 추적자)
            </h1>
          </div>
        </div>

        {/* Case selector dropdown & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Case Selector */}
          <div className="relative">
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-medium focus:outline-none focus:border-amber-500 cursor-pointer pr-7 appearance-none"
            >
              {CASES_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.difficulty})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm"
            }`}
            title={isMuted ? "음소거 해제 (오디오 활성화)" : "음소거"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Case Restart */}
          <button
            onClick={() => initCase(currentCase)}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="사건 처음부터 다시 시작"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Interrogation Room Layout */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Ambient Room Spotlight Lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT PANE: Suspect Face-Off & Psychological Meters (Desktop 42%, Mobile top) */}
        <section className="lg:w-[42%] border-b lg:border-b-0 lg:border-r border-zinc-800/80 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto bg-zinc-950/60 backdrop-blur-sm space-y-4">
          {/* Suspect Visual Portrait & Inner Monologue */}
          <SuspectPortrait
            suspect={currentCase.suspect}
            emotion={emotion}
            stress={currentStress}
            innerThought={innerThought}
            isThinking={isThinking}
          />

          {/* Stress / Confession Meter */}
          <StressMeter
            currentStress={currentStress}
            lastDelta={lastDelta}
            evaluation={evaluation}
          />

          {/* Defense Attorney Bench */}
          <LawyerBench
            lawyer={currentCase.lawyer}
            intervention={lawyerIntervention}
          />
        </section>

        {/* RIGHT PANE: Interrogation Transcript & Detective Controls (Desktop 58%) */}
        <section className="flex-1 flex flex-col justify-between min-h-0 bg-zinc-950/40 relative">
          {/* Interrogation Logs Transcript */}
          <InterrogationLog
            logs={logs}
            suspect={currentCase.suspect}
            isThinking={isThinking}
          />

          {/* Detective Console (Input, Turn Count, Tactics, Evidence Injection) */}
          <DetectiveConsole
            currentTurn={currentTurn}
            maxTurns={maxTurns}
            selectedEvidence={selectedEvidence}
            onClearEvidence={() => setSelectedEvidence(null)}
            onOpenEvidenceModal={() => setIsEvidenceModalOpen(true)}
            onOpenCaseModal={() => setIsCaseModalOpen(true)}
            onSubmitQuestion={handleInterrogate}
            isThinking={isThinking}
            suggestedTactics={currentCase.suggestedTactics}
            onSelectTactic={(tac) => {
              if (tac.evidenceId) {
                const found = currentCase.evidenceList.find((e) => e.id === tac.evidenceId);
                if (found) setSelectedEvidence(found);
              }
            }}
          />
        </section>
      </main>

      {/* MODAL 1: Evidence Dossier Modal */}
      <EvidenceDossierModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        evidenceList={currentCase.evidenceList}
        selectedEvidence={selectedEvidence}
        onSelectEvidence={(item) => setSelectedEvidence(item)}
      />

      {/* MODAL 2: Case Briefing Modal */}
      <CaseBriefingModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        caseData={currentCase}
      />

      {/* MODAL 3: Game Over / Victory Modal */}
      <GameOverModal
        isOpen={isGameOver}
        isVictory={isVictory}
        caseData={currentCase}
        suspect={currentCase.suspect}
        confessionDialogue={finalConfessionText}
        turnsUsed={currentTurn}
        maxTurns={maxTurns}
        evidenceUsedCount={evidenceUsedSet.size}
        onRestart={() => initCase(currentCase)}
        onSelectCase={(id) => {
          setSelectedCaseId(id);
          setIsGameOver(false);
        }}
        allCases={CASES_DATA}
      />
    </div>
  );
}
