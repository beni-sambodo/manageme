import JWT from 'jsonwebtoken'
import User from '../models/User.js'
import { secret } from '../config/const.config.js'
import Admin from '../models/Admin.js'

class jwtController {
  // register user
  async signUser(id, expiresIn = '8h') {
    try {
      const token = await JWT.sign(
        {
          userId: id,
        },
        secret,
        {
          expiresIn,
        }
      )
      return await token
    } catch (error) {
      throw new Error('Failed to sign JWT')
    }
  }
  // register user
  async signAdmin(id, expiresIn = '8h') {
    try {
      const token = await JWT.sign(
        {
          id,
        },
        secret,
        {
          expiresIn,
        }
      )
      return await token
    } catch (error) {
      throw new Error('Failed to sign JWT')
    }
  }

  // check user
  async verifyUser(token) {
    try {
      const verify = await JWT.verify(token, secret)

      const user = await User.findById(verify.userId).populate(
        'roles selected_role'
      )
      return user
    } catch (error) {
      return false
    }
  }
  async verifyAdmin(token) {
    try {
      const verify = await JWT.verify(token, secret)

      const admin = await Admin.findById(verify.id)
      return admin
    } catch (error) {
      return false
    }
  }
}

const JwtController = new jwtController()

export default JwtController
