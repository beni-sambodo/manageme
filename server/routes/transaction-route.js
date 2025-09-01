import { Router } from 'express'
import role from '../middlewares/role.middleware.js'
import permission from '../middlewares/permission.middleware.js'
import controller from '../controllers/transaction.controller.js'
import auth from '../middlewares/auth.middleware.js'

const router = Router()
const thisRole = ['CEO', 'MANAGER', 'ADMINISTRATOR']

router.get(
  '/',
  role(thisRole),
  permission('get', 'transaction'),
  controller.getSchool
)

router.get('/admin', role(thisRole), controller.getSchool)

router.get('/my', auth, controller.getUser)

router.get('/type', role(thisRole), controller.getType)
router.post(
  '/type',
  role(thisRole),
  permission('create', 'transaction_type'),
  controller.typeCreate
)
router.put(
  '/type/:id',
  role(thisRole),
  permission('update', 'transaction_type'),
  controller.updateType
)
router.delete(
  '/type/:id',
  role(thisRole),
  permission('delete', 'transaction_type'),
  controller.deleteType
)
export default router
