
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await login(form)
      loginUser(data)
      if (data.role === 'admin') navigate('/admin')
      else if (data.role === 'tutor') navigate('/tutor/dashboard')
      else navigate('/tutors')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 28, marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Sign in to your account</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>{loading ? 'Signing in…' : 'Sign in →'}</button>
        </form>
        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>No account? <Link to="/register" style={{ color: 'var(--accent)' }}>Sign up</Link></p>
      </div>
    </div>
  )
}
