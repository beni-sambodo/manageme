import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/partner.controller.js'

const router = Router()

router.post('/', role(['ceo']), create) // Create a partner
router.get('/school/:school', getAll) // Get all partners for a school
router.get('/dashboard', role(['ceo']), get) // Get all partners for a dashboard
router.get('/:id', getOne) // Get one partner by ID
router.put('/:id', role(['ceo']), update) // Update partner by ID
router.delete('/:id', role(['ceo']), remove) // Delete partner by ID

export default router
