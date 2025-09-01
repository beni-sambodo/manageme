import mongoose, { Types } from 'mongoose'

const Schema = mongoose.Schema

const course = new Schema(
  {
    image: {
      type: Types.ObjectId,
      ref: 'File',
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'course-category',
      required: true,
    },
    school: {
      type: mongoose.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: 'Room',
    },
    type: [
      {
        type: String,
        enum: ['ONLINE', 'OFFLINE', 'VIDEO'],
        default: 'OFFLINE',
      },
    ],
    price: {
      type: Number,
    },
    students: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Students',
      },
    ],
    teachers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Employer',
      },
    ],

    duration: {
      type: Number,
      required: true,
    },
    groups: [{ type: Types.ObjectId, ref: 'Group' }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Course = mongoose.model('Course', course)

export default Course
