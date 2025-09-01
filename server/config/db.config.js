import mongoose from 'mongoose'
import { DB_URI } from './const.config.js'

const connect = async () => {
  try {
    await mongoose.connect(DB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log(error)
    console.error('Internet connection lost!')
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

export default connect
