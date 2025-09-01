import { model, Schema, Types } from 'mongoose'

const attendance = new Schema(
  {
    date: { type: Date },
    group: {
      type: Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    school: {
      type: Types.ObjectId,
      ref: 'School',
      required: true,
    },
    students: [
      {
        student: {
          ref: 'User',
          type: Types.ObjectId,
        },
        status: {
          type: String,
          enum: ['ATTENDED', 'NOT_ATTENDED', 'KNOWN', 'NOT_SELECTED'],
        },
        comment: String,
      },
    ],
    end: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Attendance = model('Attendance', attendance)
export default Attendance
