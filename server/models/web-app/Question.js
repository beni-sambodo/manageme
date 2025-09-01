import { model, Schema, Types } from 'mongoose'

const questionSchema = new Schema({
  translations: {
    uz: {
      question: String,
      answer: String,
    },
    en: {
      question: String,
      answer: String,
    },
    ru: {
      question: String,
      answer: String,
    },
  },
  isPublic: { type: Boolean, default: false },
  school: { type: Types.ObjectId, ref: 'School' },
})
const Question = model('Question', questionSchema)

export default Question
