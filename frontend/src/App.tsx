import { useState, useEffect } from 'react'
import { apiService } from './services/api'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import './App.css'
import './styles/Auth.css'

function AppContent() {
  const { user, isAuthenticated, loading, login } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [healthStatus, setHealthStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated) {
      checkBackendHealth()
    }
  }, [isAuthenticated])

  const checkBackendHealth = async () => {
    try {
      const health = await apiService.checkHealth()
      setHealthStatus(`Backend is healthy! (${health.timestamp})`)
    } catch (err) {
      setError('Backend connection failed')
      console.error('Health check failed:', err)
    }
  }

  const handleAuthSuccess = (userData: any) => {
    console.log('App: handleAuthSuccess called with:', userData)
    login(userData)
  }

  const handleModeChange = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setError('')
  }

  if (loading) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    )
  }

  console.log('App render - isAuthenticated:', isAuthenticated, 'user:', user)

  if (isAuthenticated && user) {
    console.log('Rendering Dashboard')
    return <Dashboard />
  }

  return (
    <div className="app-container">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Agile Platform</h1>
          <p>Project Management System</p>
        </div>

        {healthStatus && (
          <div className="health-status success">
            {healthStatus}
          </div>
        )}

        {error && (
          <div className="health-status error">
            {error}
          </div>
        )}

        <div className="auth-form-container">
          <div className="auth-toggle">
            <button
              className={`toggle-button ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              className={`toggle-button ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          <AuthForm
            mode={authMode}
            onAuthSuccess={handleAuthSuccess}
            onModeChange={handleModeChange}
          />
        </div>

        <div className="api-info">
          <h3>System Status</h3>
          <ul>
            <li>Frontend: React + TypeScript</li>
            <li>Backend: Node.js + Express</li>
            <li>Database: PostgreSQL</li>
            <li>Cache: Redis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
