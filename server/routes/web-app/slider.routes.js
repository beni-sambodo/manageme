import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/slider.controller.js'

const router = Router()

// Routes for the Slider model
router.post('/', role(['ceo']), create) // Create a slider
router.get('/school/:school', getAll) // Get all sliders for a school
router.get('/dashboard', role(['ceo']), get) // Get all sliders for a dashboard
router.get('/:id', getOne) // Get one slider by ID
router.put('/:id', role(['ceo']), update) // Update slider by ID
router.delete('/:id', role(['ceo']), remove) // Delete slider by ID

export default router
