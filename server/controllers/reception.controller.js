import User from '../models/User.js';
import Group from '../models/Group.js';
import Responser from '../utils/response.js';
import Reception from '../models/Reception.js';
import userRole from './role.controller.js';
import studentController from './student.controller.js';
import timeController from './time.controller.js';
import groupPayment from './groupPayment.controller.js';
import monthController from './month.controller.js';
import mongoose from 'mongoose';
import userRoles from './role.controller.js';
const responser = new Responser();

class receptionController {

  async getStudents(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 1;
      const skip = (page - 1) * limit;

      const school = req.school;
      const status = req.query.status
        ? req.query.status.split(',')
        : ['NEW', 'INVIEW'];

      let query = {
        school,
        status: { $in: status },
      };

      if (req.query.group) {
        query.group = req.query.group;
      }

      let students = await Reception.find({ ...query })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'user',
          select: 'name username avatar phone',
          populate: { path: 'avatar', select: 'location' },
        })
        .populate({ path: 'group', select: 'name' })
        .populate({ path: 'course', select: 'name' })
        .sort({ createdAt: -1 });

      const count = await Reception.countDocuments(query);

      return res.status(200).json({
        students,
        pagination: { page, pages: Math.ceil(count / limit), limit, count },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  async getOne(req, res) {
    try {
      const id = req.params.id;
      const school = req.school;

      const population = [
        {
          path: 'user',
          select: 'name surname age username avatar phone location age ',
          populate: { path: 'avatar', select: 'location' },
        },
        {
          path: 'admin',
          select: 'name username avatar',
          populate: { path: 'avatar', select: 'location' },
        },
        {
          path: 'course',
          select: 'name image category type price teachers duration',
          populate: { path: 'image', select: 'location' },
          populate: { path: 'category' },
          populate: {
            path: 'teachers',
            select: 'user',
            populate: {
              path: 'user',
              select: 'name username avatar',
              populate: { path: 'avatar', select: 'location' },
            },
          },
        },
        {
          path: 'group',
          select:
            'name room level space status startTime endTime day_pattern lesson_duration',
          populate: { path: 'room' },
          populate: {
            path: 'teachers',
            select: 'name username avatar',
            populate: { path: 'avatar', select: 'location' },
          },
        },
      ];

      const data = await Reception.findById(id).populate(population);

      if (!data) {
        return responser.res(res, 404, false, 'Not found');
      }

      if (String(data.school) !== school) {
        return responser.res(res, 403, false, 'Access denied');
      }

      return responser.res(res, 200, data);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async createNew(req, res) {
    try {
      const {
        name,
        surname,
        phone,
        location,
        age,
        group,
        description,
        referal,
        comment,
        course,
        username,
      } = req.body;
      const nimadur = {
        results: {
          XhT9oWLX1DkT0YBMAAAH: {
            participantId: 'XhT9oWLX1DkT0YBMAAAH',
            sections: {
              'e7d11b96-8ace-4ae0-868a-6670b807bd50': {
                sectionId: 'e7d11b96-8ace-4ae0-868a-6670b807bd50',
                tasks: {
                  '7bb1ea84-20a3-4a8e-a05c-dd8ca434b16e': {
                    taskId: '7bb1ea84-20a3-4a8e-a05c-dd8ca434b16e',
                    answers: {
                      'bc6b0158-31a2-46b8-9281-416931c31a87': {
                        questionId: 'bc6b0158-31a2-46b8-9281-416931c31a87',
                        selectedAnswer: 'B. 22',
                        isCorrect: true,
                        timestamp: '2025-05-28T11:53:02.563Z',
                      },
                    },
                    correctAnswersCount: 1,
                    totalQuestions: 1,
                  },
                },
                correctAnswersCount: 1,
                totalQuestions: 1,
              },
            },
            correctAnswersCount: 1,
            totalQuestions: 1,
            startedAt: '2025-05-28T11:53:02.511Z',
          },
          '1ScOEPs8nWuNO-zmAAAJ': {
            participantId: '1ScOEPs8nWuNO-zmAAAJ',
            sections: {
              'e7d11b96-8ace-4ae0-868a-6670b807bd50': {
                sectionId: 'e7d11b96-8ace-4ae0-868a-6670b807bd50',
                tasks: {
                  '7bb1ea84-20a3-4a8e-a05c-dd8ca434b16e': {
                    taskId: '7bb1ea84-20a3-4a8e-a05c-dd8ca434b16e',
                    answers: {
                      'bc6b0158-31a2-46b8-9281-416931c31a87': {
                        questionId: 'bc6b0158-31a2-46b8-9281-416931c31a87',
                        selectedAnswer: 'B. 22',
                        isCorrect: true,
                        timestamp: '2025-05-28T11:54:32.616Z',
                      },
                    },
                    correctAnswersCount: 1,
                    totalQuestions: 1,
                  },
                },
                correctAnswersCount: 1,
                totalQuestions: 1,
              },
            },
            correctAnswersCount: 1,
            totalQuestions: 1,
            startedAt: '2025-05-28T11:54:32.615Z',
          },
        },
        lastUpdated: '2025-05-28T11:54:32.617Z',
      };
      const school = req.user_role.school;
      const admin = req.user.id;

      // Validate required fields
      if (!name || !surname) {
        return responser.res(res, 400, false, 'Missing required fields');
      }

      const isExistUser = await User.findOne({ username });

      if (isExistUser)
        return responser.res(res, 400, false, 'User exist with this username');

      // Create a new user
      const newUser = new User({
        name,
        surname,
        phone,
        location,
        age,
        username,
        password: username,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Create a new reception entry
      const newReception = new Reception({
        user: savedUser._id,
        school,
        group: group || null,
        description,
        referal,
        comment,
        admin,
        course,
      });

      // Save the reception data to the database
      const savedReception = await newReception.save();

      // Return a success response
      return responser.res(res, 201, {
        user: {
          _id: savedUser.id,
          name: savedUser.name,
          username: savedUser.username,
        },
        reception: savedReception,
      });
    } catch (error) {
      // Handle errors
      return responser.errorHandler(res, error);
    }
  }

  async create(req, res) {
    try {
      let { username, course, group, description, status, referal, comment } =
        req.body;
      if (!username || !course) {
        return responser.res(res, 400, false, 'Missing required fields');
      }

      const user = await User.findOne({ username });
      if (!user) {
        return responser.res(res, 404, false, { error: 'User not found' });
      }
      status = status || 'NEW';

      const adminId = req.user.id;
      const schoolId = req.school;

      const newData = new Reception({
        user: user.id,
        school: schoolId,
        course,
        group: group || null,
        description,
        status,
        referal,
        comment,
        admin: adminId,
      });

      await newData.save();

      return responser.res(res, 201, newData);
    } catch (error) {
      return responser.res(res, error);
    }
  }

  async addGroup(req, res) {
    try {
      const { receptions } = req.body;

      // Find the reception data by ID
      const receptionPromises = receptions.map(async (id) => {
        const data = await Reception.findById(id);

        // If reception data is not found, return 404
        if (!data) {
          throw { status: 404, message: 'Data not found' };
        }

        // Check if the user has access to this reception
        const schoolId = req.school;
        if (
          data.school.toString() !== schoolId
        ) {
          throw { status: 403, message: 'Access denied' };
        }

        // Add the student to the group
        if (!data.group || data.group === null) {
          data.group = req.body.group;
        }

        const group = await Group.findById(data.group)
          .populate({
            path: 'course',
            select: 'price dates',
          })
          .populate({
            path: 'school',
            // select: 'subscription_type',
          });

        if (!group) {
          throw { status: 404, message: 'Group not found' };
        }

        if (group.students.includes(data.user.toString())) {
          data.status = 'ACCEPTED';
          await data.save();

          return 'Status updated successfully';
        } else {
          await Group.findByIdAndUpdate(group.id, {
            $push: { students: data.user.toString() },
          });

          // Update the status of the reception data
          data.status = 'ACCEPTED';
          await data.save();

          let price = 0;

          const subscription_type = group.school.subscription_type;

          if (subscription_type === 'monthly') {
            const endDates = await timeController.endDates(group.dates);

            let lessonsCount = await timeController.getCurrentMonthDates(
              group.dates
            );

            if (endDates.length > 3) {
              let divisor = lessonsCount.length > 12 ? lessonsCount.length : 12;

              const rDates = await timeController.totalDates(group.dates);
              const ol_price = Math.ceil(group.course.price / divisor);

              price = rDates.length * ol_price;
            } else {
              price = Number(group.course.price);
            }
          }

          const month = await monthController.getMonth();

          await studentController.create(
            schoolId,
            data.group,
            data.user,
            price,
            month
          );

          await groupPayment.addStudentMpv(schoolId, data.group, price, month);

          return 'Student added to group';
        }
      });

      // Execute all reception promises
      await Promise.all(receptionPromises);

      return responser.res(res, 200, false, 'All students added to groups');
    } catch (error) {
      if (error.status && error.message) {
        return responser.res(res, error.status, false, error.message);
      }
      return responser.errorHandler(res, error);
    }
  }

  async deleteReception(req, res) {
    const { receptions } = req.body;

    try {
      const receptionPromises = receptions.map(async (id) => {
        try {
          const data = await Reception.findById(id);
          if (!data) {
            return null; // Handle case where reception with id doesn't exist
          }
          if (data.status === 'ACCEPTED') {
            const group = data.group.toString();
            const user = data.user.toString();
            const thisGroup = await Group.findById(group);

            const role = await userRole.deleteRole(
              user,
              'STUDENT',
              thisGroup.school.toString()
            );

            const pullQuery = {
              school: thisGroup.school,
              group: thisGroup._id,
            };

            if (!role) {
              await User.findByIdAndUpdate(user, {
                $pull: { student: pullQuery },
              });
            } else {
              await User.findByIdAndUpdate(user, {
                $pull: { student: pullQuery, roles: role },
              });
            }

            await Group.findByIdAndUpdate(group, {
              $pull: { students: user },
            });
          }

          await Reception.findByIdAndDelete(id);
          return data ? data.id : null;
        } catch (error) {
          console.error(`Error processing reception ${id}:`, error);
          throw error; // Rethrow the error to be caught by the outer try-catch
        }
      });

      await Promise.all(receptionPromises);

      return responser.res(
        res,
        200,
        false,
        'All receptions deleted successfully'
      );
    } catch (error) {
      console.error('Error deleting receptions:', error);
      return responser.errorHandler(res, error);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const school = req.school;
      const reception = await Reception.findById(id);

      if (!reception) {
        return responser.res(res, 404, false, 'Not found');
      }

      if (school !== String(reception.school)) {
        return responser.res(res, 403, false, 'Access denied');
      }

      const { group, description, course, status } = req.body;

      if (course) {
        reception.course = course;
      }

      if (group && String(reception.group) !== group) {
        reception.group = group;
        if (reception.status === 'ACCEPTED') reception.status = 'NEW';
      }

      reception.description = description;
      reception.status = status;
      await reception.save();

      return responser.res(res, 200, reception);
    } catch (error) {
      return responser.res(res, error);
    }
  }

  async updateMany(req, res) {
    try {
      const { id, group, status, course, description, comment } = req.body;

      // Ensure id is an array and contains valid ObjectId strings
      if (!id || !Array.isArray(id) || id.length === 0) {
        return responser.res(res, 400, 'Invalid or missing IDs');
      }

      // Validate each ID
      const validIds = id.filter((item) =>
        mongoose.Types.ObjectId.isValid(item)
      );

      if (validIds.length === 0) {
        return responser.res(res, 400, 'No valid IDs provided');
      }

      // Prepare the update body dynamically
      const updateFields = {};
      if (group) updateFields.group = group;
      if (status) updateFields.status = status;
      if (course) updateFields.course = course;
      if (description) updateFields.description = description;
      if (comment) updateFields.comment = comment;

      // Perform the update operation
      const updateResult = await Reception.updateMany(
        {
          _id: { $in: validIds },
        },
        { $set: updateFields }
      );

      // If no documents were modified
      if (updateResult.nModified === 0) {
        return responser.res(res, 404, 'No records updated');
      }

      return responser.res(res, 200, updateResult);
    } catch (error) {
      // If it's a CastError, handle it explicitly
      if (error instanceof mongoose.Error.CastError) {
        return responser.res(res, 400, `Invalid ObjectId: ${error.value}`);
      }

      return responser.errorHandler(res, error);
    }
  }

  async addGroups(req, res) {
    try {
      const { receptions, group: groupId } = req.body;

      const checkAccess = (data, schoolId, userId) => {
        if (!data) throw { status: 404, message: 'Data not found' };
        if (
          data.school.toString() !== schoolId ||
          data.admin.toString() !== userId
        )
          throw { status: 403, message: 'Access denied' };
      };

      const calculatePrice = async (group) => {
        const subscription_type = group.school.subscription_type;
        let price = 0;

        if (subscription_type === 'monthly') {
          const endDates = await timeController.endDates(group.dates);
          let lessonsCount = await timeController.getCurrentMonthDates(
            group.dates
          );

          if (endDates.length > 3) {
            const divisor = lessonsCount.length > 12 ? lessonsCount.length : 12;
            const rDates = await timeController.totalDates(group.dates);
            const ol_price = Math.ceil(group.course.price / divisor);
            price = rDates.length * ol_price;
          } else {
            price = Number(group.course.price);
          }
        }
        return price;
      };

      const receptionPromises = receptions.map(async (id) => {
        const data = await Reception.findById(id);
        const schoolId = req.school;
        checkAccess(data, schoolId, req.user.id.toString());

        if (!data.group) data.group = groupId;
        const group = await Group.findById(data.group)
          .populate({ path: 'course', select: 'price dates' })
          .populate({ path: 'school', select: 'subscription_type' });

        if (!group) throw { status: 404, message: 'Group not found' };

        if (group.students.includes(data.user.toString())) {
          data.status = 'ACCEPTED';
        } else {
          await Group.findByIdAndUpdate(group.id, {
            $push: { students: data.user.toString() },
          });
          data.status = 'ACCEPTED';

          const price = await calculatePrice(group);
          const month = await monthController.getMonth();
          await studentController.create(
            schoolId,
            group.id,
            data.user,
            price,
            month
          );
          await userRoles.newStudentRole(data.user, data.school, data.group);

          await groupPayment.addStudentMpv(schoolId, group.id, price, month);
        }
        await data.save();
        return 'Student added to group';
      });

      await Promise.all(receptionPromises);
      return responser.res(res, 200, false, 'All students added to groups');
    } catch (error) {
      if (error.status && error.message) {
        return responser.res(res, error.status, false, error.message);
      }
      return responser.errorHandler(res, error);
    }
  }
}

const ReceptionController = new receptionController();

export default ReceptionController;
