import { Router } from 'express'
import controller from '../controllers/notification.controller.js'
import aMiddleware from '../middlewares/admin.middleware.js'
import uMiddleware from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', aMiddleware, controller.create)
router.put('/:id', aMiddleware, controller.update)
router.delete('/:id', aMiddleware, controller.delete)
router.get('/', uMiddleware, controller.get)

export default router
