# Drivers Portal - Driving Test Booking System

A comprehensive web application for managing driving test appointments and examinations. The system allows drivers to book tests, examiners to manage results, and admins to oversee the entire appointment system.

## 📋 Project Overview

The Drivers Portal is a full-stack web application built with Node.js and Express.js that facilitates:
- **Drivers**: Book and manage G2 and G driving test appointments
- **Examiners**: Review and update test results
- **Admins**: Manage all appointments and coordinate scheduling

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v4.21.2
- **Database**: MongoDB (Cloud: MongoDB Atlas)
- **ODM**: Mongoose v8.12.1
- **Authentication**: Express-session with bcrypt password hashing
- **Session Store**: MongoDB via connect-mongo

### Frontend
- **Template Engine**: EJS v3.1.10
- **Styling**: CSS
- **Client-side Scripts**: JavaScript

### Development Tools
- **Dev Server**: Nodemon v3.1.9 (auto-restart on file changes)

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.12.1",
    "express-session": "^1.18.1",
    "connect-mongo": "^5.1.0",
    "ejs": "^3.1.10",
    "bcrypt": "^5.1.1",
    "mongodb": "^6.15.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DrivingTestbook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update MongoDB connection string in `index.js` (line 27-30) if using different credentials
   - Current MongoDB URL: `mongodb+srv://admin:admin@cluster0.cc8z9.mongodb.net/drivers_database`

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open browser and navigate to: `http://localhost:4001`

## 📁 Project Structure

```
DrivingTestbook/
├── controllers/           # Route handlers
│   ├── loginController.js
│   ├── signController.js
│   ├── homeController.js
│   ├── appointmentController.js      # Admin appointment management
│   ├── cancelbookingController.js     # Driver cancel bookings
│   ├── examinerController.js          # Examiner functionality
│   ├── newuserController.js           # New appointment booking
│   ├── updateController.js            # Update test results
│   ├── findDriverController.js
│   └── gController.js
├── models/               # Database schemas
│   ├── User.js           # User model (Driver, Examiner, Admin)
│   └── appointment.js     # Appointment/Test model
├── middleware/           # Authentication middleware
│   ├── authMiddleware.js          # General auth check
│   ├── driverAuthMiddleware.js    # Driver-only routes
│   └── adminAuthMiddleware.js     # Admin-only routes
├── views/               # EJS templates
│   ├── login.ejs
│   ├── signup.ejs
│   ├── home.ejs
│   ├── g2.ejs           # G2 test booking page
│   ├── g.ejs            # G test booking page
│   ├── examiner.ejs     # Examiner dashboard
│   ├── appointment.ejs  # Admin appointment management
│   └── layouts/         # Shared layout components
│       ├── header.ejs
│       ├── navbar.ejs
│       ├── footer.ejs
│       └── scripts.ejs
├── public/              # Static assets
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── scripts.js
│   └── img/
├── index.js             # Main application file
├── package.json         # Project metadata and dependencies
└── README.md           # Project documentation
```

## 🔐 User Roles & Access Control

The application supports three user types with role-based access:

### 1. **Driver**
- Create account and login
- Book G2 driving test appointments
- Book G driving test appointments
- View personal appointments
- Cancel booked appointments
- Update test results/information

**Routes**:
- `/g2` - G2 test booking
- `/g` - G test booking
- `/g2/submit` - Submit new appointment
- `/g2/cancel` - Cancel appointment
- `/g/update` - Update G test results

### 2. **Admin**
- Manage all appointments in the system
- View all scheduled tests
- Add/edit appointment slots
- Coordinate with examiners

**Routes**:
- `/appointment` - Appointment management dashboard

### 3. **Examiner**
- View assigned test appointments
- Record and update test results
- Manage examination schedule

**Routes**:
- `/examiner` - Examiner dashboard

## 📝 API Routes

### Authentication Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/login` | Login page |
| POST | `/login` | Process login |
| GET | `/signup` | Signup page |
| POST | `/signup` | Process registration |
| GET | `/logout` | Logout and destroy session |

### Driver Routes (Requires driverAuthMiddleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/home` | Home dashboard |
| GET | `/g2` | G2 test booking page |
| POST | `/g2/submit` | Book G2 appointment |
| POST | `/g2/cancel` | Cancel G2 appointment |
| GET | `/g` | G test booking page |
| POST | `/g/update` | Update G test results |

### Admin Routes (Requires adminAuthMiddleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/appointment` | View all appointments |
| POST | `/appointment` | Create/update appointment slots |

### Examiner Routes (Requires examinerAuthMiddleware)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/examiner` | Examiner dashboard |
| POST | `/examiner` | Update exam results |

## 🛡️ Security Features

- **Password Encryption**: bcrypt hashing for user passwords
- **Session Management**: Express-session with MongoDB store
- **Role-Based Access Control**: Custom middleware for user type verification
- **Session Security**: 
  - HttpOnly cookies (prevents XSS attacks)
  - 24-hour session expiration
  - Secure flag configuration

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed with bcrypt),
  userType: String (Driver, Examiner, Admin),
  phone: String,
  licenseNumber: String,
  createdAt: Date
}
```

### Appointment Model
```javascript
{
  userId: ObjectId (ref: User),
  testType: String (G, G2),
  appointmentDate: Date,
  timeSlot: String,
  status: String (scheduled, completed, cancelled),
  examinerNotes: String,
  result: String (pass, fail),
  isTimeSlotAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Environment Configuration

### MongoDB Connection
- **Connection String**: Stored in `index.js` (line 27)
- **Database Name**: `drivers_database`
- **Session Store**: `sessions` collection

### Server Configuration
- **Port**: 4001
- **Session Secret**: `lostandfound11`
- **Session Expiration**: 24 hours
- **Template Engine**: EJS

## 📝 Running the Project

### Development Mode (with auto-reload)
```bash
npm start
```

### Production Build
```bash
node index.js
```

## 🐛 Troubleshooting

### MongoDB Connection Error
If you see `ENOTFOUND _mongodb._tcp.cluster0.cc8z9.mongodb.net`:
- Ensure MongoDB Atlas account is active
- Check internet connection
- Verify connection string credentials
- Whitelist your IP address in MongoDB Atlas

### Port Already in Use
If port 4001 is already in use:
- Change `PORT = 4001` in `index.js` to another port
- Or kill the process: `netstat -ano | findstr :4001` (Windows)

## 📋 Available Scripts

```bash
npm start              # Start development server with nodemon
npm test              # Run tests (not configured yet)
```

## 🔄 How It Works

### User Registration Flow
1. User signs up via `/signup` page
2. Password hashed using bcrypt
3. User stored in MongoDB
4. Redirect to login page

### Login Flow
1. User submits credentials
2. Password verified against hashed version
3. Session created with user ID
4. Session stored in MongoDB
5. User redirected to home page

### Appointment Booking Flow
1. Driver navigates to `/g2` or `/g`
2. Selects available time slots
3. Books appointment via POST to `/g2/submit` or `/g/update`
4. Admin can manage in `/appointment` dashboard
5. Examiner views in `/examiner` dashboard

## 📞 Support

For issues or questions, contact the development team or check the application logs in the terminal.

## 📄 License

ISC License - See package.json for details

## ✨ Features

- ✅ User authentication with role-based access
- ✅ Appointment booking and management
- ✅ Admin dashboard for scheduling
- ✅ Examiner result recording
- ✅ Session persistence with MongoDB
- ✅ Responsive EJS templating
- ✅ Auto-reload development environment
- ✅ Password encryption with bcrypt

---

**Version**: 1.0.0  
**Last Updated**: January 2026
