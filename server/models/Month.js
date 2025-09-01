import mongoose from 'mongoose'

const month = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
  },
  isEnd: {
    type: Boolean,
    default: false,
  },
})
const Month = mongoose.model('Month', month)
export default Month
