export async function sendMsg(giftName) {
  const body = {
    title: `给七海赠送了开播礼物: ${giftName}！`,
    desp: '海海',
  }

  const notifyUrl = `https://sctapi.ftqq.com/${process.env.SEND_KEY}.send`
  const resp = await fetch(notifyUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  })
  console.log('Notify Result: ', JSON.stringify(await resp.json()))
}