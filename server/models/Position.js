import mongoose from 'mongoose'

const Schema = mongoose.Schema

const positionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'MANAGER',
      'ADMINISTRATOR',
      'TEACHER',
      'CEO',
      'ACCOUNTANT',
      'CLEANER',
      'SECURITY',
    ],
  },
  description: {
    type: String,
  },
  permissions: [String],

  school: {
    type: mongoose.Types.ObjectId,
    ref: 'School',
  },
})

const Position = mongoose.model('Position', positionSchema)

export default Position
