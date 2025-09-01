import { Router } from 'express'
import controller from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import resetPassword from '../controllers/reset-password.controller.js'
import role from '../middlewares/role.middleware.js'
import permission from '../middlewares/permission.middleware.js'

const router = Router()
const roles = ['CEO', 'ADMINISTRATOR', 'MANAGET', 'TEACHER']
router.get('/user-data', authMiddleware, controller.getUser)
router.get('/user/:username', authMiddleware, controller.getUserByUsername)
router.get(
  '/full-data/:username',
  role(roles),
  permission('get_full_data', 'user'),
  controller.getFullData
)

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/send-code', resetPassword.sendCode)
router.post('/check-code', resetPassword.checkCode)
router.post('/new-password', resetPassword.newPassword)
router.post('/send-verification-code', authMiddleware, controller.sendVerCode)
router.post('/verify-email', authMiddleware, controller.verifyEmail)

router.put('/select-role/', authMiddleware, controller.selectRole)
router.put('/update', authMiddleware, controller.update)
router.put('/change-password', authMiddleware, controller.changePassword)
router.put('/change-email', authMiddleware, controller.changeEmail)

export default router
