export type FileNode = {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  lang?: string
}

export const mockFileTree: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'src-auth',
        name: 'auth',
        type: 'folder',
        children: [
          { id: 'jwt', name: 'jwt.ts', type: 'file', lang: 'ts' },
          { id: 'password', name: 'password.ts', type: 'file', lang: 'ts' },
          { id: 'oauth', name: 'oauth.ts', type: 'file', lang: 'ts' },
        ],
      },
      {
        id: 'src-routes',
        name: 'routes',
        type: 'folder',
        children: [
          { id: 'route-auth', name: 'auth.ts', type: 'file', lang: 'ts' },
          { id: 'route-users', name: 'users.ts', type: 'file', lang: 'ts' },
          { id: 'route-health', name: 'health.ts', type: 'file', lang: 'ts' },
        ],
      },
      {
        id: 'src-middleware',
        name: 'middleware',
        type: 'folder',
        children: [
          { id: 'guard', name: 'guard.ts', type: 'file', lang: 'ts' },
          { id: 'ratelimit', name: 'rateLimit.ts', type: 'file', lang: 'ts' },
          { id: 'logger', name: 'logger.ts', type: 'file', lang: 'ts' },
        ],
      },
      {
        id: 'src-session',
        name: 'session',
        type: 'folder',
        children: [
          { id: 'store', name: 'store.ts', type: 'file', lang: 'ts' },
          { id: 'refresh', name: 'refresh.ts', type: 'file', lang: 'ts' },
        ],
      },
      {
        id: 'src-db',
        name: 'db',
        type: 'folder',
        children: [
          { id: 'client', name: 'client.ts', type: 'file', lang: 'ts' },
          { id: 'migrations', name: 'migrations', type: 'folder', children: [
            { id: 'mig-001', name: '001_init.sql', type: 'file', lang: 'sql' },
            { id: 'mig-002', name: '002_sessions.sql', type: 'file', lang: 'sql' },
          ]},
        ],
      },
      { id: 'index', name: 'index.ts', type: 'file', lang: 'ts' },
      { id: 'config', name: 'config.ts', type: 'file', lang: 'ts' },
    ],
  },
  {
    id: 'tests',
    name: 'tests',
    type: 'folder',
    children: [
      { id: 'test-jwt', name: 'jwt.test.ts', type: 'file', lang: 'ts' },
      { id: 'test-auth', name: 'auth.test.ts', type: 'file', lang: 'ts' },
      { id: 'test-guard', name: 'guard.test.ts', type: 'file', lang: 'ts' },
    ],
  },
  { id: 'pkgjson', name: 'package.json', type: 'file', lang: 'json' },
  { id: 'tsconfig', name: 'tsconfig.json', type: 'file', lang: 'json' },
  { id: 'dockerfile', name: 'Dockerfile', type: 'file', lang: 'docker' },
]

export type MockRepo = {
  id: string
  name: string
  lang: string
  status: 'indexed' | 'indexing' | 'not-connected'
  files: number
  description: string
  updatedAt: string
}

export const mockRepos: MockRepo[] = [
  { id: 'auth-service', name: 'auth-service', lang: 'TypeScript', status: 'indexed', files: 2847, description: 'JWT + OAuth2 auth microservice with session management', updatedAt: '2 hours ago' },
  { id: 'api-gateway', name: 'api-gateway', lang: 'Go', status: 'indexed', files: 1203, description: 'Central API gateway with rate limiting and routing', updatedAt: '1 day ago' },
  { id: 'web-client', name: 'web-client', lang: 'React', status: 'indexing', files: 4512, description: 'Main customer-facing React SPA', updatedAt: '3 days ago' },
  { id: 'ml-pipeline', name: 'ml-pipeline', lang: 'Python', status: 'not-connected', files: 0, description: 'Data ingestion and model training pipeline', updatedAt: '1 week ago' },
]
