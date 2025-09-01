import Employer from '../models/Employer.js'
import User from '../models/User.js'
import Responser from '../utils/response.js'
import UserRolesController from './role.controller.js'
import userRolesController from './role.controller.js'
import Position from '../models/Position.js'

const responser = new Responser()

class employerController {
  // So'rov jo'natish
  async sendRequest(req, res) {
    try {
      const { user, message, positions } = req.body

      if (!user || !message || !positions) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const school = req.school
      const newEmployer = new Employer({
        user,
        school,
        message,
        positions,
      })
      await newEmployer.save()

      return responser.res(res, 201, newEmployer)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  // Mening takliflarimni olish
  async getMyInvites(req, res) {
    try {
      const user = req.user

      const invites = await Employer.find({ user: user.id })
        .populate({
          path: 'school',
          select: '-documents -ceo',
        })
        .populate({
          path: 'positions',
          populate: { path: 'position' },
          select: '-school',
        })

      return responser.res(res, 200, invites)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  // Taklifni qabul qilish
  async acceptInvite(req, res) {
    try {
      const eI = req.params.id

      const e = await Employer.findById(eI).populate({
        path: 'positions',
        populate: { path: 'position' },
      })

      if (!e) {
        return responser.res(res, 404, false, 'Employer not found')
      }

      const user = req.user

      if (String(e.user) !== String(user.id)) {
        return responser.res(res, 403, false, 'Access denied')
      }

      const type = e.positions[0].position.type
      const permissions = e.positions.flatMap(
        (position) => position.position.permissions || [] // Handle potential undefined values gracefully
      )
      console.log(user.id, type, permissions)

      const rI = await userRolesController.newUserRole(
        user.id,
        e.school,
        type,
        permissions
      )
      console.log({rI})

      await User.findByIdAndUpdate(
        user.id,
        {
          $push: { roles: rI },
        },
        { new: true }
      )

      e.status = 'ACCEPTED'
      e.role = rI

      const updatedEmployer = await e.save()
      return responser.res(res, 200, updatedEmployer)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async deleteEmployer(req, res) {
    try {
      const id = req.params.id

      if (!id) {
        return responser.res(res, 400, false, 'Missing required fields')
      }

      const employer = await Employer.findById(id).populate({
        path: 'positions',
        populate: { path: 'position' },
      })

      if (!employer) {
        return responser.res(res, 404, false, 'Employer not found')
      }

      if (req.school !== employer.school.toString()) {
        return responser.res(res, 403, false, 'Access denied')
      }

      if (employer.status === 'ACCEPTED') {
        const eU = employer.user.toString()
        const rolesId = []
        for (const position of employer.positions) {
          const role = await userRolesController.deleteRole(
            eU,
            position.position.type,
            employer.school.toString()
          )
          if (role !== false) {
            rolesId.push(role)
          }
        }
        await User.findByIdAndUpdate(
          eU,
          { $pull: { roles: { $in: rolesId } } },
          { new: true }
        )
      }
      const e = await Employer.findByIdAndDelete(id)

      return responser.res(res, 200, false, 'Employer deleted successfully')
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  // Taklifni bekor qilish
  async cancelInvite(req, res) {
    try {
      const employerId = req.params.id

      const employer = await Employer.findById(employerId)

      if (!employer) {
        return responser.res(res, 404, false, 'Employer not found')
      }

      const user = req.user

      if (employer.user.toString() !== user.id.toString()) {
        return responser.res(res, 403, false, 'Access denied')
      }

      const cancelledEmploy = await Employer.findByIdAndUpdate(
        employerId,
        {
          status: 'CANCELLED',
          cancelledAt: Date.now(),
        },
        { new: true }
      )

      return responser.res(res, 200, cancelledEmploy)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  // Jo'natilgan takliflar
  async sentInvites(req, res) {
    try {
      const school = req.school

      const search = { school }
      // if (!req.query.all) {
      //   search.status = 'ACCEPTED'
      // }
      const invites = await Employer.find(search)
        .populate({
          path: 'user',
          populate: { path: 'avatar', select: 'location' },
          select: 'name surname username avatar age',
        })
        .populate({
          path: 'positions',
          populate: { path: 'position' }, // corrected typo here
        }).sort({ createdAt: -1 })

      return responser.res(res, 200, invites)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id
      const school = req.school
      const { message, positions } = req.body

      // Find employer by ID
      let employer = await Employer.findById(id)

      if (!employer) {
        return responser.res(res, 404, false, 'Employer not found')
      }

      if (school !== String(employer.school)) {
        return responser.res(res, 403, false, 'Access denied')
      }

      const positionIds = positions.map((pos) => pos.position)

      if (
        String(employer.positions.map((pos) => pos.position)) !==
        String(positionIds)
      ) {
        const rI = employer.role

        const positionDetails = await Promise.all(
          positionIds.map((id) => Position.findById(id))
        )

        if (positionDetails.length > 0) {
          const role = positionDetails[0].type
          const permissions = positionDetails.flatMap(
            (position) => position.permissions || []
          )

          await UserRolesController.updateRole(rI, { role, permissions })
        }
      }

      employer = await Employer.findByIdAndUpdate(
        id,
        {
          message,
          positions,
        },
        { new: true }
      )

      return responser.res(res, 200, employer)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async status(req, res) {
    try {
      const school = req.school
      const id = req.params.id

      const { status } = req.body
      const e = await Employer.findById(id)
      if (!e || e.school.toString() !== school) {
        return responser.res(res, 403, false, false)
      }
      const employer = await Employer.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )

      return responser.res(res, 200, employer)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
}

const EmployerController = new employerController()

export default EmployerController
