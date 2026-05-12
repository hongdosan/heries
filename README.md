<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries

**H-eries** = `홍도산` + `(s)eries`. 단일 작가(`홍도산`)가 운영하는 **오리지널 다중/평행 세계 정적 웹 시리즈**.

**최소 의존 — React 19 + React Router + Vite + TypeScript.** 외부 UI/상태 라이브러리 미사용. *코드만 있으면 어디서든 실행 가능* 한
이식성을 우선한다. GitHub Pages 로 발행 (BrowserRouter, `.nojekyll`).

---

## 저작권

본 저장소의 모든 소설 본문·등장인물·세계관·고유명사·능력 체계·진영·줄거리·시각 자산은 작가*(홍도산)* 의 **100% 오리지널 창작** 이다.

```
© 2026 홍도산. All rights reserved.
```

- **모든 저작권은 홍도산 에게 단독 귀속**. 복제·배포·전송·번역·각색·기계학습 모델 학습 데이터 사용 모두 사전 서면 허가 필수.
- **외부 IP 차용 ZERO** — 본 저장소는 타 작가의 캐릭터·세계관·고유 능력·고유 진영명·고유 표현을 일체 차용하지 않는다. 일반 명사 (닌자·헌터·정파·사파 등 장르 원형) 만 사용.
- **코드·구조도 동일하게 All Rights Reserved** — *코드·구조* (TypeScript·CSS·AI 에이전트 정의·빌드 스크립트·운영 문서 등) 와 *서사 콘텐츠* (`content/`) 모두 홍도산 단독 귀속. 오픈소스 라이선스 아님. 사용·복제·수정·재배포·sublicense·기계학습 데이터 사용 모두 사전 서면 허가 필요. 상세: [`LICENSE`](./LICENSE).
- 라이선스·권리 문의: `contact_hongdosan@naver.com` 또는 GitHub Issue.
- 자세한 저작권 정책: [NOTICE](./NOTICE.md).

모든 `.md` 산출물 첫 줄(또는 frontmatter 직후)에 다음 1줄 HTML 주석을 부착한다:

```html
<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
```

---

## 빠른 시작

```bash
npm install              # 1회
npm run dev              # 개발 서버 (http://localhost:8000) — reader 모드
npm run dev:author       # 개발 서버 — 작가 모드 (스포일러 마스킹 해제)
npm run build            # 프로덕션 빌드 (dist/) — GitHub Pages 배포용
npm run build:author     # 작가 빌드 (dist-author/) — 비공개, 로컬 only
npm run typecheck        # 타입 체크
```

## 배포

`main` 브랜치 push 시 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) 가 자동으로 GitHub
Pages 에 reader 빌드를 배포한다 (`https://홍도산.github.io/H-eries/`). 워크플로우는 `VITE_AUTHOR_MODE=""` 강제 — *
*작가 빌드는 자동 배포 경로에 들어갈 수 없다**. 첫 배포 전 GitHub Repository → Settings → Pages → Source =
`GitHub Actions` 로 변경 필요.

---

## 스포일러 분리 (작가 모드 vs 독자 모드)

라이브 사이트(`dist/`) 에서 **독자가 볼 수 있는 것** = 시리즈 목록 + 등장인물 (원작 정보) + 발행된 챕터.

**마스킹 대상** (reader 빌드에서 자동 제거):

- `_series.md` 의 `## 시놉시스` 절
- 캐릭터 카드의 `## H-eries 분기 ~` 이하 모든 절 (단 `## 검증 출처` 는 유지)
- frontmatter `heries_arc` 필드
- `worldbuilding/`, `timeline/`, `glossary/` 디렉토리

**작가 모드** = `VITE_AUTHOR_MODE=true` 환경 변수. 마스킹이 모두 해제되며 헤더에 `AUTHOR` 배지 표시. **작가 빌드를 라이브 사이트에 절대
배포하지 말 것**.

정책 SSOT: [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) §9.

---

## 작품 목록

| 제목     | 슬러그                                    | 상태              |
|--------|----------------------------------------|-----------------|
| 차원의 격돌 | `content/series/clash-of-multiverses/` | 계획 (zero-state) |

> 신규 작품 추가 시 `content/series/{slug}/` 트리 + `content/series.json` `series[]` + `manifest.json` 생성.

---

## 디렉토리 구조

```
H-eries/
├── README.md                 # 본 파일
├── LICENSE                   # All Rights Reserved (코드·콘텐츠 전체)
├── .nojekyll                 # GitHub Pages raw static
├── package.json              # React 19 + Vite + 의존 7개
├── vite.config.ts            # Vite 설정
├── tsconfig.json             # TypeScript strict + jsx: react-jsx
├── index.html                # SPA 진입점
├── content/                  # 마크다운 SSOT
│   ├── _shared/                       # 공통 자산 (썸네일 fallback 등)
│   │   └── thumbnail-placeholder.webp
│   ├── series.json                    # 시리즈 인덱스
│   └── series/{slug}/
│       ├── manifest.json     # 캐릭터·챕터 인덱스 + thumbnail 경로
│       ├── _series.md        # 시리즈 메타·시놉시스·차용 원작 목록
│       ├── characters/       # 등장인물 SSOT (캐릭터당 1 .md)
│       ├── thumbnails/       # 작품/챕터 이미지 + PROMPTS.md (작가 전용)
│       ├── worldbuilding/    # 작가 전용 (스포)
│       ├── timeline/         # 작가 전용 (스포)
│       ├── glossary/         # 작가 전용 (스포)
│       └── chapters/         # 에피소드 본문 (ep-NN-{slug}.md)
├── scripts/                  # 빌드/운영 보조 (Node 표준, 의존성 0)
│   ├── check-images.mjs      # 빌드 시작 이미지 사이즈 게이트 (500KB)
│   ├── copy-content.mjs      # 빌드 시 스포 마스킹 + dist 복사
│   └── optimize-images.mjs   # WebP 일괄 압축 (npm run optimize:images)
├── src/                      # FSD 6 레이어 — React 19 + TypeScript
│   ├── README.md             # FSD 가이드
│   ├── app/main.tsx          # createRoot + BrowserRouter + 테마 부트
│   ├── pages/                # URL 단위 페이지
│   ├── widgets/              # 페이지 구성 블록 (Header/Footer/...)
│   ├── features/             # 사용자 시나리오 (zero-state)
│   ├── entities/             # 도메인 데이터 로더 + 스포 마스킹 합성
│   └── shared/               # lib (env·spoiler·theme·use-async·…), styles
├── .github/workflows/
│   └── deploy.yml            # main 트리거 GitHub Pages 자동 배포
└── .claude/
    ├── CLAUDE.md             # 핵심 원칙 9개
    ├── handoff/CURRENT.md    # 단일 핸드오프 (정책 v3)
    ├── handoff/handoff.md    # 4-Tier 가이드
    └── harness/              # 하네스 운영 문서
```

---

## 등장인물 카드 스키마

등장인물 카드는 *다중 우주 전제* 위에서 작성된다. 정책 SSOT: [
`content/series/clash-of-multiverses/_series.md`](./content/series/clash-of-multiverses/_series.md)
§기본 전제.

```markdown
---
name: 캐릭터 표시명
origin: 원작 출처 (예: "OOO 웹툰 - 작가명") — 차용 시 필수, 누락 시 reject
affiliation: 소속
role: protagonist | antagonist | supporting | cameo | original
first_appearance: ep-01-prologue
aliases: [별칭1, 별칭2]
heries_arc: tba   # 본 작품 소환 시점·상태 (스포 — reader 마스킹 대상)
---

<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# (캐릭터명)

## 원작 메타 — 작품·매체·원저작자

## 원작 캐논 — 신체·무공·성격·인간관계 등 원작 사실

## H-eries 분기 — 본 작품 내 변형 (스포 — reader 마스킹 대상)

## 검증 출처 — 1차 자료 인용 (스포 영역 다음에 와도 노출 유지)
```

규칙:

- 오리지널 캐릭터는 `origin: original` 명시. 차용 캐릭터는 원작 출처·원저작자 필수.
- *원작 캐논 절* = 출발점 (원작 사실).
- *H-eries 분기 절* = 작가 영역 (다중/평행 우주 변형). reader 빌드에서 자동 마스킹.
- `heries_arc` 가 `tba` 면 분기 절은 placeholder 만 두고, 챕터 본문 작성 시 채운다.

---

## 프론트엔드 (FSD + React + Vite)

`src/` 는 **Feature-Sliced Design (FSD)** 6 레이어. React 19 + React Router 7 (BrowserRouter) + Vite 6 기반.
외부 UI/상태 라이브러리 X.

- FSD 가이드: [`src/README.md`](./src/README.md)
- TypeScript: [`tsconfig.json`](./tsconfig.json) (strict + `jsx: react-jsx` +
  `moduleResolution: Bundler`)
- 빌드: [`vite.config.ts`](./vite.config.ts) — `dist/` 산출 + `cp -R content dist/content` 후처리

---

## 하네스 (AI 협업)

본 프로젝트는 [revfactory/harness](https://github.com/revfactory/harness) 위에서 *문서 기반 프로세스 하네스* 를 도입한다.

운영 문서 진입점: [`.claude/harness/harness.md`](./.claude/harness/harness.md)

| 에이전트                        | 역할                        | 상태  |
|-----------------------------|---------------------------|-----|
| `agent-lorekeeper`          | 등장인물·세계관·연표·용어 SSOT 관리·검증 | 미작성 |
| `agent-author`              | 챕터 집필 보조·문체 일관성           | 미작성 |
| `agent-continuity-reviewer` | 신규 챕터의 SSOT 정합성 감사        | 미작성 |
| `agent-publisher`           | 정적 사이트 빌드·GitHub 배포       | 미작성 |

---

## 작가

`홍도산` (단독 작가). 외부 협업·다인 작가 분기는 가정하지 않는다.
