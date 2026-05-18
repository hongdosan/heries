import {fetchSeriesIndex} from '../../entities/series'
import {useAsync} from '../../shared/lib/use-async.js'
import {Empty, Loading} from '../../shared/ui'
import {SeriesList} from '../series-list'

/**
 * 홈 페이지 작품 목록 섹션 — h2 + 상태 분기 wrapper + `SeriesList` 위젯 호출.
 *
 * **자체 fetch**: `fetchSeriesIndex()` 로 `content/series.json` 로드 → useAsync 상태 분기:
 * - loading = `<Loading />`
 * - error = `<Empty>오류: ...</Empty>`
 * - success = `<SeriesList items={data.series} />`
 *
 * **분리 이유**: home.tsx 의 책임 = 페이지 조립만. 작품 목록의 fetch/상태/h2/렌더 모두
 * 본 widget 안에 응집 → 향후 다른 페이지 (예: about) 에서도 재사용 가능.
 */
export function SeriesSection() {
  const state = useAsync(() => fetchSeriesIndex(), [])

  return (
    <section>
      <h2>작품 목록</h2>
      {state.status === 'loading' && <Loading/>}
      {state.status === 'error' && <Empty>오류: {state.error.message}</Empty>}
      {state.status === 'success' && <SeriesList items={state.data.series}/>}
    </section>
  )
}
