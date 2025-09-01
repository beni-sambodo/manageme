import controller from '../controllers/memory.controller.js'
import auth from '../middlewares/auth.middleware.js'
import { Router } from 'express'
import role from '../middlewares/role.middleware.js'

const router = Router()
const thisRole = ['CEO', 'ADMIN', 'MANAGER']

router.get('/total-memory', auth, role(thisRole), controller.totalMemory)

export default router
