import Responser from '../utils/response.js'
import { Transaction, TransactionType } from '../models/transaction.js'
import User from '../models/User.js'

const responser = new Responser()

class transactionController {
  async getSchool(req, res) {
    try {
      const { school } = req
      const { group, username, page: pageQuery, limit: limitQuery } = req.query

      const page = Number(pageQuery) || 1
      const limit = Number(limitQuery) || 10
      const skip = (page - 1) * limit

      const query = { school }

      if (group) query.group = group

      if (username) {
        const user = await User.findOne({ username }).lean()

        if (!user) {
          return responser.res(
            res,
            404,
            'User not found with username: ' + username
          )
        }

        query.user = user._id
      }

      const transactions = await Transaction.find(query)
        .skip(skip)
        .limit(limit)
        .populate('type')
        .populate({
          path: 'user',
          populate: {
            path: 'avatar',
            select: 'location',
          },
          select: 'username avatar',
        })
        .populate({
          path: 'admin',
          populate: {
            path: 'avatar',
            select: 'location',
          },
          select: 'username avatar',
        })
        .populate({
          path: 'group',
          select: 'name status',
        })

      const count = await Transaction.countDocuments(query)

      const lastTransactions = transactions.reverse()

      return responser.res(res, 200, {
        datas: lastTransactions,
        pagination: { page, pages: Math.ceil(count / limit), limit, count },
      })
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getUser(req, res) {
    try {
      const user = req.user.id
      const transactions = await Transaction.find({ user })
        .populate('type')

        .populate({
          path: 'school',
          select: 'name description rate',
        })
        .populate({
          path: 'admin',
          select: 'username avatar',
        })
        .populate({ path: 'group', select: 'name status' })

      return responser.res(res, 200, transactions)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getAdmin(req, res) {
    try {
      const admin = req.user.id
      const transactions = await Transaction.find({ admin })
        .populate({
          path: 'user',
          select: 'username avatar',
        })
        .populate('type')

        .populate({
          path: 'school',
          select: 'name description rate',
        })
        .populate({ path: 'group', select: 'name status' })

      return responser.res(res, 200, transactions)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async createNew(user, school, sum, forWhy, group, admin, type) {
    try {
      const newTransaction = new Transaction({
        user,
        school,
        sum,
        for: forWhy,
        group,
        admin,
        auto: false,
        type,
      })

      await newTransaction.save()
      return newTransaction
    } catch (error) {
      console.error('Error receiving transaction:', error)
      throw error
    }
  }

  async getType(req, res) {
    try {
      const school = req.school
      const datas = await TransactionType.find({ school })

      return responser.res(res, 200, datas)
    } catch (error) {
      return responser.res(res, error)
    }
  }
  async typeCreate(req, res) {
    try {
      const { name } = req.body
      const school = req.school

      const data = new TransactionType({ name, school })

      await data.save()

      return responser.res(res, 201, data)
    } catch (error) {
      return responser.res(res, error)
    }
  }

  async updateType(req, res) {
    try {
      const id = req.params.id
      const { name } = req.body
      const school = req.school

      const data = await TransactionType.findById(id)

      if (!data || data.school.toString() !== school) {
        return responser.res(res, 403, false, 'Client error')
      }

      data.name = name

      await data.save()

      return responser.res(res, 200, data)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async deleteType(req, res) {
    try {
      const id = req.params.id
      const school = req.school

      const data = await TransactionType.findById(id)

      if (!data || data.school.toString() !== school) {
        return responser.res(res, 403, false, 'Client error')
      }

      await TransactionType.findByIdAndDelete(id)

      return responser.res(res, 200, false, 'Transaction deleted successfully')
    } catch (error) {
      return responser.res(res, error)
    }
  }
}
const TransactionController = new transactionController()

export default TransactionController
