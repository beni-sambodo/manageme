import User from '../models/User.js'
import UserRoles from '../models/UserRoles.js'

class userRolesController {
  async newUserRole(userId, school, role, permissions, employee) {
    try {
      const newRole = new UserRoles({
        user: userId,
        school,
        role,
        permissions,
        employee,
      })
      await newRole.save()
      await User.updateOne(userId, {selected_role:newRole.id})
      return newRole.id
    } catch (error) {
      console.log(error)
      throw new Error('Error creating role')
    }
  }

  async newStudentRole(user, school, group) {
    try {
      const newRole = await new UserRoles({
        user,
        school,
        group,
        role: 'STUDENT',
      })

      await User.findByIdAndUpdate(user, { $push: { roles: newRole.id } })

      return newRole.id
    } catch (error) {
      console.log(error)
    }
  }

  async checkExistRole(user, role, school) {
    try {
      const thisRole = await UserRoles.findOne({ school, role, user })

      if (!thisRole) {
        return false
      }
      return thisRole.id
    } catch (error) {
      return false
    }
  }

  async deleteRole(user, role, school) {
    const thisRole = await UserRoles.findOne({
      user,
      school,
      role,
    })

    if (!thisRole) {
      return false
    }

    await UserRoles.findByIdAndDelete(thisRole.id)
    return thisRole.id
  }

  async updateRole(role, data) {
    return await UserRoles.findByIdAndUpdate(role, data)
  }
}

const UserRolesController = new userRolesController()

export default UserRolesController
