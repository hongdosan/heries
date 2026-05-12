<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 차원의 격돌 — AI 이미지 생성 프롬프트

> 본 파일은 작가 (`홍도산`) 가 GPT·Midjourney·DALL·E 등 AI 이미지 생성 도구에
> 직접 붙여 사용하는 *프롬프트 SSOT*. 생성 결과 webp 변환 후
> `content/series/clash-of-multiverses/thumbnails/` 에 배치 + 챕터 frontmatter
> `thumbnail:` 필드에 파일명 기록. 16:9 1600×900 권장. 생성 후
> `npm run optimize:images` 1회 실행 (500KB 게이트 통과 필요).

## 작품 cover.webp — 메인 표지 (시리즈 hero 영역)

**파일명**: `cover.webp` → `content/series/clash-of-multiverses/cover.webp`
**용도**: 시리즈 페이지 hero 영역 + 홈 카드 썸네일

```
A cinematic 16:9 dark fantasy collision-of-worlds scene rendered in a modern,
minimalist illustration style. Centered: a fractured void cracking open across
the canvas like a shattered prism, refracting into eleven distinct light beams
that converge toward a single circular arena beneath. Each beam carries a
faint, abstract silhouette of a different archetype — a hunter with a combat
knife and rune-marked partner, a swordsman in a quiet stance, a black-mass
robed figure, a hooded watcher, a great burly fighter with animal silhouettes
circling, a swordmaster with a hilt-only blade, a young scholar with a hidden
sword, a time-warped traveler, a masked ninja, a quiet observer. No faces are
shown — only postures and presence. The arena floor at the bottom is etched
with a single line: "여기서 하나만 남는다" (one only survives here).

Tone: dark cobalt, deep crimson accents, parchment cream highlights. Mood:
ominous yet poetic. Lighting: top-down spotlight onto the arena. Style:
modern minimalist editorial, clean lines, soft gradients, no clutter.

Strictly avoid: any recognizable character or logo from existing IPs (no
Solo Leveling, Naruto, One Piece, Tower of God, Hunter, etc.). All
silhouettes must be original archetypes, not specific characters.

Aspect ratio 16:9, 1600x900, suitable for a web hero banner.
```

## ep-01-prologue.webp — 1화 썸네일 (프롤로그: 열한 개의 세계)

**파일명**: `ep-01-prologue.webp`
**용도**: 1화 챕터 hero + 챕터 목록 행 썸네일

```
A 16:9 cinematic still: eleven points of light suspended in a deep, starless
void, each light a different hue — cold blue, warm amber, blood-red, jade
green, ink black, parchment cream, pale silver, royal violet, forest brown,
mist white, ember orange. The eleven lights are arranged in a wide arc as if
each is being pulled, against its will, toward a single dark gravity well at
the lower center of the frame. Below the gravity well, a faint circular
platform begins to form. A single curved line of script is etched faintly
across the void: "11 개의 세계, 1 개의 무대".

Tone: muted cobalt night, soft glow on each colored point, ink-black
background. Mood: the silence right before a storm — eleven destinies pulled
into one stage. Style: modern minimalist illustration, clean composition,
ample negative space, no text overlays beyond the etched single line.

Strictly avoid: any recognizable character silhouettes, logos, or IP
references. The eleven points are abstract — no figures yet.

Aspect ratio 16:9, 1600x900.
```

## 향후 chapter 썸네일 (작가가 시놉시스 제공 시 갱신)

- `ep-02-first-fall.webp` — 1막 첫 격돌, 3 추락 (생존 8)
- `ep-03-...webp` — 2막 카오스, 5 추락 (생존 3)
- `ep-04-...webp` — 3막 우진혁의 명부 호출, 군단 도열 + 임시 휴전 협공 cliffhanger

각 챕터 프롬프트는 시놉시스 확정 시점에 본 파일에 추가.

## 사용 절차

1. 위 프롬프트를 GPT-4o / DALL·E 3 / Midjourney v6 등에 그대로 붙여 넣기.
2. 결과 이미지 (PNG/JPG) 를 webp 로 변환 + 1600x900 으로 리사이즈.
3. `content/series/clash-of-multiverses/thumbnails/` 에 배치 (cover.webp 는 시리즈 루트).
4. `npm run optimize:images` 실행 (500KB 게이트 통과 확인).
5. manifest.json 의 `thumbnail` 필드 (작품) 또는 `chapters[].thumbnail` (챕터) 에 파일명 기록.
6. `npm run build` 로 dist 정상 확인.
