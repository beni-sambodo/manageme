import CourseCategory from '../models/Course-category.js'
import Responser from '../utils/response.js'

const responser = new Responser()

class courseCategoryController {
  async create(req, res) {
    try {
      const { name } = req.body
      if (!name) {
        return responser.res(res, 400, false, 'Required fields are missing')
      }
      const newCategory = await CourseCategory.create({ name })

      return responser.res(res, 201, newCategory)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!id || !name) {
        return responser.res(res, 400, false, 'Required fields are missing')
      }

      const courseCategory = await CourseCategory.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      )

      if (!courseCategory) {
        return responser.res(res, 404, false, 'Course category not found')
      }

      return responser.res(res, 200, courseCategory)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getAll(req, res) {
    try {
      const allCategories = await CourseCategory.find()
      return responser.res(res, 200, allCategories)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return responser.res(res, 400, false, 'Required fields are missing')
      }

      const category = await CourseCategory.findByIdAndDelete(id)

      if (!category) {
        return responser.res(res, 404, false, 'Course category not found')
      }

      return responser.res(
        res,
        200,
        false,
        'Course category deleted successfully'
      )
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}
const CourseCategoryController = new courseCategoryController()

export default CourseCategoryController
