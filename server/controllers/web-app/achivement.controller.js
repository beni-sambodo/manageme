import Achivement from '../../models/web-app/Achivement.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const create = async (req, res, next) => {
  try {
    const school = req.school
    const { images, documents, translations, isPublic } = req.body

    const achivement = new Achivement({
      images,
      documents,
      translations,
      isPublic,
      school,
    })

    await achivement.save()

    return res.status(201).json(achivement)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getAll = async (req, res, next) => {
  try {
    const school = req.params.school

    const schoolData = await School.findById(school).select('isPublic')

    if (!schoolData.isPublic) {
      return next(createError(404, 'Not found'))
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { school, isPublic: true }

    const achivements = await Achivement.find(filter)
      .populate({ path: 'images', select: 'location' })
      .populate({ path: 'documents', select: 'location' })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Achivement.countDocuments(filter)

    return res.status(200).json({
      achivements,
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

export const get = async (req, res, next) => {
  try {
    const school = req.school

    const achivements = await Achivement.find({ school })
      .populate({ path: 'images', select: 'location' })
      .populate({ path: 'documents', select: 'location' })
      .lean()

    return res.status(200).json(achivements)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const achivement = await Achivement.findById(id)
      .populate({ path: 'images', select: 'location' })
      .populate({ path: 'documents', select: 'location' })

    if (!achivement.isPublic) {
      return next(createError(404, 'Not found'))
    }

    return res.status(200).json(achivement)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const achivement = await Achivement.findById(id)

    if (String(achivement.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { images, documents, translations, isPublic } = req.body

    achivement.images = images
    achivement.documents = documents
    achivement.translations = translations
    achivement.isPublic = isPublic

    await achivement.save()

    return res.status(200).json(achivement)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const achivement = await Achivement.findById(id)

    if (String(achivement.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await Achivement.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Achivement deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
