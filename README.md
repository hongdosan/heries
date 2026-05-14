<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries

**H-eries** = `홍도산` + `(s)eries`. 단일 작가(`홍도산`)가 운영하는 **오리지널 웹 시리즈 컬렉션**.

**최소 의존 — 런타임은 React 19 + React Router + Vite + TypeScript.** dev 도구 (Storybook 등) 는 devDependencies. 외부 UI/상태 라이브러리 미사용. *코드만 있으면 어디서든 실행 가능* 한 이식성을 우선한다. GitHub Pages 로 발행 (BrowserRouter, `.nojekyll`).

---

## 저작권

본 저장소의 모든 소설 본문·등장인물·세계관·시각 자산은 작가*(홍도산)* 의 **100% 오리지널 창작** 이다.

```
© 2026 홍도산. All rights reserved.
```

- **모든 저작권은 홍도산 에게 단독 귀속**. 복제·배포·전송·번역·각색·기계학습 모델 학습 데이터 사용 모두 사전 서면 허가 필수.
- **외부 IP 차용 ZERO** — 본 저장소는 타 작가의 캐릭터·세계관·고유 표현을 일체 차용하지 않는다. 일반 명사 (장르 원형) 만 사용.
- **코드·구조도 동일하게 All Rights Reserved** — *코드·구조* (TypeScript·CSS·AI 에이전트 정의·빌드 스크립트·운영 문서) 와 *서사 콘텐츠* (`content/`) 모두 홍도산 단독 귀속. 오픈소스 라이선스 아님. 상세: [`LICENSE`](./LICENSE).
- 라이선스·권리 문의: `contact_hongdosan@naver.com` 또는 GitHub Issue.
- 자세한 정책: [NOTICE](./NOTICE.md).

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
npm run storybook        # Storybook dev 서버 (port 6006)
npm run build-storybook  # Storybook 정적 빌드 (storybook-static/, 미배포)
```

## 배포

`main` 브랜치 push 시 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) 가 자동으로 GitHub Pages 에 reader 빌드를 배포한다 (`https://hongdosan.github.io/heries/`). 워크플로우는 `VITE_AUTHOR_MODE=""` 강제 — **작가 빌드는 자동 배포 경로에 들어갈 수 없다**.

---

## 스포일러 분리 (작가 모드 vs 독자 모드)

라이브 사이트(`dist/`) 에서 **독자가 볼 수 있는 것** = 시리즈 목록 + 등장인물 (공개 절) + 발행된 챕터.

**마스킹 대상** (reader 빌드에서 자동 제거):

- `_series.md` 의 `## 시놉시스` 절
- 캐릭터 카드의 `## H-eries 분기 ~` 이하 모든 절
- frontmatter `heries_arc` 필드
- `worldbuilding/`, `timeline/`, `glossary/` 디렉토리

**작가 모드** = `VITE_AUTHOR_MODE=true` 환경 변수. 마스킹이 모두 해제되며 헤더에 `AUTHOR` 배지 표시. **작가 빌드를 라이브 사이트에 절대 배포하지 말 것**.

정책 SSOT: [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) §원칙 #9.

---

## 작품 목록

| 슬러그 | 상태 |
|---|---|
| [`clash-of-multiverses`](./content/series/clash-of-multiverses/) | tba |

> 신규 작품 추가 시 `content/series/{slug}/` 트리 + `content/series.json` `series[]` + `manifest.json` 생성.

---

## 디렉토리 구조

```
heries/
├── README.md, LICENSE, NOTICE.md, .nojekyll
├── package.json, tsconfig.json, vite.config.ts, index.html
├── content/                         # 마크다운 SSOT
│   ├── _shared/                            # 공통 자산
│   ├── series.json                         # 시리즈 인덱스
│   └── series/{slug}/
│       ├── manifest.json
│       ├── _series.md
│       ├── characters/{1-protagonist,2-major-supporting,3-antagonist,4-minor}/
│       ├── thumbnails/                     # 작품/챕터 이미지 + PROMPT.md
│       ├── worldbuilding/, timeline/, glossary/   # 작가 전용 (마스킹)
│       └── chapters/
├── scripts/                         # 빌드/운영 보조 (Node 표준, 의존성 0)
│   ├── check-images.mjs                    # 이미지 사이즈 게이트 (500 KB)
│   ├── check-masking.mjs                   # 마스킹 누수 게이트
│   ├── copy-content.mjs                    # 스포 마스킹 + dist 복사
│   └── optimize-images.mjs                 # WebP 압축
├── src/                             # FSD 6 레이어 — React 19 + TypeScript
│   ├── README.md                           # FSD 가이드
│   ├── app/main.tsx                        # createRoot + BrowserRouter
│   ├── pages/, widgets/, features/, entities/, shared/
├── .storybook/                      # Storybook 8 설정
├── .github/workflows/deploy.yml     # main 트리거 GitHub Pages 자동 배포
└── .claude/                         # 하네스 운영 + 에이전트 정의
```

---

## 등장인물 카드 스키마

```markdown
---
slug: character-id
name: 캐릭터 표시명
origin: original
role: protagonist | antagonist | supporting | cameo
first_appearance: tba
aliases: [별칭1, 별칭2]
heries_arc: tba   # 본 작품 소환 시점·상태 (reader 마스킹)
summary: 한 줄 요약
---

<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# (캐릭터명)

## 핵심 정체성
## 능력
## 외형
## 인간관계
## 출신 배경

## H-eries 분기 — (작품명) 변형  ← reader 빌드에서 마스킹
```

- 모든 캐릭터는 `origin: original` (외부 IP 차용 ZERO).
- *공개 절* (`핵심 정체성`/`능력`/`외형`/`인간관계`/`출신 배경`) = reader 노출.
- *작가 분기 절* (`## H-eries 분기 ~`) = reader 마스킹.

---

## 프론트엔드 (FSD + React + Vite)

`src/` 는 **Feature-Sliced Design (FSD)** 6 레이어. React 19 + React Router 7 (BrowserRouter) + Vite 6.

- FSD 가이드: [`src/README.md`](./src/README.md)
- CSS 슬라이스 분산 — shared/styles (tokens/base/typography/layout/utilities/author-mode/responsive) + 각 위젯·페이지·feature 슬라이스 옆 `{name}.css`
- 공통 UI 컴포넌트 (`shared/ui/`) 추가 시 `{name}.stories.tsx` 강제 (Storybook)

---

## 하네스 (AI 협업)

본 프로젝트는 [revfactory/harness](https://github.com/revfactory/harness) 위에서 *문서 기반 프로세스 하네스* 를 도입한다.

운영 문서 진입점: [`.claude/harness/harness.md`](./.claude/harness/harness.md)

| 에이전트 | 역할 |
|---|---|
| `heries-lorekeeper` | 캐릭터 카드 SSOT 관리·검증 |
| `heries-worldsmith` | 세계관·연표·용어 SSOT |
| `heries-author` | 챕터 집필 |
| `heries-continuity-reviewer` | 신규 챕터 정합성 감사 |
| `heries-frontend-engineer` | `src/` + 빌드 설정 |
| `heries-publisher` | 발행·배포 |

라우터 = [`heries-orchestrator`](./.claude/skills/heries-orchestrator/SKILL.md) 스킬.

---

## 작가

`홍도산` (단독 작가). 외부 협업·다인 작가 분기는 가정하지 않는다.
