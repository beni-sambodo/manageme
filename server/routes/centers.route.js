import { Router } from 'express'
import auth from '../middlewares/auth.middleware.js'
import controller from '../controllers/centers.controller.js'

const router = Router()

router.get('/courses', auth, controller.getCourses)

router.post('/reception', auth, controller.newReception)

export default router
