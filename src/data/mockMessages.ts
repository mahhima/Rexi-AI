export type Persona = 'Architect' | 'Mentor' | 'Debugger'

export interface ChatMessage {
  id: string
  role: 'user' | 'rexi'
  content: string
  persona?: Persona
  timestamp: string
  codeBlock?: { lang: string; code: string }
  tags?: string[]
}

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you give me a high-level overview of the auth-service architecture?',
    timestamp: '10:41 AM',
  },
  {
    id: '2',
    role: 'rexi',
    persona: 'Architect',
    content:
      'The **auth-service** is a stateless JWT microservice. It owns three bounded contexts:\n\n- **Identity** — user registration, credentials, profile\n- **Session** — token issuance, refresh rotation, revocation\n- **AuthZ** — role & permission evaluation\n\nAll three expose REST handlers in `src/routes/` and share a single Postgres instance via `src/db/client.ts`. Redis is used exclusively for the refresh-token registry to get sub-millisecond revocation checks.',
    timestamp: '10:41 AM',
    tags: ['Architecture', 'Overview'],
  },
  {
    id: '3',
    role: 'user',
    content: 'Show me how the JWT token is generated.',
    timestamp: '10:42 AM',
  },
  {
    id: '4',
    role: 'rexi',
    persona: 'Architect',
    content: 'Token generation lives in `src/auth/jwt.ts`. It uses RS256 — the private key is loaded once at startup from an env variable and kept in module scope to avoid repeated disk reads.',
    timestamp: '10:42 AM',
    codeBlock: {
      lang: 'typescript',
      code: `// src/auth/jwt.ts
import jwt from 'jsonwebtoken'

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!
const PUBLIC_KEY  = process.env.JWT_PUBLIC_KEY!

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '15m',
    issuer: 'auth-service',
  })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ['RS256'],
    issuer: 'auth-service',
  }) as TokenPayload
}`,
    },
    tags: ['jwt.ts', 'RS256'],
  },
  {
    id: '5',
    role: 'user',
    content: 'Why RS256 and not HS256?',
    timestamp: '10:43 AM',
  },
  {
    id: '6',
    role: 'rexi',
    persona: 'Mentor',
    content:
      'Great question. **HS256** uses a single shared secret — every service that needs to verify tokens must have that secret, which widens the blast radius if it leaks.\n\n**RS256** uses asymmetric keys: auth-service holds the private key and signs tokens; all other services only get the public key to verify. A compromised downstream service cannot forge tokens. This is the standard choice for microservice architectures.',
    timestamp: '10:43 AM',
    tags: ['Security', 'Cryptography'],
  },
]
