import fetch from 'node-fetch'
import { createCountLogger, sleep, log } from './utils.js'

const wb_uid = 7198559139 // nana7mi
const cookie = ''
const ua = ''

let lastWb = ''

async function getLatestWb() {
  const url = `https://m.weibo.cn/api/container/getIndex?containerid=107603${wb_uid}`
  const resp = await fetch(url, {
    headers: {
      Cookie: cookie,
      'User-Agent': ua,
    },
  })
  const respData = await resp.json()
  try {
    const cards = respData.data.cards
    if (cards.length === 0) {
      log('Fetch Weibo Cards empty')
    } else {
      log('Fetch Latest Weibo', cards[0]?.mblog?.text)
    }
    if (cards[0]?.mblog?.text !== lastWb) {
      lastWb = cards[0].mblog.text
      return cards[0].mblog.text
    }
  } catch (e) {
    log('Fetch Weibo Error.', 'Cards length: ', respData.data.cards.length, e)
    return
  }
}

async function sendMsg(msg) {
  const body = {
    title: '七海微博更新啦！',
    desp: msg,
  }

  const notifyUrl = `https://sctapi.ftqq.com/${process.env.SEND_KEY}.send`
  const resp = await fetch(notifyUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  })
  log('Notify Result: ', JSON.stringify(await resp.json()))
}

async function main() {
  const logCount = createCountLogger(10)
  while (true) {
    try {
      logCount()
      const latestWb = await getLatestWb()
      if (latestWb) {
        log('New Weibo Content: ', latestWb)
        sendMsg(latestWb)
      }
    } catch (e) {
      log('Error', e)
    }
    await sleep(15000)
  }
}

main()
