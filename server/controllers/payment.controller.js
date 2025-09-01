import Student from '../models/Student.js'
class paymentController {
  async reciveDaily(user, group, school, price) {
    const student = await Student.findOneAndUpdate({ user, group, school }, {})
  }
}

const PaymentController = new paymentController()

export default PaymentController
