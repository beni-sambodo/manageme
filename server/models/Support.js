import { Types, Schema, model } from 'mongoose'

const support = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
  file: [{
    type: Types.ObjectId,
    ref: 'File',
  }],
})
const Support = model('Support', support)
export default Support
