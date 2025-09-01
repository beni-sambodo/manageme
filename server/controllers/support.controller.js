import Support from '../models/Support.js'
import Responser from '../utils/response.js'

const responser = new Responser()

class supportController {
  async create(req, res) {
    try {
      const { text, file } = req.body

      const userId = req.user._id

      const newSupport = new Support({ user: userId, text, file })
      await newSupport.save()
      return responser.res(res, 201, newSupport)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
  async get(req, res) {
    try {
      const datas = await Support.find()
        .populate({
          path: 'user',
          populate: { path: 'avatar', select: 'location' },
          select: 'username',
        })
        .populate({ path: 'file', select: 'location' })

      return responser.res(res, 200, datas)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}
const SupportController = new supportController()
export default SupportController
