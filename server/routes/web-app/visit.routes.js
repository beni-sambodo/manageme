import { Router } from 'express'
import { add, get } from '../../controllers/web-app/visit.controller.js'
import role from '../../middlewares/role.middleware.js'
const router = Router()

router.post('/:school', add)
router.get('/', role(['ceo']), get)

export default router
