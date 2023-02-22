import { KeepLiveTCP, KeepLiveWS, getLongRoomId, ListenerEvents, DANMU_MSG } from 'tiny-bilibili-ws'
import { MSG_UNION } from './types/msg'
import { DanmakuWatcher } from './DanmakuWatcher'

// const ROOM_ID = 13308358 // 甜药
// const ROOM_ID = 21919321 // Hiiro
// const ROOM_ID = 1017 // 散人
// const ROOM_ID = 2347971 // My
const ROOM_ID = 21452505 // 七海
let liveTCP: KeepLiveTCP

async function main() {
  const res = await getLongRoomId(ROOM_ID)
  await mongoHelper.connectMongo(getDbUrl())
  const roomID = res.data.room_id
  liveTCP = createLiveTCP(roomID)
  liveTCP.tcpSocket.on('close', () => {
    liveTCP.tcpSocket.destroy()
    liveTCP = createLiveTCP(roomID)
  })

  const danmakuWatcher = new DanmakuWatcher()
  danmakuWatcher.startWatching()
}

function createLiveTCP(roomID: number) {
  const liveTCP = new KeepLiveTCP(roomID)
  listenOnLive(liveTCP)
  return liveTCP
}

function listenOnLive(liveTCP: KeepLiveTCP<ListenerEvents>) {
  liveTCP.on('msg', async (msg: MSG_UNION) => {
    const cmd = msg.data?.cmd
    if (cmd) {
      try {
        processMsg(msg.data)
      } catch (error) {
        console.error('inser error', error, msg.data)
      }
    } else {
      console.error('no cmd')
    }
  })
}

main()
