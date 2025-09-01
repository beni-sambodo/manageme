import s3 from '../utils/aws-s3.js'
import File from '../models/File.js'
import memory from './memory.controller.js'
import { bucket } from '../config/const.config.js'
import mongoose from 'mongoose'
import Responser from '../utils/response.js'

const responser = new Responser()

class fileController {
  async upload(req, res) {
    try {
      const files = req.files
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' }) // Specific error for missing files
      }

      const uploadedFiles = []
      let totalSize = 0

      for (const file of files) {
        const { size, key, location } = file

        // Assuming your File model/library has a create or save method
        const newImg = new File({ size, key, location }) // Replace with the appropriate method call
        await newImg.save()
        uploadedFiles.push(newImg)
        totalSize += newImg.size
      }

      await memory.incMemory(totalSize) // Assuming memory.incMemory handles asynchronous operations

      return responser.res(res, 201, uploadedFiles)
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async deleteMany(req, res) {
    try {
      const filesId = req.body.files

      if (!filesId || filesId.length === 0) {
        return res.status(400).json({
          message: 'Files must be included in the request',
          success: false,
        })
      }

      const notFoundFiles = []
      const deletedFiles = []
      let totalSize = 0

      for (const id of filesId) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ message: 'Invalid file id', success: false })
        }

        const file = await File.findById(id)

        if (!file) {
          notFoundFiles.push(id)
          continue
        }

        try {
          const params = {
            Bucket: bucket,
            Key: file.key,
          }

          await s3.deleteObject(params)

          await File.findByIdAndDelete(id)

          deletedFiles.push(id)
          totalSize += file.size
        } catch (err) {
          notFoundFiles.push(id)
        }
      }

      await memory.decMemory(totalSize)

      return res.status(200).json({
        message: 'File deleted successfully',
        deleted_files: deletedFiles,
        not_found_files: notFoundFiles,
        success: true,
      })
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }
  async deleteOne(req, res) {
    try {
      const id = req.params.id

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: 'Invalid file id', success: false })
      }

      const file = await File.findById(id)

      if (!file) {
        return res.status(404).json({
          message: 'File not found',
          success: false,
        })
      }

      const params = {
        Bucket: bucket,
        Key: file.key,
      }
      await memory.decMemory(file.size)
      await File.findByIdAndDelete(id)
      s3.deleteObject(params, (err, data) => {
        if (err) {
          return responser.errorHandler(res, err)
        }
        {
          return responser.res(res, 200, false, 'File deleted successfully')
        }
      })
    } catch (error) {
      return responser.errorHandler(res, error)
    }
  }

  async staticDeleteMany(files) {
    try {
      if (!files || files.length === 0) {
        return res.status(400).json({
          message: 'Files must be included in the request',
          success: false,
        })
      }

      const notFoundFiles = []
      const deletedFiles = []
      let totalSize = 0

      for (const id of files) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ message: 'Invalid file id', success: false })
        }

        const fileId = id.toString()
        const file = await File.findByIdAndDelete(fileId)
        if (!file) {
          notFoundFiles.push(id)
          continue
        }

        try {
          const params = {
            Bucket: bucket,
            Key: file.key,
          }
          await s3.deleteObject(params)
          deletedFiles.push(id)
          totalSize += file.size
        } catch (err) {
          notFoundFiles.push(id)
        }
      }

      await memory.decMemory(totalSize)

      return true
    } catch (error) {}
  }
}

const FileController = new fileController()

export default FileController
