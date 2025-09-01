import { Schema, model } from 'mongoose'

const admin = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const Admin = model('Admin', admin)
export default Admin
