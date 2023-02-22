import { EventEmitter } from 'eventemitter3'
import TypedEmitter from "typed-emitter"
import { ConnManager } from './ConnManager'
import { MessageEvents } from './types/events'
import { MongoHelper } from './MongoHelper'
import { MsgProcessor } from './MsgProcessor'

export class DanmakuWatcher {
  connManager: ConnManager
  mongoHelper: MongoHelper
  msgProcessor: MsgProcessor
  eventBus: TypedEmitter<MessageEvents>
  // ROOM_ID = 13308358 // 甜药
  // ROOM_ID = 21919321 // Hiiro
  // ROOM_ID = 1017 // 散人
  // ROOM_ID = 2347971 // My
  ROOM_ID = 21452505 // 七海
  constructor() {
    this.eventBus = new EventEmitter() as TypedEmitter<MessageEvents>
    this.mongoHelper = new MongoHelper(this.getMongoDbUrl(), this.eventBus)
    this.msgProcessor = new MsgProcessor(this.ROOM_ID, this.mongoHelper, this.eventBus)
    this.connManager = new ConnManager(this.ROOM_ID, this.eventBus)
  }

  async startWatching() {
    await this.msgProcessor.init()
    this.connManager.connect()
    await this.mongoHelper.connect()
  }

  getMongoDbUrl() {
    const env = process.env
    return `mongodb://${env.MONGO_USER}:${env.MONGO_PWD}@localhost:${env.MONGO_PORT || 27017}`
  }
}
