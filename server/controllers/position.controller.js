import Position from '../models/Position.js'
import Responser from '../utils/response.js'

// Responser obyekti yaratilishi
const responser = new Responser()

class positionController {
  // Yangi pozitsiya yaratish
  async create(req, res) {
    try {
      const { name, type, description, permissions } = req.body

      // Qo'shimcha tekshirish
      if (!name || !type || !description || !permissions) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const school = req.school

      // Yangi pozitsiya yaratish
      const newPosition = new Position({
        name,
        type,
        description,
        permissions,
        school,
      })

      await newPosition.save()

      // Ushbu qism muvaffaqiyatli amalga oshirilganini xabar beradi
      return responser.res(res, 201, newPosition)
    } catch (error) {
      // Xatolarni tekshirish va uni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Barcha pozitsiyalarni olish
  async getPositions(req, res) {
    try {
      // Ma'lumotlar bazasidan barcha pozitsiyalarni olish
      const school = req.school
      const positions = await Position.find({ school })

      // Natijalarni qaytarish
      return responser.res(res, 200, positions)
    } catch (error) {
      // Xatolarni tekshirish va uni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Biror bir pozitsiyani olish
  async getById(req, res) {
    try {
      const id = req.params.id
      if (!id) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      // Ma'lumotlar bazasidan berilgan ID ga ega bo'lgan pozitsiyani olish
      const position = await Position.findById(id)

      // Pozitsiya topilmaganligi tekshiriladi
      if (!position) {
        return responser.res(res, 404, false, 'Position not found')
      }

      // Agar pozitsiya foydalanuvchi shu maktabga tegishli bo'lmasa xato qaytariladi
      if (position.school.toString() !== req.school) {
        return responser.res(res, 403, false, 'Access denied')
      }

      // Agar hamma tekshiruvlar muvaffaqiyatli o'tsa, pozitsiyani qaytarish
      return responser.res(res, 200, position)
    } catch (error) {
      // Xatolarni tekshirish va uni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Pozitsiyani yangilash
  async update(req, res) {
    try {
      const id = req.params.id

      const { name, type, description, permissions } = req.body

      if (!id || !name || !type || !description || !permissions) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      // Berilgan ID ga ega bo'lgan pozitsiyani topish
      let position = await Position.findById(id)

      // Pozitsiya topilmaganligi tekshiriladi
      if (!position) {
        return responser.res(res, 404, false, 'Position not found')
      }

      // Agar pozitsiya foydalanuvchi shu maktabga tegishli bo'lmasa xato qaytariladi
      if (position.school.toString() !== req.school) {
        return responser.res(res, 403, false, 'Access denied')
      }

      // Pozitsiya ma'lumotlarini yangilash
      position = await Position.findByIdAndUpdate(
        id,
        { name, type, description, permissions },
        { new: true }
      )

      // Yangilangan pozitsiyani qaytarish
      return responser.res(res, 200, position)
    } catch (error) {
      // Xatolarni tekshirish va uni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Pozitsiyani o'chirish
  async deleteOne(req, res) {
    try {
      const id = req.params.id
      if (!id) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      // Berilgan ID ga ega bo'lgan pozitsiyani topish
      const position = await Position.findById(id)

      // Pozitsiya topilmaganligi tekshiriladi
      if (!position) {
        return responser.res(res, 404, false, 'Position not found')
      }

      const userSchool = req.school

      // Agar pozitsiya foydalanuvchi shu maktabga tegishli bo'lmasa xato qaytariladi
      if (position.school.toString() !== userSchool) {
        return responser.res(res, 403, false, 'Access denied')
      }

      // Pozitsiyani o'chirish
      await Position.findByIdAndDelete(id)

      // O'chirilgan pozitsiya haqida xabar qaytarish
      return responser.res(res, 200, false, 'Position deleted successfully')
    } catch (error) {
      // Xatolarni tekshirish va uni qaytarish
      return responser.errorHandler(res, error)
    }
  }
}
const PositionController = new positionController()

export default PositionController
