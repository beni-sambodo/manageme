import mongoose from 'mongoose'

const Schema = mongoose.Schema

const fileSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
})
const File = mongoose.model('File', fileSchema)
export default File
