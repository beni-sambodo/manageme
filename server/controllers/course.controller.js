import { isValidObjectId } from 'mongoose'
import Course from '../models/Course.js'
import Responser from '../utils/response.js'

const responser = new Responser()

class couserController {
  async create(req, res) {
    try {
      const {
        name,
        category,
        type,
        teachers,
        price,
        duration,
        image,
        room,
        isPublic,
      } = req.body
      if (!name || !category || !type || !teachers || !price) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      let newCourseData = {
        name, category, type, teachers, price, duration, room, isPublic,
      }

      if (image) { newCourseData.image = image }

      const newCourse = new Course({
        school: req.user_role.school,
        ...newCourseData
      })

      await newCourse.save()
      return responser.res(res, 201, newCourse)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
  async getAll(req, res) {
    try {
      const {
        category,
        duration,
        type,
        name,
        priceMin,
        priceMax,
        page = 1,
        limit = 10,
      } = req.query
      const school = req.school
      const searchParams = { school }

      if (category && isValidObjectId(category))
        searchParams.category = category // Corrected category filter
      if (duration) searchParams.duration = duration
      if (type) searchParams.type = { $in: type } // Handle array of types using $in
      if (name) searchParams.name = { $regex: name, $options: 'i' } // Case-insensitive search

      // Handle price filter
      if (priceMin || priceMax) {
        searchParams.price = {}
        if (priceMin) searchParams.price.$gte = priceMin
        if (priceMax) searchParams.price.$lte = priceMax
      }

      const courses = await Course.find(searchParams)
        .populate({
          path: 'teachers',
          populate: { path: 'user', select: 'name username avatar' },
          select: 'user',
        })
        .populate({ path: 'category', select: '-school' })
        .populate({ path: 'image', select: 'location' })
        .limit(parseInt(limit))
        .skip((page - 1) * limit)

      const count = await Course.countDocuments(searchParams)

      return responser.res(res, 200, {
        datas: courses,
        pagination: {
          count,
          pages: Math.ceil(count / limit),
          page: Number(page),
          limit: Number(limit),
        },
      })
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return responser.res(res, 400, false, 'Missing course ID')
      }

      const course = await Course.findById(id).populate([
        { path: 'image', select: 'location' },
        {
          path: 'teachers',
          populate: { path: 'user', select: 'name surname username' },
          select: 'user',
        },
        {
          path: 'category',
        },
      ])

      if (!course) {
        return responser.res(res, 404, false, 'Course not found')
      }

      return responser.res(res, 200, course)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, category, type, teachers, price, duration, image, isPublic } =
        req.body
      if (!id || !name || !category || !type || !teachers || !price) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const course = await Course.findById(id)
      if (!course) {
        return responser.res(res, 404, false, 'Course not found')
      }

      if (course.school.toString() !== req.school) {
        return responser.res(res, 403, false, 'Access denied')
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
          name,
          category,
          type,
          teachers,
          price,
          duration,
          image,
          isPublic,
        },
        { new: true }
      )

      return responser.res(res, 200, updatedCourse)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async deleteOne(req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return responser.res(res, 400, false, 'Missing course ID')
      }

      const course = await Course.findByIdAndDelete(id)
      if (!course) {
        return responser.res(res, 404, false, 'Course not found')
      }

      return responser.res(res, 200, false, 'Course deleted successfully')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getSchoolCourses(schoolId) {
    try {
      const courses = await Course.find({ school: schoolId }).select('id')
      return courses
    } catch (error) {
      console.error(error)
    }
  }
}
const CourseController = new couserController()
export default CourseController
