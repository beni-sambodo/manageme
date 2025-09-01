import JwtController from '../controllers/jwt.auth-token.controller.js'

const ReceptionAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: Missing or invalid token',
        success: false,
      })
    }

    const user = await JwtController.verifyUser(token)

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid token',
        success: false,
      })
    }

    req.user = user

    if (user.roles.includes('ADMIN')) {
      return next() // Return next() here
    }

    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  }
}

export default ReceptionAdminMiddleware
