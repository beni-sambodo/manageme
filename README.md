# ManageMe - Enterprise-Grade Educational Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.3+-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> **A sophisticated, production-ready educational management system built with modern web technologies, featuring enterprise-grade architecture, comprehensive security, and scalable design patterns.**

## 🎯 Project Overview

ManageMe is a full-stack educational management platform designed to handle complex business operations for educational institutions. The system provides comprehensive solutions for student management, course administration, financial tracking, and institutional operations with a focus on security, scalability, and maintainability.

### 🏗️ Architecture Highlights

- **Multi-tenant architecture** supporting multiple educational institutions
- **Role-based access control (RBAC)** with granular permissions
- **Real-time data processing** with Redis caching
- **Secure file management** via AWS S3 integration
- **Comprehensive audit trails** and transaction logging
- **Multi-language support** (Uzbek, Russian, English)

## 🚀 Technology Stack

### Backend (Primary Focus)
- **Runtime**: Node.js 18+ with ES6+ modules
- **Framework**: Express.js 4.19+ with custom middleware architecture
- **Database**: MongoDB 8.3+ with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Caching**: Redis for performance optimization
- **File Storage**: AWS S3 with multer-s3 integration
- **Email**: Nodemailer with SMTP integration
- **Image Processing**: Sharp for optimization
- **Security**: Helmet.js with custom CSP configuration

### Frontend
- **Framework**: React 18+ with TypeScript 5.2+
- **Build Tool**: Vite 5.2+ for fast development
- **Styling**: TailwindCSS with Ant Design components
- **State Management**: Zustand with devtools
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router DOM 6+
- **Internationalization**: i18next with multiple locales
- **Charts**: ApexCharts and Recharts for analytics

### DevOps & Quality
- **Testing**: Vitest for unit testing
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript strict mode
- **CI/CD**: GitHub Actions workflow
- **Code Quality**: Prettier formatting

## 🏛️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/TS)    │◄──►│   (Node/Express)│◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   External      │
                       │   Services      │
                       │   (AWS S3,      │
                       │    Redis,       │
                       │    Email)       │
                       └─────────────────┘
```

### Core Modules

- **Authentication & Authorization**: JWT-based with RBAC
- **User Management**: Multi-role user system with permissions
- **Course Management**: Comprehensive course and category handling
- **Student Management**: Enrollment, attendance, and progress tracking
- **Financial Management**: Payment processing, debt tracking, and reporting
- **Group Management**: Dynamic group creation with scheduling
- **Attendance System**: Time-based attendance with business rules
- **File Management**: Secure file uploads with AWS S3
- **Reporting & Analytics**: Comprehensive statistics and insights
- **Web Application**: Public-facing content management

## 🔐 Security Features

### Authentication & Authorization
- **JWT tokens** with secure storage
- **Password hashing** using bcrypt with salt rounds
- **Role-based access control** with granular permissions
- **Session management** with Redis
- **Input validation** and sanitization

### Data Protection
- **School-level data isolation** ensuring tenant separation
- **CORS configuration** with whitelist approach
- **Content Security Policy** with Helmet.js
- **Rate limiting** and request validation
- **Secure file uploads** with type and size validation

### API Security
- **Middleware-based authentication** on protected routes
- **Permission validation** at route level
- **Request sanitization** and validation
- **Error handling** without information leakage

## 📊 Database Design

### Core Models
```javascript
// User with role-based access
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, minlength: 4 },
  roles: [{ type: Types.ObjectId, ref: 'UserRoles' }],
  selected_role: { type: Types.ObjectId, ref: 'UserRoles' }
});

// Group with complex scheduling
const groupSchema = new Schema({
  name: { type: String, required: true },
  students: [{ type: Types.ObjectId, ref: 'User' }],
  teachers: [{ type: Types.ObjectId, ref: 'User' }],
  days: [{ date: Date, attendance: Types.ObjectId }],
  status: { type: String, enum: ['NEW', 'WAITING', 'ACCEPTED', 'FINISHED', 'FROZEN'] }
});
```

### Database Features
- **Proper indexing** for performance optimization
- **Referential integrity** with Mongoose relationships
- **Data validation** at schema level
- **Transaction support** for financial operations
- **Aggregation pipelines** for complex queries

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **MongoDB**: 6.0 or higher
- **Redis**: 6.0 or higher
- **AWS Account**: For S3 file storage
- **SMTP Service**: For email functionality

### Environment Configuration

Create `.env` files in both `server/` and `client/` directories:

#### Server Environment Variables
```bash
# Server Configuration
PORT=5000
MODE=development
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/manageme

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# AWS S3 Configuration
S3_ACCESS_KEY_ID=your-aws-access-key
S3_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_REGION=eu-north-1
S3_BUCKET_NAME=your-bucket-name

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Email Configuration
USER_EMAIL=your-email@gmail.com
USER_PASSWORD=your-app-password

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-admin-password
```

#### Client Environment Variables
```bash
VITE_BASE_URL=http://localhost:5000/api
```

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/manageme.uz.git
cd manageme.uz
```

#### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

#### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

#### 4. Database Setup
```bash
# MongoDB will be automatically seeded with:
# - Admin user
# - Month configurations
# - Initial data structures
```

## 🔧 Development Workflow

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run test suite
npm run test:coverage  # Run tests with coverage
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

#### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

### Code Quality Standards

- **ESLint**: Strict linting rules for JavaScript/TypeScript
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Git Hooks**: Pre-commit validation (recommended)

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User authentication
GET  /api/auth/user-data    # Get current user data
PUT  /api/auth/select-role  # Select user role
```

### Core Management Endpoints
```http
# Group Management
GET    /api/group                    # List groups
POST   /api/group                    # Create group
PUT    /api/group/:id                # Update group
DELETE /api/group/:id                # Delete group

# Student Management
GET    /api/student                  # List students
POST   /api/student                  # Create student
PUT    /api/student/:id              # Update student

# Course Management
GET    /api/course                   # List courses
POST   /api/course                   # Create course
PUT    /api/course/:id               # Update course

# Financial Management
GET    /api/student-payment          # Payment records
POST   /api/student-payment          # Process payment
GET    /api/transaction              # Transaction history
```

### Web Application Endpoints
```http
# Public Content Management
GET    /api/web-app/news            # Public news
GET    /api/web-app/course          # Public courses
GET    /api/web-app/portfolio       # Portfolio items
GET    /api/web-app/slider          # Slider content
```

## 🧪 Testing Strategy

### Current Implementation
- **Unit Testing**: Vitest framework setup
- **API Testing**: Endpoint validation
- **Integration Testing**: Database operations

### Recommended Improvements
- **Test Coverage**: Aim for 80%+ coverage
- **E2E Testing**: Playwright or Cypress
- **Performance Testing**: Load testing with Artillery
- **Security Testing**: OWASP ZAP integration

## 🚀 Deployment

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database**: MongoDB Atlas or self-hosted with replication
- **Caching**: Redis Cloud or ElastiCache
- **File Storage**: AWS S3 with CDN
- **Monitoring**: Application performance monitoring
- **Logging**: Structured logging with Winston/Pino

### Docker Support (Recommended Addition)
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance Optimization

### Current Implementations
- **Redis Caching**: Frequently accessed data
- **Database Indexing**: Optimized query performance
- **File Compression**: Image optimization with Sharp
- **Pagination**: Efficient data loading

### Future Enhancements
- **CDN Integration**: Global content delivery
- **Database Sharding**: Horizontal scaling
- **Microservices**: Service decomposition
- **GraphQL**: Efficient data fetching

## 🔍 Monitoring & Observability

### Current State
- **Console Logging**: Basic application logging
- **Error Tracking**: Centralized error handling

### Recommended Improvements
- **Structured Logging**: Winston or Pino integration
- **Metrics Collection**: Prometheus + Grafana
- **APM Tools**: New Relic or DataDog
- **Health Checks**: Endpoint monitoring

## 🤝 Contributing

### Development Guidelines
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow project linting rules
- **Testing**: Include tests for new features
- **Documentation**: Update relevant documentation

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Durbek Saydaliyev** - Senior Software Engineer

- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]
- **Portfolio**: [Your Portfolio Website]

## 🙏 Acknowledgments

- **Open Source Community**: For invaluable tools and libraries
- **MongoDB Team**: For excellent documentation and support
- **Express.js Community**: For the robust web framework
- **React Team**: For the amazing frontend library

## 📞 Support

For support, questions, or collaboration opportunities:

- **Email**: [saydaliyevdurbek0512@gmail.com]
- **Issues**: [GitHub Issues](https://github.com/Durbekjon/manageme/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Durbekjon/manageme/discussions)

---

<div align="center">

**Built with ❤️ by a Software Engineer passionate about scalable, secure, and maintainable code.**

[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-green.svg)](https://nodejs.org/)
[![Made with Express](https://img.shields.io/badge/Made%20with-Express-blue.svg)](https://expressjs.com/)
[![Made with React](https://img.shields.io/badge/Made%20with-React-blue.svg)](https://reactjs.org/)

</div>
