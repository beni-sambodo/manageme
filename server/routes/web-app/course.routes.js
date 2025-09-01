import { Router } from 'express'
import {
  getAll,
  getOne,
  getDashboardData,
} from '../../controllers/web-app/course.controller.js'

const router = Router()

// Routes for the Course model
router.get('/school/:school', getAll) // Get all courses for a school
router.get('/:id', getOne) // Get a specific course by ID
router.get('/dashboard', getDashboardData) // Get dashboard data for courses

export default router
