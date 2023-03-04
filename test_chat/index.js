import tunnel from 'tunnel'
import fetch from 'node-fetch'
async function main() {
  const content = {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system',
      content: 'You are a fan of a vtuber, her name is 海海'
    }, {
      role: 'user',
      content: `海海发了条微博，内容是：“我感觉除了哑 总是唱着唱着鼻子就堵了 之前录音也是”。请使用中文，不需要包含称呼，用一个极其弱智的语气，用反问句回复这个微博。注意，你的回复只应该包含回复内容，并且不能用双引号括起来，必须在20字以内。`
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
  console.log('data', data.choices[0].message.content)
}

main()