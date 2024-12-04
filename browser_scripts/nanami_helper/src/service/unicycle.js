import { sendChat } from './chat'

let unicycleTimer = null

export function startUnicyle(text, interval = 6) {
  stopUnicycle()
  if (!text) {
    return
  }
  const chats = text.split('\n')
  let index = 0
  const run = () => {
    sendChat(chats[index])
    index++
    if (index >= chats.length) {
      index = 0
    }
  }

  run()
  unicycleTimer = setInterval(run, interval * 1000)
}

export function stopUnicycle() {
  clearInterval(unicycleTimer)
  unicycleTimer = null
}
