import { Schema, Types, model } from 'mongoose'

const transaction = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    school: { type: Types.ObjectId, ref: 'School' },
    sum: { type: Number, required: true },
    type: { type: Types.ObjectId, ref: 'TransactionType' },
    for: String,
    group: { type: Types.ObjectId, ref: 'Group' },
    auto: Boolean,
    admin: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const transactionType = new Schema({
  name: {  type: String, required: true },
  school: { type: Types.ObjectId, ref: 'School' },
})

const Transaction = model('Transaction', transaction)
const TransactionType = model('TransactionType', transactionType)
export { Transaction, TransactionType }
