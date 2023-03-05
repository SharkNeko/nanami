import tunnel from 'tunnel'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const wb = '听听飞机上空气吉他的练习成果哈哈哈 止痛药吃了应该还没生效！比刚醒的时候稍微好点只能说​​​​​​​​​​​​​​​'

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const promptList = fs.readFileSync(path.resolve(__dirname, 'prompt.txt'), 'utf-8').split('\n')
  // const prompt = promptList[Math.floor(Math.random() * promptList.length)]
  const prompt = '海海发了条微博，内容是：“${wb}”。请以“你说得对，但是原神是一款”为开头，回复这个微博，要言辞激烈，主题首先要契合微博内容，其次要包含原神。注意，你的回复只应该包含回复内容，并且不能用双引号括起来，必须在60字以内。'

  const content = {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system',
      content: '假设海海是你最喜欢的一名女性主播。'
    }, {
      role: 'user',
      content: prompt.replace('${wb}', wb)
    }]
  }
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_KEY}`
    },
    body: JSON.stringify(content),
    agent: tunnel.httpsOverHttp({
      proxy: {
        host: '192.168.0.241',
        port: 7890
      }
    })
  })
  const data = await resp.json()
  console.log('data', data.choices[0].message.content.replaceAll('\n', '').replaceAll(' ', ''))
}

main()