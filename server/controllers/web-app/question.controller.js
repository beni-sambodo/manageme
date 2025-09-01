import Question from '../../models/web-app/Question.js'
import { createError } from '../../utils/error.js'
import School from '../../models/School.js'

export const create = async (req, res, next) => {
  try {
    const school = req.school
    const { translations, isPublic } = req.body

    const question = new Question({
      translations,
      isPublic,
      school,
    })

    await question.save()

    return res.status(201).json(question)
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

    const questions = await Question.find(filter).skip(skip).limit(limit).lean()

    const count = await Question.countDocuments(filter)

    return res.status(200).json({
      questions,
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

    const questions = await Question.find({ school }).lean()

    return res.status(200).json(questions)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const question = await Question.findById(id)

    if (!question.isPublic) {
      return next(createError(404, 'Not found'))
    }

    return res.status(200).json(question)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const school = req.school

    const question = await Question.findById(id)

    if (String(question.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    const { translations, isPublic } = req.body

    question.translations = translations
    question.isPublic = isPublic

    await question.save()

    return res.status(200).json(question)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const remove = async (req, res, next) => {
  try {
    const school = req.school
    const id = req.params.id
    const question = await Question.findById(id)

    if (String(question.school) !== school) {
      return next(createError(403, 'Access denied'))
    }

    await Question.findByIdAndDelete(id)

    return res.status(200).json({ result: 'Question deleted with id:' + id })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
