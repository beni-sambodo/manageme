import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schoolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slogan: {
    type: String,
  },
  ceo: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documents: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'File',
    },
  ],
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'File',
    },
  ],
  type: {
    type: String,
    enum: ['FILIAL', 'MAIN'],
    default: 'MAIN',
  },
  status: {
    type: String,
    enum: ['NEW', 'WAITING', 'CANCELLED', 'VERIFIRED'],
    default: 'NEW',
  },
  country: {
    type: String,
  },
  region: {
    type: String,
  },
  contact: {
    type: String,
  },
  rate: Number,
  subscription_type: {
    type: String,
    enum: ['monthly', 'daily'],
    required: true,
  },
  st_update: {
    isUpdated: { type: Boolean, default: false }, // it will need for global checking and find school which are need to update subsciption type
    before: {
      type: String,
      enum: ['monthly', 'daily'],
    }, // if ceo wants update subscription type or return to back, server check it and isUpdated will be false
    date: { type: Date }, // for display last update in frontend
  },
  email: {
    type: String,
  },
  social_media: {
    telegram: String,
    instagram: String,
    youtube: String,
    facebook: String,
    x: String,
  },

  isPublic: {
    type: Boolean,
    default: true,
  },

  // courses
  // team
  // center

  // visit
})

const School = mongoose.model('School', schoolSchema)
export default School
