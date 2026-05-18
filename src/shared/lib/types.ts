// © 2026 홍도산. All rights reserved. Original creator work.
// shared/lib/types.ts — 도메인 무관 공통 type 만.
// 도메인 type 은 각 entities/{slice}/model/types.ts 로 분리 (2026-05-18).

/** 자체 markdown frontmatter parser 출력 — frontmatter + body 본문 분리. */
export interface DocFile<F = Record<string, unknown>> {
  frontmatter: F
  body: string
}
