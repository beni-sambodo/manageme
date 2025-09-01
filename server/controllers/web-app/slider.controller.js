import Slider from '../../models/web-app/Slider.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const create = async (req, res, next) => {
  try {
    const school = req.school
    const { image, translations, link, type, news, isPublic } = req.body

    if (type === 'news' && !news) {
      return next(createError(400, 'News ID is required for news type'))
    }

    const slider = new Slider({
      image,
      translations,
      link,
      type,
      news,
      isPublic,
      school,
    })

    await slider.save()

    return res.status(201).json(slider)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getAll = async (req, res, next) => {
  try {
    const school = req.params.school

    const schoolData = await School.findById(school).select('isPublic').lean()

    if (!schoolData.isPublic) {
      return next(createError(404, 'Not found'))
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { school, isPublic: true }

    const datas = await Slider.find(filter)
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'news', select: 'title' })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Slider.countDocuments(filter)

    return res.status(200).json({
      datas,
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

    const datas = await Slider.find({ school })
      .populate({ path: 'image', select: 'location' })
      .populate({ path: 'news' })
      .lean()

    return res.status(200).json(datas)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const slider = await Slider.findById(id)
      .populate({
        path: 'image',
        select: 'location',
      })
      .populate({
        path: 'news',
      })

    if (!slider.isPublic) {
      return next(createError(404, 'Not found'))
    }

    return res.status(200).json(slider)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const slider = await Slider.findById(id)

    if (String(slider.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { image, translations, link, type, news, isPublic } = req.body

    slider.image = image
    slider.translations = translations
    slider.link = link
    slider.type = type
    slider.news = news
    slider.isPublic = isPublic

    await slider.save()

    return res.status(200).json(slider)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const slider = await Slider.findById(id)

    if (String(slider.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await Slider.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Slider deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
