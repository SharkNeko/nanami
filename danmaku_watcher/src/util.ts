export function toCsvField(content: string): string {
  let quoteFlag = false
  if (content.includes(`"`)) {
    content = content.replaceAll('"', '""')
    quoteFlag = true
  }
  if (content.includes(',')) {
    quoteFlag = true
  }
  if (quoteFlag) {
    content = `"${content}"`
  }
  return content
}

export function localDate(v?: number) {
  const d = new Date(v || Date.now())
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString()
}
