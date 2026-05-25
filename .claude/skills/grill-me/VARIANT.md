<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# grill-me 프로젝트 변형 가이드 (H-eries)

> SDD 워크플로우와 통합된 grill-me 사용법. 원본 SKILL.md 는 그대로 두고, 본 변형이 H-eries SDD 단계 매핑을 더한다.

## 활용 시점 (SDD Phase별)

### Phase 2: Clarify (주역)
```
"grill me - <branch> 명확화"
```
`/speckit-clarify` 가 ~5개 표적 질문으로 부족하면 grill-me 로 더 깊이 파고든다.

### Phase 5: 검증 설계
```
"grill me - <branch> 검증 설계"
```

### Phase 7: Handoff 작성
```
"grill me - <branch> 핸드오프"
```

## 추가 활용 (기존 코드가 있을 때 — H-eries는 0단계 조사 ON)
```
"grill me - <branch> survey"      (Step 0)
"grill me - <branch> regression"  (Step 5b)
"grill me - <branch> migration"   (Implement)
```

## H-eries 콘텐츠 작업에서
챕터·카드 시놉시스가 모호할 때도 활용 가능 — 단, 플롯 변경 금지(작가 영역). 말투·디테일·연속성 질문에 한정.

## 결과 활용
grill-me 세션 종료 시 요약을 해당 단계 문서(spec.md / regression.md / handoff.md)에 그대로 붙여넣는다.
