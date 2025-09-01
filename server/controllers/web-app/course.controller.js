import Course from '../../models/Course.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const getDashboardData = async (req, res, next) => {
  try {
    const school = req.school

    // Aggregate data for the dashboard
    const totalCourses = await Course.countDocuments({ school })
    const courses = await Course.find({ school })
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'room', select: 'name' })
      .populate({
        path: 'teachers',
        populate: { path: 'user', select: 'username name surname' },
        select: 'user',
      })
      .populate({ path: 'groups', select: 'name' })
      .select('-students -__v')
      .skip(skip)
      .limit(limit)
      .lean()

    return res.status(200).json({
      totalCourses,
      courses,
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getAll = async (req, res, next) => {
  try {
    const school = req.params.school

    const schoolData = await School.findById(school).select('isPublic')

    if (!schoolData.isPublic) {
      return next(createError(404, 'School not found or not public'))
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { school, isPublic: true }

    const courses = await Course.find(filter)
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'room', select: 'name' })
      .populate({
        path: 'teachers',
        populate: { path: 'user', select: 'username name surname' },
        select: 'user',
      })
      .populate({ path: 'groups', select: 'name' })
      .select('-students -__v')
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Course.countDocuments(filter)

    return res.status(200).json({
      courses,
      pagination: {
        count,
        pages: Math.ceil(count / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const course = await Course.findById(id)
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'room', select: 'name' })
      .populate({
        path: 'teachers',
        populate: { path: 'user', select: 'username name surname' },
        select: 'user',
      })
      .populate({ path: 'groups', select: 'name' })
      .select('-students -__v')
      .lean()

    if (!course) {
      return next(createError(404, 'Course not found'))
    }

    return res.status(200).json(course)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
