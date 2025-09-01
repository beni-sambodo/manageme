import Visit from '../../models/web-app/Visit.js'
import School from '../../models/School.js'
import { createError } from '../../utils/error.js'
export const add = async (req, res, next) => {
  try {
    const s = req.params.school

    const ch = await School.findById(s).select('isPublic')

    if (!ch.isPublic) {
      return next(createError(404, 'Not found'))
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()

    let startDate = new Date(year, month, 1)
    let endDate = new Date(year, month + 1, 1)

    const dbMonth = await Visit.findOne({
      date: { $gte: startDate, $lt: endDate },
      school: s,
    })

    if (!dbMonth) {
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 1)
      await Visit.updateMany(
        {
          date: { $gte: startDate, $lt: startDate },
        },
        { $set: { visits: [] } }
      )

      const newMonth = new Visit({
        count: 1,
        date,
        visits: [date],
        school: ch._id,
      })
      await newMonth.save()
      return res.status(201).json(newMonth)
    } else {
      dbMonth.count += 1
      dbMonth.visits.push(date)
      await dbMonth.save()

      return res.status(200).json(dbMonth)
    }
  } catch (error) {
    return next(createError(500, error))
  }
}

export const get = async (req, res, next) => {
  try {
    const s = req.school
    const ch = await School.findById(s).select('isPublic')

    if (!ch.isPublic) {
      return next(createError(404, 'Not found'))
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()

    let startDate = new Date(year, month, 1)
    let endDate = new Date(year, month + 1, 1)

    const dbMonth = await Visit.findOne({
      date: { $gte: startDate, $lt: endDate },
      school: s,
    })

    if (!dbMonth) {
      const prevStartDate = new Date(year, month - 1, 1)
      const prevEndDate = new Date(year, month, 1)

      await Visit.updateMany(
        {
          date: { $gte: prevStartDate, $lt: prevEndDate },
          school: s,
        },
        { $set: { visits: [] } }
      )

      const newMonth = new Visit({
        count: 0,
        date,
        visits: [date],
        school: s, // Assuming `school` is the ID to save here
      })
      await newMonth.save()
      return res.status(201).json(newMonth)
    } else {
      return res.status(200).json(dbMonth)
    }
  } catch (error) {
    return next(createError(500, error.message || 'Internal Server Error'))
  }
}
