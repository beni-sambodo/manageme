import Responser from '../utils/response.js'

const responser = new Responser()
const PermissionMiddleware = (task, model) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.selected_role)
        return responser.res(res, 401, false, 'You are not logged in')
      const permissions = req.user.selected_role.permissions

      if (req.user.selected_role.role === 'CEO' || req.admin === true) {
        next()
      } else {
        let success = false
        permissions.forEach((e) => {
          if (`${task}-${model}` === e || e === `*-${model}`) {
            success = true
          }
        })
        if (!success) {
          return responser.res(
            res,
            401,
            false,
            "You don't have permission for this route"
          )
        }
        req.user.permissions = permissions
        next()
      }
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}

export default PermissionMiddleware
