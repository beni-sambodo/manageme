import JwtController from '../controllers/jwt.auth-token.controller.js'

const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: Missing or invalid token',
        success: false,
      })
    }

    const verify = await JwtController.verifyUser(token)

    if (!verify) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid token',
        success: false,
      })
    }

    req.user = verify

    next()
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
}

export default AuthMiddleware
