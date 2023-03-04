import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import { initRedis, redisClient } from "./redis.js"
import { redisKeys } from './constants.js'

const app = new Koa()
const router = new Router()

router.post('/set_wb_cookie', (ctx, next) => {
  console.log('set_wb_cookie', ctx.request.body)
  if (typeof ctx.request.body.wb_cookie === 'string') {
    redisClient.set(redisKeys.wb_cookie, ctx.request.body.wb_cookie)
  }
  ctx.body = {code: 200}
})


await initRedis()
app.use(bodyParser({})).use(router.routes()).use(router.allowedMethods())
app.listen(10010)