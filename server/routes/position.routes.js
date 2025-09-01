import { Router } from 'express'
import role from '../middlewares/role.middleware.js'
import controller from '../controllers/position.controller.js'
import permission from '../middlewares/permission.middleware.js'

const router = Router()
const thisRole = ['CEO', 'ADMINISTRATOR']

router.get('/', role(thisRole), controller.getPositions)
router.get('/:id', role(thisRole), controller.getById)
router.post(
  '/',
  role(thisRole),
  permission('create', 'position'),
  controller.create
)
router.put(
  '/:id',
  role(thisRole),
  permission('update', 'position'),
  controller.update
)
router.delete(
  '/:id',
  role(thisRole),
  permission('delete', 'position'),
  controller.deleteOne
)
export default router
