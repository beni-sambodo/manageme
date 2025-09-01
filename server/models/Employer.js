import { Types, Schema, model } from 'mongoose'

const employersSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    school: {
      type: Types.ObjectId,
      ref: 'School',
      required: true,
    },
    positions: [
      {
        salary: {
          type: Number,
        },
        salary_type: {
          type: String,
          enum: ['PERCENT', 'MONTHLY'],
          default: 'MONTHLY',
        },
        position: {
          type: Types.ObjectId,
          ref: 'Position',
        },
      },
    ],
    status: {
      type: String,
      enum: ['NEW', 'CANCELLED', 'ACCEPTED', 'VACATION'],
      default: 'NEW',
    },
    message: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
    role: {
      type: Types.ObjectId,
      ref: 'UserRole',
    },
  },
  {
    timestamps: true,
    new: true
  }
)

employersSchema.index({ cancelledAt: 1 }, { expireAfterSeconds: 172800 }) // 172800 seconds = 2 days

const Employer = model('Employer', employersSchema)
export default Employer
