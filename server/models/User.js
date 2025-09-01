import { Types, model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  avatar: {
    type: Types.ObjectId,
    ref: 'File',
  },
  name: {
    type: String,
    trim: true,
  },
  surname: String,
  username: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 4,
  },

  phone: String,
  location: String,
  age: Number,

  email: {
    email: {
      type: String,
    },
    verifired: Boolean,
  },
  roles: [
    {
      type: Types.ObjectId,
      ref: 'UserRoles',
    },
  ],

  selected_role: {
    type: Types.ObjectId,
    ref: 'UserRoles',
  },
  student: [
    {
      type: Types.ObjectId,
      ref: 'Student',
    },
  ],
})

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
    const hashedPassword = await hashPasswordFunction(this.password)
    this.password = hashedPassword
    return next()
  } catch (error) {
    return next(error)
  }
})

const hashPasswordFunction = async function (password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const User = model('User', userSchema)

export default User
