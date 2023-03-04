import fetch from 'node-fetch'
import { createClient } from 'redis';
import { parseCookie } from './utils.js';
import tunnel from 'tunnel'

const redisClient = createClient();
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

export async function replyWb(wb_id, content) {
  const comment = await queryGPT(content)
  if (comment) {
    const result = await commentWb(wb_id, comment)
    console.log(`Comment ${wb_id} result`, result)
  }
}

async function queryGPT(wb) {
  let comment
  try {
    comment = await completeChat({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: '海海是一名年轻的女性虚拟主播，假设你是她的粉丝'
      }, {
        role: 'user',
        content: `海海发了条微博，内容是：“${wb}”。请使用中文，不需要包含称呼，用一个极其弱智的身份，用反问句回复这个微博。注意，你的回复只应该包含回复内容，并且不能用双引号括起来，必须在20字以内。`
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
  const url = 'https://weibo.com/ajax/comments/create'
  const params = new URLSearchParams()
  params.append('id', id)
  params.append('comment', content.trim() + '（chatGPT自动生成）')
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

