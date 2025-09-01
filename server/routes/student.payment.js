import { Router } from 'express'
import role from '../middlewares/role.middleware.js'
import controller from '../controllers/student-payment.controller.js'
import permission from '../middlewares/permission.middleware.js'

const router = Router()

const thisRole = ['CEO', 'MANAGER', 'ADMINISTRATOR']

router.get('/', role(thisRole), controller.getStudent)

router.get('/filtered', role(thisRole), controller.getByMonth)

router.post(
  '/pay',
  role(thisRole),
  permission('pay', 'student_payment'),
  controller.pay
)

router.post(
  '/discount',
  role(thisRole),
  permission('discount', 'student_payment'),
  controller.discount
)

export default router
