import { C } from "./theme";

export const PROJECTS = [
  {
    id: "neural_dash",
    name: "NEURAL_DASH",
    desc: "A high-performance visualization engine for neural network training cycles. Real-time telemetry processed via WebWorkers.",
    tags: ["REACT", "WEBGL", "D3JS"],
    status: "LIVE SYSTEM",
    statusColor: C.tertiary,
    size: "large",
    hasImage: true,
    links: ["LIVE_DEMO", "SOURCE"],
  },
  {
    id: "synapse_os",
    name: "SYNAPSE_OS",
    desc: "Micro-kernel architecture experiment focusing on memory safety and asynchronous task scheduling.",
    tags: ["RUST", "X86_64", "WASM"],
    status: null,
    size: "medium",
    links: ["VIEW_REPO"],
  },
  {
    id: "kv_core",
    name: "KV_CORE",
    desc: "A distributed key-value store with eventual consistency and high-availability clusters.",
    tags: ["GO", "GRPC", "DOCKER"],
    status: null,
    size: "medium",
    links: ["VIEW_REPO"],
  },
  {
    id: "crypto_vault",
    name: "CRYPTO_VAULT",
    desc: "End-to-end encrypted storage solution utilizing AES-256-GCM. Designed for security-first environments where zero-knowledge architecture is mandatory.",
    tags: [],
    status: null,
    size: "large",
    metrics: [
      { key: "STATUS", value: "STABLE_PRODUCTION", color: C.tertiary },
      { key: "COVERAGE", value: "98.4%_UNIT_TESTS", color: C.onSurfaceVariant },
      { key: "LICENSE", value: "MIT_OPEN_SOURCE", color: C.onSurfaceVariant },
    ],
    links: [],
  },
];

export const FILTER_TABS = ["ALL_FILES", "TYPESCRIPT", "RUST", "SYSTEM_CORE"];

export const SKILL_CATEGORIES = [
  {
    title: "Frontend Development",
    icon: "layers",
    skills: [
      { name: "React / Next.js", pct: 95 },
      { name: "Tailwind CSS / SCSS", pct: 90 },
      { name: "TypeScript", pct: 92 },
    ],
  },
  {
    title: "Backend Systems",
    icon: "storage",
    skills: [
      { name: "Node.js / Express", pct: 88 },
      { name: "PostgreSQL / Redis", pct: 85 },
      { name: "GraphQL / REST", pct: 94 },
    ],
  },
  {
    title: "Operations & Tools",
    icon: "terminal",
    skills: [
      { name: "AWS / Google Cloud", pct: 82 },
      { name: "Docker / Kubernetes", pct: 78 },
      { name: "CI/CD / GitOps", pct: 90 },
    ],
  },
];

export const SPECIALIZED = [
  { icon: "javascript", label: "JavaScript" },
  { icon: "cloud", label: "Serverless" },
  { icon: "lock", label: "Auth/IAM" },
  { icon: "monitoring", label: "Observability" },
  { icon: "auto_awesome", label: "Generative AI" },
  { icon: "grid_view", label: "Microservices" },
];

export const TERMINAL_LINES = [
  { prompt: true, text: "list --workflow" },
  { prompt: false, text: "1. Requirements gathering & Analysis" },
  { prompt: false, text: "2. Architectural Blueprint & POC" },
  { prompt: false, text: "3. Scalable Implementation (TDD approach)" },
  { prompt: false, text: "4. Security Audit & Load Testing" },
  { prompt: false, text: "5. CI/CD Orchestration & Monitoring" },
  { prompt: false, text: "", status: "STATUS: READY_FOR_DEPLOYMENT" },
];
