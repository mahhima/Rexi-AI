import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppShell from './pages/AppShell'
import AvatarPlayground from './pages/AvatarPlayground'
import AuthPage from './pages/AuthPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import ConnectRepoPage from './pages/ConnectRepoPage'
import { SessionProvider, useSession } from './hooks/useSession'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useSession()
  return loggedIn ? <>{children}</> : <Navigate to="/auth" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/avatar" element={<AvatarPlayground />} />
      <Route
        path="/connect-repo"
        element={<RequireAuth><ConnectRepoPage /></RequireAuth>}
      />
      <Route
        path="/app"
        element={<RequireAuth><AppShell /></RequireAuth>}
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
