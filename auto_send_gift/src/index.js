import fetch from 'node-fetch'
import { GIFTS } from './constants.js'
import { sleep } from './utils.js'
import { sendMsg } from './notify.js'

const roomId = process.env.ROOM_ID
const userUid = process.env.UID

let LiveStarted = false
let queryInterval = 10

async function getRoomPlayInfo() {
  const url = `https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomPlayInfo?room_id=${roomId}`
  const res = await fetch(url)
  return await res.json()
}

async function sendGift(roomUid, giftName) {
  console.log(`准备在直播间${roomId}送出礼物`, giftName)

  const params = new URLSearchParams()
  params.append('uid', userUid)
  params.append('biz_id', roomId)
  params.append('csrf', process.env.bili_jct)
  params.append('csrf_token', process.env.bili_jct)
  params.append('gift_id', GIFTS[giftName].gift_id)
  params.append('price', GIFTS[giftName].price)
  params.append('ruid', roomUid)
  params.append('gift_num', '1')
  params.append('send_ruid', '0')
  params.append('coin_type', 'gold')
  params.append('bag_id', '0')
  params.append('platform', 'pc')
  params.append('biz_code', 'Live')
  params.append('storm_beat_id', '0')
  params.append('visit_id', '')
  params.append('receive_users', '')
  params.append('metadata', '')

  const resp = await fetch('https://api.live.bilibili.com/xlive/revenue/v1/gift/sendGold', { method: 'POST', body: params.toString(), headers: {
    cookie: `SESSDATA=${process.env.sessdata};bili_jct=${process.env.bili_jct};buvid3=${process.env.buvid3};DedeUserID=${userUid}`,
    'content-type': 'application/x-www-form-urlencoded',
  } })
  const respData = await resp.json()
  if (respData.code === 0) {
    console.log('送礼成功', giftName)
    await sendMsg(giftName)
  } else {
    console.log('送礼失败', giftName, respData)
  }
}

async function main() {
  if (!GIFTS[process.env.GIFT_NAME]) {
    console.log('礼物配置错误')
    return
  }
  console.log(`将会在${roomId}开播时送上：`, process.env.GIFT_NAME)
  const roomPlayInfo = await getRoomPlayInfo()
  if (roomPlayInfo.data?.uid) {
    console.log('启动时尝试赠送小花花')
    sendGift(roomPlayInfo.data.uid, '小花花')
  }
  await sleep(5)

  while (true) {
    try {
      const roomPlayInfo = await getRoomPlayInfo()
      const code = roomPlayInfo.code
      if (code === 0) {
        const roomUid = roomPlayInfo.data.uid
        const liveStatus = roomPlayInfo.data.live_status
        if (liveStatus === 1) {
          if (!LiveStarted) {
            LiveStarted = true 
            await sendGift(roomUid, process.env.GIFT_NAME)
          }
          queryInterval = 300
        } else {
          LiveStarted = false
          queryInterval = 10
        }
      } else {
        console.log(`查询房间${roomId}信息code错误`, code)
      }
    } catch(e) {
      console.error('Error', e)
    }
    await sleep(queryInterval)
  }

}

main()
