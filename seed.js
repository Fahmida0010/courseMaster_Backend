const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");
const QuizSubmission = require("./src/models/QuizSubmission");
const AssignmentSubmission = require("./src/models/AssignmentSubmission");

// 20 ti courses-er JSON array
const coursesData = [
  {
    title: "Complete Web Development Masterclass with Next.js & React 19",
    description: "Master modern web development from HTML/CSS to advanced React 19, Next.js App Router, Express, and MongoDB. Includes hands-on real-world projects, live classes, quizzes, and code reviews.",
    instructorName: "Jhankar Mahbub",
    price: 5000,
    category: "Web Development",
    tags: ["React", "Next.js", "JavaScript", "Fullstack", "Node.js"],
    batches: [
      { name: "Batch 1 (Spring 2026)", startDate: new Date("2026-01-10") },
      { name: "Batch 2 (Summer 2026)", startDate: new Date("2026-06-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Modern HTML, CSS & Responsive Design",
        lessons: [
          {
            title: "Lesson 1: Introduction to HTML5 & Semantic Elements",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            liveClassLink: "https://meet.google.com/abc-defg-hij",
            liveClassDate: new Date("2026-04-15T18:00:00.000Z"),
            quiz: [
              {
                question: "Which HTML5 tag is used to specify a header for a document or section?",
                options: ["<section>", "<header>", "<head>", "<top>"],
                correctIndex: 1,
              },
              {
                question: "What is the correct HTML element for inserting a line break?",
                options: ["<break>", "<lb>", "<br>", "<line>"],
                correctIndex: 2,
              },
            ],
          },
          {
            title: "Lesson 2: Flexbox & Grid Layouts Deep Dive",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Build a fully responsive pricing card layout using CSS Flexbox and Grid. Submit your GitHub repository URL or live link.",
          },
        ],
      },
      {
        title: "Module 2: React 19 & State Management",
        lessons: [
          {
            title: "Lesson 1: React 19 Components, Props & Hooks",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which hook is used for handling side effects in React?",
                options: ["useState", "useMemo", "useEffect", "useCallback"],
                correctIndex: 2,
              },
            ],
          },
          {
            title: "Lesson 2: Redux Toolkit & Global State",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Implement a persistent shopping cart using Redux Toolkit and LocalStorage. Submit your code repo link.",
          },
        ],
      },
    ],
  },
  {
    title: "Python for Data Science & Machine Learning",
    description: "Learn Python programming, NumPy, Pandas, Matplotlib, and Scikit-Learn to solve real-world data science problems and build predictive machine learning models.",
    instructorName: "Dr. Anisul Islam",
    price: 4500,
    category: "Data Science",
    tags: ["Python", "Machine Learning", "Data Science", "Pandas", "AI"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-02-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Python Fundamentals & Data Structures",
        lessons: [
          {
            title: "Lesson 1: Lists, Dictionaries, and Control Flow",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "How do you define a function in Python?",
                options: ["func myFunc():", "def myFunc():", "function myFunc()", "define myFunc():"],
                correctIndex: 1,
              },
            ],
          },
          {
            title: "Lesson 2: Exploratory Data Analysis with Pandas",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Analyze the provided CSV dataset using Pandas and generate summary statistics and charts.",
          },
        ],
      },
    ],
  },
  {
    title: "Cross-Platform Mobile Development with Flutter & Dart",
    description: "Build beautiful, high-performance native iOS and Android apps using Flutter framework and Dart programming language.",
    instructorName: "Sumit Saha",
    price: 4000,
    category: "Mobile App",
    tags: ["Flutter", "Dart", "Mobile", "Android", "iOS"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-03-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Flutter Basics & Widget Tree",
        lessons: [
          {
            title: "Lesson 1: Stateless vs Stateful Widgets",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which widget is immutable in Flutter?",
                options: ["StatefulWidget", "StatelessWidget", "InheritedWidget", "DynamicWidget"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "UI/UX Design Masterclass with Figma & Design Systems",
    description: "Master user interface and user experience design principles, wireframing, prototyping, user research, and advanced design systems using Figma.",
    instructorName: "Tanvir Ahmed",
    price: 3500,
    category: "UI/UX Design",
    tags: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Wireframing"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-03-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Introduction to UI/UX Principles",
        lessons: [
          {
            title: "Lesson 1: Design Thinking & Wireframing Basics",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Create low-fidelity wireframes for a mobile e-commerce app.",
          },
        ],
      },
    ],
  },
  {
    title: "DevOps & Cloud Engineering with AWS, Docker & Kubernetes",
    description: "Learn cloud infrastructure management, containerization with Docker, orchestration with Kubernetes, and CI/CD pipelines on Amazon Web Services.",
    instructorName: "Fahim Rahman",
    price: 6000,
    category: "DevOps",
    tags: ["AWS", "Docker", "Kubernetes", "DevOps", "CI/CD"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-04-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Docker Containerization Fundamentals",
        lessons: [
          {
            title: "Lesson 1: Dockerfile & Container Lifecycle",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which command is used to build a Docker image from a Dockerfile?",
                options: ["docker create", "docker build", "docker run", "docker init"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Cybersecurity & Ethical Hacking Professional Bootcamp",
    description: "Comprehensive cybersecurity training covering network security, penetration testing, vulnerability assessment, and defensive security measures.",
    instructorName: "Saiful Islam",
    price: 5500,
    category: "Cybersecurity",
    tags: ["Ethical Hacking", "Security", "Penetration Testing", "Networking"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-04-10") },
    ],
    syllabus: [
      {
        title: "Module 1: Introduction to Ethical Hacking",
        lessons: [
          {
            title: "Lesson 1: Reconnaissance & Footprinting Techniques",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Perform basic passive reconnaissance on an authorized lab target.",
          },
        ],
      },
    ],
  },
  {
    title: "Artificial Intelligence & Deep Learning with PyTorch",
    description: "Dive deep into neural networks, computer vision, natural language processing, and generative AI architectures using Python and PyTorch.",
    instructorName: "Dr. Nazmul Hossain",
    price: 7000,
    category: "Artificial Intelligence",
    tags: ["AI", "Deep Learning", "PyTorch", "Neural Networks", "Python"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-05-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Neural Networks Fundamentals",
        lessons: [
          {
            title: "Lesson 1: Perceptrons and Activation Functions",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which of the following is a non-linear activation function?",
                options: ["Linear", "ReLU", "Step", "Identity"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Advanced Node.js & Microservices Architecture",
    description: "Build scalable enterprise-grade backend systems using Node.js, Express, RabbitMQ, gRPC, Docker, and MongoDB microservices.",
    instructorName: "Hasin Hayder",
    price: 4800,
    category: "Backend Development",
    tags: ["Node.js", "Microservices", "Express", "RabbitMQ", "Backend"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-05-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Introduction to Microservices",
        lessons: [
          {
            title: "Lesson 1: Monolith vs Microservices Architecture",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Design a service breakdown diagram for an e-commerce platform.",
          },
        ],
      },
    ],
  },
  {
    title: "Digital Marketing & Growth Hacking Mastery",
    description: "Learn SEO, Facebook Ads, Google Ads, content marketing, email automation, and conversion rate optimization to scale businesses online.",
    instructorName: "Ayman Sadiq",
    price: 3000,
    category: "Digital Marketing",
    tags: ["SEO", "Facebook Ads", "Google Ads", "Marketing", "Growth Hacking"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-06-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Search Engine Optimization (SEO)",
        lessons: [
          {
            title: "Lesson 1: Keyword Research & On-Page SEO",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "What does SEO stand for?",
                options: ["Site Engineering Optimization", "Search Engine Optimization", "System External Operation", "Sales Engine Online"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Full Stack Blockchain Development with Solidity & Web3",
    description: "Build decentralized applications (dApps), write secure smart contracts in Solidity, and interact with Ethereum blockchains using Ethers.js and React.",
    instructorName: "Rakibul Hasan",
    price: 6500,
    category: "Blockchain",
    tags: ["Blockchain", "Solidity", "Web3", "Ethereum", "Smart Contracts"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-06-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Solidity Smart Contract Basics",
        lessons: [
          {
            title: "Lesson 1: Syntax, Data Types & State Variables",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Write a simple decentralized banking smart contract in Remix IDE.",
          },
        ],
      },
    ],
  },
  {
    title: "Game Development Masterclass with Unity & C#",
    description: "Create 2D and 3D games from scratch using the Unity game engine and C# programming language, including physics, UI, and animation.",
    instructorName: "Tanvir Hossain",
    price: 4200,
    category: "Game Development",
    tags: ["Unity", "C#", "Game Dev", "2D/3D", "Graphics"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-07-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Unity Editor & C# Scripting",
        lessons: [
          {
            title: "Lesson 1: MonoBehavior Lifecycle & Input Handling",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which method is called once per frame in Unity C# scripts?",
                options: ["Start()", "Update()", "Awake()", "Init()"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Enterprise Java & Spring Boot Development",
    description: "Master Java programming, Spring Framework, Spring Boot, Spring Security, JPA/Hibernate, and building RESTful enterprise microservices.",
    instructorName: "Golam Rabbani",
    price: 5000,
    category: "Backend Development",
    tags: ["Java", "Spring Boot", "Hibernate", "REST API", "Backend"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-07-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Spring Boot Fundamentals",
        lessons: [
          {
            title: "Lesson 1: Dependency Injection & Spring Beans",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Build a REST CRUD controller for employee management using Spring Boot.",
          },
        ],
      },
    ],
  },
  {
    title: "Data Structures and Algorithms (DSA) Bootcamp in C++ & Java",
    description: "Crack coding interviews at top tech companies by mastering arrays, linked lists, trees, graphs, dynamic programming, and algorithm optimization.",
    instructorName: "Jhankar Mahbub",
    price: 4500,
    category: "Computer Science",
    tags: ["DSA", "C++", "Java", "Algorithms", "Coding Interviews"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-08-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Time & Space Complexity",
        lessons: [
          {
            title: "Lesson 1: Big O Notation Explained",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "What is the time complexity of binary search?",
                options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
                correctIndex: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Product Management Fundamentals & Agile Methodologies",
    description: "Learn product lifecycle management, user persona creation, roadmap planning, backlog grooming, and Agile/Scrum delivery frameworks.",
    instructorName: "Sharmin Sultana",
    price: 3800,
    category: "Product Management",
    tags: ["Product Management", "Agile", "Scrum", "Roadmap", "Strategy"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-08-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Introduction to Agile & Scrum",
        lessons: [
          {
            title: "Lesson 1: Scrum Ceremonies & Product Backlog",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Create a product backlog with user stories for a food delivery app.",
          },
        ],
      },
    ],
  },
  {
    title: "Business Intelligence & Tableau Masterclass",
    description: "Transform raw data into impactful interactive dashboards, data visualizations, and business intelligence insights using Tableau and SQL.",
    instructorName: "Dr. Anisul Islam",
    price: 4000,
    category: "Data Science",
    tags: ["Tableau", "Business Intelligence", "SQL", "Data Visualization"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-09-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Tableau Desktop Basics",
        lessons: [
          {
            title: "Lesson 1: Connecting Data Sources & Building Charts",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which component in Tableau is used to filter displayed data across views?",
                options: ["Dimensions", "Filters Shelf", "Marks Card", "Data Pane"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Internet of Things (IoT) & Embedded Systems with Arduino",
    description: "Build hardware projects, sensors integration, microcontrollers programming with Arduino and ESP32, and cloud connectivity via MQTT.",
    instructorName: "Sumit Saha",
    price: 3600,
    category: "IoT & Hardware",
    tags: ["Arduino", "IoT", "Embedded Systems", "Hardware", "C++"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-09-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Arduino Microcontroller Basics",
        lessons: [
          {
            title: "Lesson 1: GPIO Pins, Digital Read & Write",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Build an automatic LED blinking circuit with a pushbutton switch.",
          },
        ],
      },
    ],
  },
  {
    title: "Financial Modeling & Corporate Valuation Analysis",
    description: "Master advanced Excel, financial statement analysis, discounted cash flow (DCF) modeling, and corporate valuation techniques for finance professionals.",
    instructorName: "Tanvir Ahmed",
    price: 5000,
    category: "Finance",
    tags: ["Financial Modeling", "Excel", "DCF", "Valuation", "Finance"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-10-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Advanced Excel for Finance",
        lessons: [
          {
            title: "Lesson 1: Financial Formulas & Dynamic Modeling",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "Which function is used to calculate the present value of an investment in Excel?",
                options: ["FV()", "PV()", "NPV()", "IRR()"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Graphic Design & Professional Video Editing Masterclass",
    description: "Learn Adobe Photoshop, Illustrator, Premiere Pro, and After Effects to create stunning social media graphics, branding, and motion graphics.",
    instructorName: "Fahim Rahman",
    price: 3500,
    category: "Design & Media",
    tags: ["Photoshop", "Illustrator", "Premiere Pro", "Video Editing", "Design"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-10-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Adobe Photoshop Essentials",
        lessons: [
          {
            title: "Lesson 1: Layers, Masks & Color Correction",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Design a promotional social media banner using custom layer masks.",
          },
        ],
      },
    ],
  },
  {
    title: "Software Quality Assurance (QA) & Automated Testing",
    description: "Learn manual testing concepts, bug tracking in Jira, API testing with Postman, and UI test automation using Selenium and Cypress.",
    instructorName: "Saiful Islam",
    price: 4000,
    category: "Quality Assurance",
    tags: ["QA", "Selenium", "Cypress", "Automation Testing", "Postman"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-11-01") },
    ],
    syllabus: [
      {
        title: "Module 1: Manual Testing & Test Case Design",
        lessons: [
          {
            title: "Lesson 1: Bug Life Cycle & Test Plan Creation",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quiz: [
              {
                question: "What is the primary objective of software testing?",
                options: ["To prove zero bugs", "To find defects and errors", "To speed up coding", "To write documentation"],
                correctIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Professional Content Writing & Copywriting Mastery",
    description: "Master persuasive copywriting formulas, SEO content writing, email marketing copy, blogging, and brand storytelling to drive conversions.",
    instructorName: "Sharmin Sultana",
    price: 2800,
    category: "Content Writing",
    tags: ["Copywriting", "Content Writing", "SEO", "Storytelling", "Marketing"],
    batches: [
      { name: "Batch 1 (2026)", startDate: new Date("2026-11-15") },
    ],
    syllabus: [
      {
        title: "Module 1: Fundamentals of Persuasive Copywriting",
        lessons: [
          {
            title: "Lesson 1: AIDA & PAS Copywriting Frameworks",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            assignmentPrompt: "Write a high-converting sales landing page copy using the AIDA framework.",
          },
        ],
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await QuizSubmission.deleteMany({});
    await AssignmentSubmission.deleteMany({});

    console.log("Seeding Users...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    const adminUser = await User.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@coursemaster.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    const student1 = await User.create({
      name: "Rahim Chowdhury",
      email: "student@coursemaster.com",
      passwordHash: studentPassword,
      role: "student",
    });

    const student2 = await User.create({
      name: "Tamim Hasan",
      email: "tamim@gmail.com",
      passwordHash: studentPassword,
      role: "student",
    });

    const student3 = await User.create({
      name: "Sumaiya Akter",
      email: "sumaiya@gmail.com",
      passwordHash: studentPassword,
      role: "student",
    });

    console.log("Seeding 20 Courses...");
    const createdCourses = await Course.insertMany(coursesData);

    console.log("Seeding Enrollments...");
    const course1 = createdCourses[0];
    const lesson1Id = course1.syllabus[0].lessons[0]._id;

    // 1. Original 3 Enrollments
    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      batchId: course1.batches[0]._id,
      progress: {
        completedLessons: [lesson1Id],
        percent: 25,
      },
    });

    await Enrollment.create({
      student: student1._id,
      course: createdCourses[1]._id,
      batchId: createdCourses[1].batches[0]._id,
      progress: {
        completedLessons: [],
        percent: 0,
      },
    });

    await Enrollment.create({
      student: student2._id,
      course: course1._id,
      batchId: course1.batches[0]._id,
      progress: {
        completedLessons: [lesson1Id],
        percent: 25,
      },
    });

    // 2. Added 6 New Enrollments
    await Enrollment.create({
      student: student2._id,
      course: createdCourses[2]._id,
      batchId: createdCourses[2].batches[0]._id,
      progress: { completedLessons: [], percent: 0 },
    });

    await Enrollment.create({
      student: student3._id,
      course: createdCourses[3]._id,
      batchId: createdCourses[3].batches[0]._id,
      progress: { completedLessons: [], percent: 0 },
    });

    await Enrollment.create({
      student: student3._id,
      course: createdCourses[4]._id,
      batchId: createdCourses[4].batches[0]._id,
      progress: { completedLessons: [], percent: 0 },
    });

    await Enrollment.create({
      student: student1._id,
      course: createdCourses[5]._id,
      batchId: createdCourses[5].batches[0]._id,
      progress: { completedLessons: [], percent: 0 },
    });

    await Enrollment.create({
      student: student2._id,
      course: createdCourses[6]._id,
      batchId: createdCourses[6].batches[0]._id,
      progress: { completedLessons: [], percent: 0 },
    });

    await Enrollment.create({
      student: student3._id,
      course: createdCourses[7]._id,
      batchId: createdCourses[7].batches[0]._id,
      progress: { completedLessons: [], percent: 0 },
    });

    console.log("Seeding Quiz & Assignment Submissions...");
    await QuizSubmission.create({
      student: student1._id,
      course: course1._id,
      lessonId: lesson1Id,
      answers: [1, 2],
      score: 2,
      total: 2,
      percent: 100,
    });

    const lesson2Id = course1.syllabus[0].lessons[1]._id;
    await AssignmentSubmission.create({
      student: student1._id,
      course: course1._id,
      lessonId: lesson2Id,
      answerType: "link",
      answer: "https://github.com/rahim/pricing-card-assignment",
      status: "reviewed",
      reviewer: adminUser._id,
      reviewNotes: "Great job! Responsive layout looks clean across mobile and desktop.",
      grade: 95,
    });

    console.log("Database Seeded Successfully! ✅");
    console.log("-----------------------------------------");
    console.log("Admin Account:");
    console.log(`Email: ${adminUser.email}`);
    console.log("Password: admin123");
    console.log("-----------------------------------------");
    console.log("Student Account:");
    console.log(`Email: ${student1.email}`);
    console.log("Password: student123");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();