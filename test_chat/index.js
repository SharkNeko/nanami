import {Configuration, OpenAIApi} from 'openai'


async function main() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system',
      content: 'You are a fan of a vtuber, her name is 海海'
    }, {
      role: 'user',
      content: `海海发了个推特，内容是：“我感觉除了哑 总是唱着唱着鼻子就堵了 之前录音也是”。请在推特底下回复她，语气要自然和幽默一些，要符合中国人的习惯，没有翻译腔。注意，你的回复只应该包含回复内容，并且不能用双引号括起来。`
    }]
  })
  console.log('data', response.data.choices)
}

main()