import { Router } from 'express'
import controller from '../controllers/room.controller.js'
import role from '../middlewares/role.middleware.js'
import permission from '../middlewares/permission.middleware.js'

const router = Router()
const thisRole = ['CEO', 'ADMIN', 'MANAGER']
router.get('/', role(thisRole), controller.getAll)
router.get('/:id', role(thisRole), controller.getOne)
router.post(
  '/',
  role(thisRole),
  permission('create', 'room'),
  controller.create
)

router.put(
  '/:id',
  role(thisRole),
  permission('update', 'room'),
  controller.update
)
router.delete(
  '/:id',
  role(thisRole),
  permission('delete', 'room'),
  controller.deleteOne
)

export default router
