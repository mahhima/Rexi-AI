import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppShell from './pages/AppShell'
import AvatarPlayground from './pages/AvatarPlayground'
import AuthPage from './pages/AuthPage'
import ConnectRepoPage from './pages/ConnectRepoPage'
import { SessionProvider, useSession } from './hooks/useSession'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useSession()
  return loggedIn ? <>{children}</> : <Navigate to="/auth" replace />
}

function RequireRepo({ children }: { children: React.ReactNode }) {
  const { loggedIn, selectedRepo } = useSession()
  if (!loggedIn) return <Navigate to="/auth" replace />
  if (!selectedRepo) return <Navigate to="/connect-repo" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/avatar" element={<AvatarPlayground />} />
      <Route
        path="/connect-repo"
        element={<RequireAuth><ConnectRepoPage /></RequireAuth>}
      />
      <Route
        path="/app"
        element={<RequireRepo><AppShell /></RequireRepo>}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  )
}
