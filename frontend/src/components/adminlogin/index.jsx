import { useState } from 'react'
import './index.css'

export default function AdminLogin({ onLogin, navigate }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))
    if (password === 'admin123') {
      onLogin()
    } else {
      setError('Wrong password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-icon">👨‍🍳</div>
        <h1 className="login-title">Staff Login</h1>
        <p className="login-sub">Enter your staff password to continue</p>

        <div className="login-form">
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Login'}
          </button>

          <button className="login-back" onClick={() => navigate('menu')}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}