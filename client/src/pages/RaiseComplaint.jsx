import { useState } from 'react'
import { createComplaint } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function RaiseComplaint() {
  const [form, setForm] = useState({ subject: '', message: '', against: '' })
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('')
    try {
      await createComplaint(form)
      setMsg('Complaint submitted successfully!')
      setTimeout(() => navigate(-1), 1500)
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
  }}>Raise a Complaint</h1>
      <p className="page-sub fade-up-2">Report an issue to the admin</p>
      {msg && <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
      <div className="card fade-up">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Brief title of your complaint" required />
          </div>
          <div className="form-group">
            <label className="form-label">Against (User ID — optional)</label>
            <input className="form-input" value={form.against} onChange={e => setForm({ ...form, against: e.target.value })}
              placeholder="Leave blank if general complaint" />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-textarea" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your issue in detail…" required style={{ minHeight: 140 }} />
          </div>
          <button className="btn btn-primary" type="submit">Submit Complaint</button>
        </form>
      </div>
    </div>
  )
}