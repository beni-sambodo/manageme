import Group from '../models/Group.js'
import Student from '../models/Student.js'
import Employer from '../models/Employer.js'
import Responser from '../utils/response.js'
import monthController from './month.controller.js'
import GroupPayment from '../models/groupPayment.js'
import Course from '../models/Course.js'
import StudentPayment from '../models/student.payment.js';
const responser = new Responser()
let statistics = null

class statisticsController {
  async get(req, res) {
    const { refresh } = req.query
    try {
      const school = req.user_role?.school?.toString()
      if (!school) {
        throw new Error('School not found in user role.')
      }

      if (refresh === 'true' || !statistics) {
        const groupPayments = await GroupPayment.find({ school })
        let money = groupPayments.reduce((acc, payment) => acc + payment.mfp, 0)
        const groups = await Group.countDocuments({ school })
        const employers = await Employer.countDocuments({ school, status: { $ne: 'CANCELLED' } })
        const students = await Student.countDocuments({ school })

        const debtorPayments = await StudentPayment.find({ school, status: 'debtor' });
        const totalDebt = debtorPayments.reduce((acc, payment) => acc + (payment.debt || 0), 0);
        const debtors = new Set(debtorPayments.map(p => p.student.toString())).size;

        statistics = {
          money,
          groups,
          employers,
          students,
          totalDebt,
          debtors,
        }
      }

      return responser.res(res, 200, statistics)
    } catch (error) {
      console.error(error)
      return responser.errorHandler(res, error)
    }
  }

  async paymentsMonth(req, res) {
    try {
      const month = await monthController.getMonth()
      const school = req.school
      const groupPayments = await GroupPayment.find({ school, month })
      let totalSum = 0
      groupPayments.every((payemnt) => (totalSum += Number(payemnt.mfp)))
      return responser.res(res, 200, { total_sum: totalSum })
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async getDailyRegistrations(req, res) {
    try {
      const school = req.user_role?.school?.toString();
      if (!school) {
        throw new Error('School not found in user role.');
      }

      const today = new Date();
      const dayOfWeek = today.getDay();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      const students = await Student.find({
        school,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }).select('createdAt');

      const dailyCounts = Array(7).fill(0).map((_, i) => {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        return { name: day.toLocaleDateString('uz-UZ', { weekday: 'long' }), students: 0 };
      });

      students.forEach(student => {
        const registrationDate = new Date(student.createdAt);
        const dayIndex = (registrationDate.getDay() === 0 ? 6 : registrationDate.getDay() - 1);
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyCounts[dayIndex].students++;
        }
      });

      return responser.res(res, 200, dailyCounts);
    } catch (error) {
      console.error("Error in getDailyRegistrations:", error);
      return responser.errorHandler(res, error);
    }
  }

  async getSubjectDistribution(req, res) {
    try {
      const school = req.user_role?.school?.toString();
      if (!school) {
        throw new Error('School not found in user role.');
      }
      const allCourses = await Course.find({ school }).select('name');
      const subjectCounts = allCourses.reduce((acc, course) => {
        acc[course.name] = 0;
        return acc;
      }, {});

      const students = await Student.find({ school }).populate({
        path: 'group',
        populate: {
          path: 'course',
          select: 'name'
        }
      });

      students.forEach(student => {
        if (student.group && student.group.course && student.group.course.name) {
          const subjectName = student.group.course.name;
          if (subjectCounts.hasOwnProperty(subjectName)) {
            subjectCounts[subjectName]++;
          }
        }
      });
      const result = Object.entries(subjectCounts).map(([name, value]) => ({ name, value }));
      return responser.res(res, 200, result);
    } catch (error) {
      console.error("Error in getSubjectDistribution:", error);
      return responser.errorHandler(res, error);
    }
  }

  async getCourseDebtors(req, res) {
    try {
      const school = req.user_role?.school?.toString();
      if (!school) {
        throw new Error('School not found in user role.');
      }

      // Get all courses
      const allCourses = await Course.find({ school }).select('name _id');

      // Initialize result structure
      const courseDebtors = {};
      allCourses.forEach(course => {
        courseDebtors[course._id.toString()] = {
          name: course.name,
          debtorCount: 0,
          totalDebt: 0
        };
      });

      // Find all debtor payments and populate student and group info
      const debtorPayments = await StudentPayment.find({
        school,
        status: 'debtor'
      }).populate({
        path: 'student',
        populate: {
          path: 'group',
          populate: {
            path: 'course',
            select: 'name _id'
          }
        }
      });

      // Process each payment to calculate course-specific debt information
      const processedStudents = new Map();

      debtorPayments.forEach(payment => {
        if (payment.student && payment.student.group && payment.student.group.course) {
          const courseId = payment.student.group.course._id.toString();
          const studentId = payment.student._id.toString();

          if (courseDebtors[courseId]) {
            // Add debt amount
            courseDebtors[courseId].totalDebt += (payment.debt || 0);

            // Count unique debtors per course
            if (!processedStudents.has(`${courseId}-${studentId}`)) {
              courseDebtors[courseId].debtorCount++;
              processedStudents.set(`${courseId}-${studentId}`, true);
            }
          }
        }
      });

      // Convert to array format for response
      const result = Object.values(courseDebtors);

      return responser.res(res, 200, result);
    } catch (error) {
      console.error("Error in getCourseDebtors:", error);
      return responser.errorHandler(res, error);
    }
  }
}

const StatisticsController = new statisticsController()

export default StatisticsController
