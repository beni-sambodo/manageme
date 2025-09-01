import JwtController from '../controllers/jwt.auth-token.controller.js'
import Responser from '../utils/response.js'

const responser = new Responser()

const RoleMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization

      if (!token) {
        return responser.res(
          res,
          401,
          false,
          'Unauthorized: Missing or invalid token'
        )
      }

      const verify = await JwtController.verifyUser(token)

      const verifyAdmin = await JwtController.verifyAdmin(token)

      if (verifyAdmin) {
        req.admin = true

        next()
      }

      if (!verify) {
        return responser.res(res, 401, false, 'Invalid token')
      }

      const user = verify
      const userRole = user.selected_role
      let success = false

      if (!userRole) {
        return responser.res(
          res,
          403,
          false,
          'Access denied: User role is not selected'
        )
      }

      roles.forEach((role) => {
        if (userRole.role === role || userRole.role === 'CEO') {
          success = true
        }
      })

      req.user_role = userRole

      req.school = userRole.school.toString()

      req.user = user
      next()
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}

export default RoleMiddleware
