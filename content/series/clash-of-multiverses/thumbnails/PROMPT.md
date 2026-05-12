<!-- © 2026 홍도산. All rights reserved. Original creator work. -->

# 차원의 격돌 — AI 이미지 생성 프롬프트

> 본 파일은 작가 (`홍도산`) 가 GPT·Midjourney·DALL·E 등 AI 이미지 생성 도구에
> 직접 붙여 사용하는 *프롬프트 SSOT*. 생성 결과 webp 변환 후
> `content/series/clash-of-multiverses/thumbnails/` 에 배치 + 챕터 frontmatter
> `thumbnail:` 필드에 파일명 기록. 16:9 1600×900 권장. 생성 후
> `npm run optimize:images` 1회 실행 (500KB 게이트 통과 필요).

## 작품 cover.webp — 메인 표지 (시리즈 hero 영역)

**파일명**: `cover.webp` → `content/series/clash-of-multiverses/thumbnails/cover.webp` (작가 직접 생성 완료)
**용도**: 시리즈 페이지 hero 영역 + 홈 카드 썸네일

> 본 파일은 작가가 이미 생성·압축하여 manifest 에 등록됨. 향후 재생성 시 본 절 참고.

```
A cinematic 16:9 dark fantasy collision-of-worlds scene rendered in a modern,
minimalist illustration style. Centered: a fractured void cracking open across
the canvas like a shattered prism, refracting into eleven distinct light beams
that converge toward a single circular arena beneath. Each beam carries a
faint, abstract silhouette of a different archetype. The arena floor at the
bottom is etched with a single line: "여기서 하나만 남는다" (one only survives here).
Tone: dark cobalt, deep crimson accents, parchment cream highlights. Mood:
ominous yet poetic. Style: modern minimalist editorial, clean lines, soft
gradients, no clutter.
Strictly avoid: any recognizable character or logo from existing IPs.
Aspect ratio 16:9, 1600x900.
```

## ep-01-prologue.webp — 1화 *프롤로그 — 죽음을 거두는 자* 썸네일

**파일명**: `ep-01-prologue.webp`
**용도**: 1화 챕터 hero + 챕터 목록 행 썸네일

본 화의 *시각적 정수* = *마수 앞에서 죽은 동료의 가슴 위에 손을 얹은 우진혁의 각성 순간*. 본 화의 핵심 장면을 미니멀 일러스트로 압축한 것.

```
A cinematic 16:9 dark fantasy still rendered in modern minimalist illustration
style. The scene depicts a single moment of awakening inside a collapsed dungeon
chamber. In the foreground, a young Korean male soldier in tactical military
gear is kneeling on dark stone rubble, cradling a fallen comrade. His right
hand rests gently on the comrade's chest, where a soft cobalt-blue glow has
just begun to bloom — the first ignition of a death-binding power. His face is
half-shadowed, his eyes fixed on the comrade with quiet grief, not horror.
Behind him, the dim silhouette of a massive defeated beast (three times the
height of a man) lies in the deeper shadow, its glowing red eyes already
fading. The chamber walls are cracked, parchment-cream dust still settling
through a single shaft of light from above.
The cobalt-blue glow from the comrade's chest is the only bright accent
against an otherwise muted palette of deep charcoal, slate gray, and dried
blood crimson.
Compositionally, the soldier is positioned on the right third of the frame,
leaving the left side open as quiet negative space where, faintly, a single
translucent silhouette is beginning to rise from the comrade's body — the
first soul to be registered into his "ledger of the dead."
Tone: solemn, intimate, the still moment between loss and awakening. No
text overlays. Style: modern minimalist editorial illustration, clean lines,
soft volumetric lighting, ample negative space.
Strictly avoid: any recognizable character, weapon, or logo from existing
IPs (no Solo Leveling, Hunter x Hunter, etc.). The soldier is generic Korean
special forces; the comrade is generic infantry; the beast is a generic
oversized monster (no specific franchise reference).
Aspect ratio 16:9, 1600x900.
```

### 대안 컷 (작가가 위 컷 대신 선택 가능)

본 화의 *결말 무대* — 원형 무대 위 11 명이 한자리에 모인 직후의 우진혁 시점. 위의 *각성 순간* 컷보다 *작품 도입의 무게* 가 더 강한 컷이 필요할 때 사용.

```
A cinematic 16:9 still: a circular stone arena floating in a starless black
void, lit from above by a single vertical beam of pale light striking dead
center. Eleven human silhouettes stand on the arena floor, evenly spaced
along its circumference, all facing inward. Only one figure is rendered with
clarity — a young Korean male in dark tactical gear standing on the right
foreground, his right hand resting on the hilt of a combat knife at his
waist. The other ten figures remain dim, almost translucent shadows, their
postures distinct (a still swordsman, a hooded watcher, a great burly fighter,
a robed mage, a school-uniformed student, a hooded observer, etc.) but their
faces and details kept abstract.
Above all heads, a single faint line of script is etched into the void:
"여기서 하나만 남는다" (one only survives here).
Tone: deep cobalt night, crimson undertone, parchment-cream highlight on the
central figure. Mood: the silence right before a decision. Style: modern
minimalist editorial, clean composition, ample negative space.
Strictly avoid: any recognizable character or franchise reference.
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
3. `content/series/clash-of-multiverses/thumbnails/` 에 배치.
4. `npm run optimize:images` 실행 (500KB 게이트 통과 확인).
5. manifest.json 의 `thumbnail` 필드 (작품) 또는 `chapters[].thumbnail` (챕터) 에 파일명 기록.
6. `npm run build` 로 dist 정상 확인.
