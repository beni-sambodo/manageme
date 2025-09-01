import { Types, model, Schema } from 'mongoose'

const receptionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    school: { type: Types.ObjectId, ref: 'School', required: true },
    course: { type: Types.ObjectId, ref: 'Course' },
    group: { type: Types.ObjectId, ref: 'Group' },
    description: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ['NEW', 'INVIEW', 'CANCELLED', 'ACCEPTED'],
      default: 'NEW',
    },
    referal: String,
    comment: String,
    course: { type: Types.ObjectId, ref: 'Course' },
    admin: { type: Types.ObjectId, ref: 'User' },
    phone: String,
  },
  {
    timestamps: true,
  }
)

const Reception = model('Reception', receptionSchema)
export default Reception
