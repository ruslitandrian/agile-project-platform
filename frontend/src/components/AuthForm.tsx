import { useState } from 'react'
import { apiService, type LoginRequest, type RegisterRequest, type AuthResponse } from '../services/api'
import '../styles/Auth.css'

interface AuthFormProps {
  mode: 'login' | 'register'
  onAuthSuccess: (user: any) => void
  onModeChange: (mode: 'login' | 'register') => void
}

export default function AuthForm({ mode, onAuthSuccess, onModeChange }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result: AuthResponse
      if (mode === 'register') {
        if (!formData.name.trim()) {
          setError('Name is required for registration')
          setLoading(false)
          return
        }
        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          name: formData.name
        }
        result = await apiService.register(registerData)
        
        // Show success message and switch to login mode
        setSuccess('Registration successful! Please login with your new account.')
        setTimeout(() => {
          onModeChange('login')
          // Clear form data for login
          setFormData({
            email: formData.email, // Keep email for convenience
            password: '',
            name: ''
          })
        }, 2000)
      } else {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password
        }
        result = await apiService.login(loginData)

        // Show success message before redirect
        setSuccess('Login successful! Redirecting to dashboard...')
        console.log('Login successful, storing tokens:', result)
        
        // Store tokens
        localStorage.setItem('token', result.accessToken)
        localStorage.setItem('refreshToken', result.refreshToken)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        console.log('Tokens stored, calling onAuthSuccess')
        
        // Delay for success message display
        setTimeout(() => {
          console.log('Calling onAuthSuccess with user:', result.user)
          onAuthSuccess(result.user)
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-form">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      
      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={mode === 'register'}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
    </div>
  )
}
