import { Router } from 'express'
import controller from '../controllers/school.controller.js'
import role from '../middlewares/role.middleware.js'
import auth from '../middlewares/auth.middleware.js'
const router = Router()
const thisRole = ['CEO', 'ADMINISTRATOR', 'MANAGER']
const thisRole2 = ['CEO', 'ADMINISTRATOR', 'MANAGER', 'TEACHER']
const ceo = ['CEO']

router.get('/students', role(thisRole), controller.getStudents)
router.get('/current-school', role(thisRole2), controller.getCurrentSchool)
router.post('/', auth, controller.create)
router.put('/:id', role(ceo), controller.updateSchool)
router.delete('/:id', role(ceo), controller.deleteSchool)

export default router
