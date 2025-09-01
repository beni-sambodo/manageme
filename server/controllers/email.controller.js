import Responser from '../utils/response.js'
import transporter from '../config/email.config.js'
const responser = new Responser()
class emailController {
  async sendVerCode(email) {
    try {
      const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

      transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'User verification code',
        text: `Your verification code - ${code}`,
      })
      return code
    } catch (error) {
      console.log(error)
    }
  }
}

const EmailController = new emailController()

export default EmailController
