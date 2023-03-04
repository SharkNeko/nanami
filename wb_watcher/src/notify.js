export async function sendNotification(title, desp) {
  const body = {
    title, desp,
  }

  const notifyUrl = `https://sctapi.ftqq.com/${process.env.SERVERCHAN_KEY}.send`
  const resp = await fetch(notifyUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  })
  console.log('Notify Result: ', JSON.stringify(await resp.json()))
}