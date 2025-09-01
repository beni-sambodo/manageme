export default class Responser {
  async res(res, status, data, message) {
    if (!data) {
      return res.status(status).json({ message })
    }
    if (!message) {
      return res.status(status).json(data)
    }
  }
  async errorHandler(res, error) {
    return res.status(500).json({ message: error.message, error })
  }
}
