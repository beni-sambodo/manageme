import Portfolio from '../../models/web-app/Portfolio.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const create = async (req, res, next) => {
  try {
    const school = req.school
    const { images, translations, price, show_price, isPublic } = req.body

    const portfolio = new Portfolio({
      images,
      translations,
      price,
      show_price,
      isPublic,
      school,
    })

    await portfolio.save()

    return res.status(201).json(portfolio)
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

    const portfolios = await Portfolio.find(filter)
      .populate({ path: 'images', select: 'location' })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Portfolio.countDocuments(filter)

    return res.status(200).json({
      portfolios,
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

    const portfolios = await Portfolio.find({ school })
      .populate({ path: 'images', select: 'location' })
      .lean()

    return res.status(200).json(portfolios)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const portfolio = await Portfolio.findById(id).populate({
      path: 'images',
      select: 'location',
    })

    if (!portfolio.isPublic) {
      return next(createError(404, 'Not found'))
    }

    return res.status(200).json(portfolio)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const portfolio = await Portfolio.findById(id)

    if (String(portfolio.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { images, translations, price, show_price, isPublic } = req.body

    portfolio.images = images
    portfolio.translations = translations
    portfolio.price = price
    portfolio.show_price = show_price
    portfolio.isPublic = isPublic

    await portfolio.save()

    return res.status(200).json(portfolio)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const portfolio = await Portfolio.findById(id)

    if (String(portfolio.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await Portfolio.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Portfolio deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
