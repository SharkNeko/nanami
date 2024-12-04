import { UNICYCLE_INTERVAL_KEY, UNICYCLE_RULE_KEY } from '@/constants'
import { sendChat } from './chat'

/**
 * @returns { {id: string; name: string; text: string}[] }
 */
export function loadUnicycleRules() {
  // eslint-disable-next-line no-undef
  const str = GM_getValue(UNICYCLE_RULE_KEY)
  if (!str) {
    return []
  } else {
    return JSON.parse(str)
  }
}

/**
 * @param { {id: string; name: string; text: string}[] } rules
 */
export function saveUnicycleRules(rules) {
  // eslint-disable-next-line no-undef
  GM_setValue(UNICYCLE_RULE_KEY, JSON.stringify(rules))
}

export function loadInterval() {
  // eslint-disable-next-line no-undef
  const value = GM_getValue(UNICYCLE_INTERVAL_KEY)
  if (!value) {
    return 6
  } else {
    return parseFloat(value)
  }
}

export function saveInterval(value) {
  // eslint-disable-next-line no-undef
  GM_setValue(UNICYCLE_INTERVAL_KEY, value)
}

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
