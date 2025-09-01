import Group from '../models/Group.js'
import Responser from '../utils/response.js'
import Attendance from '../models/Attendance.js'
import studentController from './student.controller.js'
import timeController from './time.controller.js'
import monthController from './month.controller.js'
import { startOfDay, endOfDay } from 'date-fns'
const responser = new Responser()

class attendanceController {
  async getAttendance(req, res) {
    try {
      const { id } = req.params
      const school = req.school

      const attendance = await Attendance.findById(id)
        .populate({ path: 'group', select: 'name' })
        .populate({ path: 'students', populate: { path: 'student' } })
        .populate({ path: 'school', select: 'subscription_type' })

      if (!attendance) {
        return responser.res(res, 404, false, 'Not found')
      }

      if (attendance.school._id.toString() != school) {
        return responser.res(res, 403, 'Access denied')
      }
      
      return responser.res(res, 200, attendance)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async create(req, res) {
    try {
      const { group, day } = req.body
      const school = req.school
      const thisGroup = await Group.findById(group)

      if (!thisGroup || school !== thisGroup.school.toString()) {
        return responser.res(
          res,
          thisGroup ? 403 : 404,
          false,
          thisGroup ? 'Access denied' : 'Not found'
        )
      }

      const searchDay = thisGroup.days.find((item) => item.id === day)
      if (!searchDay || searchDay.attendance) {
        return responser.res(
          res,
          searchDay ? 403 : 404,
          false,
          searchDay
            ? 'Attendance already exists'
            : 'Date not found in group days'
        )
      }

      // Time restrictions for non-admin users
      if (req.user.role !== 'ceo' || req.user.role !== 'admin' || !req.user.permissions.include("deal-with-ended-attendances")) {
        const currentDate = new Date();
        const attendanceDate = new Date(searchDay.date);

        // Check if attendance date is in the future
        if (attendanceDate > currentDate) {
          return responser.res(res, 403, false, 'Attendance not started yet');
        }

        // Check if attendance date is in the past (and not today)
        const isToday = attendanceDate.toDateString() === currentDate.toDateString();
        if (attendanceDate < currentDate && !isToday) {
          return responser.res(res, 403, false, 'Attendance already ended! You are not able to create attendance');
        }

        // Check if current time is within group's time window
        if (thisGroup.startTime && thisGroup.endTime) {
          const currentTime = currentDate.getHours();
          const groupEndTime = parseInt(thisGroup.endTime.split(':')[0]);
          const groupStartTime = parseInt(thisGroup.startTime.split(':')[0]);
          
          if (currentTime > groupEndTime || currentTime < groupStartTime) {
            return responser.res(res, 403, false, 'Attendance time is over');
          }
        }
      }

      const students = thisGroup.students.map((studentId) => ({
        student: studentId,
        status: 'NOT_SELECTED',
        commit: '',
      }))

      const newAttendance = new Attendance({
        date: new Date(searchDay.date),
        group,
        school,
        students,
      })

      const saved = await newAttendance.save()

      searchDay.attendance = newAttendance._id // Ensure the ID is assigned correctly

      await Group.findByIdAndUpdate(
        group,
        {
          days: thisGroup.days.map((item) =>
            item.id === day ? { ...item, attendance: newAttendance._id } : item
          ),
        },
        { new: true }
      )

      return responser.res(res, 200, saved)
    } catch (error) {
      console.log(error)
      return responser.errorHandler(res, error)
    }
  }

  async attent(req, res) {
    try {
      const { attendance, id, comment, status } = req.body;
      const school = req.school;
      
      const thisAttendance = await Attendance.findById(attendance).populate(
        'students group'
      );

      if (!thisAttendance || school !== thisAttendance.school.toString()) {
        return responser.res(
          res,
          thisAttendance ? 403 : 404,
          false,
          thisAttendance ? 'Access denied' : 'Not found'
        );
      }

      

      // Check if the user is not 'ceo' or 'admin' before applying time-based restrictions
      if (req.user.role !== 'ceo' || req.user.role !== 'admin' || !req.user.permissions.include("deal-with-ended-attendances")) {
        if (thisAttendance.end) {
          return responser.res(res, 200, false, 'Attendance already ended');
        }
        const currentDate = new Date();
        const attendanceDate = new Date(thisAttendance.date);

        // Check if attendance date is in the future
        if (attendanceDate > currentDate) {
          return responser.res(res, 200, false, 'Attendance not started yet');
        }

        // Check if attendance date is in the past (and not today)
        const isToday = attendanceDate.toDateString() === currentDate.toDateString();
        if (attendanceDate < currentDate && !isToday) {
          return responser.res(res, 200, false, 'Attendance already ended! You are not able to edit attendance');
        }

        const currentTime = currentDate.getHours();
        const groupEndTime = thisAttendance.group.endTime.split(':')[0];
        const groupStartTime = thisAttendance.group.startTime.split(':')[0];
          if (groupEndTime && groupStartTime) {
            if (currentTime > groupEndTime || currentTime < groupStartTime) {
            return responser.res(res, 200, false, 'Attendance time is over');
          }
        }
      }

      thisAttendance.students = thisAttendance.students.map((student) =>
        student._id.toString() === id
          ? { ...student, status, comment: comment || '', _id: student.id }
          : student
      );

      const updatedAttendance = await Attendance.findByIdAndUpdate(
        attendance,
        { students: thisAttendance.students },
        { new: true }
      );
      return responser.res(res, 200, updatedAttendance);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async end(req, res) {
    try {
      const school = req.school
      const { id } = req.params

      const attendance = await Attendance.findById(id).populate({
        path: 'school',
        select: 'subscription_type',
      })

      if (!attendance || attendance.school._id.toString() !== school) {
        return responser.res(
          res,
          attendance ? 403 : 404,
          false,
          attendance ? 'Access denied' : 'Not found'
        )
      }

      if (attendance.end) {
        return responser.res(res, 200, false, 'Already ended')
      }

      const group = await Group.findById(attendance.group).populate({
        path: 'course',
        select: 'price',
      })

      const admin = req.user.id.toString()

      // Extract current month and attendance month
      const currentMonth = new Date().getMonth() // Get current month (0-11)
      const attendanceMonth = new Date(attendance.date).getMonth() // Get month from attendance date (0-11)

      // Check if the current month matches attendance date's month
      if (currentMonth === attendanceMonth) {
        if (attendance.school.subscription_type === 'daily') {
          const dates = await timeController.getCurrentMonthDates(group.dates)
          const divisor = dates.length > 12 ? dates.length : 12
          const price = Math.ceil(group.course.price / divisor)
          const month = await monthController.getMonth()

          for (const student of attendance.students) {
            await studentController.receiveDaily(
              school,
              group.id,
              student.student,
              price,
              admin,
              month
            )
          }
        }
      }

      attendance.end = true
      await attendance.save()

      return responser.res(res, 200, attendance)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getCurrentDay(req, res) {
    try {
      const schoolId = req.school // Assuming the school is attached to the request

      // Get the current date and calculate start and end of the day
      const today = new Date()
      const start = startOfDay(today) // start of the current day
      const end = endOfDay(today) // end of the current day

      // Search parameters based on the school and the current date range
      const searchParams = {
        school: schoolId,
        dates: {
          $elemMatch: {
            $gte: start,
            $lte: end,
          },
        },
      }

      // Define population for referenced fields
      const population = [
        {
          path: 'teachers',
          populate: { path: 'avatar', select: 'location' },
          select: 'name username avatar',
        },
        {
          path: 'room',
        },
        {
          path: 'course',
        },
      ]

      const groupRecords = await Group.find(searchParams)
        .populate(population)
        .select(
          'name course teachers room status startTime endTime day_pattern'
        )
        .exec()

      // Return the found groups for today's sessions
      return res.status(200).json({ success: true, data: groupRecords })
    } catch (error) {
      console.error('Error fetching groups:', error)
      // Return a server error if something goes wrong
      return res.status(500).json({ success: false, message: error.message })
    }
  }
}

const AttendanceController = new attendanceController()

export default AttendanceController
