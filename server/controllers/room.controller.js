import Room from '../models/Room.js'
import Responser from '../utils/response.js'

// Responser obyekti yaratilishi
const responser = new Responser()

class roomController {
  // Yangi xona yaratish
  async create(req, res) {
    try {
      const { name, description, number, location } = req.body

      // Qo'shimcha tekshirish
      if (!name || !number || !location) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const school = req.user.selected_role.school

      // Yangi xona obyektini yaratish
      const newRoom = new Room({
        name,
        school,
        description,
        number,
        location,
      })

      // Yangi xonani ma'lumotlar bazasiga saqlash
      await newRoom.save()

      // Ma'lumotlar saqlanganini xabar qilish
      return responser.res(res, 201, newRoom)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Barcha xonalarni olish
  async getAll(req, res) {
    try {
      // Foydalanuvchi maktab ma'lumotlarini tekshirish (kerakli emas)

      // User school ID sini olish
      const school = req.user_role.school

      // So'rov parametrlariga qarab filterni yaxshilash (kerakli emas)
      const filter = { school } // Asosiy maktab filteri
      const rooms = await Room.find(filter)

      // Natijalarni qaytarish
      return responser.res(res, 200, rooms)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Bir xonani olish
  async getOne(req, res) {
    try {
      const id = req.params.id

      if (!id) {
        return responser.res(res, 400, false, 'Missing required field: id')
      }

      // Ma'lumotlar bazasidan berilgan ID ga ega bo'lgan xonani olish
      const room = await Room.findById(id)

      // Xona topilmaganligi tekshiriladi
      if (!room) {
        return responser.res(res, 404, false, 'Room not found')
      }

      // Agar xona foydalanuvchi maktabiga tegishli bo'lmasa xato qaytariladi
      if (req.user.school.toString() !== room.school.toString()) {
        return responser.res(
          res,
          403,
          false,
          'Access denied: This room does not belong to your school'
        )
      }

      // Agar hamma tekshiruvlar muvaffaqiyatli o'tsa, xonani qaytarish
      return responser.res(res, 200, room)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Xonani yangilash
  async update(req, res) {
    try {
      const id = req.params.id

      const { name, description, number, location } = req.body

      if (!id || !name || !description || !number || !location) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      // Berilgan ID ga ega bo'lgan xonani topish
      let room = await Room.findById(id)

      // Xona topilmaganligi tekshiriladi
      if (!room) {
        return responser.res(res, 404, false, 'Room not found')
      }

      // Agar xona foydalanuvchi maktabiga tegishli bo'lmasa xato qaytariladi
      if (room.school.toString() !== req.school) {
        return responser.res(
          res,
          403,
          false,
          'Access denied: This room does not belong to your school'
        )
      }

      // Xonani yangilash
      room = await Room.findByIdAndUpdate(
        id,
        { name, description, number, location },
        { new: true }
      )

      // Yangilangan xonani qaytarish
      return responser.res(res, 200, room)
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Xonani o'chirish
  async deleteOne(req, res) {
    try {
      const id = req.params.id

      if (!id) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      // Berilgan ID ga ega bo'lgan xonani topish
      const room = await Room.findById(id)

      // Xona topilmaganligi tekshiriladi
      if (!room) {
        return responser.res(res, 404, false, 'Room not found')
      }

      // Agar xona foydalanuvchi maktabiga tegishli bo'lmasa xato qaytariladi
      if (room.school.toString() !== req.user_role.school.toString()) {
        return responser.res(
          res,
          403,
          false,
          'Access denied: This room does not belong to your school'
        )
      }

      // Xonani o'chirish
      await Room.findByIdAndDelete(id)

      // O'chirilgan xona haqida xabar qaytarish
      return responser.res(res, 200, false, 'Room deleted successfully')
    } catch (error) {
      // Xatolarni qaytarish
      return responser.errorHandler(res, error)
    }
  }
}

const RoomController = new roomController()

export default RoomController
