import School from '../models/School.js'
import userController from './auth.controller.js'
import Responser from '../utils/response.js'
import User from '../models/User.js'

const responser = new Responser()

class schoolController {
  async create(req, res) {
    try {
      const {
        name,
        description,
        slogan,
        documents,
        images,
        type,
        country,
        region,
        contact,
        rate,
        subscription_type,
        email,
      } = req.body

      if (!name || !description || !type || !country || !region || !contact) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const user = req.user

      const newSchool = new School({
        name,
        description,
        slogan,
        documents,
        images,
        type,
        country,
        region,
        contact,
        rate,
        ceo: user.id,
        subscription_type,
        st_update: {
          isUpdated: false,
          before: subscription_type,
          date: Date.now(),
        },
        email,
      })

      // Yangi school saqlash
      await newSchool.save()

      // User roles update
      const seoSuccess = await userController.seo(user.id, newSchool.id)

      // SEO yaratilganligi tekshiriladi
      if (!seoSuccess) {
        return responser.res(res, 500, false, 'Failed to update user roles')
      }

      // Muvaffaqiyatli javob qaytarish
      return responser.res(res, 201, newSchool)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // school update
  async updateSchool(req, res) {
    try {
      const id = req.params.id
      const {
        name,
        description,
        slogan,
        documents,
        images,
        type,
        country,
        region,
        contact,
        rate,
        subscription_type,
      } = req.body

      if (
        !id ||
        !name ||
        !description ||
        !slogan ||
        !documents ||
        !images ||
        !type ||
        !country ||
        !region ||
        !contact
      ) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      // Berilgan ID ga ega bo'lgan school topish
      const school = await School.findById(id).populate('ceo')

      // Maktab topilmaganligi tekshiriladi
      if (!school) {
        return responser.res(res, 404, false, 'School not found')
      }

      // Userning maktabga rahbarlik qilish huquqi tekshiriladi
      if (school.ceo.id !== req.user.id) {
        return responser.res(
          res,
          403,
          false,
          'Access denied: It is not your school'
        )
      }

      // Maktab holatini tekshirish va unga kiritilgan holatni update
      if (school.status === 'VERIFIRED') {
        await School.findByIdAndUpdate(id, { status: 'WAITING' })
      }

      if (subscription_type && subscription_type !== school.subscription_type) {
        school.st_update.isUpdated =
          subscription_type !== school.st_update.before
        school.st_update.type = subscription_type
        school.st_update.date = Date.now()
      }

      await school.save()

      // school update
      const updatedSchool = await School.findByIdAndUpdate(
        id,
        {
          name,
          description,
          slogan,
          documents,
          images,
          type,
          country,
          region,
          contact,
          rate,
        },
        { new: true }
      )

      // Yangilangan school qaytarish
      return responser.res(res, 200, updatedSchool)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // school o'chirish
  async deleteSchool(req, res) {
    try {
      const id = req.params.id
      if (!id) {
        return responser.res(res, 400, false, 'Missing required fields')
      }
      const school = await School.findById(id).populate('ceo')

      if (!school) {
        return responser.res(res, 404, false, 'School not found')
      }

      // Userning maktabga rahbarlik qilish huquqi tekshiriladi
      if (school.ceo.id !== req.user.id) {
        return responser.res(
          res,
          403,
          false,
          'Access denied: It is not your school'
        )
      }

      // school o'chirish
      await School.findByIdAndDelete(id)

      // O'chirilgan maktab haqida xabar qaytarish
      return responser.res(res, 200, false, 'Your school deleted')
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Joriy school olish
  async getCurrentSchool(req, res) {
    try {
      // Joriy User maktab ID sini olish
      const id = req.school

      // Ma'lumotlar bazasidan berilgan ID ga ega bo'lgan school olish
      const school = await School.findById(id).populate('images documents')

      // school qaytarish
      return responser.res(res, 200, school)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  async getStudents(req, res) {
    try {
      const school = req.school

      const users = await User.find({ 'student.school': school })
        .select('name surname username avatar')
        .populate({ path: 'avatar', select: 'position' })

      return responser.res(res, 200, users)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}

const SchoolController = new schoolController()

export default SchoolController
