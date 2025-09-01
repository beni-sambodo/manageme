import { Router } from 'express'
import controller from '../controllers/files.controller.js'
import auth from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.js'
const router = Router()

router.post('/upload/:folder', auth, upload, controller.upload)

router.delete('/delete-many', controller.deleteMany)

router.delete('/delete/:id', controller.deleteOne)

export default router
