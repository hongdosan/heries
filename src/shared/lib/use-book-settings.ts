// © 2026 홍도산. All rights reserved. Original creator work.
// BookReader 사용자 설정 (글자 크기 / 폰트) — localStorage 영속 + state hook.
// 패턴 자매 정합 = shared/lib/theme.ts (Theme / getTheme / setTheme / nextTheme).

import {useCallback, useEffect, useState} from 'react'

export type BookFontSize = 'sm' | 'md' | 'lg' | 'xl'
export type BookFontFamily = 'sans' | 'serif'

export const BOOK_FONT_SIZES: ReadonlyArray<BookFontSize> = ['sm', 'md', 'lg', 'xl']
export const BOOK_FONT_FAMILIES: ReadonlyArray<BookFontFamily> = ['sans', 'serif']

const KEY_SIZE = 'heries:book-reader:font-size'
const KEY_FAMILY = 'heries:book-reader:font-family'

const DEFAULT_SIZE: BookFontSize = 'md'
const DEFAULT_FAMILY: BookFontFamily = 'sans'

function readSize(): BookFontSize {
  try {
    const v = localStorage.getItem(KEY_SIZE)
    if (v === 'sm' || v === 'md' || v === 'lg' || v === 'xl') return v
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_SIZE
}

function readFamily(): BookFontFamily {
  try {
    const v = localStorage.getItem(KEY_FAMILY)
    if (v === 'sans' || v === 'serif') return v
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_FAMILY
}

export function nextFontSize(current: BookFontSize): BookFontSize {
  const i = BOOK_FONT_SIZES.indexOf(current)
  return BOOK_FONT_SIZES[(i + 1) % BOOK_FONT_SIZES.length] ?? DEFAULT_SIZE
}

export function nextFontFamily(current: BookFontFamily): BookFontFamily {
  const i = BOOK_FONT_FAMILIES.indexOf(current)
  return BOOK_FONT_FAMILIES[(i + 1) % BOOK_FONT_FAMILIES.length] ?? DEFAULT_FAMILY
}

export interface BookSettings {
  readonly fontSize: BookFontSize
  readonly fontFamily: BookFontFamily
  readonly cycleFontSize: () => void
  readonly cycleFontFamily: () => void
}

/**
 * BookReader 사용자 설정 hook — fontSize / fontFamily 순환 + localStorage 영속.
 *
 * 호출처: `widgets/book-reader/book-reader.tsx` (root state) + `chapter.tsx` 등 reader 페이지.
 */
export function useBookSettings(): BookSettings {
  const [fontSize, setFontSize] = useState<BookFontSize>(() => readSize())
  const [fontFamily, setFontFamily] = useState<BookFontFamily>(() => readFamily())

  // localStorage 영속 (state 변경 시)
  useEffect(() => {
    try {
      localStorage.setItem(KEY_SIZE, fontSize)
    } catch {
      // ignore storage failure
    }
  }, [fontSize])

  useEffect(() => {
    try {
      localStorage.setItem(KEY_FAMILY, fontFamily)
    } catch {
      // ignore storage failure
    }
  }, [fontFamily])

  const cycleFontSize = useCallback(() => setFontSize((p) => nextFontSize(p)), [])
  const cycleFontFamily = useCallback(() => setFontFamily((p) => nextFontFamily(p)), [])

  return {fontSize, fontFamily, cycleFontSize, cycleFontFamily}
}

// font-size class map (Tailwind utility — book-reader content 영역 적용).
export const BOOK_FONT_SIZE_CLASS: Record<BookFontSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

// font-family class map.
export const BOOK_FONT_FAMILY_CLASS: Record<BookFontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
}

export const BOOK_FONT_SIZE_LABEL: Record<BookFontSize, string> = {
  sm: '작게',
  md: '보통',
  lg: '크게',
  xl: '아주 크게',
}

export const BOOK_FONT_FAMILY_LABEL: Record<BookFontFamily, string> = {
  sans: '고딕',
  serif: '명조',
}
