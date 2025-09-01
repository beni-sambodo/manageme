import { Schema, Types, model } from 'mongoose'

const studentSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  school: {
    type: Types.ObjectId,
    ref: 'School',
  },
  payment: [{ type: Types.ObjectId, ref: 'StudentPayment' }],
})

const Student = model('Student', studentSchema)

export default Student
