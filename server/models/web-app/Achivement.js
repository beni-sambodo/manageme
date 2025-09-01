import { model, Schema, Types } from 'mongoose'

const achivementSchema = new Schema(
  {
    images: [{ type: Types.ObjectId, ref: 'File' }],
    documents: [{ type: Types.ObjectId, ref: 'File' }],
    translations: {
      uz: {
        title: String,
        description: String,
      },
      en: {
        title: String,
        description: String,
      },
      ru: {
        title: String,
        description: String,
      },
    },
    isPublic: { type: Boolean, default: false },
    school: { type: Types.ObjectId, ref: 'School' },
  },
  { timestamps: true }
)
const Achivement = model('Achivement', achivementSchema)

export default Achivement
