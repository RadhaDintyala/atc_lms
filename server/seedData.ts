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
    description: 'Core engineering programming, web, version control, and development fundamentals required for all students.',
  },
  {
    id: 'fullstack',
    name: 'Full-Stack & Application Development',
    code: 'FSAD',
    description: 'Modern web architectures, distributed systems, REST/GraphQL APIs, relational & NoSQL databases, mobile apps, and DevOps.',
  },
  {
    id: 'ai',
    name: 'AI Engineering',
    code: 'AIE',
    description: 'LLM application systems, embeddings, vector search, RAG pipelines, autonomous agents, prompt engineering, and cloud AI infrastructure.',
  },
];

export const defaultYears: Year[] = [
  {
    id: 'year_1',
    name: '1st Year: Common Foundation',
    year_number: 1,
    description: 'Fundamental programming paradigms, web basics, Git workflows, prompt engineering, and project workflows.',
  },
  {
    id: 'year_2',
    name: '2nd Year: Core Specialization Tracks',
    year_number: 2,
    description: 'Specialization in either Full-Stack & Application Development or AI Engineering.',
  },
  {
    id: 'year_3',
    name: '3rd Year: Advanced Project Development',
    year_number: 3,
    description: 'Enterprise architecture, production systems, security, latency optimization, and portfolio capstone development.',
  },
];

// Helper to generate slug
const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Raw curriculum definition
interface RawCat {
  id: string;
  year_id: string;
  track_id: string;
  name: string;
  desc: string;
  topics: Array<{
    title: string;
    desc: string;
    duration: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    objectives: string[];
    suggested_project?: string;
  }>;
}

const rawCategories: RawCat[] = [
  // --- YEAR 1: COMMON FOUNDATION ---
  {
    id: 'cat-y1-prog-fund',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Programming Fundamentals',
    desc: 'Core languages, control flow, object-oriented concepts, and robust error handling.',
    topics: [
      {
        title: 'Python Fundamentals',
        desc: 'Variables, dynamic typing, built-in collections, functions, and standard library.',
        duration: 120,
        difficulty: 'Beginner',
        objectives: ['Understand Python syntax and basic data types', 'Work with lists, dicts, and sets', 'Define modular functions with type hints'],
        suggested_project: 'Build a CLI expense manager with file persistence.',
      },
      {
        title: 'Java Fundamentals',
        desc: 'Static typing, JVM architecture, classes, interfaces, and compiled lifecycle.',
        duration: 150,
        difficulty: 'Beginner',
        objectives: ['Master Java class syntax and packages', 'Compile and execute via javac and java', 'Understand memory models (stack vs heap)'],
        suggested_project: 'Create a banking simulation with Account classes and exception guards.',
      },
      {
        title: 'JavaScript Fundamentals',
        desc: 'V8 runtime, event loop, hoisting, closures, and modern ES6+ features.',
        duration: 120,
        difficulty: 'Beginner',
        objectives: ['Understand let/const vs var scope', 'Master arrow functions and array iterators', 'Grasp asynchronous promises and async/await'],
        suggested_project: 'Develop an interactive countdown & timer utility.',
      },
      {
        title: 'Variables, Data Types, Functions, and Control Flow',
        desc: 'Conditionals, loops, recursion, lexical scope, and pure functions.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Implement robust flow control with switch/case and loops', 'Write deterministic pure functions', 'Understand pass-by-value vs pass-by-reference'],
      },
      {
        title: 'Data Structures and OOP Basics',
        desc: 'Classes, encapsulation, inheritance, polymorphism, stacks, queues, and linked lists.',
        duration: 180,
        difficulty: 'Intermediate',
        objectives: ['Design object models following SOLID principles', 'Implement custom stacks and queues', 'Compare time and space complexities'],
        suggested_project: 'Implement an in-memory inventory management system.',
      },
      {
        title: 'Exception Handling and File Handling',
        desc: 'Try-catch blocks, custom error classes, streams, and file I/O operations.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Handle unhandled exceptions gracefully', 'Read and write binary and text files', 'Manage resource closing with context managers / try-with-resources'],
      },
    ],
  },
  {
    id: 'cat-y1-web-fund',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Web Fundamentals',
    desc: 'Foundational protocols, network layers, and client-server communication paradigms.',
    topics: [
      {
        title: 'Client-Server Architecture',
        desc: 'Roles of client, server, request-response cycle, and statelessness.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Map out HTTP client-server interactions', 'Distinguish monolithic vs distributed architectures', 'Understand CDN edge caching'],
      },
      {
        title: 'HTTP and HTTPS',
        desc: 'Protocol verbs, headers, status codes, SSL/TLS handshake, and encryption.',
        duration: 100,
        difficulty: 'Beginner',
        objectives: ['Inspect HTTP headers in browser DevTools', 'Understand TLS certificates and symmetric vs asymmetric encryption', 'Trace status code taxonomy (2xx, 3xx, 4xx, 5xx)'],
      },
      {
        title: 'DNS, IP Addresses, Ports, TCP and UDP',
        desc: 'Domain resolution, socket connections, packet loss, and transport layer protocols.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Trace DNS lookup hierarchical records (A, CNAME, MX)', 'Understand IPv4 vs IPv6 and port bindings', 'Compare reliability of TCP vs UDP streaming'],
      },
      {
        title: 'URLs, Requests, and Responses',
        desc: 'URL anatomy, query parameters, path variables, and payload serialization.',
        duration: 60,
        difficulty: 'Beginner',
        objectives: ['Deconstruct URI components', 'Format URI encoded parameters', 'Parse incoming request bodies'],
      },
    ],
  },
  {
    id: 'cat-y1-web-dev',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Web Development',
    desc: 'HTML5 semantic markup, CSS3 styling systems, and client-side DOM scripting.',
    topics: [
      {
        title: 'HTML Semantic Markup',
        desc: 'Semantic tags, accessibility standards (a11y), and SEO metadata.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Structure accessible documents using header, main, nav, section', 'Ensure proper ARIA attributes', 'Embed rich media safely'],
      },
      {
        title: 'CSS Styling and Box Model',
        desc: 'Box sizing, specificity, cascading rules, flexbox, and grid layouts.',
        duration: 120,
        difficulty: 'Beginner',
        objectives: ['Master CSS Flexbox alignment', 'Create dynamic 2D grids', 'Understand margin collapse and box-sizing'],
      },
      {
        title: 'JavaScript DOM Manipulation',
        desc: 'Query selectors, event listeners, bubbling, delegation, and dynamic element creation.',
        duration: 120,
        difficulty: 'Beginner',
        objectives: ['Manipulate DOM tree elements safely', 'Use event delegation for performance', 'Prevent cross-site scripting (XSS) in DOM injection'],
        suggested_project: 'Interactive Kanban board using vanilla DOM operations.',
      },
      {
        title: 'Responsive Design and Media Queries',
        desc: 'Mobile-first workflows, viewport units, breakpoints, and fluid typography.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Implement mobile-first responsive breakpoints', 'Use clamp() and fluid units', 'Test layouts across simulated viewports'],
      },
    ],
  },
  {
    id: 'cat-y1-git',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Git and GitHub',
    desc: 'Version control mechanisms, distributed collaboration, and branching strategies.',
    topics: [
      {
        title: 'Repositories and Commits',
        desc: 'Git init, staging area, commit graphs, and atomic commit practices.',
        duration: 75,
        difficulty: 'Beginner',
        objectives: ['Initialize local repositories and configure gitconfig', 'Stage and commit with conventional commit messages', 'Inspect log history and diffs'],
      },
      {
        title: 'Branches and Merges',
        desc: 'Branch isolation, fast-forward merges, merge conflicts, and rebasing.',
        duration: 90,
        difficulty: 'Intermediate',
        objectives: ['Create feature branches and switch contexts', 'Resolve multi-file merge conflicts cleanly', 'Understand git rebase vs merge'],
      },
      {
        title: 'Pull Requests and Collaboration',
        desc: 'Remote tracking, forks, pull request reviews, and markdown issue tracking.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Fork and clone upstream repositories', 'Open comprehensive PRs with templates', 'Conduct peer code reviews with inline suggestions'],
        suggested_project: 'Submit an open-source contribution or team repository PR.',
      },
    ],
  },
  {
    id: 'cat-y1-tools',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Development Tools',
    desc: 'Essential developer productivity toolchain, terminals, linters, and package managers.',
    topics: [
      {
        title: 'IDE Setup and Extensions',
        desc: 'Configuring VS Code, JetBrains, syntax highlighting, keybindings, and extensions.',
        duration: 60,
        difficulty: 'Beginner',
        objectives: ['Set up a configured development environment', 'Install productivity and formatting extensions', 'Configure automated format-on-save'],
      },
      {
        title: 'Terminal and Shell Basics',
        desc: 'Bash/Zsh command line navigation, piping, grep, file permissions, and environment variables.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Navigate directories, create, edit, and move files via CLI', 'Chain commands with pipes and redirects', 'Inspect and set process environment variables'],
      },
      {
        title: 'Debugging Techniques',
        desc: 'Breakpoints, call stack analysis, watch expressions, and browser developer tools.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Set conditional breakpoints', 'Inspect scope variables and stack frames', 'Analyze console logs and memory dumps'],
      },
      {
        title: 'Package Managers (npm, pip, maven)',
        desc: 'Dependency resolution, lockfiles, version semantics (SemVer), and scripts.',
        duration: 80,
        difficulty: 'Beginner',
        objectives: ['Manage external packages safely', 'Understand package-lock.json and requirements.txt pinning', 'Run automated project scripts'],
      },
    ],
  },
  {
    id: 'cat-y1-prompt-eng',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Prompt Engineering',
    desc: 'Foundational techniques for interacting with generative AI models accurately and safely.',
    topics: [
      {
        title: 'Writing Clear Instructions and System Prompts',
        desc: 'Role assignment, context anchoring, delimiter usage, and explicit task scopes.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Draft deterministic system prompts', 'Use delimiters to separate instructions and user data', 'Eliminate ambiguity in complex prompts'],
      },
      {
        title: 'Providing Context and Constraints',
        desc: 'Negative constraints, tone regulation, knowledge boundaries, and token limits.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Establish strict output constraints', 'Define fallback behavior when answers are unknown', 'Manage token budget effectively'],
      },
      {
        title: 'Few-Shot Examples and In-Context Learning',
        desc: 'Structuring input-output exemplar pairs to steer complex reasoning and formatting.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Construct diverse few-shot prompt patterns', 'Handle edge case exemplars', 'Improve schema consistency via examples'],
      },
      {
        title: 'Output Validation and Verification',
        desc: 'JSON schemas, hallucination detection, unit tests for LLM outputs, and verification loops.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Enforce structured JSON output schemas', 'Validate model outputs with programmatic assertion tests', 'Design self-correcting validation loops'],
        suggested_project: 'Build a prompt-engineered code reviewer that outputs structured JSON defect reports.',
      },
    ],
  },
  {
    id: 'cat-y1-api-fund',
    year_id: 'year_1',
    track_id: 'common',
    name: 'API Fundamentals',
    desc: 'Network data interchange, JSON schemas, REST design principles, and client requests.',
    topics: [
      {
        title: 'REST Architecture Concepts',
        desc: 'Statelessness, resource-oriented endpoints, idempotency, and HATEOAS.',
        duration: 80,
        difficulty: 'Beginner',
        objectives: ['Identify REST architectural constraints', 'Design canonical URI hierarchies (/items/:id)', 'Understand safe vs idempotent methods'],
      },
      {
        title: 'JSON Data Interchange Format',
        desc: 'Serialization, deserialization, data types, nested objects, and schema validation.',
        duration: 60,
        difficulty: 'Beginner',
        objectives: ['Construct valid JSON documents', 'Parse and stringify JSON safely in code', 'Handle serialization edge cases (dates, bigints)'],
      },
      {
        title: 'HTTP Methods and Status Codes',
        desc: 'GET, POST, PUT, PATCH, DELETE and standard status responses (200, 201, 400, 401, 403, 404, 500).',
        duration: 75,
        difficulty: 'Beginner',
        objectives: ['Match HTTP verb to database CRUD operation', 'Choose semantic status codes for error states', 'Implement idempotency headers'],
      },
      {
        title: 'Making API Requests with Fetch and cURL',
        desc: 'Async fetch requests, headers, bearer tokens, request bodies, and error catching.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Execute command-line cURL queries with headers', 'Handle Promise-based fetch responses with error checking', 'Parse streaming and JSON responses'],
        suggested_project: 'Weather forecast widget consuming a public REST API.',
      },
    ],
  },
  {
    id: 'cat-y1-project-workflow',
    year_id: 'year_1',
    track_id: 'common',
    name: 'Project Workflow',
    desc: 'End-to-end engineering lifecycle from problem statement to documentation and demo.',
    topics: [
      {
        title: 'Problem Statements and Scope Definition',
        desc: 'Requirements gathering, user stories, boundary definition, and MVP scoping.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Formulate clear engineering problem statements', 'Author user stories with acceptance criteria', 'Prioritize features via MoSCoW method'],
      },
      {
        title: 'Project Planning and Milestones',
        desc: 'Task breakdown, estimation, Kanban boards, and sprint pacing.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Break complex deliverables into 1-2 day tasks', 'Maintain active GitHub project boards', 'Track burndown and milestone delivery'],
      },
      {
        title: 'README Documentation and Architecture Diagrams',
        desc: 'Writing clear READMEs, setup steps, architectural diagrams, and license files.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Write comprehensive README.md with quickstart guide', 'Diagram component architecture with Mermaid.js', 'Document environment variables and prerequisites'],
      },
      {
        title: 'Testing and Project Demonstrations',
        desc: 'Manual verification plans, automated smoke tests, live demos, and video walkthroughs.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Execute systematic manual test suites', 'Prepare a 3-minute technical pitch and demo', 'Record and host an unlisted project demo walkthrough'],
        suggested_project: 'Capstone 1st Year Portfolio Project with live GitHub repository, demo link, and documentation.',
      },
    ],
  },

  // --- YEAR 2: TRACK 1 — FULL-STACK & APPLICATION DEVELOPMENT ---
  {
    id: 'cat-y2-fs-frameworks',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Programming Frameworks',
    desc: 'Modern backend server frameworks across Python, Java, and JavaScript.',
    topics: [
      {
        title: 'Python: FastAPI and Django',
        desc: 'Pydantic schemas, dependency injection, async routes, and Django ORM/Admin.',
        duration: 180,
        difficulty: 'Intermediate',
        objectives: ['Build high-throughput async endpoints in FastAPI', 'Define Pydantic request models with automatic OpenAPI generation', 'Compare Django monolithic features with FastAPI microservice design'],
        suggested_project: 'Develop a RESTful product catalog service in FastAPI with automatic Swagger docs.',
      },
      {
        title: 'Java: Spring Boot',
        desc: 'Spring IoC, dependency injection, Spring MVC controllers, and Spring Data JPA.',
        duration: 200,
        difficulty: 'Intermediate',
        objectives: ['Configure Spring Boot starters and annotations', 'Expose REST controllers with @RestController', 'Implement entity repositories via JpaRepository'],
      },
      {
        title: 'JavaScript: Node.js and Express.js',
        desc: 'Event-driven I/O, middleware pipelines, error handlers, and route controllers.',
        duration: 150,
        difficulty: 'Intermediate',
        objectives: ['Build Express middleware for authentication and logging', 'Organize scalable MVC project structures', 'Handle uncaught exceptions and graceful shutdowns'],
      },
    ],
  },
  {
    id: 'cat-y2-fs-frontend',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Frontend Development',
    desc: 'Component architectures, declarative UI, reactivity, and type-safe frontend systems.',
    topics: [
      {
        title: 'React Core Architecture',
        desc: 'Virtual DOM, reconciliation, JSX compilation, and unidirectional data flow.',
        duration: 150,
        difficulty: 'Beginner',
        objectives: ['Understand JSX transpilation and Virtual DOM diffing', 'Structure reusable component hierarchies', 'Implement conditional rendering and key props'],
      },
      {
        title: 'Components, Props, and Lifecycle Hooks',
        desc: 'useState, useEffect, useMemo, useCallback, useRef, and custom hooks.',
        duration: 180,
        difficulty: 'Intermediate',
        objectives: ['Manage local state with useState and useReducer', 'Synchronize effects with external APIs via useEffect', 'Author custom reusable React hooks'],
      },
      {
        title: 'State Management and Context API',
        desc: 'Global state architectures, React Context, Zustand/Redux Toolkit, and immutable updates.',
        duration: 160,
        difficulty: 'Intermediate',
        objectives: ['Avoid prop drilling using React Context', 'Design global stores with Zustand or Redux', 'Optimize component renders with selector patterns'],
        suggested_project: 'Build an e-commerce shopping cart with global state and local storage persistence.',
      },
      {
        title: 'TypeScript Fundamentals for Frontend',
        desc: 'Static typing in React, interfaces, generics, union types, and prop typing.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Type React component props, event handlers, and refs', 'Use generics for reusable API response utilities', 'Prevent runtime null/undefined bugs'],
      },
    ],
  },
  {
    id: 'cat-y2-fs-mobile',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Mobile App Development',
    desc: 'Cross-platform native mobile application frameworks.',
    topics: [
      {
        title: 'Flutter and Dart Fundamentals',
        desc: 'Dart type system, Flutter widget tree, Stateless vs Stateful, and Hot Reload.',
        duration: 180,
        difficulty: 'Intermediate',
        objectives: ['Master Dart OOP syntax and asynchronous Futures', 'Build responsive mobile UI using Material and Cupertino widgets', 'Manage mobile state via Provider or Riverpod'],
        suggested_project: 'Build a cross-platform mobile fitness log in Flutter.',
      },
      {
        title: 'React Native Fundamentals',
        desc: 'Native bridge, JSX in mobile, Expo ecosystem, navigation, and mobile gestures.',
        duration: 180,
        difficulty: 'Intermediate',
        objectives: ['Configure an Expo React Native workspace', 'Use React Navigation for stack and tab routing', 'Access native device APIs (camera, geolocation)'],
      },
    ],
  },
  {
    id: 'cat-y2-fs-databases',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Database Management',
    desc: 'Relational and document storage, schema modeling, ACID transactions, and indexing.',
    topics: [
      {
        title: 'SQL Fundamentals and Queries',
        desc: 'SELECT, INSERT, UPDATE, DELETE, GROUP BY, aggregations, and subqueries.',
        duration: 120,
        difficulty: 'Beginner',
        objectives: ['Write multi-table aggregate SQL queries', 'Apply WHERE and HAVING filter clauses', 'Perform nested subqueries and CTEs'],
      },
      {
        title: 'PostgreSQL or MySQL Relational Engines',
        desc: 'Engine internals, data types, sequences, foreign keys, and constraints.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Design relational tables with primary and foreign key constraints', 'Enforce check constraints and default values', 'Inspect query plans using EXPLAIN ANALYZE'],
      },
      {
        title: 'MongoDB and NoSQL Concepts',
        desc: 'Document storage, BSON, indexing, embedded vs referenced schemas, and aggregations.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Model unstructured and polymorphic document structures', 'Execute MongoDB aggregation pipelines', 'Evaluate tradeoffs between ACID and BASE models'],
      },
      {
        title: 'Database Schema Design and Normalization',
        desc: '1NF, 2NF, 3NF, ER diagrams, foreign key integrity, and denormalization trade-offs.',
        duration: 150,
        difficulty: 'Intermediate',
        objectives: ['Convert complex business rules into normalized ER diagrams', 'Eliminate update and delete anomalies through 3NF', 'Strategically denormalize for read-heavy workloads'],
      },
      {
        title: 'Joins, Indexes, and ACID Transactions',
        desc: 'B-tree indexes, composite indexes, inner/outer joins, and transaction isolation levels.',
        duration: 160,
        difficulty: 'Advanced',
        objectives: ['Optimize slow queries with appropriate B-Tree and GIN indexes', 'Execute multi-statement transactions with COMMIT/ROLLBACK', 'Prevent dirty reads and race conditions with isolation levels'],
        suggested_project: 'Design and benchmark a normalized order-processing schema with transaction rollback safety.',
      },
    ],
  },
  {
    id: 'cat-y2-fs-api-eng',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'API Engineering',
    desc: 'Robust API contract design, serialization, token auth, and documentation.',
    topics: [
      {
        title: 'REST API Development and Best Practices',
        desc: 'Resource naming, versioning (/v1), pagination, filtering, and hypermedia.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Design clean, versioned REST endpoints', 'Implement cursor-based and offset-based pagination', 'Standardize JSON error response envelopes'],
      },
      {
        title: 'Request Validation and Sanitization',
        desc: 'Input validation (Zod, Pydantic, Joi), schema enforcement, and sanitization.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Validate incoming request bodies, query params, and headers', 'Prevent injection attacks via strict type coercions', 'Return user-friendly 422 validation error messages'],
      },
      {
        title: 'Authentication and Authorization (JWT & Sessions)',
        desc: 'Access tokens, refresh token rotation, bcrypt/argon2 hashing, and RBAC middleware.',
        duration: 180,
        difficulty: 'Intermediate',
        objectives: ['Issue signed JWT tokens with claims and expiration', 'Implement secure HTTP-only cookies and refresh token rotation', 'Enforce role-based access control (RBAC) across endpoints'],
        suggested_project: 'Implement a secure multi-role auth service with JWT and refresh token rotation.',
      },
      {
        title: 'API Documentation with OpenAPI and Swagger',
        desc: 'OpenAPI 3.0 specs, automated interactive documentation, and Postman collections.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Generate interactive Swagger UI from backend models', 'Document status codes, schemas, and security schemes', 'Export OpenAPI JSON specs for client SDK generation'],
      },
    ],
  },
  {
    id: 'cat-y2-fs-devtools',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Developer Tools',
    desc: 'Production Git workflows, API testing clients, and dependency auditing.',
    topics: [
      {
        title: 'Git Workflows (Git Flow, Trunk-Based)',
        desc: 'Branching strategies, release tags, semantic versioning, and commit conventions.',
        duration: 90,
        difficulty: 'Intermediate',
        objectives: ['Adopt trunk-based development with short-lived branches', 'Manage semantic version tags (v1.2.0)', 'Enforce branch protection rules on GitHub'],
      },
      {
        title: 'Postman and API Testing Clients',
        desc: 'Environment variables, test scripts, pre-request scripts, and automated test runners.',
        duration: 80,
        difficulty: 'Beginner',
        objectives: ['Create Postman test suites with automated assertion tests', 'Parametrize environments for local, staging, and prod', 'Run Newman CLI test collections in CI'],
      },
      {
        title: 'Debugging Distributed Systems and APIs',
        desc: 'Distributed tracing, correlation IDs, network proxying, and HTTP debugging.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Trace requests across services using X-Request-ID headers', 'Inspect network payloads with Charles / Wireshark / DevTools', 'Troubleshoot CORS headers and preflight requests'],
      },
      {
        title: 'Dependency Management and Security Audits',
        desc: 'Vulnerability scanners (npm audit, Snyk), package locks, and license compliance.',
        duration: 80,
        difficulty: 'Intermediate',
        objectives: ['Run vulnerability audits and triage CVE advisories', 'Lock dependency versions to prevent supply chain attacks', 'Review third-party library software licenses'],
      },
    ],
  },
  {
    id: 'cat-y2-fs-docker',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Docker',
    desc: 'Containerization, layered builds, networking, volumes, and multi-service orchestration.',
    topics: [
      {
        title: 'Images and Containers',
        desc: 'Dockerfiles, multi-stage builds, base images, container lifecycle, and caching.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Author lean multi-stage Dockerfiles under 100MB', 'Manage running containers with run, exec, stop, rm', 'Leverage build cache layers effectively'],
      },
      {
        title: 'Volumes and Networks',
        desc: 'Named volumes, bind mounts, bridge networks, and inter-container communication.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Persist database storage across container restarts with volumes', 'Connect isolated containers over custom bridge networks', 'Map host ports to internal container ports safely'],
      },
      {
        title: 'Docker Compose Orchestration',
        desc: 'docker-compose.yml, multi-container stacks, environment files, and health checks.',
        duration: 150,
        difficulty: 'Intermediate',
        objectives: ['Declare multi-tier stacks (frontend, API, database, redis)', 'Configure service dependencies with healthchecks', 'Manage dev vs prod compose override files'],
        suggested_project: 'Dockerize a full-stack React + FastAPI + PostgreSQL application with Docker Compose.',
      },
    ],
  },
  {
    id: 'cat-y2-fs-deployment',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Deployment',
    desc: 'Server provisioning, cloud deployment, environment security, and CI/CD automation.',
    topics: [
      {
        title: 'Linux Server Fundamentals',
        desc: 'SSH keys, systemd service management, firewall (ufw), and Nginx reverse proxy.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Configure SSH key-based access and disable root password login', 'Manage application daemons with systemd units', 'Configure Nginx as a reverse proxy with TLS termination'],
      },
      {
        title: 'Cloud Hosting (AWS, GCP, DigitalOcean)',
        desc: 'Virtual machines, container services, managed databases, and object storage.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Deploy containers to cloud PaaS (Cloud Run, Render, ECS)', 'Connect web services to managed cloud databases', 'Host static client assets on cloud object storage (S3/GCS)'],
      },
      {
        title: 'Environment Variables and Secrets Management',
        desc: 'Twelve-Factor configuration, secret managers, .env workflows, and rotation.',
        duration: 90,
        difficulty: 'Intermediate',
        objectives: ['Separate code from configuration via environment variables', 'Store sensitive keys in Cloud Secret Manager or Vault', 'Prevent secrets leakage into version control'],
      },
      {
        title: 'CI/CD Basics with GitHub Actions',
        desc: 'Automated workflows, test jobs, linting pipelines, and automated deployments.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Write GitHub Actions workflow YAML files', 'Run automated test suites on pull requests', 'Deploy automatically to staging upon merge to main'],
        suggested_project: 'Build an automated CI/CD pipeline deploying a containerized web service.',
      },
    ],
  },
  {
    id: 'cat-y2-fs-quality',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Software Quality',
    desc: 'Automated testing pyramids, secure coding practices, and defensive software patterns.',
    topics: [
      {
        title: 'Unit Testing (Jest, PyTest)',
        desc: 'Assertions, test isolation, mocks, spies, fixtures, and code coverage.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Write focused unit tests with high assertion density', 'Mock external network calls and database dependencies', 'Analyze code coverage metrics and branch thresholds'],
      },
      {
        title: 'Integration Testing',
        desc: 'Testing API endpoints with test databases, supertest, and test transactions.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Spin up ephemeral test databases with Testcontainers', 'Verify end-to-end API request-response cycles', 'Roll back database state after test runs'],
      },
      {
        title: 'Secure Coding Principles',
        desc: 'OWASP Top 10, SQL injection prevention, XSS mitigation, CSRF, and CORS policies.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Audit code against OWASP Top 10 vulnerabilities', 'Enforce parameterized queries to eliminate SQLi', 'Configure Content Security Policy (CSP) headers'],
      },
      {
        title: 'Error Handling and Resilience',
        desc: 'Centralized error handlers, custom domain exceptions, and retry patterns.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Implement centralized exception filters', 'Provide sanitized error messages without stack traces', 'Apply exponential backoff retries for transient failures'],
      },
    ],
  },
  {
    id: 'cat-y2-fs-production',
    year_id: 'year_2',
    track_id: 'fullstack',
    name: 'Production Fundamentals',
    desc: 'Telemetry, caching layers, asynchronous task queues, and high-availability architecture.',
    topics: [
      {
        title: 'Logging and Monitoring',
        desc: 'Structured JSON logging, log aggregators, Prometheus metrics, and alerting.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Implement structured JSON logging with context metadata', 'Monitor latency, throughput, and error rate metrics', 'Set up alerting thresholds for 5xx spikes'],
      },
      {
        title: 'Caching Strategies with Redis',
        desc: 'In-memory caching, cache-aside, write-through, TTL, and cache invalidation.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Deploy Redis as an in-memory cache layer', 'Implement Cache-Aside pattern with TTL expiration', 'Handle cache stampede and invalidation challenges'],
      },
      {
        title: 'Background Jobs and Message Queues',
        desc: 'Celery, BullMQ, Redis queues, asynchronous workers, and dead-letter queues.',
        duration: 150,
        difficulty: 'Advanced',
        objectives: ['Offload long-running tasks to background job workers', 'Process tasks asynchronously via Redis or RabbitMQ queues', 'Configure retries and dead-letter queue routing'],
      },
      {
        title: 'Scalability and Distributed Systems Basics',
        desc: 'Horizontal vs vertical scaling, load balancers, database read replicas, and CAP theorem.',
        duration: 160,
        difficulty: 'Advanced',
        objectives: ['Analyze CAP theorem trade-offs in distributed systems', 'Distribute read loads across database replicas', 'Configure round-robin and least-connection load balancers'],
        suggested_project: 'Build a high-performance URL shortener with Redis caching and analytics queue.',
      },
    ],
  },

  // --- YEAR 2: TRACK 2 — AI ENGINEERING ---
  {
    id: 'cat-y2-ai-python',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'Python for AI',
    desc: 'Advanced Python capabilities, data processing libraries, and async concurrency for AI.',
    topics: [
      {
        title: 'Python Programming Fundamentals for AI',
        desc: 'List comprehensions, generators, decorators, typing, and memory profiling.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Use generators for lazy evaluation of large datasets', 'Write custom decorators for latency measurement', 'Profile Python memory usage during matrix operations'],
      },
      {
        title: 'Packages and Virtual Environments (Poetry, Conda, UV)',
        desc: 'Virtual environment isolation, lockfile reproducibility, and C-extension dependencies.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Set up deterministic virtual environments with Poetry / UV', 'Manage CUDA and PyTorch native dependencies', 'Package reusable AI Python utilities'],
      },
      {
        title: 'Data Structures and Asynchronous Programming Basics',
        desc: 'Asyncio event loops, concurrent API requests, semaphore rate limits, and NumPy arrays.',
        duration: 150,
        difficulty: 'Intermediate',
        objectives: ['Execute 100+ concurrent LLM calls with asyncio.gather', 'Control API rate limits using asyncio.Semaphore', 'Manipulate tensor dimensions and vector matrices in NumPy'],
        suggested_project: 'Build an async concurrent batch processor for LLM inference with rate-limit guards.',
      },
    ],
  },
  {
    id: 'cat-y2-ai-llm-fund',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'AI and LLM Fundamentals',
    desc: 'Transformer architectures, tokenization, model APIs, inference dynamics, and limits.',
    topics: [
      {
        title: 'Model APIs and SDKs',
        desc: 'Interacting with modern foundational models, streaming responses, and SDK wrappers.',
        duration: 120,
        difficulty: 'Beginner',
        objectives: ['Initialize model SDK clients with environment keys', 'Handle streaming SSE chunk responses in real time', 'Configure temperature, top_p, and stop sequences'],
      },
      {
        title: 'Tokens and Context Windows',
        desc: 'Byte-pair encoding (BPE), token count estimation, context window limits, and cost calculation.',
        duration: 100,
        difficulty: 'Beginner',
        objectives: ['Calculate token counts using tiktoken / model tokenizers', 'Track input vs output token consumption costs', 'Prevent context window truncation errors'],
      },
      {
        title: 'Inference Mechanics and Sampling',
        desc: 'Autoregressive decoding, greedy vs beam search, temperature, top-k, and presence penalties.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Tune temperature and top_p for factual vs creative generation', 'Understand KV cache mechanics during inference', 'Benchmark time-to-first-token (TTFT) and token throughput'],
      },
      {
        title: 'Model Limitations and Failure Modes',
        desc: 'Hallucinations, sycophancy, recency decay, bias, and context saturation.',
        duration: 90,
        difficulty: 'Intermediate',
        objectives: ['Identify root causes of hallucination and confabulation', 'Design mitigation guardrails for sycophancy', 'Test model performance degradation at context window limits'],
      },
    ],
  },
  {
    id: 'cat-y2-ai-prompting',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'Prompt Engineering for AI Engineers',
    desc: 'Production prompt architectures, structured outputs, and systematic prompt evaluations.',
    topics: [
      {
        title: 'Structured Prompting and System Architecture',
        desc: 'System-developer-user message roles, modular prompt templates, and variable injection.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Structure multi-role prompt messages systematically', 'Use templating engines (Jinja/Mustache) for dynamic prompt compilation', 'Enforce strict role separation to prevent instruction leaks'],
      },
      {
        title: 'Few-Shot Prompting and Chain of Thought',
        desc: 'Reasoning traces, step-by-step elicitation, few-shot selection, and DSPy concepts.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Elicit chain-of-thought (CoT) reasoning for mathematical problems', 'Select dynamic few-shot examples via embedding similarity', 'Benchmark reasoning accuracy vs zero-shot baselines'],
      },
      {
        title: 'Output Schemas and Constrained Decoding',
        desc: 'Pydantic schemas, JSON mode, instructor library, and grammar-constrained decoding.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Enforce 100% compliant JSON responses matching Pydantic schemas', 'Validate nested objects and enum constraints', 'Handle and retry schema parsing errors automatically'],
        suggested_project: 'Build an automated resume-parsing engine returning validated structured JSON.',
      },
      {
        title: 'Prompt Evaluation and Versioning',
        desc: 'Prompt version control, regression testing, A/B prompt testing, and golden datasets.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Track prompt changes in Git alongside code', 'Run automated regression test suites on prompt changes', 'Measure prompt variant win-rates on test evaluation sets'],
      },
    ],
  },
  {
    id: 'cat-y2-ai-embeddings',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'Embeddings and Vector Databases',
    desc: 'Vector representations, distance metrics, chunking strategies, and vector databases.',
    topics: [
      {
        title: 'Embedding Generation and Semantic Spaces',
        desc: 'Dense vector embeddings, dimensionality, cosine similarity, Euclidean distance, and dot products.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Generate dense vector embeddings using embedding models', 'Compute cosine similarity and dot product distances', 'Visualize high-dimensional embeddings using t-SNE / UMAP'],
      },
      {
        title: 'Text Chunking Strategies',
        desc: 'Fixed-size chunking, sentence splitting, semantic chunking, and markdown-aware boundary splits.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Compare recursive character splitting with semantic chunking', 'Configure optimal chunk size and overlap windows', 'Preserve document hierarchy during markdown parsing'],
      },
      {
        title: 'Similarity Search Algorithms (HNSW, IVF)',
        desc: 'Approximate Nearest Neighbor (ANN), Hierarchical Navigable Small World, indexing tradeoffs.',
        duration: 130,
        difficulty: 'Advanced',
        objectives: ['Understand HNSW graph construction and search efficiency', 'Balance recall accuracy vs search latency', 'Benchmark index build times across dataset sizes'],
      },
      {
        title: 'Metadata Filtering and Hybrid Search',
        desc: 'Pre-filtering, post-filtering, BM25 keyword matching, and Reciprocal Rank Fusion (RRF).',
        duration: 140,
        difficulty: 'Advanced',
        objectives: ['Combine sparse BM25 and dense vector search via hybrid search', 'Apply SQL/metadata boolean filters before vector search', 'Merge rank results using Reciprocal Rank Fusion algorithms'],
      },
      {
        title: 'Vector Database Integration (Pinecone, Chroma, pgvector)',
        desc: 'Setting up pgvector in PostgreSQL, ChromaDB in-memory, or Pinecone cloud collections.',
        duration: 150,
        difficulty: 'Intermediate',
        objectives: ['Deploy pgvector on PostgreSQL with vector column extensions', 'Perform similarity queries via SQL SELECT <=> vector operations', 'Manage index lifecycles and batch upserts'],
        suggested_project: 'Implement a semantic document search engine on PostgreSQL using pgvector.',
      },
    ],
  },
  {
    id: 'cat-y2-ai-rag',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'RAG Systems',
    desc: 'Retrieval-Augmented Generation architectures, document ingestion, reranking, and evaluation.',
    topics: [
      {
        title: 'Document Ingestion Pipelines',
        desc: 'PDF parsing, web scraping, table extraction, OCR, and document cleaning.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Extract clean text and tables from complex PDF documents', 'Clean artifacts, headers, and footers from raw text', 'Batch ingest documents with async worker queues'],
      },
      {
        title: 'Retrieval Strategies and Query Expansion',
        desc: 'HyDE (Hypothetical Document Embeddings), query re-writing, and multi-query retrieval.',
        duration: 130,
        difficulty: 'Advanced',
        objectives: ['Implement Hypothetical Document Embeddings (HyDE)', 'Generate multi-query variations to boost recall', 'Decompose complex queries into atomic sub-questions'],
      },
      {
        title: 'Reranking with Cross-Encoders',
        desc: 'Bi-encoder retrieval vs cross-encoder rerankers (Cohere Rerank, BGE-reranker).',
        duration: 120,
        difficulty: 'Advanced',
        objectives: ['Explain why cross-encoders achieve higher ranking precision', 'Integrate cross-encoder rerankers on top-20 retrieved chunks', 'Measure precision@k improvements after reranking'],
      },
      {
        title: 'Grounded Generation and Source Citations',
        desc: 'Context window injection, citation tracking, quote verification, and refusal guardrails.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Inject retrieved context with strict reference numbering', 'Force the model to provide verbatim quotes for claims', 'Instruct model to refuse answering when context is insufficient'],
      },
      {
        title: 'Retrieval Evaluation (RAGAS)',
        desc: 'Context precision, context recall, faithfulness, and answer relevancy metrics.',
        duration: 140,
        difficulty: 'Advanced',
        objectives: ['Instrument automated RAG evaluation using the RAGAS framework', 'Calculate faithfulness and context recall on test queries', 'Identify and eliminate retrieval failure bottlenecks'],
        suggested_project: 'Build a production-ready RAG knowledge assistant over technical documentation with citations.',
      },
    ],
  },
  {
    id: 'cat-y2-ai-agents',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'AI Agents and Harnesses',
    desc: 'Autonomous agent execution loops, function calling, state machines, and resilience.',
    topics: [
      {
        title: 'Tool Calling and Function Calling APIs',
        desc: 'Defining function schemas, argument validation, execution sandbox, and returning tool results.',
        duration: 140,
        difficulty: 'Intermediate',
        objectives: ['Declare function tools with JSON schema parameter validation', 'Inspect model tool_call payloads and execute local functions', 'Feed tool execution outputs back into conversation history'],
      },
      {
        title: 'Agent Execution Loops (ReAct Pattern)',
        desc: 'Reason-Act-Observe loops, planning, reflection, and iterative problem solving.',
        duration: 160,
        difficulty: 'Advanced',
        objectives: ['Build a ReAct agent loop from scratch', 'Track intermediate thoughts, tool actions, and observations', 'Enable dynamic task re-planning based on tool feedback'],
      },
      {
        title: 'State Management and Memory in Agents',
        desc: 'Short-term conversation buffer, scratchpad memory, and long-term vector memory stores.',
        duration: 140,
        difficulty: 'Advanced',
        objectives: ['Maintain agent scratchpad state across multi-turn reasoning steps', 'Persist session memory in database stores', 'Summarize and compress historical dialogue to prevent memory blowup'],
      },
      {
        title: 'Stopping Conditions and Loop Guards',
        desc: 'Maximum turn limits, token ceilings, loop detection, and early termination rules.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Implement hard timeouts and maximum step budgets', 'Detect repetitive circular tool calling behaviors', 'Gracefully return best-effort summaries on budget exhaustion'],
      },
      {
        title: 'Failure Recovery and Graceful Degradation',
        desc: 'Tool execution errors, model re-prompting on failure, fallback tools, and human-in-the-loop.',
        duration: 120,
        difficulty: 'Advanced',
        objectives: ['Pass stack traces back to model for self-correction', 'Implement secondary fallback tools when primary services fail', 'Pause execution for human confirmation on destructive actions'],
        suggested_project: 'Build an autonomous GitHub Issue Resolver agent with file search, edit, and testing tools.',
      },
    ],
  },
  {
    id: 'cat-y2-ai-eval',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'AI Evaluation',
    desc: 'LLM-as-a-judge, benchmark datasets, ground truth assertions, and performance tracking.',
    topics: [
      {
        title: 'Evaluation Datasets and Ground Truth',
        desc: 'Curating golden test sets, synthetic data generation, and edge case coverage.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Curate representative golden question-answer test sets', 'Generate hard synthetic adversarial test examples', 'Track evaluation metrics across dataset splits'],
      },
      {
        title: 'Answer Correctness and LLM-as-a-Judge',
        desc: 'Using powerful models to score outputs, rubric design, G-Eval, and bias calibration.',
        duration: 130,
        difficulty: 'Advanced',
        objectives: ['Draft objective scoring rubrics for LLM judges', 'Calibrate LLM-as-a-judge outputs against human annotations', 'Mitigate position bias and verbosity bias in model evaluations'],
      },
      {
        title: 'Retrieval Quality Metrics (MRR, NDCG, MAP)',
        desc: 'Mean Reciprocal Rank, Normalized Discounted Cumulative Gain, and Precision at K.',
        duration: 120,
        difficulty: 'Advanced',
        objectives: ['Compute MRR and NDCG on retrieved rank lists', 'Benchmark retriever performance on benchmark collections', 'Tune embedding and reranker choices based on empirical scores'],
      },
      {
        title: 'Latency and Cost Measurement',
        desc: 'P50/P95/P99 latency profiling, cost-per-query tracking, and token efficiency optimization.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Measure end-to-end P95 request latency', 'Track dollar cost per user workflow', 'Optimize prompt density to lower token overhead by 30%+'],
      },
    ],
  },
  {
    id: 'cat-y2-ai-linux-tools',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'Linux and Developer Tools for AI',
    desc: 'GPU driver environments, CUDA, shell pipelines, remote compute, and debugging.',
    topics: [
      {
        title: 'Shell Commands and Data Pipelines (awk, sed, jq)',
        desc: 'Processing JSONL datasets, text extraction, streaming pipelines, and batch operations.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Slice and filter million-line JSONL datasets using jq', 'Run text stream transformations with awk and sed', 'Chain multi-stage shell data cleaning scripts'],
      },
      {
        title: 'File Permissions and Process Management',
        desc: 'chmod, chown, htop, background jobs with tmux and nohup, and GPU monitoring with nvidia-smi.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Inspect GPU utilization and memory via nvidia-smi', 'Run persistent training/eval scripts in detached tmux sessions', 'Manage process priority with nice and kill signals'],
      },
      {
        title: 'Git and GitHub for AI Datasets and Models',
        desc: 'Git LFS for large files, Hugging Face Hub git integration, and model checkpoint versioning.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Track multi-gigabyte models and datasets with Git LFS', 'Push and pull repositories on Hugging Face Hub', 'Maintain reproducible experiment tags'],
      },
      {
        title: 'Environment Configuration and CUDA Basics',
        desc: 'NVIDIA drivers, CUDA toolkit, PyTorch CUDA availability, and memory troubleshooting (OOM).',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Verify CUDA runtime setup with torch.cuda.is_available()', 'Resolve Out Of Memory (OOM) errors via gradient accumulation', 'Configure LD_LIBRARY_PATH and GPU device visibility'],
      },
      {
        title: 'Logging and Debugging AI Workflows',
        desc: 'Weights & Biases, MLflow, LangSmith tracing, and logging token metrics.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Trace nested agent calls using LangSmith or Phoenix', 'Log experiment runs and metrics with Weights & Biases', 'Debug token generation drop-offs and timeouts'],
      },
    ],
  },
  {
    id: 'cat-y2-ai-cloud',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'Cloud Computing for AI',
    desc: 'Cloud hyperscaler infrastructure, GPU compute, cloud storage, and IAM security.',
    topics: [
      {
        title: 'GCP or AWS Fundamentals for AI',
        desc: 'Cloud resource hierarchy, Vertex AI / SageMaker, and serverless compute.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Navigate cloud console and CLI tooling (gcloud / aws)', 'Provision serverless endpoints for AI microservices', 'Understand region availability for GPU accelerators'],
      },
      {
        title: 'Compute and Storage (VMs, Object Storage)',
        desc: 'GPU-backed compute instances, S3/Cloud Storage buckets, and high-speed data mounts.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Spin up spot and on-demand GPU VM instances', 'Store training datasets in S3/GCS buckets with lifecycle rules', 'Mount cloud storage to local file systems'],
      },
      {
        title: 'Networking and VPCs for Secure AI',
        desc: 'Private endpoints, VPC peering, NAT gateways, and secure model API communication.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Configure VPC subnets and firewall rules', 'Establish private connections to database and vector services', 'Prevent public internet exposure of internal AI backends'],
      },
      {
        title: 'IAM and Access Controls for AI Keys',
        desc: 'Principle of least privilege, service accounts, IAM roles, and secret rotation.',
        duration: 100,
        difficulty: 'Intermediate',
        objectives: ['Create dedicated service accounts for AI microservices', 'Assign granular IAM permissions without admin privileges', 'Rotate cloud API keys and credentials automatically'],
      },
    ],
  },
  {
    id: 'cat-y2-ai-security',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'AI Security and Ethics',
    desc: 'Adversarial prompt injection, data leakage, privacy compliance, and responsible AI.',
    topics: [
      {
        title: 'Prompt Injection and Jailbreak Defenses',
        desc: 'Direct and indirect prompt injection, canary tokens, and defense-in-depth sanitizers.',
        duration: 130,
        difficulty: 'Advanced',
        objectives: ['Simulate direct and indirect prompt injection attacks', 'Implement input sanitization and canary verification tokens', 'Deploy guardrail models (Llama Guard, NeMo Guardrails)'],
      },
      {
        title: 'Data Privacy and PII Redaction',
        desc: 'Detecting Personally Identifiable Information (PII), anonymization, and scrubbing.',
        duration: 110,
        difficulty: 'Intermediate',
        objectives: ['Scrub PII (emails, phone numbers, SSNs) prior to model transmission', 'Implement regex and NER-based redaction filters', 'Ensure GDPR and CCPA compliance for AI logs'],
      },
      {
        title: 'Data Leakage and Context Poisoning',
        desc: 'Vector store poisoning, unauthorized document retrieval across tenants, and multi-tenancy.',
        duration: 120,
        difficulty: 'Advanced',
        objectives: ['Enforce strict multi-tenant authorization in vector databases', 'Prevent cross-user context contamination in RAG', 'Audit retriever outputs for unauthorized data leakage'],
      },
      {
        title: 'Tool Permission Controls and Execution Sandboxing',
        desc: 'Least privilege tool scopes, Docker/gVisor sandboxing for code execution, and user confirmation.',
        duration: 140,
        difficulty: 'Advanced',
        objectives: ['Isolate code execution in ephemeral container sandboxes', 'Restrict network and disk access for model-invoked tools', 'Require explicit human approval for state-mutating actions'],
      },
      {
        title: 'Responsible AI and Bias Mitigation',
        desc: 'Fairness metrics, model card documentation, toxicity filtering, and ethical review.',
        duration: 90,
        difficulty: 'Beginner',
        objectives: ['Evaluate model outputs for demographic and cultural bias', 'Implement post-generation toxicity safety filters', 'Draft Model Cards outlining training bounds and intended use'],
        suggested_project: 'Build an enterprise AI security guardrail proxy that blocks injection and scrubs PII.',
      },
    ],
  },
  {
    id: 'cat-y2-ai-observability',
    year_id: 'year_2',
    track_id: 'ai',
    name: 'Deployment and Observability for AI',
    desc: 'Containerizing AI apps, cloud serving, CI/CD, and real-time generation tracing.',
    topics: [
      {
        title: 'Docker for AI Applications',
        desc: 'Containerizing FastAPI AI backends, CUDA container runtimes, and caching model weights.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Build lean Docker images for Python AI services', 'Utilize multi-stage builds to avoid bundling compilers', 'Mount local model cache directories to container volumes'],
      },
      {
        title: 'API Integration and Real-Time Streaming',
        desc: 'Server-Sent Events (SSE), WebSockets for live voice/text, and async API gateways.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Stream token generation using FastAPI StreamingResponse and SSE', 'Build client-side readers with EventSource in React', 'Handle stream interruption and graceful client disconnects'],
      },
      {
        title: 'Cloud Deployment for AI Services',
        desc: 'Deploying to Google Cloud Run, AWS App Runner, or Kubernetes with horizontal autoscaling.',
        duration: 130,
        difficulty: 'Intermediate',
        objectives: ['Deploy containerized AI backends to serverless cloud runtimes', 'Configure concurrency and request timeout thresholds (up to 300s)', 'Configure autoscaling based on incoming request metrics'],
      },
      {
        title: 'CI/CD Pipelines for AI Systems',
        desc: 'Automating model smoke tests, prompt evaluation gates, and blue-green deployments.',
        duration: 120,
        difficulty: 'Intermediate',
        objectives: ['Build GitHub Actions pipelines with automated eval gates', 'Block code merges if answer faithfulness drops below 90%', 'Deploy zero-downtime updates to production services'],
      },
      {
        title: 'Logs, Traces, and Monitoring in Production',
        desc: 'OpenTelemetry instrumentation, distributed trace visualization, and anomaly alerts.',
        duration: 130,
        difficulty: 'Advanced',
        objectives: ['Instrument OpenTelemetry spans across LLM calls and tool executions', 'Monitor token consumption trends and spike anomalies', 'Diagnose latency spikes in downstream vector retrievers'],
        suggested_project: 'End-to-end deployed AI microservice with OpenTelemetry tracing and automated eval CI/CD.',
      },
    ],
  },

  // --- YEAR 3: ADVANCED PROJECT DEVELOPMENT (FULL-STACK) ---
  {
    id: 'cat-y3-fs-arch',
    year_id: 'year_3',
    track_id: 'fullstack',
    name: 'Advanced Project Architecture & System Design',
    desc: 'Enterprise distributed systems, microservices, event-driven architectures, and domain-driven design.',
    topics: [
      {
        title: 'Distributed System Design & Microservices',
        desc: 'Event-driven architectures, saga patterns, gRPC communication, and API gateways.',
        duration: 200,
        difficulty: 'Advanced',
        objectives: ['Design resilient microservices communicating via gRPC and Kafka', 'Implement distributed saga transactions for data consistency', 'Partition business domains following Domain-Driven Design (DDD)'],
        suggested_project: 'Architect and implement an event-driven distributed checkout microservice.',
      },
      {
        title: 'Performance Optimization & High Availability',
        desc: 'Database connection pooling, query tuning, multi-region replication, and memory profiling.',
        duration: 180,
        difficulty: 'Advanced',
        objectives: ['Optimize high-load database queries with partial indexes and CTEs', 'Configure multi-master and read-replica replication topology', 'Profile CPU and memory bottlenecks under 10k requests/sec'],
      },
      {
        title: 'Enterprise Security Testing & Compliance',
        desc: 'Penetration testing, OAuth2.0 OpenID Connect, audit logging, and compliance (SOC2/HIPAA).',
        duration: 160,
        difficulty: 'Advanced',
        objectives: ['Conduct automated vulnerability scans and pen-testing', 'Implement comprehensive immutable audit logs', 'Implement OpenID Connect single sign-on (SSO) with enterprise IdPs'],
      },
      {
        title: 'Production Observability & Site Reliability Engineering',
        desc: 'SRE metrics (SLO/SLI/SLA), distributed tracing, error budgeting, and incident postmortems.',
        duration: 150,
        difficulty: 'Advanced',
        objectives: ['Define actionable SLIs and SLOs for critical user paths', 'Draft blameless postmortem reports for simulated outages', 'Instrument distributed tracing using Jaeger and OpenTelemetry'],
      },
      {
        title: 'Capstone Full-Stack Production Portfolio Project',
        desc: 'Full-cycle production capstone: design, implementation, testing, deployment, and portfolio showcase.',
        duration: 360,
        difficulty: 'Advanced',
        objectives: ['Deliver a production-ready application with 90%+ test coverage', 'Deploy to cloud infrastructure with automated CI/CD and monitoring', 'Present technical demonstration and architecture whitepaper'],
        suggested_project: 'Comprehensive enterprise full-stack capstone deployed live with production metrics.',
      },
    ],
  },

  // --- YEAR 3: ADVANCED PROJECT DEVELOPMENT (AI ENGINEERING) ---
  {
    id: 'cat-y3-ai-arch',
    year_id: 'year_3',
    track_id: 'ai',
    name: 'Advanced AI Systems & Capstone Engineering',
    desc: 'Multi-agent orchestration, fine-tuning, latency optimization, and enterprise production AI.',
    topics: [
      {
        title: 'Multi-Agent Orchestration & Hierarchical Swarms',
        desc: 'Supervisor agent patterns, inter-agent messaging, shared memory graphs, and consensus protocols.',
        duration: 220,
        difficulty: 'Advanced',
        objectives: ['Design supervisor-worker multi-agent coordination loops', 'Implement LangGraph / state machine message passing', 'Resolve conflicts and synthesize insights across specialized agents'],
        suggested_project: 'Build an autonomous multi-agent software engineering squad (planner, coder, tester, reviewer).',
      },
      {
        title: 'Model Fine-Tuning and Parameter-Efficient Adaptation (LoRA)',
        desc: 'LoRA, QLoRA, dataset preparation, loss curves, and domain-specific instruction tuning.',
        duration: 240,
        difficulty: 'Advanced',
        objectives: ['Format instruction-tuning datasets for open-weight models', 'Fine-tune models using LoRA / QLoRA with Hugging Face TRL', 'Evaluate post-tuning perplexity and target task benchmark scores'],
      },
      {
        title: 'Inference Optimization and Latency Engineering',
        desc: 'vLLM, TensorRT-LLM, speculative decoding, quantization (AWQ/GPTQ), and prefix caching.',
        duration: 190,
        difficulty: 'Advanced',
        objectives: ['Deploy high-throughput inference engines with vLLM', 'Apply 4-bit and 8-bit quantization without performance degradation', 'Enable speculative decoding and prefix caching for 3x speedups'],
      },
      {
        title: 'Production AI Red-Teaming and Safety Hardening',
        desc: 'Automated red-teaming, adversarial evaluation, output guardrails, and compliance audits.',
        duration: 170,
        difficulty: 'Advanced',
        objectives: ['Execute automated red-teaming attacks against deployed agents', 'Implement defense-in-depth safety shields and content filters', 'Publish verifiable safety audit documentation for enterprise deployment'],
      },
      {
        title: 'Capstone AI Engineering Portfolio System',
        desc: 'Production-grade AI system capstone: multi-modal RAG, agentic tools, evaluation, and cloud deployment.',
        duration: 360,
        difficulty: 'Advanced',
        objectives: ['Build and deploy an enterprise-grade AI system with verified ground truth', 'Instrument end-to-end telemetry and automated evaluation gates', 'Author technical architecture paper and live interactive demo'],
        suggested_project: 'Enterprise autonomous intelligence platform deployed with RAG, agents, and continuous evaluation.',
      },
    ],
  },
];

export function generateSeedData() {
  const categories: Category[] = [];
  const topics: Topic[] = [];
  const resources: Resource[] = [];

  let topicCounter = 1;
  let resourceCounter = 1;

  rawCategories.forEach((rc, cIdx) => {
    categories.push({
      id: rc.id,
      year_id: rc.year_id,
      track_id: rc.track_id,
      name: rc.name,
      description: rc.desc,
      order: cIdx + 1,
    });

    rc.topics.forEach((t, tIdx) => {
      const topicId = `top-${topicCounter.toString().padStart(3, '0')}`;
      const slug = toSlug(t.title);

      topics.push({
        id: topicId,
        category_id: rc.id,
        year_id: rc.year_id,
        track_id: rc.track_id,
        title: t.title,
        slug,
        description: t.desc,
        learning_objectives: t.objectives,
        estimated_duration_minutes: t.duration,
        difficulty: t.difficulty,
        is_required: true,
        is_published: true,
        order: tIdx + 1,
        suggested_project: t.suggested_project,
      });

      // Seed at least one placeholder resource per topic matching requirements
      const resTypes: Resource['type'][] = ['Tutorial', 'Documentation', 'Course', 'Video', 'Repository', 'Practice'];
      const chosenType = resTypes[topicCounter % resTypes.length];

      resources.push({
        id: `res-${resourceCounter.toString().padStart(3, '0')}`,
        topic_id: topicId,
        title: `${t.title} - Core Guide & Reference`,
        description: `Placeholder learning resource for ${t.title}. Covers fundamental concepts, practical walkthroughs, and code patterns.`,
        type: chosenType,
        url: `https://example.com/resources/${slug}`,
        duration_minutes: Math.round(t.duration * 0.75),
        difficulty: t.difficulty,
        display_order: 1,
        published: true,
        is_sample: true,
      });
      resourceCounter++;

      // For every 3rd topic, add a second resource (e.g. Documentation or Repository)
      if (topicCounter % 3 === 0) {
        resources.push({
          id: `res-${resourceCounter.toString().padStart(3, '0')}`,
          topic_id: topicId,
          title: `${t.title} - Official Documentation & Spec`,
          description: `Sample reference documentation and API specifications for ${t.title}.`,
          type: 'Documentation',
          url: `https://example.com/resources/${slug}-docs`,
          duration_minutes: 60,
          difficulty: t.difficulty,
          display_order: 2,
          published: true,
          is_sample: true,
        });
        resourceCounter++;
      }

      topicCounter++;
    });
  });

  // Sample Users
  const sampleUsers: User[] = [
    {
      id: 'usr-admin-1',
      email: 'mentor.admin@apex.edu',
      password_hash: hashPassword('Password@123'),
      role: 'admin',
      full_name: 'Dr. Sarah Chen (Chief Mentor)',
      created_at: '2026-08-01T08:00:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-1',
      email: 'alex.rivers@apex.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Alex Rivers',
      created_at: '2026-08-15T09:30:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-2',
      email: 'priya.patel@apex.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Priya Patel',
      created_at: '2026-08-16T10:15:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-3',
      email: 'marcus.vance@apex.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Marcus Vance',
      created_at: '2026-08-16T11:45:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-4',
      email: 'elena.rostova@apex.edu',
      password_hash: hashPassword('Password@123'),
      role: 'student',
      full_name: 'Elena Rostova',
      created_at: '2026-08-10T08:00:00Z',
      status: 'active',
    },
    {
      id: 'usr-student-5',
      email: 'devon.lane@apex.edu',
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
      college: 'Apex Institute of Technology',
      department: 'Computer Science & Engineering',
      current_year: 'year_1',
      track_id: 'common',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/alexrivers-dev',
      created_at: '2026-08-15T09:30:00Z',
      last_active_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: 'prof-student-2',
      user_id: 'usr-student-2',
      roll_number: 'ENG2025-0089',
      college: 'Apex Institute of Technology',
      department: 'Information Technology',
      current_year: 'year_2',
      track_id: 'fullstack',
      profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/priyapatel-code',
      created_at: '2026-08-16T10:15:00Z',
      last_active_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: 'prof-student-3',
      user_id: 'usr-student-3',
      roll_number: 'ENG2025-0215',
      college: 'Apex Institute of Technology',
      department: 'AI & Data Science',
      current_year: 'year_2',
      track_id: 'ai',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/marcusvance-ai',
      created_at: '2026-08-16T11:45:00Z',
      last_active_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString(), // 1 day ago
    },
    {
      id: 'prof-student-4',
      user_id: 'usr-student-4',
      roll_number: 'ENG2024-0033',
      college: 'Apex Institute of Technology',
      department: 'Software Engineering',
      current_year: 'year_3',
      track_id: 'fullstack',
      profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/elenarostova-eng',
      created_at: '2026-08-10T08:00:00Z',
      last_active_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    },
    {
      id: 'prof-student-5',
      user_id: 'usr-student-5',
      roll_number: 'ENG2025-0371',
      college: 'Apex Institute of Technology',
      department: 'Computer Engineering',
      current_year: 'year_2',
      track_id: 'fullstack',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/devonlane',
      created_at: '2026-08-18T14:20:00Z',
      last_active_at: new Date(Date.now() - 25 * 86400 * 1000).toISOString(), // 25 days ago (Inactive alert!)
    },
  ];

  // Seed progress for students
  const topicProgress: StudentTopicProgress[] = [];
  const resourceProgress: StudentResourceProgress[] = [];
  const projects: Project[] = [];
  const activityLogs: ActivityLog[] = [];

  // Helper to mark topic and its resources
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

    // Also mark resources
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

  // Seed for Student 1 (Alex - Year 1 Common Foundation)
  // Complete first 5 Year 1 topics, 2 in progress
  const y1Topics = topics.filter((t) => t.year_id === 'year_1');
  y1Topics.slice(0, 8).forEach((t, i) => {
    markTopic('prof-student-1', t.id, 'completed', 10 - i);
  });
  if (y1Topics[8]) markTopic('prof-student-1', y1Topics[8].id, 'in_progress', 1);
  if (y1Topics[9]) markTopic('prof-student-1', y1Topics[9].id, 'in_progress', 1);

  // Seed for Student 2 (Priya - Year 2 Full-Stack)
  // All Year 1 common completed, first 12 Full-Stack completed
  y1Topics.forEach((t) => markTopic('prof-student-2', t.id, 'completed', 45));
  const fsTopics = topics.filter((t) => t.track_id === 'fullstack' && t.year_id === 'year_2');
  fsTopics.slice(0, 10).forEach((t, i) => {
    markTopic('prof-student-2', t.id, 'completed', 20 - i);
  });
  if (fsTopics[10]) markTopic('prof-student-2', fsTopics[10].id, 'in_progress', 1);

  // Seed for Student 3 (Marcus - Year 2 AI)
  // All Year 1 common completed, first 14 AI completed
  y1Topics.forEach((t) => markTopic('prof-student-3', t.id, 'completed', 50));
  const aiTopics = topics.filter((t) => t.track_id === 'ai' && t.year_id === 'year_2');
  aiTopics.slice(0, 12).forEach((t, i) => {
    markTopic('prof-student-3', t.id, 'completed', 22 - i);
  });
  if (aiTopics[12]) markTopic('prof-student-3', aiTopics[12].id, 'in_progress', 2);

  // Seed for Student 4 (Elena - Year 3 Full-Stack)
  y1Topics.forEach((t) => markTopic('prof-student-4', t.id, 'completed', 100));
  fsTopics.forEach((t) => markTopic('prof-student-4', t.id, 'completed', 60));
  const y3FsTopics = topics.filter((t) => t.track_id === 'fullstack' && t.year_id === 'year_3');
  y3FsTopics.slice(0, 2).forEach((t, i) => {
    markTopic('prof-student-4', t.id, 'completed', 15 - i);
  });
  if (y3FsTopics[2]) markTopic('prof-student-4', y3FsTopics[2].id, 'in_progress', 1);

  // Seed for Student 5 (Devon - Inactive)
  y1Topics.slice(0, 6).forEach((t) => markTopic('prof-student-5', t.id, 'completed', 60));
  if (y1Topics[6]) markTopic('prof-student-5', y1Topics[6].id, 'in_progress', 25);

  // Seed Projects
  projects.push({
    id: 'proj-001',
    student_id: 'prof-student-2',
    topic_id: fsTopics[0]?.id,
    title: 'Apex Campus Task Flow API',
    problem_statement: 'Engineering students lacked an automated workflow to schedule project sprints and track milestone deadlines.',
    tech_stack: ['FastAPI', 'PostgreSQL', 'Docker', 'JWT', 'Pydantic'],
    github_url: 'https://github.com/priyapatel-code/apex-taskflow-api',
    deployment_url: 'https://taskflow-api.priyapatel.dev',
    description: 'A high-throughput async REST API service built with FastAPI and PostgreSQL, featuring JWT authentication, automated OpenAPI docs, and Docker deployment.',
    completion_notes: 'Implemented comprehensive unit and integration tests with 94% coverage. Handled connection pooling with asyncpg.',
    status: 'approved',
    created_at: '2026-09-10T10:00:00Z',
    submitted_at: '2026-09-12T14:20:00Z',
    reviewed_at: '2026-09-14T09:15:00Z',
    reviewer_id: 'usr-admin-1',
    reviewer_feedback: 'Outstanding API architecture! Schema validation and exception envelopes are clean and robust. Approved.',
    history: [
      { date: '2026-09-10T10:00:00Z', action: 'Created Draft', status: 'draft', by: 'Priya Patel' },
      { date: '2026-09-12T14:20:00Z', action: 'Submitted for Review', status: 'submitted', by: 'Priya Patel' },
      { date: '2026-09-14T09:15:00Z', action: 'Approved by Mentor', status: 'approved', notes: 'Outstanding architecture and test coverage.', by: 'Dr. Sarah Chen' },
    ],
  });

  projects.push({
    id: 'proj-002',
    student_id: 'prof-student-3',
    topic_id: aiTopics[4]?.id,
    title: 'ArXiv Scholar RAG Knowledge Assistant',
    problem_statement: 'Researchers struggle to query and cross-reference citations across dense research PDFs with grounded verification.',
    tech_stack: ['Python', 'FastAPI', 'pgvector', 'LangChain', 'Cross-Encoders', 'React'],
    github_url: 'https://github.com/marcusvance-ai/arxiv-scholar-rag',
    deployment_url: 'https://scholar-rag.marcusvance.ai',
    description: 'Retrieval-Augmented Generation system with PDF ingestion, hybrid BM25 + dense vector search via pgvector, cross-encoder reranking, and citation quote verification.',
    completion_notes: 'Evaluated with RAGAS framework: achieved 0.92 faithfulness score and 0.88 answer relevancy.',
    status: 'under_review',
    created_at: '2026-10-18T11:00:00Z',
    submitted_at: '2026-10-21T16:40:00Z',
    history: [
      { date: '2026-10-18T11:00:00Z', action: 'Created Draft', status: 'draft', by: 'Marcus Vance' },
      { date: '2026-10-21T16:40:00Z', action: 'Submitted for Review', status: 'submitted', by: 'Marcus Vance' },
      { date: '2026-10-22T08:30:00Z', action: 'Review Started', status: 'under_review', by: 'Dr. Sarah Chen' },
    ],
  });

  projects.push({
    id: 'proj-003',
    student_id: 'prof-student-1',
    topic_id: y1Topics[2]?.id,
    title: 'Interactive Realtime Kanban Board',
    problem_statement: 'Need an accessible, mobile-first project board with drag-and-drop state transitions without heavy external frameworks.',
    tech_stack: ['HTML5', 'CSS3', 'JavaScript ES6+', 'LocalStorage', 'Flexbox'],
    github_url: 'https://github.com/alexrivers-dev/vanilla-kanban-board',
    deployment_url: 'https://alexrivers.dev/kanban-demo',
    description: 'Vanilla JavaScript Kanban board utilizing HTML Drag and Drop API, semantic layout, keyboard navigation, and localStorage persistence.',
    completion_notes: 'Added accessibility labels, WCAG contrast checks, and responsive mobile card transitions.',
    status: 'changes_requested',
    created_at: '2026-10-15T09:00:00Z',
    submitted_at: '2026-10-17T12:00:00Z',
    reviewed_at: '2026-10-19T14:30:00Z',
    reviewer_id: 'usr-admin-1',
    reviewer_feedback: 'Great start! Please add keyboard accessibility (focus traps and Enter/Space event handlers) to meet Category 3 standards before final approval.',
    history: [
      { date: '2026-10-15T09:00:00Z', action: 'Created Draft', status: 'draft', by: 'Alex Rivers' },
      { date: '2026-10-17T12:00:00Z', action: 'Submitted for Review', status: 'submitted', by: 'Alex Rivers' },
      { date: '2026-10-19T14:30:00Z', action: 'Changes Requested', status: 'changes_requested', notes: 'Needs keyboard accessibility enhancements.', by: 'Dr. Sarah Chen' },
    ],
  });

  projects.push({
    id: 'proj-004',
    student_id: 'prof-student-4',
    topic_id: y3FsTopics[0]?.id,
    title: 'Distributed Event-Driven Payment Gateway',
    problem_statement: 'Building a fault-tolerant payment transaction processing pipeline with idempotency guarantees.',
    tech_stack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker', 'Redis'],
    github_url: 'https://github.com/elenarostova-eng/event-payment-gateway',
    deployment_url: 'https://payment-engine.elenarostova.dev',
    description: 'High-volume payment processor utilizing the transactional outbox pattern, distributed locks via Redis, and idempotent event consumers.',
    completion_notes: 'Currently writing stress test suite simulating network partitions and race conditions.',
    status: 'draft',
    created_at: '2026-10-23T15:00:00Z',
    history: [
      { date: '2026-10-23T15:00:00Z', action: 'Created Draft', status: 'draft', by: 'Elena Rostova' },
    ],
  });

  // Seed Activity Logs
  activityLogs.push(
    {
      id: 'act-001',
      student_id: 'prof-student-2',
      type: 'project_reviewed',
      description: 'Project "Apex Campus Task Flow API" was approved by Dr. Sarah Chen.',
      timestamp: '2026-09-14T09:15:00Z',
    },
    {
      id: 'act-002',
      student_id: 'prof-student-3',
      type: 'project_submitted',
      description: 'Submitted project "ArXiv Scholar RAG Knowledge Assistant" for mentor review.',
      timestamp: '2026-10-21T16:40:00Z',
    },
    {
      id: 'act-003',
      student_id: 'prof-student-1',
      type: 'topic_status',
      description: 'Marked topic "Exception Handling and File Handling" as completed.',
      timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    },
    {
      id: 'act-004',
      student_id: 'prof-student-1',
      type: 'resource_completed',
      description: 'Completed resource "JavaScript DOM Manipulation - Core Guide".',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
    {
      id: 'act-005',
      student_id: 'prof-student-3',
      type: 'topic_status',
      description: 'Marked topic "Vector Database Integration (Pinecone, Chroma, pgvector)" as completed.',
      timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
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
