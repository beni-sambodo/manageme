import { secret } from '../config/const.config.js'
import Responser from '../utils/response.js'
import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import School from '../models/School.js'
import fileController from './files.controller.js'
import JwtController from './jwt.auth-token.controller.js'

let schools = null
let query = null

const responser = new Responser()

class adminController {
  async login(req, res) {
    try {
      const { username, password } = req.body

      let admin = await Admin.findOne({ username })

      if (!admin) {
        return responser.res(res, 404, false, 'Not found')
      }

      const passMatches = await bcrypt.compare(password, admin.password)

      if (!passMatches) {
        return responser.res(res, 403, false, 'Access denied')
      }

      const token = await JwtController.signAdmin(admin.id, '1d')

      admin = admin.toObject()
      delete admin.password
      return responser.res(res, 200, { admin, token })
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async newAdmin(req, res) {
    try {
      let { username, password } = req.body
      let admin = await Admin.findOne({ username })

      if (admin) {
        return responser.res(res, 404, false, 'Already exists')
      }
      password = await bcrypt.hash(password, 10)
      admin = new Admin({ username, password })
      await admin.save()
      admin = admin.toObject()
      delete admin.password

      return responser.res(res, 201, admin)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getSchools(req, res) {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const currentQuery = JSON.stringify(req.query)
    try {
      if (query !== currentQuery || !schools) {
        const skip = (page - 1) * limit

        const count = await School.countDocuments()

        const schoolsList = await School.find()
          .populate('documents')
          .populate({
            path: 'images',
            select: 'location',
          })
          .populate({
            path: 'ceo',
            select: '-password -roles -selected_role',
          })
          .limit(limit)
          .skip(skip)

        const pages = Math.ceil(count / limit)

        const response = {
          schoolsList,
          pagination: {
            currentPage: page,
            pageSize: limit,
            count,
            pages,
          },
        }
        schools = response
        query = currentQuery
        return responser.res(res, 200, response)
      }
      return responser.res(res, 200, schools)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async statusSchool(req, res) {
    try {
      const schoolId = req.params.id
      let { status } = req.query
      let school = await School.findById(schoolId)

      if (!school) {
        return responser.res(res, 404, false, 'Not found')
      }

      school = await School.findByIdAndUpdate(
        schoolId,
        {
          status,
        },
        { new: true }
      )

      return responser.res(res, 200, school)
    } catch (error) {
      return responser.errorHandler
    }
  }

  async deleteSchool(req, res) {
    try {
      const schoolId = req.params.id

      const school = await School.findById(schoolId)

      if (!school) {
        return responser.res(res, 404, false, 'Not found')
      }

      const files = school.images.concat(school.documents)
      await fileController.staticDeleteMany(files)

      return responser.res(res, 200, false, 'School deleted successfully')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  // async clearDatas(req, res) {
  //   try {
  //     const datas = null
  //   } catch (error) {
  //     return responser.errorHandler(res, error)
  //   }
  // }

  static sign(id, expiresIn = '8h') {
    try {
      const token = jwt.sign(
        {
          id,
        },
        secret,
        {
          expiresIn,
        }
      )
      return token
    } catch (error) {
      throw new Error('Failed to sign JWT')
    }
  }
}
const AdminController = new adminController()

export default AdminController
