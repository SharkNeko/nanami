import TypedEmitter from "typed-emitter"
import { MessageEvents } from './types/events'
import { getLongRoomId, KeepLiveTCP } from 'tiny-bilibili-ws'
import { MSG_UNION } from "./types/msg"
export class ConnManager {
  roomId: number
  longRoomId?: number
  liveTCP?: KeepLiveTCP
  constructor(roomId: number, public eventBus: TypedEmitter<MessageEvents>) {
    this.roomId = roomId
  }

  async connect() {
    const res = await getLongRoomId(this.roomId)
    this.longRoomId = res.data.room_id
    this.liveTCP = this.createLiveTCP(this.longRoomId)
  }

  private createLiveTCP(roomId: number) {
    const liveTCP = new KeepLiveTCP(roomId)
    liveTCP.tcpSocket.on('close', () => {
      this.liveTCP?.tcpSocket.destroy()
      this.liveTCP = this.createLiveTCP(roomId)
    })
    liveTCP.on('msg', (msg: MSG_UNION) => {
      const cmd = msg.data?.cmd
      if (cmd) {
        this.eventBus.emit('msg', msg.data)
      } else {
        console.error('Miss data field in msg', msg)
      }
    })
    return liveTCP
  }
}
