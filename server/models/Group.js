import { Types, Schema, model } from 'mongoose'

const groups = new Schema({
  name: {
    type: String,
    required: true,
  },
  room: {
    type: Types.ObjectId,
    ref: 'Room',
  },
  course: {
    type: Types.ObjectId,
    ref: 'Course',
  },
  students: [
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ],
  teachers: [
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ],

  level: {
    type: String,
    required: true,
  },
  space: {
    type: Number,
    required: true,
  },
  days: [
    {
      date: { type: Date },
      attendance: {
        type: Types.ObjectId,
        ref: 'Attendance',
      },
    },
  ],
  dates: [{ type: Date }],
  status: {
    type: String,
    enum: ['NEW', 'WAITING', 'ACCEPTED', 'FINISHED', 'FROZEN'],
    default: 'NEW',
  },
  startTime: String,
  endTime: String,
  school: {
    type: Types.ObjectId,
    ref: 'School',
  },
  day_pattern: [
    {
      type: String,
    },
  ],
  duration: {
    type: Number,
  },
  lesson_duration: Number,

  payments: [{ type: Types.ObjectId, ref: 'GroupPayment' }],
})

groups.index({ name: 'text' })

const Group = model('Group', groups)

export default Group
