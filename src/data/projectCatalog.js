/**
 * ATC LMS Project Catalog
 * Comprehensive curriculum project specifications mapped directly to active engineering modules.
 * Note: Python (top-001), Java (top-002), and Git & GitHub (top-006) do NOT have projects.
 */

export const PROJECT_CATALOG = [
  {
    id: 'proj-spec-js-arcade',
    topic_id: 'top-003',
    topic_title: 'JavaScript Fundamentals',
    category: 'Programming Languages',
    track_id: 'common',
    year_id: 'year_1',
    difficulty: 'Beginner',
    estimated_hours: 20,
    title: 'CodeQuest: Interactive Game-Based Learning Platform',
    short_summary: 'An interactive, game-based web application that reinforces core JavaScript concepts through gamified challenges and mechanics.',
    prerequisites: ['HTML5 semantic structure', 'CSS3 layouts & flexbox', 'JavaScript variables, functions, and arrays'],
    tech_stack: ['JavaScript (ES6+)', 'HTML5 Canvas / DOM', 'Modern CSS3', 'Web Audio API (Optional)', 'LocalStorage API'],
    
    overview: `CodeQuest is an interactive, browser-based educational game engineered to help aspiring programmers master fundamental JavaScript programming concepts through active gameplay. 
    Rather than reading static documentation, learners control a character or solve arcade puzzle challenges where game mechanics—such as character movement, inventory management, score combos, and boss battles—are powered by evaluating and writing clean JavaScript code.
    
    In the software industry, gamified learning platforms (such as CodeCombat, CodinGame, and Duolingo) have revolutionized technical training by maximizing learner retention and engagement through instant feedback loops, state manipulation, and interactive challenges.`,
    
    objectives: [
      'Master DOM manipulation, event listeners, and dynamic UI rendering without frontend frameworks',
      'Implement a clean game state machine and game loop using requestAnimationFrame or setInterval',
      'Apply ES6+ features including arrow functions, array destructuring, template literals, and spread operators',
      'Handle client-side persistence for player scores, unlockables, and streaks using LocalStorage',
      'Write modular, readable code organized into distinct concerns (state, game logic, rendering, event handling)',
    ],
    
    core_features: [
      {
        title: 'Core Game Engine & Loop',
        description: 'Predictable game loop updating physics/mechanics and rendering game frames smoothly (60 FPS target).',
        mandatory: true,
      },
      {
        title: 'Interactive JavaScript Coding/Logic Challenges',
        description: 'At least 5 progressive stages/levels where advancing requires solving JavaScript logic puzzles (e.g., array transformations, conditional branching, loops).',
        mandatory: true,
      },
      {
        title: 'Score, Health, & Streak System',
        description: 'Dynamic scoring system with combo multipliers for consecutive correct answers and health/lives counters.',
        mandatory: true,
      },
      {
        title: 'Persistent Leaderboard & Progress Tracking',
        description: 'Persist player high scores, completed levels, and achievement badges across browser refreshes via LocalStorage.',
        mandatory: true,
      },
      {
        title: 'Responsive & Accessible Game Viewport',
        description: 'Touch-friendly controls for mobile devices and keyboard navigation (Arrow keys / WASD / Spacebar).',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Playable single-page web game with at least 5 playable levels/challenges',
      'Real-time DOM or Canvas rendering responding to user input without errors',
      'Accurate score calculation and lives/game over state transition',
      'Persistent LocalStorage saving high score and player level',
      'Mobile and desktop responsive layout with intuitive instructions',
    ],
    
    optional_features: [
      'Sound effects and background music using the Web Audio API with mute toggle',
      'Custom Level Builder allowing players to create and share their own JavaScript puzzle stages',
      'Visual particle animations for correct answers and level completion fireworks',
      'Timer attack mode with countdown pressure and bonus multipliers',
    ],
    
    ui_ux_requirements: `The game must feature a polished retro-arcade or clean modern sci-fi aesthetic. 
    Provide clear visual feedback for successes (e.g. green flashes, celebratory badges) and failures (e.g. shake animations, helpful hints).
    Ensure the user interface is completely responsive across both mobile smartphones (touch controls) and desktop screens (keyboard bindings).`,
    
    testing_requirements: [
      'Verify zero JavaScript console errors during all game state transitions (Start -> Playing -> Game Over -> Restart)',
      'Test LocalStorage persistence by reloading the browser midway through gameplay and checking saved state',
      'Validate input edge cases: empty submissions, malformed inputs, and rapid keypresses',
      'Cross-browser testing on Chrome, Firefox, and Safari',
    ],
    
    milestones: [
      { step: 1, title: 'Game Architecture & Wireframe', description: 'Design game mechanics, mock up screens, and structure HTML/CSS layout.' },
      { step: 2, title: 'Core Game Loop & State Management', description: 'Implement game state variables, timer/loop, and basic player controls.' },
      { step: 3, title: 'Challenge Engine & Validation', description: 'Build interactive JavaScript question prompts, syntax validators, and feedback display.' },
      { step: 4, title: 'Polish, Audio, LocalStorage & Deployment', description: 'Add score persistence, responsive styling, sound toggles, and deploy live.' },
    ],
    
    scoring_rubric: [
      { category: 'JavaScript Game Logic & Clean Code', max_points: 30, criteria: 'Proper use of ES6+, functions, modular separation, and zero runtime errors.' },
      { category: 'DOM Manipulation & Interactivity', max_points: 25, criteria: 'Smooth dynamic UI updates, keyboard/touch event handling, and responsive rendering.' },
      { category: 'State & LocalStorage Persistence', max_points: 20, criteria: 'Accurate score/streak calculation and seamless data persistence on refresh.' },
      { category: 'UI/UX & Visual Polish', max_points: 15, criteria: 'Aesthetic consistency, animations, intuitive instructions, and responsive viewport.' },
      { category: 'Documentation & Delivery', max_points: 10, criteria: 'Comprehensive README, clean GitHub commit history, and working deployed URL.' },
    ],
    
    common_mistakes: [
      'Directly modifying state without updating the DOM or vice-versa, causing UI desynchronization.',
      'Accumulating multiple interval timers or event listeners on restart, causing memory leaks and accelerated game speed.',
      'Failing to sanitize code inputs or throwing unhandled exceptions on invalid user input.',
      'Hardcoding screen dimensions so the game breaks on mobile screens.',
    ],
    
    deliverables_checklist: [
      'GitHub repository with clear directory structure and comprehensive README.md',
      'Publicly accessible live deployed application URL (e.g., GitHub Pages, Vercel, Netlify)',
      'Walkthrough demo video (1-3 minutes) or detailed animated GIF in README',
      'Architecture summary explaining state management and game loop implementation',
      'Manual test evidence documenting cross-browser and mobile verification',
    ],
  },

  {
    id: 'proj-spec-html-portfolio',
    topic_id: 'top-004',
    topic_title: 'Web Fundamentals (HTML & CSS)',
    category: 'Web Development',
    track_id: 'common',
    year_id: 'year_1',
    difficulty: 'Beginner',
    estimated_hours: 15,
    title: 'DevCanvas: Responsive Personal Developer Portfolio',
    short_summary: 'Create a visually stunning, responsive personal portfolio website showcasing projects, skills, and technical bio.',
    prerequisites: ['HTML5 semantic elements', 'CSS syntax, selectors, and box model', 'Basic knowledge of Flexbox and Grid'],
    tech_stack: ['Semantic HTML5', 'Modern CSS3 (Variables, Flexbox, Grid)', 'Media Queries', 'CSS Animations & Transitions'],
    
    overview: `DevCanvas is a bespoke, responsive developer portfolio designed to serve as the student's professional digital storefront for tech recruiters, hiring managers, and open-source collaborators. 
    Every software engineer needs a high-impact personal web presence that presents their technical skills, real-world project portfolio, academic achievements, and direct contact avenues.
    
    This project emphasizes craftsmanship in core web fundamentals: pure semantic HTML5 markup, responsive layout grids, CSS custom properties (variables), modern typography, and accessible UX without relying on heavy external CSS frameworks.`,
    
    objectives: [
      'Structure accessible, SEO-optimized web documents with semantic HTML5 tags (<header>, <nav>, <main>, <section>, <article>, <footer>)',
      'Master responsive web design using CSS Flexbox, CSS Grid, and fluid media queries',
      'Create a coherent design system using CSS Custom Properties (colors, spacing, typography scales)',
      'Implement interactive CSS micro-interactions: smooth scrolling, hover transforms, card transitions, and dark mode toggles',
      'Pass WCAG AA accessibility standards including semantic contrast, aria labels, and keyboard focus states',
    ],
    
    core_features: [
      {
        title: 'Hero Section with Animated Tagline & CTA',
        description: 'Prominent introduction with developer headline, short bio, social icons, and primary "View Projects" and "Resume" CTAs.',
        mandatory: true,
      },
      {
        title: 'Technical Skills Matrix',
        description: 'Visual categorizations of technical proficiencies (Languages, Frameworks, Developer Tools, Databases) with stylized tags.',
        mandatory: true,
      },
      {
        title: 'Interactive Project Showcase Gallery',
        description: 'Responsive cards showcasing at least 3 featured projects with screenshots, tech badges, live demo links, and GitHub links.',
        mandatory: true,
      },
      {
        title: 'Experience / Education Timeline',
        description: 'Clean visual chronological timeline highlighting academic milestones, coursework, and technical accomplishments.',
        mandatory: true,
      },
      {
        title: 'Responsive Contact Form & Social Links',
        description: 'Contact form styled with client-side CSS validation states (:valid, :invalid, :focus) and direct mailto / profile links.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Fully responsive single or multi-section portfolio looking flawless from 320px mobile to 1920px desktop',
      'Clean semantic HTML5 structure with proper heading hierarchy (single <h1>, nested <h2>/<h3>)',
      'Responsive navigation bar with sticky header and mobile drawer/menu toggle',
      'Zero layout overflows or horizontal scrolling on mobile viewports',
      'Working links to GitHub, LinkedIn, and live project demos',
    ],
    
    optional_features: [
      'Pure CSS or light JavaScript dark/light theme toggle with LocalStorage preference save',
      'Print stylesheet optimization (@media print) formatting the portfolio as a 1-page clean resume',
      'SVG micro-animations or custom CSS background mesh gradients',
      'Project modal popups for deep-dive technical case studies',
    ],
    
    ui_ux_requirements: `The portfolio must look modern, professional, and elegant. 
    Use a curated color palette (such as sleek dark mode with vibrant accent colors or crisp modern light mode with indigo/amber accents).
    Typography must use modern Google Fonts (e.g. Inter, Outfit, Plus Jakarta Sans) with crisp hierarchy.`,
    
    testing_requirements: [
      'W3C HTML Validator test: zero markup syntax errors',
      'Google Lighthouse Audit score >= 90 in Performance, Accessibility, and Best Practices',
      'Mobile viewport testing on various device resolutions (iPhone, iPad, Desktop monitor)',
      'Keyboard navigation testing ensuring all links and buttons have visible focus outlines',
    ],
    
    milestones: [
      { step: 1, title: 'Design System & Semantic HTML Outline', description: 'Define typography, color tokens, and author all semantic HTML5 sections.' },
      { step: 2, title: 'Desktop Layout with Flexbox & Grid', description: 'Implement hero, skills matrix, and project grid using modern CSS Grid.' },
      { step: 3, title: 'Mobile Responsiveness & Hamburger Menu', description: 'Add media queries and responsive navigation for tablet and mobile devices.' },
      { step: 4, title: 'Transitions, Accessibility Audit & Deployment', description: 'Add micro-animations, verify Lighthouse scores, and deploy to GitHub Pages/Vercel.' },
    ],
    
    scoring_rubric: [
      { category: 'Semantic HTML & Accessibility', max_points: 25, criteria: 'Correct semantic tags, alt attributes, WCAG AA color contrast, and proper hierarchy.' },
      { category: 'Responsive CSS Layouts (Grid/Flexbox)', max_points: 30, criteria: 'Flawless responsive behavior across mobile, tablet, and desktop without horizontal scroll.' },
      { category: 'Design Aesthetics & Typography', max_points: 25, criteria: 'Professional visual design, typography hierarchy, spacing consistency, and animations.' },
      { category: 'Content Completeness & Links', max_points: 10, criteria: 'Real bio, functional project links, skills matrix, and working contact elements.' },
      { category: 'Code Cleanliness & Deployment', max_points: 10, criteria: 'Clean CSS variables, formatted code, and active public deployment URL.' },
    ],
    
    common_mistakes: [
      'Using generic non-semantic <div> tags for every element instead of <section>, <article>, and <nav>.',
      'Hardcoding pixel widths (e.g. width: 1200px) causing catastrophic horizontal scroll on mobile.',
      'Uncompressed large images (5MB+) that degrade page loading performance.',
      'Missing CSS :focus states, making the site inaccessible to keyboard-only users.',
    ],
    
    deliverables_checklist: [
      'GitHub repository containing semantic HTML, CSS stylesheets, and optimized assets',
      'Publicly accessible live deployed website URL (e.g. GitHub Pages, Vercel, Netlify)',
      'Lighthouse audit screenshot demonstrating >= 90 scores',
      'README.md containing design decisions, color palette swatch, and browser support list',
    ],
  },

  {
    id: 'proj-spec-mern-ecommerce',
    topic_id: 'top-005',
    topic_title: 'Web Development: MERN Stack',
    category: 'Web Development',
    track_id: 'common',
    year_id: 'year_1',
    difficulty: 'Intermediate',
    estimated_hours: 35,
    title: 'ApexCart: Amazon-Inspired E-Commerce Platform',
    short_summary: 'Full-stack MERN e-commerce web application featuring product catalogs, product detail views, shopping cart state management, and mock checkout.',
    prerequisites: ['React state & component lifecycle', 'Node.js & Express REST APIs', 'MongoDB schema design & Mongoose'],
    tech_stack: ['MongoDB', 'Express.js', 'React (Vite)', 'Node.js', 'Mongoose ORM', 'JWT Authentication', 'TailwindCSS / Vanilla CSS'],
    
    overview: `ApexCart is an enterprise-inspired full-stack e-commerce web application modeled after modern retail architectures (inspired by platforms like Amazon, Flipkart, and Shopify). 
    The application allows customers to browse a vast catalog across multiple departments, perform real-time keyword search, filter by price and rating, inspect high-resolution product specifications, manage persistent shopping carts, and complete simulated checkout transactions.
    
    Building an end-to-end e-commerce store is the quintessential benchmark project for full-stack developers because it combines complex frontend state management (cart items, quantities, optimistic updates) with robust backend REST APIs, authentication security, database indexing, and transactional data persistence. 
    Note: Students must utilize synthetic mock product data and avoid copying copyrighted branding or proprietary assets.`,
    
    objectives: [
      'Architect a decoupled MERN stack application with Express REST backend and React SPA frontend',
      'Model relational document schemas in MongoDB using Mongoose (Users, Products, Categories, Orders)',
      'Implement robust global state management in React for shopping cart, user session, and search filters',
      'Build secure user authentication and authorization using salted password hashing (bcrypt) and JWT tokens',
      'Create performant server-side pagination, text search indexing, and multi-parameter filtering',
    ],
    
    core_features: [
      {
        title: 'Product Catalog & Multi-Facet Filtering',
        description: 'Browse categorized products with real-time search, category filters, price sorting, and rating filters.',
        mandatory: true,
      },
      {
        title: 'Comprehensive Product Details Page',
        description: 'Detailed view with image galleries, stock availability badges, pricing discounts, and customer reviews.',
        mandatory: true,
      },
      {
        title: 'Persistent Shopping Cart Management',
        description: 'Add to cart, modify item quantities, calculate subtotal and taxes dynamically, and persist cart state.',
        mandatory: true,
      },
      {
        title: 'User Authentication & Protected Profiles',
        description: 'User registration, login with JWT validation, protected order history view, and address management.',
        mandatory: true,
      },
      {
        title: 'Simulated Multi-Step Checkout Flow',
        description: 'Shipping address input, payment method selection, order summary verification, and mock order confirmation receipt with generated order ID.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Functional Express server connected to MongoDB with at least 15 seeded mock products across 3+ categories',
      'Responsive React frontend displaying product grid, detail view, and interactive cart',
      'Working shopping cart allowing item addition, quantity adjustments, item removal, and price recalculations',
      'Complete mock checkout process creating an order document in MongoDB',
      'User signup and login generating valid JWT credentials',
    ],
    
    optional_features: [
      'Customer Product Review & Star Rating Submission system with verified purchase tags',
      'Admin Dashboard for creating, editing, and deleting inventory products and viewing order analytics',
      'Wishlist / Saved for Later functionality toggleable from product cards',
      'Discount coupon code engine applying percentage or fixed price reductions at checkout',
    ],
    
    ui_ux_requirements: `The user interface should feel fast, modern, and reliable. 
    Incorporate e-commerce UX best practices: sticky header with search bar and cart count badge, breadcrumbs navigation, clear delivery date estimates, and high-contrast "Add to Cart" and "Buy Now" buttons.
    Ensure seamless responsiveness from mobile smartphone screens to high-resolution desktop displays.`,
    
    testing_requirements: [
      'Backend API endpoint testing with Postman or ThunderClient (CRUD for products, cart, and orders)',
      'Frontend form validation testing (invalid emails, short passwords, negative quantities)',
      'Database validation: ensure orders cannot be placed with negative quantities or invalid product IDs',
      'Cross-browser and mobile responsive testing',
    ],
    
    milestones: [
      { step: 1, title: 'Database Schema & Mock Data Seeding', description: 'Design Mongoose models (User, Product, Order) and seed synthetic product catalog.' },
      { step: 2, title: 'Backend REST API & JWT Auth', description: 'Build Express routes for products, auth, cart, and orders with JWT middleware.' },
      { step: 3, title: 'Frontend Product Catalog & Cart', description: 'Build React UI with catalog browsing, search/filter, and persistent cart state.' },
      { step: 4, title: 'Checkout Flow, Testing & Cloud Deployment', description: 'Complete order placement flow, test end-to-end, and deploy frontend and backend.' },
    ],
    
    scoring_rubric: [
      { category: 'Full-Stack Architecture & API Design', max_points: 25, criteria: 'Clean REST endpoints, proper HTTP status codes, modular controllers, and Mongoose modeling.' },
      { category: 'Cart & State Management', max_points: 25, criteria: 'Seamless cart modifications, accurate price/tax math, and persistent state across reloads.' },
      { category: 'Authentication & Security', max_points: 15, criteria: 'Secure password hashing with bcrypt, JWT authorization guards, and sanitized inputs.' },
      { category: 'Frontend UI/UX & Responsiveness', max_points: 20, criteria: 'Polished e-commerce layout, fast search/filtering, responsive design, and intuitive flow.' },
      { category: 'Testing, Documentation & Live Deployment', max_points: 15, criteria: 'Comprehensive README, .env.example, seed script, and working live deployed demo.' },
    ],
    
    common_mistakes: [
      'Calculating prices and totals on the client side only, which allows malicious payload tampering.',
      'Committing MongoDB connection strings or JWT secret keys directly into the public GitHub repository.',
      'Failing to handle CORS configuration when frontend and backend run on different domains or ports.',
      'Not displaying user-friendly loading skeletons or spinners during network requests.',
    ],
    
    deliverables_checklist: [
      'GitHub repository containing client and server directories, package.json, and .env.example',
      'Live deployed application URL (e.g., Render/Railway for backend, Vercel/Netlify for frontend)',
      'Database ER diagram and API endpoint documentation in README.md',
      'Database seed script (npm run seed) allowing evaluators to populate mock products immediately',
      'Brief video walkthrough demonstration or screenshots showing cart and checkout flows',
    ],
  },

  {
    id: 'proj-spec-api-weather',
    topic_id: 'top-007',
    topic_title: 'API Fundamentals & Design',
    category: 'Tools & APIs',
    track_id: 'common',
    year_id: 'year_1',
    difficulty: 'Beginner',
    estimated_hours: 15,
    title: 'SkyPulse: Production Weather Intelligence Application',
    short_summary: 'Production-ready weather application that consumes external REST weather APIs, displays current & forecast metrics, and includes a verified Postman collection.',
    prerequisites: ['REST API architecture (GET requests, status codes)', 'Asynchronous JavaScript (fetch, async/await)', 'JSON object parsing'],
    tech_stack: ['JavaScript (ES6+)', 'OpenWeatherMap API / WeatherAPI', 'HTML5 & CSS3', 'Postman API Platform', 'Geolocation API'],
    
    overview: `SkyPulse is a responsive, production-ready weather application that demonstrates professional consumption and handling of external RESTful Web APIs. 
    Users can look up real-time weather conditions for any city globally, view hourly trends and multi-day meteorological forecasts, utilize browser geolocation for local climate telemetry, and toggle between metric and imperial measurement systems.
    
    Consuming third-party external APIs is one of the most common tasks required of frontend and full-stack software engineers. This project emphasizes API error handling (404 Not Found, 401 Invalid Key, 429 Rate Limits), network resilience, asynchronous state handling (loading states, debounced search), and formal API testing using Postman collections.`,
    
    objectives: [
      'Master asynchronous HTTP communication using the native Fetch API and async/await syntax',
      'Handle API error conditions and HTTP status codes gracefully in the client UI',
      'Parse complex nested JSON response structures and map them to dynamic UI components',
      'Implement debounced search input to optimize network request frequency and avoid rate limits',
      'Author and export a complete Postman Collection with automated test scripts and assertions',
    ],
    
    core_features: [
      {
        title: 'Global City Weather Search with Autocomplete',
        description: 'Search bar supporting city names with debouncing and instant weather retrieval.',
        mandatory: true,
      },
      {
        title: 'Comprehensive Current Weather Telemetry',
        description: 'Displays current temperature, "feels like" metric, humidity, wind speed, atmospheric pressure, and weather condition icon.',
        mandatory: true,
      },
      {
        title: '5-Day / 24-Hour Forecast Visualizer',
        description: 'Forecast cards displaying expected temperature ranges, precipitation chance, and daily weather patterns.',
        mandatory: true,
      },
      {
        title: 'Geolocation Automatic Detection',
        description: '"Locate Me" button querying the browser Geolocation API to fetch coordinates and display local weather.',
        mandatory: true,
      },
      {
        title: 'Unit Conversion Toggle & State Persistence',
        description: 'One-click switch between Celsius (°C) and Fahrenheit (°F) with persistent user preference.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Search for any valid city and successfully display real-time weather data from a live weather API',
      'Handle invalid city searches gracefully with clear "City not found" UI messages (no unhandled rejections)',
      'Display temperature, weather description, icon, humidity, and wind speed accurately',
      'Clean responsive layout matching modern mobile and desktop weather dashboard standards',
      'Include an exported Postman Collection testing the API endpoints with status code assertions',
    ],
    
    optional_features: [
      'Interactive historical temperature chart or radar map using Chart.js or Leaflet',
      'Air Quality Index (AQI) telemetry display with health recommendations',
      'Favorite Cities drawer saving bookmarked locations in LocalStorage for 1-click access',
      'Dynamic CSS background theme changing according to current weather condition (Sunny, Rainy, Snow, Thunderstorm)',
    ],
    
    ui_ux_requirements: `Design a sleek, modern glassmorphism or minimalist card interface.
    Display distinct, high-quality weather icons (SVG or animated icons) corresponding to the weather condition codes.
    Ensure loading skeletons or spinners display during API latency so the interface never feels frozen.`,
    
    testing_requirements: [
      'Postman Collection with at least 5 automated tests verifying: Status code 200 on valid city, Status code 404 on invalid city, response time < 1000ms, and JSON schema structure',
      'Client-side error handling verification when network is disconnected (offline notification)',
      'Validation that API keys are stored via environment variables (.env) and never hardcoded in repository code',
    ],
    
    milestones: [
      { step: 1, title: 'API Account & Postman Workspace Setup', description: 'Obtain API key, test endpoints in Postman, and create automated test assertions.' },
      { step: 2, title: 'UI Dashboard Layout & Weather Cards', description: 'Build responsive dashboard layout with search bar, current conditions card, and forecast grid.' },
      { step: 3, title: 'API Fetch Integration & Error Handling', description: 'Implement fetch logic, async/await error try/catch blocks, and loading states.' },
      { step: 4, title: 'Geolocation, Unit Toggle & Deployment', description: 'Add browser GPS detection, °C/°F toggling, and deploy live application.' },
    ],
    
    scoring_rubric: [
      { category: 'API Integration & Asynchronous Handling', max_points: 30, criteria: 'Clean async/await code, proper parameter encoding, debouncing, and robust error handling.' },
      { category: 'Postman Collection & API Testing', max_points: 25, criteria: 'Exported Postman collection with parameterized tests, environment variables, and status checks.' },
      { category: 'UI/UX & Weather Dashboard Aesthetics', max_points: 25, criteria: 'Visual polish, responsive design, clear condition indicators, and loading feedback.' },
      { category: 'Geolocation & Unit Conversion', max_points: 10, criteria: 'Flawless execution of GPS coordinate lookup and accurate unit conversion math.' },
      { category: 'Documentation & Environment Security', max_points: 10, criteria: 'Clear README with API setup guide, .env.example, and working deployed demonstration.' },
    ],
    
    common_mistakes: [
      'Hardcoding private API keys in client-side code pushed to public GitHub repositories.',
      'Failing to handle 404 response codes when users enter misspelled cities, causing application crashes.',
      'Firing an API request on every single keypress without debouncing, quickly depleting free API rate limits.',
      'Failing to handle browser geolocation permission denials gracefully.',
    ],
    
    deliverables_checklist: [
      'GitHub repository with complete source code, .env.example, and documentation',
      'Publicly accessible live deployed application URL (e.g. Vercel, Netlify, GitHub Pages)',
      'Exported Postman Collection JSON file (skypulse_weather_postman_collection.json)',
      'Architecture summary detailing API request/response lifecycle and rate limit mitigations',
      'Screenshot of Postman test runner passing all endpoint test assertions',
    ],
  },

  {
    id: 'proj-spec-genai-3d',
    topic_id: 'top-008',
    topic_title: 'Prompt Engineering & Generative AI Studio',
    category: 'Generative AI & LLMs',
    track_id: 'common',
    year_id: 'year_1',
    difficulty: 'Intermediate',
    estimated_hours: 30,
    title: 'CosmoLearn 3D: Immersive Conceptual Learning & AI Tutor',
    short_summary: 'An interactive, 3D-visualized educational platform explaining complex scientific or engineering concepts through 3D spatial models and AI-assisted tutoring.',
    prerequisites: ['Prompt engineering principles (zero-shot, few-shot, system prompts)', 'Basic 3D / WebGL scene understanding (Three.js or model-viewer)', 'JavaScript event handling'],
    tech_stack: ['Three.js / WebGL / React Three Fiber', 'Google Gemini / Generative AI Studio API', 'HTML5 / Modern CSS', 'JavaScript (ES6+)'],
    
    overview: `CosmoLearn 3D is a next-generation interactive educational platform designed to bridge abstract academic theory and intuitive spatial understanding. 
    The platform renders interactive 3D visualizations of complex engineering or scientific concepts (such as the Solar System, the Human Heart, an Internal Combustion Engine, or a Computer Processor Architecture) that learners can freely rotate, zoom, dissect, and inspect in real-time 3D space.
    
    Paired with the 3D canvas is an embedded Generative AI Pedagogical Assistant powered by structured prompt engineering. When a student clicks any 3D anatomical part or celestial body, the AI tutor provides age-adaptive explanations, real-world analogies, conceptual quizzes, and answers freeform student questions while strictly avoiding hallucinations through engineered system guardrails.`,
    
    objectives: [
      'Implement an interactive 3D learning canvas using Three.js or WebGL with camera orbit controls and object raycasting',
      'Design and deploy production-grade system prompts with few-shot examples and strict output schemas',
      'Integrate the Google Gemini or Generative AI Studio API to power contextual explanations and dynamic tutoring',
      'Implement guardrails that ground the AI responses strictly in verified educational facts and prevent hallucinations',
      'Create an intuitive, responsive educational UI that harmonizes 3D spatial navigation with text-based AI dialogue',
    ],
    
    core_features: [
      {
        title: 'Interactive 3D Learning Canvas',
        description: 'Smooth 3D scene (orbit controls, zoom, pan) featuring a multi-component interactive model with interactive hot-spots.',
        mandatory: true,
      },
      {
        title: 'Component Inspection & Telemetry Cards',
        description: 'Clicking any component in 3D space highlights the part and opens a structured conceptual lesson card.',
        mandatory: true,
      },
      {
        title: 'AI-Assisted Educational Explainer',
        description: 'Context-aware AI tutor answering questions about the selected 3D component with customizable complexity (Explain Like I am 10 vs. University Level).',
        mandatory: true,
      },
      {
        title: 'Interactive AI Concept Check Quiz',
        description: 'Generates targeted multiple-choice check questions based on the active 3D model to assess learner comprehension.',
        mandatory: true,
      },
      {
        title: 'Strict Prompt Guardrails & Safety Architecture',
        description: 'System prompt architecture ensuring the AI stays on curriculum topic and gracefully declines off-topic prompts.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Fully functional 3D canvas rendering at least one detailed multi-part model (e.g. Solar System, Molecule, or Hardware Engine) with smooth mouse/touch orbit controls',
      'Raycasting or click-detection that identifies individual components upon user selection',
      'Working integration with Generative AI Studio / Gemini API (or structured mock fallback if quota exceeded)',
      'Pre-engineered system prompts providing structured pedagogical answers without hallucination',
      'Responsive design ensuring 3D canvas and AI sidebar work on desktop and mobile viewports',
    ],
    
    optional_features: [
      'Text-to-speech audio narration using Web Speech API for auditory learners',
      'VR / XR viewing mode for immersive headset learning',
      'Interactive 3D exploded view slider separating multi-part assemblies',
      'Multi-language translation prompt toggle explaining concepts in Spanish, French, Hindi, etc.',
    ],
    
    ui_ux_requirements: `The interface must balance immersive 3D visualization with accessible typography and clean dialogue cards.
    Ensure 3D camera transitions to selected components are smooth (tweening/easing).
    The AI chat sidebar must display clear loading states while tokens stream or generate.`,
    
    testing_requirements: [
      'Prompt robustness testing: test adversarial or off-topic prompts to verify system guardrails keep responses focused on educational topics',
      'WebGL performance testing: ensure steady 30-60 FPS rendering without memory leaks across component selections',
      'Cross-device responsive test: verify touch controls on mobile devices (pinch-to-zoom, touch-rotate)',
    ],
    
    milestones: [
      { step: 1, title: '3D Scene & Asset Integration', description: 'Set up Three.js scene, lighting, camera controls, and load interactive 3D model.' },
      { step: 2, title: 'Raycasting & Interaction Layer', description: 'Implement click/touch detection on 3D objects and display educational info cards.' },
      { step: 3, title: 'Prompt Engineering & AI API Integration', description: 'Design system prompts in Generative AI Studio and connect Gemini API for tutoring.' },
      { step: 4, title: 'Quizzing, Guardrails & Cloud Deployment', description: 'Implement comprehension checks, enforce guardrails, and deploy live application.' },
    ],
    
    scoring_rubric: [
      { category: '3D Visualization & Interactivity', max_points: 30, criteria: 'Smooth 3D canvas, responsive camera controls, raycasting component selection, and model detail.' },
      { category: 'Prompt Engineering Quality & Guardrails', max_points: 30, criteria: 'Sophisticated system prompts, persona control, zero-shot/few-shot design, and hallucination prevention.' },
      { category: 'AI Integration & Pedagogical Value', max_points: 20, criteria: 'Seamless API integration, structured responses, adaptive difficulty, and interactive quizzing.' },
      { category: 'UI/UX Design & Responsiveness', max_points: 10, criteria: 'Harmonious layout combining 3D scene and AI chat with responsive mobile support.' },
      { category: 'Documentation & Live Deployment', max_points: 10, criteria: 'Comprehensive README detailing prompt architectures, system prompts, and working deployed URL.' },
    ],
    
    common_mistakes: [
      'Using massive uncompressed 3D models (>50MB) that freeze the browser during initial download.',
      'Unconstrained prompts that allow the AI to wander off topic or produce overly verbose unstructured responses.',
      'Failing to handle API rate limits or quota errors gracefully in the client UI.',
      'Camera controls that clip into 3D geometry or lose track of the model on extreme zoom.',
    ],
    
    deliverables_checklist: [
      'GitHub repository with complete frontend code, 3D assets, and .env.example',
      'Publicly accessible live deployed application URL (e.g. Vercel, Netlify)',
      'Prompt Engineering Specification Document in README detailing system prompts, few-shot examples, and guardrail rules',
      'Video demonstration walkthrough (1-2 minutes) showing 3D interaction and AI pedagogical tutoring in action',
    ],
  },

  {
    id: 'proj-spec-fastapi-hospital',
    topic_id: 'top-009',
    topic_title: 'Python Frameworks: FastAPI and Django',
    category: 'Backend Frameworks',
    track_id: 'fullstack',
    year_id: 'year_2',
    difficulty: 'Intermediate',
    estimated_hours: 35,
    title: 'CarePulse: Enterprise Hospital Management System (FastAPI)',
    short_summary: 'High-performance asynchronous Hospital Management System backend built with FastAPI, Pydantic, SQLAlchemy, and JWT Role-Based Access Control using synthetic patient data.',
    prerequisites: ['Python 3.10+ async/await', 'FastAPI routing & dependency injection', 'Relational database schema modeling with SQL / SQLAlchemy'],
    tech_stack: ['Python 3.11+', 'FastAPI', 'Pydantic v2', 'SQLAlchemy / SQLModel', 'PostgreSQL / SQLite', 'Uvicorn', 'JWT (python-jose)', 'Passlib (bcrypt)'],
    
    overview: `CarePulse is an enterprise-grade asynchronous backend information system engineered for clinical healthcare environments. 
    The platform digitalizes clinical workflows including patient intake and registration, doctor department scheduling, appointment conflict detection, electronic medical consultation records (EMR), and patient discharge summaries.
    
    In modern healthcare software (such as Epic or Cerner), performance, data integrity, and strict confidentiality are paramount. Building this system in FastAPI showcases the power of Python's modern asynchronous ecosystem: high concurrency request handling, automated Pydantic schema validation, self-documenting OpenAPI/Swagger specifications, and fine-grained Role-Based Access Control (Admin, Doctor, Receptionist, Patient).
    
    IMPORTANT COMPLIANCE NOTE: Students must strictly utilize synthetic mock patient records. Do NOT use real patient or personally identifiable information (PII).`,
    
    objectives: [
      'Architect a modular, asynchronous REST API service using FastAPI and Pydantic v2 schemas',
      'Implement relational database persistence with SQLAlchemy async sessions and migrations',
      'Design fine-grained Role-Based Access Control (RBAC) protecting clinical endpoints via JWT bearer dependencies',
      'Implement clinical business logic: appointment slot conflict detection and doctor schedule management',
      'Deliver automated interactive API documentation compliant with OpenAPI 3.0 / Swagger standards',
    ],
    
    core_features: [
      {
        title: 'Authentication & Role-Based Access Control (RBAC)',
        description: 'JWT token-based auth with distinct roles: Hospital Admin, Doctor, Receptionist, and Patient. Endpoints enforce strict role permissions.',
        mandatory: true,
      },
      {
        title: 'Synthetic Patient Registration & Profiles',
        description: 'CRUD operations for patient intake: synthetic demographics, emergency contacts, blood group, allergies, and insurance provider data.',
        mandatory: true,
      },
      {
        title: 'Doctor Directory & Department Scheduling',
        description: 'Doctor profile management: department categorization, consultation fees, available weekly shift time slots, and room assignments.',
        mandatory: true,
      },
      {
        title: 'Appointment Booking & Slot Conflict Engine',
        description: 'Appointment scheduling engine verifying doctor availability and preventing double-booking on overlapping time windows.',
        mandatory: true,
      },
      {
        title: 'Medical Records & Prescription Tracking',
        description: 'Doctor consultation notes, diagnosis ICD codes, prescription items (dosage, frequency), and medical history logging.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'FastAPI application running on Uvicorn with clean modular directory structure (routers, models, schemas, auth, core)',
      'Relational database tables: Users, Patients, Doctors, Appointments, MedicalRecords',
      'Working JWT authentication flow with role verification dependencies',
      'Complete appointment booking endpoint with validation preventing double-booking of doctor time slots',
      'Interactive Swagger UI accessible at /docs with complete request/response examples for every endpoint',
    ],
    
    optional_features: [
      'Async background tasks (FastAPI BackgroundTasks) dispatching simulated appointment confirmation emails or SMS alerts',
      'Automated PDF medical report generator generating formatted discharge summaries',
      'Doctor productivity and clinical revenue reporting endpoint with aggregate SQL queries',
      'Production Dockerfile and Docker Compose setup deploying FastAPI with PostgreSQL and PgAdmin',
    ],
    
    ui_ux_requirements: `The backend must provide comprehensive Swagger/OpenAPI interactive documentation (/docs and /redoc). 
    Every endpoint must specify response models, summary descriptions, error response codes (400, 401, 403, 404, 422), and realistic synthetic payload examples.`,
    
    testing_requirements: [
      'Automated test suite using pytest and FastAPI TestClient (httpx) testing authentication, patient creation, and appointment conflict validation',
      'Test coverage report demonstrating >= 80% code coverage on core router modules',
      'Synthetic data generator script populating the database with realistic test doctors and synthetic patients',
    ],
    
    milestones: [
      { step: 1, title: 'Database Models & Pydantic Schemas', description: 'Design SQLAlchemy models and Pydantic request/response validation schemas.' },
      { step: 2, title: 'JWT Authentication & Role Dependencies', description: 'Implement password hashing, token generation, and FastAPI security dependencies for RBAC.' },
      { step: 3, title: 'Clinical Routers & Appointment Logic', description: 'Build patient, doctor, and appointment routers with double-booking prevention logic.' },
      { step: 4, title: 'Pytest Suite, Swagger Polish & Deployment', description: 'Write automated pytest test cases, polish documentation, and deploy to cloud (Render/Fly.io).' },
    ],
    
    scoring_rubric: [
      { category: 'FastAPI Architecture & Async Endpoints', max_points: 30, criteria: 'Idiomatic FastAPI patterns, async database operations, dependency injection, and clean routing.' },
      { category: 'Clinical Logic & Conflict Detection', max_points: 25, criteria: 'Accurate scheduling algorithm preventing overlapping doctor appointments and validating dates.' },
      { category: 'Security & Role-Based Access Control', max_points: 20, criteria: 'Secure JWT implementation, proper password hashing with bcrypt, and correct role guards.' },
      { category: 'Automated Testing with Pytest', max_points: 15, criteria: 'Comprehensive test suite testing success and failure paths with TestClient fixtures.' },
      { category: 'Documentation & Deployment', max_points: 10, criteria: 'Flawless Swagger UI, detailed README.md with setup instructions, and working deployed URL.' },
    ],
    
    common_mistakes: [
      'Allowing overlapping appointments for the same doctor at the same time.',
      'Using synchronous database calls inside async def routes, blocking the FastAPI event loop.',
      'Returning unhandled 500 Internal Server Errors instead of clean HTTP 400/404/422 status codes on invalid inputs.',
      'Failing to isolate environment variables (database credentials, JWT secret key) into a .env file.',
    ],
    
    deliverables_checklist: [
      'GitHub repository containing FastAPI source code, requirements.txt, pytest suite, and .env.example',
      'Publicly accessible live deployed API URL (with active /docs Swagger interface)',
      'Database ER diagram and schema documentation in README.md',
      'Synthetic data seed script (e.g. python seed_data.py) generating mock hospital records',
      'Pytest test execution output demonstrating passing test suite',
    ],
  },

  {
    id: 'proj-spec-springboot-hospital',
    topic_id: 'top-010',
    topic_title: 'Java Framework: Spring Boot',
    category: 'Backend Frameworks',
    track_id: 'fullstack',
    year_id: 'year_2',
    difficulty: 'Intermediate',
    estimated_hours: 35,
    title: 'MediCare: Enterprise Hospital Management System (Spring Boot)',
    short_summary: 'Enterprise-grade Hospital Management System microservice built with Spring Boot, Spring Data JPA, Hibernate, and Spring Security with JWT and role-based permissions.',
    prerequisites: ['Java 17+ OOP principles', 'Spring Boot fundamentals & annotations', 'Relational database concepts & SQL'],
    tech_stack: ['Java 17 / 21', 'Spring Boot 3.x', 'Spring Data JPA / Hibernate', 'Spring Security', 'JWT (jjwt)', 'H2 / PostgreSQL', 'Maven / Gradle', 'Lombok'],
    
    overview: `MediCare is an enterprise healthcare management microservice engineered using the enterprise Java Spring Boot ecosystem. 
    The platform provides robust, transactional business capabilities for hospital administration: patient admissions, medical staff directory, appointment scheduling with transactional conflict locks, prescription medication orders, and role-based access control.
    
    Enterprise healthcare institutions depend heavily on Java and Spring Boot due to its strong type safety, mature ecosystem, transactional reliability (@Transactional), and battle-tested security framework (Spring Security). 
    This project challenges students to design an enterprise-ready system architecture featuring layered separation of concerns (Controllers, Services, Repositories, DTOs, Exception Handlers) adhering to corporate Java engineering standards.
    
    IMPORTANT COMPLIANCE NOTE: Use synthetic mock patient data only. Do not use real patient health information.`,
    
    objectives: [
      'Architect an enterprise Spring Boot application with strict layered architecture (Controller -> Service -> Repository -> Entity)',
      'Implement relational persistence and entity relationships (@OneToMany, @ManyToOne) using Spring Data JPA and Hibernate',
      'Secure REST endpoints using Spring Security filter chains and stateless JWT authentication with role authorization (ADMIN, DOCTOR, RECEPTIONIST, PATIENT)',
      'Implement atomic transactional business logic preventing double-booking using @Transactional and database constraints',
      'Build standardized global exception handling using @RestControllerAdvice and RFC-7807 Problem Details envelopes',
    ],
    
    core_features: [
      {
        title: 'Spring Security with JWT & Role-Based Access Control',
        description: 'Stateless JWT authentication filter with roles: ADMIN, DOCTOR, RECEPTIONIST, and PATIENT protecting respective resource endpoints.',
        mandatory: true,
      },
      {
        title: 'Patient Intake & Admissions Management',
        description: 'JPA entities and endpoints for synthetic patient demographics, medical history, emergency contacts, and admission status.',
        mandatory: true,
      },
      {
        title: 'Doctor & Department Staff Roster',
        description: 'Management of medical doctors, departments (Cardiology, Neurology, Pediatrics, General), consultation fees, and shift availability.',
        mandatory: true,
      },
      {
        title: 'Transactional Appointment Booking Engine',
        description: 'Service-layer method with @Transactional isolation verifying doctor availability and preventing double-booking.',
        mandatory: true,
      },
      {
        title: 'Electronic Medical Records & Prescription Tracking',
        description: 'Clinical consultation notes, diagnosis records, and prescription line items with dosage instructions.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Spring Boot 3 application executing on port 8080 with clean Maven/Gradle build',
      'JPA Entities: User, Patient, Doctor, Appointment, MedicalRecord with proper foreign key mappings',
      'Spring Security configuration with custom JwtAuthenticationFilter validating bearer tokens',
      'Appointment booking service with validation preventing double-booking of doctor schedules',
      'Global exception handler catching EntityNotFoundException, ConflictException, and MethodArgumentNotValidException',
    ],
    
    optional_features: [
      'Spring Boot Actuator health and metrics monitoring endpoints (/actuator/health)',
      'Swagger / SpringDoc OpenAPI 3 documentation generating interactive UI at /swagger-ui.html',
      'Flyway or Liquibase database migration scripts managing schema evolution',
      'Integration testing with @SpringBootTest and in-memory H2 / Testcontainers',
    ],
    
    ui_ux_requirements: `Provide comprehensive Springdoc / Swagger OpenAPI interactive UI documentation (/swagger-ui.html). 
    All error responses must follow standardized JSON error envelopes containing timestamp, status code, error message, and validation details.`,
    
    testing_requirements: [
      'Unit testing service layer business logic with JUnit 5 and Mockito (@ExtendWith(MockitoExtension.class))',
      'Controller integration tests using @WebMvcTest or @SpringBootTest verifying status codes and security restrictions',
      'Verification of transactional rollback when an appointment booking encounters a conflict',
    ],
    
    milestones: [
      { step: 1, title: 'Entity Modeling & Spring Data JPA Repositories', description: 'Define JPA entities with relationships, enums, and repository query methods.' },
      { step: 2, title: 'Spring Security & JWT Authentication', description: 'Configure SecurityFilterChain, UserDetailsService, and JwtTokenProvider.' },
      { step: 3, title: 'Service Layer & Transactional Logic', description: 'Implement patient, doctor, and appointment business services with conflict detection.' },
      { step: 4, title: 'REST Controllers, Swagger & Deployment', description: 'Expose REST controllers, configure global exception handling, and deploy (Render/Railway/AWS).' },
    ],
    
    scoring_rubric: [
      { category: 'Enterprise Spring Boot Architecture', max_points: 30, criteria: 'Adherence to layered architecture, proper dependency injection, and clean DTO-Entity mapping.' },
      { category: 'Spring Security & JWT Implementation', max_points: 25, criteria: 'Correct SecurityFilterChain configuration, stateless token validation, and role authorization.' },
      { category: 'Data JPA & Transactional Integrity', max_points: 20, criteria: 'Proper JPA relationship mapping, @Transactional usage, and conflict prevention logic.' },
      { category: 'Testing with JUnit & Mockito', max_points: 15, criteria: 'Quality unit and integration tests covering business rules and edge cases.' },
      { category: 'Documentation & Cloud Deployment', max_points: 10, criteria: 'Complete README, pom.xml configuration, Swagger UI, and working deployed demonstration.' },
    ],
    
    common_mistakes: [
      'Returning JPA entity objects directly from REST controllers instead of clean Data Transfer Objects (DTOs), risking infinite recursion loops with bidirectional relationships.',
      'Missing @Transactional annotations on multi-step booking operations, leading to inconsistent database states on failure.',
      'Hardcoding JWT secret keys or database passwords in application.properties instead of environment variables.',
      'Failing to handle NullPointerExceptions or foreign key constraint violations gracefully in a global controller advice.',
    ],
    
    deliverables_checklist: [
      'GitHub repository containing complete Spring Boot project (pom.xml or build.gradle, src/)',
      'Publicly accessible live deployed microservice URL (with active Swagger /swagger-ui.html)',
      'Database ER diagram and class relationship diagram in README.md',
      'Data initialization script (data.sql or CommandLineRunner) populating synthetic test data',
      'JUnit test execution report demonstrating passing test suite',
    ],
  },

  {
    id: 'proj-spec-dbms-notes',
    topic_id: 'top-013',
    topic_title: 'Database Management: MySQL & MongoDB',
    category: 'Databases',
    track_id: 'fullstack',
    year_id: 'year_2',
    difficulty: 'Intermediate',
    estimated_hours: 25,
    title: 'NoteNest: Session-Managed Multi-User Note-Taking Application',
    short_summary: 'Full-featured note-taking application supporting full CRUD operations, session-based authentication, relational user management in MySQL, and flexible document note storage in MongoDB.',
    prerequisites: ['Relational database schema design & SQL', 'Document database CRUD & MongoDB', 'Server-side session management (express-session / flask-session)'],
    tech_stack: ['Node.js (Express) or Python (FastAPI/Flask)', 'MySQL (User Accounts & Auth)', 'MongoDB (Notes & Tags)', 'Redis / Express-Session', 'TailwindCSS / HTML5'],
    
    overview: `NoteNest is an enterprise-grade multi-user note-taking platform engineered to master polyglot persistence and server-side session handling. 
    The platform allows authenticated users to create, view, organize, edit, and delete personal and collaborative notes formatted in rich text and markdown.
    
    Modern software platforms frequently leverage polyglot database architectures: relational databases (MySQL/PostgreSQL) for transactional user accounts and ACID-compliant authentication records, paired with document databases (MongoDB) for unstructured, flexible content schemas like notes, tags, and revisions. 
    This project emphasizes complete session management—secure session cookies, server-side session stores, session expiry, and session invalidation upon logout—with persistent database operations.`,
    
    objectives: [
      'Implement stateful session-based authentication using server-side session stores and secure HTTP-only cookies',
      'Design a dual-database polyglot architecture: MySQL for structured user auth and MongoDB for flexible note documents',
      'Implement full CRUD operations (Create, Read, Update, Delete) with search, tag filtering, and pagination',
      'Ensure data isolation so users can only access, modify, or delete their own authorized notes',
      'Handle session invalidation, session expiration, and protection against session fixation attacks',
    ],
    
    core_features: [
      {
        title: 'Server-Side Session Management',
        description: 'Stateful session authentication with HTTP-only, SameSite cookies, session expiry timers, and complete session destruction on logout.',
        mandatory: true,
      },
      {
        title: 'Relational User Account Storage (MySQL)',
        description: 'Structured MySQL table storing user credentials (bcrypt hashed passwords), account verification, and session state audit logs.',
        mandatory: true,
      },
      {
        title: 'Document Note Storage (MongoDB)',
        description: 'MongoDB notes collection storing note title, body (markdown/rich text), custom tags, pin status, and last modified timestamps.',
        mandatory: true,
      },
      {
        title: 'Full Note CRUD Operations',
        description: 'Create new notes, view paginated note lists, search by title/content, edit notes, and delete (soft/hard delete).',
        mandatory: true,
      },
      {
        title: 'Categorization, Tags & Fast Search',
        description: 'Tagging system allowing multiple tags per note and instant filtering by category or keyword.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Working backend connecting concurrently to both a MySQL database instance and a MongoDB database instance',
      'Session-based login, signup, and logout flow storing sessions on the server (Redis, MySQL session store, or MongoDB store)',
      'Complete CRUD endpoints for notes with strict user ownership validation (Users cannot read or edit another user\'s notes)',
      'Responsive web frontend allowing note creation, markdown viewing, editing, and deletion',
      'Session destruction on logout ensuring the back button does not expose authenticated session data',
    ],
    
    optional_features: [
      'Note version history / revision audit log storing previous edit snapshots in MongoDB',
      'Shared collaborative notes allowing users to invite collaborators with read/write permissions',
      'Rich Markdown editor preview with real-time syntax highlighting and code block formatting',
      'Trash bin / Soft-delete with 30-day auto-expiry or restore capability',
    ],
    
    ui_ux_requirements: `Design a clean, distraction-free productivity interface inspired by Notion, Google Keep, or Bear Notes.
    Provide responsive sidebar navigation showing note folders, tags, and account settings.
    Ensure autosave indicators or save confirmation toasts provide peace of mind to users.`,
    
    testing_requirements: [
      'Session security test: verify session cookies are marked HttpOnly and cannot be accessed via document.cookie',
      'Ownership authorization test: verify that attempting to GET/PUT/DELETE another user\'s note ID returns 403 Forbidden',
      'Database persistence test: restart the backend server and verify that active sessions and notes persist',
      'Input validation tests preventing SQL injection in MySQL and NoSQL injection in MongoDB',
    ],
    
    milestones: [
      { step: 1, title: 'Database Setup & Polyglot Schema Modeling', description: 'Configure MySQL tables for users and MongoDB collections for notes and tags.' },
      { step: 2, title: 'Session Authentication Middleware', description: 'Implement express-session with secure cookie settings, login, signup, and logout routes.' },
      { step: 3, title: 'Note CRUD API & Authorization', description: 'Build note creation, retrieval, update, and deletion routes with user ownership validation.' },
      { step: 4, title: 'Frontend UI, Search, Testing & Deployment', description: 'Build responsive UI, integrate search/tag filtering, and deploy to cloud.' },
    ],
    
    scoring_rubric: [
      { category: 'Polyglot Database Architecture (MySQL + MongoDB)', max_points: 30, criteria: 'Appropriate allocation of data concerns, proper relational schemas in MySQL, and flexible schema in MongoDB.' },
      { category: 'Session Management & Security', max_points: 25, criteria: 'Secure session implementation, HttpOnly cookies, session destruction on logout, and auth middleware.' },
      { category: 'CRUD Functionality & Data Isolation', max_points: 25, criteria: 'Complete note CRUD operations, user isolation verification, and search/tag filtering.' },
      { category: 'Frontend UI/UX & Responsiveness', max_points: 10, criteria: 'Clean note-taking workspace, responsive layouts, and clear feedback messages.' },
      { category: 'Documentation, Testing & Deployment', max_points: 10, criteria: 'Comprehensive README, database seed scripts, schema diagrams, and working deployed URL.' },
    ],
    
    common_mistakes: [
      'Storing session data in server memory (MemoryStore) which causes session loss whenever the server restarts or scales.',
      'Allowing Insecure Direct Object References (IDOR) by letting any authenticated user view another user\'s note by guessing note ID.',
      'Failing to destroy the server session and clear the client cookie upon user logout.',
      'Mixing database connections haphazardly without proper connection pooling and error handling.',
    ],
    
    deliverables_checklist: [
      'GitHub repository containing complete source code, database configuration scripts, and .env.example',
      'Publicly accessible live deployed application URL',
      'Database Architecture documentation with MySQL schema and MongoDB document schema diagrams',
      'Testing report demonstrating session security and user data isolation tests',
    ],
  },

  {
    id: 'proj-spec-docker-container',
    topic_id: 'top-014',
    topic_title: 'Docker & Containerization',
    category: 'DevOps & Cloud',
    track_id: 'fullstack',
    year_id: 'year_2',
    difficulty: 'Intermediate',
    estimated_hours: 20,
    title: 'ProductionStack: Enterprise Multi-Service Containerization',
    short_summary: 'Students containerize an existing LMS web application or completed project using multi-stage Dockerfiles, Docker Compose multi-service orchestration, volumes, and healthchecks.',
    prerequisites: ['Docker CLI basics', 'Understanding of client-server application architecture', 'Environment variable configuration'],
    tech_stack: ['Docker', 'Dockerfile (Multi-Stage)', 'Docker Compose', 'Linux Alpine / Distroless', 'Nginx (Optional Reverse Proxy)', 'Volume Management'],
    
    overview: `ProductionStack is a hands-on DevOps containerization project where students choose an existing web application from the LMS curriculum (or one of their own completed projects) and transform it into a containerized, production-ready software stack.
    
    In modern cloud and enterprise software engineering, applications are rarely deployed directly to bare-metal servers. Containerization using Docker guarantees consistency across development, staging, and production environments ("it works on my machine" is eliminated). 
    Students must write optimized multi-stage Dockerfiles, configure Docker Compose to orchestrate multi-container services (Frontend, Backend API, and Database), establish secure environment variable isolation, configure persistent named volumes, and define container healthchecks.`,
    
    objectives: [
      'Write optimized, secure, multi-stage Dockerfiles that minimize final image footprint and eliminate build dependencies',
      'Orchestrate a multi-container architecture (Frontend + Backend + Database) using docker-compose.yml',
      'Manage container data persistence across container lifecycles using Docker named volumes',
      'Configure isolated bridge networks allowing secure inter-container communication via service names',
      'Implement container healthchecks and restart policies to guarantee high-availability service booting',
    ],
    
    core_features: [
      {
        title: 'Optimized Multi-Stage Dockerfile(s)',
        description: 'Multi-stage build separating compile/build environment from runtime image, using minimal base images (e.g. node:alpine, python:slim, eclipse-temurin:alpine).',
        mandatory: true,
      },
      {
        title: 'Multi-Service Docker Compose Orchestration',
        description: 'docker-compose.yml file orchestrating at least 2 connected services (e.g. Web App + Database, or Frontend + Backend + DB).',
        mandatory: true,
      },
      {
        title: 'Persistent Storage with Named Volumes',
        description: 'Configuration of Docker named volumes ensuring database records and uploads persist across container stops, restarts, and down/up cycles.',
        mandatory: true,
      },
      {
        title: 'Environment Variable & Secret Isolation',
        description: 'Centralized environment configuration via .env and .env.example, preventing hardcoded credentials in container images.',
        mandatory: true,
      },
      {
        title: 'Comprehensive Setup & Execution Documentation',
        description: 'Step-by-step instructions in README.md enabling any evaluator to boot the entire multi-service stack with a single "docker compose up --build" command.',
        mandatory: true,
      },
    ],
    
    mvp_requirements: [
      'Valid Dockerfile(s) adhering to multi-stage optimization principles and non-root user security where applicable',
      'Working docker-compose.yml that builds and starts all required services with a single command: docker compose up --build',
      'Successful inter-service networking (e.g. Backend API connects to Database via service name, not hardcoded localhost IP)',
      'Data persistence verification: database records remain intact after running docker compose down and docker compose up',
      'Complete documentation with port mappings, prerequisites, and execution commands',
    ],
    
    optional_features: [
      'Nginx reverse proxy container configured as an API gateway with rate limiting and gzip compression',
      'Docker Compose resource limitations (CPU and memory limits) defined under deploy.resources',
      'Automated GitHub Actions CI workflow that builds, lints, and scans the Docker image for security vulnerabilities (Trivy / Docker Scout)',
      'Docker Compose production vs. development override configuration files (docker-compose.override.yml)',
    ],
    
    ui_ux_requirements: `For the Docker project, evaluation emphasizes reproducibility and clarity of operational instructions. 
    The repository must include clean container startup terminal logs, architecture diagrams illustrating container networking, and a working demo or video showing the application booting and running smoothly from a cold container start.`,
    
    testing_requirements: [
      'Clean Build Test: Execute "docker compose down -v" followed by "docker compose up --build" and verify all services start with zero crash loops',
      'Data Persistence Test: Insert data via the application, execute "docker compose restart", and verify data remains intact',
      'Docker Image Size Optimization Test: Verify final container images are optimized (<250MB for Node/Python runtimes)',
      'Security Test: Verify no secrets or .env credentials are baked into the Docker image layers (checked via docker history)',
    ],
    
    milestones: [
      { step: 1, title: 'Application Selection & Dockerfile Authoring', description: 'Select application to containerize and write multi-stage Dockerfile.' },
      { step: 2, title: 'Docker Compose & Multi-Service Setup', description: 'Create docker-compose.yml defining application, database, volumes, and networks.' },
      { step: 3, title: 'Volume Persistence & Healthchecks', description: 'Configure named volumes for persistence, test data survival, and add healthchecks.' },
      { step: 4, title: 'Documentation, Verification & Submission', description: 'Document commands in README, record demonstration evidence, and submit.' },
    ],
    
    scoring_rubric: [
      { category: 'Dockerfile Optimization & Multi-Stage Quality', max_points: 30, criteria: 'Proper multi-stage build, minimal base image selection, layer caching optimization, and clean directives.' },
      { category: 'Docker Compose Architecture & Networking', max_points: 30, criteria: 'Functional multi-container orchestration, inter-service networking by name, and clean port bindings.' },
      { category: 'Data Persistence & Volume Configuration', max_points: 20, criteria: 'Correct named volume persistence, ensuring database data survives container deletion and recreation.' },
      { category: 'Environment Isolation & Security', max_points: 10, criteria: 'Clean .env.example, no baked credentials, and non-root execution where appropriate.' },
      { category: 'Documentation & Execution Evidence', max_points: 10, criteria: 'Flawless 1-command startup instructions in README.md, architecture diagram, and demo video/evidence.' },
    ],
    
    common_mistakes: [
      'Hardcoding "localhost" inside a container when connecting to the database instead of the Docker service name (e.g. "db").',
      'Copying node_modules or virtual environments into the Docker build context without a .dockerignore file.',
      'Using massive generic base images (e.g. 1.2GB full Ubuntu) instead of lightweight Alpine or Slim images.',
      'Failing to use named volumes, causing all database records to be wiped out whenever containers restart.',
    ],
    
    deliverables_checklist: [
      'GitHub repository containing the application code, Dockerfile(s), docker-compose.yml, .dockerignore, and .env.example',
      'If publicly deployed, provide deployed URL. If hosted locally, provide clear setup instructions and video/screenshot evidence of container operation',
      'Execution log evidence showing "docker compose up" booting healthy containers',
      'Architecture diagram illustrating container networking, ports, and volume mount points',
      'README.md containing single-command startup instructions and verification steps',
    ],
  },
];

/**
 * Returns project specification for a given topicId
 */
export function getProjectByTopicId(topicId) {
  return PROJECT_CATALOG.find((p) => p.topic_id === topicId) || null;
}

/**
 * Returns project specification by project spec ID
 */
export function getProjectById(projectId) {
  return PROJECT_CATALOG.find((p) => p.id === projectId) || null;
}
