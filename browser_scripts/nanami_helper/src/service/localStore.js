import { BLOCK_MAP_KEY, ALREADY_INSTALL_KEY, UNICYCLE_INTERVAL_KEY, UNICYCLE_RULE_KEY } from '@/constants'

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

export function loadBlockMap() {
  // eslint-disable-next-line no-undef
  const str = GM_getValue(BLOCK_MAP_KEY)
  if (!str) {
    return []
  } else {
    return JSON.parse(str)
  }
}

export function saveBlockMap() {
  // eslint-disable-next-line no-undef
  GM_setValue(BLOCK_MAP_KEY, JSON.stringify(rules))
}

/**
 * @returns { {id: string; name: string; roomId: string; mapping: string}[] }
 */
export function loadActiveBlockMap() {
  // eslint-disable-next-line no-undef
  const str = GM_getValue(BLOCK_MAP_KEY)
  if (!str) {
    return []
  } else {
    return JSON.parse(str)
  }
}

/**
 * 
 * @param { {id: string; name: string; roomId: string; mapping: string}[] } value 
 */
export function saveActiveBlockMap(value) {
  // eslint-disable-next-line no-undef
  GM_setValue(BLOCK_MAP_KEY, JSON.stringify(value))
}

export function loadAlreadyInstalled() {
  // eslint-disable-next-line no-undef
  const value = GM_getValue(ALREADY_INSTALL_KEY)
  return !!value
}

export function saveAlreadyInstalled(value) {
  // eslint-disable-next-line no-undef
  GM_setValue(UNICYCLE_INTERVAL_KEY, value)
}