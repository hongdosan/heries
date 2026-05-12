import {Link} from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="disclaimer">
        본 사이트의 모든 소설 본문·등장인물·세계관·고유명사·능력 체계·진영·시각 자산은 작가 hongdosan 의
        100% 오리지널 창작입니다. 복제·배포·번역·각색·기계학습 모델 학습 데이터 사용 등
        모든 사용에는 사전 서면 허가가 필요합니다. 외부 IP 차용 ZERO.
        라이선스·권리 문의는{' '}
        <Link to="/notice">NOTICE</Link>
        {' '}또는 사이트 상단 메일 주소로.
      </p>
      <div className="footer-links">
        <Link to="/about">heries 소개</Link>
        <Link to="/notice">© 2026 hongdosan. All rights reserved.</Link>
      </div>
    </footer>
  )
}
