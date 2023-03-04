import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import { initRedis, redisClient } from "./redis.js"
import { redisKeys } from './constants.js'

const app = new Koa()
const router = new Router()

router.post('/set_wb_cookie', (ctx, next) => {
  console.log('api set_wb_cookie', ctx.request.body)
  if (typeof ctx.request.body.wb_cookie === 'string') {
    redisClient.set(redisKeys.wb_cookie, ctx.request.body.wb_cookie)
    console.log('set WB_COOKIE success')
    ctx.body = {result: 'success'}
  } else {
    console.log('missing WB_COOKIE field')
    ctx.body = {result: 'missing wb_cookie field'}
  }
})


await initRedis()
app.use(bodyParser({})).use(router.routes()).use(router.allowedMethods())
app.listen(10010)