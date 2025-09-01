import nodemailer from 'nodemailer'
import { EMAIL_AUTH } from './const.config.js'
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: EMAIL_AUTH,
})

export default transporter
