import {
  PrismaClient,
  UserRole,
  ExperienceLevel,
  EmploymentType,
} from "@prisma/client";

const prisma = new PrismaClient();

// ─── Company Data ───────────────────────────────────────────────────

const companies = [
  {
    name: "NovaCraft Labs",
    website: "https://novacraftlabs.io",
    description:
      "A venture-backed startup building AI-powered developer tools. We're a team of 30 engineers passionate about eliminating toil from the software development lifecycle.",
  },
  {
    name: "Meridian Health",
    website: "https://meridianhealth.com",
    description:
      "Digital health platform connecting patients with providers. Series C funded, serving 2M+ users across 15 states with HIPAA-compliant telehealth and EHR integrations.",
  },
  {
    name: "Arcline Finance",
    website: "https://arcline.finance",
    description:
      "Fintech company modernizing commercial lending. Our platform processes $500M in loan originations annually using real-time risk models and automated underwriting.",
  },
  {
    name: "Voxel Studios",
    website: "https://voxelstudios.gg",
    description:
      "Indie game studio turned platform company. We build creative tools and multiplayer infrastructure used by 50K+ game developers worldwide.",
  },
  {
    name: "Canopy Logistics",
    website: "https://canopylogistics.co",
    description:
      "Supply chain visibility platform for mid-market retailers. Real-time shipment tracking, demand forecasting, and warehouse optimization powered by IoT and ML.",
  },
  {
    name: "Pollen",
    website: "https://pollen.work",
    description:
      "Remote-first company building the future of async collaboration. Our workspace app combines docs, tasks, and video — used by 10K+ distributed teams.",
  },
  {
    name: "Stratos Cloud",
    website: "https://stratos.cloud",
    description:
      "Cloud infrastructure company offering managed Kubernetes, edge computing, and serverless runtimes. Backed by top-tier VCs with $80M in funding.",
  },
  {
    name: "Kindred Robotics",
    website: "https://kindredrobotics.ai",
    description:
      "Building autonomous warehouse robots. Our fleet of 500+ robots pick, pack, and sort across 12 fulfillment centers using computer vision and reinforcement learning.",
  },
  {
    name: "Tidepool Analytics",
    website: "https://tidepoolanalytics.com",
    description:
      "Data analytics platform for e-commerce brands. We help DTC companies understand customer behavior, optimize ad spend, and predict lifetime value.",
  },
  {
    name: "Basecamp Education",
    website: "https://basecamped.io",
    description:
      "EdTech startup building interactive coding bootcamps. Our platform uses AI tutoring, pair programming, and project-based learning to train 5K+ students annually.",
  },
];

// ─── Job Listings ───────────────────────────────────────────────────

interface JobData {
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  techStack: string[];
  companyIndex: number;
}

const jobs: JobData[] = [
  // ── NovaCraft Labs (0) ──
  {
    title: "Senior Frontend Engineer",
    description:
      "Lead the frontend architecture for our AI code review tool. You'll design and implement complex React components, build real-time collaborative editing features using WebSockets, and optimize rendering performance for large codebases. Work closely with our ML team to create intuitive UIs for AI-generated suggestions. Strong TypeScript skills and experience with Next.js App Router required.",
    location: "San Francisco, CA",
    isRemote: true,
    salaryMin: 160000,
    salaryMax: 210000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "WebSocket", "Tailwind CSS"],
    companyIndex: 0,
  },
  {
    title: "Full Stack Engineer",
    description:
      "Build end-to-end features for our developer productivity platform. You'll work across the stack — React frontend with Next.js, Node.js API layer, and PostgreSQL database. Projects include building a plugin marketplace, usage analytics dashboard, and team management features. We value clean code, thorough testing, and thoughtful API design.",
    location: "San Francisco, CA",
    isRemote: true,
    salaryMin: 140000,
    salaryMax: 185000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Next.js"],
    companyIndex: 0,
  },
  {
    title: "Junior Frontend Developer",
    description:
      "Join our frontend team and help build UI components for our developer tools suite. You'll implement designs from Figma, write unit tests with Jest and React Testing Library, and learn our design system. Great opportunity to level up your React and TypeScript skills with mentorship from senior engineers. Ideal for bootcamp grads or developers with 0-2 years of experience.",
    location: "San Francisco, CA",
    isRemote: true,
    salaryMin: 90000,
    salaryMax: 120000,
    experienceLevel: ExperienceLevel.ENTRY,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Jest", "Tailwind CSS", "Git"],
    companyIndex: 0,
  },
  {
    title: "DevOps Engineer",
    description:
      "Own our CI/CD pipelines, cloud infrastructure, and deployment automation. You'll manage our AWS infrastructure using Terraform, optimize Docker container builds, set up monitoring with Datadog, and ensure 99.9% uptime for our SaaS platform. Experience with Kubernetes and GitHub Actions is a strong plus.",
    location: "San Francisco, CA",
    isRemote: true,
    salaryMin: 150000,
    salaryMax: 195000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    companyIndex: 0,
  },

  // ── Meridian Health (1) ──
  {
    title: "React Native Developer",
    description:
      "Build and maintain our patient-facing mobile app used by 2M+ users. You'll implement new features like appointment scheduling, medication reminders, and secure messaging. Work with our design team to ensure WCAG accessibility compliance and smooth animations. Experience with healthcare APIs (FHIR/HL7) is a plus but not required.",
    location: "Boston, MA",
    isRemote: false,
    salaryMin: 130000,
    salaryMax: 170000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React Native", "TypeScript", "Expo", "Redux", "Jest"],
    companyIndex: 1,
  },
  {
    title: "Backend Engineer — Platform",
    description:
      "Design and build the APIs that power our telehealth platform. You'll work with Node.js and Express to create RESTful services, integrate with third-party EHR systems, and ensure HIPAA compliance across our data layer. Strong PostgreSQL skills required — you'll optimize queries, design schemas, and manage migrations for a database serving millions of records.",
    location: "Boston, MA",
    isRemote: true,
    salaryMin: 145000,
    salaryMax: 190000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "TypeScript"],
    companyIndex: 1,
  },
  {
    title: "QA Automation Engineer",
    description:
      "Build and maintain our automated test suite for web and mobile applications. You'll write end-to-end tests with Cypress and Detox, set up visual regression testing, and integrate tests into our CI pipeline. Help us achieve 90%+ test coverage while keeping the test suite fast and reliable.",
    location: "Boston, MA",
    isRemote: true,
    salaryMin: 110000,
    salaryMax: 145000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Cypress", "Jest", "TypeScript", "Detox", "GitHub Actions"],
    companyIndex: 1,
  },
  {
    title: "Engineering Intern — Frontend",
    description:
      "12-week paid internship working on our patient portal. You'll build React components, fix bugs, participate in code reviews, and ship features used by real patients. We pair each intern with a senior mentor. Looking for CS students or bootcamp students with basic React knowledge and eagerness to learn.",
    location: "Boston, MA",
    isRemote: false,
    salaryMin: 55000,
    salaryMax: 70000,
    experienceLevel: ExperienceLevel.INTERNSHIP,
    employmentType: EmploymentType.CONTRACT,
    techStack: ["React", "JavaScript", "HTML", "CSS", "Git"],
    companyIndex: 1,
  },

  // ── Arcline Finance (2) ──
  {
    title: "Senior Full Stack Engineer",
    description:
      "Build the next generation of our commercial lending platform. You'll architect complex multi-step application workflows, integrate with banking APIs, and build real-time dashboards showing loan pipeline metrics. Our stack is Next.js on the frontend and Node.js with PostgreSQL on the backend. Experience in fintech or working with financial data is highly valued.",
    location: "New York, NY",
    isRemote: false,
    salaryMin: 170000,
    salaryMax: 220000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis"],
    companyIndex: 2,
  },
  {
    title: "Frontend Engineer",
    description:
      "Join our product team building intuitive interfaces for complex financial workflows. You'll translate Figma designs into pixel-perfect React components, implement form validation for multi-page applications, and build data visualization dashboards with charts showing loan metrics. We use Next.js with Tailwind CSS and follow atomic design principles.",
    location: "New York, NY",
    isRemote: true,
    salaryMin: 130000,
    salaryMax: 170000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "D3.js"],
    companyIndex: 2,
  },
  {
    title: "Data Engineer",
    description:
      "Build and maintain our data infrastructure powering risk models and analytics. You'll design ETL pipelines, manage our data warehouse, and work with the ML team to serve real-time feature data. Strong SQL skills required along with experience in Python and dbt. You'll work with large datasets (100M+ rows) and optimize query performance.",
    location: "New York, NY",
    isRemote: true,
    salaryMin: 150000,
    salaryMax: 195000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Python", "PostgreSQL", "dbt", "Airflow", "AWS", "SQL"],
    companyIndex: 2,
  },
  {
    title: "Security Engineer",
    description:
      "Own application security for our fintech platform. Conduct security audits, implement OWASP best practices, set up WAF rules, manage secrets rotation, and lead our SOC 2 compliance efforts. You'll also mentor engineers on secure coding practices and review PRs for security vulnerabilities.",
    location: "New York, NY",
    isRemote: true,
    salaryMin: 160000,
    salaryMax: 210000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["AWS", "Docker", "Node.js", "Python", "Terraform"],
    companyIndex: 2,
  },

  // ── Voxel Studios (3) ──
  {
    title: "Game Tools Engineer — Web",
    description:
      "Build browser-based creative tools for game developers. You'll work with React and Canvas/WebGL to create a level editor, sprite sheet manager, and animation timeline. Our tools are used by 50K+ developers so performance and UX are critical. Experience with graphics programming or game development is a plus.",
    location: "Austin, TX",
    isRemote: true,
    salaryMin: 120000,
    salaryMax: 160000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "WebGL", "Canvas", "Node.js"],
    companyIndex: 3,
  },
  {
    title: "Backend Engineer — Multiplayer Infrastructure",
    description:
      "Build and scale the real-time multiplayer infrastructure powering thousands of concurrent game sessions. You'll work with WebSockets, design matchmaking systems, implement game state synchronization, and optimize for sub-50ms latency. Our backend runs on Node.js with Redis for real-time data and PostgreSQL for persistence.",
    location: "Austin, TX",
    isRemote: true,
    salaryMin: 140000,
    salaryMax: 185000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Node.js", "TypeScript", "WebSocket", "Redis", "PostgreSQL", "Docker"],
    companyIndex: 3,
  },
  {
    title: "Junior Full Stack Developer",
    description:
      "Help build our developer platform including the marketplace, documentation site, and community forums. You'll work across React, Node.js, and PostgreSQL building CRUD features, fixing bugs, and improving existing pages. We pair junior devs with seniors and do thorough code reviews. Great place to grow your full-stack skills.",
    location: "Austin, TX",
    isRemote: true,
    salaryMin: 85000,
    salaryMax: 115000,
    experienceLevel: ExperienceLevel.ENTRY,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    companyIndex: 3,
  },
  {
    title: "Part-Time UI/UX Developer",
    description:
      "Work 20 hours per week building and maintaining our design system and component library. You'll create reusable React components, document them in Storybook, and ensure accessibility compliance. Ideal for someone who bridges design and engineering. Flexible schedule — we care about output, not hours.",
    location: "Austin, TX",
    isRemote: true,
    salaryMin: 50000,
    salaryMax: 70000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.PART_TIME,
    techStack: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Figma"],
    companyIndex: 3,
  },

  // ── Canopy Logistics (4) ──
  {
    title: "Lead Frontend Engineer",
    description:
      "Lead a team of 5 frontend engineers building our supply chain visibility dashboard. You'll set technical direction, conduct architecture reviews, mentor junior developers, and still write code 60% of the time. Our frontend is a complex data-heavy application with real-time updates, interactive maps, and advanced filtering. Experience leading a team and making build-vs-buy decisions is essential.",
    location: "Chicago, IL",
    isRemote: false,
    salaryMin: 180000,
    salaryMax: 230000,
    experienceLevel: ExperienceLevel.LEAD,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "GraphQL", "Mapbox", "D3.js"],
    companyIndex: 4,
  },
  {
    title: "Full Stack Engineer — IoT Platform",
    description:
      "Build the web platform that ingests and visualizes data from thousands of IoT sensors across our logistics network. You'll create REST APIs, build real-time dashboards, and work with time-series data. Our stack is Next.js, Node.js, PostgreSQL (with TimescaleDB extension), and Redis. Experience with streaming data or IoT protocols (MQTT) is a bonus.",
    location: "Chicago, IL",
    isRemote: true,
    salaryMin: 135000,
    salaryMax: 175000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Next.js"],
    companyIndex: 4,
  },
  {
    title: "Frontend Developer",
    description:
      "Build customer-facing features for our logistics platform. You'll implement interactive shipment tracking maps, build filterable data tables handling 10K+ rows, and create responsive layouts that work on desktop and tablet. We use React with Next.js and Tailwind CSS. Good eye for detail and experience with data-heavy UIs preferred.",
    location: "Chicago, IL",
    isRemote: true,
    salaryMin: 110000,
    salaryMax: 145000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Mapbox"],
    companyIndex: 4,
  },
  {
    title: "Contract Backend Developer",
    description:
      "6-month contract to help us migrate from a monolithic Express API to a microservices architecture. You'll decompose existing endpoints, set up service-to-service communication, implement API gateway patterns, and write migration scripts. Strong Node.js and PostgreSQL experience required. Potential to convert to full-time.",
    location: "Chicago, IL",
    isRemote: true,
    salaryMin: 80,
    salaryMax: 110,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.CONTRACT,
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Express"],
    companyIndex: 4,
  },

  // ── Pollen (5) ──
  {
    title: "Senior Frontend Engineer — Editor",
    description:
      "Own the rich text editor at the heart of our async collaboration platform. You'll work with ProseMirror/TipTap to build a block-based editor supporting tables, code blocks, embeds, and real-time collaboration via CRDTs. This is a deep technical role — you'll need strong experience with contenteditable, DOM manipulation, and state management at scale.",
    location: "Remote",
    isRemote: true,
    salaryMin: 165000,
    salaryMax: 215000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "ProseMirror", "WebSocket", "Node.js"],
    companyIndex: 5,
  },
  {
    title: "Full Stack Engineer — Video",
    description:
      "Build the video features in our collaboration platform. You'll integrate WebRTC for real-time video, implement recording and playback with transcription, and build the UI for async video messages. Full-stack role working with React, Node.js, and various media APIs. Experience with video/audio streaming is preferred but we'll teach the right candidate.",
    location: "Remote",
    isRemote: true,
    salaryMin: 145000,
    salaryMax: 190000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "WebRTC", "PostgreSQL", "AWS"],
    companyIndex: 5,
  },
  {
    title: "Frontend Engineer — Design System",
    description:
      "Build and maintain Pollen's design system used across all our products. You'll create accessible, performant React components, document them in Storybook, write visual regression tests, and support other teams in adoption. You'll work closely with our design team to translate design tokens into code. Strong CSS skills and accessibility knowledge required.",
    location: "Remote",
    isRemote: true,
    salaryMin: 130000,
    salaryMax: 170000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Jest", "Chromatic"],
    companyIndex: 5,
  },
  {
    title: "Junior Backend Developer",
    description:
      "Join our platform team building the APIs and services that power Pollen. You'll write Node.js services, design database schemas, implement background jobs, and learn about distributed systems. We invest heavily in mentorship — weekly 1:1s, code review feedback, and learning time. Looking for developers with some Node.js or Python experience and strong fundamentals.",
    location: "Remote",
    isRemote: true,
    salaryMin: 95000,
    salaryMax: 125000,
    experienceLevel: ExperienceLevel.ENTRY,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    companyIndex: 5,
  },
  {
    title: "Freelance Technical Writer",
    description:
      "Write developer documentation, API guides, and tutorials for our platform SDK. You'll work with our engineering team to understand new features and create clear, accurate documentation. Need strong technical writing skills and ability to read JavaScript/TypeScript code. 15-20 hours per week, flexible schedule.",
    location: "Remote",
    isRemote: true,
    salaryMin: 60,
    salaryMax: 90,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FREELANCE,
    techStack: ["JavaScript", "TypeScript", "Markdown", "Git"],
    companyIndex: 5,
  },

  // ── Stratos Cloud (6) ──
  {
    title: "Senior Platform Engineer",
    description:
      "Build the control plane for our managed Kubernetes offering. You'll design APIs for cluster provisioning, implement auto-scaling logic, build health monitoring systems, and work on our custom scheduler. Deep Kubernetes knowledge required along with strong Go or Node.js skills. You'll work on systems handling 10K+ clusters.",
    location: "Seattle, WA",
    isRemote: true,
    salaryMin: 175000,
    salaryMax: 230000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Kubernetes", "Go", "TypeScript", "PostgreSQL", "AWS", "Terraform"],
    companyIndex: 6,
  },
  {
    title: "Full Stack Engineer — Dashboard",
    description:
      "Build the web console that our customers use to manage their cloud infrastructure. You'll create complex UI for cluster management, deploy pipelines, log viewers, and billing dashboards. Our frontend is React with Next.js, talking to Go and Node.js APIs. This is a high-impact role — every Stratos customer interacts with what you build.",
    location: "Seattle, WA",
    isRemote: true,
    salaryMin: 150000,
    salaryMax: 195000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "Tailwind CSS"],
    companyIndex: 6,
  },
  {
    title: "Frontend Engineer — Edge",
    description:
      "Build the UI for our edge computing platform. You'll create tools for deploying functions to edge nodes, visualize global traffic routing, and build real-time monitoring dashboards. Our edge product is newer so you'll have significant influence on technical decisions and product direction. React and TypeScript required, interest in networking/CDN concepts is a plus.",
    location: "Seattle, WA",
    isRemote: true,
    salaryMin: 140000,
    salaryMax: 180000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "D3.js", "WebSocket"],
    companyIndex: 6,
  },
  {
    title: "Developer Advocate",
    description:
      "Be the bridge between Stratos and the developer community. You'll write technical blog posts, create sample apps and tutorials, speak at conferences, engage on social media, and gather feedback from developers to improve our products. Need strong coding skills (you'll write real code), excellent writing, and comfort presenting to audiences.",
    location: "Seattle, WA",
    isRemote: true,
    salaryMin: 130000,
    salaryMax: 175000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["TypeScript", "React", "Node.js", "Docker", "Kubernetes"],
    companyIndex: 6,
  },

  // ── Kindred Robotics (7) ──
  {
    title: "Full Stack Engineer — Fleet Management",
    description:
      "Build the web application that warehouse operators use to manage our robot fleet. You'll create real-time dashboards showing robot positions on warehouse maps, implement task assignment workflows, and build analytics for fleet performance. React frontend with a Node.js/Express API and PostgreSQL database. WebSocket experience is important for real-time updates.",
    location: "Denver, CO",
    isRemote: false,
    salaryMin: 140000,
    salaryMax: 180000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "WebSocket", "Redis"],
    companyIndex: 7,
  },
  {
    title: "Senior Backend Engineer — API",
    description:
      "Design and maintain the API layer between our robots and cloud services. You'll handle high-throughput event streams from 500+ robots, implement command queuing, build fault-tolerant message processing, and ensure sub-second response times for critical robot commands. Node.js with TypeScript, PostgreSQL, and Redis. Experience with message queues (RabbitMQ/Kafka) is essential.",
    location: "Denver, CO",
    isRemote: false,
    salaryMin: 155000,
    salaryMax: 200000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "RabbitMQ", "Docker"],
    companyIndex: 7,
  },
  {
    title: "Frontend Developer — Monitoring",
    description:
      "Build monitoring and observability dashboards for our robot fleet. You'll create real-time charts, heat maps, alerting interfaces, and incident timelines. Heavy data visualization work using React with D3.js or Recharts. Must be comfortable handling streaming data and rendering frequent UI updates without jank.",
    location: "Denver, CO",
    isRemote: true,
    salaryMin: 120000,
    salaryMax: 155000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "D3.js", "Recharts", "Tailwind CSS", "WebSocket"],
    companyIndex: 7,
  },
  {
    title: "Entry-Level Software Engineer",
    description:
      "Join our engineering team and work across multiple projects including our internal tools, customer portal, and data pipelines. You'll get exposure to the full stack — React, Node.js, PostgreSQL, and Python. We have a structured onboarding program and believe in growing engineers through challenging projects with strong support.",
    location: "Denver, CO",
    isRemote: false,
    salaryMin: 85000,
    salaryMax: 110000,
    experienceLevel: ExperienceLevel.ENTRY,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL"],
    companyIndex: 7,
  },

  // ── Tidepool Analytics (8) ──
  {
    title: "Full Stack Engineer — Dashboards",
    description:
      "Build the analytics dashboards that e-commerce brands use to understand their customers. You'll create interactive charts, cohort analysis tools, funnel visualizations, and attribution models. Our stack is Next.js, Node.js, and PostgreSQL with heavy use of materialized views and CTEs for analytics queries. SQL skills are as important as React skills for this role.",
    location: "Portland, OR",
    isRemote: true,
    salaryMin: 135000,
    salaryMax: 175000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Recharts"],
    companyIndex: 8,
  },
  {
    title: "Backend Engineer — Data Pipeline",
    description:
      "Build and optimize the data pipelines that process millions of e-commerce events daily. You'll work with Node.js and Python to build ETL jobs, optimize PostgreSQL queries on large datasets, manage data warehouse schemas, and build APIs for our analytics engine. Experience with event streaming and data warehousing patterns is important.",
    location: "Portland, OR",
    isRemote: true,
    salaryMin: 140000,
    salaryMax: 185000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker"],
    companyIndex: 8,
  },
  {
    title: "Senior Frontend Engineer",
    description:
      "Lead frontend development for our analytics platform. You'll architect complex data visualization components, build performant table renderers for million-row datasets, and create intuitive drag-and-drop report builders. Deep React expertise required along with experience building data-heavy applications. You'll also set frontend standards and mentor junior engineers.",
    location: "Portland, OR",
    isRemote: true,
    salaryMin: 160000,
    salaryMax: 205000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "D3.js", "Tailwind CSS", "Jest"],
    companyIndex: 8,
  },
  {
    title: "Freelance Frontend Developer",
    description:
      "Help us build a new customer-facing marketing site and interactive product demos. 3-month engagement, 30-40 hours per week. You'll implement responsive pages from designs, add scroll animations, and build interactive demos of our analytics features. Next.js with Tailwind CSS. Must be self-directed and able to work async.",
    location: "Remote",
    isRemote: true,
    salaryMin: 75,
    salaryMax: 110,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FREELANCE,
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    companyIndex: 8,
  },

  // ── Basecamp Education (9) ──
  {
    title: "Full Stack Engineer — Learning Platform",
    description:
      "Build the platform where students learn to code. You'll create interactive coding exercises with a browser-based IDE, implement progress tracking, build the curriculum management system, and integrate AI tutoring features. Our stack is Next.js, Node.js, PostgreSQL, and Redis. You'll directly impact the learning experience of thousands of students.",
    location: "Remote",
    isRemote: true,
    salaryMin: 125000,
    salaryMax: 165000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Redis"],
    companyIndex: 9,
  },
  {
    title: "Frontend Engineer — IDE",
    description:
      "Build our browser-based code editor and execution environment. You'll integrate Monaco Editor, implement syntax highlighting for multiple languages, build a file tree navigator, and create split-pane layouts for code and preview. Performance is critical — the editor needs to feel snappy with large files. TypeScript mastery and experience with code editors or developer tools is preferred.",
    location: "Remote",
    isRemote: true,
    salaryMin: 140000,
    salaryMax: 180000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Monaco Editor", "WebSocket", "Tailwind CSS"],
    companyIndex: 9,
  },
  {
    title: "Backend Engineer — AI Tutoring",
    description:
      "Build the backend for our AI tutoring system. You'll integrate LLM APIs, design prompt templates for different programming concepts, implement conversation memory, and build guardrails to keep tutoring on-topic. Node.js with TypeScript, PostgreSQL for conversation history, and Redis for session state. Experience with LLM APIs (OpenAI, Anthropic) is a strong plus.",
    location: "Remote",
    isRemote: true,
    salaryMin: 145000,
    salaryMax: 190000,
    experienceLevel: ExperienceLevel.SENIOR,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Python", "OpenAI API"],
    companyIndex: 9,
  },
  {
    title: "Junior Developer — Content Tools",
    description:
      "Help build the internal tools our curriculum team uses to create coding exercises and lessons. You'll build forms, markdown editors, test case runners, and content preview features. React with TypeScript on the frontend, Node.js API on the backend. Great role for someone who wants to grow their full-stack skills in a supportive environment.",
    location: "Remote",
    isRemote: true,
    salaryMin: 80000,
    salaryMax: 105000,
    experienceLevel: ExperienceLevel.ENTRY,
    employmentType: EmploymentType.FULL_TIME,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    companyIndex: 9,
  },
  {
    title: "Part-Time Curriculum Developer",
    description:
      "Create coding exercises, projects, and tutorials for our React and Node.js bootcamp tracks. You'll write lesson content in Markdown, build starter code repositories, create automated test suites for exercises, and record short video explanations. 20 hours per week. Must have teaching experience or strong technical writing skills.",
    location: "Remote",
    isRemote: true,
    salaryMin: 45000,
    salaryMax: 65000,
    experienceLevel: ExperienceLevel.MID,
    employmentType: EmploymentType.PART_TIME,
    techStack: ["React", "Node.js", "TypeScript", "JavaScript", "Git", "Markdown"],
    companyIndex: 9,
  },
];

// ─── Seed Function ──────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // Clear existing data
  console.log("  Clearing existing data...");
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create employer users (one per company)
  console.log("  Creating employer users...");
  const employerUsers = await Promise.all(
    companies.map((company, i) =>
      prisma.user.create({
        data: {
          name: `${company.name} Admin`,
          email: `admin@${company.website.replace("https://", "")}`,
          role: UserRole.EMPLOYER,
        },
      })
    )
  );

  // Create companies
  console.log("  Creating companies...");
  const createdCompanies = await Promise.all(
    companies.map((company, i) =>
      prisma.company.create({
        data: {
          name: company.name,
          website: company.website,
          description: company.description,
          ownerId: employerUsers[i].id,
        },
      })
    )
  );

  // Create jobs
  console.log(`  Creating ${jobs.length} job listings...`);
  const createdJobs = await Promise.all(
    jobs.map((job) =>
      prisma.job.create({
        data: {
          title: job.title,
          description: job.description,
          location: job.location,
          isRemote: job.isRemote,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          experienceLevel: job.experienceLevel,
          employmentType: job.employmentType,
          techStack: job.techStack,
          companyId: createdCompanies[job.companyIndex].id,
        },
      })
    )
  );

  // Create a few demo job seeker users
  console.log("  Creating demo job seekers...");
  await prisma.user.createMany({
    data: [
      { name: "Alex Chen", email: "alex@example.com", role: UserRole.JOB_SEEKER },
      { name: "Sam Rivera", email: "sam@example.com", role: UserRole.JOB_SEEKER },
      { name: "Jordan Park", email: "jordan@example.com", role: UserRole.JOB_SEEKER },
    ],
  });

  console.log(`\n✅ Seed complete!`);
  console.log(`   ${employerUsers.length} employer users`);
  console.log(`   ${createdCompanies.length} companies`);
  console.log(`   ${createdJobs.length} jobs`);
  console.log(`   3 demo job seekers`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
