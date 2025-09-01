import { Types, model, Schema } from 'mongoose'

const bannerSchema = new Schema({
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
  portfolio: { type: Types.ObjectId, ref: 'Portfolio' },
  news: { type: Types.ObjectId, ref: 'News' },
  link: { type: String },
  type: {
    type: String,
    enum: ['custom', 'news', 'portfolio'],
    default: 'custom',
  },
  isPublic: { type: Boolean, default: false },
  school: { type: Types.ObjectId, ref: 'School' },
})

const Banner = model('Banner', bannerSchema)
export default Banner
