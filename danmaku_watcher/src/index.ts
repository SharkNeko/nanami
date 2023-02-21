import { KeepLiveTCP, KeepLiveWS, getLongRoomId, ListenerEvents, DANMU_MSG } from 'tiny-bilibili-ws'
import { initMongo, closeMongo, db } from './mongo'
import { resolveMsg } from './msgResolver'
import { MSG_UNION } from './types/msg'

// const ROOM_ID = 13308358 // 甜药
// const ROOM_ID = 21919321 // Hiiro
// const ROOM_ID = 1017 // 散人
// const ROOM_ID = 2347971 // My
const ROOM_ID = 21452505 // 七海
let liveTCP: KeepLiveTCP

async function main() {
  const res = await getLongRoomId(ROOM_ID)
  await initMongo(ROOM_ID)
  console.log('mongo init success')
  const roomID = res.data.room_id
  liveTCP = createLiveTCP(roomID)
  liveTCP.tcpSocket.on('close', () => {
    console.log('Restart TCP')
    liveTCP.tcpSocket.destroy()
    liveTCP = createLiveTCP(roomID)
  })
}

function createLiveTCP(roomID: number) {
  const liveTCP = new KeepLiveTCP(roomID)
  listenOnLive(liveTCP)
  return liveTCP
}

function listenOnLive(liveTCP: KeepLiveTCP<ListenerEvents>) {
  liveTCP.on('msg', async (msg: MSG_UNION) => {
    const cmd = msg.data?.cmd
    console.log('cmd', cmd)
    if (cmd) {
      try {
        const doc = resolveMsg(msg.data)
        if (doc) {
          await db.bili?.collection(cmd).insertOne(doc)
          console.log('insert', cmd)
        }
      } catch (error) {
        console.error('inser error', error, msg.data)
      }
    } else {
      console.error('no cmd')
    }
  })
}

try {
  main()
} finally {
  closeMongo()
}
