import { Schema, Types, model } from 'mongoose'

const newsSchema = new Schema(
  {
    images: [
      {
        type: Types.ObjectId,
        ref: 'File',
      },
    ],

    translations: {
      eng: {
        name: String,
        description: String,
      },
      ru: {
        name: String,
        description: String,
      },
      uz: {
        name: String,
        description: String,
      },
    },
    isPublic: { type: Boolean, default: false },
    views: Number,
    school: { type: Types.ObjectId, ref: 'School' },
  },
  {
    timestamps: true,
  }
)
const News = model('News', newsSchema)

export default News
