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
