import { DanmakuWatcher } from './DanmakuWatcher'

// const ROOM_ID = 13308358 // 甜药
// const ROOM_ID = 21919321 // Hiiro
// const ROOM_ID = 1017 // 散人
// const ROOM_ID = 2347971 // My
const ROOM_ID = 21452505 // 七海

async function main() {
  const danmakuWatcher = new DanmakuWatcher(ROOM_ID)
  danmakuWatcher.startWatching()
}

main()
