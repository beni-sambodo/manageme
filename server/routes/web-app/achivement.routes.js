import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/achivement.controller.js'

const router = Router()

// Routes for the Achivement model
router.post('/', role(['ceo']), create) // Create an achivement
router.get('/school/:school', getAll) // Get all achivements for a school
router.get('/dashboard', role(['ceo']), get) // Get all achivements for a dashboard
router.get('/:id', getOne) // Get one achivement by ID
router.put('/:id', role(['ceo']), update) // Update achivement by ID
router.delete('/:id', role(['ceo']), remove) // Delete achivement by ID

export default router
