import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/banner.controller.js'

const router = Router()

// Routes for the Banner model
router.post('/', role(['ceo']), create) // Create a banner
router.get('/school/:school', getAll) // Get all banners for a school
router.get('/dashboard', role(['ceo']), get) // Get all banners for a dashboard
router.get('/:id', getOne) // Get one banner by ID
router.put('/:id', role(['ceo']), update) // Update banner by ID
router.delete('/:id', role(['ceo']), remove) // Delete banner by ID

export default router
