import {Configuration, OpenAIApi} from 'openai'

export async function replyWb(wb_id, content) {
  const comment = await queryGPT(content)
  return comment
}

async function queryGPT(wb) {
  let comment
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: '海海是一名年轻的女性虚拟主播，假设你是她的粉丝'
      }, {
        role: 'user',
        content: `海海发了条微博，内容是：“${wb}”。请使用中文，不需要包含称呼，用一个极其弱智的身份，用反问句回复这个微博。注意，你的回复只应该包含回复内容，并且不能用双引号括起来，必须在15字以内。`
      }]
    })
    comment = response.data.choices[0].message?.content?.trim()
    console.log('获取chatGPT回复：', comment)
  } catch (e) {
    console.log('Querying chatGPT error', e)
  }
  return comment
}