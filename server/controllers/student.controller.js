import Student from '../models/Student.js'
import userRoles from '../controllers/role.controller.js'
import User from '../models/User.js'
import groupPaymentController from './groupPayment.controller.js'
import studentPaymentController from './student-payment.controller.js'
const roleType = 'STUDENT'

class studentController {
  async create(school, group, user, price, month) {
    try {
      let role = await userRoles.checkExistRole(user, roleType, school)

      if (!role) {
        role = await userRoles.newUserRole(user, school, roleType)
      }

      const newStudent = new Student({ school, group, user })

      const payment = await studentPaymentController.create(
        price,
        0,
        newStudent.id.toString(),
        month
      )
      newStudent.payment.push(payment)
      await newStudent.save()

      const updateData = {
        $push: {
          student: newStudent._id.toString(),
        },
      }

      if (!role) {
        updateData.$push.roles = role
      }

      await User.findByIdAndUpdate(user.toString(), updateData)

      return payment
    } catch (error) {
      console.error('Error creating student:', error)
      return false
    }
  }

  async deleteStudent(school, group, user) {
    try {
      const student = await Student.findOne({ user, school, group })

      if (!student) {
        return false
      }

      const role = await userRoles.deleteRole(user, roleType, school)

      await User.findByIdAndUpdate(
        user,
        {
          $pull: {
            student: student._id.toString(),
            roles: role,
          },
        },
        { new: true }
      )

      await Student.findByIdAndDelete(student._id)

      return true
    } catch (error) {
      console.error('Error deleting student:', error)
      return false
    }
  }

  async receiveDaily(school, group, user, price, admin, month) {
    try {
      const student = await Student.findOne({ user, group, school })

      await groupPaymentController.addStudentMpv(school, group, price, month)
      const studentPayment = await studentPaymentController.addMpv(
        student.id.toString(),
        month,
        price
      )

      return studentPayment.id
    } catch (error) {
      console.error('Error receiving daily payment:', error)
      return false
    }
  }
}

const StudentController = new studentController()

export default StudentController
