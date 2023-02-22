import { MongoClient, Db } from 'mongodb'
import TypedEmitter from "typed-emitter"
import { MessageEvents } from './types/events'

export function getRoomDbName(roomId: number | string) {
  return 'bili_' + roomId
}

export class MongoHelper {
  client?: MongoClient
  dbList: { [name: string]: Db }
  url: string
  constructor(url: string, public eventBus: TypedEmitter<MessageEvents>) {
    this.dbList = {}
    this.url = url
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.url)
      await this.client.connect()
    }
  }

  closeMongo() {
    if (this.client) {
      this.client.close()
    }
  }

  getDb(name: string) {
    let db = this.dbList[name]
    if (db) {
      return db
    } else {
      const newDb = this.client?.db(name)
      if (newDb) {
        this.dbList[name] = newDb
        return newDb
      }
    }
  }
}

