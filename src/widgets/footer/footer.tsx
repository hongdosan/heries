import {Link} from 'react-router-dom'

// 저작권 시작 연도. 사이트 발행이 2026년이라 고정.
const COPYRIGHT_START = 2026

function copyrightRange(): string {
  const now = new Date().getFullYear()
  return now <= COPYRIGHT_START ? `${COPYRIGHT_START}` : `${COPYRIGHT_START}–${now}`
}

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="disclaimer">
        본 사이트의 모든 소설 본문·등장인물·세계관·시각 자산은 작가(홍도산) 의 100% 오리지널 창작입니다.
        복제·배포·번역·각색·기계학습 학습 데이터 사용 등 모든 사용에는 사전 서면 허가가 필요합니다.
        문의는 {' '}<Link to="/notice">NOTICE</Link>{' '} 또는 상단 메일 주소로.
      </p>
      <div className="footer-links">
        <Link to="/about">H-eries 소개</Link>
        <Link to="/notice">© {copyrightRange()} 홍도산. All rights reserved.</Link>
      </div>
    </footer>
  )
}
