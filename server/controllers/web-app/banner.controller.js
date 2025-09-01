import Banner from '../../models/web-app/Banner.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const create = async (req, res, next) => {
  try {
    const school = req.school
    const { image, translations, portfolio, news, link, type, isPublic } =
      req.body

    const banner = new Banner({
      image,
      translations,
      portfolio,
      news,
      link,
      type,
      isPublic,
      school,
    })

    await banner.save()

    return res.status(201).json(banner)
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

    const banners = await Banner.find(filter)
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'portfolio', select: 'title' })
      .populate({ path: 'news', select: 'title' })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Banner.countDocuments(filter)

    return res.status(200).json({
      banners,
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

    const banners = await Banner.find({ school })
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'portfolio', select: 'title' })
      .populate({ path: 'news', select: 'title' })
      .lean()

    return res.status(200).json(banners)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const banner = await Banner.findById(id).populate({
      path: 'image',
      select: 'location',
    })

    if (!banner.isPublic) {
      return next(createError(404, 'Not found'))
    }

    return res.status(200).json(banner)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const banner = await Banner.findById(id)

    if (String(banner.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { image, translations, portfolio, news, link, type, isPublic } =
      req.body

    banner.image = image
    banner.translations = translations
    banner.portfolio = portfolio
    banner.news = news
    banner.link = link
    banner.type = type
    banner.isPublic = isPublic

    await banner.save()

    return res.status(200).json(banner)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const banner = await Banner.findById(id)

    if (String(banner.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await Banner.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Banner deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
