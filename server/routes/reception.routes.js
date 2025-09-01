import { Router } from 'express'
import controller from '../controllers/reception.controller.js'
import permission from '../middlewares/permission.middleware.js'
import role from '../middlewares/role.middleware.js'
const router = Router()
const thisRole = ['CEO', 'ADMINISTRATOR', 'MANAGER']

// GET request to fetch students
router.get('/', role(thisRole), controller.getStudents)
router.get('/:id', role(thisRole), controller.getOne)
// POST request to create a new student
router.post(
  '/',
  role(thisRole),
  permission('new_student', 'reception'),
  controller.create
)

router.post(
  '/create-new',
  role(thisRole),
  permission('new_student', 'reception'),
  controller.createNew
)

router.put('/update-many', role(thisRole), controller.updateMany)

router.put('/add-group', role(thisRole), controller.addGroup)

// PUT request to update a specific student by id
router.put(
  '/:id',
  role(thisRole),
  permission('update_student', 'reception'),
  controller.update
)

// POST request to delete multiple students
router.post('/delete-many', role(thisRole), controller.deleteReception)

export default router
