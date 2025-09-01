import { Router } from 'express'
import controller from '../controllers/course-category.controller.js'
import auth from '../middlewares/admin.middleware.js'
const router = Router()

router.get('/', controller.getAll)
router.post('/', auth, controller.create)
router.put('/:id', auth, controller.update)
router.delete('/:id', auth, controller.deleteOne)
export default router
