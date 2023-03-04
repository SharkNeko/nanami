import fetch from 'node-fetch'
import { sleep } from './utils.js'
import { replyWb } from './comment.js'
import { sendNotification } from './notify.js'

const wb_uid = 7198559139 // nana7mi

let prevWbText = ''

async function getLatestWb() {
  const url = `https://m.weibo.cn/api/container/getIndex?containerid=107603${wb_uid}`
  const resp = await fetch(url)
  const respData = await resp.json()
  try {
    const cards = respData.data.cards
    if (cards.length === 0) {
      console.log('Fetch Weibo Cards empty')
    }
    const latestWb = cards[0]?.mblog
    if (!latestWb) {
      console.log('Latest Weibo is null')
      return
    }
    if (!prevWbText) {
      prevWbText = latestWb.text
      console.log('启动程序获取第一条微博', prevWbText)
    }
    if (latestWb.text !== prevWbText) {
      prevWbText = latestWb.text
      return {
        content: latestWb.text,
        id: latestWb.id
      }
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
        console.log('New Weibo Content: ', latestWb.content)
        sendNotification('七海微博更新啦！', latestWb.content)
        replyWb(latestWb.id, latestWb.content)
      }
    } catch (e) {
      console.log('Error', e)
    }
    await sleep(15000)
  }
}

main()
