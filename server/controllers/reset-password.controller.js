import User from '../models/User.js'
import Responser from '../utils/response.js'
import emailControler from './email.controller.js'
import redisController from './redis.controller.js'
import bcrypt from 'bcryptjs'
const responser = new Responser()

class resetPassword {
  async sendCode(req, res) {
    try {
      const { email } = req.body

      if (!email)
        return responser.res(res, 400, false, 'Missing required field: email')

      const checkEmail = {
        email,
        verifired: true,
      }

      const user = await User.findOne({ email: checkEmail })

      if (!user) return responser.res(res, 404, false, 'User not found')

      await redisController.delete(email)

      const code = await emailControler.sendVerCode(email)

      await redisController.newCache(`email:${email}`, {
        email,
        code,
        verifired: false,
      })

      return responser.res(res, 200, false, 'Code sent successfully')
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async checkCode(req, res) {
    try {
      const { email, code } = req.body

      if (!{ email, code })
        return responser.res(res, 400, false, 'Missing required fields')

      const codeMatches = await redisController.checkCode(email, code)

      if (!codeMatches) {
        return responser.res(res, 403, false, 'Incorrect code')
      }

      return responser.res(res, 200, false, 'Email verifired successfully')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async newPassword(req, res) {
    try {
      const { email, newPassword } = req.body

      const checkEmail = {
        email,
        verifired: true,
      }

      const user = await User.findOne({ email: checkEmail })

      if (!user) return responser.res(res, 404, false, 'User not found')

      const checkVerify = await redisController.checkVerifyredData(email)

      if (!checkVerify) {
        return responser.res(res, 403, false, 'Code not verifired')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await User.findByIdAndUpdate(
        user.id,
        { password: hashedPassword },
        { new: true }
      )

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
}
const ResetPassword = new resetPassword()

export default ResetPassword
