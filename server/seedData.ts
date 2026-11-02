import bcrypt from 'bcryptjs';
import {
  User,
  StudentProfile,
  Track,
  Year,
  Category,
  Topic,
  Resource,
  StudentTopicProgress,
  StudentResourceProgress,
  Project,
  ActivityLog,
} from './types.ts';

const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const defaultTracks: Track[] = [
  {
    id: 'common',
    name: 'Common Foundation',
    code: 'CF',
    description: 'Core engineering programming, web fundamentals, version control, and Generative AI required for all students.',
  },
  {
    id: 'fullstack',
    name: 'Full-Stack & Application Development',
    code: 'FSAD',
    description: 'Modern backend frameworks (FastAPI, Django, Spring Boot, Node.js), frontend certification, MySQL & MongoDB databases, and Docker containerization.',
  },
  {
    id: 'ai',
    name: 'AI Engineering & Cloud',
    code: 'AIE',
    description: 'Generative AI Leader certification, LLM prompt engineering, and cloud AI infrastructure.',
  },
];

export const defaultYears: Year[] = [
  {
    id: 'year_1',
    name: '1st Year: Common Foundation',
    year_number: 1,
    description: 'Programming fundamentals (Python, Java, JS), Web Fundamentals, MERN Stack, Git/GitHub, Prompt Engineering, and API Design.',
  },
  {
    id: 'year_2',
    name: '2nd Year: Core Specialization Tracks',
    year_number: 2,
    description: 'Programming frameworks (FastAPI, Django, Spring Boot, Node/Express), full-stack certification, MySQL & MongoDB, and Docker.',
  },
  {
    id: 'year_3',
    name: '3rd Year: Advanced Capstone & Cloud Leadership',
    year_number: 3,
    description: 'Enterprise architecture, Google Cloud GenAI Leader certification, and production capstone portfolio development.',
  },
];

interface CuratedResourceDef {
  title: string;
  description: string;
  type: 'Documentation' | 'Video' | 'Article' | 'Course' | 'Interactive';
  url: string;
  duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CuratedTopicDef {
  id: string;
  category_id: string;
  year_id: 'year_1' | 'year_2' | 'year_3';
  track_id: 'common' | 'fullstack' | 'ai';
  title: string;
  slug: string;
  description: string;
  learning_objectives: string[];
  estimated_duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_required: boolean;
  is_published: boolean;
  order: number;
  suggested_project?: string;
  resources: CuratedResourceDef[];
}

export function generateSeedData() {
  const categories: Category[] = [
    // Year 1 Categories
    {
      id: 'cat-y1-prog-languages',
      year_id: 'year_1',
      track_id: 'common',
      name: 'Programming Languages',
      description: 'Foundational programming concepts across Python, Java, and JavaScript.',
      order: 1,
    },
    {
      id: 'cat-y1-web-development',
      year_id: 'year_1',
      track_id: 'common',
      name: 'Web Fundamentals & Development',
      description: 'Core HTML/CSS web foundations and full-stack MERN stack application development.',
      order: 2,
    },
    {
      id: 'cat-y1-tools-apis',
      year_id: 'year_1',
      track_id: 'common',
      name: 'Git & API Fundamentals',
      description: 'Professional version control with Git/GitHub and industry-standard REST API design.',
      order: 3,
    },
    {
      id: 'cat-y1-prompt-eng',
      year_id: 'year_1',
      track_id: 'common',
      name: 'Prompt Engineering & Generative AI',
      description: 'Techniques for prompt engineering, Google Generative AI Studio, and AI leadership.',
      order: 4,
    },

    // Year 2 Categories (Full-Stack & Application Development)
    {
      id: 'cat-y2-prog-frameworks',
      year_id: 'year_2',
      track_id: 'fullstack',
      name: 'Programming Frameworks',
      description: 'Production web frameworks: Python (FastAPI & Django), Java (Spring Boot), and JavaScript (Node.js & Express.js).',
      order: 1,
    },
    {
      id: 'cat-y2-frontend-dev',
      year_id: 'year_2',
      track_id: 'fullstack',
      name: 'Frontend Development',
      description: 'Modern full-stack developer certification covering comprehensive frontend and UI architecture.',
      order: 2,
    },
    {
      id: 'cat-y2-databases',
      year_id: 'year_2',
      track_id: 'fullstack',
      name: 'Database Management',
      description: 'Relational data structures with MySQL and document database CRUD operations with MongoDB.',
      order: 3,
    },
    {
      id: 'cat-y2-devops',
      year_id: 'year_2',
      track_id: 'fullstack',
      name: 'Docker & Containerization',
      description: 'Container lifecycle, Dockerfile authoring, multi-container stacks with Docker Compose, and networking.',
      order: 4,
    },

    // All Years / Year 3 Milestone
    {
      id: 'cat-genai-leadership',
      year_id: 'year_3',
      track_id: 'common',
      name: 'GenAI Leadership Certification',
      description: 'Google Cloud official Generative AI Leader learning path and cloud systems leadership.',
      order: 1,
    },
  ];

  const curatedTopicsList: CuratedTopicDef[] = [
    // ------------------- YEAR 1: COMMON FOUNDATION -------------------
    {
      id: 'top-001',
      category_id: 'cat-y1-prog-languages',
      year_id: 'year_1',
      track_id: 'common',
      title: 'Python Programming',
      slug: 'python-programming',
      description: 'Learn Python essentials from Cisco Networking Academy, covering syntax, data types, control flow, functions, lists, dicts, and algorithmic problem-solving.',
      learning_objectives: [
        'Master core Python syntax, variables, and primitive types',
        'Work with collections: lists, tuples, dictionaries, and sets',
        'Write modular functions and understand error handling in Python',
        'Complete Cisco NetAcad Python Essentials 1 modules and labs',
      ],
      estimated_duration_minutes: 180,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 1,
      resources: [
        {
          title: 'Cisco Networking Academy: Python Essentials 1',
          description: 'Official Cisco NetAcad training course covering foundational Python programming, variables, control flow, functions, and data collections.',
          type: 'Course',
          url: 'https://www.netacad.com/trainings/python-essentials-1?courseLang=en-US',
          duration_minutes: 180,
          difficulty: 'Beginner',
        },
      ],
    },
    {
      id: 'top-002',
      category_id: 'cat-y1-prog-languages',
      year_id: 'year_1',
      track_id: 'common',
      title: 'Java Programming',
      slug: 'java-programming',
      description: 'Comprehensive Java tutorial from W3Schools covering object-oriented programming (OOP), classes, methods, inheritance, polymorphism, arrays, and exception handling.',
      learning_objectives: [
        'Understand Java static typing, syntax, and JVM execution lifecycle',
        'Implement OOP principles: Encapsulation, Inheritance, and Polymorphism',
        'Handle exceptions with try-catch and manage Java collections',
        'Write clean, modular Java classes and methods',
      ],
      estimated_duration_minutes: 150,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 2,
      resources: [
        {
          title: 'W3Schools Java Tutorial & Reference',
          description: 'Comprehensive guide covering Java syntax, OOP concepts, methods, classes, and standard library data structures.',
          type: 'Documentation',
          url: 'https://www.w3schools.com/java/default.asp',
          duration_minutes: 150,
          difficulty: 'Beginner',
        },
      ],
    },
    {
      id: 'top-003',
      category_id: 'cat-y1-prog-languages',
      year_id: 'year_1',
      track_id: 'common',
      title: 'JavaScript Fundamentals',
      slug: 'javascript-fundamentals',
      description: 'Full JavaScript course by freeCodeCamp covering modern ES6+ syntax, functions, DOM manipulation, asynchronous JavaScript, promises, and event-driven programming.',
      learning_objectives: [
        'Understand let/const scoping, arrow functions, and destructuring',
        'Master array methods: map, filter, reduce, and forEach',
        'Grasp asynchronous JavaScript: Promises and async/await',
        'Manipulate the HTML DOM and handle browser events',
      ],
      estimated_duration_minutes: 200,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 3,
      suggested_project: 'An interactive, game-based project that helps learners practise JavaScript concepts through gameplay.',
      resources: [
        {
          title: 'freeCodeCamp: JavaScript Full Course (YouTube)',
          description: 'Comprehensive video course teaching modern JavaScript fundamentals from beginner to advanced concepts with real-world examples.',
          type: 'Video',
          url: 'https://youtu.be/PkZNo7MFNFg?si=qZSM8OaBOaSQE8TR',
          duration_minutes: 200,
          difficulty: 'Beginner',
        },
      ],
    },
    {
      id: 'top-004',
      category_id: 'cat-y1-web-development',
      year_id: 'year_1',
      track_id: 'common',
      title: 'Web Fundamentals (HTML & CSS)',
      slug: 'web-fundamentals',
      description: 'Core HTML & CSS web foundations by freeCodeCamp: responsive design, modern layout models (Flexbox & Grid), semantic HTML5, and accessibility.',
      learning_objectives: [
        'Structure web pages using semantic HTML5 tags and elements',
        'Master modern CSS: Flexbox and Grid layouts for responsive design',
        'Implement CSS media queries for desktop, tablet, and mobile views',
        'Understand accessibility standards and semantic web best practices',
      ],
      estimated_duration_minutes: 120,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'Build a responsive personal developer portfolio website.',
      resources: [
        {
          title: 'freeCodeCamp: Web Fundamentals - HTML & CSS (YouTube)',
          description: 'Full video walkthrough covering HTML5 markup, modern CSS styling, Flexbox, Grid, and responsive web development principles.',
          type: 'Video',
          url: 'https://youtu.be/zN8YNNHcaZc?si=Vube1DQPJqoyvnB-',
          duration_minutes: 120,
          difficulty: 'Beginner',
        },
      ],
    },
    {
      id: 'top-005',
      category_id: 'cat-y1-web-development',
      year_id: 'year_1',
      track_id: 'common',
      title: 'Web Development: MERN Stack',
      slug: 'web-development-mern',
      description: 'Full MERN Stack (MongoDB, Express.js, React, Node.js) tutorial building complete full-stack web applications with authentication, state management, and REST APIs.',
      learning_objectives: [
        'Understand the client-server architecture of MERN stack applications',
        'Build frontend components and handle application state with React',
        'Create backend REST APIs with Express.js and Node.js',
        'Store and query application data with MongoDB and Mongoose',
      ],
      estimated_duration_minutes: 240,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 2,
      suggested_project: 'Amazon-inspired e-commerce website clone with product listings, product details, shopping cart, and other essential e-commerce features.',
      resources: [
        {
          title: 'freeCodeCamp: Full-Stack MERN Course (YouTube)',
          description: 'Complete hands-on guide building a full-stack web application with MongoDB, Express, React, and Node.js.',
          type: 'Video',
          url: 'https://youtu.be/O3BUHwfHf84?si=R3Rt83RoGCyDYi8u',
          duration_minutes: 240,
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      id: 'top-006',
      category_id: 'cat-y1-tools-apis',
      year_id: 'year_1',
      track_id: 'common',
      title: 'Git and GitHub Version Control',
      slug: 'git-and-github',
      description: 'Introduction to Git and GitHub version control from Microsoft Learn: repositories, branching strategies, commit history, pull requests, and collaborative team workflows.',
      learning_objectives: [
        'Initialize local Git repositories and configure tracking',
        'Create feature branches and resolve merge conflicts',
        'Push code to GitHub and open pull requests for code review',
        'Utilize git log, diff, and stash for safe workspace management',
      ],
      estimated_duration_minutes: 90,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 1,
      resources: [
        {
          title: 'Microsoft Learn: Introduction to Git and GitHub',
          description: 'Interactive Microsoft training module covering Git version control basics, staging, commits, branches, and GitHub collaboration.',
          type: 'Interactive',
          url: 'https://learn.microsoft.com/en-us/training/modules/intro-to-git/',
          duration_minutes: 90,
          difficulty: 'Beginner',
        },
      ],
    },
    {
      id: 'top-007',
      category_id: 'cat-y1-tools-apis',
      year_id: 'year_1',
      track_id: 'common',
      title: 'API Fundamentals & Design',
      slug: 'api-fundamentals-design',
      description: 'API design principles from the Postman API Platform: REST architecture, request/response cycles, status codes, OpenAPI specs, endpoint modeling, and Postman testing.',
      learning_objectives: [
        'Understand RESTful architectural constraints and HTTP verbs (GET, POST, PUT, DELETE)',
        'Design clean, resource-oriented endpoint URLs and JSON envelopes',
        'Model status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found',
        'Test, document, and mock APIs using Postman workspace collections',
      ],
      estimated_duration_minutes: 100,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 2,
      suggested_project: 'Weather application that fetches and displays weather information using a weather API.',
      resources: [
        {
          title: 'Postman API Platform: API Design Guide & Standards',
          description: 'Official Postman resource on API design best practices, REST architecture, consistency, and OpenAPI documentation.',
          type: 'Documentation',
          url: 'https://www.postman.com/api-platform/api-design/',
          duration_minutes: 100,
          difficulty: 'Beginner',
        },
      ],
    },
    {
      id: 'top-008',
      category_id: 'cat-y1-prompt-eng',
      year_id: 'year_1',
      track_id: 'common',
      title: 'Prompt Engineering & Generative AI Studio',
      slug: 'prompt-engineering',
      description: 'Foundational prompt engineering techniques from Google Cloud and Simplilearn: zero-shot, few-shot prompting, system prompts, Generative AI Studio, and LLM tuning.',
      learning_objectives: [
        'Understand tokenization, temperature, top-k/top-p sampling parameters',
        'Craft robust zero-shot, few-shot, and chain-of-thought system prompts',
        'Utilize Google Cloud Generative AI Studio for model testing and prototyping',
        'Prevent hallucinations and design structured JSON outputs from LLMs',
      ],
      estimated_duration_minutes: 120,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'An interactive, 3D-visualized teaching platform that explains educational concepts through immersive visualizations and AI-assisted learning.',
      resources: [
        {
          title: 'Google Cloud: What is Prompt Engineering?',
          description: 'Official Google Cloud guide covering prompt design concepts, best practices, and enterprise Generative AI use cases.',
          type: 'Article',
          url: 'https://cloud.google.com/discover/what-is-prompt-engineering',
          duration_minutes: 45,
          difficulty: 'Beginner',
        },
        {
          title: 'Simplilearn: Free Generative AI Studio Course (SkillUp)',
          description: 'Comprehensive free video course on using Generative AI Studio, prompt tuning, and building LLM applications.',
          type: 'Course',
          url: 'https://www.simplilearn.com/free-generative-ai-studio-course-skillup',
          duration_minutes: 75,
          difficulty: 'Beginner',
        },
      ],
    },

    // ------------------- YEAR 2: FULL-STACK & APPLICATION DEV -------------------
    {
      id: 'top-009',
      category_id: 'cat-y2-prog-frameworks',
      year_id: 'year_2',
      track_id: 'fullstack',
      title: 'Python Frameworks: FastAPI and Django',
      slug: 'python-frameworks-fastapi-django',
      description: 'Build production web backends in Python: high-performance asynchronous REST APIs with FastAPI, and scalable web apps with Django ORM and admin.',
      learning_objectives: [
        'Build async REST APIs with FastAPI, Pydantic validation, and automated Swagger docs',
        'Implement authentication, dependency injection, and middleware in FastAPI',
        'Build full-featured web applications with Django, MVT architecture, and Django ORM',
        'Compare performance profiles and design trade-offs between FastAPI and Django',
      ],
      estimated_duration_minutes: 240,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'Hospital Management System built using FastAPI.',
      resources: [
        {
          title: 'FastAPI Full Course (YouTube)',
          description: 'Complete hands-on video tutorial on FastAPI: async routing, dependency injection, Pydantic schemas, and JWT auth.',
          type: 'Video',
          url: 'https://youtu.be/Lu8lXXlstvM?si=XMo-LMkjP-dKlvq9',
          duration_minutes: 120,
          difficulty: 'Intermediate',
        },
        {
          title: 'Django Full Course (YouTube)',
          description: 'Comprehensive video course covering Django web framework, ORM models, migrations, views, and template engine.',
          type: 'Video',
          url: 'https://youtu.be/iWS9ogMPOI0?si=6RP_WNW3JR1bCWFm',
          duration_minutes: 120,
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      id: 'top-010',
      category_id: 'cat-y2-prog-frameworks',
      year_id: 'year_2',
      track_id: 'fullstack',
      title: 'Java Framework: Spring Boot',
      slug: 'java-framework-spring-boot',
      description: 'Enterprise Java development with Spring Boot: dependency injection, Spring MVC REST controllers, JPA/Hibernate data access, and microservice configuration.',
      learning_objectives: [
        'Understand Spring Boot auto-configuration and Inversion of Control (IoC)',
        'Create REST controllers with @RestController, @GetMapping, and @PostMapping',
        'Manage database persistence using Spring Data JPA and Hibernate',
        'Implement validation, security filters, and exception handling',
      ],
      estimated_duration_minutes: 180,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 2,
      suggested_project: 'Hospital Management System built using Spring Boot.',
      resources: [
        {
          title: 'Spring Boot Official Getting Started Guide',
          description: 'Official Spring reference guide for bootstrapping production-ready enterprise applications with Spring Boot.',
          type: 'Documentation',
          url: 'https://spring.io/guides/gs/spring-boot/',
          duration_minutes: 180,
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      id: 'top-011',
      category_id: 'cat-y2-prog-frameworks',
      year_id: 'year_2',
      track_id: 'fullstack',
      title: 'JavaScript Frameworks: Node.js and Express.js',
      slug: 'javascript-frameworks-node-express',
      description: 'Backend JavaScript runtime with Node.js, Express middleware architecture, REST API design, JWT authentication, and asynchronous event loops.',
      learning_objectives: [
        'Master the Node.js event-driven, non-blocking I/O model and modules',
        'Structure Express.js web servers with modular routers and error middleware',
        'Implement stateless JWT token authentication and password hashing with bcrypt',
        'Connect Express services to database layers and manage environment configuration',
      ],
      estimated_duration_minutes: 180,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 3,
      suggested_project: 'Create an Express.js authentication service with role-based access control and token refresh.',
      resources: [
        {
          title: 'freeCodeCamp: Node.js and Express.js Full Course (YouTube)',
          description: 'In-depth tutorial building scalable backend services with Node.js and Express.js from scratch.',
          type: 'Video',
          url: 'https://youtu.be/O3BUHwfHf84?si=gT--O82IjbEVlsvn',
          duration_minutes: 180,
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      id: 'top-012',
      category_id: 'cat-y2-frontend-dev',
      year_id: 'year_2',
      track_id: 'fullstack',
      title: 'Frontend & Full-Stack Developer Certification',
      slug: 'frontend-fullstack-developer-certification',
      description: 'Comprehensive full-stack developer certification from freeCodeCamp covering modern frontend UI, responsive layouts, stateful components, and end-to-end integration.',
      learning_objectives: [
        'Build interactive single-page applications with modern component architecture',
        'Implement clean state management, props drilling mitigation, and custom hooks',
        'Integrate frontend applications seamlessly with backend REST and GraphQL APIs',
        'Complete certification projects meeting industry code quality and styling benchmarks',
      ],
      estimated_duration_minutes: 240,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'Complete the freeCodeCamp Full-Stack Developer project portfolio.',
      resources: [
        {
          title: 'freeCodeCamp: Full-Stack Developer Certification Curriculum',
          description: 'Official comprehensive freeCodeCamp curriculum and accredited certification program for full-stack software engineers.',
          type: 'Course',
          url: 'https://www.freecodecamp.org/learn/full-stack-developer-v9/?utm_source=chatgpt.com',
          duration_minutes: 240,
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      id: 'top-013',
      category_id: 'cat-y2-databases',
      year_id: 'year_2',
      track_id: 'fullstack',
      title: 'Database Management: MySQL & MongoDB',
      slug: 'database-management-mysql-mongodb',
      description: 'Relational vs. Document databases: schema modeling, SQL queries, indexing, and transactions in MySQL, plus document schema design and CRUD operations in MongoDB.',
      learning_objectives: [
        'Design normalized relational schemas and write complex SQL JOIN queries in MySQL',
        'Model document collections, embedded subdocuments, and references in MongoDB',
        'Execute CRUD operations, projection, filtering, and indexing in MongoDB',
        'Understand ACID transactions versus BASE consistency models',
      ],
      estimated_duration_minutes: 200,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'Session-managed note-taking application that supports creating, viewing, editing, and deleting notes, with appropriate session handling and database persistence.',
      resources: [
        {
          title: 'Coursera: Database Structures and Management with MySQL',
          description: 'University course covering relational database structures, SQL query optimization, indexes, and database administration with MySQL.',
          type: 'Course',
          url: 'https://www.coursera.org/learn/database-structures-and-management-with-mysql',
          duration_minutes: 100,
          difficulty: 'Intermediate',
        },
        {
          title: 'MongoDB University: CRUD Operations in MongoDB',
          description: 'Official MongoDB learning course on insert, find, update, and delete operations, aggregation pipelines, and schema modeling.',
          type: 'Course',
          url: 'https://learn.mongodb.com/courses/crud-operations-in-mongodb',
          duration_minutes: 100,
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      id: 'top-014',
      category_id: 'cat-y2-devops',
      year_id: 'year_2',
      track_id: 'fullstack',
      title: 'Docker & Containerization',
      slug: 'docker-and-containerization',
      description: 'Complete Docker tutorial for engineers: Dockerfiles, multi-stage builds, container lifecycle, Docker Compose for multi-container stacks, volumes, and networking.',
      learning_objectives: [
        'Understand containerization concepts versus virtual machines and the Docker daemon',
        'Write optimized, multi-stage Dockerfiles for Node.js, Python, and Java services',
        'Orchestrate multi-container environments (Frontend + Backend + DB) with Docker Compose',
        'Manage container persistence using Docker volumes and configure isolated bridge networks',
      ],
      estimated_duration_minutes: 150,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'Students must choose an existing application from the LMS or one of their own completed projects, containerize it using Docker, and submit the containerized application.',
      resources: [
        {
          title: 'freeCodeCamp: Docker Full Tutorial for Beginners (YouTube)',
          description: 'Complete video tutorial covering Docker fundamentals, container management, Dockerfile optimization, and Compose orchestration.',
          type: 'Video',
          url: 'https://youtu.be/exmSJpJvIPs?si=LnifgITcqftGEBPn',
          duration_minutes: 150,
          difficulty: 'Intermediate',
        },
      ],
    },

    // ------------------- ALL YEARS / CAPSTONE MILESTONE -------------------
    {
      id: 'top-015',
      category_id: 'cat-genai-leadership',
      year_id: 'year_3',
      track_id: 'common',
      title: 'Google Cloud Generative AI Leader Certification',
      slug: 'google-cloud-genai-leader-certification',
      description: 'Official Google Cloud Generative AI Leader learning path: foundational and strategic AI concepts, foundation models, enterprise AI deployment, and cloud AI architecture.',
      learning_objectives: [
        'Understand foundation models, multimodal AI, and large language model architectures',
        'Evaluate generative AI business use cases, feasibility, and ROI for organizations',
        'Apply Google Cloud responsible AI principles, data privacy, and ethical AI governance',
        'Earn the official Google Cloud Generative AI Leader learning badge and certification',
      ],
      estimated_duration_minutes: 180,
      difficulty: 'Intermediate',
      is_required: true,
      is_published: true,
      order: 1,
      suggested_project: 'Synthesize an enterprise generative AI adoption roadmap and architecture blueprint.',
      resources: [
        {
          title: 'Google Cloud Skills Boost: Generative AI Leader Learning Path',
          description: 'Official Google Cloud accredited curriculum and certification path for generative AI leadership, enterprise transformation, and model evaluation.',
          type: 'Course',
          url: 'https://www.skills.google/paths/1951',
          duration_minutes: 180,
          difficulty: 'Intermediate',
        },
      ],
    },
  ];

  const topics: Topic[] = [];
  const resources: Resource[] = [];
  let resCounter = 1;

  curatedTopicsList.forEach((t) => {
    topics.push({
      id: t.id,
      category_id: t.category_id,
      year_id: t.year_id,
      track_id: t.track_id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      learning_objectives: t.learning_objectives,
      estimated_duration_minutes: t.estimated_duration_minutes,
      difficulty: t.difficulty,
      is_required: t.is_required,
      is_published: t.is_published,
      order: t.order,
      suggested_project: t.suggested_project,
    });

    t.resources.forEach((r, idx) => {
      resources.push({
        id: `res-${resCounter.toString().padStart(3, '0')}`,
        topic_id: t.id,
        title: r.title,
        description: r.description,
        type: r.type,
        url: r.url,
        duration_minutes: r.duration_minutes,
        difficulty: r.difficulty,
        display_order: idx + 1,
        published: true,
        is_sample: false,
      });
      resCounter++;
    });
  });

  // Sample Users with Beacon branding
  const sampleUsers: User[] = [
    {
      id: 'usr-admin-1',
      email: 'beacon.atc@gmail.om',
      password_hash: hashPassword('test@beacon.com'),
      role: 'admin',
      full_name: 'Super Admin',
      created_at: '2026-08-01T08:00:00Z',
      status: 'active',
    },
    {
      id: 'usr-admin-2',
      email: 'beacon.atc@gmail.com',
      password_hash: hashPassword('test@beacon.com'),
      role: 'admin',
      full_name: 'Super Admin',
      created_at: '2026-08-01T08:00:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-1',
      email: 'alex.rivers@beacon.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Alex Rivers',
      created_at: '2026-08-15T09:30:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-2',
      email: 'priya.patel@beacon.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Priya Patel',
      created_at: '2026-08-16T10:15:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-3',
      email: 'marcus.vance@beacon.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Marcus Vance',
      created_at: '2026-08-16T11:45:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-4',
      email: 'elena.rostova@beacon.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Elena Rostova',
      created_at: '2026-08-10T08:00:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-5',
      email: 'devon.lane@beacon.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Devon Lane',
      created_at: '2026-08-18T14:20:00Z',
      status: 'active',
    },
  ];

  // Sample Student Profiles
  const sampleProfiles: StudentProfile[] = [
    {
      id: 'prof-student-1',
      user_id: 'usr-student-1',
      roll_number: 'ENG2026-0142',
      college: 'Beacon Institute of Technology',
      department: 'Computer Science & Engineering',
      current_year: 'year_1',
      track_id: 'common',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/alexrivers-dev',
      created_at: '2026-08-15T09:30:00Z',
      last_active_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: 'prof-student-2',
      user_id: 'usr-student-2',
      roll_number: 'ENG2025-0089',
      college: 'Beacon Institute of Technology',
      department: 'Information Technology',
      current_year: 'year_2',
      track_id: 'fullstack',
      profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/priyapatel-code',
      created_at: '2026-08-16T10:15:00Z',
      last_active_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
      id: 'prof-student-3',
      user_id: 'usr-student-3',
      roll_number: 'ENG2025-0215',
      college: 'Beacon Institute of Technology',
      department: 'AI & Data Science',
      current_year: 'year_2',
      track_id: 'ai',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/marcusvance-ai',
      created_at: '2026-08-16T11:45:00Z',
      last_active_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    },
    {
      id: 'prof-student-4',
      user_id: 'usr-student-4',
      roll_number: 'ENG2024-0033',
      college: 'Beacon Institute of Technology',
      department: 'Software Engineering',
      current_year: 'year_3',
      track_id: 'fullstack',
      profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/elenarostova-eng',
      created_at: '2026-08-10T08:00:00Z',
      last_active_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: 'prof-student-5',
      user_id: 'usr-student-5',
      roll_number: 'ENG2025-0371',
      college: 'Beacon Institute of Technology',
      department: 'Computer Engineering',
      current_year: 'year_2',
      track_id: 'fullstack',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/devonlane',
      created_at: '2026-08-18T14:20:00Z',
      last_active_at: new Date(Date.now() - 25 * 86400 * 1000).toISOString(),
    },
  ];

  // Seed progress
  const topicProgress: StudentTopicProgress[] = [];
  const resourceProgress: StudentResourceProgress[] = [];
  const projects: Project[] = [];
  const activityLogs: ActivityLog[] = [];

  const markTopic = (
    studentId: string,
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    daysAgo = 2
  ) => {
    const timestamp = new Date(Date.now() - daysAgo * 86400 * 1000).toISOString();
    topicProgress.push({
      id: `prog-${studentId}-${topicId}`,
      student_id: studentId,
      topic_id: topicId,
      status,
      started_at: status !== 'not_started' ? timestamp : undefined,
      completed_at: status === 'completed' ? timestamp : undefined,
      updated_at: timestamp,
    });

    const topicRes = resources.filter((r) => r.topic_id === topicId);
    topicRes.forEach((res) => {
      const resStatus = status === 'completed' ? 'completed' : status === 'in_progress' ? 'in_progress' : 'not_started';
      resourceProgress.push({
        id: `rprog-${studentId}-${res.id}`,
        student_id: studentId,
        resource_id: res.id,
        status: resStatus,
        completed_at: resStatus === 'completed' ? timestamp : undefined,
        updated_at: timestamp,
      });
    });
  };

  // Student 1 (Alex Rivers - Year 1)
  markTopic('prof-student-1', 'top-001', 'completed', 10);
  markTopic('prof-student-1', 'top-002', 'completed', 7);
  markTopic('prof-student-1', 'top-003', 'completed', 4);
  markTopic('prof-student-1', 'top-004', 'in_progress', 1);
  markTopic('prof-student-1', 'top-005', 'not_started', 0);
  markTopic('prof-student-1', 'top-006', 'completed', 8);
  markTopic('prof-student-1', 'top-007', 'not_started', 0);
  markTopic('prof-student-1', 'top-008', 'in_progress', 2);
  markTopic('prof-student-1', 'top-015', 'not_started', 0);

  // Student 2 (Priya Patel - Year 2 Full-Stack)
  markTopic('prof-student-2', 'top-001', 'completed', 60);
  markTopic('prof-student-2', 'top-002', 'completed', 55);
  markTopic('prof-student-2', 'top-003', 'completed', 50);
  markTopic('prof-student-2', 'top-004', 'completed', 45);
  markTopic('prof-student-2', 'top-005', 'completed', 40);
  markTopic('prof-student-2', 'top-006', 'completed', 35);
  markTopic('prof-student-2', 'top-007', 'completed', 30);
  markTopic('prof-student-2', 'top-008', 'completed', 25);
  markTopic('prof-student-2', 'top-009', 'completed', 12);
  markTopic('prof-student-2', 'top-010', 'in_progress', 5);
  markTopic('prof-student-2', 'top-011', 'completed', 8);
  markTopic('prof-student-2', 'top-012', 'in_progress', 2);
  markTopic('prof-student-2', 'top-013', 'completed', 6);
  markTopic('prof-student-2', 'top-014', 'completed', 3);
  markTopic('prof-student-2', 'top-015', 'in_progress', 1);

  // Student 3 (Marcus Vance - Year 2 AI)
  markTopic('prof-student-3', 'top-001', 'completed', 50);
  markTopic('prof-student-3', 'top-003', 'completed', 40);
  markTopic('prof-student-3', 'top-006', 'completed', 30);
  markTopic('prof-student-3', 'top-007', 'completed', 20);
  markTopic('prof-student-3', 'top-008', 'completed', 10);
  markTopic('prof-student-3', 'top-015', 'completed', 3);

  // Student 4 (Elena Rostova - Year 3)
  topics.forEach((t) => markTopic('prof-student-4', t.id, 'completed', 15));

  // Projects
  projects.push({
    id: 'proj-001',
    student_id: 'prof-student-2',
    topic_id: 'top-009',
    title: 'FastAPI Microservice Task Manager',
    problem_statement: 'Engineering students needed an async API service with JWT authentication and OpenAPI specs.',
    tech_stack: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Pydantic'],
    github_url: 'https://github.com/priyapatel-code/fastapi-task-manager',
    deployment_url: 'https://fastapi-task.priyapatel.dev',
    description: 'A high-throughput async REST API service built with FastAPI and PostgreSQL, featuring JWT authentication and Docker deployment.',
    completion_notes: 'Implemented comprehensive unit and integration tests with 95% coverage.',
    status: 'approved',
    created_at: '2026-09-10T10:00:00Z',
    submitted_at: '2026-09-12T14:20:00Z',
    reviewed_at: '2026-09-14T09:15:00Z',
    reviewer_id: 'usr-admin-1',
    reviewer_feedback: 'Outstanding API architecture! Schema validation and exception envelopes are clean and robust. Approved.',
    history: [
      { date: '2026-09-10T10:00:00Z', action: 'Created Draft', status: 'draft', by: 'Priya Patel' },
      { date: '2026-09-12T14:20:00Z', action: 'Submitted for Review', status: 'submitted', by: 'Priya Patel' },
      { date: '2026-09-14T09:15:00Z', action: 'Approved by Mentor', status: 'approved', notes: 'Clean architecture and test coverage.', by: 'Dr. Sarah Chen' },
    ],
  });

  projects.push({
    id: 'proj-002',
    student_id: 'prof-student-1',
    topic_id: 'top-005',
    title: 'MERN Stack Community Learning Portal',
    problem_statement: 'Need an interactive full-stack learning portal with React and Express.',
    tech_stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    github_url: 'https://github.com/alexrivers-dev/mern-portal',
    deployment_url: 'https://portal.alexrivers.dev',
    description: 'Full-stack MERN portal with user authentication, course milestone tracking, and responsive UI.',
    completion_notes: 'Created reusable React components and connected to MongoDB via Express.',
    status: 'under_review',
    created_at: '2026-10-18T11:00:00Z',
    submitted_at: '2026-10-21T16:40:00Z',
    history: [
      { date: '2026-10-18T11:00:00Z', action: 'Created Draft', status: 'draft', by: 'Alex Rivers' },
      { date: '2026-10-21T16:40:00Z', action: 'Submitted for Review', status: 'submitted', by: 'Alex Rivers' },
    ],
  });

  // Activity logs
  activityLogs.push(
    {
      id: 'act-001',
      student_id: 'prof-student-2',
      type: 'project_reviewed',
      description: 'Project "FastAPI Microservice Task Manager" was approved by Dr. Sarah Chen.',
      timestamp: '2026-09-14T09:15:00Z',
    },
    {
      id: 'act-002',
      student_id: 'prof-student-1',
      type: 'topic_status',
      description: 'Marked topic "Git and GitHub Version Control" as completed.',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'act-003',
      student_id: 'prof-student-2',
      type: 'topic_status',
      description: 'Completed topic "Docker & Containerization".',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    }
  );

  return {
    tracks: defaultTracks,
    years: defaultYears,
    categories,
    topics,
    resources,
    users: sampleUsers,
    profiles: sampleProfiles,
    topicProgress,
    resourceProgress,
    projects,
    activityLogs,
  };
}
