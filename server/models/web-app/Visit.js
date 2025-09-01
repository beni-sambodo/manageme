import { model, Schema, Types } from 'mongoose'

const visit = new Schema({
  count: { type: Number },
  date: { type: Date },
  visits: [{ type: Date }],
  school: { type: Types.ObjectId, ref: 'School' },
})
const Visit = model('Visit', visit)
export default Visit
