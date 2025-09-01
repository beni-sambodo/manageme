import Month from '../models/Month.js'
class monthController {
  async getMonth() {
    const date = new Date()

    const year = date.getFullYear()
    const month = date.getMonth() + 1

    let data = await Month.findOne({ year, month })
    if (!data) {
      data = new Month({ date, year, month })
      await data.save()
    }
    return data.id
  }
}
const MonthController = new monthController()

export default MonthController
