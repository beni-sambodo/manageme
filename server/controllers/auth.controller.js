import JwtController from './jwt.auth-token.controller.js'

import Responser from '../utils/response.js'

import User from '../models/User.js'

import bcrypt from 'bcryptjs'

import userRoles from './role.controller.js'

import redisController from './redis.controller.js'

import emailControler from './email.controller.js'

import Attendance from '../models/Attendance.js'

import Student from '../models/Student.js'

const responser = new Responser()

class userController {
  // Yangi User ro'yxatga olish
  async register(req, res) {
    try {
      // Request Body
      const { name, username, password } = req.body

      // Agar body to'liq emas bo'lsa, xatolik qaytarilsin
      if (!name || !username || !password) {
        return responser.res(res, 400, false, {
          key: 'BAD_REQUEST',
          message: 'Missing required fields',
        })
      }

      // User borligini tekshirish
      const existUser = await User.findOne({ username })
      if (existUser) {
        return responser.res(res, 400, false, {
          key: 'EXIST',
          message: 'User allready exist',
        })
      }

      // Yangi User yaratish
      const newUser = new User({
        name,
        username,
        password,
      })
      await newUser.save()
      // JWT kontrolleridan token olish
      const token = await JwtController.signUser(newUser.id)

      // Responseni sozlash
      const data = newUser.toObject()

      delete data.password

      // Responseni qaytarish
      return responser.res(res, 201, { data, token })
    } catch (error) {
      // Error qaytarish
      responser.errorHandler(res, error)
    }
  }

  // User kirish
  async login(req, res) {
    try {
      // Request body
      const { username, password } = req.body

      // Agar body to'liq emas bo'lsa, xatolik qaytarilsin
      if (!username || !password) {
        if (existUser) {
          return responser.res(res, 400, false, {
            key: 'EXIST',
            message: 'User allready exist',
          })
        }
      }

      // Userni tekshirish
      const user = await User.findOne({ username })
        .populate({
          path: 'roles',
          populate: { path: 'school', select: 'name' },
          select: '-user -v',
        })
        .populate({
          path: 'selected_role',
          populate: { path: 'school', select: 'name' },
          select: '-user -v',
        })
        .populate({ path: 'avatar', select: 'location' })
        .select('-student -v')

      if (!user) {
        return responser.res(res, 404, false, 'User not found')
      }

      // Parol mos kelsa
      const passwordMatches = await bcrypt.compare(password, user.password)

      if (!passwordMatches) {
        return responser.res(res, 401, false, {
          key: 'INCORRECT_PASS',
          message: 'Incorrect password',
        })
      }

      // Token olish
      const token = await JwtController.signUser(user.id)
      // Responseni sozlash

      const data = user.toObject()
      delete data.password

      // Responseni qaytarish
      return responser.res(res, 200, { data, token })
    } catch (error) {
      // Error qaytarish
      return responser.errorHandler(res, error)
    }
  }

  // Rolni tanlash
  async selectRole(req, res) {
    const roleId = req.query.role

    if (!roleId) {
      return responser.res(res, 400, false, {
        key: 'BAD_REQUEST',
        message: 'Missing required fields',
      })
    }

    const user = await User.findById(req.user.id).select('-password')

    if (!user.roles.includes(roleId)) {
      return responser.res(res, 404, false, {
        key: 'BAD_ID',
        message: 'ID with Role not found',
      })
    }

    user.selected_role = roleId

    await user.save()

    return responser.res(res, 200, user)
  }

  // SEO
  async seo(id, school) {
    try {
      const newRole = await userRoles.newUserRole(id, school, 'CEO')

      await User.findByIdAndUpdate(id, {
        $push: { roles: newRole },
      })

      return true
    } catch (error) {
      console.error('Error updating user:', error)
      return false
    }
  }

  // Rolni yangilash
  async updateRole(userId, roles, role) {
    try {
      if (roles.includes(role)) {
        return true
      }
      roles.push(role)
      const user = await User.findByIdAndUpdate(
        userId,
        { roles },
        { new: true }
      )
      return user
    } catch (error) {
      return false
    }
  }

  // Userni olish
  async getUser(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('-password -v')
        .populate({
          path: 'roles',
          populate: {
            path: 'school',
            select: 'name description',
          },
          select: '-user -v',
        })
        .populate({
          path: 'selected_role',
          populate: {
            path: 'school',
            select: 'name description',
          },
          select: '-user -v',
        })
        .populate({ path: 'avatar', select: 'location' })
        .populate({
          path: 'student',
          populate: [
            { path: 'school', select: 'name' },
            { path: 'group', select: 'name' },
          ],
        })

      return responser.res(res, 200, user)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Userni username bo‘yicha olish
  async getUserByUsername(req, res) {
    try {
      const username = req.params.username

      if (!username) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const user = await User.findOne({ username })
        .select('-password -roles -selected_role -__v')

        .populate({ path: 'avatar', select: 'location -_id' })

      if (!user) {
        return responser.res(res, 404, 'User not found')
      }

      return responser.res(res, 200, user)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getFullData(req, res) {
    try {
      const school = req.school
      const { username } = req.params

      const user = await User.findOne({ username })
        .populate({
          path: 'avatar',
          select: 'location',
        })
        .select('-password -__v')

      const student = await Student.find({ user, school })
        .populate({
          path: 'group',
          select: 'name',
        })
        .populate({ path: 'payment' })

      if (!user) {
        return responser.res(res, 404, { message: 'User not found' })
      }

      delete user.password

      let [attendances, attendancesCount] = await Promise.all([
        Attendance.find({
          school,
          'students.student': user._id,
        }).select('students'),
        Attendance.countDocuments({
          school,
          'students.student': user._id,
        }),
      ])

      attendances = attendances.map((attendance) => {
        return attendance.students.filter((student) => {
          return String(student.student) === String(user._id)
        })
      })

      const response = {
        user,
        attendances: {
          count: attendancesCount,
          items: attendances,
        },
        student,
      }

      return responser.res(res, 200, response)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  // User ma'lumotlarini yangilash
  async update(req, res) {
    try {
      const userId = req.user.id

      const { name, phone, age, avatar, surname } = req.body

      const userAvatar = avatar
        ? avatar
        : req.user.avatar
          ? req.user.avatar
          : null

      const user = await User.findByIdAndUpdate(
        userId,
        {
          name: name ? name : req.user.name,
          phone: phone ? phone : req.user.phone,
          age: age ? age : req.user.age,
          avatar: userAvatar,
          surname: surname ? surname : req.user.surname,
        },
        { new: true }
      ).select('-password -v')

      return responser.res(res, 200, user)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body

      const userId = req.user.id

      const checkPassword = await bcrypt.compare(oldPassword, req.user.password)

      if (!checkPassword)
        return responser.res(res, 403, false, 'Incorrect password')

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await User.findByIdAndUpdate(userId, { password: hashedPassword })

      return responser.res(
        res,
        200,
        false,
        `Password updated to ${newPassword}`
      )
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async changeEmail(req, res) {
    try {
      const { email } = req.body

      if (!email)
        return responser.res(res, 400, false, 'Missing required email')

      const checkEmailExist = {
        email,
      }

      const user = await User.findOne({ email: checkEmailExist })

      if (user) {
        return responser.res(res, 403, false, 'User allready exist')
      }

      await User.findByIdAndUpdate(
        req.user.id,
        {
          email: { email, verifired: false },
        },
        { new: true }
      )

      return responser.res(
        res,
        200,
        false,
        `Email updated to ${email} successfuly`
      )
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async sendVerCode(req, res) {
    try {
      const { email } = req.body

      if (!email)
        return responser.res(res, 400, false, 'Missing required field: email')

      const checkEmail = {
        email,
        verifired: true,
      }

      const user = await User.findOne({ email: checkEmail })

      if (user) return responser.res(res, 403, false, 'User allready exist')

      await redisController.delete(email)

      const code = await emailControler.sendVerCode(email)

      const cache = await redisController.newCache(`email:${email}`, {
        email,
        code,
        verifired: false,
      })

      return responser.res(res, 200, false, 'Code sent successfully')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async verifyEmail(req, res) {
    try {
      const { email, code } = req.body

      const verify = await redisController.checkCode(email, code)
      if (!verify || verify === false) {
        return responser.res(res, 400, false, 'Incorrect code')
      }

      await redisController.delete(email)

      await User.findByIdAndUpdate(req.user.id, {
        email: { email, verifired: true },
      })

      return responser.res(res, 200, false, 'Email verifired successfully')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}

const UserController = new userController()
export default UserController
