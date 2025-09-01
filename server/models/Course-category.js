import mongoose from 'mongoose'

const Schema = mongoose.Schema

const course_category = new Schema({
  name: {
    type: String,
    required: true,
  },
})

const CourseCategory = mongoose.model('course-category', course_category)

export default CourseCategory
