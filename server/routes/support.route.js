import { Router } from 'express'
import controller from '../controllers/support.controller.js'
import aMiddleware from '../middlewares/admin.middleware.js'
import uMiddleware from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', uMiddleware, controller.create)
router.get('/', aMiddleware, controller.get)

export default router
