import { Router } from 'express'
import controller from '../controllers/admin.controller.js'
import adminMiddleware from '../middlewares/admin.middleware.js'

const router = Router()

router.post('/login', controller.login)

router.post('/new-admin', adminMiddleware, controller.newAdmin)

router.get('/schools', adminMiddleware, controller.getSchools)
router.put('/school/:id', adminMiddleware, controller.statusSchool)
router.delete('/school/:id', adminMiddleware, controller.deleteSchool)

export default router
