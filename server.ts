import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gen AI client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface InterrogationRequestBody {
  caseId: string;
  suspectId: string;
  caseDetails: {
    title: string;
    victim: string;
    timeOfCrime: string;
    location: string;
    suspectName: string;
    suspectRole: string;
    suspectPersonality: string;
    suspectAlibi: string;
    hiddenTruth: string;
    motive: string;
    coreContradictions: string[];
  };
  evidenceAttached?: {
    id: string;
    name: string;
    type: string;
    description: string;
    forensicNote: string;
    contradicts: string;
  } | null;
  question: string;
  currentStress: number;
  turnNumber: number;
  maxTurns: number;
  history: Array<{
    speaker: "detective" | "suspect" | "lawyer";
    text: string;
    evidenceUsed?: string;
    stressChange?: number;
  }>;
}

// Fallback intelligent simulation in case API key is missing or quota exhausted
function getIntelligentFallbackResponse(body: InterrogationRequestBody) {
  const q = body.question.toLowerCase();
  const ev = body.evidenceAttached;
  let stressDelta = 2;
  let emotion = "calm";
  let lawyerObjection = false;
  let lawyerText = "";
  let evaluation = "일반적인 질문으로 용의자가 태연하게 답변합니다.";
  let suspectDialogue = "";
  let innerThought = "";

  if (ev) {
    if (ev.id.includes("CCTV") || ev.id.includes("KNIFE") || ev.id.includes("FORGERY") || ev.id.includes("FIBER")) {
      stressDelta = 26;
      emotion = body.currentStress + stressDelta > 80 ? "panicked" : "sweating";
      evaluation = `결정적인 물증 [${ev.name}]이(가) 제시되어 알리바이의 핵심 모순이 탄로났습니다!`;
      suspectDialogue = `...그, 그게 왜 형사님 손에 있는 거죠?! 그건 분명... 아니, 제 말은... 강도윤 이사장님이 자초한 일이에요! 전 그냥 이야기를 나누러 갔을 뿐이라고요!`;
      innerThought = `(젠장... 그 증거가 남아있을 리가 없는데! 더 이상 변명할 구석이 좁아지고 있어...)`;
      lawyerObjection = true;
      lawyerText = `의뢰인님! 더 이상 한마디도 하지 마십시오! 형사님, 이건 명백한 심리적 유도 압박입니다!`;
    } else {
      stressDelta = 12;
      emotion = "defensive";
      evaluation = `관련 증거 [${ev.name}] 제시로 용의자의 방어벽이 흔들리기 시작합니다.`;
      suspectDialogue = `그 서류가 저와 무슨 상관이라는 거죠? 전 단순히 피해자와 업무적 관계였을 뿐입니다. 억측하지 마세요.`;
      innerThought = `(저 자식들이 어디까지 알고 있는 거지? 눈치를 채지 못하게 표정을 관리해야 해.)`;
    }
  } else if (q.includes("알리바이") || q.includes("시간") || q.includes("목격") || q.includes("거짓말") || q.includes("영수증") || q.includes("왜")) {
    stressDelta = 10;
    emotion = "nervous";
    evaluation = "알리바이의 미심쩍은 부분을 정곡으로 찔렀습니다.";
    suspectDialogue = `그 시간엔 말씀드렸듯이 식당에 있었습니다. 바쁜 큐레이터가 사적인 일정을 일일이 기억하고 설명해야 합니까?`;
    innerThought = `(영수증 서명이나 동선이 어긋난 걸 눈치챈 건가? 차분하게 굴어야 해.)`;
  } else if (q.includes("죽였") || q.includes("살인자") || q.includes("자백해") || q.includes("범인")) {
    stressDelta = -4;
    emotion = "calm";
    evaluation = "물증 없는 원색적 비난에 용의자가 오히려 여유를 찾고 안도합니다.";
    suspectDialogue = `증거도 없이 사람을 살인범 취급하시는군요. 대한민국 경찰의 수사 수준이 이 정도밖에 안 됩니까?`;
    innerThought = `(풋, 헛다리를 짚고 있군. 아직 결정적인 건 아무것도 못 찾았다는 뜻이야.)`;
    lawyerObjection = true;
    lawyerText = `형사님, 형사소송법상 무죄추정의 원칙을 무시하고 모욕적인 혐의를 씌우시면 즉각 감찰실에 진정서를 넣겠습니다!`;
  } else {
    stressDelta = 3;
    emotion = "calm";
    suspectDialogue = `이미 수차례 진술서에 적어낸 내용입니다. 더 물어보실 게 없다면 제 변호사와 말씀하시죠.`;
    innerThought = `(시간만 끌면 증거 불충분으로 풀려날 수 있어.)`;
  }

  const newStress = Math.min(100, Math.max(0, body.currentStress + stressDelta));
  const isFinalConfession = newStress >= 100;

  if (isFinalConfession) {
    emotion = "breakdown";
    suspectDialogue = `...다 끝났군요. 그래요, 제가 죽였습니다! 그 인간이 내 위작 전시를 폭로하겠다며 평생 모은 명예를 짓밟으려 했다고요! 칼을 든 건 우발적이었어요... 제발, 절 내버려 둬요...`;
    innerThought = `(이제 모든 게 끝났다... 더 이상 숨길 힘조차 없어.)`;
    lawyerText = `...지우 씨?! 이런... 더 이상의 진술은 중단합니다...`;
  }

  return {
    suspectDialogue,
    innerThought,
    emotion,
    stressChange: stressDelta,
    newStressLevel: newStress,
    evaluation,
    lawyerIntervention: {
      triggered: lawyerObjection || body.turnNumber % 3 === 0,
      dialogue: lawyerText || "의뢰인님, 불필요한 추측성 답변은 삼가시고 묵비권을 행사할 수 있음을 상기하십시오.",
      warningType: lawyerObjection ? "objection" : "advice",
    },
    isFinalConfession,
    discoveredClue: ev ? `용의자가 ${ev.name}의 존재에 대해 극심한 동요를 보이며 관련 진술을 번복함.` : undefined,
  };
}

// Interrogation API Route
app.post("/api/interrogate", async (req, res) => {
  try {
    const body: InterrogationRequestBody = req.body;
    const { caseDetails, evidenceAttached, question, currentStress, turnNumber, maxTurns, history } = body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Using intelligent fallback simulation.");
      const fallback = getIntelligentFallbackResponse(body);
      return res.json(fallback);
    }

    // Build the system prompt with deep psychological murder mystery roleplay instructions
    const systemInstruction = `
당신은 한국의 정통 추리 수사 시뮬레이션 게임 'Project: Truth Unveiled (진실 추적자)'의 AI 심문 엔진입니다.
당신은 살인 사건의 유일한 용의자이자 진범인 [${caseDetails.suspectName}]과 그를 조력하는 변호사 [강태혁]을 동시에 롤플레잉하며, 플레이어(형사/탐정)의 심문에 대한 심리 반응과 수치를 산출해야 합니다.

[사건 정보]
- 사건명: ${caseDetails.title}
- 피해자: ${caseDetails.victim}
- 범행 시각: ${caseDetails.timeOfCrime}
- 현장: ${caseDetails.location}
- 용의자: ${caseDetails.suspectName} (${caseDetails.suspectRole})
- 성격/페르소나: ${caseDetails.suspectPersonality}
- 용의자의 공식 거짓 알리바이: "${caseDetails.suspectAlibi}"
- 숨겨진 진실: ${caseDetails.hiddenTruth}
- 범행 동기: ${caseDetails.motive}
- 핵심 모순점들:
${caseDetails.coreContradictions.map((c, i) => `  ${i + 1}. ${c}`).join("\n")}

[현재 게임 상태]
- 현재 자백률 / 스트레스 수치: ${currentStress}% (범위: 0% ~ 100%)
- 진행 턴: ${turnNumber} / ${maxTurns}턴

[심리 게이지(Stress Level) 산출 규칙]
1. 단순 질문, 일반적인 확인: +0% ~ +5% (미미한 변동)
2. 용의자의 알리바이 허점이나 모순되는 동선/시간대를 논리적으로 찌르는 질문: +10% ~ +15%
3. 핵심 증거를 제시하고(${evidenceAttached ? `제시된 증거: [${evidenceAttached.name}] - ${evidenceAttached.contradicts}` : "증거 없음"}) 명확한 모순을 지적한 경우: +20% ~ +35% 급상승!
4. 근거 없는 억측, 증거 없는 원색적 비난, 엉뚱한 헛다리 질문: -5% ~ -8% (용의자가 안도하고 자신감을 되찾음)
5. newStressLevel = clamp(currentStress + stressChange, 0, 100)
6. newStressLevel이 100%에 도달하면 용의자는 멘탈이 완전히 붕괴되어 자신의 범행 일체(우발적 살해, 증거 인멸 시도, 진짜 동기)를 자백(isFinalConfession: true)합니다.

[감정(emotion) 상태 코드]
- 0 ~ 25%: 'calm' (여유로움, 냉철함, 비웃음)
- 26 ~ 50%: 'defensive' (방어적, 불쾌함 표시, 알리바이 강조)
- 51 ~ 70%: 'nervous' (시선 회피, 손 떨림, 말꼬리 흐림)
- 71 ~ 89%: 'sweating' (식은땀, 말 더듬음, 눈동자 흔들림)
- 90 ~ 99%: 'panicked' (극도의 공황, 고함 또는 횡설수설)
- 100%: 'breakdown' (멘탈 붕괴, 자백의 눈물)

[변호사 개입(lawyerIntervention) 규칙]
- 변호사 강태혁은 용의자 옆에서 수사를 감시합니다.
- 플레이어가 거칠게 윽박지르거나 유도심문을 하거나 증거 없이 몰아세울 때 즉시 "이의 있습니다!(Objection)"를 외치며 수사를 차단합니다.
- 반대로 결정적인 물증과 알리바이 파탄이 닥치면 변호사도 당황하여 "의뢰인님... 이게 사실입니까?" 하거나 말을 더듬습니다.
- 2~3턴마다 적절한 법적 조언이나 이의를 제기하여 게임의 긴장감을 높이세요.

반드시 유효한 JSON 형식으로만 응답해야 합니다.
`;

    const userPrompt = `
[심문 기록]
${history.slice(-4).map((h) => `${h.speaker === "detective" ? "형사" : h.speaker === "suspect" ? caseDetails.suspectName : "변호사"}: ${h.text}`).join("\n")}

[플레이어의 이번 턴 질문 / 행동]
형사의 질문: "${question}"
제시한 증거: ${evidenceAttached ? `[ID: ${evidenceAttached.id}] 이름: "${evidenceAttached.name}", 성격: ${evidenceAttached.description}, 감식 결과: ${evidenceAttached.forensicNote}` : "없음"}

위 입력과 제시된 증거를 면밀히 분석하여 용의자의 대사와 심리 수치 변화, 속마음, 변호사의 개입을 JSON으로 반환하세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suspectDialogue: {
              type: Type.STRING,
              description: "용의자의 실제 육성 대사 (한국어, 페르소나와 감정에 충실한 생생한 말투)",
            },
            innerThought: {
              type: Type.STRING,
              description: "용의자의 괄호 속 심리/속마음 (플레이어에게 추리 단서를 제공하는 속내)",
            },
            emotion: {
              type: Type.STRING,
              description: "용의자의 감정 상태 (calm, defensive, nervous, sweating, panicked, breakdown 중 하나)",
            },
            stressChange: {
              type: Type.INTEGER,
              description: "스트레스 변동폭 (-10 ~ +35)",
            },
            newStressLevel: {
              type: Type.INTEGER,
              description: "계산된 최종 스트레스 수치 (0 ~ 100)",
            },
            evaluation: {
              type: Type.STRING,
              description: "형사의 이번 질문/증거 제시에 대한 심리 분석관 평가 한 줄 (예: '알리바이 시간대 모순 정밀 타격 (+15%)')",
            },
            lawyerIntervention: {
              type: Type.OBJECT,
              properties: {
                triggered: {
                  type: Type.BOOLEAN,
                  description: "변호사가 이번 턴에 개입하여 말을 하는지 여부",
                },
                dialogue: {
                  type: Type.STRING,
                  description: "변호사의 대사",
                },
                warningType: {
                  type: Type.STRING,
                  description: "개입 유형 (objection, advice, coaching, shaken 중 하나)",
                },
              },
              required: ["triggered", "dialogue", "warningType"],
            },
            isFinalConfession: {
              type: Type.BOOLEAN,
              description: "자백율 100% 도달로 인한 최종 범행 자백 여부",
            },
            discoveredClue: {
              type: Type.STRING,
              description: "이번 질문으로 새로 탄로난 모순이나 진술 단서 (선택 사항)",
            },
          },
          required: [
            "suspectDialogue",
            "innerThought",
            "emotion",
            "stressChange",
            "newStressLevel",
            "evaluation",
            "lawyerIntervention",
            "isFinalConfession",
          ],
        },
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    // Ensure stress level bounds
    if (typeof data.newStressLevel !== "number") {
      data.newStressLevel = Math.min(100, Math.max(0, currentStress + (data.stressChange || 5)));
    } else {
      data.newStressLevel = Math.min(100, Math.max(0, data.newStressLevel));
    }

    if (data.newStressLevel >= 100) {
      data.isFinalConfession = true;
      data.emotion = "breakdown";
    }

    return res.json(data);
  } catch (err: any) {
    console.error("Gemini API interrogation error:", err);
    // Provide graceful fallback
    const fallback = getIntelligentFallbackResponse(req.body);
    return res.json(fallback);
  }
});

// Configure Vite integration
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Truth Unveiled server running on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
