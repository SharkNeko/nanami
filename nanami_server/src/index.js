import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './router.js'

const app = new Koa()

app.use(bodyParser({})).use(router.routes()).use(router.allowedMethods())
app.listen(10011)