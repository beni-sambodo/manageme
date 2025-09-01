import { Types, Schema, model } from 'mongoose'

const sliderSchema = new Schema({
  image: {
    type: Types.ObjectId,
    ref: 'File',
  },
  translations: {
    ru: {
      title: String,
      description: String,
      additional_text: String,
      shortDescription: String,
    },
    uz: {
      title: String,
      description: String,
      additional_text: String,
      shortDescription: String,
    },
    eng: {
      title: String,
      description: String,
      additional_text: String,
      shortDescription: String,
    },
  },
  link: String,
  type: {
    type: String,
    enum: ['custom', 'news'],
    default: 'custom',
  },
  news: {
    type: Types.ObjectId,
    ref: 'News',
  },
  isPublic: { type: Boolean, default: false },
  school: { type: Types.ObjectId, ref: 'School' },
})
const Slider = model('Slider', sliderSchema)
export default Slider
