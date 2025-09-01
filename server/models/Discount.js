import { Schema, model, Types } from 'mongoose'

const discount = new Schema({
  month: {
    type: Types.ObjectId,
    ref: 'Month',
  },
  school: {
    type: Types.ObjectId,
    ref: 'School',
  },
  group: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  student: {
    type: Types.ObjectId,
    ref: 'Student',
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
})
const Discount = model('Discount', discount)
export default Discount
