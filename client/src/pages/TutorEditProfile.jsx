import { useState, useEffect } from 'react'
import { getMyProfile, updateProfile } from '../services/api'

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Computer Science','Economics']
const DAYS     = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export default function TutorEditProfile() {
  const [form, setForm] = useState({ subjects: [], bio: '', hourlyRate: '', availableSlots: [] })
  const [newSlot, setNewSlot] = useState({ day: 'Monday', time: '' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) setForm({
        subjects: data.subjects || [],
        bio: data.bio || '',
        hourlyRate: data.hourlyRate || '',
        availableSlots: data.availableSlots || []
      })
    }).finally(() => setLoading(false))
  }, [])

  const toggleSubject = (s) =>
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s)
        ? f.subjects.filter(x => x !== s)
        : [...f.subjects, s]
    }))

  const addSlot = () => {
    if (!newSlot.time) return
    setForm(f => ({
      ...f,
      availableSlots: [...f.availableSlots, { ...newSlot }]
    }))
    setNewSlot({ day: 'Monday', time: '' })
  }

  const removeSlot = (i) =>
    setForm(f => ({
      ...f,
      availableSlots: f.availableSlots.filter((_, idx) => idx !== i)
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await updateProfile(form)
      setMsg('Profile saved successfully!')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div style={{
        width: 50,
        height: 50,
        border: '5px solid rgba(108,99,255,0.2)',
        borderTop: '5px solid #6c63ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>

      {/* HEADER */}
     <h1 style={{
        fontSize: 'clamp(32px,5vw,48px)',
        fontWeight: 900,
        lineHeight: 1.2,
        display: 'inline-block',
        marginBottom: 6,
        background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Edit Profile
      </h1>

      <p style={{ color: '#777', marginBottom: 20 }}>
        Your profile needs admin approval before going live
      </p>

      {msg && (
        <div style={{
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
          background: msg.includes('success')
            ? 'rgba(16,185,129,0.1)'
            : 'rgba(239,68,68,0.1)',
          color: msg.includes('success') ? '#10b981' : '#ef4444'
        }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* SUBJECTS */}
        <div style={card}>
          <h3 style={sectionTitle}>Subjects</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUBJECTS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSubject(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  cursor: 'pointer',
                  border: form.subjects.includes(s)
                    ? '1px solid #6c63ff'
                    : '1px solid #ddd',
                  background: form.subjects.includes(s)
                    ? 'rgba(108,99,255,0.15)'
                    : '#f5f5f5',
                  color: form.subjects.includes(s)
                    ? '#6c63ff'
                    : '#555'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div style={card}>
          <h3 style={sectionTitle}>Details</h3>

          <label>Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell students about yourself…"
            style={textarea}
          />

          <label>Hourly Rate (₹)</label>
          <input
            type="number"
            value={form.hourlyRate}
            onChange={e => setForm({ ...form, hourlyRate: e.target.value })}
            style={input}
          />
        </div>

        {/* SLOTS */}
        <div style={card}>
          <h3 style={sectionTitle}>Available Slots</h3>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={newSlot.day}
              onChange={e => setNewSlot({ ...newSlot, day: e.target.value })}
              style={input}
            >
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>

            <input
              placeholder="10:00 AM"
              value={newSlot.time}
              onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
              style={input}
            />

            <button type="button" onClick={addSlot} style={btnOutline}>
              + Add
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {form.availableSlots.map((slot, i) => (
              <div key={i} style={slotTag}>
                {slot.day} — {slot.time}
                <button onClick={() => removeSlot(i)} style={removeBtn}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button type="submit" style={btnPrimary}>
          Save Profile
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* 🔥 STYLES */
const card = {
  background: 'linear-gradient(145deg,#fff,#f8f9ff)',
  padding: 20,
  borderRadius: 18,
  marginBottom: 20,
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
}

const sectionTitle = {
  fontWeight: 700,
  marginBottom: 14
}

const input = {
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ddd',
  width: '100%',
  marginBottom: 12
}

const textarea = {
  ...input,
  minHeight: 80
}

const btnPrimary = {
  padding: '12px 30px',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(90deg,#6c63ff,#00c6ff)',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
}

const btnOutline = {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid #6c63ff',
  background: 'transparent',
  color: '#6c63ff',
  cursor: 'pointer'
}

const slotTag = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 10,
  background: '#f3f4ff',
  fontSize: 13
}

const removeBtn = {
  border: 'none',
  background: 'none',
  color: '#ef4444',
  cursor: 'pointer',
  fontSize: 16
}