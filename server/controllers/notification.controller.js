import Notification from '../models/Notification.js'
import Responser from '../utils/response.js'

const responser = new Responser()

class notificationController {
  async create(req, res) {
    try {
      const from = req.admin._id
      const { user, group, text, problem } = req.body

      const newNotification = new Notification({
        from,
        user,
        group,
        text,
        problem,
      })

      await newNotification.save()

      return responser.res(res, 201, newNotification)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async get(req, res) {
    try {
      const user = req.user._id

      const datas = await Notification.find({ user })
        .populate({
          path: 'from',
          select: 'username',
        })
        .populate({
          path: 'problem',
          select: 'text',
        })
        .select('-group')

      return responser.res(res, 200, datas)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id
      const { text } = req.body
      const data = await Notification.findByIdAndUpdate(
        id,
        { text },
        { new: true }
      )

      if (!data) {
        return responser.res(res, 404, false, 'Not found')
      }

      return responser.res(res, 200, data)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id
      const data = await Notification.findByIdAndDelete(id)
      if (!data) {
        return responser.res(res, 404, false, 'Not found')
      }

      return responser.res(res, 200, false, 'Notefication deleted')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}
const NotificationController = new notificationController()
export default NotificationController
