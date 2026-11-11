# Project: Truth Unveiled (진실 추적자)

AI 기반 한국어 심문 추리 게임입니다. 형사가 되어 용의자에게 질문하고 사건 자료와 증거를 제시해 알리바이의 모순과 범행 동기를 밝혀내세요. 용의자의 심리 상태와 변호사의 개입은 심문 진행에 따라 달라집니다.

## 주요 기능

- **대화형 심문:** 직접 질문을 입력하거나 사건별 추천 전술을 선택합니다.
- **증거 제시:** 증거 보관함에서 자료를 골라 질문과 함께 용의자에게 제시합니다.
- **심리 상태 변화:** 질문과 증거에 따라 스트레스 게이지, 표정, 속마음, 평가가 갱신됩니다. 설득력 있는 모순 지적은 스트레스를 높이고, 근거 없는 비난은 오히려 낮출 수 있습니다.
- **변호사 개입:** 변호사가 이의를 제기하거나 의뢰인에게 조언하며 심문에 반응합니다.
- **제한된 심문 턴:** 사건마다 최대 15턴 안에 스트레스를 100%까지 높여 자백을 받아내야 합니다.
- **한국어 인터페이스와 효과음:** 음소거를 전환할 수 있으며, 데스크톱과 모바일 화면을 지원합니다.

## 수록 사건

| 난이도 | 사건 | 핵심 단서 |
| --- | --- | --- |
| 쉬움 | 심야의 네온 모텔 304호 살인사건 | 혈흔 족적과 전당포 CCTV |
| 보통 | 한남동 펜트하우스 갤러리 살인사건 | 주차장 CCTV, 위작 고발 문서, 흉기 감식 결과 |
| 어려움 | 뉴로바이오 연구소 독살 사건 | 초저온 독극물 보관고 접속 기록 |

## 기술 스택

- React 19, TypeScript, Vite 8
- Tailwind CSS 4, Lucide React, Motion
- Express 4 서버 및 Google Gemini API (`@google/genai`)
- Bun lockfile (`bun.lock`)

## 시작하기

필요한 도구: Bun 또는 Node.js와 npm. 저장소에는 `bun.lock`이 포함되어 있습니다.

```bash
git clone https://github.com/chob334-cpu/TruthUnveiled.git
cd TruthUnveiled
bun install
```

Gemini API를 사용하려면 프로젝트 루트에 `.env` 파일을 만들고 API 키를 설정하세요.

```dotenv
GEMINI_API_KEY=your_gemini_api_key
```

`GEMINI_API_KEY`가 없으면 서버의 내장 대체 심문 시뮬레이션을 사용하므로 API 키 없이도 실행할 수 있습니다. 키를 설정하면 서버가 Gemini 모델에 심문 응답 생성을 요청합니다. API 키는 브라우저에 노출하지 말고 서버 환경 변수로 설정하세요.

개발 서버를 실행합니다.

```bash
bun run dev
```

기본 주소는 [http://localhost:3000](http://localhost:3000)이며, `PORT` 환경 변수로 포트를 변경할 수 있습니다.

## 빌드 및 프로덕션 실행

```bash
bun run build
NODE_ENV=production bun run start
```

프로덕션 서버는 `dist/`의 빌드 결과물을 제공합니다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `bun run dev` | Express와 Vite 미들웨어를 사용한 개발 서버 실행 |
| `bun run build` | Vite 프로덕션 빌드 |
| `bun run start` | Express 서버 실행 (프로덕션에서는 `dist/` 제공) |
| `bun run preview` | Vite 빌드 미리보기 |
| `bun run lint` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `bun run clean` | 빌드 산출물 정리 |

## 프로젝트 구조

```text
.
├── server.ts                 # Express 서버 및 POST /api/interrogate
├── src/
│   ├── App.tsx               # 게임 상태와 전체 화면 구성
│   ├── components/           # 심문 화면, 증거/사건 자료, 결과 모달
│   ├── data/cases.ts         # 사건·용의자·증거·추천 전술 데이터
│   ├── types/game.ts         # 게임 및 API 데이터 타입
│   └── utils/audio.ts        # 효과음과 스트레스 기반 오디오
├── index.html
└── vite.config.ts
```

## 심문 API

프런트엔드는 `POST /api/interrogate`로 질문, 현재 스트레스, 사건 정보, 최근 대화 기록, 선택한 증거를 전송합니다. 서버는 Gemini 응답을 JSON으로 요청하고, API 키가 없거나 AI 요청이 실패하면 로컬 대체 응답을 반환합니다. 응답에는 용의자 대사, 속마음, 감정, 스트레스 변화, 평가, 변호사 개입 및 자백 여부가 포함됩니다.