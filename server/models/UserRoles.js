import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userRoles = new Schema({
  school: {
    type: mongoose.Types.ObjectId,
    ref: 'School',
  },
  role: {
    type: String,
    enum: ['USER', 'MANAGER', 'ADMINISTRATOR', 'STUDENT', 'TEACHER', 'CEO','SECURITY', 'ACCOUNTANT','CLEANER'
    ],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  group: {
    type: mongoose.Types.ObjectId,
    ref: 'Group',
  },
  permissions: [
    {
      type: String,
    },
  ],
})

const UserRoles = mongoose.model('UserRoles', userRoles)
export default UserRoles
