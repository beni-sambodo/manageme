import role from '../middlewares/role.middleware.js'
import controller from '../controllers/attendance.controller.js'
import permission from '../middlewares/permission.middleware.js'
import { Router } from 'express'
const router = Router()
const roles = ['CEO', 'ADMINISTRATOR', 'TEACHER']

router.get('/today', role(roles), controller.getCurrentDay)

router.get(
  '/:id',
  role(roles),
  permission('get_one', 'attendance'),
  controller.getAttendance
)
router.post(
  '/',
  role(roles),
  controller.create
)

router.put(
  '/',
  role(roles),
  permission('attent', 'attendance'),
  controller.attent
)

router.put(
  '/end/:id',
  role(roles),
  permission('end', 'attendance'),
  controller.end
)

export default router
