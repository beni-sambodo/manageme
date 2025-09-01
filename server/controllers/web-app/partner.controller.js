import Partner from '../../models/web-app/Partner.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const create = async (req, res, next) => {
  try {
    const school = req.school
    const { image, name, translations, link, isPublic } = req.body

    const partner = new Partner({
      image,
      name,
      translations,
      link,
      isPublic,
      school,
    })

    await partner.save()

    return res.status(201).json(partner)
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

    const partners = await Partner.find(filter)
      .populate({ path: 'image', select: 'location' })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Partner.countDocuments(filter)

    return res.status(200).json({
      partners,
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

    const partners = await Partner.find({ school })
      .populate({ path: 'image', select: 'location' })
      .lean()

    return res.status(200).json(partners)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const partner = await Partner.findById(id).populate({
      path: 'image',
      select: 'location',
    })

    if (!partner.isPublic) {
      return next(createError(404, 'Not found'))
    }

    return res.status(200).json(partner)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const partner = await Partner.findById(id)

    if (String(partner.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { image, name, translations, link, isPublic } = req.body

    partner.image = image
    partner.name = name
    partner.translations = translations
    partner.link = link
    partner.isPublic = isPublic

    await partner.save()

    return res.status(200).json(partner)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const partner = await Partner.findById(id)

    if (String(partner.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await Partner.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Partner deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
