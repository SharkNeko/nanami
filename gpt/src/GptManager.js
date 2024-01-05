import fetch from 'node-fetch'
import tunnel from 'tunnel'

export class GptManager {
  constructor(apiKey, proxy) {
    this.apiKey = apiKey
    this.proxy = proxy
  }

  async request(url, body) {
    const config = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    }
    if (this.proxy) {
      const parsedProxyUrl = new URL(this.proxy)
      config.agent = tunnel.httpsOverHttp({
        proxy: {
          host: parsedProxyUrl.hostname,
          port: parseInt(parsedProxyUrl.port),
        },
      })
    }
    return fetch(url, config)
  }

  async singleChat(content, model = 'gpt-4-1106-preview') {
    const url = 'https://api.openai.com/v1/chat/completions'
    const body = {
      model,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    }
    const resp = await this.request(url, body)
    const data = await resp.json()
    return data.choices[0].message.content.replaceAll('\n', '').replaceAll(' ', '')
  }

  async explainImage(question, imageUrl) {
    const url = 'https://api.openai.com/v1/chat/completions'
    const model = 'gpt-4-vision-preview'
    const body = {
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 2000
    }
    const resp = await this.request(url, body)
    const data = await resp.json()
    if (data.error) {
      throw new Error(data.error?.message || 'Unknown error')
    }
    return data.choices[0].message.content.replaceAll('\n', '').replaceAll(' ', '')
  }
}
