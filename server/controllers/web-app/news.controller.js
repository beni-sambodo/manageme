import News from '../../models/web-app/News.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'
export const create = async (req, res, next) => {
  try {
    const school = req.school

    const { images, translations, isPublic } = req.body

    const data = new News({
      images,
      translations,
      views: 0,
      school,
      isPublic,
    })

    await data.save()

    return res.status(201).json(data)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getAll = async (req, res, next) => {
  try {
    const school = req.params.school

    const c = await School.findById(school).select('isPublic')

    if (!c.isPublic) {
      return next(createError(404, 'Not found'))
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { school, isPublic: true }

    const datas = await News.find(filter)
      .populate({ path: 'images', select: 'location' })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await News.countDocuments(filter)

    return res.status(200).json({
      datas,
      pagination: {
        count,
        pages: Math.ceil(count / limit),
        page: page,
        limit,
      },
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const get = async (req, res, next) => {
  try {
    const school = req.school

    const datas = await News.find({ school })
      .populate({ path: 'images', select: 'location' })
      .lean()

    return res.status(200).json(datas)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const d = await News.findById(id).populate({
      path: 'images',
      select: 'location',
    })

    if (!d.isPublic) {
      return next(createError(404, 'Not found'))
    }

    d.views++

    await d.save()

    return res.status(200).json(d)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const d = await News.findById(id)

    if (String(d.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { images, translations, isPublic } = req.body

    d.images = images
    d.translations = translations
    d.isPublic = isPublic

    await d.save()

    return res.status(200).json(d)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const d = await News.findById(id)

    if (String(d.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await News.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Data deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
