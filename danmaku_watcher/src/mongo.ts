import { MongoClient, Db } from 'mongodb'

// mongo
const mongourl = 'mongodb://root:example@localhost:27017'
const biliDbName = 'bili_'

let client: MongoClient

export let db: {bili: Db | null} = {
  bili: null
}

export async function initMongo(roomID: number) {
  client = new MongoClient(mongourl)
  await client.connect()
  db.bili = client.db(biliDbName + roomID)
}

export function closeMongo() {
  if (client) {
    client.close()
  }
}