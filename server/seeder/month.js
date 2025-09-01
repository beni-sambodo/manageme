import Month from '../models/Month.js'
import cron from 'node-cron'
import controller1 from '../controllers/groupPayment.controller.js'
import controller2 from '../controllers/student-payment.controller.js'

const seeder = async () => {
  cron.schedule('0 0 * * *', () => {
    month()
  })
}

const month = async () => {
  try {
    const date = new Date()

    const year = date.getFullYear()
    const previousMonth = date.getMonth()
    const month = date.getMonth() + 1

    const existData = await Month.findOne({ year, month })
    if (!existData) {
      const pD = await Month.findOneAndUpdate(
        { year, month: previousMonth },
        { isEnd: true }
      )

      await controller2.endMonth()
      await controller1.endMonth()

      const newMonth = new Month({ date, year, month })
      await newMonth.save()
    }
  } catch (error) {
    return false
  }
}

export default seeder
