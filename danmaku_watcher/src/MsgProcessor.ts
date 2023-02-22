import TypedEmitter from 'typed-emitter'
import { DANMU_MSG, SEND_GIFT, _DANMU_MSG } from 'tiny-bilibili-ws'
import { MessageEvents } from './types/events'
import { AREA_RANK_CHANGED_DATA, LIVE_DATA, MSG_DATA, MSG_UNION, PREPARING_DATA } from './types/msg'
import type { MongoHelper } from './MongoHelper'

const Collections = {
  DANMU: 'danmu',
  BEGIN_LIVE: 'begin_live',
  AREA_RANK: 'area_rank',
} as const

export class MsgProcessor {
  public ignoreMsgList = [
    'STOP_LIVE_ROOM_LIST',
    'NOTICE_MSG',
    'ONLINE_RANK_TOP3',
    'LIVE_INTERACTIVE_GAME',
    'RECOMMEND_CARD',
    'GOTO_BUY_FLOW',
    'ENTRY_EFFECT',
  ]
  public isLiving: boolean
  constructor(public roomId: number, public mongoHelper: MongoHelper, public eventBus: TypedEmitter<MessageEvents>) {
    this.isLiving = false
  }

  async init() {
    await this.getIsLiving()
    this.eventBus.on('msg', (msg) => this.processMsg(msg))
  }

  async getIsLiving() {
    const url = `https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomPlayInfo?room_id=${this.roomId}`
    const res = await fetch(url)
    const info = await res.json()
    if (info.code === 0) {
      if (info.data?.live_status === 1) {
        this.isLiving = true
      } else {
        this.isLiving = false
      }
    }
  }

  getDb() {
    return this.mongoHelper.getDb('bili_' + this.roomId)
  }

  localDate(v?: number) {
    const d = new Date(v || Date.now())
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString()
  }

  processMsg(msg: MSG_DATA) {
    if (this.ignoreMsgList.includes(msg.cmd)) {
      return
    }
    switch (msg.cmd) {
      case 'DANMU_MSG':
        this.processDanmu(msg)
        break
      case 'LIVE':
        this.processBeginLive(msg)
        break
      case 'AREA_RANK_CHANGED':
        this.processAreaRankChanged(msg)
    }
  }

  processDanmu(content: _DANMU_MSG) {
    const dmInfo = content.info
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

    const doc = {
      localDate: this.localDate(sendTime),
      isLiving: this.isLiving,
      content: dmJson.content,
      senderName: senderName,
      senderUid: senderUid,
      card: {
        level: cardLevel,
        name: cardName,
        liver: cardLiver,
        roomid: cardRoomId,
        liverUid: cardLiverUid,
      },
      dm_type: dmJson.dm_type,
      mode: dmJson.mode,
      color: '#' + dmJson.color.toString(16),
      font_size: dmJson.font_size,
      senderLiveLevel: senderLiveLevel,
      player_mode: dmJson.player_mode,
      show_player_type: dmJson.show_player_type,
      is_audited: dmJson.is_audited,
      recommend_score: dmJson.recommend_score,
    }
    this.getDb()?.collection(Collections.DANMU).insertOne(doc)
  }

  processAreaRankChanged(content: AREA_RANK_CHANGED_DATA) {
    const doc = {
      rank_name: content.data.rank_name,
      rank: content.data.rank,
      localDate: this.localDate(content.data.timestamp * 1000),
      action_type: content.data.action_type,
    }
    this.getDb()?.collection(Collections.AREA_RANK).insertOne(doc)
  }

  processBeginLive(content: LIVE_DATA) {
    if (content.live_time) {
      const doc = {
        live_platform: content.live_platform,
        live_model: content.live_model,
        localDate: this.localDate(content.live_time * 1000),
      }
      this.getDb()?.collection(Collections.BEGIN_LIVE).insertOne(doc)
    }
  }

  processPreparing() {
    this.isLiving = false
    // TODO
    // this.generateWakuInfo()
  }

  processInteractWord() {
    // TODO
  }
}
