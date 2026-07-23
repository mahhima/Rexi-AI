export const features = [
  {
    id: 'repo-understanding',
    icon: 'FiFolder',
    title: 'Repository Understanding',
    description:
      'Rexi deeply parses your entire codebase — dependencies, patterns, conventions — and builds a living mental model of your project.',
  },
  {
    id: 'ai-mentor',
    icon: 'FiUser',
    title: 'AI Mentor',
    description:
      'Learn from your own projects. Rexi explains concepts using your actual code as the learning material, tailored to your skill level.',
  },
  {
    id: 'architecture-mapping',
    icon: 'FiGrid',
    title: 'Architecture Mapping',
    description:
      'Visualise module boundaries, data flows, and service dependencies. See how your system is actually wired together.',
  },
  {
    id: 'code-review',
    icon: 'FiCheckSquare',
    title: 'Code Review',
    description:
      'Get senior-engineer-quality reviews on every PR. Rexi catches bugs, suggests improvements, and flags security concerns.',
  },
  {
    id: 'learning-mode',
    icon: 'FiBook',
    title: 'Learning Mode',
    description:
      'Onboard into any team in hours, not weeks. Rexi walks you through unfamiliar code and answers follow-up questions in context.',
  },
  {
    id: 'multi-agent',
    icon: 'FiCpu',
    title: 'Multi-Agent Workflow',
    description:
      'Orchestrate specialised agents — Architect, Reviewer, Mentor, Planner — each with deep repo context working in parallel.',
  },
  {
    id: 'tool-calling',
    icon: 'FiZap',
    title: 'Tool Calling',
    description:
      'Rexi uses tools to read files, run searches, inspect git history, and query documentation — autonomously when needed.',
  },
  {
    id: 'memory',
    icon: 'FiDatabase',
    title: 'Memory',
    description:
      'Persistent context across sessions. Rexi remembers decisions, conventions, and prior conversations about your project.',
  },
]

export const roadmapPhases = [
  {
    phase: 1,
    title: 'Foundation',
    status: 'completed' as const,
    items: [
      'Core repository parsing',
      'Chat interface',
      'File tree navigation',
      'Basic Q&A on codebases',
    ],
  },
  {
    phase: 2,
    title: 'Repository Intelligence',
    status: 'active' as const,
    items: [
      'Knowledge graph construction',
      'Dependency analysis',
      'Architecture diagrams',
      'Cross-file reasoning',
    ],
  },
  {
    phase: 3,
    title: 'AI Engineering',
    status: 'upcoming' as const,
    items: [
      'Automated code review',
      'Refactoring suggestions',
      'Test generation',
      'Security scanning',
    ],
  },
  {
    phase: 4,
    title: 'Multi-Agent',
    status: 'upcoming' as const,
    items: [
      'Parallel agent orchestration',
      'Specialised agent roles',
      'Agent handoff protocols',
      'Long-horizon task planning',
    ],
  },
  {
    phase: 5,
    title: 'Production Ready',
    status: 'upcoming' as const,
    items: [
      'Enterprise SSO',
      'Private deployment',
      'Audit logs',
      'SLA guarantees',
    ],
  },
]

export const flowSteps = [
  { id: 'repo', label: 'Repository', description: 'Your codebase', icon: 'FiGithub' },
  { id: 'parser', label: 'Parser', description: 'AST & symbol extraction', icon: 'FiCode' },
  { id: 'graph', label: 'Knowledge Graph', description: 'Semantic relationships', icon: 'FiShare2' },
  { id: 'agents', label: 'AI Agents', description: 'Specialist reasoning', icon: 'FiCpu' },
  { id: 'rexi', label: 'Rexi', description: 'Unified intelligence', icon: 'FiZap' },
  { id: 'developer', label: 'Developer', description: 'You, empowered', icon: 'FiUser' },
]
