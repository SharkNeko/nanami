import tunnel from 'tunnel'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wb = '一直对捏人没什么所谓但是卧龙的捏人是不是很不戳 能不能捏个刘亦菲 ​​​​​​'

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const promptList = fs.readFileSync(path.resolve(__dirname, 'prompt.txt'), 'utf-8').split('\n')
  const prompt = promptList[Math.floor(Math.random() * promptList.length)].replace('${wb}', wb)
  const content = {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system',
      content: 'You are a fan of a vtuber, her name is 海海'
    }, {
      role: 'user',
      content: prompt
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