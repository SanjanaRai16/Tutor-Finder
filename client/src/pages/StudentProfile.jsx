import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateStudentProfile } from '../services/api'

export default function StudentProfile() {
  const { user, loginUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('')
    try {
      const { data } = await updateStudentProfile(form)
      loginUser({ ...user, name: data.name })
      setMsg('Profile updated!')
    } catch (err) { setMsg(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <h1 className="page-title fade-up" style={{
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(32px,5vw,48px)',
    fontWeight: 900,
    marginBottom: 8,
    lineHeight: 1.2, // ✅ FIX
    display: 'inline-block', // ✅ FIX
    background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>My Profile</h1>
      <p className="page-sub fade-up-2">Update your personal information</p>
      {msg && <div className={`alert ${msg.includes('updated') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
      <div className="card fade-up">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input className="form-input" value={user?.role} disabled style={{ opacity: 0.5 }} />
          </div>
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  )
}