export type SuspectEmotion =
  | "calm"
  | "defensive"
  | "nervous"
  | "sweating"
  | "panicked"
  | "breakdown";

export interface EvidenceItem {
  id: string;
  name: string;
  category: "weapon" | "document" | "cctv" | "trace" | "testimony";
  iconName: string;
  tag: string;
  description: string;
  discoveryLocation: string;
  forensicNote: string;
  contradictionHint: string;
  isSmokingGun?: boolean;
}

export interface SuspectProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  personality: string;
  voiceStyle: string;
  avatarSeed: string;
  initialAlibi: string;
  hiddenMotive: string;
  crimeTruth: string;
}

export interface CrimeCase {
  id: string;
  title: string;
  subtitle: string;
  difficulty: "Easy" | "Normal" | "Hard";
  victim: {
    name: string;
    age: number;
    occupation: string;
    causeOfDeath: string;
    timeEstimated: string;
    location: string;
  };
  summary: string;
  detailedBriefing: string[];
  suspect: SuspectProfile;
  lawyer: {
    name: string;
    firm: string;
    description: string;
  };
  evidenceList: EvidenceItem[];
  suggestedTactics: Array<{
    label: string;
    prompt: string;
    evidenceId?: string;
  }>;
  coreContradictions: string[];
}

export interface InterrogationTurn {
  turnNumber: number;
  speaker: "detective" | "suspect" | "lawyer";
  text: string;
  evidenceUsed?: EvidenceItem;
  emotion?: SuspectEmotion;
  stressChange?: number;
  newStressLevel?: number;
  evaluation?: string;
  innerThought?: string;
  timestamp: string;
}

export interface InterrogationResponse {
  suspectDialogue: string;
  innerThought: string;
  emotion: SuspectEmotion;
  stressChange: number;
  newStressLevel: number;
  evaluation: string;
  lawyerIntervention: {
    triggered: boolean;
    dialogue: string;
    warningType: "objection" | "advice" | "coaching" | "shaken";
  };
  isFinalConfession: boolean;
  discoveredClue?: string;
}
