import { Router } from 'express'
import controller from '../controllers/group.controller.js'
import role from '../middlewares/role.middleware.js'
import permission from '../middlewares/permission.middleware.js'
import auth from '../middlewares/auth.middleware.js'

const router = Router()
const thisRole = ['CEO', 'MANAGER', 'ADMINISTRATOR']
const thisRole2 = ['CEO', 'MANAGER', 'ADMINISTRATOR', 'TEACHER']

router.get('/', role(thisRole), permission('get', 'group'), controller.get)
router.get('/search', role(thisRole), controller.search)
router.get('/teacher', role(['TEACHER']), controller.teacherGroups)
router.get('/student', auth, controller.studentGroups)
router.get('/:id', role(thisRole2), controller.getOne)
router.get('/:id/monthly-attendance', role(thisRole2), controller.getMonthlyAttendance)


router.post(
  '/',
  role(thisRole),
  permission('create', 'group'),
  controller.create
)
router.put(
  '/:id',
  role(thisRole),
  permission('update', 'group'),
  controller.update
)
router.put(
  '/status/:id',
  role(thisRole),
  permission('status', 'group'),
  controller.status
)

router.post('/student', role(thisRole2), controller.deleteFromGroup)
router.delete(
  '/:id',
  role(thisRole),
  permission('delete', 'group'),
  controller.delete
)

export default router
