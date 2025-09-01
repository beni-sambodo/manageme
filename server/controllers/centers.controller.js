import Course from '../models/Course.js'
import Responser from '../utils/response.js'
import Reception from '../models/Reception.js'
import mongoose from 'mongoose'
const responser = new Responser()

class centersController {
  async getCourses(req, res) {
    try {
      const {
        page = 1,
        pageSize = 10,
        school,
        category,
        type,
        price,
        duration,
      } = req.query

      // Convert pagination values to integers
      const pageInt = parseInt(page)
      const pageSizeInt = parseInt(pageSize)

      // Build the query dynamically
      const query = {}
      if (school) query.school = school
      if (category) query.category = category
      if (type) query.type = type
      if (price) query.price = { $lte: Number(price) }
      if (duration) query.duration = Number(duration)

      // Aggregation pipeline
      const courses = await Course.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'course-categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'schools',
            localField: 'school',
            foreignField: '_id',
            as: 'school',
          },
        },
        { $unwind: { path: '$school', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'files',
            localField: 'image',
            foreignField: '_id',
            as: 'image',
          },
        },
        { $unwind: { path: '$image', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'employers',
            localField: 'teachers',
            foreignField: '_id',
            as: 'teachers',
          },
        },
        { $unwind: { path: '$teachers', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'teachers.user',
            foreignField: '_id',
            as: 'teachers.user',
          },
        },
        {
          $unwind: { path: '$teachers.user', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'avatars',
            localField: 'teachers.user.avatar',
            foreignField: '_id',
            as: 'teachers.user.avatar',
          },
        },
        {
          $unwind: {
            path: '$teachers.user.avatar',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: 1,
            category: 1,
            school: { name: 1, description: 1 },
            image: 1,
            type: 1,
            price: 1,
            teachers: {
              _id: 1,
              user: {
                _id: 1,
                name: 1,
                surname: 1,
                avatar: { _id: 1, location: 1 },
              },
            },
            duration: 1,
          },
        },
        { $skip: (pageInt - 1) * pageSizeInt },
        { $limit: pageSizeInt },
      ])

      // Count the filtered documents
      const count = await Course.countDocuments(query)

      const response = {
        data: courses,
        pagination: {
          limit: pageSizeInt,
          count,
          page: pageInt,
          pages: Math.ceil(count / pageSizeInt),
        },
      }

      return responser.res(res, 200, response)
    } catch (error) {
      console.error('Error fetching courses:', error)
      return responser.errorHandler(res, error)
    }
  }

  async newReception(req, res) {
    try {
      const { course, group, phone, comment } = req.body

      const thisCourse = await Course.findById(course)

      const school = String(thisCourse.school)

      const user = req.user.id

      const data = new Reception({
        user,
        school,
        course,
        group,
        comment,
        referal: 'Centers.uz',
        phone,
      })

      await data.save()

      return responser.res(res, 201, data)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}
const CentersController = new centersController()
export default CentersController
