import Memory from '../models/Memory.js'
import File from '../models/File.js'
import Responser from '../utils/response.js'
const responser = new Responser()
class memoryController {
  async totalMemory(req, res) {
    try {
      const memory = await Memory.findOne()
      const total_mem = memory ? memory.total_size : 0

      let total_mem_mb = total_mem / (1024 * 1024)
      let total_mem_gb = total_mem_mb / 1024

      total_mem_mb = parseFloat(total_mem_mb.toFixed(2))
      total_mem_gb = parseFloat(total_mem_gb.toFixed(2))

      let result =
        total_mem >= 1024 * 1024 * 1024
          ? `${total_mem_gb} GB`
          : `${total_mem_mb} MB`

      const filesCount = await File.countDocuments()

      return res.status(200).json({
        totalMemory: result,
        total_files: filesCount,
      })
    } catch (error) {}
  }
  async incMemory(size) {
    try {
      const existingMemory = await Memory.findOne()
      if (!existingMemory || existingMemory.length === 0) {
        const newMem = new Memory({ total_size: size })
        await newMem.save()
      } else {
        existingMemory.total_size += size
        await existingMemory.save()
      }
    } catch (error) {}
  }
  async decMemory(size) {
    try {
      const existingMemory = await Memory.findOne()
      existingMemory.total_size -= size
      await existingMemory.save()
    } catch (error) {}
  }
}

const MemoryController = new memoryController()

export default MemoryController
