import { Router } from 'express'
import controller from '../controllers/course.controller.js'
import role from '../middlewares/role.middleware.js'
import permission from '../middlewares/permission.middleware.js'
const roles = ['CEO', 'ADMINISTRATOR', 'MANAGER', 'TEACHER']

const router = Router()

router.get('/', role(roles), controller.getAll)
router.get('/:id', controller.getOne)
router.post(
  '/',
  role(roles),
  permission('create', 'course'),
  controller.create
)
router.put(
  '/:id',
  role(roles),
  permission('update', 'course'),
  controller.update
)
router.delete(
  '/:id',
  role(roles),
  permission('delete', 'course'),
  controller.deleteOne
)
export default router
