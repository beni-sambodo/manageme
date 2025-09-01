import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/question.controller.js'

const router = Router()

// Routes for the Question model
router.post('/', role(['ceo']), create) // Create a question
router.get('/school/:school', getAll) // Get all questions for a school
router.get('/dashboard', role(['ceo']), get) // Get all questions for a dashboard
router.get('/:id', getOne) // Get one question by ID
router.put('/:id', role(['ceo']), update) // Update question by ID
router.delete('/:id', role(['ceo']), remove) // Delete question by ID

export default router
