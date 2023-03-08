import Router from '@koa/router'
import * as api from './views/api.js'

const router = new Router()

const apiRouter = new Router()
apiRouter.post('/test_api', api.testApi)

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

export default router
