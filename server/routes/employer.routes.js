import { Router } from 'express'
import controller from '../controllers/employer.controller.js'
import permission from '../middlewares/permission.middleware.js'
import role from '../middlewares/role.middleware.js'
import auth from '../middlewares/auth.middleware.js'

const router = Router()
const roles = ['CEO', 'ADMINISTRATOR', 'MANAGER']

router.get('/my-invites', auth, controller.getMyInvites)
router.get(
  '/employees',
  role(roles),
  permission('sent_invite', 'employer'),
  controller.sentInvites
)
router.post(
  '/',
  role(roles),
  permission('send_invite', 'employer'),
  controller.sendRequest
)

router.put('/accept/:id', auth, controller.acceptInvite)
router.put('/cancel/:id', auth, controller.cancelInvite)

router.put(
  '/:id',
  role(roles),
  permission('status', 'employer'),
  controller.status
) //
router.put(
  '/update/:id',
  role(roles),
  permission('update', 'employer'),
  controller.update
)
router.delete(
  '/:id',
  role(roles),
  permission('delete', 'employer'),

  controller.deleteEmployer
)
export default router
