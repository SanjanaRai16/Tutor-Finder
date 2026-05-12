import { useState, useEffect } from 'react'
import { getMyBookings, createProgressNote } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function AddProgressNote() {
  const [bookings, setBookings] = useState([])
  const [form, setForm] = useState({
    bookingId: '', studentId: '', subject: '',
    topicsCovered: '', performance: 5, homework: '', notes: ''
  })
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getMyBookings().then(({ data }) => {
      const confirmed = data.filter(b => b.status === 'confirmed')
      setBookings(confirmed)
    })
  }, [])

  const handleBookingSelect = (e) => {
    const booking = bookings.find(b => b._id === e.target.value)
    if (booking) {
      setForm(f => ({
        ...f,
        bookingId: booking._id,
        studentId: booking.student?._id,
        subject: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('')
    try {
      await createProgressNote(form)
      setMsg('Progress note added!')
      setTimeout(() => navigate('/tutor/dashboard'), 1500)
    } catch (err) { setMsg(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="page" style={{ maxWidth: 680 }} >
      <h1 className="page-title fade-up"style={{
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(32px,5vw,48px)',
    fontWeight: 900,
    marginBottom: 8,
    lineHeight: 1.2, // ✅ FIX
    display: 'inline-block', // ✅ FIX
    background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>Add Progress Note</h1>
      <p className="page-sub fade-up-2">Fill in after a completed session</p>
      {msg && <div className={`alert ${msg.includes('added') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card fade-up" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 16 }}>Session Details</h3>
          <div className="form-group">
            <label className="form-label">Select Booking</label>
            <select className="form-select" value={form.bookingId} onChange={handleBookingSelect} required>
              <option value="">Choose a confirmed booking…</option>
              {bookings.map(b => (
                <option key={b._id} value={b._id}>
                  {b.student?.name} — {b.slot?.day} {b.slot?.time} {b.isTrial ? '(Trial)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Mathematics" required />
          </div>
        </div>

        <div className="card fade-up-2" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 16 }}>Session Report</h3>
          <div className="form-group">
            <label className="form-label">Topics Covered</label>
            <textarea className="form-textarea" value={form.topicsCovered}
              onChange={e => setForm({ ...form, topicsCovered: e.target.value })}
              placeholder="e.g. Quadratic equations, completing the square…" required />
          </div>
          <div className="form-group">
            <label className="form-label">Student Performance</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(f => ({ ...f, performance: n }))}
                  style={{
                    width: 44, height: 44, borderRadius: 10,
                    border: `1px solid ${form.performance >= n ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.performance >= n ? 'rgba(108,99,255,.15)' : 'var(--bg3)',
                    color: form.performance >= n ? 'var(--accent)' : 'var(--muted)',
                    cursor: 'pointer', fontSize: 16, fontWeight: 700
                  }}>{n}</button>
              ))}
              <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--muted)', marginLeft: 8 }}>
                {['','Needs Work','Below Average','Average','Good','Excellent'][form.performance]}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Homework Assigned</label>
            <textarea className="form-textarea" value={form.homework}
              onChange={e => setForm({ ...form, homework: e.target.value })}
              placeholder="e.g. Practice problems 1–20 from chapter 5…"
              style={{ minHeight: 80 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea className="form-textarea" value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Any observations about the student's progress…"
              style={{ minHeight: 80 }} />
          </div>
        </div>

        <button className="btn btn-primary fade-up-3" style={{ padding: '12px 32px' }} type="submit">
          Save Progress Note
        </button>
      </form>
    </div>
  )
}