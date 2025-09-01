import { Schema, Types, model } from 'mongoose'

const partnerSchema = new Schema({
  image: {
    type: Types.ObjectId,
    ref: 'File',
    required: true,
  },
  name: {
    required: true,
    type: String,
  },
  translations: {
    eng: {
      description: String,
      shortDescription: String,
    },
    ru: {
      description: String,
      shortDescription: String,
    },
    uz: {
      description: String,
      shortDescription: String,
    },
  },
  link: String,
  isPublic: { type: Boolean, default: false },
  school: { type: Types.ObjectId, ref: 'School' },
})
const Partner = model('Partner', partnerSchema)
export default Partner
