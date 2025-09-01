import client from '../config/redis.config.js'
import bcrypt from 'bcryptjs'

class redisController {
  async newCache(cache, data) {
    data.code = await bcrypt.hash(String(data.code), 6)
    return await client.set(cache, JSON.stringify(data))
  }
  async checkCode(email, code) {
    const key = `email:${email}`

    const data = await this.getData(email)

    if (!data) {
      return false
    }

    const checkCode = await bcrypt.compare(String(code), String(data.code))
    if (!checkCode) {
      return false
    }

    const newCache = {
      email,
      code: data.code,
      verifired: true,
    }

    await client.set(key, JSON.stringify(newCache))

    return true
  }
  async delete(email) {
    const key = `email:${email}`

    await client.del(key)
  }

  async checkVerifyredData(email) {
    try {
      const data = await this.getData(email)

      if (!data) {
        return false
      }
      if (data.verifired === true) {
        await this.delete(email)
        return true
      } else {
        return false
      }
    } catch (error) {}
  }

  async getData(email) {
    const key = `email:${email}`
    const cache = await client.get(key)
    if (!cache) {
      return false
    }
    const data = JSON.parse(cache)

    return data
  }
}

const RedisController = new redisController()
export default RedisController
