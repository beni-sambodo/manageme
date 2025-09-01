import monthController from './month.controller.js'
import StudentPayment from '../models/student.payment.js'
import Student from '../models/Student.js'
import Responser from '../utils/response.js'
import transactionController from './transaction.controller.js'
import groupPaymentController from './groupPayment.controller.js'
import Discount from '../models/Discount.js'
import MonthController from './month.controller.js'
import School from '../models/School.js'

const responser = new Responser()

class studentPaymentController {
  async create(mpv, mfp, student, month) {
    let status = 'unpaid';
    let debt = 0;

    if (mfp < mpv) {
      status = 'debtor';
      debt = mpv - mfp;
    } else if (mfp === 0) {
      status = 'unpaid';
      debt = mpv;
    } else {
      status = 'paid';
      debt = 0;
    }

    const data = await new StudentPayment({
      month,
      mpv,
      mfp,
      student,
      status,
      debt,
    })

    await data.save()

    return data.id
  }

  async end(id) {
    const data = await StudentPayment.findById(id)
    let extraMoney = 0

    if (!data) {
      console.error(`Payment data not found for id: ${id}`);
      return extraMoney;
    }

    const mfp = Number(data.mfp) || 0;
    const mpv = Number(data.mpv) || 0;

    if (mfp < mpv) {
      data.debt = mpv - mfp;
      data.status = 'debtor';
    } else {
      data.status = 'paid';
      data.debt = 0;
      extraMoney = mfp - mpv;
      data.mfp = mpv;
    }

    await data.save()

    return extraMoney
  }

  async endMonth() {
    const students = await Student.find()
      .sort({ school: 1 })
      .populate({
        path: 'group',
        populate: { path: 'course' },
        select: 'course dates',
      })
      .populate({
        path: 'school',
        select: 'subscription_type st_update',
      })

    const month = await monthController.getMonth()

    students.map(async (student) => {
      if (student.school.st_update.isUpdated === true) {
        const upd = student.school.st_update
        await School.findByIdAndUpdate(
          {
            subscription_type: upd.type,
            st_update: { isUpdated: false, before: upd.type },
          },
          { new: true }
        )
      }
      const paymentId = student.payment[student.payment.length - 1]
      const extraMoney = await this.end(paymentId)
      const mpv =
        student.school.subscription_type === 'monthly'
          ? Number(student.group.course.price.monthly)
          : 0
      const mfpForNewMonth = extraMoney > 0 ? extraMoney : 0;
      const payment = await this.create(mpv, mfpForNewMonth, student.id, month);
      await Student.findByIdAndUpdate(student.id, {
        $push: { payment },
      })

      return 'Done!'
    })
  }

  async getStudent(req, res) {
    try {
      const { group } = req.query
      const school = req.school

      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      const count = await Student.countDocuments({ school, group })

      const pages = Math.ceil(count / limit)

      // Retrieve students with pagination
      const students = await Student.find({ school, group })
        .populate({
          path: 'user',
          populate: { path: 'avatar', select: 'location' },
          select: 'name username avatar',
        })
        .populate({
          path: 'payment',
          populate: { path: 'month', select: 'date' },
          select: 'mpv mfp debt status',
        })
        .select('-v -school')
        .limit(limit)
        .skip((page - 1) * limit)

      const response = {
        students,
        pagination: {
          pages,
          page,
          limit,
          count,
        },
      }

      return responser.res(res, 200, response)
    } catch (error) {
      return responser.errorHandler()
    }
  }
  async getByMonth(req, res) {
    try {
      let { group, month } = req.query
      const school = req.school

      if (!month) {
        month = await MonthController.getMonth()
      }
      let students = await Student.find({ school, group })
        .populate({
          path: 'user',
          populate: { path: 'avatar', select: 'location' },
          select: 'name username avatar',
        })
        .populate({
          path: 'payment',
          populate: { path: 'month', select: 'date' },
          select: 'mpv mfp debt status',
        })
        .select('-v -school')
      students = students.filter((student) =>
        student.payment.some((payment) => payment.month.id.toString() === month)
      )
      const months = [
        ...new Set(
          students.flatMap((student) =>
            student.payment.map((payment) => payment.month)
          )
        ),
      ]

      const response = {
        months,
        datas: students,
        effectiveMonth: month,
      }

      return responser.res(res, 200, response)
    } catch (error) {
      console.log(error)
      return responser.errorHandler(res, error)
    }
  }

  async pay(req, res) {
    const { paymentId, amount, type } = req.body
    const school = req.school

    const thisPayment = await StudentPayment.findById(paymentId).populate({
      path: 'student',
    })

    if (!thisPayment || !thisPayment.student) {
      return responser.res(res, 404, false, 'Not found')
    }
    const thisSchoolId = thisPayment.student.school.toString()

    if (!thisPayment) {
      return responser.res(res, 404, false, 'Not found')
    }

    if (thisSchoolId !== school) {
      return responser.res(res, 403, false, 'Access denied')
    }

    thisPayment.mfp = thisPayment.mfp += Number(amount)

    if (thisPayment.mfp >= thisPayment.mpv) {
      thisPayment.status = 'paid'
      thisPayment.debt = 0
    } else {
      thisPayment.status = 'incomplete'
      thisPayment.debt = thisPayment.mpv - thisPayment.mfp
    }

    await thisPayment.save()

    const userId = thisPayment.student.user.toString()
    const groupId = thisPayment.student.group.toString()
    const adminId = req.user.id.toString()
    const newTransaction = await transactionController.createNew(
      userId,
      school,
      amount,
      req.body.for,
      groupId,
      adminId,
      type
    )

    await groupPaymentController.addMfp(
      thisSchoolId,
      groupId,
      thisPayment.month,
      amount
    )

    return responser.res(res, 201, {
      payment: thisPayment,
      transaction: newTransaction,
    })
  }

  async discount(req, res) {
    const { group, student, amount, reason } = req.body
    const school = req.school
    const month = await monthController.getMonth()

    const newDiscount = new Discount({
      month,
      school,
      group,
      student,
      amount,
      reason,
    })

    await groupPaymentController.discount(
      amount,
      group,
      school,
      month,
      newDiscount.id.toString()
    )

    const payment = await StudentPayment.findOne({ student, month })

    const mfp = payment.mfp + Number(amount)
    if (mfp >= payment.mpv) {
      payment.status = 'paid'
      payment.debt = 0
    } else if (mfp < payment.mpv) {
      payment.status = 'incomplete'
      payment.debt = payment.mpv - mfp
    }


    await StudentPayment.findByIdAndUpdate(
      payment.id,
      {
        mfp,
        status: payment.status,
      },
      { new: true }
    )

    return responser.res(res, 200, newDiscount)
  }

  async addMpv(student, month, amount) {
    const data = await StudentPayment.findOne({ student, month })

    const mpv = data.mpv + amount

    const status =
      data.mfp > 0 ? (data.mfp < mpv ? 'incompleted' : 'paid') : 'unpaid'

    return await StudentPayment.findByIdAndUpdate(
      data.id,
      { mpv, status },
      { new: true }
    )
  }
}

const StudentPaymentController = new studentPaymentController()
export default StudentPaymentController
