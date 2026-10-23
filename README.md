# CourseMaster - Backend API

A RESTful API for the CourseMaster E-learning platform built with Node.js, Express, and MongoDB.

Video Link: https://drive.google.com/file/d/1vjMrBxr0-7xqjxMX2EBEBw30D_av1pOu/view

Admin email: admin@coursemaster.com
Pass: admin123

## Project Name & Description

**CourseMaster Backend** provides a comprehensive RESTful API for managing an E-learning platform. It handles authentication, course management, enrollments, assignments, quizzes, and administrative operations. The backend is built with Node.js and Express.js, using MongoDB for data storage and JWT for authentication.

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Input validation

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd courseMaster_Backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory (see `.env.example`)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/coursemaster

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Registration Key (Optional - for admin account creation)
ADMIN_REGISTRATION_KEY=your-secret-admin-key-here

# Node Environment
NODE_ENV=development

# Email Configuration (Optional - for welcome emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Required Variables:**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT token generation (required)

**Optional Variables:**
- `NODE_ENV` - Environment mode (development/production)
- `ADMIN_REGISTRATION_KEY` - Secret key for admin account registration (optional)
  - If set, users can register as admin by providing this key during registration
  - If not set, admin registration via key is disabled
  - Admins can still be created manually in the database
- `EMAIL_SERVICE` - Email service provider (gmail, smtp, etc.)
- `EMAIL_USER` - Email address for sending welcome emails
- `EMAIL_PASSWORD` - Email password or app password
- `FRONTEND_URL` - Frontend URL for email links

**Note for Email Setup:**
- For Gmail, you need to:
  1. Enable 2-Factor Authentication
  2. Generate an App Password (not your regular password)
  3. Use the App Password in `EMAIL_PASSWORD`
- If email is not configured, the app will still work but won't send welcome emails

## API Documentation

Base URL: `http://localhost:5000/api/api`

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "adminKey": "optional-admin-key" 
  }
  ```
- **Response:** User object with token
- **Note:** 
  - By default, users are registered as "student"
  - To register as "admin", provide a valid `adminKey` that matches `ADMIN_REGISTRATION_KEY` in environment variables
  - If invalid admin key is provided, registration will fail

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** User object with token

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object

### Course Endpoints (Public)

#### Get All Courses
- **GET** `/api/courses`
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 8)
  - `search` - Search by title or instructor
  - `sort` - Sort by price: `price_asc` or `price_desc`
  - `category` - Filter by category
  - `tags` - Filter by tags (comma-separated)
- **Response:** Paginated courses list

#### Get Course by ID
- **GET** `/api/courses/:id`
- **Response:** Course object with full details

### Enrollment Endpoints (Protected - Student)

#### Enroll in Course
- **POST** `/api/enrollments/:courseId`
- **Headers:** `Authorization: Bearer <token>`
- **Body (optional):**
  ```json
  {
    "batchId": "batch-id-here"
  }
  ```
- **Response:** Enrollment object

#### Get My Enrollments
- **GET** `/api/enrollments/my`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of enrollment objects

#### Mark Lesson as Complete
- **PATCH** `/api/enrollments/:enrollId/complete-lesson`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "lessonId": "lesson-id-here"
  }
  ```
- **Response:** Updated enrollment object

### Assignment Endpoints (Protected - Student)

#### Submit Assignment
- **POST** `/api/assignments/submit`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "answer": "Answer text or Google Drive link",
    "answerType": "text" // or "link"
  }
  ```
- **Response:** Assignment submission object

#### Get My Submissions
- **GET** `/api/assignments/my`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of assignment submissions

### Quiz Endpoints (Protected - Student)

#### Submit Quiz
- **POST** `/api/quizzes/submit`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "answers": [0, 1, 2, 0] // Array of selected option indices
  }
  ```
- **Response:**
  ```json
  {
    "total": 4,
    "score": 3,
    "percent": 75
  }
  ```

### Admin Endpoints (Protected - Admin Only)

#### Create Course
- **POST** `/api/admin/courses`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** See Course Schema below
- **Response:** Created course object

#### Update Course
- **PATCH** `/api/admin/courses/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Course fields to update
- **Response:** Updated course object

#### Delete Course
- **DELETE** `/api/admin/courses/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

#### Get All Enrollments
- **GET** `/api/admin/enrollments`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `courseId` - Filter by course
  - `batchId` - Filter by batch
- **Response:** Array of enrollment objects

#### Get All Assignments
- **GET** `/api/admin/assignments`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of assignment submissions

#### Get Analytics
- **GET** `/api/admin/analytics`
- **Headers:** `Authorization: Bearer <token>` (Admin only)
- **Response:** Analytics data including:
  - Chart data for enrollments over last 30 days
  - Top courses by enrollments
  - Platform statistics (total enrollments, courses, students, instructors)

#### Review Assignment
- **PATCH** `/api/admin/assignments/:id/review`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "status": "reviewed",
    "reviewNotes": "Great work!",
    "grade": 95
  }
  ```
- **Response:** Updated assignment submission

## Data Models

### Course Schema
```javascript
{
  title: String (required, indexed),
  description: String (required),
  instructorName: String (required, indexed),
  price: Number (required),
  category: String (indexed),
  tags: [String] (indexed),
  syllabus: [{
    title: String (required),
    lessons: [{
      title: String (required),
      videoUrl: String (required),
      assignmentPrompt: String,
      quiz: [{
        question: String,
        options: [String],
        correctIndex: Number
      }]
    }]
  }],
  batches: [{
    name: String,
    startDate: Date
  }]
}
```

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  role: String (enum: ["student", "admin"], default: "student")
}
```

### Enrollment Schema
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  batchId: ObjectId,
  progress: {
    completedLessons: [ObjectId],
    percent: Number (default: 0)
  }
}
```

## Error Handling

All errors follow this format:
```json
{
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Bonus Features

### Email Notifications
- Welcome emails are automatically sent to new users upon registration
- Uses Nodemailer for email delivery
- Configure email settings in `.env` file
- Email sending is non-blocking (won't fail registration if email fails)

### Analytics Dashboard
- Admin analytics dashboard with enrollment trends
- Charts showing enrollments over the last 30 days
- Top courses by enrollment statistics
- Platform-wide statistics (total enrollments, courses, students, instructors)
- Accessible at `/admin/analytics` (admin only)

## Admin Registration

Admins can be created in two ways:

1. **Registration Key Method (Recommended)**:
   - Set `ADMIN_REGISTRATION_KEY` in your `.env` file
   - During registration, provide the admin key in the registration form
   - If the key matches, the user will be created as "admin"
   - If the key is invalid or missing, registration will fail or create a student account

2. **Manual Database Method**:
   - Create admin users directly in the database
   - Set the `role` field to "admin" in the User document

**Note**: If `ADMIN_REGISTRATION_KEY` is not set in `.env`, admin registration via key is disabled for security.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Admin-only routes with role checking
- Admin registration key protection
- Input validation with Zod
- CORS enabled

## Database Indexing

The following fields are indexed for performance:
- Course: `title`, `instructorName`, `category`, `tags`
- Enrollment: `{student: 1, course: 1}` (unique compound index)

## Deployment

The backend is deployed on **Vercel**. Make sure to set all environment variables in your deployment platform.

## Development

- Development server runs on `http://localhost:5000` (default)
- Uses `nodemon` for auto-restart during development
- MongoDB connection is handled via Mongoose

**********

Bug Report  of CourseMaster

Bug ID & Title: BUG-001 — Login button does not respond upon clicking
Location & Steps to Reproduce: Login page → Enter valid credentials → Click "Login".
Expected vs. Actual Result: Expected the user to log in successfully, but nothing happens after clicking the button.
Severity & Evidence: Critical (P1 ) — API Error Response: {"message":"Invalid email or password"}
Fix & Verification Status: Corrected the login event handler and verified that the authentication flow functions properly.
Status: Fixed & Verified.


Bug ID & Title: BUG-002 — "No courses found" message displayed on Courses page
Location & Steps to Reproduce: Navigation Bar → Visit the Courses page.
Expected vs. Actual Result: Expected the Courses page to display all available course data. Instead, no courses are displayed, and a "No courses data" message appears.
Severity & Evidence: High (P2 )— UI displays "No courses data".
Fix & Verification Status: Seeded course data into the database and verified that all course cards are correctly showcased on the page.
Status: Fixed & Verified.


Bug ID & Title: BUG-003 — Dashboard and Logout buttons missing from Navbar after successful login
Location & Steps to Reproduce: Navbar → Log in to account → Visit the Home page.
Expected vs. Actual Result: Expected the Navbar to update and display the "Dashboard" and "Logout" buttons upon successful login. Instead, the Navbar remains unchanged.
Severity & Evidence: High (P2 ) — No console errors thrown, but the Navbar UI state fails to update post-authentication.
Fix & Verification Status: Resolved the state synchronization issue in the Navbar component and verified that the "Dashboard" and "Logout" routes appear correctly upon logging in.
Status: Fixed & Verified.


Bug ID & Title: BUG-004 — Student dashboard progress data not rendering on frontend
Location & Steps to Reproduce: Student Dashboard → Navigate to the Student overview page → Inspect the /me and /my API responses in the browser's Network tab.
Expected vs. Actual Result: Expected student progress metrics (completed lessons and progress percentages) to render accurately on the dashboard. Instead, the dashboard appears blank even though the API responses contain the necessary progress payload.
Severity & Evidence: High (P2 ) — API response includes complete progress data, but the dashboard fails to render it.
Fix & Verification Status: Fixed frontend data mapping and rendering logic to ensure student progress data is accurately extracted from the API response and displayed on the dashboard UI.
Status: Fixed & Verified.


Bug ID & Title: BUG-005 — Course card titles are not responsive on smaller screens
Location & Steps to Reproduce: Public Courses Page → View course list on varying screen sizes.
Expected vs. Actual Result: Expected course titles inside card components to wrap and scale responsively across all devices. Instead, titles overflow or truncate incorrectly on smaller viewports.
Severity & Evidence: Low (P4 ) — Text overflow and layout breaking issues observed on course card titles.
Fix & Verification Status: Applied responsive Tailwind utility classes (line-clamp-2) to course title elements and verified consistent layout rendering across mobile, tablet, and desktop viewports.
Status: Fixed & Verified.

Bug ID & Title: BUG-006 — After register not redirecting to home page instead of login page / authentication state mismatch
Location & Steps to Reproduce: Registration page (/register) → Enter valid Name, Email, and Password → Click on the "Create Account" button.
Expected vs. Actual Result:
Expected: The user should be automatically authenticated and redirected to the home page (/) with the navbar updated to show the user dashboard/logout options.
Actual Result: Initially redirected to the login page or redirected to the home page without updating the Redux auth state (causing the navbar to still show the "Login" button).
Severity & Evidence: Medium (P3) — Post-registration user experience disruption and broken authentication flow.
Fix & Verification Status: Fixed by replacing manual navigation with Redux Toolkit's registerAsync thunk inside Register.jsx. Dispatched registerAsync(payload), verified fulfillment using registerAsync.fulfilled.match(resultAction), and ensured proper token storage and Redux store synchronization. Verified that upon successful registration, the user is automatically logged in, the navbar and Redux state update instantly, and the user is redirected seamlessly to the home page.
Status: Fixed & Verified.


Bug ID & Title: BUG-007 — Auth middleware calls next() on JWT verification failure instead of returning 401 Unauthorize
Location & Steps to Reproduce: Backend authMiddleware.js → Send an API request to any protected route (like /me) using an invalid, expired, or outdated token.
Expected vs. Actual Result: Expected the backend to block the request and return a 401 Unauthorized response, but instead it executed next(), passing an unauthenticated request forward with an undefined req.user which caused downstream server crashes.
Severity & Evidence: Critical (P1) — Server crash with Cannot read properties of undefined (reading 'id') error in the console and network response.
Fix & Verification Status: Updated the catch block in authMiddleware.js to return res.status(401).json({ message: "Not authorized, token failed or expired" }) instead of invoking next(). Verified that invalid tokens are now properly rejected with a 401 status.
Status: Fixed & Verified.


Bug ID & Title: BUG-008 — Hardcoded dev bypass tokens cause 401 Unauthorized errors on portal redirects after database re-seeding
Location & Steps to Reproduce: Login page → Click on the "Student Portal" or "Admin Portal" direct login (dev bypass) buttons.
Expected vs. Actual Result: Expected seamless authentication and immediate redirection to the respective dashboard, but instead encountered a 401 Unauthorized ("token failed or expired") error because the static hardcoded tokens failed to match database states post-seeding.
Severity & Evidence: High (P2) — Network Response: {"message":"Not authorized, token failed or expired"}.
Fix & Verification Status: Replaced static hardcoded JWT tokens in Login.jsx with a dynamic API-driven handler (handleDirectPortalLogin). The function now triggers a real loginUser request, saves a fresh and valid token, and redirects seamlessly. Verified that both student and admin portals load instantly without any authentication failures.
Status: Fixed & Verified.

Bug ID & Title: BUG-009 — Assignment submission filtering queries non-existent courseId field instead of Mongoose schema course field
Location & Steps to Reproduce: Backend admin.service.js → getAssignments function → Admin dashboard querying or filtering assignment submissions by course.
Expected vs. Actual Result: Expected assignment submissions to be accurately filtered and retrieved by the specified course ID, but instead failed to filter or returned empty results because the query filter targeted courseId while the database schema defines the field as course.
Severity & Evidence: High (P2) — Query filter mismatch resulting in empty or unfiltered assignment listings on the admin dashboard.
Fix & Verification Status: Updated the getAssignments function in admin.service.js to correctly map query.courseId to filter.course to match the Mongoose AssignmentSubmission model schema. Verified that assignment submissions now correctly filter and display data based on the selected course.
Status: Fixed & Verified.


Bug ID & Title: BUG-010 — Registration payload omits role and adminKey fields, preventing admin account creation
Location & Steps to Reproduce: Frontend Register.jsx (handleSubmit function) → Enter name, email, password, and admin registration key → Click "Create Account".
Expected vs. Actual Result: Expected the system to successfully register the user as an administrator when a valid admin key was provided, but instead the account was always created with the default "student" role because the frontend payload failed to include the role and adminKey properties.
Severity & Evidence: High (P2) — Role assignment failure where valid admin key inputs were ignored, defaulting all new sign-ups to student accounts.
Fix & Verification Status: Updated the handleSubmit function in Register.jsx to dynamically construct and attach role: "admin" and adminKey to the API payload when the admin key input is populated, or role: "student" otherwise. Verified that providing a valid admin key now successfully creates an administrator account.
Status: Fixed & Verified.


Bug ID & Title: BUG-011 — Inverted conditional check in enrollCourse blocks new enrollments and throws erroneous duplicate errors
Location & Steps to Reproduce: Backend enrollment.service.js (enrollCourse function) → Attempt to enroll a student in a course for the first time.
Expected vs. Actual Result: Expected the system to successfully create a new enrollment record for un-enrolled students, but instead it threw an "Already enrolled in this course" error because the conditional check was inverted (if (!enrollment)).
Severity & Evidence: Critical (P1) — Complete blockage of course enrollment functionality for students trying to register for courses.

Fix & Verification Status: Corrected the conditional logic in enrollCourse to check for existing enrollment records (if (existingEnrollment)) and throw an error only when the student is already registered. Verified that students can now successfully enroll in new courses.
Status: Fixed & Verified.


Bug ID & Title: BUG-012 — Missing await keyword on enrollment.save() in completeLesson leads to unpersisted progress updates
Location & Steps to Reproduce: Backend enrollment.service.js (completeLesson function) → Student marks a lesson as completed to update course progress.
Expected vs. Actual Result: Expected completed lessons and progress percentages to be reliably saved to the database before returning the response, but instead enrollment.save() executed without await, causing race conditions and inconsistent progress tracking.
Severity & Evidence: High (P2) — Data inconsistency where completed lesson counts and progress percentages occasionally failed to persist in the database.
Fix & Verification Status: Added the missing await operator to enrollment.save() within the completeLesson function. Verified that progress data is accurately calculated, updated, and saved to the database without race conditions.
Status: Fixed & Verified.


Bug ID & Title: BUG-013 — Incorrect quiz percentage calculation using 10 instead of 100
Location & Steps to Reproduce: Backend quiz.service.js (or controller) → submitQuiz function → Student submits answers for a lesson quiz to calculate the percentage score.
Expected vs. Actual Result: Expected the percentage score to be calculated by multiplying (score / total) by 100 (e.g., $8 / 10 \times 100 = 80\%$), but instead it was multiplied by 10 (e.g., $8 / 10 \times 10 = 8\%$), leading to incorrectly low quiz percentages saved in the database.
Severity & Evidence: High (P2) — Data inaccuracy affecting student progress and quiz analytics, where students received invalidly low percentage scores for all submitted quizzes.
Fix & Verification Status: Updated the percentage calculation formula in submitQuiz to Math.round((score / total) * 100). Verified that quiz submissions now accurately calculate, display, and persist correct percentage scores.
Status: Fixed & Verified.



Bug ID & Title: BUG-014 — Unvalidated optional adminKey in Zod registration schema causing improper role management
Location & Steps to Reproduce: Backend authValidator.js (registerSchema) & authController.js (register function) → A user submits a registration payload with or without an adminKey.
Expected vs. Actual Result: Expected the Zod validation schema to strictly enforce or appropriately handle the adminKey constraints, but keeping it as .optional() caused validation inconsistencies and unhandled edge cases during admin user registration.
Severity & Evidence: Medium (P3) — Validation schema mismatch affecting data integrity and proper authorization handling during user sign-up.
Fix & Verification Status: Removed .optional() from the adminKey field in the Zod registerSchema (or adjusted it based on the strict requirement) and updated the controller logic to validate the key securely against environment variables. Verified that registration payloads are now accurately validated without unexpected schema errors.
Status: Fixed & Verified.


Bug ID & Title: BUG-015 — Restrictive custom CORS headers middleware blocking PUT, DELETE, and PATCH preflight requests
Location & Steps to Reproduce: Backend app.js / server.js → Custom middleware setting res.header("Access-Control-Allow-Methods", "GET, POST") → Client attempts to perform update (PUT/PATCH) or deletion (DELETE) operations on resources.
Expected vs. Actual Result: Expected all standard HTTP methods (GET, POST, PUT, DELETE, PATCH) to be allowed by CORS preflight headers, but instead a custom middleware restricted allowed methods strictly to GET, POST, causing CORS errors and blocking all update/delete requests from the frontend.
Severity & Evidence: High (P2) — Critical functionality failure preventing users from updating or deleting data across the entire application due to CORS policy blocks.
Fix & Verification Status: Removed the restrictive custom middleware setting Access-Control-Allow-Methods to GET, POST and let the standard cors() middleware handle preflight headers automatically. Verified that PUT, DELETE, and other HTTP requests now execute successfully without CORS violations.
Status: Fixed & Verified.



