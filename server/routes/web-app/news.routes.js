import { Router } from 'express'
import role from '../../middlewares/role.middleware.js'
import {
  create,
  get,
  getAll,
  getOne,
  remove,
  update,
} from '../../controllers/web-app/news.controller.js'
const router = Router()

router.post('/', role(['ceo']), create)
router.get('/school/:school', getAll)
router.get('/dashboard', role(['ceo']), get)
router.get('/:id', getOne)
router.put('/:id', role(['ceo']), update)
router.delete('/:id', role(['ceo']), remove)

export default router
