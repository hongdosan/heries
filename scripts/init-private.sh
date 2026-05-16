#!/usr/bin/env bash
# H-eries — 프라이빗 자료 (서브모듈) 초기화 스크립트.
# - 서브모듈이 있다면: .private-config/heries/ 의 자료를 본 repo 의 .claude/ 등 경로에 심링크
# - 서브모듈이 없다면 (외부 기여자 등): 안내 메시지만 출력
#
# OS: macOS / Linux. Windows 는 WSL 권장.
# 실행: ./scripts/init-private.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -d ".private-config/heries" ]; then
  echo "ℹ .private-config 서브모듈이 없거나 비어있음 (외부 기여자 또는 권한 부재)."
  echo "  - 서브모듈 권한 있다면: git submodule update --init --recursive"
  echo "  - 권한 없다면: 본 스크립트 종료, .claude/handoff·.claude/workflow/plan 미적용 (Mock 모드)"
  exit 0
fi

echo "▸ .private-config/heries → .claude/ 심링크 생성"

# 심링크 매핑 (메인 경로 → 서브모듈 안 상대 경로)
# 형식: "메인 심링크 위치|상대 target"
LINKS=(
  ".claude/handoff|../.private-config/heries/claude/handoff"
  ".claude/workflow/plan|../../.private-config/heries/claude/workflow/plan"
  ".claude/workflow/prompt/custom|../../../.private-config/heries/claude/workflow/prompt/custom"
)

for entry in "${LINKS[@]}"; do
  LINK="${entry%%|*}"
  TARGET="${entry##*|}"

  # 부모 디렉토리 확보
  mkdir -p "$(dirname "$LINK")"

  # 기존 링크/디렉토리 제거 (디렉토리는 비어있을 때만 안전)
  if [ -L "$LINK" ]; then
    rm "$LINK"
  elif [ -d "$LINK" ]; then
    # 비어있는 디렉토리만 안전하게 제거. 비어있지 않으면 사용자 개입 필요.
    rmdir "$LINK" 2>/dev/null || {
      echo "  ⚠ $LINK 가 디렉토리이고 비어있지 않음. 수동 확인 필요 (서브모듈 도입 전 자료가 남아있을 수 있음)."
      continue
    }
  fi

  ln -s "$TARGET" "$LINK"
  echo "  ✓ $LINK → $TARGET"
done

echo ""
echo "✓ 서브모듈 초기화 완료."
echo "  운영 문서: .claude/harness/private-config.md"
