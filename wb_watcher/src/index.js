import fetch from 'node-fetch'
import { sleep } from './utils.js'
import { replyWb } from './comment.js'
import { sendNotification } from './notify.js'

const wb_uid = 7198559139 // nana7mi
console.log('openaikey', process.env.OPENAI_KEY)

let lastWb = ''

async function getLatestWb() {
  const url = `https://m.weibo.cn/api/container/getIndex?containerid=107603${wb_uid}`
  const resp = await fetch(url)
  const respData = await resp.json()
  try {
    const cards = respData.data.cards
    if (cards.length === 0) {
      console.log('Fetch Weibo Cards empty')
    } else {
      console.log('Fetch Latest Weibo', cards[0]?.mblog?.text)
    }
    if (cards[0]?.mblog?.text !== lastWb) {
      lastWb = cards[0].mblog.text
      return cards[0].mblog.text
    }
  } catch (e) {
    console.log('Fetch Weibo Error.', 'Cards length: ', respData.data.cards.length, e)
    return
  }
}

async function main() {
  while (true) {
    try {
      const latestWb = await getLatestWb()
      if (latestWb) {
        console.log('New Weibo Content: ', latestWb)
        sendNotification('七海微博更新啦！', latestWb)
        replyWb(123, latestWb)
      }
    } catch (e) {
      console.log('Error', e)
    }
    await sleep(15000)
  }
}

main()
