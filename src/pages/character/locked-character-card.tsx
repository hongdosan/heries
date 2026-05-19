import type {HTMLAttributes} from 'react'
import {Link} from 'react-router-dom'
import {Button} from '../../shared/ui'

/**
 * 작가 모드 OFF reader 가 비-주인공 카드 진입 시 노출되는 잠긴 카드 페이지.
 *
 * **정책 (character-doctrine + #9 v2)**: 주인공 (`1-protagonist`) 외 카드는
 * 작가 모드 한정. reader 빌드 진입 시 본 컴포넌트로 차단.
 *
 * **CTA**: 등장인물 목록으로 / 작가 모드 잠금 해제 2 버튼.
 *
 * 작성 5 원칙 §1 (레이아웃 외부 주입) — root `<main>` 의 `className` + 모든 HTML attribute 외부 주입.
 * 이전 `mainClassName: string` props 폐기 (자매 정합).
 */
export interface LockedCharacterCardProps extends HTMLAttributes<HTMLElement> {
  readonly slug: string
  readonly manifestTitle: string
  readonly folderLabel: string
}

export function LockedCharacterCard({slug, manifestTitle, folderLabel, className, ...rest}: LockedCharacterCardProps) {
  return (
    <main className={className} {...rest}>
      <nav className="breadcrumb" aria-label="경로">
        <Link to="/">H-eries</Link><span className="sep">/</span>
        <Link to="/series">시리즈</Link><span className="sep">/</span>
        <Link to={`/series/${slug}`}>{manifestTitle}</Link><span className="sep">/</span>
        <span>잠김</span>
      </nav>
      <div className="my-6 p-6 bg-bg-soft border border-rule rounded-md text-center">
        <h1>잠긴 카드</h1>
        <p className="m-0 mb-3 text-fg-2">본 캐릭터의 상세 정보는 <Link to="/unlock">작가 모드</Link>에서 열람할 수 있습니다.</p>
        <p className="text-sm text-fg-3 m-0 mb-5">{manifestTitle} · {folderLabel}</p>
        <div className="inline-flex gap-2 flex-wrap justify-center">
          <Link to={`/series/${slug}?tab=characters`}>
            <Button variant="primary">등장인물 목록으로</Button>
          </Link>
          <Link to="/unlock">
            <Button variant="secondary">작가 모드 잠금 해제</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
