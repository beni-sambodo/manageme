import helmet from 'helmet'
import express from 'express'
import cors from 'cors'

import path from 'path'
const __dirname = path.resolve()

const app = express()

// app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'img-src': [
          "'self'",
          // "https://aws-s3-images-bucket.s3.ap-south-1.amazonaws.com",
          'https://tozatelefonuz.s3.eu-north-1.amazonaws.com/',
          'data:',
        ],
        'worker-src': ["'self'", 'blob:'],
        'script-src': ["'self'"],
        'connect-src': ["'self'", 'https://manageme.uz'], // API uchun ruxsat
      },
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors('*'))

import admin from './seeder/admin.js'
import month from './seeder/month.js'
import connect from './config/db.config.js'
import roomRoutes from './routes/room.route.js'
import { PORT, MODE } from './config/const.config.js'
import authRoutes from './routes/auth.routes.js'
import fileRoutes from './routes/file.routes.js'
import adminRoutes from './routes/admin.routes.js'
import groupRoutes from './routes/group.routes.js'
import memoryRoutes from './routes/memory.route.js'
import supportRoute from './routes/support.route.js'
import courseRoutes from './routes/course.routes.js'
import schoolRoutes from './routes/school.routes.js'
import centersuzRoutes from './routes/centers.route.js'
import positionRoutes from './routes/position.routes.js'
import employerRoutes from './routes/employer.routes.js'
import receptionRoutes from './routes/reception.routes.js'
import statisticsRoutes from './routes/statistics.route.js'
import attendanceRoutes from './routes/attendance-route.js'
import transactionRoutes from './routes/transaction-route.js'
import studentPaymentRoutes from './routes/student.payment.js'
import notificationRoutes from './routes/notification.routes.js'
import courseCategoryRoutes from './routes/course-category.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/file', fileRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/memory', memoryRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/school', schoolRoutes)
app.use('/api/support', supportRoute)
app.use('/api/employer', employerRoutes)
app.use('/api/position', positionRoutes)
app.use('/api/reception', receptionRoutes)
app.use('/api/centers.uz', centersuzRoutes)
app.use('/api/statistics', statisticsRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/student-payment', studentPaymentRoutes)
app.use('/api/course-category', courseCategoryRoutes)

import newsRoutes from './routes/web-app/news.routes.js'
import portfolioRoutes from './routes/web-app/portfolio.routes.js'
import sliderRoutes from './routes/web-app/slider.routes.js'
import partnerRoutes from './routes/web-app/partner.routes.js'
import bannerRoutes from './routes/web-app/banner.routes.js'
import questionRoutes from './routes/web-app/question.routes.js'
import achivementRoutes from './routes/web-app/achivement.routes.js'
import wCourseRoutes from './routes/web-app/course.routes.js'
import visitRoutes from './routes/web-app/visit.routes.js'

app.use('/api/web-app/news', newsRoutes)
app.use('/api/web-app/portfolio', portfolioRoutes)
app.use('/api/web-app/slider', sliderRoutes)
app.use('/api/web-app/partner', partnerRoutes)
app.use('/api/web-app/banner', bannerRoutes)
app.use('/api/web-app/question', questionRoutes)
app.use('/api/web-app/achivement', achivementRoutes)
app.use('/api/web-app/course', wCourseRoutes)
app.use('/api/web-app/visit', visitRoutes)

if (MODE === 'PRODUCTION') {
  app.use('/', express.static(path.join(__dirname, 'dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })
}

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

app.listen(PORT, () => {
  connect()
  admin()
  month()
  console.log(`Server listening on http://localhost:${PORT}`)
})

// Test CI/CD workflow
