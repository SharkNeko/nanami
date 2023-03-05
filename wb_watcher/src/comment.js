import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import tunnel from 'tunnel'
import { createClient } from 'redis';
import { parseCookie } from './utils.js';

const redisClient = createClient();
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

export async function replyWb(wb_id, content) {
  const comment = await queryGPT(content)
  if (comment) {
    const result = await commentWb(wb_id, comment)
    console.log(`Comment ${wb_id} result`, result.msg)
  }
}

async function queryGPT(wb) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const promptList = fs.readFileSync(path.resolve(__dirname, '../prompt.txt'), 'utf-8').split('\n').filter((line) => line)
  const prompt = promptList[Math.floor(Math.random() * promptList.length)]
  console.log('使用prompt请求chatGPT：', prompt)
  let comment
  try {
    comment = await completeChat({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: '假设海海是你最喜欢的一名女性主播。'
      }, {
        role: 'user',
        content: prompt.replace('${wb}', wb)
      }]
    })
    console.log('获取chatGPT回复：', comment)
  } catch (e) {
    console.log('Querying chatGPT error', e)
  }
  return comment
}

async function completeChat(content) {
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_KEY}`
    },
    body: JSON.stringify(content),
  }
  if (process.env.CLASH) {
    config.agent = tunnel.httpsOverHttp({
      proxy: {
        host: '192.168.0.241',
        port: 7890
      }
    })
  }
  const resp = await fetch('https://api.openai.com/v1/chat/completions', config)
  const data = await resp.json()
  return data.choices[0].message.content
}

async function commentWb(id, content) {
  let _content = content.trim().slice(0, 120)
  const url = 'https://weibo.com/ajax/comments/create'
  const params = new URLSearchParams()
  params.append('id', id)
  params.append('comment', _content + '（chatGPT自动生成）')
  params.append('is_comment', '0')
  params.append('comment_ori', '0')
  params.append('is_repost', '0')
  params.append('pic_id', '')
  const cookie = await redisClient.get('WB_COOKIE')
  if (!cookie) {
    console.log('Weibo Cookie is Null !')
    return
  }
  const xsrf_token = parseCookie(cookie)['XSRF-TOKEN']
  if (!xsrf_token) {
    console.log('No Weibo XSRF-TOKEN !')
    return
  }
  try {
    const resp = await fetch(url, {
      method: 'post',
      body: params,
      headers: {
        cookie,
        'x-xsrf-token': xsrf_token
      }
    })
    return await resp.json()
  } catch (e) {
    console.log(`评论微博${id}失败`, e)
  }
  return {}
}

