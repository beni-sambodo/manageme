import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/portfolio.controller.js'

const router = Router()

// Routes for the Portfolio model
router.post('/', role(['ceo']), create) // Create a portfolio
router.get('/school/:school', getAll) // Get all portfolios for a school
router.get('/dashboard', role(['ceo']), get) // Get all portfolios for a dashboard
router.get('/:id', getOne) // Get one portfolio by ID
router.put('/:id', role(['ceo']), update) // Update portfolio by ID
router.delete('/:id', role(['ceo']), remove) // Delete portfolio by ID

export default router
