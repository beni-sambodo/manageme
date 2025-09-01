import { Router } from 'express'
import role from '../middlewares/role.middleware.js'
import controller from '../controllers/statistics.controller.js'
import permission from '../middlewares/permission.middleware.js'

const router = Router()
const thisRole = ['CEO', 'ADMINISTRATOR', 'MANAGER']
router.get('/', role(thisRole), permission('get', 'statistics'), controller.get)

router.get(
  '/month-payments',
  role(thisRole),
  permission('get', 'statistics'),
  controller.paymentsMonth
)

router.get(
  '/daily-registrations',
  role(thisRole),
  permission('get', 'statistics'), // Assuming same permission as other stats
  controller.getDailyRegistrations
)

router.get(
  '/subject-distribution',
  role(thisRole),
  permission('get', 'statistics'),
  controller.getSubjectDistribution
)

router.get(
  '/course-debtors',
  role(thisRole),
  permission('get', 'statistics'),
  controller.getCourseDebtors
)

export default router
