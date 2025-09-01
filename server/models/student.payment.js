import { Schema, Types, model } from 'mongoose'

const studentPayment = new Schema({
  month: {
    type: Types.ObjectId,
    ref: 'Month',
  },
  mpv: {
    type: Number,
    default: 0,
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
    enum: ['unpaid', 'paid', 'incomplete', 'debtor'],
  },
  student: {
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
  },
})
const StudentPayment = model('StudentPayment', studentPayment)
export default StudentPayment
