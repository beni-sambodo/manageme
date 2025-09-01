import { Schema, Types, model } from 'mongoose'

const notification = new Schema(
  {
    from: {
      type: Types.ObjectId,
      ref: 'Admin',
    },

    group: { type: Types.ObjectId, ref: 'Group' },
    user: { type: Types.ObjectId, ref: 'Group' },
    text: { type: String, required: true },
    problem: {
      type: Types.ObjectId,
      ref: 'Support',
    },
  },
  { timestamps: true }
)
const Notification = model('Notification', notification)
export default Notification
