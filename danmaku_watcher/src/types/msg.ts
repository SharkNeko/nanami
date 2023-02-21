import {
  DANMU_MSG,
  SEND_GIFT_MSG,
  WATCHED_CHANGE_MSG,
  ENTRY_EFFECT_MSG,
  INTERACT_WORD_MSG,
  COMBO_SEND_MSG,
  SUPER_CHAT_MSG,
  GUARD_BUY_MSG,
  NOTICE_MSG,
  HOT_RANK_CHANGED_MSG,
  HOT_RANK_CHANGED_V2_MSG,
  ONLINE_RANK_COUNT_MSG,
  STOP_LIVE_ROOM_LIST_MSG,
  Message,
} from 'tiny-bilibili-ws'

export type LIVE_DATA = {
  cmd: 'LIVE'
  live_key: string
  voice_background: string
  sub_session_key: string
  live_platform: string
  live_model: number
  live_time: number
  roomid: number
}

export type PREPARING_DATA = {
  cmd: 'PREPARING'
  roomid: string
}

export type ONLINE_RANK_TOP3_DATA = {
  cmd: 'ONLINE_RANK_TOP3',
  data: {
    list: {
      msg: string
      rank: number
    }[]
  }
}

export type LIVE_INTERACTIVE_GAME_DATA = {
  cmd: 'LIVE_INTERACTIVE_GAME',
  data: any
}

export type AREA_RANK_CHANGED_DATA = {
  cmd: 'AREA_RANK_CHANGED',
  data: {
    conf_id: number
    rank_name: string
    uid: number
    rank: number
    icon_url_blue: string
    icon_url_pink: string
    icon_url_grey: string
    action_type: number
    timestamp: number
    msg_id: string
    jump_url_link: string
    jump_url_pc: string
    jump_url_pink: string
    jump_url_web: string
  }
}

export type LIVE_MSG = Message<LIVE_DATA>
export type PREPARE_MSG = Message<PREPARING_DATA>
export type ONLINE_RANK_TOP3_MSG = Message<ONLINE_RANK_TOP3_DATA>
export type LIVE_INTERACTIVE_GAME_MSG = Message<LIVE_INTERACTIVE_GAME_DATA>
export type AREA_RANK_CHANGED_MSG = Message<AREA_RANK_CHANGED_DATA>

export type MSG_UNION =
  | DANMU_MSG
  | SEND_GIFT_MSG
  | WATCHED_CHANGE_MSG
  | ENTRY_EFFECT_MSG
  | INTERACT_WORD_MSG
  | COMBO_SEND_MSG
  | SUPER_CHAT_MSG
  | GUARD_BUY_MSG
  | NOTICE_MSG
  | HOT_RANK_CHANGED_MSG
  | HOT_RANK_CHANGED_V2_MSG
  | ONLINE_RANK_COUNT_MSG
  | STOP_LIVE_ROOM_LIST_MSG
  | LIVE_MSG
  | PREPARE_MSG
  | ONLINE_RANK_TOP3_MSG
  | LIVE_INTERACTIVE_GAME_MSG
  | AREA_RANK_CHANGED_MSG
