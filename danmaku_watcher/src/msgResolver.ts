import { DANMU_MSG, SEND_GIFT, _DANMU_MSG } from 'tiny-bilibili-ws'
import { AREA_RANK_CHANGED_DATA, LIVE_DATA, MSG_UNION, PREPARING_DATA } from './types/msg'
import { localDate } from './util'

const ignoreMsgList: (MSG_UNION['data']['cmd'] | string)[]  = [
  'STOP_LIVE_ROOM_LIST',
  'NOTICE_MSG',
  'ONLINE_RANK_TOP3',
  'LIVE_INTERACTIVE_GAME',
  'INTERACT_WORD', // 待定
  'RECOMMEND_CARD',
  'GOTO_BUY_FLOW',
  'ENTRY_EFFECT'
]

export function resolveMsg(data: MSG_UNION['data']) {
  if (ignoreMsgList.includes(data.cmd)) {
    return
  }
  let doc: {
    localDate?: string
    [key: string]: any
  } | undefined
  const cmd = data.cmd
  if (cmd === 'DANMU_MSG') {
    doc = resolveDanmuData(data)
  } else if (cmd === 'LIVE') {
    doc = resolveLiveData(data)
  } else if (cmd === 'PREPARING') {
    doc = resolvePreparing(data)
  } else if (cmd === 'AREA_RANK_CHANGED') {
    doc = resolveAreaRankChanged(data)
  } else {
    doc = resolveDefault(data)
  }
  if (doc && !doc.localDate) {
    doc.localDate = localDate()
  }
  return doc
}

function resolveDanmuData(data: _DANMU_MSG) {
  const dmInfo = data.info
  const senderInfo = dmInfo[2]
  const cardInfo = dmInfo[3]
  const senderLiveLevelInfo = dmInfo[4]
  const sendTime = dmInfo[0][4]
  const dmJson = JSON.parse(dmInfo[0][15].extra)

  const senderUid = senderInfo[0]
  const senderName = senderInfo[1]

  const cardLevel = cardInfo[0]
  const cardName = cardInfo[1]
  const cardLiver = cardInfo[2]
  const cardRoomId = cardInfo[3]
  const cardLiverUid = cardInfo[12]

  const senderLiveLevel = senderLiveLevelInfo[0]

  return {
    localDate: localDate(sendTime),
    content: dmJson.content,
    senderName: senderName,
    senderUid: senderUid,
    card: {
      level: cardLevel,
      name: cardName,
      liver: cardLiver,
      roomid: cardRoomId,
      liverUid: cardLiverUid
    },
    dm_type: dmJson.dm_type,
    mode: dmJson.mode,
    color: '#' + (dmJson.color).toString(16),
    font_size: dmJson.font_size,
    senderLiveLevel: senderLiveLevel,
    player_mode: dmJson.player_mode,
    show_player_type: dmJson.show_player_type,
    is_audited: dmJson.is_audited,
    recommend_score: dmJson.recommend_score,
  }
}

function resolveLiveData(data: LIVE_DATA) {
  if (data.live_time) {
    const doc = {
      live_platform: data.live_platform,
      live_model: data.live_model,
      localDate: localDate(data.live_time * 1000)
    }
    return doc
  }
}

function resolvePreparing(data: PREPARING_DATA) {
  return {
    localDate: localDate()
  }
}

function resolveSendGift(msg: SEND_GIFT) {

}

function resolveAreaRankChanged(data: AREA_RANK_CHANGED_DATA) {
  return {
    rank_name: data.data.rank_name,
    rank: data.data.rank,
    localDate: localDate(data.data.timestamp * 1000),
    action_type: data.data.action_type
  }
}

function resolveDefault(data: any) {
  return data.data
}