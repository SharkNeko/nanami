export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createCountLogger(interval) {
  let count = 0
  return () => {
    if (count % interval === 0) {
      console.log('Count', count)
    }
    count += 1
  }
}

export function parseCookie(cookie) {
  if (!cookie) {
    return {}
  }
  const result = {}
  const kvList = cookie.split(';')
  for (const kvStr of kvList) {
    const kvPair = kvStr.split('=')
    if (kvPair[0].trim()) {
      result[kvPair[0].trim()] = (kvPair[1] || '').trim()
    }
  }
  return result
}