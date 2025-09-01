import mongoose from 'mongoose'

const Schema = mongoose.Schema

const room = new Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Types.ObjectId,
    ref: 'School',
  },
  description: {
    type: String,
  },
  number: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
})

const Room = mongoose.model('Room', room)
export default Room
