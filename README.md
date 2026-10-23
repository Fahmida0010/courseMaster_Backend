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


# 🐛 CourseMaster Bug Reports & Fixes

Here is the detailed tracking report of all identified bugs, their severity, root causes, and resolutions for the **CourseMaster** project.

---

## 📊 Summary Table

| Bug ID | Title | Severity | Status |
| :--- | :--- | :--- | :--- |
| **BUG-001** | Login button does not respond upon clicking | `Critical (P1)` | `Fixed & Verified` |
| **BUG-002** | "No courses found" message displayed on Courses page | `High (P2)` | `Fixed & Verified` |
| **BUG-003** | Dashboard and Logout buttons missing from Navbar after login | `High (P2)` | `Fixed & Verified` |
| **BUG-004** | Student dashboard progress data not rendering on frontend | `High (P2)` | `Fixed & Verified` |
| **BUG-005** | Course card titles are not responsive on smaller screens | `Low (P4)` | `Fixed & Verified` |
| **BUG-006** | Auth state mismatch & invalid redirection after registration | `Medium (P3)` | `Fixed & Verified` |
| **BUG-007** | Auth middleware calls `next()` on JWT verification failure | `Critical (P1)` | `Fixed & Verified` |
| **BUG-008** | Hardcoded dev bypass tokens cause 401 Unauthorized errors | `High (P2)` | `Fixed & Verified` |
| **BUG-009** | Assignment submission filter queries non-existent `courseId` | `High (P2)` | `Fixed & Verified` |
| **BUG-010** | Registration payload omits `role` and `adminKey` fields | `High (P2)` | `Fixed & Verified` |
| **BUG-011** | Inverted conditional check in `enrollCourse` blocks enrollments | `Critical (P1)` | `Fixed & Verified` |
| **BUG-012** | Missing `await` keyword on `enrollment.save()` in `completeLesson` | `High (P2)` | `Fixed & Verified` |
| **BUG-013** | Incorrect quiz percentage calculation using 10 instead of 100 | `High (P2)` | `Fixed & Verified` |
| **BUG-014** | Unvalidated `adminKey` in Zod registration schema | `Medium (P3)` | `Fixed & Verified` |
| **BUG-015** | Restrictive CORS headers blocking `PUT`, `DELETE`, and `PATCH` | `High (P2)` | `Fixed & Verified` |

---

## 🔎 Detailed Bug Reports

### 🔴 BUG-001 — Login button does not respond upon clicking
* **Location & Steps to Reproduce:** Login page $\rightarrow$ Enter valid credentials $\rightarrow$ Click "Login".
* **Expected vs. Actual Result:** Expected the user to log in successfully, but nothing happens after clicking the button.
* **Severity & Evidence:** `Critical (P1)` — API Error Response: `{"message":"Invalid email or password"}`
* **Fix & Verification:** Corrected the login event handler and verified that the authentication flow functions properly.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-002 — "No courses found" message displayed on Courses page
* **Location & Steps to Reproduce:** Navigation Bar $\rightarrow$ Visit the Courses page.
* **Expected vs. Actual Result:** Expected the Courses page to display all available course data. Instead, no courses are displayed, and a "No courses data" message appears.
* **Severity & Evidence:** `High (P2)` — UI displays "No courses data".
* **Fix & Verification:** Seeded course data into the database and verified that all course cards are correctly showcased on the page.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-003 — Dashboard and Logout buttons missing from Navbar after login
* **Location & Steps to Reproduce:** Navbar $\rightarrow$ Log in to account $\rightarrow$ Visit the Home page.
* **Expected vs. Actual Result:** Expected the Navbar to update and display the "Dashboard" and "Logout" buttons upon successful login. Instead, the Navbar remains unchanged.
* **Severity & Evidence:** `High (P2)` — No console errors thrown, but the Navbar UI state fails to update post-authentication.
* **Fix & Verification:** Resolved the state synchronization issue in the Navbar component and verified that the "Dashboard" and "Logout" routes appear correctly upon logging in.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-004 — Student dashboard progress data not rendering on frontend
* **Location & Steps to Reproduce:** Student Dashboard $\rightarrow$ Navigate to Student overview page $\rightarrow$ Inspect `/me` and `/my` API responses in Network tab.
* **Expected vs. Actual Result:** Expected student progress metrics (completed lessons and progress percentages) to render accurately on the dashboard. Instead, the dashboard appears blank even though the API responses contain the necessary progress payload.
* **Severity & Evidence:** `High (P2)` — API response includes complete progress data, but the dashboard fails to render it.
* **Fix & Verification:** Fixed frontend data mapping and rendering logic to ensure student progress data is accurately extracted from the API response and displayed on the dashboard UI.
* **Status:** `Fixed & Verified`

---

### 🟢 BUG-005 — Course card titles are not responsive on smaller screens
* **Location & Steps to Reproduce:** Public Courses Page $\rightarrow$ View course list on varying screen sizes.
* **Expected vs. Actual Result:** Expected course titles inside card components to wrap and scale responsively across all devices. Instead, titles overflow or truncate incorrectly on smaller viewports.
* **Severity & Evidence:** `Low (P4)` — Text overflow and layout breaking issues observed on course card titles.
* **Fix & Verification:** Applied responsive Tailwind utility classes (`line-clamp-2`) to course title elements and verified consistent layout rendering across mobile, tablet, and desktop viewports.
* **Status:** `Fixed & Verified`

---

### 🟡 BUG-006 — Auth state mismatch & invalid redirection after registration
* **Location & Steps to Reproduce:** Registration page (`/register`) $\rightarrow$ Enter valid Name, Email, and Password $\rightarrow$ Click "Create Account".
* **Expected vs. Actual Result:** Expected the user to be automatically authenticated and redirected to the home page (`/`) with the navbar updated. Actual: Initially redirected to login page or home page without updating the Redux auth state (Navbar still showed "Login").
* **Severity & Evidence:** `Medium (P3)` — Post-registration user experience disruption and broken authentication flow.
* **Fix & Verification:** Replaced manual navigation with Redux Toolkit's `registerAsync` thunk inside `Register.jsx`. Dispatched `registerAsync(payload)`, verified fulfillment using `registerAsync.fulfilled.match(resultAction)`, and ensured proper token storage and Redux store synchronization.
* **Status:** `Fixed & Verified`

---

### 🔴 BUG-007 — Auth middleware calls `next()` on JWT verification failure
* **Location & Steps to Reproduce:** Backend `authMiddleware.js` $\rightarrow$ Send an API request to any protected route (like `/me`) using an invalid, expired, or outdated token.
* **Expected vs. Actual Result:** Expected backend to block request and return `401 Unauthorized`, but instead it executed `next()`, passing an unauthenticated request forward with an `undefined` `req.user` which caused downstream server crashes.
* **Severity & Evidence:** `Critical (P1)` — Server crash with `Cannot read properties of undefined (reading 'id')` error in console/response.
* **Fix & Verification:** Updated the `catch` block in `authMiddleware.js` to return `res.status(401).json({ message: "Not authorized, token failed or expired" })` instead of invoking `next()`.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-008 — Hardcoded dev bypass tokens cause 401 Unauthorized errors
* **Location & Steps to Reproduce:** Login page $\rightarrow$ Click on "Student Portal" or "Admin Portal" direct login (dev bypass) buttons.
* **Expected vs. Actual Result:** Expected immediate redirection, but encountered `401 Unauthorized` ("token failed or expired") error because static hardcoded tokens failed to match database states post-seeding.
* **Severity & Evidence:** `High (P2)` — Network Response: `{"message":"Not authorized, token failed or expired"}`.
* **Fix & Verification:** Replaced static hardcoded JWT tokens in `Login.jsx` with a dynamic API-driven handler (`handleDirectPortalLogin`). Triggers a real `loginUser` request, saves a fresh token, and redirects seamlessly.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-009 — Assignment submission filter queries non-existent `courseId`
* **Location & Steps to Reproduce:** Backend `admin.service.js` $\rightarrow$ `getAssignments` function $\rightarrow$ Admin dashboard querying assignment submissions by course.
* **Expected vs. Actual Result:** Expected submissions to be accurately filtered by specified course ID, but returned empty results because query filter targeted `courseId` while DB schema defines the field as `course`.
* **Severity & Evidence:** `High (P2)` — Query filter mismatch resulting in empty listings on admin dashboard.
* **Fix & Verification:** Updated `getAssignments` function in `admin.service.js` to correctly map `query.courseId` to `filter.course` to match Mongoose `AssignmentSubmission` model schema.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-010 — Registration payload omits `role` and `adminKey` fields
* **Location & Steps to Reproduce:** Frontend `Register.jsx` (`handleSubmit` function) $\rightarrow$ Enter name, email, password, and admin key $\rightarrow$ Click "Create Account".
* **Expected vs. Actual Result:** Expected to register user as an administrator when a valid key is provided, but account was always created with default "student" role because payload omitted `role` and `adminKey`.
* **Severity & Evidence:** `High (P2)` — Role assignment failure where valid admin key inputs were ignored.
* **Fix & Verification:** Updated `handleSubmit` in `Register.jsx` to dynamically construct and attach `role: "admin"` and `adminKey` to API payload when admin key input is populated, or `role: "student"` otherwise.
* **Status:** `Fixed & Verified`

---

### 🔴 BUG-011 — Inverted conditional check in `enrollCourse` blocks enrollments
* **Location & Steps to Reproduce:** Backend `enrollment.service.js` (`enrollCourse` function) $\rightarrow$ Attempt to enroll a student in a course for the first time.
* **Expected vs. Actual Result:** Expected to create a new enrollment record, but threw an "Already enrolled in this course" error because conditional check was inverted (`if (!enrollment)`).
* **Severity & Evidence:** `Critical (P1)` — Complete blockage of course enrollment functionality.
* **Fix & Verification:** Corrected conditional logic in `enrollCourse` to check for existing enrollment records (`if (existingEnrollment)`) and throw error only when already registered.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-012 — Missing `await` keyword on `enrollment.save()` in `completeLesson`
* **Location & Steps to Reproduce:** Backend `enrollment.service.js` (`completeLesson` function) $\rightarrow$ Student marks a lesson as completed.
* **Expected vs. Actual Result:** Expected progress percentages to be reliably saved before response, but `enrollment.save()` executed without `await`, causing race conditions and inconsistent progress tracking.
* **Severity & Evidence:** `High (P2)` — Data inconsistency where completed lesson counts failed to persist occasionally.
* **Fix & Verification:** Added missing `await` operator to `enrollment.save()` within `completeLesson` function.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-013 — Incorrect quiz percentage calculation using 10 instead of 100
* **Location & Steps to Reproduce:** Backend `quiz.service.js` $\rightarrow$ `submitQuiz` function $\rightarrow$ Student submits answers for a lesson quiz.
* **Expected vs. Actual Result:** Expected percentage score to be calculated by multiplying `(score / total)` by `100` (e.g., $8/10 \times 100 = 80\%$), but was multiplied by `10` (e.g., $8/10 \times 10 = 8\%$).
* **Severity & Evidence:** `High (P2)` — Data inaccuracy affecting student progress and quiz analytics.
* **Fix & Verification:** Updated percentage calculation formula in `submitQuiz` to `Math.round((score / total) * 100)`.
* **Status:** `Fixed & Verified`

---

### 🟡 BUG-014 — Unvalidated optional `adminKey` in Zod registration schema
* **Location & Steps to Reproduce:** Backend `authValidator.js` (`registerSchema`) & `authController.js` $\rightarrow$ User submits registration payload with/without `adminKey`.
* **Expected vs. Actual Result:** Expected Zod schema to strictly enforce constraints, but keeping it as `.optional()` caused validation inconsistencies and unhandled edge cases during admin registration.
* **Severity & Evidence:** `Medium (P3)` — Validation schema mismatch affecting data integrity during user sign-up.
* **Fix & Verification:** Removed `.optional()` from `adminKey` field in Zod `registerSchema` and updated controller logic to validate key securely against environment variables.
* **Status:** `Fixed & Verified`

---

### 🟠 BUG-015 — Restrictive CORS headers blocking `PUT`, `DELETE`, and `PATCH`
* **Location & Steps to Reproduce:** Backend `app.js` $\rightarrow$ Custom middleware setting `res.header("Access-Control-Allow-Methods", "GET, POST")` $\rightarrow$ Client attempts update or deletion operations.
* **Expected vs. Actual Result:** Expected all standard HTTP methods to be allowed, but custom middleware restricted methods strictly to `GET, POST`, causing CORS errors on `PUT`/`DELETE` requests.
* **Severity & Evidence:** `High (P2)` — Critical functionality failure preventing update/delete operations across the application.
* **Fix & Verification:** Removed restrictive custom middleware setting `Access-Control-Allow-Methods` and allowed standard `cors()` middleware to handle preflight headers automatically.
* **Status:** `Fixed & Verified`