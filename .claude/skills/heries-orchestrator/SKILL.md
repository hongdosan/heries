---
name: H-eries-orchestrator
description: H-eries 프로젝트의 모든 작업 라우터. 사용자 요청을 6 전문 에이전트 중 하나로 라우팅하고, 챕터 작성 사이클 (author → continuity-reviewer 파이프라인) 을 자동 트리거한다. H-eries 프로젝트에서 캐릭터 카드·세계관·챕터·코드·발행 관련 모든 요청에서 반드시 트리거할 것 — "등장인물 추가", "세계관 갱신", "챕터 작성", "ep-NN 작성", "정합성 감사", "컴포넌트 추가", "사이트 빌드", "manifest 갱신", "썸네일 프롬프트", "이미지 압축" 등. 단순 질문·읽기·검색은 직접 응답 가능.
---

<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# H-eries-orchestrator

H-eries 프로젝트의 모든 작업 라우터. 사용자 요청을 6 전문 에이전트 중 하나로 라우팅하고, 다중 에이전트 협업 사이클을 조율한다.

## 0. 트리거 시점

H-eries 프로젝트 (`/Users/홍도산/onion-workspace/H-eries/`) 에서 다음 작업 요청 시 본 스킬을 트리거한다:

- 캐릭터 카드·세계관·연표·용어집 작성/정정
- 챕터 작성·검수
- `src/` 코드·렌더러·UX·빌드 스크립트 변경
- 발행·배포·manifest 갱신·썸네일 프롬프트·이미지 압축

**트리거하지 않음:** 단순 질문, 파일 읽기, 검색, 변경 이력·핸드오프 단독 갱신.

## 1. 6 에이전트 라우팅 매트릭스

| 사용자 요청 패턴 | 호출 에이전트 | 사용 도구 |
|---|---|---|
| "등장인물 추가/갱신", "캐릭터 카드", "카드 정정", "캐릭터 보강" | `H-eries-lorekeeper` | Agent (subagent_type=general-purpose, model=opus) |
| "세계관 추가", "연표 갱신", "용어집", "`_series.md`", "지역·세력" | `H-eries-worldsmith` | Agent |
| "챕터 작성", "ep-NN 작성", "본문 집필", "시놉시스 받아", "떡밥 매설" | `H-eries-author` → 자동으로 `H-eries-continuity-reviewer` | Agent (파이프라인) |
| "정합성 감사", "연속성 검증", "챕터 검수", "SSOT 정합", "떡밥 추적" | `H-eries-continuity-reviewer` | Agent |
| "컴포넌트 추가", "렌더러 수정", "UX 개선", "FSD 레이어", "Atomic Design", "atoms / molecules / organisms", "Storybook title", "컴포넌트 작성 원칙", "빌드 스크립트", "타입 에러", "마스킹 로직" | `H-eries-frontend-engineer` | Agent |
| "사이트 빌드", "GitHub 배포", "manifest 갱신", "썸네일 프롬프트", "이미지 압축", "발행", "`.nojekyll`" | `H-eries-publisher` | Agent |

라우팅이 모호하면 사용자에게 1회만 확인 (사용자 메모리 *사전 4 질문 폭탄 X* 정책 준수).

## 2. 실행 모드

**기본 = 서브 에이전트 패턴.** 사용자 단일 요청 → 적합 에이전트 1회 호출. 결과를 사용자에게 보고.

**예외 = 챕터 작성 사이클 (하이브리드 파이프라인):**
1. `H-eries-author` 호출 → 챕터 본문 작성
2. 자동으로 `H-eries-continuity-reviewer` 호출 → 정합성 감사
3. critical 발견 시 사용자 보고 후 author 재호출 또는 lorekeeper/worldsmith 위임

**팀 모드는 사용하지 않음** — 단일 작가 도메인이라 팀 통신 오버헤드가 이득보다 큼. 사용자가 명시 요청 시에만 전환.

## 3. Phase 1 — 컨텍스트 확인 (필수)

본 스킬 트리거 직후 다음을 점검:

1. **변경 이력 임계** — `.claude/harness/harness-state.md` §변경 이력 행 수 확인. 21행 도달 시 압축 의무 (CLAUDE.md §누적 산출물 정책).
2. **핸드오프 상태** — `.claude/handoff/CURRENT.md` 읽기 (세션 컨텍스트 파악).
3. **이전 산출물** — `_workspace/` 존재 여부. 있으면 부분 재실행 모드, 없으면 초기 실행.

## 4. 작업 사이클

### 4-1. 단일 에이전트 사이클 (대다수 요청)

```
사용자 요청
    ↓
오케스트레이터: 라우팅 매트릭스 매칭
    ↓
Agent(subagent_type=general-purpose, model="opus", prompt=에이전트 정의 + 작업 지시)
    ↓
결과 수집 → 사용자 보고
    ↓
변경 이력 1행 기록
```

### 4-2. 챕터 작성 사이클 (파이프라인)

```
사용자 = 시놉시스 (사건·결과·등장 인물·핵심 대사 후보)
    ↓
[Phase 1] H-eries-author 호출
    - 등장 캐릭터 카드 사전 Read
    - 시놉시스 → 본문 변환 (살붙이기·톤 활용)
    - 자체 검토 (메타 표현 제거·플롯 보존)
    ↓
[Phase 2] H-eries-continuity-reviewer 자동 호출
    - 신규 챕터 vs SSOT cross-check
    - critical / major / minor 보고서
    ↓
critical 발견 시:
    - lorekeeper / worldsmith / author 위임
    - 위임 후 reviewer 재실행
    ↓
[Phase 3] H-eries-publisher 호출 (사용자 확인 후)
    - manifest.json 갱신
    - 썸네일 PROMPT_REQUEST.md 갱신
    - 빌드 검증
    ↓
변경 이력 1행 기록 → 사용자가 commit
```

## 5. 데이터 전달

- **반환값 기반** (서브 에이전트 패턴) — Agent 의 응답을 오케스트레이터가 수집 후 다음 단계 결정.
- **파일 기반** (대용량 산출물) — 챕터 본문·카드·manifest 는 직접 파일에 Write. 중간 보고서는 응답 텍스트.
- **`_workspace/` 미사용** — 단일 작가 도메인이라 중간 산출물 분리 디렉토리 불필요. 모든 산출물은 직접 최종 위치에 작성.

## 6. 에러 핸들링

- **에이전트 결과 부족** (예: lorekeeper 가 origin 자료 부족 보고) → 사용자에게 자료 요청 (1회).
- **continuity-reviewer critical** → 사용자에게 보고 + 위임 안내. 자동 수정 X (사용자 판단).
- **빌드 실패** (publisher) → 실패 로그 + 권장 수정 안내. 자동 재시도 X.
- **에이전트 호출 실패** → 1회 재시도. 재실패 시 사용자 보고 + 수동 진행 권장.

## 7. 변경 이력 기록 (모든 작업 후)

작업 완료 후 `.claude/harness/harness-state.md` §변경 이력 표에 1행 기록:

```markdown
| YYYY-MM-DD | **{변경 내용 한 줄 요약}** — {상세 근거·결정·검증} | {대상 파일} | {사유 + 변경 이력 hot N행 / 한도 20} |
```

행 추가 후 hot 21행 도달 시 즉시 archive 압축 (CLAUDE.md §누적 산출물 정책).

## 8. 협업 정책 (사용자 메모리 강제)

- **main 브랜치만** — 워크트리 X. 모든 작업은 main 에서.
- **사용자 직접 commit** — 본 오케스트레이터·하위 에이전트는 git commit·push 안 함. 사용자가 직접 수행.
- **점진 동기화** — SSOT 골격만 박고 디테일은 챕터 작성 중 점진 보강. 사전 질문 폭탄 X.
- **챕터 작성 = 사실화** — 시놉시스 받아적기 X. 캐릭터 톤·살붙이기·자체 검토 후 사용자 시놉시스의 사건·결과는 100% 보존.

## 9. 후속 작업 (재실행·부분 수정)

사용자가 "다시 실행", "부분 수정", "방금 작업 보완" 요청 시:

1. `.claude/handoff/CURRENT.md` 와 마지막 변경 이력 1행 읽기.
2. 해당 도메인 에이전트만 재호출.
3. 챕터 작성 사이클은 author 재실행 → reviewer 재실행 자동화.

## 10. 참고

- 에이전트 정의: `.claude/agents/H-eries-{lorekeeper,worldsmith,author,continuity-reviewer,frontend-engineer,publisher}.md`
- 핵심 원칙: `.claude/CLAUDE.md` §핵심 원칙 (13 항)
- 변경 이력 SSOT: `.claude/harness/harness-state.md`
- 핸드오프: `.claude/handoff/CURRENT.md`
