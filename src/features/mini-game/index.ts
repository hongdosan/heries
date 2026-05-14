// 미니 게임 슬라이스 — Public API.
// 새 게임 추가 = catalog.ts 에 entry + games/{slug}/ 폴더. 외부 import 변경 X.
import './mini-game.css'
export { MiniGameLauncher } from './launcher/index.js'
export type { MiniGameDefinition } from './catalog.js'
