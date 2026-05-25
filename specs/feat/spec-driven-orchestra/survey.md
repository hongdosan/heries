<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Survey — 통합 전 기존 시스템 (보존 대상)

> SDD Step 0: 바꾸기 전에 이해. H-eries는 0단계 조사 ON(기존 코드 191 파일).

## 1. 분석 대상
SDD 통합이 **공존/보존**해야 할 기존 자산. (이번 통합은 src/ 코드 변경 없이 인프라 추가만.)

## 2. 전체 구조 (보존)
| 영역 | 책임 | 비고 |
|---|---|---|
| `src/` (FSD 6레이어) | React 19 프론트엔드 | 변경 없음 |
| `.claude/CLAUDE.md` | 프로젝트 SSOT(작품·작가 원칙) | 보존 — 루트 CLAUDE.md가 참조 |
| `.claude/skills/heries-orchestrator` | 작업 라우터 | 보존 — SDD Implement 악기 |
| `.claude/agents/` (6 에이전트) | lorekeeper/worldsmith/author/reviewer/frontend/publisher | 보존 |
| `.claude/workflow/workflow.md` | 기존 6단계 흐름 | SDD에 흡수(논리적) |
| `.claude/handoff/CURRENT.md` | 세션 핸드오프 | 보존 — SDD handoff.md(feature별)와 별개 레이어 |
| `scripts/*.mjs` + `npm run build/validate` | 빌드·검증 게이트 | 보존 |
| `content/` (109 md) | 챕터·카드·세계관 | 보존 — 게이트 무관 |

## 3. 핵심 동작 (회귀 대상)
| 기능 | 검증 방법 |
|---|---|
| 타입 안전성 | `npm run typecheck` 통과 |
| 린트 | `npm run lint` 통과 |
| 빌드 | `npm run build` 성공(이미지·manifest·시크릿 게이트 포함) |
| 기존 스킬 로드 | heries-orchestrator + 6 에이전트 인식 |

## 4. 의존성
- 외부 런타임: React 19, React Router 7 (Vite 7 빌드). 추가 없음.
- 신규 dev 도구: spec-kit(`specify-cli`, uv). 런타임 dist 영향 0.

## 5. 보존해야 할 동작 (regression.md 입력)
- [ ] **B1**: `npm run typecheck` 통과 (TS strict)
- [ ] **B2**: `npm run lint` 통과 (ESLint 9)
- [ ] **B3**: 마크다운 전용 커밋이 SDD 게이트에 막히지 않음
- [ ] **B4**: 기존 heries-orchestrator + 6 에이전트 + 스킬 무손상
- [ ] **B5**: `npm run build` 산출물 정상(시크릿 게이트 포함)

## 6. 버릴 것
- 없음. workflow.md는 삭제 X — SDD 흐름이 상위에서 지휘(논리적 흡수).

## 7. 함정
- 게이트가 `.sh` 파일을 코드로 감지 → 통합 자체 커밋이 게이트 대상(본 spec/plan으로 충족).
- settings.json 훅은 세션 재시작 후 활성.

## 8. 다음 단계
- [x] regression.md 작성
