import { Schema, Types, model } from 'mongoose'

const groupPayment = new Schema({
  school: {
    type: Types.ObjectId,
    ref: 'School',
    required: true,
  },
  group: {
    type: Types.ObjectId,
    ref: 'School',
    required: true,
  },
  month: {
    type: Types.ObjectId,
    ref: 'Month',
    required: true,
  },
  mpv: {
    type: Number,
    required: true,
  },
  mfp: {
    type: Number,
    required: true,
  },
  debt: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['unpaid', 'incomplete', 'debt', 'full_paid'],
    default: 'unpaid',
  },
  discounts: [{ type: Types.ObjectId, ref: 'Discount' }],
})
const GroupPayment = model('GroupPayment', groupPayment)
export default GroupPayment
