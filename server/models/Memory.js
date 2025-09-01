import mongoose from 'mongoose'

const Schema = mongoose.Schema

const memorySchema = new Schema(
  {
    total_size: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
)

const Memory = mongoose.model('Memory', memorySchema)

export default Memory
