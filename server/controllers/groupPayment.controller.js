import GroupPayment from '../models/groupPayment.js'
import monthController from './month.controller.js'
import Group from '../models/Group.js'

class groupPaymentController {
  async create(school, group, mpv, mfp) {
    try {
      const month = await monthController.getMonth()
      const newData = new GroupPayment({ month, school, group, mpv, mfp })
      await newData.save()
      return newData.id
    } catch (error) {
      console.error('Error creating GroupPayment:', error)
      throw error
    }
  }

  async addStudentMpv(school, group, amount, month) {
    try {
      let data = await GroupPayment.findOne({ school, group, month })
      if (!data) {
        return await this.create(school, group, amount, 0)
      }
      const mpv = data.mpv + Number(amount)
      data = await GroupPayment.findByIdAndUpdate(
        data.id,
        { mpv },
        { new: true }
      )
      return data
    } catch (error) {
      console.error('Error adding student MPV:', error)
      throw error
    }
  }

  async addMfp(school, group, month, amount) {
    let data = await GroupPayment.findOne({ school, group, month })
    if (!data) {
      throw new Error('GroupPayment not found')
    }
    const mfp = data.mfp + Number(amount)

    let status = ''

    if (data.mfp >= data.mpv) {
      status = 'full_paid'
    } else {
      status = 'incomplete'
    }

    data = await GroupPayment.findByIdAndUpdate(
      data.id,
      { mfp, status },
      { new: true }
    )

    return data
  }

  async end(paymentId) {
    try {
      const data = await GroupPayment.findById(paymentId)
      if (!data) {
        throw new Error('GroupPayment not found')
      }
      let extraMoney = 0

      if (Number(data.mpv) > Number(data.mfp)) {
        const debt = Number(data.mpv) - Number(data.mfp)
        data.debt = debt
        data.status = 'debt'
      } else {
        data.status = 'full_paid'
        extraMoney = Number(data.mfp) - Number(data.mpv)

        data.mfp = Number(data.mpv)
      }

      await data.save()
      return extraMoney
    } catch (error) {
      console.error('Error ending payment:', error)
      throw error
    }
  }

  async endMonth() {
    try {
      let groups = await Group.find().populate('payments course school')

      groups = groups.filter((group) => group.status === 'ACCEPTED')

      for (const group of groups) {
        if (group.payments.length === 0) continue

        const paymentId = group.payments[group.payments.length - 1]
        const extraMoney = await this.end(paymentId)

        if (group.school.st_update === true) {
          const upd = group.school.st_update
          await School.findByIdAndUpdate(
            {
              subscription_type: upd.type,
              st_update: { isUpdated: false, before: upd.type },
            },
            { new: true }
          )
        }

        let mpv = 0

        if (group.school.subscription_type === 'monthly') {
          mpv = group.course.price * group.students.length
        } else {
          mpv = mpv
        }

        const payment = await this.create(
          group.school,
          group.id,
          mpv,
          extraMoney
        )
        await Group.findByIdAndUpdate(group.id, {
          $push: { payments: payment },
        })
      }

      return 'Done!'
    } catch (error) {
      console.error('Error ending month:', error)
      throw error
    }
  }

  async discount(amount, group, school, month, discount) {
    const payment = await GroupPayment.findOne({ school, group, month })

    const mfp = payment.mfp ? payment.mfp + amount : amount
    if(payment.mfp < mfp) {
      payment.status = 'incomplete'
    }else if(payment.mfp === mfp) {
      payment.status = 'full_paid'
    } else {
      payment.status = 'full_paid'
    }

    return await GroupPayment.findByIdAndUpdate(
      payment.id,
      {
        mfp,
        status: payment.status,
        $push: { discounts: discount },
      },
      { new: true }
    )
  }
}

const GroupPaymentController = new groupPaymentController()

export default GroupPaymentController
