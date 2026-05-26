<!-- © 2026 홍도산. All rights reserved. Original creator work. -->
# Plan — 025 v0.5.10 rollback

## 적용
`git checkout v0.5.10 -- <files>` 3 파일 복원. spec/plan 만 추가 (019~024 spec 폴더 보존, 역사 기록).

## SDD_TEST_CMD
`npm run typecheck && npm run lint` — 통과.
