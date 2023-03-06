import tunnel from 'tunnel'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const wb = '睡！'

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const promptList = fs.readFileSync(path.resolve(__dirname, './prompt.txt'), 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter((line) => line)
  .filter(line => !line.startsWith('#'))
  console.log(promptList)

  const content = {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system',
      content: '假设海海是你最喜欢的一名女性主播。她发了条微博，请用粉丝的语气回复这条微博，回复不应该包含称呼，必须在10字以内。'
    }, {
      role: 'user',
      content: wb
    }]
  }
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_KEY}`
    },
    body: JSON.stringify(content),
  })
  const data = await resp.json()
  const reply = data.choices[0].message.content.replaceAll('\n', '').replaceAll(' ', '')
  console.log(reply.length, reply)
}

main()
