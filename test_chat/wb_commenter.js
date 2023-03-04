import fetch from 'node-fetch'

const client_id = ''
const app_secret = ''
const redirect_uri = ''

const my_code = ''
const my_access_token = ''
const my_uid = ''

const cookie = ''
const xsrf_token= ''

const auth_url = `https://api.weibo.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
// console.log(auth_url)

async function getToken(code) {
  const get_token_url = 'https://api.weibo.com/oauth2/access_token'
  const payload = {
    client_id: client_id,
    client_secret: app_secret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect_uri,
  }
  const url = get_token_url + '?' + buildParam(payload)
  console.log(url)
  const resp = await fetch(url, {
    method: 'post',
  })
  const data = await resp.json()
  return data
}

function buildParam(obj) {
  let param = []
  const keys = Object.keys(obj)
  for (const key of keys) {
    param.push(`${key}=${obj[key]}`)
  }
  return param.join('&')
}

// console.log('token:', await getToken(my_code))

async function sendComment() {
  const url = 'https://api.weibo.com/2/statuses/share.json'

  const params = new URLSearchParams()
  params.append('access_token', my_access_token)
  params.append('status', '欢迎访问我的微博！')
  params.append('rip', '')
  const response = await fetch(url, {
    method: 'post',
    body: params,
  })
  const data = await response.json()
  return data
}
// console.log('send wb', await sendComment())

async function sendCommentWithCookie(id) {
  const url = 'https://weibo.com/ajax/comments/create'
  const params = new URLSearchParams()
  params.append('id', id)
  params.append('comment', '这个不错')
  params.append('is_comment', '0')
  params.append('comment_ori', '0')
  params.append('is_repost', '0')
  params.append('pic_id', '')

  const resp = await fetch(url, {
    method: 'post',
    body: params,
    headers: {
      cookie,
      'x-xsrf-token': xsrf_token
    }
  })

  const data = await resp.json()
  return data
}

console.log('send wb', await sendCommentWithCookie())