import studentController from "./student.controller.js";
import Attendance from "../models/Attendance.js";
import Responser from "../utils/response.js";
import Group from "../models/Group.js";
import Student from "../models/Student.js";
import groupPaymentController from "./groupPayment.controller.js";
import Course from "../models/Course.js";
const responser = new Responser();

class groupController {
  async getMonthlyAttendance(req, res) {
    try {
      const groupId = req.params.id;
      const school = req.school;
      const { month } = req.query;

      // Find the group and verify school access
      const group = await Group.findById(groupId);
      if (!group) {
        return responser.res(res, 404, false, "Group not found");
      }

      if (group.school.toString() !== school) {
        return responser.res(res, 403, false, "Access denied");
      }

      // Prepare date filter for the specified month or use current month
      let dateFilter = { group: groupId };
      let selectedDate = new Date();

      if (month) {
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1); // Month is 0-indexed in JS Date
        const endDate = new Date(year, monthNum, 0); // Last day of month

        dateFilter.date = {
          $gte: startDate,
          $lte: endDate
        };

        selectedDate = startDate;
      }

      // Get attendance records for this group with date filter
      const attendanceRecords = await Attendance.find(dateFilter)
        .populate({
          path: 'students.student',
          select: 'name username avatar',
          populate: { path: 'avatar', select: 'location' }
        })
        .sort({ date: 1 });

      // Process attendance data for monthly view
      const students = group.students.map(studentId => {
        const studentAttendance = [];

        // Collect attendance data for this student across all records
        attendanceRecords.forEach(record => {
          const studentRecord = record.students.find(
            s => s.student._id.toString() === studentId.toString()
          );

          if (studentRecord) {
            studentAttendance.push({
              date: record.date,
              status: studentRecord.status,
              comment: studentRecord.comment
            });
          }
        });

        return {
          student: attendanceRecords.find(record =>
            record.students.some(s => s.student._id.toString() === studentId.toString())
          )?.students.find(s => s.student._id.toString() === studentId.toString())?.student,
          _id: studentId,
          monthlyAttendance: studentAttendance
        };
      }).filter(item => item.student); // Filter out any undefined students

      // Get month info based on selected date
      const monthInfo = {
        date: selectedDate,
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1
      };

      return responser.res(res, 200, {
        students,
        month: monthInfo,
        groupName: group.name
      });
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async create(req, res) {
    try {
      const {
        name,
        room,
        teachers,
        level,
        space,
        course,
        startTime,
        endTime,
        days,
        day_pattern,
        duration,
        lesson_duration,
      } = req.body;

      if (!name || !room || !teachers || !level || !space || !course) {
        return responser.res(res, 400, false, "Missing required fields");
      }

      const thisDays = days.map((date) => ({ date, attendance: null }));
      const thisCourse = await Course.findById(course).populate("teachers");

      // Ensure all teacher IDs are strings and remove duplicates
      const bTeachers = [
        ...new Set([
          ...thisCourse.teachers.map((t) => String(t.user)),
          ...teachers.map(String),
        ]),
      ];

      const school = req.school;

      const newGroup = new Group({
        name,
        room,
        teachers: bTeachers,
        level,
        space,
        course,
        school,
        startTime,
        endTime,
        day_pattern,
        days: thisDays,
        dates: days,
        duration,
        lesson_duration,
      });

      const payment = await groupPaymentController.create(
        school,
        newGroup.id.toString(),
        0,
        0
      );
      newGroup.payments.push(payment);

      thisCourse.groups.push(newGroup.id);
      await Promise.all([newGroup.save(), thisCourse.save()]);

      return responser.res(res, 201, newGroup);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async get(req, res) {
    try {
      const school = req.school;

      let query = {
        school,
      };

      if (req.query.school) {
        query.school = req.query.school;
      }

      const status = req.query.status;

      if (status) {
        query.status = status;
      }

      const id = req.query.id;

      if (id) {
        const group = await Group.findById(id)
          .populate("room course")
          .populate({
            path: "students",
            select: "username name avatar",
            populate: { path: "avatar", select: "location" },
          })
          .populate({
            path: "teachers",
            select: "username name",
          })
          .populate({
            path: "days",
            populate: "attendance",
          })
          .select(" -v");

        return responser.res(res, 200, group);
      }

      const groups = await Group.find(query)
        .populate("room course")
        .populate({
          path: "students",
          select: "-password",
        })
        .populate({
          path: "teachers",
          select: "username name",
        })
        .select(" -v");

      return responser.res(res, 200, groups.reverse());
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async getOne(req, res) {
    try {
      const id = req.params.id;
      const school = req.school;

      const group = await Group.findById(id)
        .populate("room course")
        .populate({
          path: "students",
          select: "username name avatar",
          populate: { path: "avatar", select: "location" },
        })
        .populate({
          path: "teachers",
          select: "username name",
        })
        .populate({
          path: "days",
          populate: "attendance",
        })
        .select(" -v");

      if (String(group.school) !== school)
        return responser.res(res, 400, null, "Bad request: Access denied");

      return responser.res(res, 200, group);
    } catch (error) {
      console.log(error);
      return responser.errorHandler(res, error);
    }
  }

  async getAll(req, res) {
    try {
      const school = req.school;
      const groups = await Group.find({ school: school })
        .populate({ path: "room", select: "name" })
        .populate({
          path: "course",
          select: "-students -school -type -teachers",
        })
        .populate({
          path: "students",
          populate: { path: "user", select: "username name" },
        })
        .populate({
          path: "teachers",
          populate: { path: "user", select: "username name" },
        })
        .select("-days -v -dates -payments");

      return responser.res(res, 200, groups);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async search(req, res) {
    const perPage = parseInt(req.query.perPage) || 12;
    const page = parseInt(req.query.page) || 1;

    try {
      let query = { school: req.school };

      if (req.query.name) {
        query.name = { $regex: req.query.name, $options: "i" };
      }
      if (req.query.status) {
        query.status = req.query.status.toUpperCase();
      }
      if (req.query.level) {
        query.level = req.query.level;
      }

      const groups = await Group.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate("course")
        .populate("teachers")
        .select("-__v");

      const count = await Group.countDocuments(query);

      return res.json({
        data: groups,
        page,
        pages: Math.ceil(count / perPage),
        count,
      });
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async teacherGroups(req, res) {
    try {
      const uI = req.user.id;
      const groups = await Group.find({ teachers: uI }).populate(
        "room students teachers"
      );
      return responser.res(res, 200, groups);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async studentGroups(req, res) {
    try {
      const uI = req.user.id;
      const groups = await Student.find({ user: uI })
        .populate("group")
        .populate({ path: "school", path: "name description slogan" });

      return responser.res(res, 200, groups);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const {
        name,
        room,
        level,
        space,
        course,
        startTime,
        endTime,
        day_pattern,
        duration,
        lesson_duration,
        teachers,
      } = req.body;

      if (!id || !name || !room || !level || !space || !course) {
        return responser.res(res, 400, false, "Missing required field");
      }

      let group = await Group.findById(id);

      if (!group) {
        return responser.res(res, 404, false, "Group not found");
      }
      const school = req.school;
      if (group.school.toString() !== school) {
        return responser.res(res, 403, false, "It's not your group");
      }

      group = await Group.findByIdAndUpdate(
        id,
        {
          school,
          name,
          room,
          level,
          space,
          course,
          day_pattern,
          startTime,
          endTime,
          duration,
          lesson_duration,
          teachers,
        },
        { new: true }
      );

      return responser.res(res, 200, group);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async status(req, res) {
    try {
      const id = req.params.id;
      const status = req.query.status.toUpperCase();

      let group = await Group.findById(id);

      if (!group) {
        return responser.res(res, 404, false, "Group not found");
      }

      const school = req.school;

      if (group.school.toString() !== school) {
        return responser.res(res, 403, false, "It's not your group");
      }

      group.status = status;

      await group.save();

      return responser.res(res, 200, group);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async setDays(req, res) {
    try {
      const id = req.params.id;
      let { days } = req.body;

      if (!id || !days || !Array.isArray(days)) {
        // Check if days is an array
        return responser.res(
          res,
          400,
          false,
          "Missing or invalid required fields"
        );
      }

      const group = await Group.findById(id);

      if (!group) {
        return responser.res(res, 404, false, "Group not found");
      }

      const school = req.school;

      if (group.school.toString() !== school.toString()) {
        return responser.res(
          res,
          403,
          false,
          "This group is not associated with your school"
        );
      }

      const updDate = [];

      for (const day of days) {
        // Loop through days array
        const newAttendance = new Attendance({
          group: group._id, // Use group id
          school: school.toString(),
          date: day, // Assign date directly
        });

        await newAttendance.save(); // Await save operation

        updDate.push({
          date: day,
          attendance: newAttendance._id, // Corrected typo from attandance to attendance
        });
      }

      const updGroup = await Group.findByIdAndUpdate(
        id,
        {
          days: updDate,
        },
        { new: true }
      );

      return responser.res(res, 200, updGroup);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return responser.res(res, 400, false, "Missing required field");
      }

      const group = await Group.findById(id);

      if (!group) {
        return responser.res(res, 404, false, "Group not found");
      }

      const userSchool = req.user_role.school; // Assuming req.user_role.school is already an ObjectId

      // Assuming both group.school and userSchool are ObjectIds, directly compare them
      if (!userSchool.equals(group.school)) {
        return responser.res(res, 403, false, "Access denied");
      }

      await Group.findByIdAndDelete(id);

      return responser.res(res, 200, false, "Group deleted successfully");
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async deleteFromGroup(req, res) {
    try {
      const school = req.school;
      const { student, group } = req.body;
      const thisGroup = await Group.findById(group);

      if (!thisGroup) {
        return responser.res(res, 404, false, "Group not found");
      }

      if (thisGroup.school.toString() !== school) {
        return responser.res(res, 403, "Access denied");
      }

      if (!thisGroup.students.includes(student)) {
        return responser.res(res, 404, false, "Student not found");
      }

      await studentController.deleteStudent(school, group, student);

      const updatedGroup = await Group.findByIdAndUpdate(
        group,
        {
          $pull: { students: student },
        },
        { new: true }
      );

      return responser.res(res, 200, updatedGroup);
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }

  async search(req, res) {
    const perPage = parseInt(req.query.perPage) || 12;
    const page = parseInt(req.query.page) || 1;

    try {
      let query = { ...req.query };

      delete query.perPage;
      delete query.page;

      query.school = req.school;

      const groups = await Group.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate("course")
        .populate("teachers")
        .select("-__v");

      const count = await Group.countDocuments(query);

      return res.json({
        data: groups,
        page,
        pages: Math.ceil(count / perPage),
        count,
      });
    } catch (error) {
      return responser.errorHandler(res, error);
    }
  }
}
const GroupController = new groupController();
export default GroupController;
